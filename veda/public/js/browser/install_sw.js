"use strict";System.register(["../common/veda.js"],function(){"use strict";var a,b,c,d,e,f,g;return{setters:[function(b){a=b.default}],execute:function(){"serviceWorker"in navigator&&(b="\n    <div class=\"container margin-xl\" id=\"install-app\" style=\"display:none;\">\n      <div class=\"well well-sm text-center no-margin bg-white\">\n        \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D? Install the application on the main screen?\n        <button id=\"install-btn\" class=\"btn btn-sm btn-primary margin-md margin-md-h\">\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C / Install</button>\n        <button id=\"reject-install-btn\" class=\"btn btn-sm btn-link\" style=\"margin-left:0;padding-left:0;\">\u041E\u0442\u043A\u0430\u0437\u0430\u0442\u044C\u0441\u044F / Refuse</button>\n      </div>\n    </div>\n  ",c=document.createElement("div"),c.id="install-wrapper",c.innerHTML=b,document.body.insertBefore(c,document.body.firstChild),navigator.serviceWorker.register("/sw-simple.js",{scope:window.location.pathname}).then(function(b){// Update application on `update` event
console.log("Service worker registered:",b.scope),a.on("update",function(){b.update()["catch"](console.log).then(function(){window.location.reload()})})})["catch"](function(a){return console.log("Registration failed with ".concat(a))}),navigator.serviceWorker.addEventListener("message",function(a){console.log("Service worker veda_version = ".concat(a.data))}),navigator.serviceWorker.ready.then(function(a){a.active.postMessage("veda_version")}),d=function(){var a=document.getElementById("install-app"),b=document.getElementById("install-btn"),c=document.getElementById("reject-install-btn");a.style.display="block",b.addEventListener("click",e),c.addEventListener("click",f)},e=function(){var a=document.getElementById("install-app");// Hide the prompt
// Wait for the user to respond to the prompt
a.style.display="none",g.prompt(),g.userChoice.then(function(a){"accepted"===a.outcome?console.log("User accepted install prompt"):console.log("User dismissed install prompt"),g=null})},f=function(){var a=document.getElementById("install-app");a.style.display="none",localStorage.rejectedInstall=!0},window.addEventListener("beforeinstallprompt",function(a){// Prevent Chrome 67 and earlier from automatically showing the prompt
// Stash the event so it can be triggered later.
a.preventDefault(),g=a,localStorage.rejectedInstall||d()}))}}});
//# sourceMappingURL=install_sw.js.map