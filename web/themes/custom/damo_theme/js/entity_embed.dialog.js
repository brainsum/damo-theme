/**
 * @file
 * Override some things from Entity Embed module.
 */

(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.entityEmbedDialog = {
    /**
     * Override parent function because of wrong selector.
     * @inheritdoc
     */
    attach: function (context, settings) {
      $('body').once('js-entity-embed-dialog').on('entityBrowserIFrameAppend', function () {
        $('.entity-select-dialog').trigger('resize');
        // Hide the next button, the click is triggered by Drupal.entityEmbedDialog.selectionCompleted.
        // Fixed wrong selector.
        $('#drupal-modal').parent().find('.entity-embed-dialog .js-button-next').addClass('sr-only');
      });
    },

    /**
     * Override parent function because of wrong selector.
     * @inheritdoc
     */
    selectionCompleted: function (event, uuid, entities) {
      $('.entity-select-dialog .js-button-next').click();
    },
  };

})(jQuery, Drupal);
