<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal;
use Drupal\damo_theme\DamoBase;
use Drupal\bootstrap\Plugin\Preprocess\PreprocessInterface;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "page_title" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("page_title")
 */
class PageTitle extends PreprocessBase {

  /**
   * {@inheritdoc}
   */
  public function preprocessVariables(Variables $variables) {
    parent::preprocessVariables($variables);

    // Set site name as title or title_prefix based on frontpage.
    $target = DamoBase::isFront() ? 'title' : 'title_prefix';
    $variables->$target = Drupal::config('system.site')->get('name');
  }

}
