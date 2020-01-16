/**
 * @file
 * Extends the Bootstrap Drupal AJAX functionality.
 */

(function ($, Drupal) {
  'use strict';

  // Save the parent which we will override.
  // @todo Is there a better solution?
  Drupal.behaviors._dialog = {
    attach: function (context, settings) {
      return Drupal.behaviors.dialog.prepareDialogButtons;
    }
  };

  $.extend(Drupal.behaviors.dialog, {

    /** @inheritdoc */
    prepareDialogButtons: function ($dialog) {
      // Don't hide the buttons for entity embed dialogs.
      if ($dialog.find('form.entity-embed-dialog').length) {
        return;
      }
      // Otherwise, call the parent function in Bootstrap.
      Drupal.behaviors._dialog.attach($dialog);
    }
  });

})(jQuery, Drupal);
