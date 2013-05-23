feature_name2id_list = {};
vizu_features = {};

function make_style_getter(){
    var current = 0;
    var name2color = {};
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
        if (!(name in name2color))
        {
            name2color[name] = colorlist[current++ % 10];
        }
        return { 
                strokeWidth: 5,
                strokeColor: name2color[name],
                fillColor: 'black',
                cursor: 'pointer',
                fillOpacity : 0.1,
                pointRadius: 6
        };
    };
};
function makeHighlightCtrl() {
    hctrl = new OpenLayers.Control.SelectFeature(
        map.getControl('selectcontrol').layers.concat(map.getLayersByName('Marking Layer')[0]),
        {
            hover: true,
            highlightOnly: true,
            multiple: true,
            renderIntent: 'highlight',
            eventListeners: {
                featurehighlighted: show_feature_popup,
                featureunhighlighted: hide_feature_popup
            }
        }
    );
    return hctrl;
}
function toggleVisibility(e){
    var display = e.target.checked ? 'true' : 'none';
    var id_list = feature_name2id_list[e.target.id];
    var f;
    for (var i=0; i < id_list.length; i++){
        f = vizu_features[id_list[i]];
        f.style['display'] = display;
    }
    var markingLayer = map.getLayersByName('Marking Layer')[0].redraw();
}
function parse_features(data){
    if (data.features) {
        var markingLayer = map.getLayersByName('Marking Layer')[0];
        var get_style_for_name = make_style_getter();
        var gf = new OpenLayers.Format.GeoJSON(),
            i,
            source_proj = new OpenLayers.Projection(data.crs.properties.code),
            target_proj = new OpenLayers.Projection(map.getProjection());

        $('.loading').remove();
        $('#analysis-ctrl').prepend('<ul></ul>');
        $('#analysis-ctrl').prepend('<h2>Choose features to show</h2>');
        for (i = 0; i < data.features.length; i += 1) {
            var feature = gf.parseFeature(data.features[i]);
            feature.geometry.transform(source_proj, target_proj);
            feature.lonlat = gnt.questionnaire.get_popup_lonlat(feature.geometry);
            feature.style = get_style_for_name(feature.attributes.name);
            feature = restyle_form_values(feature);
            vizu_features[i] = feature;
            if (!(feature.attributes.name in feature_name2id_list)){
                feature_name2id_list[feature.attributes.name] = Array();
                $('#analysis-ctrl ul').append(
                    $('<li></li>').append(
                        $('<input type="checkbox">')
                        .addClass('feature-level-ctrl')
                        .attr('id',feature.attributes.name)
                        .attr('value',feature.attributes.name)
                        .attr('checked','checked')
                    ).append(
                        $('<label></label>')
                        .text(feature.attributes.name)
                        .attr('for',feature.attributes.name)
                    ).change(toggleVisibility)
                    );
            }
            feature_name2id_list[feature.attributes.name].push(i);
            markingLayer.addFeatures(feature);
        }
    }
}
function show_feedback() {
    map.getLayersByName('Route Layer')[0].setVisibility(false);
    map.getLayersByName('Point Layer')[0].setVisibility(false);
    map.getLayersByName('Area Layer')[0].setVisibility(false);
    var markingLayer = new OpenLayers.Layer.Vector("Marking Layer", {
            styleMap: new OpenLayers.StyleMap({
                'default': {
                        strokeWidth: 3,
                        strokeColor: 'red',
                        cursor: 'pointer',
                        fillColor: '#aaaaff',
                        fillOpacity: 0.3,
                        pointRadius: 5
                    },
                'highlight': {
                        strokeWidth: 3,
                        strokeColor: '#555555',
                        cursor: 'pointer',
                        fillColor: '#555555',
                        fillOpacity: 0.3,
                        pointRadius: 5
                    }
                })
        });
    map.addLayer(markingLayer);
    // The select_control needs to be deactivated and activated to make
    // hover and select on different layers to work together (done by setLayer)
    var select_control = map.getControl('selectcontrol');
    select_control.setLayer((select_control.layers).concat(markingLayer));

    $('#main #content').prepend(
            $('<div></div>')
            .attr('id','analysis-ctrl')
            ).append('<h2 class="loading">Loading...</h2>');
    gnt.geo.get_features('@all',
                         data_group,
                         '',
        {'success': parse_features});
    var highlightCtrl = makeHighlightCtrl();
    map.addControl(highlightCtrl);
    highlightCtrl.activate();
}

function hide_feature_popup(e){
    $('div.feature_comments').hide();
}
function show_feature_popup(e){
    $('.feature_comments').html('').hide();
    $('.feature_comments').append('<div class="feature-name">'+e.feature.attributes.name+'</div>');
    var form_values = e.feature.attributes.form_values;
    for (var name in form_values) {
        $('.feature_comments').append('<div class="feature-attribute-name">'+name+'</div>');
        var ul = $('<ul></ul>');
        for (j = 0; j < form_values[name].length; j++) {
            ul.append(
                $('<li></li>').html(form_values[name][j])
                );
        }
        $('.feature_comments').append(ul);
    }
    $('.feature_comments').show();
}
function restyle_form_values(feature){
    var new_vals = {};
    var form_values = feature.attributes.form_values;
    for (i = 0; i < form_values.length; i += 1) {
        var v = form_values[i];
        if (!(v.name in new_vals)){
            new_vals[v.name] = Array();
        }
        new_vals[v.name].push(v.value);
    }
    feature.attributes.form_values = new_vals;
    return feature;
}
