"use strict";System.register(["bowser"],function(){"use strict";var a,b,c,d,e,f,g;return{setters:[function(b){a=b.default}],execute:function(){// Check browser version
b="\n  <style scoped>\n    #update-overlay {\n      position: fixed;\n      width: 100%;\n      height: 100%;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background-color: rgba(0,0,0,0.5);\n      z-index: 9999;\n    }\n    #update-overlay > * {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n      color: white;\n      padding:1.5em;\n      border-radius: 0.25em;\n      background-color: rgba(0,0,0,0.7);\n      transform: translate(-50%,-50%);\n      -ms-transform: translate(-50%,-50%);\n    }\n  </style>\n  <div id=\"update-overlay\">\n    <div>\n      <h3>\u0412\u0430\u0448 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u0443\u0441\u0442\u0430\u0440\u0435\u043B ($BROWSER)<br>\n      <small>\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u0438\u043B\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 *</small></h3>\n      <h3>Your browser is out of date ($BROWSER)<br>\n      <small>Please, update your browser or use an alternative one *</small></h3>\n      <hr>\n      * Edge 80+, Chrome 80+, Firefox 65+, Opera 65+, Safari 11+, Yandex 20+\n    </div>\n  </div>\n",c=a.getParser(window.navigator.userAgent),d=c.satisfies({edge:">=80",chrome:">=80",chromium:">=80",firefox:">=65",opera:">=65",safari:">=11",yandex:">=20"}),d||(e=c.getBrowser().name,f=c.getBrowser().version,g=document.createElement("div"),g.innerHTML=b.split("$BROWSER").join(e+" "+f),document.body.appendChild(g))}}});
//# sourceMappingURL=check_browser.js.map