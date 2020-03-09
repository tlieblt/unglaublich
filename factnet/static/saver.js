var jo = go.GraphObject.make;
var model_id;
var current_url;
var neuesDiagramm;
var nodeNumber=0;

//Sendet Modellinhalt mit Enter
var modellInfo = document.getElementById("dieInfo");
modellInfo.addEventListener("keyup", function(event) {
    if(event.keyCode != undefined) {
        if (event.keyCode === 13) {
            //event.preventDefault();
            addData();
        }
    }
});
if (document.getElementById('derTitel')) {
    var modellTitel = document.getElementById("derTitel");
    modellTitel.addEventListener("keyup", function (event) {
        if (event.keyCode != undefined) {
            if (event.keyCode === 13) {
                unhide();
                //event.preventDefault();
            }
        }
    });
}
function vanish(html_id) {
    let temp = document.getElementById(html_id);
    if (temp) {temp.parentNode.removeChild(temp);}
}


function unhide() {
    let indicator =document.getElementById('mainDiagram');
    let tst = window.getComputedStyle(indicator, null).getPropertyValue('visibility');
    sendModelName();
    make_dia();
    vanish("ueber1");
    vanish("ueber2");
    vanish("ueber3");
    vanish("derTitel");
    /*
        let eins = document.getElementById('ueber1');
        let zwei = document.getElementById('ueber2');
        let drei = document.getElementById('ueber3');
        drei.parentNode.removeChild(drei);
        zwei.parentNode.removeChild(zwei);
        eins.parentNode.removeChild(eins);
*/
        let rest = document.getElementsByClassName('anfang');
        Array.from(rest).forEach((element) => {
                element.style.visibility='visible';
        })

    }


function make_dia() {
    neuesDiagramm = jo(go.Diagram, "mainDiagram", {
        fixedBounds: new go.Rect(0, 0, 5000, 3000),
        "ModelChanged": function(e) {    //save changes
              if (e.isTransactionFinished) {
               sendData(800);
              }},
            maxSelectionCount: 1, // users can select only one part at a time
            //validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
            "clickCreatingTool.archetypeNodeData": { // allow double-click in background to create a new node
              name: "Überbegriff",
              title: "",
              comments: "",
              loc:""
            },
            "clickCreatingTool.insertPart": function(loc) {  // scroll to the new node
              var node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
              if (node !== null) {
                this.diagram.select(node);
                this.diagram.commandHandler.scrollToPart(node);
                this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
              }
              return node;
            },
        //undoManager:true,
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(16, 16),
        maxSelectionCount: 1,
        "ChangedSelection": onSelectionChanged});
    neuesDiagramm.add(
        jo(go.Part,
          { layerName: "Grid", position: neuesDiagramm.fixedBounds.position },
          jo(go.Shape, { opacity:0.4, fill: "lightgreen", strokeWidth: 0, desiredSize: neuesDiagramm.fixedBounds.size })
        ));

    neuesDiagramm.model = new go.GraphLinksModel([], []);
       style_dia();

    //neuesDiagramm.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;



}

