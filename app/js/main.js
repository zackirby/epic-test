$(document).ready(function(){
	$('main').fullpage({
		sectionSelector: '#hero',
		paddingTop: '80px',
		autoScrolling: false,
		scrollBar: true,
		fitToSection: false,
		verticalCentered: false
	});
	$('a.scroll').on('click', function(e){
		e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 500, 'swing');
	});
	var $animation_elements = $('.fadein');
	var $window = $(window);

	function check_if_in_view() {
	  var window_height = $window.height();
	  var window_top_position = $window.scrollTop();
	  var window_bottom_position = (window_top_position + window_height);

	  $.each($animation_elements, function() {
	    var $element = $(this);
	    var element_height = $element.outerHeight();
	    var element_top_position = $element.offset().top;
	    var element_bottom_position = (element_top_position + element_height);

	    //check to see if this current container is within viewport
	    if ((element_top_position <= window_bottom_position)) {
	      $element.addClass('in-view');
	    } else {
	      $element.removeClass('in-view');
	    }
	  });
	}

	$window.on('scroll resize', check_if_in_view);
	$window.trigger('scroll');
});