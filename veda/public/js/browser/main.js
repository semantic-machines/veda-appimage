"use strict";System.register(["../common/veda.js","../common/app_model.js","../browser/app_presenter.js","../browser/auth.js","../browser/install_sw.js","../browser/individual_presenter.js"],function(a){"use strict";var b,c,d,e;return{setters:[function(a){b=a.default},function(a){c=a.default},function(a){d=a.default},function(a){e=a.default},function(){},function(){}],execute:function(){// Main
a("default",b),System["import"]("jquery").then(function(){System["import"]("bootstrap").then(function(){var a=new XMLHttpRequest;a.onload=function(f){var g=document.getElementById("load-indicator");if(g.style.display="none",200==this.status){var h=JSON.parse(a.response);c.call(b,h),e(),d()}else console.log(f)},a.onerror=console.log,a.ontimeout=console.log,a.open("GET","./manifest"),a.send()})})}}});
//# sourceMappingURL=main.js.map