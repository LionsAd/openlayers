<?php
/**
 * @file
 * Implementation of OpenLayers behavior.
 */

/**
 * Ctools plugin definition.
 */
$plugin = array(
  'title' => t('ArgParser'),
  'description' => t('Parses Permalink-formatted arguments without adding a 
    Permalink link to the map'),
  'type' => 'layer',
  'behavior' => array(
    'class' => 'openlayers_behavior_argparser',
    'parent' => 'openlayers_behavior',
  ),
);

/**
 * Attribution Behavior
 */
class openlayers_behavior_argparser extends openlayers_behavior {
  /**
   * Provide initial values for options.
   */
  function options_init() {
    return array(
      'attribution' => '',
    );
  }

  function js_dependency() {
    return array('OpenLayers.Control.ArgParser');
  }

  function options_form($defaults) {
    return array(
    );
  }

  /**
   * Render.
   */
  function render(&$map) {
    drupal_add_js(drupal_get_path('module', 'openlayers') . 
      '/includes/behaviors/js/openlayers_behavior_argparser.js');
    return $this->options;
  }
}