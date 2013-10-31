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
gnt.questionnaire.is_mobile_user = false;
gnt.map_loaded = false;

//fix for OpenLayers 2.12 RC5 check 29.5.2012 should be null and automatic
OpenLayers.Popup.FramedCloud.prototype.maxSize = new OpenLayers.Size(420, 640);
OpenLayers.Popup.FramedCloud.prototype.minSize = new OpenLayers.Size(320, 140);

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
                this.element.addClass( this.options.classes );
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
                });
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
};

/*
 popup save feature event handler
 connected to the save button in the popup form
*/
gnt.questionnaire.save_handler = function(evt) {
    if (!gnt.do_not_save_questionnaire_answers){

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

    $('#mobile-popup').remove();
    if (gnt.questionnaire.is_mobile_user){
        $('body').removeClass('main map settings');
        $('body').addClass('main');
    }

};

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
    $('#mobile-popup').remove();
};

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
        if (gnt.questionnaire.is_mobile_user) {
            $('body').append(
                $('<div></div>')
                .attr('id','mobile-popup')
                .css('background','white')
                .html(feature.data.contentHTML)
                );
            $('#mobile-popup').dialog({
                modal: true
            });
            $('.ui-dialog').addClass('form_element');
            $('#mobile-popup form[name="' + popup_name + '"]' ).addClass( 'active' );
            $('.ui-dialog-titlebar').css('display','none');
            $('#mobile-popup .popupform').css('max-height',window.innerHeight - 60);
        } else {
            map.addPopup(gnt.questionnaire.popup);
            $( '.olFramedCloudPopupContent form[name="' + popup_name + '"]' ).addClass( 'active' );
        }



        // add values to the form the values are connected but the form element name
        // and the name value in the feature attributes
        if(feature.attributes.form_values === undefined) {
            feature.attributes.form_values = [];
        }

        $('form.popupform.active :input').val(function (index, value) {

            //reserved inputs like private and other feature root values
            if( $(this).attr('name') === 'private' ) { //should be a checkbox

                $(this).attr( 'checked', !feature['private'] );
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
                    } else if($(this).attr( 'type' ) === 'radio' &&
                       $(this).attr('value') === val_obj.value) { //check radiobuttons
                        $(this).prop( 'checked', true);
                        return value;
                    } else if($(this).attr( 'type' ) === 'radio') {
                    } else {
                        return val_obj.value;
                    }
                }
            }
            return value;
        });

        //Create jQuery sliders and update popup size
        gnt.questionnaire.create_widgets('.popupform.active');
        if (!gnt.questionnaire.is_mobile_user) {
            gnt.questionnaire.popup.updateSize();
        }

        //connect the event to the infowindow buttons
        $('form[name="' + popup_name + '"] + div.popup_feature_buttons button').off();
        $('form[name="' + popup_name + '"] + div.popup_feature_buttons button.save').click([feature],
                                                               gnt.questionnaire.save_handler);
        $('form[name="' + popup_name + '"] + div.popup_feature_buttons button.remove').click([feature],
                                                                 gnt.questionnaire.remove_handler);

        return true;

    } else {

        return false;

    }
};

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
};

/*
This function handles the on feature select
where it shows the popup with the correct
values from the feature attributes.
*/
gnt.questionnaire.on_feature_select_handler = function(feature) {
    if (feature.hasOwnProperty('is_geojson_feature')) {
        return;
    }
    gnt.questionnaire.show_popup_for_feature(feature);
};

/*
This function handles the on feature unselect
where it closes the popup.
*/
gnt.questionnaire.on_feature_unselect_handler = function(feature) {
    if (feature.hasOwnProperty('is_geojson_feature')) {
        return;
    }
    //remove popup from map
    map.removePopup(gnt.questionnaire.popup);
    gnt.questionnaire.popup = undefined;
};

