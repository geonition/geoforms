
function makeHighlightCtrl() {
    hctrl = new OpenLayers.Control.SelectFeature(
        map.getControl('selectcontrol').layers.concat(map.getLayersByName('Others Layer')[0]),
        {
            hover: true,
            highlightOnly: true,
            multiple: true,
            renderIntent: 'highlight',
            eventListeners: {
                featurehighlighted: function (e) {
                    //fix for unhighlight in OpenLayers not always triggering
                    $('ul.feature_comments li:visible').fadeOut(500);
                    var feat_str = '<li class="' +e.feature.id +'">';
                    feat_str += e.feature.attributes.name + '<br />';
                    for (i = 0; i < e.feature.attributes.form_values.length; i += 1) {
                                feat_str += '<br />' + e.feature.attributes.form_values[i].name +
                                                 '<br />' +
                                                 e.feature.attributes.form_values[i].value +'<br />';
                            /*} else if ($('ul.feature_comments li.' + e.feature.id + ' span.comment').text() !== e.feature.attributes.form_values[i].value) {
                                $('ul.feature_comments li.' + e.feature.id + ' span.comment').text(e.feature.attributes.form_values[i].value);
                            }*/
                    }
                    var create_time_string,
                        username,
                        anonymous_regexp,
                        show_list_item = $('ul.feature_comments li.' + e.feature.id);
                        username = e.feature.attributes.user;
                        anonymous_regexp = new RegExp('T[0-9]+.[0-9]+R[0-9]+.[0-9]+');
                        if (anonymous_regexp.test(username) || username === undefined) {
                            username = '';
                        }
                        create_time_string = '';
                        if (e.feature.attributes.time !== undefined) {
                            create_time_string = $.datepicker.formatDate('D, d M yy',
                                                     $.datepicker.parseDate('yy-mm-dd', e.feature.attributes.time.create_time.split('T')[0]));
                        }
                    feat_str += '<br /><br />' +
                                     username +
                                     ' ' +
                                     create_time_string + '</li>';
                    console.log(feat_str);
                    $('ul.feature_comments').prepend(feat_str);
                    show_list_item = $('ul.feature_comments li.' + e.feature.id);
                    show_list_item.stop(true, true);
                    show_list_item.fadeIn(500);
                },
                featureunhighlighted: function (e) {
                    var hide_list_item = $('ul.feature_comments li.' + e.feature.id);
                    hide_list_item.stop(true, true);
                    hide_list_item.fadeOut(500);
                }
            }
        }
    );
    return hctrl;
}
function make_style_getter(){
    var current = 0;
    var name2style = {};
    var colorlist = ['#CC0000',
                    '#990099',
                    '#3333CC',
                    '#0099FF',
                    '#29A3A3',
                    '#297A29',
                    '#33D633',
                    '#E6E600',
                    '#663300'];
    return function(name){
        if (!(name in name2style))
        {
            name2style[name] = { 
                strokeWidth: 5,
                strokeColor: colorlist[current++ % 10],
                fillColor: 'black',
                cursor: 'pointer',
                fillOpacity : 0.1,
                pointRadius: 6
                };
        };
        return name2style[name];
    };
};
var default_style = {
                    strokeWidth: 3,
                    strokeColor: 'red',
                    //strokeColor: '#aaaaff',
                    cursor: 'pointer',
                    fillColor: '#aaaaff',
                    fillOpacity: 0.3,
                    pointRadius: 5
                };
var highlight_style = {
                    strokeWidth: 3,
                    strokeColor: '#555555',
                    cursor: 'pointer',
                    fillColor: '#555555',
                    fillOpacity: 0.3,
                    pointRadius: 5
                }

//
// This is the function to be called as the last argument to gnt.questionnaire.init()
function show_feedback() {
        
    var get_style_for_name = make_style_getter();

    var i,
        highlightCtrl,
        select_control,
        others_feature_collected = false,
        otherLayer = new OpenLayers.Layer.Vector("Others Layer", {
            styleMap: new OpenLayers.StyleMap({
                'default': default_style,
                'highlight': highlight_style
                })
        });

    otherLayer.setVisibility(false);
    map.addLayer(otherLayer);
    var other = map.getLayersByName('Others Layer')[0];
    function handle_success(data) {
        if (data.features) {
            var gf = new OpenLayers.Format.GeoJSON(),
                user,
                comment,
                i,
                feature,
                anonymous_regexp,
                popupcontent;
            for (i = 0; i < data.features.length; i += 1) {
                feature = gf.parseFeature(data.features[i]);
                //add values losed in parsing should be added again
                feature['private'] = data.features[i]['private'];
                feature.lonlat = gnt.questionnaire.get_popup_lonlat(feature.geometry);
                feature.style = get_style_for_name(feature.attributes.name);
                other.addFeatures(feature);
                comment = feature.attributes.form_values[0].value;
                user = feature.attributes.user;
                // set the right content
                anonymous_regexp = new RegExp('T[0-9]+.[0-9]+R[0-9]+.[0-9]+');
                if (!anonymous_regexp.test(user)) {
                    $('#other .username').text(user);
                }
                $('#other .comment').text(comment);
                //get the content
                popupcontent = $('#other').html();
                feature.popupClass = OpenLayers.Popup.FramedCloud;
                feature.popup = new OpenLayers.Popup.FramedCloud(
                    feature.id,
                    feature.lonlat,
                    null,
                    popupcontent,
                    null,
                    false
                );
            }
        }
    }
    if (others_feature_collected === false) {
        gnt.geo.get_features('@all',
                             data_group,
                             '',
            {'success': handle_success});
            
        others_feature_collected = true;
        other.setVisibility(true);
    } else if (others_feature_collected === true) {
        other.setVisibility(true);
    }
    highlightCtrl = makeHighlightCtrl();
    map.addControl(highlightCtrl);
    highlightCtrl.activate();
    // The select_control needs to be deactivated and activated to make
    // hover and select on different layers to work together (done by setLayer)
    select_control = map.getControl('selectcontrol');
    select_control.setLayer((select_control.layers).concat(otherLayer));

}