function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    if (checkDup(toAdd)) {
        neuesDiagramm.startTransaction();
        neuesDiagramm.model.addNodeData({key: toAdd, name:"alfons"});
        neuesDiagramm.commitTransaction("make new node");
        document.getElementById('dieInfo').value = ''
    }
    else {alert("Bitte keine doppelten Nodes!")}
}
function sendData() {
    console.log('url is : ');
    if (!current_url) { current_url = window.location.href}
    console.log(window.location.href);
    let modelAsJson = neuesDiagramm.model.toJson();
    let xhr = new XMLHttpRequest();
    //let url = `${window.origin}/saved/${model_id}`;
    xhr.open("POST", current_url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log('folgendes json file wird geschickt: ');
    console.log(modelAsJson.toString());
    xhr.send(modelAsJson);

    /*
    fetch(`${window.origin}/saved/${model}`, {
        method: "POST",
        body: title,
        headers: new Headers({
         "content-type": "application/json\""
})
*/


}
function sendData(diaNo) {
    console.log('url is : ');
    if (!current_url) {
        current_url = window.location.href
    }
    console.log(window.location.href);
    let modelAsJson = neuesDiagramm.model.toJson();
    let xhr = new XMLHttpRequest();
    //let url = `${window.origin}/saved/${model_id}`;
    xhr.open("POST", "/saved/800", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log('folgendes json file wird geschickt: ');
    console.log(modelAsJson.toString());
    xhr.send(modelAsJson);

}




function sendModelName() {
    let title=document.getElementById('derTitel').value;
    document.getElementById('überschrift').innerHTML=title;
     fetch(`${window.origin}/save`, {
         method: "POST",
         body: title,
         headers: new Headers({
             "content-type": "text/html;charset=UTF-8"
         })
     }).then((response) => response.text())
         .then(function (response) {
            console.log('response: ');
            console.log(response);
            model_id = response;
            current_url = "/saved/"+response;
            console.log("curr url is: " + current_url);
            console.log('Model ID ist: ' + model_id);
            if (response.status !== 200)     {
              console.log(`Looks like there was a problem. Status code: ${response.status}`);
              return;
            }
            console.log('im response block');

            console.log(response.text());

            response.text().then(function (data) {
              console.log('im response block');
            });
          })
          .catch(function (error) {
            console.log("Fetch error: " + error);
          });

      }

function getDiagramData() {
    let request = new XMLHttpRequest();
    request.open("GET", url=window.location.href);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);
            console.log('DiagramData getted: ');
            console.log(model_json);
            if(!neuesDiagramm) { make_dia() }

            neuesDiagramm.model = go.Model.fromJson(model_json);
            let test = document.getElementById(ueber1);
            test.innerText = model_json;

        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}



function getDiagramData(toast) {
    let request = new XMLHttpRequest();
    request.open("GET", url=`saved/${toast}`);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);
            console.log('is json: ');
            //bauRest(model_json);
            if(!neuesDiagramm) { make_dia() }

            neuesDiagramm.model = go.Model.fromJson(model_json);
            let test = document.getElementById("ueber11");
            let dit = JSON.stringify(model_json);
            test.innerText = dit;

            console.log(model_json.nodeDataArray[2]);
            return model_json;}


            // ( let ele of dit) {
                //  console.log(ele); }
        else {
            console.warn(request.statusText, request.responseText);
            return {};
        }
    });
    request.send();
}

function bauRest(jason) {
        jason.nodeDataArray.forEach(element => machInfoEintrag(element.key));

}


