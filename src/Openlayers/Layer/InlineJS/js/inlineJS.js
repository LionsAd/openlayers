Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.Layer.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return layer;
  }
});
