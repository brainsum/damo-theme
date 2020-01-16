<?php

namespace Drupal\damo_theme\Plugin\Preprocess\Media;

use Drupal;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;
use Drupal\bootstrap\Utility\Element;
use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Pre-processes variables for the "media__media_library" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("media__media_library")
 */
class MediaLibrary extends MediaBase {

  /**
   * {@inheritdoc}
   */
  protected function preprocessElement(Element $element, Variables $variables) {
    parent::preprocessElement($element, $variables);
    $media =& $element->getProperty('media');

    // Options for edit/delete links.
    // @see \Drupal\Core\Url::fromUri() for available keys.
    $link_options = [
      'attributes' => [
        'class' => ['glyphicon', 'btn', 'btn-sm', 'btn-default'],
      ],
    ];

    $edit_link_options = NestedArray::mergeDeep(
      $link_options, ['attributes' => [
        'class' => ['glyphicon-pencil'],
        'title' => $this->t('Edit'),
      ]]
    );

    $delete_link_options = NestedArray::mergeDeep(
      $link_options, ['attributes' => [
        'class' => ['glyphicon-remove'],
        'title' => $this->t('Delete'),
      ]]
    );

    // Build the Edit and Delete links.
    $destination = Drupal::destination()->get();
    $route_parameters = ['media' => $media->id(), 'destination' => $destination];
    $edit_url = Url::fromRoute('entity.media.edit_form', $route_parameters, $edit_link_options);
    $delete_url = Url::fromRoute('entity.media.delete_form', $route_parameters, $delete_link_options);

    // Add variables to the template.
    $variables->view_url = Url::fromRoute('entity.media.canonical', $route_parameters);
    if ($edit_url->access()) {
      $variables->edit_link = Link::fromTextAndUrl(NULL, $edit_url);
    }
    if ($delete_url->access()) {
      $variables->delete_link = Link::fromTextAndUrl(NULL, $delete_url);
    }
  }

}
