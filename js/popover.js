/**
 * @file
 * Bootstrap 4 popovers configured from the Bootstrap base theme settings.
 *
 * Replaces the base theme's popover.js, which targets Bootstrap 3's plugin
 * interface (Constructor.DEFAULTS, instance.options and "auto" placements).
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  var settings = drupalSettings.bootstrap || {};

  /**
   * Returns popover options from the theme settings.
   */
  function defaults() {
    // Bootstrap 4 alpha has no "auto" placement; keep the preferred side.
    var placement = String(settings.popover_placement || 'right').replace(/^auto\s*/, '') || 'right';
    return {
      animation: !!settings.popover_animation,
      html: !!settings.popover_html,
      placement: placement,
      trigger: settings.popover_trigger || 'click',
      title: settings.popover_title || '',
      content: settings.popover_content || '',
      delay: parseInt(settings.popover_delay, 10) || 0,
      container: settings.popover_container || false
    };
  }

  Drupal.behaviors.bootstrapPopovers = {
    $active: null,

    attach: function (context) {
      if (!$.fn.popover || !settings.popover_enabled) {
        return;
      }
      var behavior = this;
      if (settings.popover_auto_close) {
        $(document)
          .off('.damoPopover')
          .on('shown.bs.popover.damoPopover', function (e) {
            var $trigger = $(e.target);
            if (behavior.$active && !behavior.$active.is($trigger)) {
              behavior.$active.popover('hide');
            }
            behavior.$active = $trigger;
          })
          .on('click.damoPopover', function (e) {
            var $target = $(e.target);
            if (behavior.$active && !$target.closest(behavior.$active).length && !$target.closest('.popover').length) {
              behavior.hideActive();
            }
          })
          .on('keyup.damoPopover', function (e) {
            if (e.key === 'Escape') {
              behavior.hideActive();
            }
          });
      }

      var selector = settings.popover_selector || '[data-toggle="popover"]';
      $(context).find(selector).each(function () {
        var $element = $(this);
        if ($element.data('bs.popover')) {
          return;
        }
        // Element data may set content and placement, but markup-related
        // options stay with the theme settings: Bootstrap 4 alpha has no
        // HTML sanitizer. Bootstrap also merges data-* attributes beneath the
        // options passed in, so pass these explicitly.
        var base = defaults();
        var options = $.extend({}, base, $element.data(), {
          html: base.html,
          template: $.fn.popover.Constructor.Default.template
        });

        // Content can come from a target element, as in the base theme.
        var target = options.target || ($element.is('a[href^="#"]') && $element.attr('href'));
        delete options.target;
        if (!options.content && target) {
          var $target = $(document).find(target).first().clone();
          if ($target.length) {
            $target.removeClass('visually-hidden hidden').removeAttr('aria-hidden');
            options.content = $('<div/>').append($target)[options.html ? 'html' : 'text']();
          }
        }
        $element.popover(options);
      });
    },

    hideActive: function () {
      if (this.$active) {
        this.$active.popover('hide');
        this.$active = null;
      }
    },

    detach: function (context, behaviorSettings, trigger) {
      if (!$.fn.popover || trigger !== 'unload') {
        return;
      }
      $(context).find('[data-toggle="popover"]').each(function () {
        if ($(this).data('bs.popover')) {
          $(this).popover('dispose');
        }
      });
    }
  };

})(jQuery, Drupal, drupalSettings);
