Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Layer.internal.image',
  init: function(data) {
    return new ol.layer.Image(data.opt);
  }
});
