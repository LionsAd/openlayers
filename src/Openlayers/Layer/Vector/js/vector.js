Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Layer.internal.vector',
  init: function(data) {

    var layer = new ol.layer.Vector(data.opt);
    // Check if this layer is activated for dedicated zoom levels.
    if (data.opt.zoomActivity) {
      var zoomSpecificVisibility = function() {
        layer.setVisible(typeof(data.opt.zoomActivity[data.map.getView().getZoom()]) != 'undefined');
      };
      data.map.getView().on('change:resolution', zoomSpecificVisibility);
    }

    return layer;
  }
});
