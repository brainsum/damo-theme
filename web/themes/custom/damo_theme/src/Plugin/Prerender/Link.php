<?php

namespace Drupal\damo_theme\Plugin\Prerender;

use Drupal\bootstrap\Plugin\Prerender\Link as BootstrapLink;
use Drupal\bootstrap\Annotation\BootstrapConstant;
use Drupal\bootstrap\Annotation\BootstrapPrerender;
use Drupal\bootstrap\Bootstrap;
use Drupal\bootstrap\Utility\Element;
use Drupal\Component\Render\FormattableMarkup;

/**
 * Pre-render callback for the "link" element type.
 *
 * @ingroup plugins_prerender
 *
 * @BootstrapPrerender("link",
 *   action = @BootstrapConstant(
 *     "\Drupal\bootstrap\Bootstrap::CALLBACK_PREPEND"
 *   )
 * )
 *
 * @see \Drupal\Core\Render\Element\Link::preRenderLink()
 */
class Link extends BootstrapLink {

  /**
   * {@inheritdoc}
   */
  public static function preRenderElement(Element $element) {
    parent::preRenderElement($element);

    if (!$element->isPropertyEmpty('context')) {
      $context = $element->getProperty('context');
      if (isset($context['hook'])) {
        static::preRenderLinkByHook($element);
      }
    }
  }

  /**
   * Prerender the Link item by theme hook.
   *
   * For example, links which are rendered in MenuLocalTask elements,
   * can get their unique classes.
   *
   * @param  Element $element
   *   The Bootstrap Element object, which will be altered.
   */
  protected static function preRenderLinkByHook(Element $element) {
    $context = $element->getProperty('context');
    $hook = $context['hook'] ?: NULL;

    switch ($hook) {
      case 'menu_local_task':
        $element->addClass('nav-link');
        $element['#options']['attributes']['class'][] = 'nav-link';
        break;
    }
  }

}
