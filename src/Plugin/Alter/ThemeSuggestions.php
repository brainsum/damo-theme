<?php

namespace Drupal\damo_theme\Plugin\Alter;

use Drupal\bootstrap\Plugin\Alter\ThemeSuggestions as BootstrapThemeSuggestions;
use Drupal\bootstrap\Annotation\BootstrapAlter;
use Drupal\bootstrap\Utility\Variables;

/**
 * Implements hook_theme_suggestions_alter().
 *
 * @ingroup plugins_alter
 *
 * @BootstrapAlter("theme_suggestions")
 */
class ThemeSuggestions extends BootstrapThemeSuggestions {

  /**
   * {@inheritdoc}
   */
  public function alter(&$suggestions, &$context1 = NULL, &$hook = NULL) {
    parent::alter($suggestions, $context1, $hook);

    $variables = Variables::create($context1);

    switch ($hook) {
      case 'fieldset':
        // Display fieldsets, which are not radios or checkboxes
        // as default opened `<details>` elements.
        if ($variables->element && !$variables->element->isType(['radios', 'checkboxes'])) {
          $suggestions[] = 'details';
          $variables->element->setAttribute('open', TRUE);
        }
        break;

      case 'field':
        if ($variables->element) {
          // Add entity type suggestions.
          if ($entity_type = $variables->element->getProperty('entity_type')) {
            $suggestions[] = "{$hook}__{$entity_type}";

            // Add view mode suggestions.
            if ($view_mode = $variables->element->getProperty('view_mode')) {
              $suggestions[] = "{$hook}__{$entity_type}__{$view_mode}";
            }
          }
        }
        break;
    }
  }

}
