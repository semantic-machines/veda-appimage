"use strict";System.register(["jsplumb","jquery","../common/lib/riot.js"],function(a){"use strict";function b(a){"@babel/helpers - typeof";return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},b(a)}/**
 * Collect entities
 * @param {Object} element
 * @param {Object} list
 */function c(a,b){for(var c,d=Object.getOwnPropertyNames(a),e=0;e<d.length;e++)c=d[e],a[c]&&Array.isArray(a[c])&&a[c].forEach(function(a){"function"==typeof a.hasValue&&a.hasValue("rdf:type")&&a["rdf:type"].forEach(function(c){("v-wf:VarDefine"==c.id||"v-wf:Transform"==c.id||"v-wf:Mapping"==c.id)&&b.add(a),"v-wf:Mapping"==c.id&&b.add(a["v-wf:mapToVariable"][0])})})}var d,e,f;return{setters:[function(){},function(a){d=a.default},function(a){e=a.default}],execute:function(){// Leveraging the ready function of jsPlumb.
// No API call should be made until the DOM has been initialized.
f={},a("default",f),f.ready=jsPlumb.ready,f.ready(function(){/**
   * Create a workflow instance.
   * @constructor Instance
   */ /**
   * Initialize the workflow instance.
   * @param {String} workflowData Id of an HTML container within which the worlflow is to be rendered
   * @param {Object} veda global "veda" instance
   * @param {IndividualModel} net individual of rdfs:type "v-wf:Net"
   * @param {Element} template
   * @param {Element} container
   */f.Instance=function(){// Get a new instance of jsPlumb.
this.instance=jsPlumb.getInstance()},f.Instance.prototype.init=function(a,g,h,i){var j,k,l,m,n,o,p=1e4,q="view",r=0,s=[],t=d("#props",i),u=d("#props-head",i);if(h.hasValue("rdf:type","v-wf:Net")?(q="edit",k=h.id):h.hasValue("rdf:type","v-wf:Process")&&(q="view",o=h,h=h.hasValue("v-wf:instanceOf")?h["v-wf:instanceOf"][0]:[],k=h.id),"object"===b(a)?(j=a.container,f.Instance.createWorkflowDOM(a)):j=a,h.offsetX=g["workflow"+k+"-offsetX"],h.offsetY=g["workflow"+k+"-offsetY"],h.currentScale=g["workflow"+k+"-zoom"],null==h.currentScale&&(h.currentScale=1),h.offsetX||(h.offsetX=0),h.offsetY||(h.offsetY=0),"view"===q){var F=d("<div>");u.text(h["rdfs:label"].join(", ")),o.present(F,"v-wf:ProcessPropsTemplate"),t.empty().append(F)}var v=d("#"+a,i);v.css({height:p+"px",width:p+"px"}),d(".workflow-wrapper",i).addClass("calculated-height"),d("<canvas>").attr({id:"select_canvas",width:p+"px",height:p+"px"}).appendTo(v);var w=null,z=d("#select_canvas",i).get(0).getContext("2d");z.globalAlpha=.3,v.on("mousedown",function(a){a.shiftKey&&(w=[a.offsetX,a.offsetY],d("#select_canvas",i).show())}).on("mouseup",function(a){if(a.shiftKey){end=[a.offsetX,a.offsetY];var b=Math.min(w[0],end[0])-p/2,c=Math.max(w[0],end[0])-p/2,e=Math.min(w[1],end[1])-p/2,f=Math.max(w[1],end[1])-p/2;d("#select_canvas",i).hide(),h["v-wf:consistsOf"].forEach(function(h){if(h.hasValue("v-wf:locationX")&&h.hasValue("v-wf:locationY")&&b<=h["v-wf:locationX"][0]&&h["v-wf:locationX"][0]<=c&&e<=h["v-wf:locationY"][0]&&h["v-wf:locationY"][0]<=f){var j=d("#"+g.Util.escape4$(h.id),i);A.addToDragList(j),a.stopPropagation()}})}}).on("mousemove",function(a){if(a.shiftKey&&1==a.buttons){if(!w)return;z.clearRect(0,0,a.delegateTarget.offsetWidth,a.delegateTarget.offsetHeight),z.beginPath();var b=a.offsetX,c=a.offsetY;z.rect(w[0],w[1],b-w[0],c-w[1]),z.fill()}}),v.draggable({drag:function drag(a,b){return!a.shiftKey&&void(A.moveCanvas(b.position.left,b.position.top),d("#workflow-context-menu",i).hide())}}).on("click",function(a){if(!a.shiftKey){A.defocus();var b;"view"===q&&(b=d("<div>"),u.text(h["rdfs:label"].join(", ")),o.present(b,"v-wf:ProcessPropsTemplate"),t.empty().append(b)),"edit"===q&&(b=d("<div>"),u.text(h["rdfs:label"].join(", ")),h.present(b,"v-wf:SimpleNetTemplate","edit"),t.empty().append(b))}});var A=this.instance;// Import all the given defaults into this instance.
A.importDefaults({Endpoint:"Dot",HoverPaintStyle:{strokeStyle:"#6699FF",lineWidth:1},ConnectionOverlays:[["Arrow",{location:1,id:"arrow",length:14,width:10,foldback:.8}],["Label",{label:"transition",id:"label",cssClass:"aLabel"}]],Container:j// Id of the workflow container.
}),A.moveCanvas=function(a,b){v.css({left:a+"px",top:b+"px"}),g["workflow"+k+"-offsetX"]=a,g["workflow"+k+"-offsetY"]=b,h.offsetX=a,h.offsetY=b},null!=h.offsetX&&0!=h.offsetX?A.moveCanvas(h.offsetX,h.offsetY):A.moveCanvas(-p/2,-p/2),"edit"==q&&A.bind("dblclick",function(a){e.route("#/"+a.id+"///edit")}),A.bind("click",function(a){var b=a.getData();g["workflow"+k+"-selectedElement"]=a.id,A.defocus(),a.setPaintStyle({strokeStyle:"#FF0000"}),"__label"==a.id&&(a=a.component),l=a.id,m="flow",n=a.sourceId;var c=new g.IndividualModel(b),e=d("<div>");c.present(e),t.append(e),c.hasValue("rdfs:label")?u.text(c["rdfs:label"].join(", ")):u.text(c.id)}),A.bind("connectionMoved",function(a){a.originalSourceId!==a.newSourceId&&h["v-wf:consistsOf"].forEach(function(b){b.id===a.originalSourceId&&(b["v-wf:hasFlow"]=g.Util.removeSubIndividual(b,"v-wf:hasFlow",a.connection.id)),b.id===a.newSourceId&&(b["v-wf:hasFlow"]=b.hasValue("v-wf:hasFlow")?b["v-wf:hasFlow"].concat(new g.IndividualModel(a.connection.id)):[new g.IndividualModel(a.connection.id)])})}),A.bind("connection",function(a){var b=new g.IndividualModel(a.sourceId),c=b.get("v-wf:hasFlow").filter(function(b){return b.hasValue("v-wf:flowsInto",a.targetId)}).length;if(!c){var d=new g.IndividualModel;// Create Flow individual
d["rdf:type"]="v-wf:Flow",d["v-wf:flowsInto"]=a.targetId,h.addValue("v-wf:consistsOf",d),b.addValue("v-wf:hasFlow",d),a.connection.setData(d.id)}});var B=function(a,b){a.hasValue("v-wf:subNet")&&d("<span/>",{click:function click(){e.route("#/"+a["v-wf:subNet"][0].id+"///edit")},class:"glyphicon glyphicon-search subnet-link"}).appendTo(b)},C=function(a,b){a.hasValue("v-wf:executor")&&a["v-wf:executor"][0].load().then(function(a){"v-s:Appointment"==a["rdf:type"][0].id?d("<span/>",{class:"glyphicon glyphicon-user"}).appendTo(b):d("<span/>",{class:"glyphicon glyphicon-cog"}).appendTo(b)})};A.updateSVGBackground=function(a){var b="";a.hasClass("split-and")&&(b+="<line x1='80' y1='25' x2='100' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='80' y1='0' x2='80' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='80' y1='25' x2='100' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' />"),a.hasClass("split-or")&&(b+="<line x1='100' y1='25' x2='90' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='90' y1='0' x2='80' y2='25' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='80' y1='0' x2='80' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='100' y1='25' x2='90' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='90' y1='50' x2='80' y2='25' style='stroke:rgb(0,0,0); stroke-width:1' />"),a.hasClass("split-xor")&&(b+="<line x1='100' y1='25' x2='80' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='80' y1='0' x2='80' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='100' y1='25' x2='80' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' />"),a.hasClass("join-and")&&(b+="<line x1='20' y1='25' x2='0' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='20' y1='0' x2='20' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='20' y1='25' x2='0' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' />"),a.hasClass("join-or")&&(b+="<line x1='0' y1='25' x2='10' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='10' y1='0' x2='20' y2='25' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='20' y1='0' x2='20' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='0' y1='25' x2='10' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='10' y1='50' x2='20' y2='25' style='stroke:rgb(0,0,0); stroke-width:1' />"),a.hasClass("join-xor")&&(b+="<line x1='0' y1='25' x2='20' y2='0' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='20' y1='0' x2='20' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' /><line x1='0' y1='25' x2='20' y2='50' style='stroke:rgb(0,0,0); stroke-width:1' />"),b="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 50'>"+b+"</svg>\")",a.css("background",b)},A.showProcessRunPath=function(a,b){a.hasValue("v-wf:previousWorkItem")?a["v-wf:previousWorkItem"].forEach(function(c){a.hasValue("v-wf:forNetElement")&&c.hasValue("v-wf:forNetElement")&&(A.showProcessRunPath(c,b+1),A.select({target:a["v-wf:forNetElement"][0].id,source:c["v-wf:forNetElement"][0].id}).each(function(a){a.addClass("process-path-highlight");var c=null==a.getOverlay("pathCounter")?"":a.getOverlay("pathCounter").getLabel();a.removeOverlay("pathCounter"),a.addOverlay(["Label",{label:(""==c?"":c+",")+(r-b),location:.5,id:"pathCounter",cssClass:"pathCounterLabel"}])}))}):r=b},A.addVarProperty=function(a,b,c){var d=new g.IndividualModel(c),e=new g.IndividualModel;e["rdf:type"]=[new g.IndividualModel("v-wf:Mapping")],e["v-wf:mapToVariable"]=[d],e["v-wf:mappingExpression"]=["process.getInputVariable ('"+d["v-wf:varDefineName"][0]+"')"],g.Util.forSubIndividual(h,"v-wf:consistsOf",a,function(a){a[b]=a[b].concat(e),h["v-wf:consistsOf"]=h["v-wf:consistsOf"].concat(e)})},A.addToDragList=function(a){s.push(a),a.addClass("jsplumb-drag-selected"),A.addToDragSelection(a)},A.clearDragList=function(){s=[],A.clearDragSelection()};/**
     * Bind required functional to State elements
     * @method bindStateEvents
     * @param {Object} windows List of all State elements
     */var D=function(a){a.find(".state-name").droppable({hoverClass:"dragHover",drop:function drop(b,c){var e=c.draggable.attr("resource"),f=a.attr("id"),h=d("<div />");h.appendTo(d("#main")),h.dialog({modal:!0,resizable:!1,buttons:{"v-wf:startingMapping":function vWfStartingMapping(){A.addVarProperty(f,"v-wf:startingMapping",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:completedMapping":function vWfCompletedMapping(){A.addVarProperty(f,"v-wf:completedMapping",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:wosResultsMapping":function vWfWosResultsMapping(){A.addVarProperty(f,"v-wf:wosResultsMapping",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:startingJournalMap":function vWfStartingJournalMap(){A.addVarProperty(f,"v-wf:startingJournalMap",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:completedJournalMap":function vWfCompletedJournalMap(){A.addVarProperty(f,"v-wf:completedJournalMap",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:startingExecutorJournalMap":function vWfStartingExecutorJournalMap(){A.addVarProperty(f,"v-wf:startingExecutorJournalMap",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")},"v-wf:completedExecutorJournalMap":function vWfCompletedExecutorJournalMap(){A.addVarProperty(f,"v-wf:completedExecutorJournalMap",e),d(this).dialog("close"),d("#"+g.Util.escape4$(f),i).trigger("click")}}})}}),a.on("click",function(a){var b=a.delegateTarget,c=d(b),e=c.hasClass("w_active");if(g["workflow"+k+"-selectedElement"]=b.id,a.ctrlKey)return A.addToDragList(c),void a.stopPropagation();if(e||(A.defocus(),l=b.id,m="state",c.addClass("w_active")),"edit"==q){if(a.stopPropagation(),e)return;// do nothing when click on already selected element
var f=new g.IndividualModel(b.id),h=d("<div>");"v-wf:Task"==f["rdf:type"][0].id?f.present(h,"v-wf:TaskTemplateAsProperties","edit"):f.present(h,"v-wf:ConditionTemplateAsProperties","edit"),t.append(h),f.hasValue("rdfs:label")?u.text(f["rdfs:label"].join(", ")):u.text(f.id)}// build run path
if("view"==q){A.select().removeClass("process-path-highlight").removeOverlay("pathCounter");var j=new g.IndividualModel(b.id);// If we have more then one WorkItem - we must choose among them
if(j.hasValue("rdfs:label")?u.text(j["rdfs:label"].join(", ")):u.text(j.id),1<c.attr("work-items-count")){a.stopPropagation();var n=d("#workflow-context-menu ul",i);n.html(""),d("[type='work-item']",b).each(function(a,b){var c=new g.IndividualModel(d(b).attr("work-item-id")),e=d("<li/>").appendTo(n);d("<a/>",{text:c.hasValue("rdfs:label")?c["rdfs:label"][0]:c.id,href:"#",click:function(a){return function(b){b.preventDefault(),t.empty(),d("#workflow-context-menu",i).hide(),d.each(A.getAllConnections(),function(a,b){var c=b.getOverlay("flowLabel");null!=c&&c.setVisible(!1)}),A.showProcessRunPath(a,0);var c=d("<div>");a.present(c,"v-wf:WorkItemTemplate"),t.append(c)}}(c)}).appendTo(e)}),E.css({display:"block",left:a.pageX-(a.pageX+E.width()>d(document).width()?E.width():0),top:a.pageY-(a.pageY+E.height()>d(document).height()?E.height():0)})}else{if(a.stopPropagation(),e)return;// do nothing when click on already selected element
d("[type='work-item']",b).each(function(a,b){var c=new g.IndividualModel(d(b).attr("work-item-id"));d.each(A.getAllConnections(),function(a,b){var c=b.getOverlay("flowLabel");null!=c&&c.setVisible(!1)}),A.showProcessRunPath(c,0);var e=d("<div>");c.present(e,new g.IndividualModel("v-wf:WorkItemTemplate")),t.append(e)})}}}),"edit"==q&&(a.bind("dblclick",function(a){var b=a.delegateTarget;g.Util.showModal(new g.IndividualModel(d(b).attr("id")),"v-wf:TaskTemplateAsModal","edit")}),A.draggable(a,{drag:function drag(a){d("#workflow-context-menu",i).hide();var b=new g.IndividualModel(a.el.id);b["v-wf:locationX"]=[Math.round(a.pos[0]-p/2)],b["v-wf:locationY"]=[Math.round(a.pos[1]-p/2)]}}));A.makeSource(a,{filter:".ep",anchor:[[0,.2,-1,0],[0,.4,-1,0],[0,.6,-1,0],[0,.8,-1,0],[1,.2,1,0],[1,.4,1,0],[1,.6,1,0],[1,.8,1,0],[.2,0,0,-1],[.4,0,0,-1],[.6,0,0,-1],[.8,0,0,-1]],dragOptions:{isSource:!1,isTarget:!0},connector:["Straight",{stub:30,gap:0}],paintStyle:{strokeStyle:"#225588",fillStyle:"transparent",radius:"edit"==q?4:1,lineWidth:1},connectorStyle:{strokeStyle:"#666666",lineWidth:1,outlineColor:"transparent",outlineWidth:4},maxConnections:20,onMaxConnections:function onMaxConnections(a){alert("Maximum connections ("+a.maxConnections+") reached")}}),A.makeTarget(a,{dropOptions:{isSource:!0,isTarget:!1,hoverClass:"dragHover"},reattach:!0,anchor:[[0,.1,-1,0],[0,.3,-1,0],[0,.5,-1,0],[0,.7,-1,0],[0,.9,-1,0],[1,.1,1,0],[1,.3,1,0],[1,.5,1,0],[1,.7,1,0],[1,.9,1,0],[.1,0,0,-1],[.3,0,0,-1],[.5,0,0,-1],[.7,0,0,-1],[.9,0,0,-1]],paintStyle:{strokeStyle:"#225588",fillStyle:"transparent",radius:"edit"==q?4:1,lineWidth:1}})};/**
     * Change current scale.
     * @param {number} scale new scale
     */A.changeScale=function(a){d("#workflow-context-menu",i).hide(),h.currentScale=parseFloat(a),g["workflow"+k+"-zoom"]=h.currentScale,A.setZoom(h.currentScale),v.css({"-ms-transform":"scale("+h.currentScale+","+h.currentScale+")",/* IE 9 */"-webkit-transform":"scale("+h.currentScale+","+h.currentScale+")",/* Chrome, Safari, Opera */transform:"scale("+h.currentScale+","+h.currentScale+")"})},A.getSplitJoinType=function(a,b){if(!b.hasValue("v-wf:"+a))return" "+a+"-no";var c=b["v-wf:"+a][0].id;return null===c||void 0===c||""===c?" "+a+"-no":"v-wf:XOR"==c?" "+a+"-xor":"v-wf:OR"==c?" "+a+"-or":"v-wf:AND"==c?" "+a+"-and":"v-wf:NONE"==c?" "+a+"-none":" "+a+"-no"},A.createState=function(a){if(a.hasValue("rdf:type")){var b=a["rdf:type"][0].id,c="";if("v-wf:InputCondition"===b?c="<div class=\"w state-io-condition state-io-condition-input\" "+"id=\""+a.id+"\" "+"style=\"font-size:20px;padding-top:10px;"+"left:"+(p/2+a["v-wf:locationX"][0])+"px;"+"top:"+(p/2+a["v-wf:locationY"][0])+"px;\">"+"<div><span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></div>"+("edit"==q?"<div class=\"ep\">":"")+"</div></div>":"v-wf:OutputCondition"===b?c="<div class=\"w state-io-condition state-io-condition-output\" "+"id=\""+a.id+"\" "+"style=\"font-size:20px;padding-top:10px;"+"left:"+(p/2+a["v-wf:locationX"][0])+"px;"+"top: "+(p/2+a["v-wf:locationY"][0])+"px;\">"+"<div><span class=\"glyphicon glyphicon-stop\" aria-hidden=\"true\"></div></div>":"v-wf:Condition"===b?c="<div class=\"w state-condition\" "+"id=\""+a.id+"\" "+"style=\"left:"+(p/2+a["v-wf:locationX"][0])+"px;"+"top:"+(p/2+a["v-wf:locationY"][0])+"px;\">"+"<div class=\"state-name condition-name\">"+a["rdfs:label"][0]+"</div>"+("edit"==q?"<div class=\"ep\">":"")+"</div></div>":"v-wf:Task"===b?c="<div class=\"w state-task split-join "+A.getSplitJoinType("split",a)+A.getSplitJoinType("join",a)+"\" "+"id=\""+a.id+"\" "+"style=\"left:"+(p/2+a["v-wf:locationX"][0])+"px; "+"top: "+(p/2+a["v-wf:locationY"][0])+"px;\">"+"<div class=\"state-name\">"+a["rdfs:label"][0]+"</div>"+("edit"==q?"<div class=\"ep\">":"")+"</div></div>":void 0,""!==c){v.append(c);var e=d("#"+g.Util.escape4$(a.id),i);D(e),"edit"==q&&B(a,e),C(a,e),A.updateSVGBackground(e)}}},A.deleteState=function(a){A.detachAllConnections(a),A.remove(a),h["v-wf:consistsOf"]=g.Util.removeSubIndividual(h,"v-wf:consistsOf",a.id),h["v-wf:consistsOf"].forEach(function(b){b.hasValue("v-wf:hasFlow")&&b["v-wf:hasFlow"].forEach(function(c){c.hasValue("v-wf:flowsInto")&&c["v-wf:flowsInto"][0].id==a.id&&A.deleteFlow(c,b)})})},A.createFlow=function(a,b){var c=A.connect({source:a.id,target:b["v-wf:flowsInto"][0].id,detachable:"edit"==q});b.hasValue("rdfs:label")&&c.addOverlay(["Label",{label:b["rdfs:label"][0],location:.5,id:"flowLabel"}]),c.setData(b.id)},A.deleteFlow=function(a,b){A.detach(a,{fireEvent:!1,forceDetach:!0}),h["v-wf:consistsOf"]=g.Util.removeSubIndividual(h,"v-wf:consistsOf",a.id);var c=new g.IndividualModel(b.id);c["v-wf:hasFlow"]=g.Util.removeSubIndividual(c,"v-wf:hasFlow",a.id)},A.createEmptyNetElement=function(a){var b=new g.IndividualModel;return b["rdfs:label"]=["",""],b["v-wf:locationX"]=[(-p/2-h.offsetX)/h.currentScale],b["v-wf:locationY"]=[(-p/2-h.offsetY)/h.currentScale],"condition"==a?(b["rdf:type"]=[new g.IndividualModel("v-wf:Condition")],A.createState(b)):"task"==a?(b["rdf:type"]=[new g.IndividualModel("v-wf:Task")],A.createState(b)):"input"==a?(b["rdf:type"]=[new g.IndividualModel("v-wf:InputCondition")],A.createState(b)):"output"==a&&(b["v-wf:locationX"]=[b["v-wf:locationX"][0]+200],b["rdf:type"]=[new g.IndividualModel("v-wf:OutputCondition")],A.createState(b)),h["v-wf:consistsOf"]=void 0===h["v-wf:consistsOf"]?[b]:h["v-wf:consistsOf"].concat(b),b},A.createNetView=function(a){return a.prefetch(1/0,"v-wf:consistsOf","v-wf:hasFlow","v-wf:executor").then(function(b){a=b[0],d("#workflow-net-name",i).text(a["rdfs:label"][0]);var c=b.slice(1),e=!1,f=!1;// Create states
return c.forEach(function(a){(a.hasValue("rdf:type","v-wf:Task")||a.hasValue("rdf:type","v-wf:Condition")||a.hasValue("rdf:type","v-wf:InputCondition")||a.hasValue("rdf:type","v-wf:OutputCondition"))&&A.createState(a),e=e||a.hasValue("rdf:type","v-wf:InputCondition"),f=f||a.hasValue("rdf:type","v-wf:OutputCondition")}),e||A.createEmptyNetElement("input"),f||A.createEmptyNetElement("output"),c.forEach(function(a){a.hasValue("v-wf:hasFlow")&&a["v-wf:hasFlow"].forEach(function(b){A.createFlow(a,b)})}),a})},A.optimizeView=function(){if(h.hasValue("v-wf:consistsOf")){var a,b,c,e,f,g=0,j=0;h["v-wf:consistsOf"].forEach(function(d){d.hasValue("v-wf:locationX")&&((void 0===b||d["v-wf:locationX"][0]>b)&&(b=d["v-wf:locationX"][0]),(void 0===a||d["v-wf:locationX"][0]<a)&&(a=d["v-wf:locationX"][0])),d.hasValue("v-wf:locationY")&&((void 0===e||d["v-wf:locationY"][0]>e)&&(e=d["v-wf:locationY"][0]),(void 0===c||d["v-wf:locationY"][0]<c)&&(c=d["v-wf:locationY"][0]))}),c-=25,a-=25,b+=100,e+=100,d(".workflow-canvas-wrapper",i).each(function(d,h){var i=h.clientWidth/(b-a),k=h.clientHeight/(e-c);f=Math.min(i,k),i>k?g=(h.clientWidth-(b-a)*f)/2:j=(h.clientHeight-(e-c)*f)/2}),A.changeScale(f),A.moveCanvas(-a*f+g-p/2,-c*f+j-p/2)}},A.defocus=function(){t.empty(),A.clearDragList(),d(".jsplumb-drag-selected",i).removeClass("jsplumb-drag-selected"),d("#workflow-context-menu",i).hide(),d.each(A.getAllConnections(),function(a,b){b.removeClass("process-path-highlight"),b.removeOverlay("pathCounter");var c=b.getOverlay("flowLabel");null!=c&&c.setVisible(!0)}),d("#"+g.Util.escape4$(l),i).removeClass("w_active"),null!=n&&A.select({source:n}).each(function(a){a.setPaintStyle({strokeStyle:"#666666"}),a.removeOverlay("connLabel")}),l=null,m=null,n=null},A.loadProcessWorkItems=function(a){return a.prefetch(1/0,"v-wf:workItemList")},A.createProcessView=function(a){A.loadProcessWorkItems(a).then(function(a){a=a.slice(1),d(".w",i).each(function(a,b){d("span",b).text(""),d(b).css("background-color","white").attr("work-items-count",0).attr("colored-to","")}),a.forEach(function(a){if(a.hasValue("v-wf:forNetElement")){var e=d("#"+g.Util.escape4$(a["v-wf:forNetElement"][0].id),i);0==d(e).find("[work-item-id=\""+g.Util.escape4$(a.id)+"\"]").length&&d("<span/>",{type:"work-item","work-item-id":a.id}).appendTo(e);var b=parseInt(e.attr("work-items-count")),c="red"==e.attr("colored-to");0<b?(e.attr("work-items-count",b+1),d(".counter",e).remove(),d("<span/>",{class:"counter",text:"x"+(b+1)}).appendTo(e)):e.attr("work-items-count",1),a.hasValue("v-wf:workOrderList")?a.hasValue("v-wf:isCompleted")&&!0==a["v-wf:isCompleted"][0]&&!c?(e.css("background-color","#88B288"),e.attr("colored-to","green")):!c&&(e.css("background-color","#FFB266"),e.attr("colored-to","red")):(e.css("background-color","#FF3333"),e.attr("colored-to","red"))}})})};var E;A.createNetView(h).then(function(a){1==a.currentScale?A.optimizeView():A.changeScale(a.currentScale),"view"==q&&A.createProcessView(o),d("#"+g.Util.escape4$(g["workflow"+k+"-selectedElement"]),i).trigger("click"),E=d("#workflow-context-menu",i),d("#workflow-save-button",i).on("click",function(){a.hasValue("v-wf:consistsOf")&&a["v-wf:consistsOf"].forEach(function(a){var b=function(a,b){b.hasValue(a)&&b[a].forEach(function(a){a.hasValue("v-wf:mapToVariable")&&a["v-wf:mapToVariable"].forEach(function(a){a.save()}),a.save()})};b("v-wf:startingMapping",a),b("v-wf:completedMapping",a),b("v-wf:startingExecutorJournalMap",a),b("v-wf:completedExecutorJournalMap",a),b("v-wf:startingJournalMap",a),b("v-wf:completedJournalMap",a),a.hasValue("v-wf:executor")&&a["v-wf:executor"].forEach(function(a){a.save()}),a.save()}),a.save()}),d("#workflow-export-ttl",i).on("click",function(){var b=[a].concat(a["v-wf:consistsOf"]);c(a,b),g.Util.exportTTL(b)}),d(".create-state",i).bind("click",function(a){var b=a.delegateTarget,c=A.createEmptyNetElement(d(b).hasClass("create-condition")?"condition":"task");d("#"+g.Util.escape4$(c.id),i).click(),d(b).blur()}),d(".delete-state",i).on("click",function(){0<s.length?s.forEach(function(a){A.deleteState(A.getSelector("#"+g.Util.escape4$(a.attr("id")))[0])}):"state"==m?confirm("Delete state "+l+" ?")&&A.deleteState(A.getSelector("#"+g.Util.escape4$(l))[0]):"flow"==m&&confirm("Delete flow "+l+" ?")&&A.getConnections({source:n}).forEach(function(a){a.id==l&&A.deleteFlow(a,new g.IndividualModel(n))})}),d(".process-refresh",i).on("click",function(){A.createProcessView(o)}),d(".to-net-editor",i).on("click",function(){e.route("#/"+a.id+"///edit")}),d(".copy-net-element",i).on("click",function(){if("undefined"!=typeof l){var b=new g.IndividualModel(l);b.hasValue("rdf:type")&&("v-wf:Task"===b["rdf:type"][0].id||"v-wf:Condition"===b["rdf:type"][0].id)&&b.clone().then(function(c){c["v-wf:locationX"]=[b["v-wf:locationX"][0]+50],c["v-wf:locationY"]=[b["v-wf:locationY"][0]+50],c["v-wf:hasFlow"]=[],A.createState(c),a["v-wf:consistsOf"]=a["v-wf:consistsOf"].concat(c)})}});/* ZOOM [BEGIN] */var b=function(){return 1>a.currentScale?A.changeScale(a.currentScale+.1):2>a.currentScale?A.changeScale(a.currentScale+.25):void 0},f=function(){return 1<a.currentScale?A.changeScale(a.currentScale-.25):.2<a.currentScale?A.changeScale(a.currentScale-.1):void 0};/* ZOOM [END] */ /* NET MENU [END] */return d(".zoom-in",i).on("click",b),d(".zoom-out",i).on("click",f),v.bind("mousewheel",function(a){0<a.originalEvent.wheelDelta?b():f()}),d(".zoom-default",i).on("click",function(){A.optimizeView()}),d("#full-width",i).on("click",function(){A.optimizeView()}),A})}})}}});
//# sourceMappingURL=veda_workflow_editor.js.map