// Diagram style
function style_dia() {
    neuesDiagramm.linkTemplate =
        jo(go.Link, go.Link.Normal,
            {doubleClick: linkDoubleClick},
            {corner: 5, relinkableFrom: true, relinkableTo: true},
            jo(go.Shape, {strokeWidth: 10, stroke: "#F5F5F5"}),  // the link shape
            jo(go.TextBlock, "\"zum \\n bearbeiten Klicken\")",
                                        {isMultiline:true,
                            row: 0, column: 0, columnSpan: 5,
                            font: "bold 14pt Segoe UI sans-serif",
                            visible:false,
                            editable: true,
                            minSize: new go.Size(10, 16),
                            background: "#000000",
                            opacity:"0.9", stroke: "#F5F5F5"

                        },
                // this is a Link label
            new go.Binding("text", "description").makeTwoWay(),
            new go.Binding("visible"),
            new go.Binding("background")));

            //jo(go.Shape, new go.Binding("toArrow", "toArrow"), { scale: 2, fill: "#D4B52C" }
    neuesDiagramm.nodeTemplate =
        jo(go.Node, "Position",
            {doubleClick: nodeDoubleClick,
            dragComputation: ordnung,
                location: new go.Point(700, 400),
            resizable:true, resizeObjectName:"textUnten", name:"hauptPanel"},
        //    new go.Binding("locationSpot", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            jo(go.Panel, "Auto",
            { name: "BODY" },
            // for sorting, have the Node.text be the data.name
            // bind the Part.layerName to control the Node's layer depending on whether it isSelected
            new go.Binding("layerName", "isSelected", function (sel) {
                return sel ? "Foreground" : "";
            }).ofObject(),

            // define the node's outer shape
            jo(go.Shape, "Ellipse",
                {
                    name: "SHAPE", fill: "green", stroke: 'white', strokeWidth: 3.5,
                    // set the port properties:
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
                }),
            jo(go.Panel, "Position",

                // define the panel where the text will appear


                    jo(go.TextBlock,  // the name
                        new go.Binding("text", "name").makeTwoWay()),

                        {

                            verticalAlignment:go.Spot.Center,
                            stroke:"white",
                            font: "14pt Segoe UI,sans-serif",
                            editable: true, isMultiline: true,
                            minSize: new go.Size(10, 16),
                            margin:8
                        },
                 ))

            ,

             jo("PanelExpanderButton", "INFO",
             { scale: 2, margin: (0,2,2,2), position: new go.Spot(0,0,-14,-15)}
                     //new go.Point(-35,-35)}
                ),
              jo(go.Panel, "Position",
              {
                name: "INFO",  // identify to the PanelExpanderButton
                stretch: go.GraphObject.Horizontal,  // take up whole available width
                //position: neuesDiagramm.findObject("hauptPanel").getDocumentPoint(go.Spot.center),
                visible:false,
                alignment: go.Spot.Top,  // thus no need to specify alignment on each element
              },
                  jo(go.Panel, "Auto",
                      { position: new go.Point(200, 20) },
                jo(go.Shape, "RoundedRectangle",
                      {minSize:new go.Size(200,200),fill:"white", name:"textUnten"}),
              jo(go.TextBlock, "left",
                  new go.Binding("text", "extraText").makeTwoWay(),

                  {
                 text:"mehr Text", editable:true, textAlign:"left",
                                                  stroke:"black",
                      //verticalAlignment:go.Spot.BottomLeft,

                            font: "bold 14pt Segoe UI sans-serif",alignment: go.Spot.BottomLeft},
              ))
                  // end Table Panel
             // end Horizontal Panel


            ));  // end Node


    neuesDiagramm.toolManager.mouseMoveTools.insertAt(2, new DragZoomingTool());


    neuesDiagramm.nodeTemplate.contextMenu =
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Vacate Position"),
            {
              click: function(e, obj) {
                var node = obj.part.adornedPart;
                if (node !== null) {
                  var thisemp = node.data;
                  neuesDiagramm.startTransaction("vacate");
                  // update the key, name, and comments
                  neuesDiagramm.model.setDataProperty(thisemp, "name", "(Vacant)");
                  neuesDiagramm.model.setDataProperty(thisemp, "comments", "");
                  neuesDiagramm.commitTransaction("vacate");
                }
              }
            }
          ),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Remove Role"),
            {
              click: function(e, obj) {
                // reparent the subtree to this node's boss, then remove the node
                var node = obj.part.adornedPart;
                if (node !== null) {
                  neuesDiagramm.startTransaction("reparent remove");
                  var chl = node.findTreeChildrenNodes();
                  // iterate through the children and set their parent key to our selected node's parent key
                  while (chl.next()) {
                    var emp = chl.value;
                    neuesDiagramm.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                  }
                  // and now remove the selected node itself
                  neuesDiagramm.model.removeNodeData(node.data);
                  neuesDiagramm.commitTransaction("reparent remove");
                }
              }
            }
          ),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Remove Department"),
            {
              click: function(e, obj) {
                // remove the whole subtree, including the node itself
                var node = obj.part.adornedPart;
                if (node !== null) {
                  neuesDiagramm.startTransaction("remove dept");
                  neuesDiagramm.removeParts(node.findTreeParts());
                  neuesDiagramm.commitTransaction("remove dept");
                }
              }
            }
          )
        );


     var inspector = new Inspector('myInspectorDiv', neuesDiagramm,
        {
          // allows for multiple nodes to be inspected at once
          multipleSelection: true,
          // max number of node properties will be shown when multiple selection is true
          showSize: 4,
          // when multipleSelection is true, when showAllProperties is true it takes the union of properties
          // otherwise it takes the intersection of properties
          showAllProperties: true,
          // uncomment this line to only inspect the named properties below instead of all properties on each object:
          // includesOwnProperties: false,
          properties: {
            "position":{},
              "loc":{},
            "description":{},
            "text": {},
            // key would be automatically added for nodes, but we want to declare it read-only also:
            "key": { readOnly: true, show: Inspector.showIfPresent },
            // color would be automatically added for nodes, but we want to declare it a color also:
            "color": { show: Inspector.showIfPresent, type: 'color' },
            // Comments and LinkComments are not in any node or link data (yet), so we add them here:
            "Comments": { show: Inspector.showIfNode },
           // "LinkComments": { show: Inspector.showIfLink },
            "isGroup": { readOnly: true, show: Inspector.showIfPresent },
            "flag": { show: Inspector.showIfNode, type: 'checkbox' },
            "state": {
              show: Inspector.showIfNode,
              type: "select",
              choices: function(node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                return ["one", "two", "three", "four", "five"];
              }
            },
            "choices": { show: false },  // must not be shown at all
            // an example of specifying the  type
            "password": { show: Inspector.showIfPresent, type: 'password' }
          }
        });


}

