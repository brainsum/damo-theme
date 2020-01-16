/**
 * @file
 * Toggleable responsive tabs for Local Tasks menus.
 */

(function (Drupal, $) {
  'use strict';

  Drupal.behaviors.damoBaseTabsToggle = {
    attach: function (context, settings) {
      var dropdown_split_button = $('.btn-group .js-form-submit');

      dropdown_split_button.on('click', function(){
        var url_id = $(this).attr('data-dropdown-target');
        var dropdown_split_list = $(this).siblings('.dropdown-menu');
        var dropdown_split_button_url = dropdown_split_list.children(url_id).attr('href');
        if (dropdown_split_button_url) {
          window.location.href = dropdown_split_button_url;
        }
      });
    }
  };

})(Drupal, jQuery);
