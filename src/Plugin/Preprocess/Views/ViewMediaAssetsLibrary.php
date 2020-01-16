<?php

namespace Drupal\damo_theme\Plugin\Preprocess\Views;

use Drupal\damo_theme\Plugin\Preprocess\Views\ViewMediaLibrary;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;

/**
 * Pre-processes variables for the "views_view__media_assets_library" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("views_view__media_assets_library")
 */
class ViewMediaAssetsLibrary extends ViewMediaLibrary {}
