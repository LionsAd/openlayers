<?php
// $Id$

/**
 * @file
 * This file holds the functions for the openlayers Admin settings.
 */

/**
 * Menu callback; displays the openlayers module settings page.
 *
 * @ingroup forms
 * @see system_settings_form()
 */
function openlayers_admin_settings() {
openlayers_intialize();

  // Source description
  // @@TODO: use the t() function properly.
  $source_description = t('
    The source for the OpenLayers library can be one of two things:
    <ul>
      <li>URL: This means that the OpenLayers JS library is not hosted on this site.  OpenLayers provides a hosted JS file.  By default the Open Layers module, will use this, since the JS file cannot be included with the module.  This is <em>http://openlayers.org/api/OpenLayers.js</em>.  This will may effect performance as it is not hosted on your site. Also, depending on how the OpenLayers JS API changes, this module may not be compatible with this version.</li>
      <li>Drupal Path: This is a path relative to the Drupal base.  For instance, if you <a href="http://openlayers.org/">Download OpenLayers</a> manually to the OpenLayers module folder and extract it, you may use a value like: <em>' .  drupal_get_path('module', 'openlayers') . '/OpenLayers-2.7/OpenLayers.js</em>.</li>
    </ul>
  ');

  // Define Form
  $form['openlayers_source'] = array(
    '#type' => 'textfield',
    '#title' => t('OpenLayers Source'),
    '#description' => $source_description,
    '#default_value' => variable_get('openlayers_source', 'http://openlayers.org/api/OpenLayers.js'),
  );
  $form['openlayers_default'] = array(
    '#type' => 'fieldset',
    '#title' => t('OpenLayers Defaults'),
    '#description' => t('These are values that will be used if none are specified.'),
    '#collapsed' => FALSE,
    '#collapsible' => TRUE,
  );
  $form['openlayers_default']['openlayers_default_wms'] = array(
    '#type' => 'textfield',
    '#title' => t('Default WMS '),
    '#description' => t('This is the default WMS to use if none is specified.'),
    '#default_value' => variable_get('openlayers_default_wms', 'http://labs.metacarta.com/wms/vmap0?'),
  );
  
  // Make a system setting form and return
  return system_settings_form($form);
}