function textStyle() {
return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
}

function onSelectionChanged(e) {
    var node = e.diagram.selection.first();
    if (node instanceof go.Node) {
    } else {
    }
}

  function nodeDoubleClick(e, obj) {
        var clicked = obj.part;
        if (clicked !== null) {
          var thisemp = clicked.data;
          neuesDiagramm.startTransaction("add employee");


          var newemp = {
            name: "Überbegriff",
            title: "",
            comments: "",
            parent: thisemp.key,
            position: new go.Point(400,300)
          };


          neuesDiagramm.model.addNodeData(newemp);
          neuesDiagramm.model.addLinkData({from: thisemp.key,to: newemp.key});
          neuesDiagramm.commitTransaction("add employee");
        }
      }

function linkDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
        var thislink = clicked.data;
    }


    /*
    var ganzerBlock =
        jo(go.Panel,  // or "Position"
      { background: "lightgray" },
    jo(go.Shape, "Rectangle",
        { fill: "lightgreen", width: 100, height: 50 }),
      jo(go.TextBlock, "WIE WÄRS MIT TEXT", textStyle(), { background: "lightgreen", alignment: thislink.toSpot.Center })
        //, new go.Binding("text", "text")
    );
    var neu = jo(go.Part, "Auto",
      { position: thislink.toSpot.Center, background: "lightgray" },
      jo(go.TextBlock, "some text", { background: "yellow", alignment: thislink.toSpot.Center })
    );


        // this is a Link label
    //ganzerBlock.text="freilich";


*/
    neuesDiagramm.startTransaction("changeLink");
 //   if (!thislink.description) { neuesDiagramm.model.setDataProperty(thislink, "description", "zum \n bearbeiten Klicken");
   //     neuesDiagramm.model.setDataProperty(thislink, "background", "green");}

    if (thislink.visible == false){
    neuesDiagramm.model.setDataProperty(thislink, "visible", true);}
    else {neuesDiagramm.model.setDataProperty(thislink, "visible",false );}
    neuesDiagramm.commitTransaction("changeLink");

}



function machInfoEintrag(nom) {
        if(!document.getElementById(nom)) {
            let anfang = document.getElementById("accordionisus");
            let entry = document.createElement('div');
            let dit = `<div class="card" id="${nom}"> <div class="card-header" id="heading${nodeNumber}"> <h5 class="mb-0"><div> <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong${nodeNumber}">${nom} </button><!-- Modal --> <div class="modal fade" id="exampleModalLong${nodeNumber}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle${nodeNumber}" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLongTitle${nodeNumber}">Podal title</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> <textarea class="form-control col-xs-12">${nom}</textarea> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary">Save changes</button> </div> </div> </div> </div></div>`;
            console.log("machinfo eintrag macht: ");
            nodeNumber++;
            anfang.appendChild(entry);
            entry.outerHTML = dit;
            console.log(entry.outerHTML);
        }
}


function getDiagramDataCur() {
    let request = new XMLHttpRequest();
    request.open("GET", url=`saved/${model_id}`);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);
            console.log('is json: ');
           // bauRest(model_json);
            if(!neuesDiagramm) { make_dia() }

            neuesDiagramm.model = go.Model.fromJson(model_json);
            let test = document.getElementById("ueber11");
            let dit = JSON.stringify(model_json);
            test.innerText = dit;

            console.log(model_json.nodeDataArray[2]);}

            // ( let ele of dit) {
                //  console.log(ele); }
        else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

