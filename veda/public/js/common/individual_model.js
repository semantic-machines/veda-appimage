// Class to manipulate individuals.
'use strict';System.register(["../common/veda.js","../common/lib/riot.js","../common/backend.js","../common/util.js"],function(a){"use strict";function b(a,b){return null!=b&&"undefined"!=typeof Symbol&&b[Symbol.hasInstance]?!!b[Symbol.hasInstance](a):a instanceof b}function c(a){"@babel/helpers - typeof";return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},c(a)}/**
 * @constructor
 * @param {string} uri URI of individual. If not specified, than id of individual will be generated automatically.
 * @param {boolean} cache Use cache true / false. If true or not set, then object will be return from application cache (veda.cache). If false or individual not found in application cache - than individual will be loaded from database
 * @param {boolean} init individual with class model at load. If true or not set, then individual will be initialized with class specific model upon load.
 */function d(a,b,d){if("object"!==c(a)||a["@"]||(b=a.cache,d=a.init,a=a.uri),this._={cache:"boolean"==typeof b?b:b||!0,init:"undefined"==typeof d||d,isNew:"undefined"==typeof a,isSync:"object"===c(a),isLoaded:"object"===c(a),pending:{},uri:a},"object"===c(a)?(this.properties=a,this.original=JSON.stringify(a)):this.properties={},this._.cache){var f;if("string"==typeof a?(this.id=a,f=m.cache.get(this.id)):"object"===c(a)?(f=m.cache.get(this.id),f&&!f.isLoaded()&&(f.properties=a)):"undefined"==typeof a&&(this.id=p.genUri()),f)return f;m.cache.set(this,this._.cache)}return n.observable(this),this.on("rdf:type",this.init),this.on("beforeSave",e),this}/**
 * Save handler. Sets creator & creation date
 * @this IndividualModel
 */function e(){var a=new Date,b=m.appointment?m.appointment:m.user;this.hasValue("v-s:creator")||this.set("v-s:creator",[b]),this.hasValue("v-s:created")||this.set("v-s:created",[a]);"cfg:Administrator"===m.user.id||this.hasValue("v-s:lastEditor")&&this.hasValue("v-s:edited")&&this.get("v-s:lastEditor")[0].id===b.id&&!(1e3<a-this.get("v-s:edited")[0])||(this.set("v-s:edited",[a]),this.set("v-s:lastEditor",[b]))}/**
 * Utility fn
 * @param {Array} arr
 * @return {Array}
 */function f(a){for(var b,c={},d=[],e=0;e<a.length;e++)b=a[e].type+a[e].data+(a[e].lang||""),c[b]||(c[b]=!0,d.push(a[e]));return d}// Define properties from ontology in IndividualModel.prototype
/**
 * Parse serialized value
 * @param {Object} value
 * @return {string|number|Date|Boolean}
 */function g(a){if("String"===a.type&&a.data){var b=new String(a.data);return a.lang&&"NONE"!==a.lang&&(b.language=a.lang),b}return"Uri"===a.type?new d(a.data):"Datetime"===a.type?new Date(Date.parse(a.data)):"Decimal"===a.type?parseFloat(a.data):"Integer"===a.type?parseInt(a.data):"Boolean"===a.type?!!a.data:void 0}/**
 * Serialize value
 * @param {number|Boolean|Date|string|IndividualModel} value
 * @return {Object}
 */function h(a){if("number"==typeof a)return{type:p.isInteger(a)?"Integer":"Decimal",data:a};if("boolean"==typeof a)return{type:"Boolean",data:a};if(b(a,Date))return{type:"Datetime",data:a.toISOString().split(".")[0]+"Z"};if(b(a,d))return{type:"Uri",data:a.id};if("string"==typeof a||b(a,String)){if(r.test(a))return{type:"Uri",data:a.valueOf()};if(s.test(a))return{type:"Datetime",data:a.valueOf()};if(t.test(a))return{type:"String",data:a.replace(t,"$1"),lang:a.replace(t,"$2").toUpperCase()};if(a.length)return{type:"String",data:a.valueOf(),lang:a.language||"NONE"}}}// Special properties
/**
 * Add value to individual
 * @param {String} property_uri property name
 * @param {Any_allowed_type} value
 * @return {void}
 * @this IndividualModel
 */function i(a,b){if(b!=null){var c=h(b);this.properties[a].push(c)}}/**
 * Remove value from individual
 * @param {String} property_uri property name
 * @param {Any_allowed_type} values
 * @param {Boolean} silently
 * @return {IndividualModel}
 */ /**
 * Remove value from individual
 * @param {String} property_uri property name
 * @param {Any_allowed_type} value
 * @this {IndividualModel}
 * @return {void}
 */function j(a,b){if(b!=null){var c=h(b);this.properties[a]=(this.properties[a]||[]).filter(function(a){return!(a.data==c.data&&(!(a.lang&&c.lang)||a.lang===c.lang))})}}/**
 * Toggle value in individual
 * @param {String} property_uri
 * @param {Any_allowed_type} values
 * @param {Boolean} silently
 * @return {this}
 */ /**
 * Toggle value in individual
 * @param {String} property_uri
 * @param {Any_allowed_type} value
 * @this IndividualModel
 */function k(a,b){b!=null&&(this.hasValue(a,b)?j.call(this,a,b):i.call(this,a,b))}/**
 * Clear property values in individual
 * @param {String} property_uri
 * @param {Boolean} silently
 * @return {this}
 */ /**
 * Prefetch linked objects. Useful for presenting objects with many links.
 * @param {Array} result
 * @param {number} depth of the object tree to prefetch
 * @param {Array} uris
 * @return {Promise}
 * @this IndividualModel
 */function l(a,b,c){for(var e=this,f=arguments.length,g=Array(3<f?f-3:0),h=3;h<f;h++)g[h-3]=arguments[h];c=p.unique(c);var i=c.filter(function(b){var c=m.cache.get(b);return c&&0>a.indexOf(c)&&a.push(c),!c});return(i.length?o.get_individuals(m.ticket,i):Promise.resolve([])).then(function(f){var h=[];return(f.forEach(function(b){if(b){var c=new d(b);0>a.indexOf(c)&&a.push(c)}}),0==b-1)?a:(c.forEach(function(a){var b=new d(a),c=b.properties;Object.keys(c).forEach(function(a){"@"===a||g.length&&0>g.indexOf(a)||c[a].map(function(a){"Uri"===a.type&&h.push(a.data)})})}),h.length?l.apply(e,[a,b-1,h].concat(g)):a)})}var m,n,o,p,q,r,s,t;return{setters:[function(a){m=a.default},function(a){n=a.default},function(a){o=a.default},function(a){p=a.default}],execute:function(){a("default",m.IndividualModel=d);/**
 * Load individual specified by uri from database. If cache parameter (from constructor) is true, than try to load individual from browser cache first.
 * @return {Promise<IndividualModel>}
 */ /**
 * Save current individual to database
 * @param {boolean} isAtomic
 * @return {Promise<IndividualModel>}
 */ /**
 * Reset current individual to database
 * @param {Boolean} forced
 * @return {Promise<IndividualModel>}
 */ /**
 * Mark current individual as deleted in database (set v-s:deleted = true)
 * @return {Promise<IndividualModel>}
 */ /**
 * Remove individual from database
 * @return {Promise<IndividualModel>}
 */ /**
 * Recover current individual in database (remove v-s:deleted property)
 * @return {Promise<IndividualModel>}
 */ /**
 * Check if individual has a property and optionally check if it contains a value
 * @param {String} property_uri property name
 * @param {Object} value to check
 * @return {boolean} is requested property (and optionally value) exists in this individual
 */ /**
 * Add value to individual
 * @param {String} property_uri property name
 * @param {Any_allowed_type} values
 * @param {Boolean} silently
 * @return {IndividualModel}
 */ /**
 * Check if individual is an instace of specific class
 * @param {String} _class id of class to check
 * @return {boolean} is individual rdf:type subclass of requested class
 */ /**
 * Initialize individual with class specific domain properties and methods
 * @return {Promise<IndividualModel>}
 */ /**
 * Clone individual with different (generated) id
 * @return {Promise<IndividualModel>} clone of this individual with different id.
 */ /**
 * Set/get flag whether individual is synchronized with db
 * @param {boolean} value
 * @return {boolean}
 */ /**
 * Set/get flag whether individual is new (not saved in db)
 * @param {boolean} value
 * @return {boolean}
 */ /**
 * Set/get flag whether individual was loaded from db
 * @param {boolean} value
 * @return {boolean}
 */ /**
 * Serialize to JSON
 * @return {Object} JSON representation of individual.
 */ /**
 * Serialize to string
 * @return {String} String representation of individual.
 */ /**
 * Return this
 * @return {String} individual id.
 */ /**
 * Get values for first property chain branch.
 * @return {Promise<Array>}
 */ /**
 * Get values for all property chain branches.
 * @return {Promise<Array>}
 */ /**
 * Check value for all property chain branches.
 * @param {string} sought_value
 * @param {...string} ...args
 * @return {Promise<Boolean>}
 */ /**
 * Prefetch linked objects. Useful for presenting objects with many links.
 * @param {number} depth of the object tree to prefetch.
 * @return {Promise}
 */q=d.prototype,q.get=function(a){return this.properties[a]?this.properties[a].map(g).filter(function(a){return"undefined"!=typeof a}):[]},q.set=function(a,b,c){var d=this;this.isSync(!1),Array.isArray(b)||(b=[b]);var e=b.map(h).filter(Boolean),g=f(e);return JSON.stringify(g)!==JSON.stringify(this.properties[a]||[])&&(g.length?this.properties[a]=g:delete this.properties[a],!c)?(b=this.get(a),this.trigger("propertyModified",a,b).then(function(){return d.trigger(a,b)})):Promise.resolve(this)},d.defineProperty=function(a){Object.defineProperty(q,a,{get:function get(){return this.get(a)},set:function set(b){return this.set(a,b)},configurable:!1,enumerable:!1})},r=/^[a-z][a-z-0-9]*:([a-zA-Z0-9-_])*$/,s=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,t=/^([\s\S]*)@([a-z]{2})$/im,Object.defineProperty(q,"id",{get:function get(){return this.properties["@"]},set:function set(a){var b=this.properties&&this.properties["@"];this.properties["@"]=a,b&&this._.cache&&m.cache.get(b)&&(m.cache.remove(b),m.cache.set(this,this._.cache))}}),Object.defineProperty(q,"membership",{get:function get(){var a=this;// if (this._.membership) { return Promise.resolve(this._.membership); }
return this.isNew()?(this._.membership=new d({cache:!1}),Promise.resolve(this._.membership)):o.get_membership(m.ticket,this.id).then(function(b){return a._.membership=new d({uri:b,cache:!1})}).catch(function(b){return console.log("membership error",a.id,b),a._.membership=new d({cache:!1})})},configurable:!1,enumerable:!1}),q.memberOf=function(){return this.membership.then(function(a){return a.hasValue("v-s:memberOf")?a.properties["v-s:memberOf"].map(function(a){return a.data}):[]})},q.isMemberOf=function(a){return this.membership.then(function(b){return b.hasValue("v-s:memberOf",a)})},Object.defineProperty(q,"rights",{get:function get(){var a=this;// if (this._.rights) { return Promise.resolve(this._.rights); }
return this.isNew()?(this._.rights=new d({cache:!1}),this._.rights["v-s:canCreate"]=[!0],this._.rights["v-s:canRead"]=[!0],this._.rights["v-s:canUpdate"]=[!0],this._.rights["v-s:canDelete"]=[!0],Promise.resolve(this._.rights)):o.get_rights(m.ticket,this.id).then(function(b){return a._.rights=new d(b,!1)}).catch(function(b){return console.log("rights error",a.id,b),a._.rights=new d({cache:!1})})},configurable:!1,enumerable:!1}),q.can=function(a){return a=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase(),this.rights.then(function(b){return b.hasValue("v-s:can"+a,!0)})},q.canCreate=function(){return this.can("Create")},q.canRead=function(){return this.can("Read")},q.canUpdate=function(){return this.can("Update")},q.canDelete=function(){return this.can("Delete")},Object.defineProperty(q,"rightsOrigin",{get:function get(){var a=this;// if (this._.rightsOrigin) { return Promise.resolve(this._.rightsOrigin); }
return o.get_rights_origin(m.ticket,this.id).then(function(b){return a._.rightsOrigin=Promise.all(b.map(function(a){return new d(a,!1)}))}).catch(function(b){return console.log("rights error",a.id,b),a._.rightsOrigin=[]})},configurable:!1,enumerable:!1}),q.load=function(){var a=this;return this.isLoading()&&"undefined"!=typeof window?this.isLoading():this.trigger("beforeLoad").then(function(){if(a.isLoaded()&&("online"===o.status||"offline"===o.status))return a.trigger("afterLoad");if(a.isLoaded()&&"limited"===o.status)return"undefined"==typeof window?a.reset().then(function(){return a.trigger("afterLoad")}):a.is("v-s:UserThing").then(function(b){return b?a.reset():a}).then(function(){return a.trigger("afterLoad")});var b=a._.uri;if("string"==typeof b){var d=o.get_individual(m.ticket,b).then(function(b){return a.isLoading(!1),a.isNew(!1),a.isSync(!0),a.isLoaded(!0),a.properties=b,a.original=JSON.stringify(b),(a._.init?a.init():Promise.resolve(a)).then(function(){return a.trigger("afterLoad")})}).catch(function(c){return a.isLoading(!1),console.log("load individual error",a.id,c.stack),422===c.code||404===c.code?(a.isNew(!0),a.isSync(!1),a.isLoaded(!1),a.properties={"@":b,"rdf:type":[{type:"Uri",data:"rdfs:Resource"}],"rdfs:label":[{type:"String",data:"\u041E\u0431\u044A\u0435\u043A\u0442 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 ["+b+"]",lang:"RU"},{type:"String",data:"Object does not exist ["+b+"]",lang:"EN"}]}):472===c.code?(a.isNew(!1),a.isSync(!1),a.isLoaded(!1),a.properties={"@":b,"rdf:type":[{type:"Uri",data:"rdfs:Resource"}],"rdfs:label":[{type:"String",data:"\u041D\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u043E\u0431\u044A\u0435\u043A\u0442",lang:"RU"},{type:"String",data:"Insufficient rights",lang:"EN"}]}):470===c.code||471===c.code?(a.isNew(!1),a.isSync(!1),a.isLoaded(!1)):0===c.code||4e3===c.code||503===c.code?(a.isNew(!1),a.isSync(!1),a.isLoaded(!1),a.properties={"@":b,"rdf:type":[{type:"Uri",data:"rdfs:Resource"}],"rdfs:label":[{type:"String",data:"\u041D\u0435\u0442 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C. \u042D\u0442\u043E\u0442 \u043E\u0431\u044A\u0435\u043A\u0442 \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D.",lang:"RU"},{type:"String",data:"Server disconnected. This object is not available now.",lang:"EN"}]},m.one("online",function(){return a.reset()})):(a.isNew(!1),a.isSync(!1),a.isLoaded(!1),a.properties={"@":b,"rdf:type":[{type:"Uri",data:"rdfs:Resource"}],"rdfs:label":[{type:"String",data:b,lang:"NONE"}]}),a.trigger("afterLoad")});return a.isLoading(d)}return"object"===c(b)?(a.isNew(!1),a.isSync(!0),a.isLoaded(!0),a.properties=b):"undefined"==typeof b&&(a.isNew(!0),a.isSync(!1),a.isLoaded(!1)),(a._.init?a.init():Promise.resolve(a)).then(function(){return a.trigger("afterLoad")})})},q.save=function(a){var b=this;// Do not save individual to server if nothing changed
return this.isSync()?Promise.resolve(this):this.isSaving()&&this.isSync()&&"undefined"!=typeof window?this.isSaving():(null==a&&(a=!0),this.trigger("beforeSave").then(function(){Object.keys(b.properties).reduce(function(a,b){return"@"===b?a:(a[b].length||delete a[b],a)},b.properties);var c=b.original?JSON.parse(b.original):{"@":b.id},d=p.diff(b.properties,c),e=(b.isNew()||a?o.put_individual(m.ticket,b.properties):Promise.all([d.added&&Object.keys(d.added).length?(d.added["@"]=b.id,o.add_to_individual(m.ticket,d.added)):void 0,d.differ&&Object.keys(d.differ).length?(d.differ["@"]=b.id,o.set_in_individual(m.ticket,d.differ)):void 0,d.missing&&Object.keys(d.missing).length?(d.missing["@"]=b.id,o.remove_from_individual(m.ticket,d.missing)):void 0])).then(function(){return b.original=JSON.stringify(b.properties),b.isSaving(!1),b.isNew(!1),b.isSync(!0),b.isLoaded(!0),b.trigger("afterSave")}).catch(function(a){throw b.isSaving(!1),console.log("save individual error",b.id,a),a});return b.isSaving(e)}))},q.reset=function(a){var c=this,e=function(e){c.original=JSON.stringify(e);var f=p.diff(c.properties,e);return a||c.isSync()||!c.isLoaded()?(c.properties=e,c.isNew(!1),c.isSync(!0),c.isLoaded(!0),Promise.all(Object.keys(f.added).concat(Object.keys(f.differ),Object.keys(f.missing)).map(function(a){var b=c.get(a);return c.trigger("propertyModified",a,b).then(function(){return c.trigger(a,b)})}))):Promise.all(Object.keys(f.missing).map(function(a){return c.set(a,e[a].map(g))})).then(function(){// Add missing object values
return Promise.all(Object.keys(f.differ).map(function(a){var f=e[a].map(g).filter(function(e){return!c.hasValue(a,e)&&b(e,d)});return c.addValue(a,f)}))})};return this.isResetting()&&"undefined"!=typeof window?this.isResetting():this.trigger("beforeReset").then(function(){if(c.isNew())return c.trigger("afterReset");var a=o.reset_individual(m.ticket,c.id).then(e).then(function(){return c.isResetting(!1),c.trigger("afterReset")}).catch(function(a){throw c.isResetting(!1),console.log("reset individual error",c.id,a.stack),a});return c.isResetting(a)})},q.delete=function(){var a=this;return this.trigger("beforeDelete").then(function(){if(!a.isNew())return a["v-s:deleted"]=[!0],a["rdf:type"]=a["rdf:type"].concat(new m.IndividualModel("v-s:Deletable")),a.save()}).then(function(){return a.trigger("afterDelete")})},q.remove=function(){var a=this;return this.trigger("beforeRemove").then(function(){return a._.cache&&m.cache&&m.cache.get(a.id)&&m.cache.remove(a.id),a.isNew()?void 0:o.remove_individual(m.ticket,a.id)}).then(function(){return a.trigger("afterRemove")})},q.recover=function(){var a=this;return this.trigger("beforeRecover").then(function(){return a["v-s:deleted"]=[!1],a.save()}).then(function(){return a.trigger("afterRecover")})},q.hasValue=function(a,b){if(!a&&"undefined"!=typeof b&&null!==b){var d=!1;for(var e in this.properties)"@"!=e&&(d=d||this.hasValue(e,b));return d}var c=!!(this.properties[a]&&this.properties[a].length);if("undefined"!=typeof b&&null!==b){var f=h(b);c=c&&!!this.properties[a].filter(function(a){return a.type===f.type&&a.data===f.data&&(!(a.lang&&f.lang)||a.lang===f.lang)}).length}return c},q.addValue=function(a,b,c){var d=this;return"undefined"==typeof b||null===b?Promise.resolve(this):(this.properties[a]=this.properties[a]||[],Array.isArray(b)?b.forEach(function(b){return i.call(d,a,b)}):i.call(this,a,b),this.isSync(!1),c?Promise.resolve(this):(b=this.get(a),this.trigger("propertyModified",a,b).then(function(){return d.trigger(a,b)})))},q.removeValue=function(a,b,c){var d=this;return this.properties[a]&&this.properties[a].length&&"undefined"!=typeof b&&null!==b?(Array.isArray(b)?b.forEach(function(b){return j.call(d,a,b)}):j.call(this,a,b),this.isSync(!1),c?Promise.resolve(this):(b=this.get(a),this.trigger("propertyModified",a,b).then(function(){return d.trigger(a,b)}))):Promise.resolve(this)},q.toggleValue=function(a,b,c){var d=this;return"undefined"==typeof b||null===b?Promise.resolve(this):(this.properties[a]=this.properties[a]||[],Array.isArray(b)?b.forEach(function(b){return k.call(d,a,b)}):k.call(this,a,b),this.isSync(!1),c?Promise.resolve(this):(b=this.get(a),this.trigger("propertyModified",a,b).then(function(){return d.trigger(a,b)})))},q.clearValue=function(a,b){var c=this;if(!this.properties[a]||!this.properties[a].length)return Promise.resolve(this);if(delete this.properties[a],this.isSync(!1),!b){var d=[];return this.trigger("propertyModified",a,d).then(function(){return c.trigger(a,d)})}return Promise.resolve(this)},q.is=function(a){var b=this,c=function(b){if(f)return f;if(!b.hasValue("rdfs:subClassOf"))return f=f||!1;if(b.hasValue("rdfs:subClassOf",a.id))return f=f||!0;var d=b.get("rdfs:subClassOf");return Promise.all(d.map(c)).then(function(a){return a.reduce(function(a,b){return a||b},!1)})};"string"==typeof a.valueOf()&&(a=new d(a.valueOf()));var e=this.get("rdf:type"),f=e.reduce(function(c){return c||b.hasValue("rdf:type",a.id)},!1);return f?Promise.resolve(f):Promise.all(e.map(c)).then(function(a){return a.reduce(function(a,b){return a||b},!1)})},q.init=function(){var a=this,b=this.hasValue("rdf:type","owl:Class")||this.hasValue("rdf:type","rdfs:Class");if(this.hasValue("v-ui:hasModel")&&!b)return this.get("v-ui:hasModel")[0].load().then(function(b){return b.modelFn||(b.modelFn=new Function("veda",b["v-s:script"][0])),b.modelFn.call(a,m),a});var c=this.get("rdf:type").map(function(a){return a.load()});return Promise.all(c).then(function(a){var b=[];return a.map(function(a){a.hasValue("v-ui:hasModel")&&b.push(a.get("v-ui:hasModel")[0].load())}),Promise.all(b)}).then(function(b){return b.map(function(b){b.modelFn||(b.modelFn=new Function("veda",b.get("v-s:script")[0])),b.modelFn.call(a,m)}),a})},q.clone=function(){var a=JSON.parse(JSON.stringify(this.properties));a["@"]=p.genUri();var b=new d(a);return b.isNew(!0),b.isSync(!1),b.clearValue("v-s:updateCounter"),b.init()},q.isSync=function(a){return"undefined"==typeof a?this._.isSync:this._.isSync=a},q.isNew=function(a){return"undefined"==typeof a?this._.isNew:this._.isNew=a},q.isLoaded=function(a){return"undefined"==typeof a?this._.isLoaded:this._.isLoaded=a},q.isPending=function(a,b){return"undefined"==typeof b?this._.pending[a]:this._.pending[a]=b},q.isLoading=function(a){return this.isPending("load",a)},q.isSaving=function(a){return this.isPending("save",a)},q.isResetting=function(a){return this.isPending("reset",a)},q.toJson=function(){return this.properties},q.toString=function(){return this.hasValue("rdfs:label")?this.get("rdfs:label").map(p.formatValue).join(" "):this.hasValue("rdf:type")?this.get("rdf:type")[0].toString()+": "+this.id:this.id},q.valueOf=function(){return this.id},q.getPropertyChain=function(){for(var a=this,b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];var e=c.shift();return this.load().then(function(){return a.hasValue(e)?c.length?a.getPropertyChain.apply(a[e][0],c):a[e]:[]}).catch(function(a){console.log(a)})},q.getChainValue=function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];var d=this;Array.isArray(d)||(d=[d]);var e=b.shift(),f=d.map(function(a){return a.load()});return Promise.all(f).then(function(a){var c=a.reduce(function(a,b){return a.concat(b[e])},[]);return b.length?q.getChainValue.apply(c,b):c}).catch(function(a){return console.log(a),[]})},q.hasChainValue=function(a){for(var b=arguments.length,c=Array(1<b?b-1:0),d=1;d<b;d++)c[d-1]=arguments[d];return this.getChainValue.apply(this,c).then(function(b){return b.reduce(function(b,c){return b||a.valueOf()==c.valueOf()},!1)})},q.prefetch=function(a){for(var b=this,c=arguments.length,d=Array(1<c?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e];return a=a||1,this.load().then(function(){return l.apply(b,[[],a,[b.id]].concat(d))})}}}});
//# sourceMappingURL=individual_model.js.map