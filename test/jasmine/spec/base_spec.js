describe('Silk Carousel', function() {
	var $carouselFixture = $( readFixtures('carousel-fixture.html'));

	beforeEach(function() {


		this.addMatchers({
			toBeInstanceOf : function( expected ) {
				return this.actual instanceof expected && this.actual.length > 0;
			},

			toBeA: function( expected ) {
				return typeof this.actual === expected;
			},

			toBeVisible : function() {
				return $(this.actual).isVisible();
			},

			nodeNameToBe: function( expected ) {
				if ( this.actual instanceof  jQuery ) {
					return this.actual[0].nodeName === expected || this.actual[0].nodeName === expected.toUpperCase();
				} else {
					return this.actual.nodeName === expected || this.actual.nodeName === expected.toUpperCase();
				}
			}
		});
	});

	afterEach(function() {
		//$carouselFixture = $( readFixtures('carousel-fixture.html'));
	});

	describe("Initialization", function() {
		it("Sould have a silkcarousel object available on global namespace", function() {
			expect($.fn.silkCarousel.Class).toBeA( 'object' );
		});

		it("Find Jquery", function() {
			expect($).toBeDefined();
		});

		it("Find jasmine.jquery", function() {
			expect(readFixtures()).toBeDefined();
		});

		describe("Markup", function() {
			it("Find the Carousel Fixture", function() {
				expect($carouselFixture).toBeDefined();
			});
		});
	});

	describe("jQuery.silkCarousel Method", function() {
		it("should be an available method", function() {
			expect($.fn.silkCarousel).toBeA('function');
		});

		it("should be chainable", function() {
			expect($carouselFixture.silkCarousel).toBeA('function');
		});

		it("should be able to iterate through a jquery Collection", function() {
			var $carouselInstances = $carouselFixture.filter('.silkCarousel');
			expect($(sandbox()).silkCarousel()).toBeInstanceOf( jQuery );
		});

		it("Sould have a defaut object", function() {
			var instance = Object.create($.fn.silkCarousel.Class);
			expect(instance.defaults).toBeA( 'object' );
		});

		it("Should have default parameters", function() {
			var instance = Object.create($.fn.silkCarousel.Class);
			expect(instance.defaults.size).toBe( 500 );
			expect(instance.defaults.type).toBe( 'normal' );
			expect(instance.defaults.navigationStyle).toBe( 'thumbnails' );
			expect(instance.defaults.easingMethod).toBe( 'normal' );
			expect(instance.defaults.switchDelay).toBe( 2000 );
			expect(instance.defaults.tansitionSpeed).toBe( 500 );
			expect(instance.defaults.previousNextButtons).toBe( false );
		});

		it("Default object should get overiden by config", function() {
			var instance = Object.create($.fn.silkCarousel.Class);
			instance.init( $carouselFixture, { size : 1 });
			expect(instance.settings).toBeA( 'object' );
			expect(instance.settings.size).toBe(1);
		});
	});

	describe('DOM init', function() {
		var $frame = $carouselFixture.children('div');
		var $slideWraper = $frame.children('ol');
		var initialNumberOfSlide = $slideWraper.children().length;



		it('Should find the slides framed Viewport', function() {
			expect( $frame ).toBeInstanceOf( jQuery );
		});

		
		it('Should find the slides Wrapper', function() {
			expect( $slideWraper ).toBeInstanceOf( jQuery );
		});

		it("should find slides", function() {
			expect(initialNumberOfSlide).toBeGreaterThan(0);
		});

		it("should duplicate slides", function() {
			spyOn( jQuery.fn, 'silkCarousel');
			$carouselFixture.silkCarousel();

			expect(jQuery.fn.silkCarousel).toHaveBeenCalled();
			expect(initialNumberOfSlide).toBeLessThan( $slideWraper.children().length );
			expect($slideWraper.children().length).toEqual(initialNumberOfSlide * 2 + 1);
		});

		it("should create the navigation", function() {
			spyOn( jQuery.fn, 'silkCarousel');
			$carouselFixture.silkCarousel();
			expect(jQuery.fn.silkCarousel).toHaveBeenCalled();
			var $menuWrap = $carouselFixture.children('.silkCarousel-menu');
			expect($menuWrap).toBeInstanceOf( jQuery );
			expect($menuWrap).toHaveClass('silkCarousel-menu');
			expect($menuWrap.children().length).toEqual(initialNumberOfSlide);
			expect($menuWrap.children().first()).nodeNameToBe('li');
			var menuItem = $menuWrap.children().first().find('a');
			expect(menuItem).toBeInstanceOf( jQuery );
			expect(menuItem).toHaveAttr('data-page');
		});

		it("Should createa 'spacer' for negative jump to page", function() {
			console.log($.fn.silkCarousel.Class);
			var instance = Object.create($.fn.silkCarousel.Class);
			instance.init( $carouselFixture);
			expect(instance.$spacers.length).toBeGreaterThan(0);
		});
	});

});