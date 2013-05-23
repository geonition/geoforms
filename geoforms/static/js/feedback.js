feature_name2id_list = {};
vizu_features = {};
attribute2id_list = {}

function make_style_getter(){
    var current = 0;
    var name2color = {};
    var colorlist = [
'#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#9edae5', '#98df8a', '#aec7e8', '#ffbb78', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d'
        ];
    return function(name){
        if (!(name in name2color))
        {
            name2color[name] = colorlist[current++ % 20];
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
function toggleVisibilityByAttribute(e){
    var display = e.target.checked ? 'true' : 'none';
    var id_list = attribute2id_list[e.target.id];
    var f;
    for (var i=0; i < id_list.length; i++){
        f = vizu_features[id_list[i]];
        f.style['display'] = display;
    }
    var markingLayer = map.getLayersByName('Marking Layer')[0].redraw();
}
var seen_hashes = {};
var str2hash = {};
function simple_hash(s){
    if (s in str2hash){
        return str2hash[s];
    }
    var hash = 0;
    if (s.length == 0) return hash;
    for (i = 0; i < s.length; i++) {
        char = s.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    hash = Math.abs(hash).toString();
    if (!(hash in seen_hashes)){
        seen_hashes[hash] = s;
        str2hash[s] = hash;
    } else {
        if (s != seen_hashes[hash]){
            str2hash[s] = hash;
        }
    }
    return hash;
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
        $('#analysis-ctrl').prepend($('<ul></ul>').addClass('analysis-ctrl-main'));
        $('#analysis-ctrl').prepend('<h2>Choose features to show</h2>');
        var seen_f_a_keys = {};
        for (i = 0; i < data.features.length; i += 1) {
            var feature = gf.parseFeature(data.features[i]);
            var f_name = feature.attributes.name;
            feature.geometry.transform(source_proj, target_proj);
            feature.lonlat = gnt.questionnaire.get_popup_lonlat(feature.geometry);
            feature.style = get_style_for_name(f_name);
            feature = restyle_form_values(feature);
            vizu_features[i] = feature;
            if (!(f_name in feature_name2id_list)){
                feature_name2id_list[f_name] = Array();
                $('ul.analysis-ctrl-main')
                    .css('list-style','none')
                    .append(
                    $('<li></li>')
                        .append(
                            $('<input type="checkbox">')
                            .css('margin-right','5px')
                            .addClass('feature-level-ctrl')
                            .attr('id',f_name)
                            .attr('value',f_name)
                            .attr('checked','checked')
                            .change(toggleVisibility)
                        ).append(
                            $('<label></label>')
                            .css('color',feature.style.strokeColor)
                            .text(f_name)
                            .attr('for',f_name)
                        ).append(
                            $('<ul></ul>')
                            .addClass(f_name)
                        )
                    );
            }
            for (var a_name in feature.attributes.form_values){
                var f_a_key = simple_hash([f_name, a_name].join('-AND-'));

                if (!(f_a_key in seen_f_a_keys)){
                    seen_f_a_keys[f_a_key] = true;
                    $('.'+f_name).append(
                        $('<li></li>')
                        .addClass('attr-ctrl')
                        .append($('<div></div>')
                            .css('color',feature.style.strokeColor)
                            .html(a_name))
                        .append($('<ul></ul>')
                            .css('list-style','none')
                            .css('padding',0)
                            .addClass(f_a_key))
                    );
                }
                for (var a_value in feature.attributes.form_values[a_name]){
                    if (a_value.indexOf(' ') != -1 ||
                            !(isNaN(Number(a_value))) ||
                            (a_value.charCodeAt(0) >= 'A'.charCodeAt(0) && a_value.charCodeAt(0) <= 'Z'.charCodeAt(0))){
                        continue;
                    }
                    var a_v_key = simple_hash([f_name, a_name, a_value].join('-AND-'));

                    if (!(a_v_key in attribute2id_list)){
                        attribute2id_list[a_v_key] = Array();
                        $('.'+f_a_key).append(
                            $('<li></li>')
                                .append(
                                    $('<input type="checkbox">')
                                    .css('margin-right','5px')
                                    .addClass('attribute-level-ctrl')
                                    .attr('id',a_v_key)
                                    .attr('value',a_v_key)
                                    .attr('checked','checked')
                                    .change(toggleVisibilityByAttribute)
                                ).append(
                                    $('<label></label>')
                                    .css('color',feature.style.strokeColor)
                                    .text(a_value)
                                    .attr('for',a_v_key)
                                )
                        )
                    }
                    attribute2id_list[a_v_key].push(i);
                }
            }
            feature_name2id_list[f_name].push(i);
            markingLayer.addFeatures(feature);
        }
        $('.attr-ctrl').filter(function(){
            return $(this).find('li').length < 2;
        }).remove();
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

    $('#main #content').append(
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
        for (var value in form_values[name]) {
            ul.append(
                $('<li></li>').html(value)
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
            new_vals[v.name] = {};
        }
        new_vals[v.name][v.value] = true;
    }
    feature.attributes.form_values = new_vals;
    return feature;
}
