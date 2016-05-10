$(document).ready(function(){
	$('main').fullpage({
		anchors: ['top','about-us','our-locations','contact-us'],
		sectionSelector: 'section',
		autoScrolling: false,
		scrollBar: true,
		fitToSection: false
	});
	$('a.scroll').on('click', function(e){
		e.preventDefault();
		$.fn.fullpage.moveSectionDown();
	})
});