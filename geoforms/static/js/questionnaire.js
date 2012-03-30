jQuery(document).ready(function() {
    //create widgets and add event listeners
    $( '#forms' ).accordion({
        autoHeight: false,
        collapsible: true
        });
    
    $('#forms button.next').click(function(event) {
        var classlist = $(event.currentTarget).attr('class').split(/\s+/);
        $.each( classlist, function(index, item) {
            if(item.match(/section./) !== null) {
                $( '#forms' ).accordion( 'activate',
                                        item.slice(7) - 1);
            }
        });
    });
    
    $('#forms button.previous').click(function(event) {
        var classlist = $(event.currentTarget).attr('class').split(/\s+/);
        $.each( classlist, function(index, item) {
            if(item.match(/section./) !== null) {
                $( '#forms' ).accordion( 'activate',
                                        item.slice(7) - 1);
            }
        });
    });
    
    $('.drawbutton').drawButton();
    
    // MAP RELATED CODE BELOW
    /*
    OpenLayers.Lang.setCode('fi');
    var mapOptions = {
        maxExtent: new OpenLayers.Bounds(89949.504,
                                         6502687.508,
                                         502203.000,
                                         7137049.802),
        projection: "EPSG:3067",
        maxResolution: 50,
        numZoomLevels: 10,
        tileSize: new OpenLayers.Size(512, 512)
    };
    map = new OpenLayers.Map('map', mapOptions);

    var arcgisLayer = new OpenLayers.Layer.ArcGIS93Rest(
        "kartta",
        "https://pehmogis.tkk.fi/ArcGIS/rest/services/suomi/MapServer/export",
        {layers: "show:0,7,43,79,115,150,151,187,222,258,294,330",
        format: "png24"},
        {isBaseLayer: true,
        maxExtent: new OpenLayers.Bounds(
            390523.0685,
            6700070.816,
            399368.006,
            6709752.84725),
        buffer: 0}
    );
    */
    create_map('map', function(map) {
        var pointLayer = new OpenLayers.Layer.Vector(
                    "Point Layer",
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                externalGraphic: "/images/needle?color=ee9900",
                                graphicHeight: 36,
                                graphicWidth: 23,
                                graphicYOffset: -30,
                                cursor: 'pointer'
                            },
                            'temporary': {
                                externalGraphic: "/images/needle?color=ee9900",
                                graphicHeight: 36,
                                graphicWidth: 23,
                                graphicYOffset: -30
                            }
                        })
                    });
        var routeLayer = new OpenLayers.Layer.Vector(
                    "Route Layer",
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                strokeWidth: 2,
                                strokeColor: '#ee9900',
                                cursor: 'pointer'
                            }
                        })
                    });
        var areaLayer = new OpenLayers.Layer.Vector(
                    "Area Layer",
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                strokeWidth: 2,
                                strokeColor: '#ee9900',
                                cursor: 'pointer',
                                fillColor: '#ee9900',
                                fillOpacity: 0.3
                            }
                        })
                    });
    
        map.addLayers([areaLayer,
                       routeLayer,
                       pointLayer]);
    
        var pointcontrol = new OpenLayers.Control.DrawFeature(pointLayer,
                                    OpenLayers.Handler.Point,
                                    {'id': 'pointcontrol'});
        var routecontrol = new OpenLayers.Control.DrawFeature(routeLayer,
                                    OpenLayers.Handler.Path,
                                    {'id': 'routecontrol'})
        var areacontrol = new OpenLayers.Control.DrawFeature(areaLayer,
                                    OpenLayers.Handler.Polygon,
                                    {'id': 'areacontrol'})
        
        map.addControls([pointcontrol, routecontrol, areacontrol ]);
        
        var gf = new OpenLayers.Format.GeoJSON();
        var questionnaire_area_feature = gf.read(questionnaire_area);
        map.setCenter(questionnaire_area_feature[0].geometry.getBounds().getCenterLonLat(), 0);
        map.zoomTo(5);
    });
    
});