/**
 * SilkCarousel - jquery Plugin
 * Emmanuel Chappat m4nu.co
 *
*/

(function( $, window, document, undefined ){

	var silkCarousel = {
		defaults : {
				type                : 'normal', // normal, fluid, responsive
				size                : 500,
				easingMethod        : "normal",
				tansitionSpeed      : 500,
				rightBtnId          : 'rightBtn',
				leftBtnId           : 'leftBtn',
				switchDelay         : 2000,
				previousNextButtons : false,
				navigationStyle     : 'thumbnails'
			},

			init : function(el, config){
				this.el              = el;
				this.$el             = $(el);
				this.winSize         = $(window).width();
				this.settings        = $.extend({}, this.defaults, config );
				this.$frame          = this.$el.children('.silkCarousel-frame');
				this.$slideWrap      = this.$frame.children('ol');
				this.$slidesCollec   = this.$slideWrap.children();
				this.initSlideLength = this.$slidesCollec.length;
				this.$leftBtn        = this.$el.find('#' + this.settings.leftBtnId);
				this.$rightBtn       = this.$el.find('#' + this.settings.rightBtnId);
				this.currPage        = this.initSlideLength;
				this.$navItems       = null ;
				this._initDOM();
				this._initEvents();
				this._resetCarousel(this.initSlideLength);
			},

			/* Initialize the DOM.
			** The goal here is to make all DOM maniputalion on Init and dont touch the DOM again after that
			**
			*/

			_initDOM : function() {

				var self = this;

				//
				if (self.settings.navigationStyle === 'thumbnails') {
					self._setupNav();
				} else {
					self.$navItems = $('#' + self.settings.navigationStyle).find('a');
					self.$navItems.each( function(i) {
						self.$navItems.eq(i).data('page', i+1);
					});
				}

				//Sets the CSS
				self.$slidesCollec.css({
					'float' : 'left',
					'width' :  self.settings.size
				});
				self.$frame.css({
					'width':self.settings.size,
					'overflow': 'hidden'
				});
				self.$slideWrap.css('width', (self.settings.size * (self.initSlideLength * 4)));

				// Duplicate the whole collection to the left and then the first slide to the right.
				// We could only duplicate the first and last but then we have to set 2 "reset" trigger on the first and last elemenst
				// Where we juse need to set that trigger on the first one here
				self.$slidesCollec = self.$slidesCollec.clone()
											.appendTo(self.$slideWrap)
												.eq(0).clone()
													.appendTo(self.$slideWrap)
														.siblings();

				// Create and stock "spacers" for the negative jump to page
				self.$spacers = self.$slidesCollec.slice(0, self.initSlideLength-2)
								.clone()
									.addClass('silkCarousel-spacer')
										.css({display:"none"})
											.prependTo(self.$slideWrap);


			},

			_setupNav : function() {
				var i = 0,
				self = this,
					navHtml     = $('<ul>'),
					navItemHtml = null;

				for ( ;i < self.initSlideLength; i++ ) {
					

					navItemHtml = $('<a>', {
						'class'     : 'silkCarousel-nav-item',
						'data-page' : i+1
					});
					
					navItemHtml.append( self.$slidesCollec.eq(i).children('img').clone());

					navItemHtml = $('<li>').append(navItemHtml);
					navHtml.append(navItemHtml);
									}

				navHtml.addClass('silkCarousel-menu').prependTo(self.$el);
				
				self.$navItems = navHtml.find('a');
			},

			_initEvents: function() {
				var self = this;
				self.$rightBtn.click(function (e) {
					e.preventDefault();
					self._goToPage(+1);
				});

                self.$leftBtn.click(function (e) {
                    e.preventDefault();
                    self._goToPage(-1);
                });

				self.$navItems.click(function (e) {
                    e.preventDefault();

                    var toPage = parseInt($(this).data('page'), 10),
                        fromPage = self._indexIsContent(self.currPage + 1); // Plus one cause currpage is 0 based
                    
                    if (toPage === fromPage)  return false;
					self._goToPage(toPage, fromPage);
                });
			},

			_resetCarousel: function(p) {
                    this.$frame.scrollLeft(this.settings.size * p);
                    this.currPage = p;
            },

			_indexIsContent: function(index) {
				return index % this.initSlideLength || this.initSlideLength;
            },

			_addCurrent : function() {
				var currIndex = this.currPage === this.initSlideLength ? 0 : this._indexIsContent(this.currPage);
				this.$navItems.removeClass('current').eq(currIndex).addClass('current');
            },

			_goToPage: function( toPage, fromPage ) {
				fromPage = fromPage || false;

				var self = this;
				var left = 0;

				if (self.$frame.is(':animated')) return false;

                ////// 1- Go to next slide and slice if needed
                if (!fromPage) {

                    left = self.settings.size * toPage;
                    self.currPage += toPage;

                } else {
                    var dist = toPage - fromPage,
						sliced,
						i = 0 ;

                    left = self.settings.size;

                    // Negative jump to page
                    if ( dist < 0 ) {
                        left = -left;
                        sliced = self.$slidesCollec.slice(self.currPage + (dist + 1), self.currPage).css('display', "none");

                        for (; i < sliced.length; i++) { // we show as many clones as neccesary to fill the gaps caused by slicing
                            self.$spacers.eq(i).css('display', "");
                        }

                    // Positive jump to page
                    } else {
                        sliced = self.$slidesCollec.slice(self.currPage + 1, self.currPage + dist).css('display', "none");
                    }
                    self.currPage += dist;
                }

                // 2 Animate
                self.$frame.animate({
                    scrollLeft: '+=' + left
				},
				function() {

                    // 3 call back
                    if (self.currPage === 0 || self.currPage ===  self.$slidesCollec.length) self._resetCarousel(self.initSlideLength );

                    if (fromPage) {
                        sliced.css('display', "");
                        self.$spacers.css('display', "none");
                        self.$frame.scrollLeft(self.settings.size * self.currPage);
                    }
                });
                self._addCurrent();
                return false;
            }
	};

	jQuery.fn.silkCarousel = function(config){
		var instance = Object.create(silkCarousel);
		return this.each(function() {
			instance.init(this, config);
		});
	};

	// Make the main object available on global scope if a testing framework is available
	jQuery.fn.silkCarousel.Class = silkCarousel;

}( jQuery, window, document ));