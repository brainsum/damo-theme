/**
 * @file
 * Bootstrap 4 tooltips configured from the Bootstrap base theme settings.
 *
 * Replaces the base theme's tooltip.js, which targets Bootstrap 3's plugin
 * interface (Constructor.DEFAULTS and "auto" placements).
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  var settings = drupalSettings.bootstrap || {};

  /**
   * Bootstrap 4 alpha has no "auto" placement; keep the preferred side.
   */
  function placement(value) {
    return typeof value === 'string' ? value.replace(/^auto\s*/, '') || 'top' : value;
  }

  /**
   * Returns tooltip options from the theme settings.
   */
  function defaults() {
    return {
      animation: !!settings.tooltip_animation,
      html: !!settings.tooltip_html,
      placement: placement(settings.tooltip_placement || 'top'),
      trigger: settings.tooltip_trigger || 'hover focus',
      delay: parseInt(settings.tooltip_delay, 10) || 0,
      container: settings.tooltip_container || false
    };
  }

  Drupal.behaviors.bootstrapTooltips = {
    attach: function (context) {
      // Keep the native title if Bootstrap's tooltip plugin is unavailable.
      if (!$.fn.tooltip || !settings.tooltip_enabled) {
        return;
      }
      var selector = settings.tooltip_selector || '[data-toggle="tooltip"]';
      $(context).find(selector).each(function () {
        var $element = $(this);
        if ($element.data('bs.tooltip')) {
          return;
        }
        // Element data may set the title, placement or trigger, but markup
        // options stay with the theme settings: Bootstrap 4 alpha has no HTML
        // sanitizer, and it merges data-* attributes beneath the options
        // passed in, so pass these explicitly.
        var base = defaults();
        var options = $.extend({}, base, $element.data(), {
          html: base.html,
          template: $.fn.tooltip.Constructor.Default.template
        });
        options.placement = placement(options.placement);
        $element.tooltip(options);
      });
    },
    detach: function (context) {
      if (!$.fn.tooltip) {
        return;
      }
      $(context).find(settings.tooltip_selector || '[data-toggle="tooltip"]').tooltip('dispose');
    }
  };

})(jQuery, Drupal, drupalSettings);