gnt.questionnaire.property_change_handler = function(evt) {
    if (gnt.do_not_save_questionnaire_answers){
        return;
    }
    // Without the wait time, it may happen that two properties are posted simultaneously,
    // for example if the user first fills a a text area question and then a checkbox.
    if (gnt.questionnaire.wait_time === undefined){
        gnt.questionnaire.wait_time = 5000;
    } else {
        gnt.questionnaire.wait_time = 0;
    }
    setTimeout(function(){
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
                                    gnt.questionnaire.npvalues.id = data.id;
                                }});
    } else {
        property.id = gnt.questionnaire.property_id;
        gnt.geo.update_property('@me',
                                data_group,
                                '@null',
                                property);
    }
    }, gnt.questionnaire.wait_time);
};
gnt.questionnaire.set_values_to_input_elements = function(data,css_selector) {
    if (gnt.do_not_save_questionnaire_answers){
        return;
    }
    if (typeof css_selector === 'undefined'){
        css_selector = '#forms :input:not(button)';
    }
    gnt.questionnaire.property_id = data.id;
    $(css_selector).each(function(i) {
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
                        $(this).attr('checked', true);
                    }
                }
            } else {
                this.value = data[this.name];
            }
        }
        gnt.questionnaire.npvalues = data;
        delete gnt.questionnaire.npvalues['user'];
        delete gnt.questionnaire.npvalues['time'];
        delete gnt.questionnaire.npvalues['group'];
    });
};
gnt.questionnaire.gnt_getters = [];
gnt.questionnaire.gnt_getters.push(function(){
    //get the properties and set them to the inputs
    gnt.geo.get_properties('@me',
                           data_group,
                           '@null',
                           '@all',
                           {'success': function(data){gnt.questionnaire.set_values_to_input_elements(data);},
                           'complete': function() {
                                //bind on value change to save the values
                                $('#forms :input:not(button)').not('.gnt-lottery').change(gnt.questionnaire.property_change_handler);
                                $('#user-language').change(); // this call has to be made after binding property_change_handler.
                            }});
});
gnt.questionnaire.gnt_getters.push(function(){
        //get the users feature if any
        gnt.geo.get_features(undefined,
                             data_group,
                             '',
            {
                'success': function(data) {
                    if (data.features) {
                        var pl = map.getLayersByName('Point Layer')[0],
                            rl = map.getLayersByName('Route Layer')[0],
                            al = map.getLayersByName('Area Layer')[0],
                            gf = new OpenLayers.Format.GeoJSON(),
                            // Projection objects for transformations
                            source_proj = new OpenLayers.Projection(data.crs.properties.code),
                            target_proj = new OpenLayers.Projection(map.getProjection());
                            popupcontent = " default content ";

                        for(var i = 0; i < data.features.length; i++) {
                            var feature = gf.parseFeature(data.features[i]);
                            //add values losed in parsing should be added again
                            feature['private'] = data.features[i]['private'];
                            // Transform geometry to map projection
                            feature.geometry.transform(source_proj, target_proj);
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
});
gnt.questionnaire.create_accordion = function(accordion){
    if( accordion !== undefined ) {
        var origHash = location.hash.split('#')[1];
        var active_page = 0;
        if(origHash) {
            active_page = origHash.slice(5) - 1;
        }
        // set the size according to active page
        if($('#page_' + (active_page + 1)).hasClass('bigcontent')) {
            $('#main .span_left').switchClass('smallcontent', 'bigcontent', '300');
            $('#main .span_right').switchClass('smallcontent', 'bigcontent', '300');
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
                //scroll to the right place
                $('#main .span_left').scrollTop(0);
            },
            changestart: function(event, ui) {

                //make content big if no drawbuttons on page
                if(ui.newHeader.hasClass('bigcontent')) {
                    $('#main .span_left').switchClass('smallcontent', 'bigcontent', '300');
                    $('#main .span_right').switchClass('smallcontent', 'bigcontent', '300');
                } else {
                    $('#main .span_left').switchClass('bigcontent', 'smallcontent', '300');
                    $('#main .span_right').switchClass('bigcontent', 'smallcontent', '300', 'swing', function(){ map.updateSize();});
                }

            }
        });

        $( window ).bind( 'hashchange', function(event) {
            $('.application-name').remove();
            var newHash = location.hash.split( '#' )[1];
            var newActive = newHash.slice(5) - 1;
            var curActive = $( accordion ).accordion( 'option', 'active' );
            if(curActive !== newActive) {
                $( accordion ).accordion('activate',
                                         newActive);
                //Sometimes there is need to have custom content on one page only
                $( accordion ).trigger({
                        type: "accordionPageChange",
                        page: newActive + 1 // counter starts from 1
                });
            }
        });

        if (window.accordionPageChangeHandler !== undefined) {
            $( accordion ).on('accordionPageChange', accordionPageChangeHandler);
        }
    }
};
gnt.questionnaire.create_geoform_layers = function() {
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
                                    'featureAdded': gnt.questionnaire.feature_added});
        var areacontrol = new OpenLayers.Control.DrawFeature(areaLayer,
                                    OpenLayers.Handler.Polygon,
                                    {'id': 'areacontrol',
                                    'featureAdded': gnt.questionnaire.feature_added});

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
        //Allown map panning over selectable features
        if (typeof(select_feature_control.handlers) != "undefined") {
            select_feature_control.handlers.feature.stopDown = false;
        }

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

        var gf = new OpenLayers.Format.GeoJSON(),
            source_proj,
            target_proj;
        var questionnaire_area_feature = gf.read( questionnaire_area );
        // Projection objects for transformations
        if (questionnaire_area.crs !== undefined) {
            source_proj = new OpenLayers.Projection(questionnaire_area.crs.properties.code);
        }
        else {
            source_proj = new OpenLayers.Projection("EPSG:4326");
        }
        target_proj = new OpenLayers.Projection(map.getProjection());
        // Transform geometry to map projection
        questionnaire_area_feature[0].geometry.transform(source_proj, target_proj);
        map.zoomToExtent( questionnaire_area_feature[0].geometry.getBounds().scale(questionnaire.scale_visible_area) );

        //set to annotations layer if visible
        if(questionnaire.show_area) {
            annotationLayer.addFeatures(questionnaire_area_feature);
        }
        $('.popupform').each(function(){
            $(this)
            .prepend($('<div style="font-weight:bold;"></div>')
                .prepend($('.drawbutton[data-popup="' + $(this).attr('name') + '"]').first().find('span').text())
            );
        });


};
/*
 This function should be called onload to initialize a questionnaire

 popups -- JQuery selector to all popup forms used
 accordion -- jquery selector for the accordion,
              if undefined no accordion is used
 questionnaire_area -- geojson geometry polygon describint the area of the
                       questionnaire
 data_group -- the group that should be used and where the data is stored
 callback -- function to be called after the questionnaire has been set up
*/
gnt.questionnaire.init = function(popups,
                                  accordion,
                                  questionnaire_area,
                                  data_group) {

    gnt.questionnaire.is_mobile_user = window.innerWidth < 770 ? true : false;
    gnt.questionnaire.create_accordion(accordion);

    gnt.map_loaded = gnt.maps.create_map('map');
    if (gnt.map_loaded){
        gnt.after_map_loaded();
    }
            // polyfill HTML 5 widgets

};

gnt.questionnaire.add_result_counter = function(){
        $('#forms').bind('accordionchangestart', function(event, ui) {
            count_results();
        });
};


/*
This function creates widgets for HTML5 elements for browsers that do not support them.

The parameter css_selector can be used to specify where to search for html5 input elements
*/
gnt.questionnaire.create_widgets = function(css_selector) {
    $('body').append($('<div id="slider-tooltip"></div>')
            .css('position','absolute')
            .css('background','white')
            .css('z-index','3000')
            .css('display','none'));
    var i;
    if(css_selector === '') {
        css_selector = '*';
    }
    //HTML 5 fallback create a slider if no browser support
    //if(!Modernizr.inputtypes.range) {
    if(true) { // At the moment Chrome range element fires a billion change events while sliding, so let's use jquery widgets everywhere.
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
        // FF21 hack to change input type to text
        try {
            if(document.defaultView.getComputedStyle(this, null).getPropertyValue("display") == "inline-block") {
                this.type="number";
            }
        } catch(err){};
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
            },
            'start': function(event, ui) {
                $('#slider-tooltip')
                    .text(String(ui.value * step + Number(min)).substr(0,4))
                    .css('left',$(ui.handle).offset().left)
                    .css('top',$(ui.handle).offset().top - 22)
                    .fadeIn('fast');
            },
            'stop': function(event, ui) {
                $('#slider-tooltip').fadeOut('fast');
            },
            'slide': function(event, ui) {
                $('#slider-tooltip')
                    .text(String(ui.value * step + Number(min)).substr(0,4))
                    .css('left',$(ui.handle).offset().left)
                    .css('top',$(ui.handle).offset().top - 22);
            }
        });

        });
    }
};

