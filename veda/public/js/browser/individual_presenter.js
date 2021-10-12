// Individual Presenter
'use strict';System.register(["../common/veda.js","../common/individual_model.js","../common/backend.js","../common/util.js","../browser/util.js","../common/lib/riot.js","../browser/notify.js","../browser/veda_controls.js","jquery","jquery-ui","tablesortable"],function(_export,_context){"use strict";function _instanceof(a,b){return null!=b&&"undefined"!=typeof Symbol&&b[Symbol.hasInstance]?!!b[Symbol.hasInstance](a):a instanceof b}/**
 * Individual presenter method for IndividualModel class
 * @param {Element} container - container to render individual to
 * @param {IndividualModel|string} template - template to render individual with
 * @param {string} mode - view | edit | search
 * @param {Object} extra - extra parameters to pass ro template
 * @param {Boolean} toAppend - flag defining either to append or replace the container's content with rendered template
 * @return {Promise}
 */function IndividualPresenter(a,b,c,d,e){c=c||"view",e=!("undefined"!=typeof e)||e,"string"==typeof a&&(a=$(a));var f=/\.html$/;return this.load().then(function(g){var h="<h5 class='container sheet text-center text-muted'>\u041D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C. \u042D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D / Server disconnected. This object is not available now</h5>";if(b){if(_instanceof(b,IndividualModel));else if("string"==typeof b&&/^[a-z][a-z-0-9]*:([a-zA-Z0-9-_])*$/.test(b))b=new IndividualModel(b);else{var m;return"string"==typeof b?m=b:_instanceof(b,HTMLElement)&&(m=b.outerHTML),renderTemplate(g,a,m,c,d,e)}return b.load().then(function(b){var i=b.hasValue("v-ui:template")?b["v-ui:template"][0].toString():h;return f.test(i)?veda.Backend.loadFile("/templates/"+i).then(function(b){return renderTemplate(g,a,b,c,d,e)}):renderTemplate(g,a,i,c,d,e)})}var i,j=g.hasValue("rdf:type","owl:Class")||g.hasValue("rdf:type","rdfs:Class");if(g.hasValue("v-ui:hasTemplate")&&!j)b=g["v-ui:hasTemplate"][0],i=b.load().then(function(b){if(!b.hasValue("rdf:type","v-ui:ClassTemplate"))throw new Error("Template type violation!");var i=b.hasValue("v-ui:template")?b["v-ui:template"][0].toString():h;return f.test(i)?veda.Backend.loadFile("/templates/"+i).then(function(b){return renderTemplate(g,a,b,c,d,e)}):renderTemplate(g,a,i,c,d,e)});else{var k=veda.ontology,l=g["rdf:type"].map(function(a){return a.load()});i=Promise.all(l).then(function(a){var b=a.map(function(a){var b=k.getClassTemplate(a.id);return b?new IndividualModel(b).load():a.hasValue("v-ui:hasTemplate")?a["v-ui:hasTemplate"][0].load():new IndividualModel("v-ui:generic").load()});return Promise.all(b)}).then(function(b){var i=b.map(function(b){var i=b.hasValue("v-ui:template")?b["v-ui:template"][0].toString():h;return f.test(i)?veda.Backend.loadFile("/templates/"+i).then(function(b){return renderTemplate(g,a,b,c,d,e)}):renderTemplate(g,a,i,c,d,e)});return Promise.all(i)}).then(function(a){return a.reduce(function(a,b){return a.add(b)},$())})}return i}).catch(function(a){console.log("Presenter error",a)})}/**
 * Render template
 * @param {IndividualModel} individual - individual to render
 * @param {Element} container - container to render individual to
 * @param {IndividualModel|string} template - template to render individual with
 * @param {string} mode - view | edit | search
 * @param {Object} extra - extra parameters to pass ro template
 * @param {Boolean} toAppend - flag defining either to append or replace the container's content with rendered template
 * @return {Promise}
 */function renderTemplate(individual,container,template,mode,extra,toAppend){template=template.trim();// Extract pre script, template and post script
var match=template.match(/^(?:<script[^>]*>([\s\S]*?)<\/script>)?([\s\S]*?)(?:<script[^>]*>(?![\s\S]*<script[^>]*>)([\s\S]*)<\/script>)?$/i),pre_render_src=match[1];template=$(match[2]);var pre_result,post_render_src=match[3];return pre_render_src&&(pre_result=eval("(function (){ 'use strict'; "+pre_render_src+"}).call(individual);")),(_instanceof(pre_result,Promise)?pre_result:Promise.resolve(pre_result)).then(function(){return processTemplate(individual,container,template,mode).then(function(processedTemplate){return processedTemplate.trigger(mode),toAppend&&container.append(processedTemplate),post_render_src&&eval("(function (){ 'use strict'; "+post_render_src+"}).call(individual);"),processedTemplate})})}/**
 * Process template
 * @param {IndividualModel} individual - individual to render
 * @param {Element} container - container to render individual to
 * @param {Element} template - template to render individual with
 * @param {string} mode - view | edit | search
 * @this Individual
 * @return {Promise}
 */function processTemplate(a,b,c,d){/**
   * Reset individual and embedded individuals
   * @param {string} parent id
   * @param {Array} acc for individuals uris
   * @return {Promise<void>}
   */function f(b,d){if(d=d||[],d=v.reduce(function(b,c){return c.data("reset")(a.id,b)},d),d.push(a.id),b)return d;var e=Util.unique(d);return e.reduce(function(a,b){return a.then(function(){return new veda.IndividualModel(b).reset(!0)})},Promise.resolve()).then(function(){return c.trigger("view")}).catch(l)}/**
   * Save individual and embedded children individuals
   * @param {string} parent id
   * @param {Array} acc for individuals uris
   * @return {Promise<void>}
   */function g(b,d){if(d=d||[],d=v.reduce(function(b,c){return c.data("save")(a.id,b)},d),b!==a.id&&d.push(a.id),b)return d;a.isSync(!1);var e=Util.unique(d),f=e.map(function(a){var b=new veda.IndividualModel(a);if(!b.isSync())return b.properties}).filter(Boolean);return Promise.all(f.map(function(a){return new veda.IndividualModel(a["@"]).trigger("beforeSave")})).then(function(){return Backend.put_individuals(veda.ticket,f)}).then(function(){f.forEach(function(a){var b=new veda.IndividualModel(a["@"]);b.isNew(!1),b.isSync(!0),b.isLoaded(!0)})}).then(function(){return Promise.all(f.map(function(a){return new veda.IndividualModel(a["@"]).trigger("afterSave")}))}).then(function(){return c.trigger("view")}).then(function(){return k()}).catch(l)}/**
   * Delete individual and embedded children individuals
   * @param {string} parent id
   * @return {Promise<void>}
   */function h(){return a.delete().then(function(){c.trigger("view"),k()}).catch(l)}/**
   * Recover individual and embedded children individuals
   * @param {string} parent id
   * @return {Promise<void>}
   */function i(){return a.recover().then(function(){c.trigger("view"),k()}).catch(l)}/**
   * Remove individual and embedded children individuals
   * @param {string} parent id
   * @param {Array} acc for individuals uris
   * @return {Promise<void>}
   */function j(b,d){if(d=d||[],d=v.reduce(function(b,c){return c.data("remove")(a.id,b)},d),d.push(a.id),b)return d;var e=Util.unique(d);return e.reduce(function(a,b){return a.then(function(){return new veda.IndividualModel(b).remove()})},Promise.resolve()).then(k).then(function(){var a=new IndividualModel("v-s:RemovedAlert");a.load().then(function(a){c.empty().append("<p class=\"bg-danger\"><strong>".concat(a.toString(),"</strong></p>"))})}).catch(l)}/**
   * Show success message
   * @return {void}
   */function k(){var a=new IndividualModel("v-s:SuccessBundle").load();a.then(function(a){var b=Notify?new Notify:function(){};b("success",{name:a.toString()})}).catch(console.log)}/**
   * Show error message
   * @param {Error} error to handle
   * @throw {Error}
   */function l(a){var b=new IndividualModel("v-s:ErrorBundle").load();throw b.then(function(a){var b=Notify?new Notify:function(){};b("danger",{name:a.toString()})}).catch(console.log),a}/**
   * Individual v-s:deleted handler. Shows deleted alert.
   * @this Individual
   * @return {void}
   */ // Get properties specifications
var m=veda.ontology,n=$.extend.apply({},[{}].concat(a["rdf:type"].map(function(a){return m.getClassSpecifications(a.id)})));c.attr({resource:a.id,typeof:a["rdf:type"].map(function(a){return a.id}).join(" ")});var o=c.find(".view").addBack(".view"),p=c.find(".edit").addBack(".edit"),q=c.find(".search").addBack(".search"),r=c.find(".-view").addBack(".-view"),s=c.find(".-edit").addBack(".-edit"),t=c.find(".-search").addBack(".-search"),u=function(a){a.stopPropagation(),d=a.type,c.data("mode",d);"view"===d?(o.show(),r.hide()):"edit"===d?(p.show(),s.hide()):"search"===d?(q.show(),t.hide()):void 0};c.on("view edit search",u);// Embedded templates list
var v=[];/**
   * Template mode handler. Triggers same events for embedded templates
   * @param {Event} event
   * @return {void}
   */c.on("view edit search",function syncEmbedded(b){v.map(function(c){c.trigger(b.type,a.id)}),b.stopPropagation()}),c.data({reset:f,save:g,delete:h,recover:i,remove:j}),c.one("remove",function(){c.removeData("reset","save","delete","recover","remove")}),c.on("cancel save delete recover destroy",function(a){a.stopPropagation(),"cancel"===a.type?f():"save"===a.type?g():"delete"===a.type?h():"recover"===a.type?i():"destroy"===a.type&&j()});var w=function(){if(this.hasValue("v-s:deleted",!0)){if(b&&"function"==typeof b.prop&&"main"===b.prop("id")&&!c.hasClass("deleted")){var a=new IndividualModel("v-s:DeletedAlert"),e=new IndividualModel("v-s:Recover");Promise.all([a.load(),e.load(),this.canUpdate()]).then(function(a){var b=a[0]["rdfs:label"].map(Util.formatValue).join(" "),d=a[1]["rdfs:label"].map(Util.formatValue).join(" "),e=a[2];e&&(b=b+"<button id=\"deleted-alert-recover\" class=\"btn btn-primary btn-xs recover pull-right\">"+d+"</button>");var f=$("<div id=\"deleted-alert\" class=\"container sheet margin-lg\">\n              <div class=\"alert alert-warning no-margin clearfix\" role=\"alert\">\n                <p id=\"deleted-alert-msg\">".concat(b,"</p>\n              </div>\n            </div>"));$(".recover",f).click(function(){c.trigger("recover")}),c.prepend(f)})}"search"!==d&&c.addClass("deleted")}else c.removeClass("deleted"),b&&"function"==typeof b.prop&&"main"===b.prop("id")&&$("#deleted-alert",c).remove()};a.on("v-s:deleted",w),c.one("remove",function(){a.off("v-s:deleted",w)}),w.call(a);/**
   * Individual v-s:valid handler. Shows alert whenb individual is invalid .
   * @this Individual
   * @return {void}
   */var x=function(){this.hasValue("v-s:valid",!1)&&!this.hasValue("v-s:deleted",!0)&&"view"===d?(("main"===b.prop("id")||b.hasClass("modal-body"))&&!c.hasClass("invalid")&&new IndividualModel("v-s:InvalidAlert").load().then(function(a){var b=a["rdfs:label"].map(Util.formatValue).join(" "),d=$("<div id=\"invalid-alert\" class=\"container sheet margin-lg\">\n              <div class=\"alert alert-danger no-margin clearfix\" role=\"alert\">\n                <p id=\"invalid-alert-msg\">".concat(b,"</p>\n              </div>\n            </div>"));c.prepend(d)}),c.addClass("invalid")):(c.removeClass("invalid"),"main"===b.prop("id")&&$("#invalid-alert",c).remove())};a.on("v-s:valid",x),a.on("v-s:deleted",x),c.one("remove",function(){a.off("v-s:valid",x),a.off("v-s:deleted",x)}),x.call(a),c.find("[href*='@']:not([rel] *):not([about] *)").addBack("[href*='@']:not([rel] *):not([about] *)").map(function(b,c){var d=$(c),e=d.attr("href");d.attr("href",e.replace("@",a.id))}),c.find("[src*='@']:not([rel] *):not([about] *)").addBack("[src*='@']:not([rel] *):not([about] *)").map(function(b,c){var d=$(c),e=d.attr("src");d.attr("src",e.replace("@",a.id))}),c.find("[style*='@']:not([rel] *):not([about] *)").addBack("[style*='@']:not([rel] *):not([about] *)").map(function(b,c){var d=$(c),e=d.attr("style");d.attr("style",e.replace("@",a.id))}),c.find("[title]:not([rel] *):not([about] *)").addBack("[style*='@']:not([rel] *):not([about] *)").map(function(a,b){var c=$(b),d=c.attr("title");if(/^(\w|-)+:.*?$/.test(d)){var e=new IndividualModel(d);e.load().then(function(a){c.attr("title",a)})}});// Property values
var y=c.find("[property]:not(veda-control):not([rel] *):not([about] *)").addBack("[property]:not(veda-control):not([rel] *):not([about] *)").map(function(b,e){var f,g,h=$(e),i=h.attr("property"),j=h.attr("about");return"@"===j?(f=a,g=!0,h.attr("about",f.id)):j?(f=new IndividualModel(j),g=!0):(f=a,g=!1),f.load().then(function(a){var b=function(){h.text(a.id)};if("@"===i)return h.text(a.id),a.on("idChanged",b),void c.one("remove",function(){a.off("idChanged",b)});// Re-render all property values if model's property was changed
var e=function(){renderPropertyValues(a,g,i,h,c,d)};a.on(i,e),c.one("remove",function(){a.off(i,e)}),renderPropertyValues(a,g,i,h,c,d)})}).get();// Max displayed values
c.on("click",".more",function(a){a.stopPropagation();var b=$(a.target),c=b.closest("[resource]").attr("resource"),d=new IndividualModel(c),e=b.closest("[rel]"),f=e.children().length-1,g=e.attr("rel");d.trigger(g,d.get(g),f+10),b.remove()});// Related resources & about resources
var z=c.find("[rel]:not(veda-control):not([rel] *):not([about] *)").addBack("[rel]:not(veda-control):not([rel] *):not([about] *)").map(function(b,e){var f,g,h=$(e),i=h.attr("about"),j=h.attr("rel"),k="true"===h.attr("data-embedded"),l=n[j]?new IndividualModel(n[j]):void 0,m=h.html().trim(),o=h.attr("data-template"),p=h.attr("data-limit")||1/0,q=h.attr("data-more")||!1;return h.sortable({delay:150,placeholder:"sortable-placeholder",forcePlaceholderSize:!0,handle:".button-drag",cancel:"",update:function update(){var b=$(this).sortable("toArray",{attribute:"resource"});a.set(j,b.map(function(a){return new IndividualModel(a)}))}}),c.one("remove",function(){h.sortable("destroy")}),i?(g=!0,i="@"===i?a:new IndividualModel(i),h.attr("about",i.id)):(g=!1,i=a),o?f=o:m.length&&(f=m),h.empty(),c.on("view edit search",function(b){if("view"===b.type)h.sortable("disable");else if("edit"===b.type){h.sortable("enable");var e=new IndividualModel(j);if(k&&l&&1<=l["v-ui:minCardinality"][0]&&!a.hasValue(j)&&!(e.hasValue("rdfs:range")&&"v-s:File"===e["rdfs:range"][0].id)){var c=l&&l.hasValue("v-ui:rangeRestriction")?l["v-ui:rangeRestriction"]:e.hasValue("rdfs:range")?e["rdfs:range"]:[],d=new IndividualModel;c.length&&(d["rdf:type"]=c),a.set(j,[d])}}else"search"===b.type&&h.sortable("enable");b.stopPropagation()}),i.load().then(function(a){var b=a.get(j),e=function(b,e){return p=e||p,h.empty(),b.reduce(function(b,e,l){return b.then(function(b){return l<p?renderRelationValue(a,g,j,e,h,f,c,d,v,k,!1).then(function(a){return b.concat(a)}):b})},Promise.resolve([])).then(function(a){h.append(a),p<b.length&&q&&h.append("<a class='more badge'>&darr; "+(b.length-p)+"</a>")})},i=function(b){"edit"===d&&b.map(function(b){b.id===a.id||// prevent self parent
"v-s:parent"===j||b.hasValue("v-s:parent")// do not change parent
||(b["v-s:parent"]=[a],b["v-s:backwardTarget"]=[a],b["v-s:backwardProperty"]=[j],b["v-s:canRead"]=[!0],b["v-s:canUpdate"]=[!0],b["v-s:canDelete"]=[!0])})};return k&&(i(b),a.on(j,i),c.one("remove",function(){a.off(j,i)})),a.on(j,e),c.one("remove",function(){a.off(j,e)}),e(b,p)})}).get(),A=c.find("[about]:not([rel] *):not([about] *):not([rel]):not([property])").addBack("[about]:not([rel] *):not([about] *):not([rel]):not([property])").map(function(b,c){var e,f,g=$(c),h=g.attr("data-template"),i=g.html().trim(),j="true"===g.attr("data-embedded");return h?f=new IndividualModel(h):i.length&&(f=i),g.empty(),"@"===g.attr("about")?(e=a,g.attr("about",e.id)):e=new IndividualModel(g.attr("about")),e.present(g,f,j?d:void 0).then(function(a){j&&(a.data("isEmbedded",!0),v.push(a),"edit"===d&&a.trigger("internal-validate"))})}).get(),B={state:!0};// About resource
c.data("validation",B);/**
   * Validate template handler
   * @param {Event} event - custom 'internal-validate' event
   * @return {void}
   */var C=function(e){e.stopPropagation(),"edit"===d&&(Object.keys(B).map(function(b){if("state"!==b){var c=n[b]?new IndividualModel(n[b]):void 0;B[b]=validate(a,b,c)}}),c.trigger("validate"),B.state=Object.keys(B).reduce(function(a,b){return"state"===b?a:a&&B[b].state},!0),B.state=B.state&&v.reduce(function(a,b){var c=b.data("validation");return c?a&&c.state:a},!0),c.trigger("internal-validated",[B])),c.data("isEmbedded")&&b.trigger("internal-validate")};c.on("internal-validate",C);/**
   * Trigger 'internal-validate' event on individual property change or when mode switches to 'edit'
   * @return {void}
   */var D=function(){"edit"===d&&c.trigger("internal-validate")};a.on("propertyModified",D),c.one("remove",function(){a.off("propertyModified",D)}),c.on("edit",D);/**
   * Merge validation result from custom template validation
   * @param {Event} event - custom 'validated' event
   * @param {Object} validationResult - validation result object
   * @return {void}
   */var E=function(a,b){a.stopPropagation(),"edit"===d&&(Object.keys(b).map(function(a){"state"===a||(B[a]=b[a])}),B.state=Object.keys(B).reduce(function(a,b){return"state"===b?a:a&&B[b].state},!0),c.trigger("internal-validated",[B]))};// Handle validation events from template
c.on("validate",function(a){return a.stopPropagation()}),c.on("validated",E),c.find("veda-control[property], veda-control[rel]").not("[rel] *").not("[about] *").map(function(b,e){var f=$(e),g=f.attr("property")||f.attr("rel"),h=f.attr("data-type")||"generic",i=n[g]?new IndividualModel(n[g]):void 0,j=$.fn["veda_"+h];B[g]={state:!0,cause:[]};var k=function(a,b){if(b.state||!b[g]||!0===b[g].state)f.removeClass("has-error"),f.popover("destroy");else{f.addClass("has-error");var c;if(b[g].message)c=b[g].message;else{var d=b[g].cause.map(function(a){return new IndividualModel(a).load()});Promise.all(d).then(function(a){c=a.map(function(a){return a["rdfs:comment"].map(Util.formatValue).filter(Boolean).join(", ")}).join("\n")})}f.popover({content:function content(){return c},container:f,trigger:"hover focus",placement:"top",animation:!1}),$("input",f).is(":focus")&&f.popover("show")}a.stopPropagation()};c.on("internal-validated",k),c.on("view edit search",function(a){a.stopPropagation(),f.trigger(a.type)});c.on("edit",function assignDefaultValue(b){i&&i.hasValue("v-ui:defaultValue")&&!a.hasValue(g)&&a.set(g,i["v-ui:defaultValue"]),b.stopPropagation()});var l={individual:a,property_uri:g,spec:i,mode:d};j.call(f,l)});var F=z.concat(A,y);return Promise.all(F).then(function(){return c})}/**
 * Render literal values of individual
 * @param {IndividualModel} about - individual
 * @param {Boolean} isAbout - is about flag
 * @param {string} property_uri - which property values to render
 * @param {Element} propertyContainer - where to render values
 * @param {Element} template - template reference
 * @param {string} mode - template mode
 * @return {void}
 */function renderPropertyValues(a,b,c,d,e,f){d.empty(),a.get(c).map(function(g){var h=Util.formatValue(g);if(b){var k=d.text();d.text(k?k+(h?" "+h:""):h)}else{var l=$("<span class='value-holder'></span>");d.append(l.text(Util.formatValue(g)));var i=$("<div class='prop-actions btn-group btn-group-xs' role='group'></div>"),j=$("<button class='btn btn-default' tabindex='-1'><span class='glyphicon glyphicon-remove'></span></button>");i.append(j),e.on("view edit search",function(a){"view"===a.type?i.hide():i.show(),a.stopPropagation()}),"view"===f&&i.hide(),j.click(function(){a.removeValue(c,g)}).mouseenter(function(){l.addClass("red-outline")}).mouseleave(function(){l.removeClass("red-outline")}),l.append(i)}})}/**
 * Render related objects of individual
 * @param {IndividualModel} about - individual
 * @param {Boolean} isAbout - is about flag
 * @param {string} rel_uri - which relation values to render
 * @param {IndividualModel} value - value to render
 * @param {Element} relContainer - where to render the value
 * @param {Element} relTemplate - which template to user to render the value
 * @param {Element} template - template reference
 * @param {string} mode - template mode
 * @param {Array} embedded - embedded templates list
 * @param {Boolean} isEmbedded - flag to include rendered value to embedded list
 * @param {Boolean} toAppend - flag defining either to append or replace the relContainer's content with rendered value template
 * @return {void}
 */function renderRelationValue(a,b,c,d,e,f,g,h,i,j,k){return d.present(e,f,j?h:void 0,void 0,k).then(function(f){if(j&&(f.data("isEmbedded",!0),i.push(f),"edit"===h&&f.trigger("internal-validate"),f.one("remove",function(){if(i.length){var a=i.indexOf(f);0<=a&&i.splice(a,1)}})),!b){var k=$("<div class='rel-actions btn-group btn-group-xs -view edit search' role='group'></div>"),l=$("<button class='btn btn-default button-drag' tabindex='-1'><span class='glyphicon glyphicon-move'></span></button>"),m=$("<button class='btn btn-default button-delete' tabindex='-1'><span class='glyphicon glyphicon-remove'></span></button>");if(k.append(l,m),g.on("view edit search",function(a){"view"===a.type?k.hide():k.show(),a.stopPropagation()}),"view"===h&&k.hide(),m.click(function(b){b.preventDefault(),b.stopPropagation(),f.remove(),a.removeValue(c,d),d.is("v-s:Embedded")&&d.hasValue("v-s:parent",a)&&d.delete()}).mouseenter(function(){f.addClass("red-outline")}).mouseleave(function(){f.removeClass("red-outline")}),l.mouseenter(function(){f.addClass("gray-outline")}).mouseleave(function(){f.removeClass("gray-outline")}).mousedown(function(){e.addClass("sortable-overflow")}).mouseup(function(){e.removeClass("sortable-overflow")}),"inline"!==f.css("display")&&k.addClass("block"),"table-row"===f.css("display")||"TR"===f.prop("tagName")){var n=f.children().last();n.css("position","relative").append(k)}else f.css("position","relative"),f.append(k)}return f})}/**
 * Validate individual property values against property specification
 * @param {IndividualModel} individual - individual to validate
 * @param {string} property_uri - property which values are validated
 * @param {IndividualModel} spec - Property specification to validate values against
 * @return {Object} - validation result
 */function validate(a,b,c){var d={state:!0,cause:[]};if(!c)return d;var e=a.get(b);// cardinality check
if(c.hasValue("v-ui:minCardinality")){var f=e.length>=c["v-ui:minCardinality"][0]&&// filter empty values
e.length===e.filter(function(a){return"boolean"==typeof a||"number"==typeof a||!!a}).length;d.state=d.state&&f,f||d.cause.push("v-ui:minCardinality")}if(c.hasValue("v-ui:maxCardinality")){var g=e.length<=c["v-ui:maxCardinality"][0]&&// filter empty values
e.length===e.filter(function(a){return"boolean"==typeof a||"number"==typeof a||!!a}).length;d.state=d.state&&g,g||d.cause.push("v-ui:maxCardinality")}// check each value
return d=d&&e.reduce(function(a,b){// regexp check
if(c.hasValue("v-ui:regexp")){var d=new RegExp(c["v-ui:regexp"][0]),e=d.test(b.toString());a.state=a.state&&e,e||a.cause.push("v-ui:regexp")}// range check
switch(c["rdf:type"][0].id){case"v-ui:DatatypePropertySpecification":if(c.hasValue("v-ui:minValue")){var f=b>=c["v-ui:minValue"][0];a.state=a.state&&f,f||a.cause.push("v-ui:minValue")}if(c.hasValue("v-ui:maxValue")){var g=b<=c["v-ui:maxValue"][0];a.state=a.state&&g,g||a.cause.push("v-ui:maxValue")}if(c.hasValue("v-ui:minLength")){var h=b.toString().length>=c["v-ui:minLength"][0];a.state=a.state&&h,h||a.cause.push("v-ui:minLength")}if(c.hasValue("v-ui:maxLength")){var i=b.toString().length<=c["v-ui:maxLength"][0];a.state=a.state&&i,i||a.cause.push("v-ui:maxLength")}break;case"v-ui:ObjectPropertySpecification":}return a},d),d}var veda,IndividualModel,Backend,Util,riot,Notify,$;return{setters:[function(a){veda=a.default},function(a){IndividualModel=a.default},function(a){Backend=a.default},function(a){Util=a.default},function(){},function(a){riot=a.default},function(a){Notify=a.default},function(){},function(a){$=a.default},function(){},function(){}],execute:function(){IndividualModel.prototype.present=IndividualPresenter,_export("default",IndividualPresenter)}}});
//# sourceMappingURL=individual_presenter.js.map