function checkDup(nodeKey){
    let noDup = true;
    console.log(neuesDiagramm.nodeDataArray);
    if (neuesDiagramm.findNodeForKey(nodeKey)) {
            noDup = false;
        }
    return noDup;
}




function DragZoomingTool() {
  go.Tool.call(this);
  this.name = "DragZooming";

  var b = new go.Part();
  b.layerName = "Tool";
  b.selectable = false;
  var r = new go.Shape();
  r.name = "SHAPE";
  r.figure = "Rectangle";
  r.fill = null;
  r.stroke = "magenta";
  r.position = new go.Point(0, 0);
  b.add(r);
  /** @type {Part} */
  this._box = b;

  /** @type {number} */
  this._delay = 175;

  /** @type {Diagram} */
  this._zoomedDiagram = null;
}

go.Diagram.inherit(DragZoomingTool, go.Tool);

/**
* This tool can run when there has been a mouse-drag, far enough away not to be a click,
* and there has been delay of at least {@link #delay} milliseconds
* after the mouse-down before a mouse-move.
* <p/>
* This method may be overridden.
* @this {DragZoomingTool}
* @return {boolean}
*/
DragZoomingTool.prototype.canStart = function() {
  if (!this.isEnabled) return false;
  var diagram = this.diagram;
  if (diagram === null) return false;
  var e = diagram.lastInput;
  // require left button & that it has moved far enough away from the mouse down point, so it isn't a click
  if (!e.left) return false;
  // don't include the following checks when this tool is running modally
  if (diagram.currentTool !== this) {
    if (!this.isBeyondDragSize()) return false;
    // must wait for "delay" milliseconds before that tool can run
    if (e.timestamp - diagram.firstInput.timestamp < this.delay) return false;
  }
  return true;
};

/**
* Capture the mouse and show the {@link #box}.
* @this {DragZoomingTool}
*/
DragZoomingTool.prototype.doActivate = function() {
  var diagram = this.diagram;
  if (diagram === null) return;
  this.isActive = true;
  diagram.isMouseCaptured = true;
  diagram.skipsUndoManager = true;
  diagram.add(this.box);
  this.doMouseMove();
};

/**
* Release the mouse and remove any {@link #box}.
* @this {DragZoomingTool}
*/
DragZoomingTool.prototype.doDeactivate = function() {
  var diagram = this.diagram;
  if (diagram === null) return;
  diagram.remove(this.box);
  diagram.skipsUndoManager = false;
  diagram.isMouseCaptured = false;
  this.isActive = false;
};

/**
* Update the {@link #box}'s position and size according to the value
* of {@link #computeBoxBounds}.
* @this {DragZoomingTool}
*/
DragZoomingTool.prototype.doMouseMove = function() {
  var diagram = this.diagram;
  if (diagram === null) return;
  if (this.isActive && this.box !== null) {
    var r = this.computeBoxBounds();
    var shape = this.box.findObject("SHAPE");
    if (shape === null) shape = this.box.findMainElement();
    shape.desiredSize = r.size;
    this.box.position = r.position;
  }
};

/**
* Call {@link #zoomToRect} with the value of a call to {@link #computeBoxBounds}.
* @this {DragZoomingTool}
*/
DragZoomingTool.prototype.doMouseUp = function() {
  if (this.isActive) {
    var diagram = this.diagram;
    diagram.remove(this.box);
    try {
      diagram.currentCursor = "wait";
      this.zoomToRect(this.computeBoxBounds());
    } finally {
      diagram.currentCursor = "";
    }
  }
  this.stopTool();
};

