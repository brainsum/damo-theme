<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\damo_theme\Plugin\Preprocess\PreprocessBase;
use Drupal\bootstrap\Plugin\Preprocess\PreprocessInterface;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Bootstrap;
use Drupal\bootstrap\Utility\Element;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "menu_local_action" theme hook.
 *
 * - Removed icons.
 * - Changed `btn-xs` class to `btn-sm`.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("menu_local_action")
 */
class MenuLocalAction extends PreprocessBase implements PreprocessInterface {

  /**
   * {@inheritdoc}
   */
  public function preprocessElement(Element $element, Variables $variables) {
    $link = $element->getProperty('link');
    $link += ['localized_options' => []];
    $link['localized_options']['set_active_class'] = TRUE;

    $options = isset($link['localized_options']) ? $link['localized_options'] : [];

    if (isset($link['url'])) {
      // Turn link into a mini-button and colorize based on title.
      $class = Bootstrap::cssClassFromString($link['title'], 'default');
      if (!isset($options['attributes']['class'])) {
        $options['attributes']['class'] = [];
      }
      $string = is_string($options['attributes']['class']);
      if ($string) {
        $options['attributes']['class'] = explode(' ', $options['attributes']['class']);
      }
      $options['attributes']['class'][] = 'btn';
      $options['attributes']['class'][] = 'btn-sm';
      $options['attributes']['class'][] = 'btn-' . $class;
      if ($string) {
        $options['attributes']['class'] = implode(' ', $options['attributes']['class']);
      }

      $variables['link'] = [
        '#type' => 'link',
        '#title' => $link['title'],
        '#options' => $options,
        '#url' => $link['url'],
      ];
    }
    else {
      $variables['link'] = [
        '#type' => 'link',
        '#title' => $link['title'],
        '#options' => $options,
        '#url' => $link['url'],
      ];
    }
  }

}
