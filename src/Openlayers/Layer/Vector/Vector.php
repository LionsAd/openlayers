<?php
/**
 * @file
 * Layer: Vector.
 */

namespace Drupal\openlayers\Layer;
use Drupal\openlayers\Types\Layer;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Layer\\Vector',
);

/**
 * Class Vector.
 */
class Vector extends Layer {

  /**
   * {@inheritdoc}
   */
  public function defaultProperties() {
    $default_properties = parent::defaultProperties();
    $default_properties['options']['zoomActivity'] = '';
    return $default_properties;
  }

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['zoomActivity'] = array(
      '#title' => t('Show on certain zoom levels only'),
      '#description' => t('Define a zoom level per line, keep empty to show the layer always.'),
      '#type' => 'textarea',
      '#default_value' => $this->getOption('zoomActivity'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getJS() {
    $js = parent::getJS();
    // Ensure we've sane zoom levels.
    if (!empty($js['opt']['zoomActivity'])) {
      $js['opt']['zoomActivity'] = array_map('intval', explode("\n", $js['opt']['zoomActivity']));
      // Ensure the zoom levels are also used as keys.
      $js['opt']['zoomActivity'] = array_combine($js['opt']['zoomActivity'], $js['opt']['zoomActivity']);
    }
    return $js;
  }
}
