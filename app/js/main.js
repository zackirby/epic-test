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
	})
});