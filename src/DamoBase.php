<?php

namespace Drupal\damo_theme;

use Drupal\bootstrap\Bootstrap;
use Drupal\Core\Url;
use Drupal\Component\Utility\UrlHelper;

/**
 * The primary class for Damo theme.
 *
 * Provides helper methods.
 *
 * @todo Refactor static methods, tune performance with cache,
 * and/or dependecy injection and constructor with private properties.
 *
 * @ingroup utility
 */
class DamoBase extends Bootstrap {

  /**
   * Gets the Symfony route object.
   *
   * @return \Symfony\Component\Routing\Route
   */
  public static function getRouteObject() {
    return \Drupal::routeMatch()->getRouteObject();
  }

  /**
   * Returns whether the current route is admin or not.
   *
   * @return boolean
   */
  public static function isAdminRoute() {
    /** @var \Symfony\Component\Routing\Route $route */
    $route = self::getRouteObject();
    return (bool) \Drupal::service('router.admin_context')->isAdminRoute($route);
  }

  /**
   * Determine if the current route is the frontpage.
   *
   * This overrides Bootstrap's version because there is no default
   * "cache_context.url.path.is_front" cache context in Drupal core.
   * @see https://www.drupal.org/node/2829588
   *
   * @deprecated Remove this function after 8.3.x is released.
   *
   * @return boolean
   */
  public static function isFront() {
    if (parent::hasIsFrontCacheContext()) {
      return parent::isFront();
    }
    return \Drupal::service('path.matcher')->isFrontPage();
  }

  /**
   * Gets the request URI with escaped query parameters for `?destination`.
   *
   * Needed because of core issue:
   *
   * @see https://www.drupal.org/node/2668794
   * @see \Drupal\Core\Routing\RedirectDestination::get()
   *
   * @deprecated Remove this function after 8.3.x is released.
   *
   * @param boolean $include_query
   *   (Optional) Whether to include the escaped query string to the URI.
   *   Defaults to TRUE.
   *
   * @return string
   *   The full and escaped URI, e.g. "/media%3Fbundle%3Dimage".
   */
  public static function getDestination($include_query = TRUE) {
    if (!$include_query) {
      return \Drupal::destination()->get();
    }

    $uri = \Drupal::destination()->get();
    $query = \Drupal::request()->query;

    if ($query->count()) {
      $query_string = UrlHelper::buildQuery(UrlHelper::filterQueryParameters($query->all()));
      $uri .= "?$query_string";
    }

    return $uri;
  }
}
