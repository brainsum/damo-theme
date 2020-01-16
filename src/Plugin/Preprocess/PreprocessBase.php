<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\bootstrap\Plugin\Preprocess\PreprocessBase as BootstrapPreprocessBase;
use Drupal\bootstrap\Plugin\Preprocess\PreprocessInterface;
use Drupal\bootstrap\Plugin\PluginBase;
use Drupal\bootstrap\Utility\Element;
use Drupal\bootstrap\Utility\Variables;
use Drupal\Core\Template\Attribute;

/**
 * Additions to Bootstrap theme's PreprocessBase class.
 *
 * @ingroup plugins_preprocess
 */
class PreprocessBase extends BootstrapPreprocessBase implements PreprocessInterface {

  /**
   * Set a #context property key to the hook it is actually invoked from.
   *
   * @param mixed &$target
   *   The element which will receive the hook #context.
   */
  protected function setHookContext(&$target) {
    if (is_array($target)) {
      $target['#context']['hook'] = $this->hook;
    }
    elseif ($target instanceof Element) {
      $target->setProperty('context', ['hook' => $this->hook]);
    }
    else {
      throw new Exception('Wrong target element for the hook context.');
    }
  }

}
