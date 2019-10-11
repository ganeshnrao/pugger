/* global $ */
$(document).ready(function() {
  var currentSlideIndex = 0;
  var $slides = $(".ah-slideshow-item")
    .toArray()
    .map(slide => $(slide));
  $slides[0].addClass("active");
  $(".ah-slideshow").click(function() {
    $slides[currentSlideIndex].removeClass("active");
    currentSlideIndex = (currentSlideIndex + 1) % $slides.length;
    $slides[currentSlideIndex].addClass("active");
  });
});
