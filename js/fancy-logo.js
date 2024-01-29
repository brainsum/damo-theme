/**
 * @file
 * Initialize animation on scroll for logo, but use Underscore's
 * throttling to prevent too many function calls.
 */

(function (Drupal, $, once) {
  'use strict';

  Drupal.behaviors.fancyLogoAnimation = {
    attach: function (context, settings) {
      var latestKnownScrollY = 0;
      var ticking = false;
      var $logo = $(once('fancy-logo', '.fancy-logo'));
      var classAfterScroll = 'fixed';

      function update() {
        // reset the tick so we can
        // capture the next onScroll
        ticking = false;
        $logo.toggleClass(classAfterScroll, latestKnownScrollY > 300);
      }

      function onScroll() {
        latestKnownScrollY = window.scrollY; //No IE8
        requestTick();
      }

      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(update);
        }
        ticking = true;
      }

      window.addEventListener('scroll', onScroll, false);
    }
  };

})(Drupal, jQuery, once);
