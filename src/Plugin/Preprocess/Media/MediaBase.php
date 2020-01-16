<?php

namespace Drupal\damo_theme\Plugin\Preprocess\Media;

use Drupal\damo_theme\Plugin\Preprocess\PreprocessBase;
use Drupal\bootstrap\Plugin\Preprocess\PreprocessInterface;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;
use Drupal\bootstrap\Utility\Element;

/**
 * Pre-processes variables for the "media" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("media")
 */
class MediaBase extends PreprocessBase implements PreprocessInterface {

  /**
   * {@inheritdoc}
   */
  protected function preprocessElement(Element $element, Variables $variables) {
    parent::preprocessElement($element, $variables);
    $media =& $element->getProperty('media');

    // All Media templates should have the these fields.
    $variables->mid = $media->id();
    $variables->bundle = $media->bundle->entity->id();
    $variables->bundle_label = $media->bundle->entity->label();
  }

}