gnt.questionnaire.geojson_select = function(e){
    var fid;
    if (e.feature.hasOwnProperty('fid')){
        fid = e.feature.fid;
    } else {
        fid = e.feature.data.id;
    }
    $( '.olFramedCloudPopupContent .geojsonpopupform').remove();
    var css_selector = '.olFramedCloudPopupContent .geojsonpopupform :input:not(button)';
    var popup_name = 'geojsonpopup_' + fid.toString();
    var popup = new OpenLayers.Popup.FramedCloud(e.feature.id,
                            e.feature.geometry.getBounds().getCenterLonLat(),
                            new OpenLayers.Size(100,100),
                            $('#'+popup_name).html(),
                            null, true);
    e.feature.popup = popup;
    e.feature.is_geojson_feature = true;
    map.addPopup(popup);
    gnt.questionnaire.set_values_to_input_elements(gnt.questionnaire.npvalues, css_selector);
    $(css_selector).change(gnt.questionnaire.property_change_handler);
    //connect the event to the popup buttons
    $('.olFramedCloudPopupContent div.geojsonpopup_buttons button').off();
    $('.olFramedCloudPopupContent div.geojsonpopup_buttons button.save').click([e],
                                       gnt.questionnaire.geojson_unselect);
    $('.olFramedCloudPopupContent div.geojsonpopup_buttons button.remove').click([e],
                                                        gnt.questionnaire.clear_geojson_form);


};
gnt.questionnaire.geojson_unselect = function(e){
    var feature;
    if (e.hasOwnProperty('feature')) {
        feature = e.feature;

    } else {
        feature = e.data[0].feature;
    }
    if(feature.popup) {
        feature.popup.destroy();
        map.removePopup(feature.popup);
        delete feature.popup;
    }
};
gnt.questionnaire.clear_geojson_form = function(e) {
    $(':input','.olFramedCloudPopupContent .geojsonpopupform')
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected')
        .change();
    gnt.questionnaire.geojson_unselect(e);

};
gnt.questionnaire.make_district_selector = function(translated_zoom_to_district,city_names) {
    function make_callback(name){
        var city_name = name;
        var f = function(data){
            for (var district_name in data.district_coordinates){
                gnt.districts[district_name] = data.district_coordinates[district_name];
            }
            var district_list = data.district_names_ordered;
            var temp_s = '<optgroup label="' + city_name + '">';

            for (var ind=0;ind<district_list.length;ind++){
                temp_s += '<option value="' + district_list[ind] + '">' + district_list[ind] + '</option>';
            }
            temp_s += '</optgroup>';
            $('select[name="zoomable-districts"]')
                .append($(temp_s));
        };
        return f;
    }
    gnt.districts = {}; // longitude-latitudes, for example gnt.districts["Eira"] = [4.0, 3.2]
    var source_proj = new OpenLayers.Projection('EPSG:4326');
    var target_proj = new OpenLayers.Projection('EPSG:3067');
    $('#map').append(
            $('<div></div>')
            .css('position','absolute')
            .css('top','0')
            .css('left','50px')
            .css('padding','6px')
            .css('background','white')
            .css('border','1px solid black')
            .css('z-index','3000')
            .attr('id', 'zoomable-districts')
            .prepend('<strong>' + translated_zoom_to_district + '</strong>')
            .append($('<select name="zoomable-districts"></select>')
                .append($('<option value=""></option>'))
                .css('margin-left','5px')
                .css('min-width','200px')
                .on('change',function(){
                    if (this.value === ""){return;}
                    var new_center = (new OpenLayers.LonLat(
                            gnt.districts[this.value][0],
                            gnt.districts[this.value][1])).transform(source_proj, target_proj);
                    map.setCenter(new_center, 11);
                    }))
            );
    for (var ci=0;ci<city_names.length;ci++){
        $.get('/static/json/kaupunginosat_' + city_names[ci] + '.json',make_callback(city_names[ci]));
    }
};

gnt.questionnaire.addLotteryForm = function(url, thank_you_msg) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    var beforeSend = function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        };

    $('.lottery input#id_email').addClass('gnt-lottery');
    $('.lottery button')
        .click(function(){
            $.ajax({
                url: url,
                type: 'POST',
                data: $('.lottery input#id_email').val(),
                beforeSend: beforeSend
            }).done(function(data){
                        if (data.msg === 'success'){
                            $('.lottery').html($('<p>' + thank_you_msg + '</p>'));
                        }
            });

        });
};
