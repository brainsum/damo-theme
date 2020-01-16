<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\bootstrap\Plugin\Preprocess\FilterTips as BootstrapFilterTips;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "filter_tips" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("filter_tips",
 *   replace = "template_preprocess_filter_tips"
 * )
 */
class FilterTips extends BootstrapFilterTips {

  /**
   * {@inheritdoc}
   */
  public function preprocessVariables(Variables $variables) {
    parent::preprocessVariables($variables);

    foreach ($variables->tips['tabs']['#items'] as &$item) {
      $item['#attributes']['class'][] = 'nav-link';
    }
  }

}
