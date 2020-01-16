<?php

namespace Drupal\damo_theme\Plugin\Preprocess\Views;

use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "views_view__media_library" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("views_view__media_library")
 */
class ViewMediaLibrary extends ViewBase {

  /**
   * {@inheritdoc}
   */
  public function preprocessVariables(Variables $variables) {
    parent::preprocessVariables($variables);

    $variables->view->element['#attached']['library'][] = 'damo_theme/media_library';
    $variables->addClass('view-media-library');
  }

}
