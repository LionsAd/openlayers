<?php

/**
 * @file
 * Interaction: Snap.
 */

namespace Drupal\openlayers\Interaction;
use Drupal\openlayers\Types\Interaction;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Interaction\\Snap',
);

/**
 * Class Snap.
 */
class Snap extends Interaction {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $sources = ctools_export_crud_load_all('openlayers_sources');
    $options = array('' => t('<Choose the source>'));
    foreach ($sources as $machine_name => $data) {
      $options[$machine_name] = $data->name;
    }

    $form['options'] = array(
      '#tree' => TRUE,
    );

    $form['options']['source'] = array(
      '#type' => 'select',
      '#title' => t('Source'),
      '#default_value' => isset($form_state['item']->options['source']) ? $form_state['item']->options['source'] : '',
      '#description' => t('Select the vector source.'),
      '#options' => $options,
      '#required' => TRUE,
    );
  }

}
