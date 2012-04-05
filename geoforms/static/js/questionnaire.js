
var popup; //only one popup at the time

/*
This is a helper function that returns
a OpenLayers LonLat object according
to the geometry that is given to it.

This function should bring some consistency
on where to show a popup for each feature.
*/
function get_popup_lonlat(geometry) {
    var lonlat;
    if ( geometry.id.contains("Point") ) {
        lonlat = new OpenLayers.LonLat(
                        geometry.x,
                        geometry.y);
    } else if ( geometry.id.contains("LineString") ) {
        lonlat = new OpenLayers.LonLat(
                        geometry.components[geometry.components.length - 1].x,
                        geometry.components[geometry.components.length - 1].y);
    } else if ( geometry.id.contains("Polygon") ) {
        lonlat = new OpenLayers.LonLat(
                        geometry.components[0].components[0].x,
                        geometry.components[0].components[0].y);
    }
    return lonlat;
}

/*
 popup save feature event handler
 connected to the save button in the popup form
*/
function save_handler(evt) {
    
    //get the form data
    var popup_values = $('form.popupform.active').serializeArray();

    //set the popup form as not active
    $('form.popupform.active').removeClass('active');

    //build new attributes for the features
    for(var val in popup_values) {
        evt.data[0].attributes[popup_values[val]['name']] =
            popup_values[val]['value'];
    }

    //save the geojson
    var gf = new OpenLayers.Format.GeoJSON();
    var geojson = gf.write(evt.data[0]);

    if (evt.data[0].fid === undefined || evt.data[0].fid === null) {

        gnt.geo.create_feature('@me', feature_group, geojson, {
            'success': function(data, textStatus, jqXHR) {
                var new_feature = null;
                // retrieve feature without fid and give it the id from the right layer
                if( data.geometry.type === 'Point') {
                    new_feature = map.getLayersByName('Point Layer')[0].getFeatureByFid(undefined);
                } else if ( data.geometry.type === 'LineString' ) {
                    new_feature = map.getLayersByName('Route Layer')[0].getFeatureByFid(undefined);
                } else if ( data.geometry.type === 'Polygon' ) {
                    new_feature = map.getLayersByName('Area Layer')[0].getFeatureByFid(undefined);
                }
                new_feature.fid = data.id;
        }
    });

    } else {
        //update the feature
        gnt.geo.update_feature(undefined,
                               feature_group,
                               geojson,
                               undefined);
    }

    //unselect feature
    map.getControlsByClass( 'OpenLayers.Control.SelectFeature' )[0].unselectAll(evt);

    //remove popup from map
    if(popup !== undefined) {
        map.removePopup(popup);
        popup = undefined;
    }
}

/*
 popup remove feature event handler,
 connected to the remove button in the popup form.
*/
function remove_handler(evt) {

    evt.data[0].layer.removeFeatures([evt.data[0]]);
    //unselect feature
    map.getControlsByClass( 'OpenLayers.Control.SelectFeature' )[0].unselectAll();

    //if fid found then delete otherwise do nothing
    var gf = new OpenLayers.Format.GeoJSON();
    var geojson = gf.write(evt.data[0]);

    if (evt.data[0].fid !== undefined && evt.data[0].fid !== null) {
        gnt.geo.delete_feature(undefined, feature_group, geojson);
    }

    if(popup !== undefined) {
        map.removePopup(popup);
        popup = undefined;
    }
}

/*
This function makes the popup and shows it for the feature given.

Expects there to be a feature.popup created
that can be called.
*/
function show_popup_for_feature(feature, popup_name) {

    if ( feature.popup !== undefined ) {
        
        //remove old popup if existing
        if(popup !== undefined) {
            map.removePopup(popup);
            popup = undefined;
        }
        
        //create popup and put it on the map
        popup = feature.popup;
        map.addPopup(popup);

        //add a class to the form to recognize it as active
        $('.olFramedCloudPopupContent form[name="' + popup_name + '"]').addClass('active');
        
        // add values to the form the values are connected but the form element name
        // and the name value in the feature attributes
        var input_elements = $('div#' + feature.id + ' form[name="' + popup_name + '"] :input');
        input_elements.each(function() {
            $(this).val( feature.attributes[ $(this).attr( 'name' ) ] );
        });

        //connect the event to the infowindow buttons
        $('form[name="' + popup_name + '"] button.save').click([feature],
                                                               save_handler);
        $('form[name="' + popup_name + '"] button.remove').click([feature],
                                                                 remove_handler);

        return true;

    } else {

        return false;

    }
}

/*
 confirm and save the feature

 The feature popup content and is connected
 with the name of the button that was used
 to draw it on the map. The button name is
 the same as the popup id that is supposed
 to be shown as the content in popup.
*/
function feature_added(evt) {
    
    //get the right lonlat for the popup position
    evt.lonlat = get_popup_lonlat(evt.geometry);

    //get the active buttons popup name
    var name = $('button.ui-state-active').attr('name');
    var popup_name = $('button.ui-state-active').data('popup');
    var popupcontent = " default info content ";

    //get the right content for the popup
    if( popup_name !== undefined ) {
        popupcontent = $('#' + popup_name).html();
    }
    evt.popupClass = OpenLayers.Popup.FramedCloud;
    evt.data = {
        'popupSize': null,
        'popupContentHTML': popupcontent
    };
    evt.attributes.name = name;

    //the createPopup function did not seem to work so here
    evt.popup = new OpenLayers.Popup.FramedCloud(
                        evt.id,
                        evt.lonlat,
                        evt.data.popupSize,
                        evt.data.popupContentHTML,
                        null,
                        false);

    show_popup_for_feature(evt, popup_name);

    //deactivate the map and the drawing
    //unselect the button
    $(".drawbutton.ui-state-active")
        .drawButton( 'deactivate' );
        
    evt.layer.redraw();
}

function on_feature_select_handler(evt) {
    
}

function on_feature_unselect_handler(evt) {
    
}

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
    
    // create the form specific element widgets
    $( ".drawbutton.point" ).drawButton({
        drawcontrol: "pointcontrol"
    });
    $( ".drawbutton.route" ).drawButton({
        drawcontrol: "routecontrol"
    });
    $( ".drawbutton.area" ).drawButton({
        drawcontrol: "areacontrol"
    });
    
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
                                    {'id': 'pointcontrol',
                                    'featureAdded': feature_added});
        var routecontrol = new OpenLayers.Control.DrawFeature(routeLayer,
                                    OpenLayers.Handler.Path,
                                    {'id': 'routecontrol',
                                    'featureAdded': feature_added})
        var areacontrol = new OpenLayers.Control.DrawFeature(areaLayer,
                                    OpenLayers.Handler.Polygon,
                                    {'id': 'areacontrol',
                                    'featureAdded': feature_added})
        
        //select feature control
        var select_feature_control = new OpenLayers.Control.SelectFeature(
                [pointLayer, routeLayer, areaLayer],
                {
                id: 'selectcontrol',
                onSelect: on_feature_select_handler,
                onUnselect: on_feature_unselect_handler,
                toggle: false,
                clickout: true,
                multiple: false,
                hover: false
                });
        
        map.addControls([select_feature_control,
                         pointcontrol,
                         routecontrol,
                         areacontrol ]);
        select_feature_control.activate();
        
        var gf = new OpenLayers.Format.GeoJSON();
        var questionnaire_area_feature = gf.read(questionnaire_area);
        map.setCenter(questionnaire_area_feature[0].geometry.getBounds().getCenterLonLat(), 0);
        map.zoomTo(5);
    });
    
});