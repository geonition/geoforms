{% include "jstranslations.txt" %}

/*
 Questionnaire UI namespace
 
 gnt.questionnaire
*/
gnt.questionnaire = {};

//save non place based values here
gnt.questionnaire.npvalues = {};

gnt.questionnaire.popup; //only one popup at the time
gnt.questionnaire.property_id;

//fix for OpenLayers 2.12 RC5 check 29.5.2012 should be null and automatic
OpenLayers.Popup.FramedCloud.prototype.maxSize = new OpenLayers.Size(550, 1024); 

/*
Draw Button is a drawing
tool that works together with
Openlayers.

Required global variables is a
OpenLayers map object with the
button required draw controls.

control : The id of the map control to use
classes : The classes to add to the widget on initialization
text_class: the class to be added to the span that includes the button text
active_class: the class to use when a button is activated
*/
(function( $ ) {
    $.widget("ui.drawButton",
        {
            options: {
                drawcontrol: "drawcontrol", //the draw control used, required
                geography_type: "point",
                selectcontrol: "selectcontrol",
                classes: "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",
                text_class: "ui-button-text",
                active_class: "ui-state-active",
                disable_class: "ui-button-disabled ui-state-disabled",
                rule_added: false,
                max: 3, //the maximum amount of points/routes/areas that can be drawn with this button
                icons: {
                    primary: undefined,
                    secondary: undefined
                }
            },
            _create: function() {
                this.element.addClass( this.options.classes )
                this.element.bind('click',
                          this.toggle_active);
                var label = this.element.html();
                $( "<span></span>")
                        .addClass( this.options.text_class )
                        .appendTo( this.element.empty() )
                        .html( label )
                        .text();
                
                //add rule to layer for prefered rendering      
                var color = $(this.element).data('color');
                var max = $(this.element).data('max');
                var name = $(this.element).attr('name');
                //add styling rules
                if(!this.options.rule_added) {
                    
                    var egraphic = '/images/svg/place_marker.svg?scale=1&color=' + color.substr(1);
                    var rule = new OpenLayers.Rule({
                        filter: new OpenLayers.Filter.Comparison({
                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                            property: 'name',
                            value: name
                        }),
                        symbolizer: {
                            externalGraphic: egraphic,
                            graphicHeight: 34,
                            graphicWidth: 34,
                            graphicYOffset: -32,
                            strokeColor: color,
                            fillColor: color,
                            cursor: 'pointer'
                            }
                        });
                    if($('html').hasClass('lt-ie9')) {
                        egraphic = '/images/needle?color=' + color.substr(1);
                        rule = new OpenLayers.Rule({
                            filter: new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                property: 'name',
                                value: name
                            }),
                            symbolizer: {
                                externalGraphic: egraphic,
                                graphicHeight: 36,
                                graphicWidth: 23,
                                graphicYOffset: -30,
                                strokeColor: color,
                                fillColor: color,
                                cursor: 'pointer'
                                }
                            });
                    }
                    var drawcontrol_id = this.options['drawcontrol'];
                    var drawcontrol = map.getControl(drawcontrol_id);
                    drawcontrol.layer.styleMap.styles['default'].addRules([rule]);
                    this.options.rule_added = true;
                }
                
                //TOOLTIP
                var tooltip = $(".tooltip");
                if (tooltip.length === 0) {
                    var tooltip_html = '<div class="tooltip"></div>';
                    $(document.body).append(tooltip_html);
                    $(document.body).bind("mousemove", function(evt) {
                    if($(window).width() > 767) {
                        $(".tooltip").css('top', evt.clientY + 5);
                        $(".tooltip").css('left', evt.clientX + 5);
                    }
                })
                }
                $(".tooltip").hide();
            
                return this;
            },

            toggle_active: function(evt) {
                var active_cls = $(this).drawButton('option', 'active_class');
                if($(this).hasClass( active_cls )) {
                    $(this).drawButton('deactivate');
                } else {
                    $(this).drawButton('activate');
                }
            },
            deactivate: function() {
                this.element.removeClass( this.options['active_class'] );
                var drawcontrol_id = this.options['drawcontrol'];
                var drawcontrol = map.getControl(drawcontrol_id);
                drawcontrol.deactivate();
                var selectcontrol_id = this.options['selectcontrol'];
                var selectcontrol = map.getControl(selectcontrol_id);
                selectcontrol.activate();
                
                //TOOLTIP
                $(".tooltip").hide();
                
            },
            activate: function() {
                if(this.element.attr('disabled') !== 'disabled') {
                    
                    //unselect the others
                    $(".drawbutton." + this.options['active_class'])
                        .drawButton('deactivate');
                    this.element.addClass( this.options['active_class'] );
                    var drawcontrol_id = this.options['drawcontrol'];
                    var drawcontrol = map.getControl(drawcontrol_id);
                    drawcontrol.activate();
                    var selectcontrol_id = this.options['selectcontrol'];
                    var selectcontrol = map.getControl(selectcontrol_id);
                    selectcontrol.deactivate();
                    
                    //change the temporary style of the layer
                    var color = $(this.element).data('color');
                    var name = $(this.element).attr('name');
                    
                    var egraphic = '/images/svg/place_marker.svg?scale=1&color=' + color.substr(1);
                    if($('html').hasClass('lt-ie9')) {
                        egraphic = '/images/needle?color=' + color.substr(1);
                        drawcontrol.layer.styleMap.styles.temporary.defaultStyle.graphicHeight = 36;
                        drawcontrol.layer.styleMap.styles.temporary.defaultStyle.graphicWidth = 23;
                        drawcontrol.layer.styleMap.styles.temporary.defaultStyle.graphicYOffset = -30;
                    }
                    drawcontrol.layer.styleMap.styles.temporary.defaultStyle.externalGraphic = egraphic;
                    
                    //add map class to body
                    if(!$('body').hasClass('map')) {
                        $('body').addClass('map');
                    }
                }
                
                //TOOLTIP
                var tooltip = $(".tooltip");
                
                if(this.options.geography_type === "point") {
                    $(".tooltip").html(help.point[0]);   
                } else if (this.options.geography_type === "route") {
                    $(".tooltip").html(help.route[0]);
                } else if (this.options.geography_type === "area") {
                    $(".tooltip").html(help.area[0]);
                }
                $(".tooltip").show();
            },
            disable: function() {
                this.element.removeClass( this.options['active_class'] );
                this.element.addClass( this.options['disable_class'] );
                this.element.attr( 'disabled', 'disabled');
                var drawcontrol_id = this.options['drawcontrol'];
                var drawcontrol = map.getControl(drawcontrol_id);
                drawcontrol.deactivate();
                var selectcontrol_id = this.options['selectcontrol'];
                var selectcontrol = map.getControl(selectcontrol_id);
                selectcontrol.activate();
                
                //TOOLTIP
                $(".tooltip").hide();
            },
            enable: function() {
                this.element.removeClass( this.options['disable_class'] );
                this.element.removeAttr( 'disabled' );
            }
        });
})( jQuery );


