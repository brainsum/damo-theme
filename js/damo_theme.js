/**
 * @file
 * Toggleable responsive tabs for Local Tasks menus.
 */

(function (Drupal, $, once) {
  'use strict';

  Drupal.behaviors.damoTheme = {
    attach: function (context, settings) {
      var resetButton,
          searchSelect = '#views-exposed-form-asset-search-asset-search select',
          searchSelect2 = '#views-exposed-form-unpublished-assets-unpublished-assets select',
          searchSelect3 = '#block-exposedformunpublished-assetsuser-unpublished-assets select',
          searchInput = '.search-wrapper #edit-text',
          width = 0,
          itemsPerRow = 0;

      $(searchSelect).niceSelect();
      $(searchSelect2).niceSelect();
      $(searchSelect3).niceSelect();
      $("body").on('click', 'div.ui-widget-overlay',function(){
        $("#drupal-modal").dialog( "close" );
      });
      resetButton = $('#views-exposed-form-asset-search-asset-search .exposed_form_reset');
      resetButton.on('click', function(){
        $(searchSelect).val('All').niceSelect('update');
        $(searchSelect).removeClass('changed');
        resetButton.addClass('hidden');
      });
      $(searchSelect).each(function(index, item){
        $(item).on('change', function(){
          if ($(item).val() == 'All') {
            $(item).removeClass('changed');
          }
          else {
            if (!$(item).hasClass('changed')) {
              $(item).addClass('changed');
            }
          }
          if ($('#views-exposed-form-asset-search-asset-search select.changed').length > 0) {
            console.log('should be visible');
            resetButton.removeClass('hidden');
          }
          else {
            if ($(searchInput).val().length == 0) {
              resetButton.addClass('hidden');
            }
          }
        });
        $(searchInput).on('keyup', function(){
          if ($(this).val().length > 0) {
            resetButton.removeClass('hidden');
          }
          else {
            if ($(searchSelect + '.changed').length == 0) {
              resetButton.addClass('hidden');
            }
          }
        });
      });
      $('.usage-wrapper .control-wrapper').on('click', function(){
        $('.useage-overlay-wrapper').addClass('visible');
      });
      $('.overlay-content span.close').click(function(){
        $('.useage-overlay-wrapper').removeClass('visible');
      });
      $(document).keyup(function(e) {
        if (e.keyCode === 27) {
          $('.useage-overlay-wrapper').removeClass('visible');
        }
      });

      $('#edit-text').on('focusin', function(){
        $(this).closest('div.search-wrapper').addClass('focused');
      });
      $('#edit-text').on('focusout', function(){
        $(this).closest('div.search-wrapper').removeClass('focused');
      });
      if ($('.view-media-library').length > 0) {
        $(window).on('resize', function(){
          itemsPerRow = parseInt($(window).width() / $('.view-media-library .views-row').outerWidth());
          width = parseInt(itemsPerRow * $('.view-media-library .views-row').outerWidth()) + 11;
          $('.view-media-library').css('width', width);
          $('.view-media-library .views-row img').css('max-width', $('.view-media-library .views-row .card-content').width());
          $('.view-media-library .views-row img').css('max-height', $('.view-media-library .views-row .card-content').height());

        });
        itemsPerRow = parseInt($(window).width() / $('.view-media-library .views-row').outerWidth());
        width = parseInt(itemsPerRow * $('.view-media-library .views-row').outerWidth()) + 11;
        $('.view-media-library').css('width', width);
        $('.view-media-library .views-row img').css('max-width', $('.view-media-library .views-row .card-content').width());
        $('.view-media-library .views-row img').css('max-height', $('.view-media-library .views-row .card-content').height());
      }

      // mobile menu
      var hamburgerBtn, menuWrapper;

      hamburgerBtn = document.querySelector('.navbar-toggler');
      menuWrapper = document.querySelector('#block-damnavigation > .tabs-wrapper');

      // hamburgerBtn.addEventListener('click', ()=> {
      //   if(!hamburgerBtn.classList.contains('is-active')) {
      //     hamburgerBtn.classList.add('is-active');
      //     menuWrapper.classList.add('active');
      //   } else {
      //     hamburgerBtn.classList.remove('is-active');
      //     menuWrapper.classList.remove('active');
      //   }
      // });

      const userBtn = once('userBtn', document.getElementById("js-user-menu"));
      const userMenu = once('userMenu',document.getElementById("js-user-dropdown"));
      userBtn.forEach(item => {
        item.addEventListener('click', (e)=> {
          userMenu[0].classList.toggle('active');
        })
      })
    }
  };

})(Drupal, jQuery, once);
