(function($) {
  Drupal.behaviors.openlayers = {
    attach: function(context, settings) {

      Drupal.openlayers.map = Drupal.openlayers.map || {};
      Drupal.openlayers.layer = Drupal.openlayers.layer || {};
      Drupal.openlayers.source = Drupal.openlayers.source || {};
      Drupal.openlayers.style = Drupal.openlayers.style || {};
      Drupal.openlayers.control = Drupal.openlayers.control || {};
      Drupal.openlayers.interaction = Drupal.openlayers.interaction || {};
      Drupal.openlayers.component = Drupal.openlayers.component || {};

      $('.openlayers-map:not(.asynchronous)').once('openlayers-map', function() {
        var map_id = $(this).attr('id');
        Drupal.openlayers.processMap(map_id, context);
      });

       // Create dynamic callback functions for asynchronous maps.
      $('.openlayers-map.asynchronous').each(function(){
        var map_id = $(this).attr('id');
        if (typeof Drupal.settings.openlayers.maps[map_id] !== 'undefined') {
          Drupal.openlayers.asyncIsReadyCallbacks[map_id.replace(/[^0-9a-z]/gi, '_')] = function() {
            Drupal.openlayers.asyncIsReady(map_id);
          }
        }
      })
    }
  };

  /**
   * Collection of helper methods.
   */
  Drupal.openlayers = {

    processMap: function(map_id, context) {
      if (Drupal.settings.openlayers.maps[map_id] !== undefined) {
        var object = Drupal.settings.openlayers.maps[map_id];

        console.log(object);

        $(document).trigger('openlayers.build_start', [{'type': 'objects', 'objects': object, 'context': context}]);


        var count = 1,
          layers = object.layer || [],
          styles = object.style || [],
          controls = object.control || [],
          interactions = object.interaction || [],
          sources = object.source || [],
          components = object.component || [],
          objects = {sources: {}, controls: {}, interactions: {}, components: {}, styles: {}, layers: {}, maps: {}};

        object.map.opt.layers = [];
        object.map.opt.styles = [];
        object.map.opt.controls = [];
        object.map.opt.interactions = [];
        object.map.opt.components = [];

        try {
          var map = Drupal.openlayers.getObject(context, 'maps', object.map, null, count);
          objects.maps[map.mn] = map;

          count = sources.length;
          sources.map(function(data) {
            if (data.opt !== undefined && data.opt.attributions !== undefined) {
              data.opt.attributions = [new ol.Attribution({
                'html': data.opt.attributions
              })];
            }
            objects.sources[data.mn] = Drupal.openlayers.getObject(context, 'sources', data, map, count--);
          });

          count = controls.length;
          controls.map(function(data) {
            map.addControl(Drupal.openlayers.getObject(context, 'controls', data, map, count--));
          });

          count = interactions.length;
          interactions.map(function(data) {
            objects.interactions[data.mn] = Drupal.openlayers.getObject(context, 'interactions', data, map, count--);
            map.addInteraction(objects.interactions[data.mn]);
          });

          count = styles.length;
          styles.map(function(data) {
            objects.styles[data.mn] = Drupal.openlayers.getObject(context, 'styles', data, map, count--);
          });

          count = layers.length;
          layers.map(function(data) {
            data.opt.source = objects.sources[data.opt.source];
            if ((data.opt.style !== undefined) && (objects.styles[data.opt.style] !== undefined)) {
              data.opt.style = objects.styles[data.opt.style];
            }
            objects.layers[data.mn] = Drupal.openlayers.getObject(context, 'layers', data, map, count--);
            map.addLayer(objects.layers[data.mn]);
          });

          count = components.length;
          components.map(function(data) {
            objects.components[data.mn] = Drupal.openlayers.getObject(context, 'components', data, map, count--);
          });

          // Attach data to map DOM object
          $(document).trigger('openlayers.build_stop', [{'type': 'objects', 'objects': object, 'context': context}]);
          jQuery('body').data('openlayers', {'objects': objects});

        } catch (e) {
          if (typeof console !== 'undefined') {
            Drupal.openlayers.console.log(e.message);
            Drupal.openlayers.console.log(e.stack);
          } else {
            $(this).text('Error during map rendering: ' + e.message);
            $(this).text('Stack: ' + e.stack);
          }
        }
      }
    },

    // Holds dynamic created asyncIsReady callbacks for every map id.
    // The functions are named by the cleaned map id. Everything besides 0-9a-z
    // is replaced by an underscore (_).
    asyncIsReadyCallbacks: {},
    asyncIsReady: function (map_id) {
      if (typeof Drupal.settings.openlayers.maps[map_id] !== 'undefined') {
        Drupal.settings.openlayers.maps[map_id].map.async--;
        if (!Drupal.settings.openlayers.maps[map_id].map.async) {
          $('#' + map_id).once('openlayers-map', function() {
            Drupal.openlayers.processMap(map_id, document);
          });
        }
      }
    },

    getObject: (function (context, type, data, map, count) {
      var cache = $('body').data('openlayers') || {};

      if (typeof cache.objects !== 'undefined') {
        cache = cache.objects;
      } else {
        cache.sources = [];
        cache.controls = [];
        cache.styles = [];
        cache.layers = [];
        cache.interactions = [];
        cache.components = [];
        cache.maps = [];
      }

      cache = $.extend({}, cache.objects, cache);

      $(document).trigger('openlayers.object_pre_alter', [{'type': type, 'mn': data.mn, 'data': data, 'map': map, 'cache': cache, 'context': context, 'count': count}]);
      if (!(data.mn in cache[type])) {
        // TODO: Check why layers and maps doesnt cache.
        try {
          var object = Drupal.openlayers[data['cb']]({
            'opt': data.opt,
            'map': map,
            'context': context,
            'cache': cache
          });
          if (typeof object === 'object') {
            object.mn = data.mn;
          }
        }
        catch (e) {
          // Log errors.
          console.log('Drupal.openlayers.' + data['cb'] + ': ' + e.message);
        }
        cache[type][data.mn] = object;
      } else {
        object = cache[type][data.mn];
      }

      $(document).trigger('openlayers.object_post_alter', [{'type': type, 'object': object, 'data': data, 'map': map, 'cache': cache, 'context': context, 'count': count}]);
      jQuery('body').data('openlayers', {'objects': cache});
      return object;
    }),

    /**
     * Logging implementation that logs using the browser's logging API.
     * Falls back to doing nothing in case no such API is available. Simulates
     * the presece of Firebug's console API in Drupal.openlayers.console.
     */
    console: (function(){
      var api = {};
      var logger;
      if (typeof(console)==="object" && typeof(console.log)==="function"){
        logger = function(){
          // Use console.log as fallback for missing parts of API if present.
          console.log.apply(console, arguments);
        };
      } else {
        logger = function (){
          // Ignore call as no logging facility is available.
        };
      }
      jQuery(["log", "debug", "info", "warn", "exception", "assert", "dir","dirxml", "trace", "group", "groupEnd", "groupCollapsed", "profile","profileEnd", "count", "clear", "time", "timeEnd", "timeStamp", "table","error"]).each(function(index, functionName){
        if (typeof(console)!=="object" || typeof(console[functionName])!=="function"){
          // Use fallback as browser does not provide implementation.
          api[functionName] = logger;
        } else {
          api[functionName] = function(){
            // Use browsers implementation.
            console[functionName].apply(console, arguments);
          };
        }
      });
      return api;
    })()
  };

})(jQuery);
