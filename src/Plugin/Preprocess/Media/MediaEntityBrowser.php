<?php

namespace Drupal\damo_theme\Plugin\Preprocess\Media;

use Drupal\damo_theme\DamoBase;
use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Variables;
use Drupal\bootstrap\Utility\Element;
use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Pre-processes variables for the "media__entity_browser" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("media__entity_browser")
 */
class MediaEntityBrowser extends MediaLibrary {}
