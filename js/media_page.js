/**
 * @file
 * Toggleable responsive tabs for Local Tasks menus.
 */

(function (Drupal, $) {
  'use strict';

  var checkbox;
  Drupal.behaviors.damoMediaPage = {


    attach: function (context, settings) {
      var identifier, img, identifier_no_badge, currentIdentifier, newIdentifier;
      var that = this;
      var height = 0;
      checkbox = $('#watermark');

      identifier = $('.images-wrapper .image.active').attr('identifier');
      that.disableCheckbox(identifier);

      $('.image-controls .link').on('click', function(){
        identifier = $(this).attr('identifier');
        that.switchActive(identifier);
        that.disableCheckbox(identifier);
      });
      checkbox.on('change', function(){
        identifier = $('.images-wrapper .image.active').attr('identifier');
        that.toggleCheckbox(identifier);
        if (checkbox.is(':checked')) {
          $('.image-controls').find('.no-badge').addClass('inactive');
        }
        else {
          $('.image-controls').find('.no-badge').removeClass('inactive');
        }
        
      });
      
      
      if ($('.field--type-entity-reference').length < 1) {
        $('.usage-wrapper').addClass('no-margin');
      }
      else {
        $('.field--type-entity-reference').each(function(index, item){
          height += parseInt($(item).outerHeight());
        });
        if ($('.field--name-field-expiration-date').length > 0) {
          height += $('.field--name-field-expiration-date').outerHeight();
        }
        height = height * -1;
      }
      recalculateImageHeight(mobileCheck()); 
      $('.dam-local-task-back-button a').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        if (!that.getUrlParameter('destination')) {
          window.history.back();
        }
        else {
          window.location.replace(that.getUrlParameter('destination'));
        }
      });
      function mobileCheck() {
        var bodyBefore = getComputedStyle(document.querySelector('body'), '::before').content.replace(/"/g, '');
        return bodyBefore === "xs" || bodyBefore === "sm" || bodyBefore === "md"
      }

      window.addEventListener('resize', ()=> {
        recalculateImageHeight(mobileCheck()); 
      });
      function recalculateImageHeight(isMobile) {
        if (!isMobile) {
          $('.images-wrapper').css('height', $('.right-wrapper').height());
          $('.images-wrapper .media-thumbnail').css('height', $('.right-wrapper').height());
          $('.usage-wrapper').css('margin-top', height);
        }
        else {
          $('.images-wrapper').css('height', 'auto');
          $('.images-wrapper .media-thumbnail').css('height', 'auto');
          $('.usage-wrapper').css('margin-top', 0);
        }
      }
      
    },

    toggleCheckbox: function(identifier) {
      $('.media-page-wrapper').find('.active').removeClass('active');
      if ($(checkbox).is(':checked')) {
        identifier = identifier.replace('-no-badge', '');
      }
      else {
        if ($('body').find('div[identifier="' + identifier + '-no-badge"]').length > 0) {
          identifier = identifier + '-no-badge';
        }
      }
      $('body').find('div[identifier="' + identifier + '"]').addClass('active');
    },

    checkboxState: function(identifier) {
      var taht = this;
      var newIdentifier;
      if (checkbox.is(':checked')) {
        if (identifier.indexOf("-no-badge") >= 0) {
          newIdentifier = identifier.replace('-no-badge', '');
          if ($('body').find('div[identifier="' + newIdentifier + '"]').length <= 0) {
            return identifier;
          }
          else {
            return newIdentifier;
          }
        }
        else {
          if ($('body').find('div[identifier="' + identifier + '-no-badge"]').length > 0) {
            return identifier;
          }
        }
      }
      else {
        if (identifier.indexOf("-no-badge") < 0) {
          newIdentifier = identifier + '-no-badge';
          if ($('body').find('div[identifier="' + newIdentifier + '"]').length >= 1) {
            return newIdentifier;
          }
          else {
            return identifier;
          }
        }
        else {
          return identifier;
        }
      }
    },

    switchActive: function(identifier) {
      var linkIdentifier, image_controller;
      $('.media-page-wrapper').find('.active').removeClass('active');
      identifier = Drupal.behaviors.damoMediaPage.checkboxState(identifier);
      linkIdentifier = identifier.replace('-no-badge', '');
      $('body').find('div[identifier="' + identifier + '"]').addClass('active');
      image_controller = $('.image-controls').find('div[identifier="' + linkIdentifier + '"]');
      if (!image_controller.hasClass('active')) {
        image_controller.addClass('active');
      }
    },
    disableCheckbox: function(identifier) {
      if (identifier.indexOf("-no-badge") > 0) {
        identifier = identifier.replace('-no-badge', '');
        if ($('body').find('div[identifier="' + identifier).length > 0) {
          checkbox.attr('disabled', false);
          checkbox.removeClass('disabled');
          $('label[for="watermark"]').removeClass('disabled');
        }
        else {
          checkbox.attr('disabled', true);
          checkbox.addClass('disabled');
          $('label[for="watermark"]').addClass('disabled');
        }
      }
      else {
        checkbox.attr('disabled', false);
          checkbox.removeClass('disabled');
          $('label[for="watermark"]').removeClass('disabled');
      }
    },
    getUrlParameter: function(sParam) {
      var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
      }
    }
  };
})(Drupal, jQuery);
