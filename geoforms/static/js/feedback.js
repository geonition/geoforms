!function(){this.show_feedback=function(){var e,t,r,a,n,i,l,o,s,u,c,p,d,f,h,m,y,g,v,b,k,w,_,x,C,L,q,O,S,N,P,z,A,F,V,B,R,M,T,E,D,j,I,U,W,J,X,G;return e={user:!0,time:!0,id:!0,group:!0},d=function(e){var t,r;t=0;for(r in e)e.hasOwnProperty(r)&&++t;return t},p=function(e){var t,r;t={};for(r in e)e.hasOwnProperty(r)&&(t[r]=e[r]);return t},b=function(e){var t,r,a;a=function(e,t){var r;return r=0,r="0:"===e.slice(0,3)?9999:"0:"===t.slice(0,3)?-9999:e.length-t.length},t=[];for(r in e)e.hasOwnProperty(r)&&t.push(r);return t.sort(a)},L=function(){var e,t,r,a;for(J.styles={"default":{strokeWidth:3,strokeColor:"red",cursor:"pointer",fillColor:"#aaaaff",fillOpacity:.3,pointRadius:5},hidden:{display:"none"},multiselect:{fillColor:"#fff",strokeColor:"#333",cursor:"pointer",strokeWidth:3,fillOpacity:1,pointRadius:6},multiselectFlash:{fillColor:"#333",strokeColor:"#333",cursor:"pointer",strokeWidth:5,fillOpacity:1,pointRadius:8}},r=0,a=c.length;a>r;r++)e=c[r],t={strokeWidth:3,strokeColor:e,fillColor:e,cursor:"pointer",fillOpacity:1,pointRadius:4},J.styles["color_"+e]=t;return J.styles},x=function(){var e;return e=new OpenLayers.Control.SelectFeature(map.getLayersByName("Visualization Layer")[0],{id:"visualization_hover",hover:!0,highlightOnly:!0,multiple:!0,eventListeners:{featurehighlighted:V,featureunhighlighted:k}}),map.addControl(e),e.activate(),e},C=function(){var e,t;return e=map.getLayersByName("Visualization Layer")[0],t=new OpenLayers.Control.SelectFeature(e,{id:"visualization_select",box:!0,clickout:!0,hover:!1,toggle:!0,multiple:!0,onSelect:A,onUnselect:j}),map.addControl(t),t},B=function(e){var t,r,a;if(e in R)return R[e];if(r=0,t=void 0,0===e.length)return r;for(a=0;a<e.length;)t=e.charCodeAt(a),r=(r<<5)-r+t,r&=r,a++;for(r=Math.abs(r);r in z;)r++;return z[r]=e,r=r.toString(),R[e]=r,r},l=function(e,t){var r;return r=$("<li></li>").addClass("feature-level-ctrl").append($('<input type="checkbox">').addClass("feature-level-ctrl").attr("id",e).attr("value",e).prop("checked",!1).change(M)).append($("<label></label>").addClass("feedback-bold").text(t.attributes.original_name).attr("for",e)),t.attributes.popup_has_multiple_choice_questions&&r.append($("<ul></ul>").addClass("mini-questionnaire").addClass(e).hide()),$("ul.feature-ctrl-main").append(r)},a=function(e,t){var r;return r=questionnaire.metadata.elements,r.hasOwnProperty(t)&&r[t].hasOwnProperty("question")&&(t=r[t].question),$("ul.property-ctrl-main").append($("<li></li>").html($("<div></div>").css("padding",0).addClass("feedback-bold").html(t)).append($("<ul></ul>").addClass("question-level-ctrl").addClass(e)))},s=function(e){var t;return t=c.pop(),f[e.target.id]=t,$('label[for="'+e.target.id+'"]').css("color",t)},E=function(e){return c.push(f[e.target.id]),delete f[e.target.id],$('label[for="'+e.target.id+'"]').css("color","")},r=function(e){var t;return null==e&&(e=""),t=Date.now(),""!==e&&"undefined"!=typeof window.checkpoint?console.log("time elapsed: "+e+" "+(t-window.checkpoint)):console.log("initiate at: "+t),window.checkpoint=t},M=function(e,t){var r,a,n,i,l,o,u,c,p,d,y,g,v,b,k,w;if(null==t&&(t=!0),r=e.target.checked,t&&(r?s(e):E(e)),o=function(){var t,r,a,i;for(a=h[e.target.id],i=[],t=0,r=a.length;r>t;t++)n=a[t],i.push(G[n]);return i}(),c=map.getLayersByName("Visualization Layer")[0],r&&!(e.target.id in f))throw"no color assigned";for(l=r?J.styles["color_"+f[e.target.id]]:J.styles.hidden,p=0,v=o.length;v>p;p++)a=o[p],a.style=l;for(d=0,b=o.length;b>d;d++)a=o[d],W[a.attributes.user]===!1&&(a.style=J.styles.hidden);for(y=0,k=o.length;k>y;y++)a=o[y],m[a.attributes.id]===!1&&(a.style=J.styles.hidden);for(g=0,w=o.length;w>g;g++)a=o[g],c.drawFeature(a);i=$(e.target).closest("li.feature-level-ctrl").find(".mini-questionnaire"),r?i.show():i.hide(),u=0;for(a in G)"hidden"!==G[a].renderIntent&&u++;return $("#visible-feature-count .currently-visible").text(u)},D=function(e){var t,r,a,n,i,l,o;if(r={},0===e.length)return r;for(n=0,l=e.length;l>n;n++)for(t=e[n],i=0,o=t.length;o>i;i++)a=t[i],r[a]=!0;return r},w=function(e){var t,r,a,n,i,l,o,s,u,c,p,d;if(r={},0===e.length)return r;for(c=e[0],n=0,o=c.length;o>n;n++)a=c[n],r[a]=!0;if(1===e.length)return r;for(p=e[0],i=0,s=p.length;s>i;i++)for(a=p[i],d=e.slice(1),l=0,u=d.length;u>l;l++)if(t=d[l],-1===t.indexOf(a)){delete r[a];break}return r},g=function(e){var t,r,a,n,i,l;for(r=[],$(e.target).closest(".mini-questionnaire").find('input[type="checkbox"].attribute-level-ctrl').each(function(){return this.checked?r.push(u[this.value]):void 0}),a=$('.feature-ctrl-andor input[value="and"]').first().prop("checked")?w(r):D(r),l=h[$(e.target).closest("li.feature-level-ctrl").find("input.feature-level-ctrl").attr("id")],n=0,i=l.length;i>n;n++)t=l[n],m[t]=t in a?!0:!1;return $(e.target).closest("li.feature-level-ctrl").find("input.feature-level-ctrl").trigger("change",[!1])},y=function(e){var t,r,a,n,i,l;n={},$("input.property-ctrl-min").each(function(){return n[this.name]=[Number.MIN_VALUE,Number.MAX_VALUE]}),$("input.property-ctrl-min").each(function(){return""!==this.value?n[this.name][0]=parseInt(this.value):void 0}),$("input.property-ctrl-max").each(function(){return""!==this.value?n[this.name][1]=parseInt(this.value):void 0});for(i in n)a=n[i],a[0]===Number.MIN_VALUE&&a[1]===Number.MAX_VALUE&&delete n[i];for(l in e)for(i in n)if(r=$("input#exclude-"+i).first().prop("checked"),l in I){if(!(i in I[l])){if(!r)continue;delete e[l]}t=I[l][i],t>=n[i][0]&&t<=n[i][1]||delete e[l]}else{if(!r)continue;delete e[l]}return e},v=function(){var e,t,r;r=[],$("input.property-ctrl-boolean").each(function(){return this.checked?r.push(o[this.value]):void 0}),e=$('.property-ctrl-andor input[value="and"]').first().prop("checked")?w(r):D(r),e=y(e),$("#visible-user-count .currently-visible").text(d(e));for(t in W)W[t]=t in e?!0:!1;return $("input.feature-level-ctrl").trigger("change",[!1])},n=function(e,t,r,a){return e.options.hasOwnProperty(r)?$("ul."+t).append($("<li></li>").append($("<label></label>").attr("for",a).append($("<input>").addClass("property-ctrl-boolean").attr("type","checkbox").attr("id",a).val(a).attr("checked","checked")).change(v).append(e.options[r]))):void 0},i=function(e,t){return $("ul."+t).append($("<li></li>").append($("<label></label>").attr("for","min-"+t).append("Min:").append($("<input>").addClass("property-ctrl-min").attr("type","text").attr("id","min-"+t).attr("name",t)).change(v))).append($("<li></li>").append($("<label></label>").attr("for","max-"+t).append("Max:").append($("<input>").addClass("property-ctrl-max").attr("type","text").attr("id","max-"+t).attr("name",t)).change(v))).append($("<li></li>").append($("<label></label>").attr("for","exclude-"+t).append($("<input>").addClass("property-ctrl-exclude").attr("type","checkbox").attr("id","exclude-"+t).attr("name",t)).change(v).append("Exclude people who did not answer")))},O=function(t){var r,l,s,u,c,p,f,h,m,y,g;if(l=function(){var e,t,a,l,d,h,m,y,g,v,b,$;if(questionnaire.metadata.elements.hasOwnProperty(c)){if(a=questionnaire.metadata.elements[c],"checkbox"===(g=a.element_type)||"select"===g||"radio"===g){for(b=[],l=0,h=r.length;h>l;l++)e=r[l],t=B(c+"-AND-"+e),t in p||(n(a,u,e,t),p[t]=!0),null==o[t]&&(o[t]=Array()),b.push(o[t].push(s.user));return b}if("range"===(v=a.element_type)||"number"===v){for($=[],d=0,m=r.length;m>d;d++)e=r[d],u in f||i(a,u),e=parseInt(e),null==I[y=s.user]&&(I[y]={}),$.push(I[s.user][u]=e);return $}}},t.entry){for(f={},p={},g=t.entry,h=0,m=g.length;m>h;h++)if(s=g[h],!("form_values"in s)){s=P(s),null==U[y=s.user]&&(U[y]={});for(c in s)r=s[c],c in e||(u=B(c),u in f||a(u,c),r instanceof Array||(r=[r]),U[s.user][c]=r,l(),f[u]=!0)}return $("ul.property-ctrl-main ul").filter(function(){return $(this).find("li").length<2}).parent().remove(),$("#property-ctrl .loading").remove(),$(".property-ctrl-general").prepend($("<div>/</div>").attr("id","visible-user-count").append($("<span></span>").addClass("total")).prepend($("<span></span>").addClass("currently-visible")).append($("<span> respondents match your current filter</span>"))),$("#visible-user-count .currently-visible").text(d(U)),$("#visible-user-count .total").text(d(U))}},P=function(t){var r,a,n,i;for(a in t)i=t[a],a in e||(n=a,r=questionnaire.metadata.elements,a in r&&("question"in r[a]?n=r[a].question:"range"===r[a].element_type&&(n="0: "+r[a].min_label+"<br />100: "+r[a].max_label),r[n]=r[a],"range"===r[a].element_type&&(t[a]=Math.round(i)),t[n]=t[a],delete t[a]));return t},q=function(e){var r,a,n,i,o,s,c,p,f,y,v,b,k,w,_;if(e.features){for(w=map.getLayersByName("Visualization Layer")[0],p=new OpenLayers.Format.GeoJSON,b=new OpenLayers.Projection(e.crs.properties.code),k=new OpenLayers.Projection(map.getProjection()),v={},f=0;f<e.features.length;)if(c=p.parseFeature(e.features[f]),s=c.attributes.name,s in questionnaire.metadata.drawbuttons){c.geometry.transform(b,k),c.lonlat=gnt.questionnaire.get_popup_lonlat(c.geometry),c.attributes.id=f,c.style=J.styles.hidden,c=N(c),G[f]=c,W[c.attributes.user]=!0,s in h||(h[s]=Array(),l(s,c)),h[s].push(f),y=questionnaire.metadata.drawbuttons[s].elements;for(r in c.attributes.form_values)if(r in y&&("checkbox"===(_=y[r].element_type)||"radio"===_||"select"===_)){o=B([s,r].join("-AND-")),o in v||(v[o]=!0,$("."+s).append($("<li></li>").addClass("attr-ctrl").append($("<div></div>").html(r)).append($("<ul></ul>").addClass(o))));for(n in c.attributes.form_values[r])a=B([s,r,n].join("-AND-")),a in u||(u[a]=Array(),$("."+o).append($("<li></li>").append($('<input type="checkbox">').addClass("attribute-level-ctrl").attr("id",a).attr("value",a).attr("checked","checked").change(g)).append($("<label></label>").text(n).attr("for",a)))),u[a].push(f)}w.addFeatures(c),f+=1}else f++;for(i in G)m[i]=!0;return t(),$(".attr-ctrl").filter(function(){return $(this).find("li").length<2}).remove(),$('.feature-ctrl-andor input[value="or"]').prop("checked",!0),$(".feature-ctrl-andor input").change(T),$("#feature-ctrl .loading").remove(),$(".feature-ctrl-general").prepend($("<div>/</div>").attr("id","visible-feature-count").append($("<span></span>").addClass("total")).prepend($("<span></span>").addClass("currently-visible")).append($("<span> markings match your current filter</span>"))),$("#visible-feature-count .total").text(d(m)),$("#gnt-map-control").prepend($('<div id="analysis-box-select"></div>').append($('<label for="box-select-toggle">Select multiple markings</label>')).prepend($('<input type="checkbox" id="box-select-toggle">').change(function(e){var t,r;return r=map.getControlsBy("id","visualization_select")[0],t=map.getControlsBy("id","visualization_hover")[0],e.target.checked?($(".userinfo").add(".feature_comments").hide(),t.deactivate(),r.activate(),$("button#charts-selected").button(),$("#analysis-select-popup").show(),$("#charts-selected").click(function(){var e,t,r;return t=map.getLayersByName("Visualization Layer")[0].selectedFeatures,r=function(){var r,a,n;for(n=[],r=0,a=t.length;a>r;r++)e=t[r],n.push(e.attributes.user);return n}(),$.ajax({type:"POST",data:JSON.stringify({usernames:r}),url:"/questionnaire_admin/cacheusernames/",success:function(e){var t,r,a,n,i;return t="http://"+window.location.host+"/questionnaire_admin/plot/"+questionnaire.q_id.toString()+"/template/order_by_size/"+e.cache_key+"/",i=$('<iframe class="chart-dialog-iframe" src="'+t+'" border="0"></iframe>'),a=function(){return $.ajax({type:"DELETE",data:JSON.stringify({cache_key:e.cache_key}),url:"/questionnaire_admin/cacheusernames/"}),$(".ui-dialog").remove()},n={autoOpen:!1,modal:!0,width:window.innerWidth-150,height:window.innerHeight-50,close:a,buttons:{Close:function(){return $(this).dialog("close")}},resizable:!1},r=$("<div></div>").attr("id","chart-dialog").attr("title","Respondent charts").append(i).appendTo("body").dialog(n),r.dialog("open"),$(".ui-dialog").css("z-index",$("#analysis-select-popup").css("z-index")+"0"),$(".chart-dialog-iframe").css("width","98%").css("height","98%")}})})):(r.unselectAll(),$("#analysis-select-popup").hide(),r.deactivate(),t.activate())})))}},T=function(){return $("li.feature-level-ctrl").each(function(){return $(this).find("input.attribute-level-ctrl").first().change()})},_=function(e){return-1===e.indexOf(" ")&&e.charCodeAt(0)>="a".charCodeAt(0)&&e.charCodeAt(0)<="z".charCodeAt(0)?!0:!1},j=function(e){var t,r;return r=map.getLayersByName("Visualization Layer")[0],t=f[e.attributes.name],e.style=J.styles["color_"+t],r.drawFeature(e),$("#analysis-select-popup #"+e.id).remove(),delete F[e.id],$("span.number-of-selected-features").text(d(F))},A=function(e){var t,r,a;return F[e.id]=e,$(".number-of-selected-features").text(d(F)),S("#analysis-select-popup",e),a=map.getLayersByName("Visualization Layer")[0],e.style=J.styles.multiselect,a.drawFeature(e),t=function(){var t,r;return r=e,t=a,function(e){return $(e.delegateTarget).css("background-color","#ccc"),t.drawFeature(r,J.styles.multiselectFlash)}},r=function(){var t,r;return r=e,t=a,function(e){return $(e.delegateTarget).css("background-color",""),t.drawFeature(r,J.styles.multiselect)}},$("#analysis-select-popup div#"+e.id).hover(t(),r())},k=function(){return $("div.analysis_popup").hide()},V=function(e){var t,r,a,n,i,l;for($(".analysis_popup").html("").hide(),$(".feature_comments").append('<div class="name">'+e.feature.attributes.original_name+"</div>"),a=e.feature.attributes.user,S(".feature_comments",e.feature),$(".user_info").prepend($("<div>Responses to other questions</div>").addClass("username")),$(".user_info").append($("<ul></ul>")),l=b(U[a]),n=0,i=l.length;i>n;n++)r=l[n],t=U[a][r],$(".user_info ul").append($('<li class="popup-property"><span class="attribute-name">'+r+" </span></li>").append(t.join(", ")));return $(".analysis_popup").show()},S=function(e,t){var r,a,n,i,l;r=$("<div></div>").attr("id",t.id).addClass("feature-container"),a=t.attributes.form_values;for(n in a){r.append('<div class="attribute-name">'+n+"</div>"),i=$("<ul></ul>");for(l in a[n])i.append($("<li></li>").html(l));r.append(i)}return $(e).append(r)},N=function(e){var t,r,a,n,i,l,o,s,u,c,p,d,f,h,m,y,g;if(i=e.attributes.name,t={},i in questionnaire.metadata.drawbuttons?(t=questionnaire.metadata.drawbuttons[i],s=t.question.trim(),questionnaire.metadata.drawbuttons[s]=questionnaire.metadata.drawbuttons[i]):s=i,e.attributes.original_name=s,u=!1,"elements"in t){m=t.elements;for(a in m)r=m[a],("checkbox"===(y=r.element_type)||"radio"===y||"select"===y)&&(u=!0)}for(e.attributes.popup_has_multiple_choice_questions=u,o={},l=e.attributes.form_values,f=0,h=l.length;h>f;f++)c=l[f],p=c.name,d=c.value,"elements"in t&&c.name in t.elements&&(n=t.elements[c.name],p=n.question,t.elements[p]=t.elements[c.name],("checkbox"===(g=n.element_type)||"radio"===g||"select"===g)&&"options"in n&&c.value in n.options&&(d=n.options[c.value]),"range"===n.element_type&&(d=Math.round(c.value))),null==o[p]&&(o[p]={}),o[p][d]=!0;return e.attributes.form_values=o,e},t=function(){return $(".mini-questionnaire").prepend($("<label>Check all</label>").css("font-weight","bold").prepend($('<input type="checkbox">').css("margin-right","3px").prop("checked",!0).change(function(e){return $(e.target).closest(".mini-questionnaire").find('input[type="checkbox"]').prop("checked",e.target.checked),$(e.target).closest(".mini-questionnaire").find('input[type="checkbox"].attribute-level-ctrl').last().trigger("change",[!1])}))),$(".property-ctrl-general").append($("<label>Check all</label>").css("font-weight","bold").prepend($('<input type="checkbox">').css("margin-right","3px").prop("checked",!0).change(function(e){return $("input.property-ctrl-boolean").prop("checked",e.target.checked),v()})))},J={},F={},W={},m={},h={},f={},G={},u={},o={},I={},U={},c=["#dbdb8d","#c7c7c7","#f7b6d2","#c49c94","#c5b0d5","#ff9896","#ffbb78","#aec7e8","#98df8a","#9edae5","#17becf","#bcbd22","#7f7f7f","#e377c2","#8c564b","#9467bd","#d62728","#2ca02c","#ff7f0e","#1f77b4"],z={},R={},$(".property-ctrl-andor input").change(v),$('.property-ctrl-andor input[value="or"]').first().prop("checked",!0),map.updateSize(),$("a#feedback").hide(),map.getLayersByName("Route Layer")[0].setVisibility(!1),map.getLayersByName("Point Layer")[0].setVisibility(!1),map.getLayersByName("Area Layer")[0].setVisibility(!1),X=new OpenLayers.Layer.Vector("Visualization Layer",{rendererOptions:{zIndexing:!1}}),map.addLayer(X),$("#property-ctrl").prepend('<div class="loading">Loading data... please wait</div>'),$("#feature-ctrl").prepend('<div class="loading">Loading data... please wait</div>'),$.get("/questionnaire_admin/meta/"+questionnaire.q_id,function(e){return questionnaire.metadata=e,gnt.geo.get_features("@all",data_group,"",{success:q}),gnt.geo.get_properties("@all",data_group,"@null","@all",{success:O})}),L(),x(),C()},this.make_sld_getter=function(){var e,t,r,a;return t=0,r={},e=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"],a='<?xml version="1.0" encoding="ISO-8859-1"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <NamedLayer> <Name>NAME</Name> <UserStyle> <Title>SLD Cook Book: Line w2th border</Title> <FeatureTypeStyle> <Rule> <LineSymbolizer> <Stroke> <CssParameter name="stroke">#333333</CssParameter> <CssParameter name="stroke-width">7</CssParameter> <CssParameter name="stroke-linecap">round</CssParameter> </Stroke> </LineSymbolizer> </Rule> </FeatureTypeStyle> <FeatureTypeStyle> <Rule> <LineSymbolizer> <Stroke> <CssParameter name="stroke">COLOR</CssParameter> <CssParameter name="stroke-width">5</CssParameter> <CssParameter name="stroke-linecap">round</CssParameter> </Stroke> </LineSymbolizer> </Rule> </FeatureTypeStyle> </UserStyle> </NamedLayer></StyledLayerDescriptor>',function(n){var i,l;return i="",n in r?i=r[n]:(i=e[t++%10],r[n]=i),l=a.replace("NAME",n),l.replace("COLOR",i)}}}.call(this);