/**
* This just returns a {@link Rect} stretching from the mouse-down point to the current mouse point
* while maintaining the aspect ratio of the {@link #zoomedDiagram}.
* <p/>
* This method may be overridden.
* @this {DragZoomingTool}
* @return {Rect} a {@link Rect} in document coordinates.
*/
DragZoomingTool.prototype.computeBoxBounds = function() {
  var diagram = this.diagram;
  if (diagram === null) return new go.Rect(0, 0, 0, 0);
  var start = diagram.firstInput.documentPoint;
  var latest = diagram.lastInput.documentPoint;
  var adx = latest.x - start.x;
  var ady = latest.y - start.y;

  var observed = this.zoomedDiagram;
  if (observed === null) observed = this.diagram;
  if (observed === null) {
    return new go.Rect(start, latest);
  }
  var vrect = observed.viewportBounds;
  if (vrect.height === 0 || ady === 0) {
    return new go.Rect(start, latest);
  }

  var vratio = vrect.width / vrect.height;
  var lx;
  var ly;
  if (Math.abs(adx / ady) < vratio) {
    lx = start.x + adx;
    ly = start.y + Math.ceil(Math.abs(adx) / vratio) * (ady < 0 ? -1 : 1);
  } else {
    lx = start.x + Math.ceil(Math.abs(ady) * vratio) * (adx < 0 ? -1 : 1);
    ly = start.y + ady;
  }
  return new go.Rect(start, new go.Point(lx, ly));
};

/**
* This method is called to change the {@link #zoomedDiagram}'s viewport to match the given rectangle.
* <p/>
* This method may be overridden.
* @this {DragZoomingTool}
* @param {Rect} r a rectangular bounds in document coordinates.
*/
DragZoomingTool.prototype.zoomToRect = function(r) {
  if (r.width < 0.1) return;
  var observed = this.zoomedDiagram;
  if (observed === null) observed = this.diagram;
  if (observed === null) return;

  // zoom out when using the Shift modifier
  if (this.diagram.lastInput.shift) {
    observed.scale = Math.max(observed.scale * r.width / observed.viewportBounds.width, observed.minScale);
    observed.centerRect(r);
  } else {
    // do scale first, so the Diagram's position normalization isn't constrained unduly when increasing scale
    observed.scale = Math.min(observed.viewportBounds.width * observed.scale / r.width, observed.maxScale);
    observed.position = new go.Point(r.x, r.y);
  }
};


// Public properties

/**
* Gets or sets the {@link Part} used as the "rubber-band zoom box"
* that is stretched to follow the mouse, as feedback for what area will
* be passed to {@link #zoomToRect} upon a mouse-up.
* <p/>
* Initially this is a {@link Part} containing only a simple magenta rectangular {@link Shape}.
* The object to be resized should be named "SHAPE".
* Setting this property does not raise any events.
* <p/>
* Modifying this property while this tool {@link Tool#isActive} might have no effect.
* @name DragZoomingTool#box
* @function.
* @return {Part}
*/
Object.defineProperty(DragZoomingTool.prototype, "box", {
  get: function() { return this._box; },
  set: function(val) { this._box = val; }
});

/**
* Gets or sets the time in milliseconds for which the mouse must be stationary
* before this tool can be started.
* The default value is 175 milliseconds.
* Setting this property does not raise any events.
* @name DragZoomingTool#delay
* @function.
* @return {number}
*/
Object.defineProperty(DragZoomingTool.prototype, "delay", {
  get: function() { return this._delay; },
  set: function(val) { this._delay = val; }
});

/**
* Gets or sets the {@link Diagram} whose {@link Diagram#position} and {@link Diagram#scale}
* should be set to display the drawn {@link #box} rectangular bounds.
* <p/>
* The default value is null, which causes {@link #zoomToRect} to modify this tool's {@link Tool#diagram}.
* Setting this property does not raise any events.
* @name DragZoomingTool#zoomedDiagram
* @function.
* @return {Diagram}
*/
Object.defineProperty(DragZoomingTool.prototype, "zoomedDiagram", {
  get: function() { return this._zoomedDiagram; },
  set: function(val) { this._zoomedDiagram = val; }
});

      function ordnung(part, pt, gridpt) {
        var diagram = part.diagram;
        if (diagram === null) return pt;
        // compute the document area without padding
        var v = diagram.documentBounds.copy();
        v.subtractMargin(diagram.padding);
        // get the bounds of the part being dragged
        var b = part.actualBounds;
        var loc = part.location;
        // now limit the location appropriately
        var x = Math.max(v.x, Math.min(pt.x, v.right - b.width)) + (loc.x - b.x);
        var y = Math.max(v.y, Math.min(pt.y, v.bottom - b.height)) + (loc.y - b.y);
        return new go.Point(x, y);
      }

