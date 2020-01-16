/**
 * @file media.view.js
 * Overridden from Media module.
 */
(function ($, Drupal) {

  "use strict";

  /**
   * Registers behaviours related to view widget.
   */

  Drupal.behaviors.MediaLibraryView = {
    attach: function (context, settings) {
      $('.media.view-mode-entity-browser').once('bind-click-event').on('click', function () {
        var $input = $(this).parents('.views-field').siblings('.views-field-entity-browser-select').find('.form-type-checkbox input');
        $input.prop('checked', !$input.prop('checked'));
        if ($input.prop('checked')) {
          $(this).addClass('checked');
          var render = $(this).find('.views-field-rendered-entity');
          $(render).css('opacity',0.3);
        }
        else {
          $(this).removeClass('checked');
          var render = $(this).find('.views-field-rendered-entity');
          $(render).css('opacity',1);
        }
      });
    }
  };

}(jQuery, Drupal));
