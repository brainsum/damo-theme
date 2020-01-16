<?php

namespace Drupal\damo_theme\Plugin\Alter;

use Drupal\bootstrap\Plugin\Alter\ElementInfo as BootstrapElementInfo;
use Drupal\bootstrap\Annotation\BootstrapAlter;

/**
 * Implements hook_element_info_alter().
 *
 * NOTE: You need to rebuild the cache if you edit this file!
 *
 * @ingroup plugins_alter
 *
 * @BootstrapAlter("element_info")
 */
class ElementInfo extends BootstrapElementInfo {

  /**
   * {@inheritdoc}
   */
  public function alter(&$types, &$context1 = NULL, &$context2 = NULL) {
    parent::alter($types, $context1, $context2);

    foreach (array_keys($types) as $type) {
      $element = &$types[$type];

      // Disable Bootstrap collapsible panels for `<details>`
      // and `<fieldset>` elements, and use HTML5 version instead.
      if ($type === 'details' || $type === 'fieldset') {
        $element['#bootstrap_panel'] = FALSE;

        // Re-add drupal.collapse, as it is disabled in Bootstrap theme.
        $element['#attached']['library'][] = 'damo_theme/drupal.collapse';
      }
    }
  }

}
