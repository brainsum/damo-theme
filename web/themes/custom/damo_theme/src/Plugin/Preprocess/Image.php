<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\bootstrap\Plugin\Preprocess\PreprocessInterface;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "image" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("image")
 */
class Image extends PreprocessBase implements PreprocessInterface {

  /**
   * {@inheritdoc}
   */
  public function preprocessVariables(Variables $variables) {
    parent::preprocessVariables($variables);

    // @todo Replace the image style to align with Media Library view mode.
    if ($variables->style_name === 'gallery_item') {
      $variables->addClass('card-img');
    }
  }

}
