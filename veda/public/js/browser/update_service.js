// Update service for individuals that were changed on server
'use strict';System.register(["../common/veda.js","../common/individual_model.js","../common/backend.js"],function(a){"use strict";/**
 * Client in memory cache update service singleton constructor
 * @return {Promise} update service instance promise
 */function b(){/**
   * Initialize instance
   * @return {Promise} instance promise
   */function a(){return e.reset_individual(c.ticket,"cfg:ClientUpdateServicePort").then(function(a){var b=a["rdf:value"]&&a["rdf:value"][0].data,c="http:"===window.location.protocol?"ws:":"wss:",d=b||window.location.port,e=c+"//"+window.location.hostname+(d?":"+d:"")+"/ccus",m=new WebSocket(e);return m.onopen=h,m.onclose=k,m.onerror=j,m.onmessage=i,m.receiveMessage=g,m.sendMessage=f,l.socket=m,l})}/**
   * Send a message via socket
   * @param {string} msg - message to send
   * @this UpdateService
   * @return {void}
   */function f(a){var b=this;return"="===a||"-*"===a||0===a.indexOf("ccus")?void(1===b.readyState&&b.send(a)):void(s.push(a),!m&&(m=setTimeout(function(){var a=s.join(",");1===b.readyState&&b.send(a),s=[],m=void 0},t)))}/**
   * Receive a message via socket
   * @param {string} msg - received message
   * @return {void}
   */function g(a){// console.log("server -> client:", msg);
if(""===a)return void(v=Date.now());var b=0===a.indexOf("=")?a.substr(1):a;if(0!==b.length){b=b.split(",");for(var h=0;h<b.length;h++)try{var c=b[h].split("="),e=c[0];if(!e)continue;var f=parseInt(c[1]),g=new d(e);if(g.hasValue("v-s:updateCounter",f))continue;l.list[e]&&(l.list[e].updateCounter=f),l.list[e].action?l.list[e].action.call(g,f):0!==f&&g.reset()}catch(a){console.log("error: individual update service failed",a)}}}/**
   * Socket opened handler
   * @param {Event} event
   * @this UpdateService
   * @return {void}
   */function h(a){var b=this;u=o,console.log("client: websocket opened",a.target.url),this.sendMessage("ccus="+c.ticket),l.restore(),c.trigger("ccus-online"),n=setInterval(function(){if(Date.now()-v>2*r)return console.log("client: ping missed, close socket"),c.trigger("ccus-offline"),clearInterval(n),void b.close()},r)}/**
   * Message received handler
   * @param {Event} event
   * @this WebSocket
   * @return {void}
   */function i(a){var b=a.data;this.receiveMessage(b)}/**
   * Socket error handler
   * @param {Event} event
   * @this WebSocket
   * @return {void}
   */function j(a){console.log("client: ccus error",a),this.close()}/**
   * Socket closed handler
   * @param {Event} event
   * @return {void}
   */function k(b){u=u<q?u*p:q,console.log("client: websocket closed",b.target.url,"| re-connect in",u/1e3,"sec"),setTimeout(a,u),c.trigger("ccus-offline"),clearInterval(n)}var l=this;// Singleton pattern
if(b.prototype._singletonInstance)return b.prototype._singletonInstance;this.list={};var m,n,o=2500+Math.round(2500*Math.random()),p=1.1,q=1e3*(60*5),r=5e3,s=[],t=1e3,u=o,v=Date.now();// 2.5 - 5 sec
return b.prototype._singletonInstance=a()}var c,d,e,f;return{setters:[function(a){c=a.default},function(a){d=a.default},function(a){e=a.default}],execute:function(){a("default",b);f=b.prototype,f.subscribe=function(a,b){var c=this;if(this.list[a])++this.list[a].subscribeCounter;else{var e=new d(a);e.load().then(function(d){var e=d.hasValue("v-s:updateCounter")?d.get("v-s:updateCounter")[0]:0;c.list[a]={subscribeCounter:1,updateCounter:e},b&&(c.list[a].action=b),c.socket.sendMessage("+"+a+"="+e)})}},f.unsubscribe=function(a){a?this.list[a]&&1<this.list[a].subscribeCounter?--this.list[a].subscribeCounter:(delete this.list[a],this.socket.sendMessage("-"+a)):(this.list={},this.socket.sendMessage("-*"))},f.restore=function(){for(var a in this.socket.sendMessage("-*"),this.list)Object.hasOwnProperty.call(this.list,a)&&this.socket.sendMessage("+"+a+"="+this.list[a].updateCounter)}}}});
//# sourceMappingURL=update_service.js.map