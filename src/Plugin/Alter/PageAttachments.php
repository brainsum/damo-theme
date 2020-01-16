<?php

namespace Drupal\damo_theme\Plugin\Alter;

use Drupal;
use Drupal\bootstrap\Plugin\Alter\PageAttachments as BootstrapPageAttachments;
use function array_search;

/**
 * Implements hook_page_attachments_alter().
 *
 * @ingroup plugins_alter
 *
 * @BootstrapAlter("page_attachments")
 */
class PageAttachments extends BootstrapPageAttachments {

  /**
   * {@inheritdoc}
   */
  public function alter(&$attachments, &$context1 = NULL, &$context2 = NULL) {
    parent::alter($attachments, $context1, $context2);

    // Remove active-link library for this view, because we set the active tabs
    // based on URL query parameters.
    // @todo Not the best solution, as it removes the JS from the whole page.
    if (
      ($key = array_search('core/drupal.active-link', $attachments['#attached']['library'], TRUE)) !== FALSE
      && Drupal::routeMatch()->getRouteName() === 'view.asset_search.asset_search'
    ) {
      unset($attachments['#attached']['library'][$key]);
    }
  }

}
