<?php

namespace Drupal\damo_theme\Plugin\Preprocess;

use Drupal\damo_theme\DamoBase;
use Drupal\bootstrap\Plugin\Preprocess\Page as BootstrapPage;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;
use Drupal\Component\Utility\Html;

/**
 * Pre-processes variables for the "page" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("page")
 */
class Page extends BootstrapPage {

  /**
   * {@inheritdoc}
   */
  public function preprocessVariables(Variables $variables) {
    parent::preprocessVariables($variables);

    // Content attributes.
    if ($this->theme->getSetting('fluid_container', FALSE)) {
      $variables->container_class = 'container-fluid';
      $variables->navbar_attributes->inner_container = FALSE;
    }
    else {
      $variables->container_class = 'container';
      $variables->navbar_attributes->inner_container = TRUE;
    }

    // Add navbar classes.
    $variables->navbar_attributes->addClass('navbar');

    if ($this->theme->getSetting('navbar_inverse', TRUE)) {
      $variables->navbar_attributes->addClass('navbar-dark');
    }

    $navbar_position = $this->theme->getSetting('navbar_position', 'static-top');
    $variables->navbar_attributes->addClass('navbar-' . Html::getClass($navbar_position));

    // Add variable to determine if the route is admin.
    $variables->is_admin_route = DamoBase::isAdminRoute();

    $variables->navbar_attributes->inner_container = FALSE;
    $variables->navbar_attributes->removeClass('navbar-dark');

  }

}
