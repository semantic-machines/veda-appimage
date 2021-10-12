"use strict";System.register([],function(a){"use strict";// DOM Helpers
/**
 * Delegate event listener to ancestor element
 * @param {Element} el - ancestor element
 * @param {string} event - event id
 * @param {string} delegateSelector - delegate selector
 * @param {function} handler - event handler
 * @param {boolean} useCapture
 * @return {void}
 */return a("delegateHandler",function(a,b,c,d,e){/**
   * Event listener for ancestor element
   * @param {Event} event - event
   * @return {void}
   * @this Element
   */a.addEventListener(b,function(a){for(var b=a.target;b&&b!==this;b=b.parentNode)if(b.matches(c)){d.call(b,a);break}},e)}),{setters:[],execute:function(){}}});
//# sourceMappingURL=dom_helpers.js.map