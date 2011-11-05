<?php
/**
 * @file
 * Implementation of OpenLayers behavior.
 */

/**
 * Ctools plugin definition.
 */
$plugin = array(
  'title' => t('Zoom to Max Extent'),
  'description' => t('Provides button to zoom to the maximum extent of the map.'),
  'type' => 'map',
  'behavior' => array(
    'class' => 'openlayers_behavior_zoomtomaxextent',
    'parent' => 'openlayers_behavior',
  ),
);

/**
 * Zoom to Max Extent Behavior
 */
class openlayers_behavior_zoomtomaxextent extends openlayers_behavior {
  /**
   * Provide initial values for options.
   */
  function options_init() {
    return array(
      'zoomtomaxextent' => '',
    );
  }

  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers') . 
      '/includes/behaviors/js/openlayers_behavior_zoomtomaxextent.js');
    return $this->options;
  }
}