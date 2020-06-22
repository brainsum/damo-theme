<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\bootstrap\Plugin\Preprocess\BootstrapDropdown as BootstrapBootstrapDropdown;
use Drupal\bootstrap\Utility\Variables;
use Drupal\bootstrap\Utility\Element;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use function mb_strpos;

/**
 * Pre-processes variables for the "bootstrap_dropdown" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("bootstrap_dropdown")
 */
class BootstrapDropdown extends BootstrapBootstrapDropdown {

  /**
   * {@inheritdoc}
   */
  protected function preprocessLinks(Variables $variables) {
    parent::preprocessLinks($variables);

    // Remove -xs class from operations.
    $toggle = Element::create($variables->toggle);
    $operations = (bool) mb_strpos($variables->theme_hook_original, 'operations');
    if ($operations) {
      $toggle->removeClass('btn-xs');
    }

    // Add class to child links.
    foreach ($variables->items as &$link) {
      if (isset($link['#type']) && $link['#type'] === 'link') {
        $link['#attributes']['class'] = ['dropdown-item'];
      }
    }
  }

}
