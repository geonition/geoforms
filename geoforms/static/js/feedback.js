!function(){this.show_feedback=function(){var e,t,r,n,a,i,l,o,s,u,p,c,d,f,h,m,y,b,g,v,k,C,x,w,_,L,q,S,O,P,N,A,z,R,B,M,F,V,D,j,T,I,W,E,U,G;return e={user:!0,time:!0,id:!0,group:!0},p=function(e){var t,r;t=0;for(r in e)e.hasOwnProperty(r)&&++t;return t},u=function(e){var t,r;t={};for(r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},y=function(e){var t,r,n;n=function(e,t){var r;return r=0,r="0:"===e.slice(0,3)?9999:"0:"===t.slice(0,3)?-9999:e.length-t.length},t=[];for(r in e)e.hasOwnProperty(r)&&t.push(r);return t.sort(n)},b=function(e){var t;return"undefined"==typeof e&&(e=s.pop()),t={strokeWidth:3,strokeColor:e,fillColor:e,cursor:"pointer",fillOpacity:1,pointRadius:4}},m=function(e){return s.push(e)},q=function(){var e,t,r;return t=0,r={},e=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#9edae5","#98df8a","#aec7e8","#ffbb78","#ff9896","#c5b0d5","#c49c94","#f7b6d2","#c7c7c7","#dbdb8d"],function(n){return n in r||(r[n]=e[t++%20]),{strokeWidth:5,strokeColor:r[n],fillColor:"black",cursor:"pointer",fillOpacity:.1,pointRadius:6}}},x=function(){var e;return e=new OpenLayers.Control.SelectFeature(map.getLayersByName("Visualization Layer")[0],{id:"visualization_hover",hover:!0,highlightOnly:!0,multiple:!0,renderIntent:"highlight",eventListeners:{featurehighlighted:B,featureunhighlighted:g}})},w=function(){var e;return e=new OpenLayers.Control.SelectFeature(map.getLayersByName("Visualization Layer")[0],{id:"visualization_select",box:!0,clickout:!0,hover:!1,toggle:!0,multiple:!0,selectStyle:{strokeWidth:3,strokeColor:"#333",cursor:"pointer",fillColor:"#fff",fillOpacity:1,pointRadius:8},onSelect:z,onUnselect:T})},M=function(e){var t,r,n;if(e in F)return F[e];if(r=0,t=void 0,0===e.length)return r;for(n=0;n<e.length;)t=e.charCodeAt(n),r=(r<<5)-r+t,r&=r,n++;for(r=Math.abs(r);r in N;)r++;return N[r]=e,r=r.toString(),F[e]=r,r},i=function(e,t){var r;return r=$("<li></li>").addClass("feature-level-ctrl").append($('<input type="checkbox">').addClass("feature-level-ctrl").attr("id",e).attr("value",e).prop("checked",!1).change(V)).append($("<label></label>").addClass("feedback-bold").text(t.attributes.original_name).attr("for",e)),t.attributes.popup_has_multiple_choice_questions&&r.append($("<ul></ul>").addClass("mini-questionnaire").addClass(e).hide()),$("ul.feature-ctrl-main").append(r)},r=function(e,t){var r;return r=questionnaire.metadata.elements,r.hasOwnProperty(t)&&r[t].hasOwnProperty("question")&&(t=r[t].question),$("ul.property-ctrl-main").append($("<li></li>").html($("<div></div>").css("padding",0).addClass("feedback-bold").html(t)).append($("<ul></ul>").addClass("question-level-ctrl").addClass(e)))},V=function(e,t){var r,n,a,i,l,o,s,p,f,h,y,g,v;for("undefined"==typeof t&&(t=!1),r=e.target.checked?"checked":"none",o=function(){var t,r,n,i;for(n=c[e.target.id],i=[],t=0,r=n.length;r>t;t++)a=n[t],i.push(G[a]);return i}(),"none"===r?(t||(m($('label[for="'+e.target.id+'"]').css("color")),$('label[for="'+e.target.id+'"]').css("color","")),l={}):t?l=b($('label[for="'+e.target.id+'"]').css("color")):(l=b(),$('label[for="'+e.target.id+'"]').css("color",l.strokeColor)),l.display=r,p=0,y=o.length;y>p;p++)n=o[p],n.style=u(l);for(f=0,g=o.length;g>f;f++)n=o[f],E[n.attributes.user]===!1&&(n.style.display="none");for(h=0,v=o.length;v>h;h++)n=o[h],d[n.attributes.id]===!1&&(n.style.display="none");i=$(e.target).closest("li.feature-level-ctrl").find(".mini-questionnaire"),"none"===r?i.hide():i.show(),map.getLayersByName("Visualization Layer")[0].redraw(),s=0;for(n in G)"none"!==G[n].style.display&&s++;return $("#visible-feature-count .currently-visible").text(s)},j=function(e){var t,r,n,a,i,l,o;if(r={},0===e.length)return r;for(a=0,l=e.length;l>a;a++)for(t=e[a],i=0,o=t.length;o>i;i++)n=t[i],r[n]=!0;return r},k=function(e){var t,r,n,a,i,l,o,s,u,p,c,d;if(r={},0===e.length)return r;for(p=e[0],a=0,o=p.length;o>a;a++)n=p[a],r[n]=!0;if(1===e.length)return r;for(c=e[0],i=0,s=c.length;s>i;i++)for(n=c[i],d=e.slice(1),l=0,u=d.length;u>l;l++)if(t=d[l],-1===t.indexOf(n)){delete r[n];break}return r},f=function(e){var t,r,n,a,i,l;for(r=[],$(e.target).closest(".mini-questionnaire").find('input[type="checkbox"].attribute-level-ctrl').each(function(){return this.checked?r.push(o[this.value]):void 0}),n=$('.feature-ctrl-andor input[value="and"]').first().prop("checked")?k(r):j(r),l=c[$(e.target).closest("li.feature-level-ctrl").find("input.feature-level-ctrl").attr("id")],a=0,i=l.length;i>a;a++)t=l[a],d[t]=t in n?!0:!1;return $(e.target).closest("li.feature-level-ctrl").find("input.feature-level-ctrl").trigger("change",[!0])},h=function(){var e,t,r,n,a,i,o;o=[],$("input.property-ctrl-boolean").each(function(){return this.checked?o.push(l[this.value]):void 0}),r=$('.property-ctrl-andor input[value="and"]').first().prop("checked")?k(o):j(o),n={},$("input.property-ctrl-min").each(function(){return n[this.name]=[parseInt(this.value)]}),$("input.property-ctrl-max").each(function(){return n[this.name].push(parseInt(this.value))});for(i in r)for(a in n)if(t=$("input#exclude-"+a).first().prop("checked"),i in I){if(!(a in I[i])){if(!t)continue;delete r[i]}e=I[i][a],e>=n[a][0]&&e<=n[a][1]||delete r[i]}else{if(!t)continue;delete r[i]}$("#visible-user-count .currently-visible").text(p(r));for(i in E)E[i]=i in r?!0:!1;return $("input.feature-level-ctrl").trigger("change",[!0])},n=function(e,t,r,n){return e.options.hasOwnProperty(r)?$("ul."+t).append($("<li></li>").append($("<label></label>").attr("for",n).append($("<input>").addClass("property-ctrl-boolean").attr("type","checkbox").attr("id",n).val(n).attr("checked","checked")).change(h).append(e.options[r]))):void 0},a=function(e,t){return $("ul."+t).append($("<li></li>").append($("<label></label>").attr("for","min-"+t).append("Min:").append($("<input>").addClass("property-ctrl-min").attr("type","text").attr("id","min-"+t).attr("name",t)).change(h))).append($("<li></li>").append($("<label></label>").attr("for","max-"+t).append("Max:").append($("<input>").addClass("property-ctrl-max").attr("type","text").attr("id","max-"+t).attr("name",t)).change(h))).append($("<li></li>").append($("<label></label>").attr("for","exclude-"+t).append($("<input>").addClass("property-ctrl-exclude").attr("type","checkbox").attr("id","exclude-"+t).attr("name",t)).change(h).append("Exclude people who did not answer")))},L=function(t){var i,o,s,u,c,d,f,h,m,y,b,g,v,k,C;if(o=function(){var e,t,r,o,s,u,p,g,v,$,k,C;if(questionnaire.metadata.elements.hasOwnProperty(f)){if(r=questionnaire.metadata.elements[f],"checkbox"===(v=r.element_type)||"select"===v||"radio"===v){for(k=[],o=0,u=i.length;u>o;o++)e=i[o],t=M(f+"-AND-"+e),t in y||(n(r,d,e,t),y[t]=!0),null==l[t]&&(l[t]=Array()),k.push(l[t].push(c.user));return k}if("range"===($=r.element_type)||"number"===$){for(C=[],s=0,p=i.length;p>s;s++)e=i[s],d in b||a(r,d),e=parseInt(e),null==I[g=c.user]&&(I[g]={}),I[c.user][d]=e,null==h[d]&&(h[d]=e),e>h[d]&&(h[d]=e),null==m[d]&&(m[d]=e),e<m[d]?C.push(m[d]=e):C.push(void 0);return C}}},t.entry){for(b={},y={},h={},m={},C=t.entry,g=0,v=C.length;v>g;g++)if(c=C[g],!("form_values"in c)){c=P(c),null==W[k=c.user]&&(W[k]={});for(f in c)i=c[f],f in e||(d=M(f),d in b||r(d,f),i instanceof Array||(i=[i]),W[c.user][f]=i,o(),b[d]=!0)}for(f in h)s=h[f],$('input.property-ctrl-max[name="'+f+'"]').val(s);for(f in m)u=m[f],$('input.property-ctrl-min[name="'+f+'"]').val(u);return $("ul.property-ctrl-main ul").filter(function(){return $(this).find("li").length<2}).parent().remove(),$("#property-ctrl .loading").remove(),$(".property-ctrl-general").prepend($("<div>/</div>").attr("id","visible-user-count").append($("<span></span>").addClass("total")).prepend($("<span></span>").addClass("currently-visible")).append($("<span> respondents match your current filter</span>"))),$("#visible-user-count .currently-visible").text(p(W)),$("#visible-user-count .total").text(p(W))}},P=function(t){var r,n,a,i;for(n in t)i=t[n],n in e||(a=n,r=questionnaire.metadata.elements,n in r&&("question"in r[n]?a=r[n].question:"range"===r[n].element_type&&(a="0: "+r[n].min_label+"<br />100: "+r[n].max_label),r[a]=r[n],"range"===r[n].element_type&&(t[n]=Math.round(i)),t[a]=t[n],delete t[n]));return t},_=function(e){var r,n,a,l,s,u,h,m,y,b,g,v,k,C,x;if(e.features){for(C=map.getLayersByName("Visualization Layer")[0],m=new OpenLayers.Format.GeoJSON,v=new OpenLayers.Projection(e.crs.properties.code),k=new OpenLayers.Projection(map.getProjection()),g={},y=0;y<e.features.length;)if(h=m.parseFeature(e.features[y]),u=h.attributes.name,u in questionnaire.metadata.drawbuttons){h.geometry.transform(v,k),h.lonlat=gnt.questionnaire.get_popup_lonlat(h.geometry),h.style={},h.style.display="none",h.attributes.id=y,h=O(h),G[y]=h,E[h.attributes.user]=!0,u in c||(c[u]=Array(),i(u,h)),c[u].push(y),b=questionnaire.metadata.drawbuttons[u].elements;for(r in h.attributes.form_values)if("checkbox"===(x=b[r].element_type)||"radio"===x||"select"===x){s=M([u,r].join("-AND-")),s in g||(g[s]=!0,$("."+u).append($("<li></li>").addClass("attr-ctrl").append($("<div></div>").html(r)).append($("<ul></ul>").addClass(s))));for(a in h.attributes.form_values[r])n=M([u,r,a].join("-AND-")),n in o||(o[n]=Array(),$("."+s).append($("<li></li>").append($('<input type="checkbox">').addClass("attribute-level-ctrl").attr("id",n).attr("value",n).attr("checked","checked").change(f)).append($("<label></label>").text(a).attr("for",n)))),o[n].push(y)}C.addFeatures(h),y+=1}else y++;for(l in G)d[l]=!0;return t(),$(".attr-ctrl").filter(function(){return $(this).find("li").length<2}).remove(),$('.feature-ctrl-andor input[value="or"]').prop("checked",!0),$(".feature-ctrl-andor input").change(D),$("#feature-ctrl .loading").remove(),$(".feature-ctrl-general").prepend($("<div>/</div>").attr("id","visible-feature-count").append($("<span></span>").addClass("total")).prepend($("<span></span>").addClass("currently-visible")).append($("<span> markings match your current filter</span>"))),$("#visible-feature-count .total").text(p(d)),$("#gnt-map-control").prepend($('<div id="analysis-box-select"></div>').append($('<label for="box-select-toggle">Select multiple markings</label>')).prepend($('<input type="checkbox" id="box-select-toggle">').change(function(e){var t,r;return r=map.getControlsBy("id","visualization_select")[0],t=map.getControlsBy("id","visualization_hover")[0],e.target.checked?($(".userinfo").add(".feature_comments").hide(),t.deactivate(),r.activate(),$("#analysis-select-popup").show()):(r.unselectAll(),$("#analysis-select-popup").hide(),r.deactivate(),t.activate())})))}},D=function(){return $("li.feature-level-ctrl").each(function(){return $(this).find("input.attribute-level-ctrl").first().change()})},C=function(e){return-1===e.indexOf(" ")&&e.charCodeAt(0)>="a".charCodeAt(0)&&e.charCodeAt(0)<="z".charCodeAt(0)?!0:!1},T=function(e){return delete R[e.id],$("#analysis-select-popup #"+e.id).remove()},z=function(e){return R[e.id]=e,S("#analysis-select-popup",e)},g=function(){return $("div.analysis_popup").hide()},B=function(e){var t,r,n,a,i,l;for($(".analysis_popup").html("").hide(),$(".feature_comments").append('<div class="name">'+e.feature.attributes.original_name+"</div>"),n=e.feature.attributes.user,S(".feature_comments",e.feature),$(".user_info").prepend($("<div>Responses to other questions</div>").addClass("username")),$(".user_info").append($("<ul></ul>")),l=y(W[n]),a=0,i=l.length;i>a;a++)r=l[a],t=W[n][r],$(".user_info ul").append($('<li class="popup-property"><span class="attribute-name">'+r+" </span></li>").append(t.join(", ")));return $(".analysis_popup").show()},S=function(e,t){var r,n,a,i,l;r=$("<div></div>").attr("id",t.id).addClass("feature-container"),n=t.attributes.form_values;for(a in n){r.append('<div class="attribute-name">'+a+"</div>"),i=$("<ul></ul>");for(l in n[a])i.append($("<li></li>").html(l));r.append(i)}return $(e).append(r)},O=function(e){var t,r,n,a,i,l,o,s,u,p,c,d,f,h,m,y,b;if(i=e.attributes.name,t={},i in questionnaire.metadata.drawbuttons?(t=questionnaire.metadata.drawbuttons[i],s=t.question.trim(),questionnaire.metadata.drawbuttons[s]=questionnaire.metadata.drawbuttons[i]):s=i,e.attributes.original_name=s,u=!1,"elements"in t){m=t.elements;for(n in m)r=m[n],("checkbox"===(y=r.element_type)||"radio"===y||"select"===y)&&(u=!0)}for(e.attributes.popup_has_multiple_choice_questions=u,o={},l=e.attributes.form_values,f=0,h=l.length;h>f;f++)p=l[f],c=p.name,d=p.value,"elements"in t&&p.name in t.elements&&(a=t.elements[p.name],c=a.question,t.elements[c]=t.elements[p.name],("checkbox"===(b=a.element_type)||"radio"===b||"select"===b)&&"options"in a&&p.value in a.options&&(d=a.options[p.value]),"range"===a.element_type&&(d=Math.round(p.value))),null==o[c]&&(o[c]={}),o[c][d]=!0;return e.attributes.form_values=o,e},t=function(){return $(".mini-questionnaire").prepend($("<label>Check all</label>").css("font-weight","bold").prepend($('<input type="checkbox">').css("margin-right","3px").prop("checked",!0).change(function(e){return $(e.target).closest(".mini-questionnaire").find('input[type="checkbox"]').prop("checked",e.target.checked),$(e.target).closest(".mini-questionnaire").find('input[type="checkbox"].attribute-level-ctrl').last().trigger("change",[!0])}))),$(".property-ctrl-general").append($("<label>Check all</label>").css("font-weight","bold").prepend($('<input type="checkbox">').css("margin-right","3px").prop("checked",!0).change(function(e){return $("input.property-ctrl-boolean").prop("checked",e.target.checked),h()})))},R={},E={},d={},c={},G={},o={},l={},I={},W={},s=["#dbdb8d","#c7c7c7","#f7b6d2","#c49c94","#c5b0d5","#ff9896","#ffbb78","#aec7e8","#98df8a","#9edae5","#17becf","#bcbd22","#7f7f7f","#e377c2","#8c564b","#9467bd","#d62728","#2ca02c","#ff7f0e","#1f77b4"],N={},F={},$(".property-ctrl-andor input").change(h),$('.property-ctrl-andor input[value="or"]').first().prop("checked",!0),map.updateSize(),$("a#feedback").hide(),map.getLayersByName("Route Layer")[0].setVisibility(!1),map.getLayersByName("Point Layer")[0].setVisibility(!1),map.getLayersByName("Area Layer")[0].setVisibility(!1),U=new OpenLayers.Layer.Vector("Visualization Layer",{styleMap:new OpenLayers.StyleMap({"default":{strokeWidth:3,strokeColor:"red",cursor:"pointer",fillColor:"#aaaaff",fillOpacity:.3,pointRadius:5},highlight:{strokeWidth:3,strokeColor:"#555555",cursor:"pointer",fillColor:"#555555",fillOpacity:.3,pointRadius:5}})}),map.addLayer(U),$("#property-ctrl").prepend('<div class="loading">Loading data... please wait</div>'),$("#feature-ctrl").prepend('<div class="loading">Loading data... please wait</div>'),$.get("/questionnaire_admin/meta/"+questionnaire.q_id,function(e){return questionnaire.metadata=e,gnt.geo.get_features("@all",data_group,"",{success:_}),gnt.geo.get_properties("@all",data_group,"@null","@all",{success:L})}),v=x(),map.addControl(v),v.activate(),A=w(),map.addControl(A)},this.make_sld_getter=function(){var e,t,r,n;return t=0,r={},e=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],n='<?xml version="1.0" encoding="ISO-8859-1"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <NamedLayer> <Name>NAME</Name> <UserStyle> <Title>SLD Cook Book: Line w2th border</Title> <FeatureTypeStyle> <Rule> <LineSymbolizer> <Stroke> <CssParameter name="stroke">#333333</CssParameter> <CssParameter name="stroke-width">7</CssParameter> <CssParameter name="stroke-linecap">round</CssParameter> </Stroke> </LineSymbolizer> </Rule> </FeatureTypeStyle> <FeatureTypeStyle> <Rule> <LineSymbolizer> <Stroke> <CssParameter name="stroke">COLOR</CssParameter> <CssParameter name="stroke-width">5</CssParameter> <CssParameter name="stroke-linecap">round</CssParameter> </Stroke> </LineSymbolizer> </Rule> </FeatureTypeStyle> </UserStyle> </NamedLayer></StyledLayerDescriptor>',function(a){var i,l;return i="",a in r?i=r[a]:(i=e[t++%10],r[a]=i),l=n.replace("NAME",a),l.replace("COLOR",i)}}}.call(this);