/*
This is a helper function that returns
a OpenLayers LonLat object according
to the geometry that is given to it.

This function should bring some consistency
on where to show a popup for each feature.
*/
gnt.questionnaire.get_popup_lonlat = function(geometry) {
    var lonlat;
    
    if ( geometry.id.search( "Point" ) !== -1) {
        lonlat = new OpenLayers.LonLat(
                        geometry.x,
                        geometry.y);
    } else if ( geometry.id.search( "LineString" ) !== -1) {
        lonlat = new OpenLayers.LonLat(
                        geometry.components[geometry.components.length - 1].x,
                        geometry.components[geometry.components.length - 1].y);
    } else if ( geometry.id.search( "Polygon" ) !== -1) {
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
gnt.questionnaire.save_handler = function(evt) {
    
    //get the form data
    var popup_values = $('form.popupform.active').serializeArray();

    //set form value attributes for feature
    evt.data[0].attributes.form_values = popup_values;
    
    //Get the geojson
    var gf = new OpenLayers.Format.GeoJSON();
    var geojson = gf.write(evt.data[0]);
    
    var feature_json = $.parseJSON( geojson );
        
    
    //Assigning Privacy to the Feature if private=false
    var private_field_set = false;
    for ( var i = 0;i < popup_values.length; i++ ) {
        
        if ( popup_values[i]["name"] === "private" ) {
            private_field_set = true;
            if( popup_values[i]['value'] === 'false') {
                feature_json['private'] = false;
                evt.data[0]['private'] = false; 
            } else {
                feature_json['private'] = true;
                evt.data[0]['private'] = true;
            } 
        }
        
        //evt.data[0].private = "false";
    }
    
    if( !private_field_set ) {
        feature_json['private'] = true;
        evt.data[0]['private'] = true;
    }
    geojson = feature_json;
    
      
    //Save the JSON
    if (evt.data[0].fid === undefined || evt.data[0].fid === null) {
        gnt.geo.create_feature('@me', data_group, geojson, {
            'success': function(data, textStatus, jqXHR) {
                var new_feature = null;
                var amount = 0;
                // retrieve feature without fid and give it the id from the right layer
                if( data.geometry.type === 'Point') {
                    new_feature = map.getLayersByName('Point Layer')[0].getFeatureByFid(undefined);
                    amount = map.getLayersByName('Point Layer')[0].getFeaturesByAttribute('name', new_feature.attributes.name).length;
                } else if ( data.geometry.type === 'LineString' ) {
                    new_feature = map.getLayersByName('Route Layer')[0].getFeatureByFid(undefined);
                    amount = map.getLayersByName('Route Layer')[0].getFeaturesByAttribute('name', new_feature.attributes.name).length;
                } else if ( data.geometry.type === 'Polygon' ) {
                    new_feature = map.getLayersByName('Area Layer')[0].getFeatureByFid(undefined);
                    amount = map.getLayersByName('Area Layer')[0].getFeaturesByAttribute('name', new_feature.attributes.name).length;
                }
                new_feature.fid = data.id;
                
                //disable the button if max amount of features has been drawn
                var max = $('button[name=' + new_feature.attributes.name + ']').data('max');
                if(max !== undefined &&
                   amount >= max) {
                    $('button[name=' + new_feature.attributes.name + ']').drawButton('disable');
                }
                
            }
        });
        
    } else {
        //update the feature
        gnt.geo.update_feature(undefined,
                               data_group,
                               geojson,
                               undefined);
    }

    //unselect feature
    map.getControlsByClass( 'OpenLayers.Control.SelectFeature' )[0].unselectAll(evt);

    //set the popup form as not active
    $( 'form.popupform.active' ).removeClass( 'active' );
    
    //remove popup from map
    if(gnt.questionnaire.popup !== undefined) {
        map.removePopup(gnt.questionnaire.popup);
        gnt.questionnaire.popup = undefined;
    }
    
}

/*
 popup remove feature event handler,
 connected to the remove button in the popup form.
*/
gnt.questionnaire.remove_handler = function(evt) {
    
    //enable drawbutton if amount of feature under max
    var max = $('button[name=' + evt.data[0].attributes.name + ']').data('max');
    var amount = evt.data[0].layer.getFeaturesByAttribute('name', evt.data[0].attributes.name).length - 1;
    if(amount < max) {
        $('button[name=' + evt.data[0].attributes.name + ']').drawButton('enable');
    }
    evt.data[0].layer.removeFeatures([evt.data[0]]);
    //unselect feature
    map.getControlsByClass( 'OpenLayers.Control.SelectFeature' )[0].unselectAll();

    //if fid found then delete otherwise do nothing
    var gf = new OpenLayers.Format.GeoJSON();
    var geojson = gf.write(evt.data[0]);

    if (evt.data[0].fid !== undefined && evt.data[0].fid !== null) {
        gnt.geo.delete_feature(undefined, data_group, geojson);
    }

    if(gnt.questionnaire.popup !== undefined) {
        map.removePopup( gnt.questionnaire.popup );
        gnt.questionnaire.popup = undefined;
    }
}

/*
This function makes the popup and shows it for the feature given.

Expects there to be a feature.popup created
that can be called.
*/
gnt.questionnaire.show_popup_for_feature = function(feature, popup_name) {
    
    if ( feature.popup !== undefined ) {
        
        if( popup_name === undefined ) {
            popup_name = $('.drawbutton[name=' +
                           feature.attributes.name +
                           ']').data( 'popup' );
        }
        //remove old popup if existing
        if( gnt.questionnaire.popup !== undefined ) {
            map.removePopup( gnt.questionnaire.popup );
            gnt.questionnaire.popup = undefined;
        }
        
        //create popup and put it on the map
        gnt.questionnaire.popup = feature.popup;
        map.addPopup(gnt.questionnaire.popup);
        //map.addPopup(gnt.questionnaire.popup);
        
        //add a class to the form to recognize it as active
        $( '.olFramedCloudPopupContent form[name="' + popup_name + '"]' ).addClass( 'active' );

        
        // add values to the form the values are connected but the form element name
        // and the name value in the feature attributes
        if(feature.attributes.form_values === undefined) {
            feature.attributes.form_values = [];
        }
        
        $('form.popupform.active :input').val(function (index, value) {
            
            //reserved inputs like private and other feature root values
            if( $(this).attr('name') === 'private' ) { //should be a checkbox
                
                $(this).attr( 'checked', !feature['private'] )
            }
            
            for(var i = 0; i < feature.attributes.form_values.length; i++) {
                var val_obj = feature.attributes.form_values[i];
                
                if($(this).attr('name') === val_obj.name) {
                
                    //this shuold be done for all kinds of multiple value inputs
                    if($(this).attr('type') === 'checkbox' &&
                       $(this).attr('value') === val_obj.value) { //check checkboxes
                        
                        $(this).attr( 'checked', true);
                        return value;
                    } else if($(this).attr( 'type' ) === 'checkbox') {
                    } else {
                        return val_obj.value;
                    }
                }
            }
            return value;
        });

        //Create jQuery sliders and update popup size
        gnt.questionnaire.create_widgets('.popupform.active');
        gnt.questionnaire.popup.updateSize();
        
        //connect the event to the infowindow buttons
        $('form[name="' + popup_name + '"] button.save').click([feature],
                                                               gnt.questionnaire.save_handler);
        $('form[name="' + popup_name + '"] button.remove').click([feature],
                                                                 gnt.questionnaire.remove_handler);

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
gnt.questionnaire.feature_added = function(evt) {
    
    //get the right lonlat for the popup position
    evt.lonlat = gnt.questionnaire.get_popup_lonlat(evt.geometry);

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
        'contentHTML': popupcontent
    };
    evt.attributes.name = name;
    
    //the createPopup function did not seem to work so here
    evt.popup = new OpenLayers.Popup.FramedCloud(
                        evt.id,
                        evt.lonlat,
                        new OpenLayers.Size(100,100),
                        evt.data.contentHTML,
                        null,
                        false,
                        undefined);
    
    gnt.questionnaire.show_popup_for_feature(evt, popup_name);

    //deactivate the map and the drawing
    //unselect the button
    $(".drawbutton.ui-state-active")
        .drawButton( 'deactivate' );
        
    evt.layer.redraw();
}

/*
This function handles the on feature select
where it shows the popup with the correct
values from the feature attributes.
*/
gnt.questionnaire.on_feature_select_handler = function(evt) {
    gnt.questionnaire.show_popup_for_feature(evt);
}

/*
This function handles the on feature unselect
where it closes the popup.
*/
gnt.questionnaire.on_feature_unselect_handler = function(evt) {
    //remove popup from map
    map.removePopup(gnt.questionnaire.popup);
    gnt.questionnaire.popup = undefined;
}

/*
 This function should be called onload to initialize a questionnaire
 
 forms -- jQuery selector to all the forms that should be created/handled
 popups -- JQuery selector to all popup forms used
 accordion -- jquery selector for the accordion,
              if undefined no accordion is used
 questionnaire_area -- geojson geometry polygon describint the area of the
                       questionnaire
 data_group -- the group that should be used and where the data is stored
 callback -- function to be called after the questionnaire has been set up
*/
gnt.questionnaire.init = function(forms,
                                  popups,
                                  accordion,
                                  questionnaire_area,
                                  data_group,
                                  callback) {
    
    //create a session for the anonymoususer
    gnt.auth.create_session();
    
    
    if( accordion !== undefined ) {
        var origHash = location.hash.split('#')[1];
        var active_page = 0;
        if(origHash) {
            active_page = origHash.slice(5) - 1;
        }
        // set the size according to active page
        if($('#page_' + (active_page + 1)).hasClass('bigcontent')) {
            $('#main .span_left').switchClass('smallcontent', 'bigcontent', '500');
            $('#main .span_right').switchClass('smallcontent', 'bigcontent', '500');
        }
        
        //create accordion
        $( accordion ).accordion({
            active: active_page,
            autoHeight: false,
            change: function(event, ui) {
                var oldHash = location.hash.split('#')[1];
                var pageNr = ui.options.active + 1;
                var newHash = 'page_' + pageNr;
                if(oldHash !== newHash) {
                    location.hash = newHash;
                }
                if(ui.newHeader.hasClass('bigcontent')) {
                    $('#main .span_left').switchClass('smallcontent', 'bigcontent', '500');
                    $('#main .span_right').switchClass('smallcontent', 'bigcontent', '500');
                } else {
                    $('#main .span_left').switchClass('bigcontent', 'smallcontent', '300');
                    $('#main .span_right').switchClass('bigcontent', 'smallcontent', '300', 'swing', function(){ map.updateSize();});
                }
                //scroll to the right place
                $('#main .span_left').scrollTop(0);
            }/*,
            changestart: function(event, ui) {
                
                //make content big if no drawbuttons on page
                if(ui.newHeader.hasClass('bigcontent')) {
                    $('#main .span_left').switchClass('smallcontent', 'bigcontent', '3000');
                    $('#main .span_right').switchClass('smallcontent', 'bigcontent', '3000');
                } else {
                    $('#main .span_left').switchClass('bigcontent', 'smallcontent', '3000');
                    $('#main .span_right').switchClass('bigcontent', 'smallcontent', '3000');
                }
                
            }*/
        });
        
        $( window ).bind( 'hashchange', function(event) {
            var newHash = location.hash.split( '#' )[1];
            var newActive = newHash.slice(5) - 1;
            var curActive = $( accordion ).accordion( 'option', 'active' );
            if(curActive !== newActive) {
                $( accordion ).accordion('activate',
                                         newActive);
            }
        });
    }
    
    //get the properties and set them to the inputs
    gnt.geo.get_properties('@me',
                           data_group,
                           '@null',
                           '@all',
                           {'success': function(data) {
                                gnt.questionnaire.property_id = data.id;
                                $(forms + ' :input:not(button)').each(function(i) {
                                    //if many results use the last one
                                    if(data['totalResults'] !== undefined) {
                                        var nr = data['totalResults'];
                                        data = data['entry'][nr - 1];
                                    }
                                    if(data[this.name] !== undefined) {
                                        if(this.type === 'radio') {
                                            if(this.value === data[this.name]) {
                                                $(this).attr('checked', true);
                                            }
                                        } else if(this.type === 'textarea') {
                                            $(this).text(data[this.name]);
                                        } else if(this.type === 'checkbox') {
                                            for(var j = 0; j < data[this.name].length; j++) {
                                                if($(this).attr('value') === data[this.name][j]) {
                                                    $(this).attr('checked', 'checked');
                                                }
                                            }
                                        } else {
                                            this.value = data[this.name];
                                        }
                                    }
                                    gnt.questionnaire.npvalues = data;
                                    delete gnt.questionnaire.npvalues['user'];
                                    delete gnt.questionnaire.npvalues['time'];
                                    delete gnt.questionnaire.npvalues['id'];
                                    delete gnt.questionnaire.npvalues['group'];
                                });
                           },
                           'complete': function() {
                                //bind on value change to save the values
                                $(forms + ' :input:not(button)').change(function(evt) {
                                    var new_value = evt.currentTarget.value;
                                    if(evt.currentTarget.type === 'checkbox') {
                                        new_value = [];
                                        $('[name=' + evt.currentTarget.name + ']:checkbox:checked').each(function() {
                                            new_value.push($(this).attr('value'));
                                        });
                                    }
                                    var property = {};
                                    property[evt.currentTarget.name] = new_value;
                                    if(new_value === '' || new_value === []) {
                                        delete gnt.questionnaire.npvalues[evt.currentTarget.name];
                                    } else {
                                        gnt.questionnaire.npvalues[evt.currentTarget.name] = new_value;
                                    }
                                    
                                    if(gnt.questionnaire.property_id === undefined) {
                                        gnt.geo.create_property('@me',
                                                                data_group,
                                                                '@null',
                                                                property,
                                                                {'success': function(data) {
                                                                    gnt.questionnaire.property_id = data.id;
                                                                }});
                                    } else {
                                        property.id = gnt.questionnaire.property_id;
                                        gnt.geo.update_property('@me',
                                                                data_group,
                                                                '@null',
                                                                property);
                                    }
                                });
                            }});
    
    gnt.maps.create_map('map', function(map) {
        //annotations from the questionnaire creater
        var annotationLayer = new OpenLayers.Layer.Vector(
                    layer_names.annotationsLayer,
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                strokeWidth: 4,
                                strokeDashstyle: 'dash',
                                strokeColor: $('.base_textcolor').css('color'),
                                fillOpacity: 0,
                                strokeLinecap: 'butt'
                            }
                        })
                    }
                    );
        var pointLayer = new OpenLayers.Layer.Vector(
                    "Point Layer",
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                externalGraphic: '/images/svg/place_marker.svg?scale=1&color=ee9900',
                                graphicHeight: 34,
                                graphicWidth: 34,
                                graphicYOffset: -32,
                                cursor: 'pointer'
                            },
                            'temporary': {
                                externalGraphic: "/images/svg/place_marker.svg?scale=1&color=ee9900",
                                graphicHeight: 34,
                                graphicWidth: 34,
                                graphicYOffset: -32
                            }
                        })
                    });
        var routeLayer = new OpenLayers.Layer.Vector(
                    "Route Layer",
                    {
                        styleMap: new OpenLayers.StyleMap({
                            'default': {
                                strokeWidth: 3,
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
        

        map.addLayers([annotationLayer,
                       areaLayer,
                       routeLayer,
                       pointLayer]);
    
        var pointcontrol = new OpenLayers.Control.DrawFeature(pointLayer,
                                    OpenLayers.Handler.Point,
                                    {'id': 'pointcontrol',
                                    'featureAdded': gnt.questionnaire.feature_added});
        var routecontrol = new OpenLayers.Control.DrawFeature(routeLayer,
                                    OpenLayers.Handler.Path,
                                    {'id': 'routecontrol',
                                    'featureAdded': gnt.questionnaire.feature_added})
        var areacontrol = new OpenLayers.Control.DrawFeature(areaLayer,
                                    OpenLayers.Handler.Polygon,
                                    {'id': 'areacontrol',
                                    'featureAdded': gnt.questionnaire.feature_added})
        
        //select feature control
        var select_feature_control = new OpenLayers.Control.SelectFeature(
                [pointLayer, routeLayer, areaLayer],
                {
                id: 'selectcontrol',
                onSelect: gnt.questionnaire.on_feature_select_handler,
                onUnselect: gnt.questionnaire.on_feature_unselect_handler,
                toggle: false,
                clickout: true,
                multiple: false,
                hover: false
                });
        
        map.addControls([select_feature_control,
                         pointcontrol,
                         routecontrol,
                         areacontrol ]);
        
        // create the form specific element widgets
        $( ".drawbutton.point" ).drawButton({
            drawcontrol: "pointcontrol",
            geography_type: "point"
        });
        $( ".drawbutton.route" ).drawButton({
            drawcontrol: "routecontrol",
            geography_type: "route"
        });
        $( ".drawbutton.area" ).drawButton({
            drawcontrol: "areacontrol",
            geography_type: "area"
        });
        
        select_feature_control.activate();
        
        var gf = new OpenLayers.Format.GeoJSON();
        var questionnaire_area_feature = gf.read( questionnaire_area );
        //map.zoomTo(11);
        map.zoomToExtent( questionnaire_area_feature[0].geometry.getBounds().scale(questionnaire.scale_visible_area) );
        
        //set to annotations layer if visible
        if(questionnaire.show_area) {
            annotationLayer.addFeatures(questionnaire_area_feature);
        }
        
       
        //get the users feature if any
        gnt.geo.get_features(undefined,
                             data_group,
                             '',
            {
                'success': function(data) {
                    if (data.features) {
                        var pl = map.getLayersByName('Point Layer')[0];
                        var rl = map.getLayersByName('Route Layer')[0];
                        var al = map.getLayersByName('Area Layer')[0];
                        var gf = new OpenLayers.Format.GeoJSON();
                        var popupcontent = " default content ";
           
                        for(var i = 0; i < data.features.length; i++) {
                            var feature = gf.parseFeature(data.features[i]);
                            //add values losed in parsing should be added again
                            feature['private'] = data.features[i]['private']; 
                            feature.lonlat = gnt.questionnaire.get_popup_lonlat(feature.geometry);
                            
                            var popup_name = $('.drawbutton[name=' +
                                            feature.attributes.name +
                                            ']').data('popup');
                            
                            if(feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.Point') {
                                pl.addFeatures(feature);
                            } else if(feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.LineString') {
                                rl.addFeatures(feature);
                            } else if(feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.Polygon') {
                                al.addFeatures(feature);
                            }
                            popupcontent = $('#' + popup_name).html();
                            
                            feature.popupClass = OpenLayers.Popup.FramedCloud;
                            feature.data = {
                                contentHTML: popupcontent
                            };

                            //the createPopup function did not seem to work so here
                            feature.popup = new OpenLayers.Popup.FramedCloud(
                                                feature.id,
                                                feature.lonlat,
                                                null,
                                                feature.data.contentHTML,
                                                null,
                                                false);
                        }
                            
                        //disable drawbuttons that has max number of features
                        $('button.drawbutton.point').each(function(index, element) {
                            var amount = pl.getFeaturesByAttribute('name', $(element).attr('name')).length;
                            var max = $(element).data('max');
                            if(max !== undefined &&
                               amount >= max) {
                                $('button[name=' + $(element).attr('name') + ']').drawButton('disable');
                            }
                        });
                        $('button.drawbutton.route').each(function(index, element) {
                            var amount = rl.getFeaturesByAttribute('name', $(element).attr('name')).length;
                            var max = $(element).data('max');
                            if(max !== undefined &&
                               amount >= max) {
                                $('button[name=' + $(element).attr('name') + ']').drawButton('disable');
                            }
                        });
                        $('button.drawbutton.area').each(function(index, element) {
                            var amount = al.getFeaturesByAttribute('name', $(element).attr('name')).length;
                            var max = $(element).data('max');
                            if(max !== undefined &&
                               amount >= max) {
                                $('button[name=' + $(element).attr('name') + ']').drawButton('disable');
                            }
                        });
                    }
                }
            });
        
        // polyfill HTML 5 widgets
        gnt.questionnaire.create_widgets('#forms');
        
        //the point where everything is done for callback
        if(callback !== undefined) {
            callback();
        }
    });
};

/*
This function creates widgets for HTML5 elements for browsers that do not support them.

The parameter css_selector can be used to specify where to search for html5 input elements
*/
gnt.questionnaire.create_widgets = function(css_selector) {
    var i;
    if(css_selector === '') {
        css_selector = '*'
    }
    //HTML 5 fallback create a slider if no browser support
    if(!Modernizr.inputtypes.range) {
        var range_elements = $(css_selector).find('input[type=range]').each(function() {
        var min;
        var max;
        var step;
        var value;
        //hide the range inputs
        $(this).hide();
        min = $(this).attr('min');
        max = $(this).attr('max');
        step = $(this).attr('step');
        value = $(this).attr('value');
        name = $(this).attr('name');
        $(this).after('<div class="slider ' + name + '" data-input="' + name + '"></div>');
        //the step has to be a integer e.g. step is 1,2,3,4,,, in UI sliders
            
            
        $('.slider.' + name).slider({
            'max': (max - min)/step,
            'min': 0,
            'step': 1,
            'value': (value - min)/step,
            'input_element': this,
            'change': function(event, ui) {
                $($(this).slider( "option", "input_element")).attr('value', String(ui.value * step + Number(min)));
                $($(this).slider( "option", "input_element")).change();
            }
        });
            
        });
    }
};
