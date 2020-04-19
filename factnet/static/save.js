var jo = go.GraphObject.make;
var model_id;
var current_url;
var neuesDiagramm;
var modelCenter =[0.0,0.0];
var wiederholung;

if(document.getElementById("Zentrum")){
    modelCenter[0]=document.getElementById("Zentrum").value;
}



// Inhalt von HTML Elementen mit Enter abschicken
var modellInfo = document.getElementById("dieInfo");
if (modellInfo) {
    modellInfo.addEventListener("keyup", function (event) {
        if (event.keyCode != undefined) {
            if (event.keyCode === 13) {
                //event.preventDefault();
                addData();
            }
        }
    })
};
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

//Löscht Elemente von der Seite
function vanish(html_id) {
    let temp = document.getElementById(html_id);
    temp.parentNode.removeChild(temp);
}

//Blendet Diagramm nach Benennung ein
function unhide() {
    let indicator = document.getElementById('mainDiagram');
    let tst = window.getComputedStyle(indicator, null).getPropertyValue('visibility');
    //Legt einen DB Eintrag an
    sendModelName();
    //Erstellt das interaktive Diagramm
    neuesDiagramm= make_dia();
    //Läd Model und Objekteigenschaften
    style_dia();

    // Blendet irrelevante Seitenelemente aus
    vanish("ueber1");
    vanish("ueber2");
    vanish("ueber3");
    vanish("derTitel");
// Macht einige unsichtbaren Elemente sichtbar
        let rest = document.getElementsByClassName('anfang');
        Array.from(rest).forEach((element) => {
                element.style.visibility='visible';
        })

    };


//Erstellt aus dem Div Element ein neues Diagramm,

function make_dia() {

    go.Shape.defineFigureGenerator("SpeechBubble", function(shape, w, h) {
    var param1 = shape ? shape.parameter1 : NaN;
    if (isNaN(param1) || param1 < 0) param1 = 15;  // default corner
    param1 = Math.min(param1, w / 3);
    param1 = Math.min(param1, h / 3);

    var cpOffset = param1 * KAPPA;
    var bubbleH = h * .8; // leave some room at bottom for pointer

    var geo = new go.Geometry();
    var fig = new go.PathFigure(param1, 0, true);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Line, w - param1, 0));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, bubbleH - param1));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, w - param1, bubbleH, w, bubbleH - cpOffset, w - cpOffset, bubbleH));
    fig.add(new go.PathSegment(go.PathSegment.Line, w * .70, bubbleH));
    fig.add(new go.PathSegment(go.PathSegment.Line, w * .70, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, w * .55, bubbleH));
    fig.add(new go.PathSegment(go.PathSegment.Line, param1, bubbleH));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, bubbleH - param1, cpOffset, bubbleH, 0, bubbleH - cpOffset));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, param1));
    fig.add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close());
    if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset);
    geo.spot2 = new go.Spot(1, .8, -cpOffset, -cpOffset);
    } else {
    geo.spot1 = go.Spot.TopLeft;
    geo.spot2 = new go.Spot(1, .8);
    }
    return geo;
    });

    go.Shape.defineFigureGenerator("LogicForAll", function(shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, .5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Move, .25 * w, .5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, .75 * w, .5 * h)))
         .setSpots(0.25, 0, 0.75, 0.5);
});

    go.Shape.defineFigureGenerator("LogicThereExists", function(shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, .5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, .5 * h))
              .add(new go.PathSegment(go.PathSegment.Move, w, .5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h)));
});


go.Shape.defineFigureGenerator("LogicAnd", function(shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, h, false)
              .add(new go.PathSegment(go.PathSegment.Line, .5 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
         .setSpots(0.25, 0.5, 0.75, 1);
});

go.Shape.defineFigureGenerator("LogicOr", function(shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, .5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0)))
         .setSpots(0.219, 0, 0.78, 0.409);
});

go.Shape.defineFigureGenerator("Arrow", function(shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN; // % width of arrowhead
  if (isNaN(param1)) param1 = .3;
  var param2 = shape ? shape.parameter2 : NaN; // % height of tail
  if (isNaN(param2)) param2 = .3;

  var x = (1 - param1) * w;
  var y1 = (.5 - param2 / 2) * h;
  var y2 = (.5 + param2 / 2) * h;

  var geo = new go.Geometry();
  var fig = new go.PathFigure(0, y1, true);
  geo.add(fig);
  fig.add(new go.PathSegment(go.PathSegment.Line, x, y1));
  fig.add(new go.PathSegment(go.PathSegment.Line, x, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, x, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, w, .5 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, x, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, x, y2));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, y2).close());
  geo.spot1 = new go.Spot(0, y1 / h);
  var temp = getIntersection(0, y2 / h,
      1, y2 / h,
      x / w, 1,
      1, .5,
      tempPoint());
  geo.spot2 = new go.Spot(temp.x, temp.y);
  freePoint(temp);
  return geo;
});


go.Shape.defineFigureGenerator("DoubleEndArrow", function(shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN; // height of midsection
  if (isNaN(param1)) param1 = .3;

  var y1 = (.5 - param1 / 2) * h;
  var y2 = (.5 + param1 / 2) * h;

  var geo = new go.Geometry();
  var fig = new go.PathFigure(w, .5 * h, true);
  geo.add(fig);
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, y2));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, y2));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .5 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, y1));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, y1));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, 0).close());
  var temp = getIntersection(0, .5,
    .3, 0,
    0, y1 / h,
    .1, y1 / h,
    tempPoint());
  geo.spot1 = new go.Spot(temp.x, temp.y);
  temp = getIntersection(.7, 1,
    1, .5,
    0, y2 / h,
    1, y2 / h,
    temp);
  geo.spot2 = new go.Spot(temp.x, temp.y);
  freePoint(temp);
  return geo;
});



go.Shape.defineFigureGenerator("ElectricalHazard", function(shape, w, h) {
  var geo = new go.Geometry();
  var fig = new go.PathFigure(.37 * w, 0, true);
  geo.add(fig);

  fig.add(new go.PathSegment(go.PathSegment.Line, .5 * w, .11 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .77 * w, .04 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .33 * w, .49 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, w, .37 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .63 * w, .86 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .77 * w, .91 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .34 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .34 * w, .78 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .44 * w, .8 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .65 * w, .56 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .68 * h).close());
  return geo;
});



go.Shape.defineFigureGenerator("MultiProcess", function(shape, w, h) {
  var geo = new go.Geometry();
  var fig = new go.PathFigure(.1 * w, .1 * h, true);
  geo.add(fig);

  fig.add(new go.PathSegment(go.PathSegment.Line, .2 * w, .1 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .2 * w, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, w, .8 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .8 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .9 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .8 * w, .9 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .8 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .2 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .1 * w, .2 * h).close());
  var fig2 = new go.PathFigure(.2 * w, .1 * h, false);
  geo.add(fig2);
  fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .1 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Line, .9 * w, .8 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Move, .1 * w, .2 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Line, .8 * w, .2 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Line, .8 * w, .9 * h));
  geo.spot1 = new go.Spot(0, .2);
  geo.spot2 = new go.Spot(.8, 1);
  return geo;
});



go.Shape.defineFigureGenerator("Help", function(shape, w, h) {
  var geo = new go.Geometry();
  var radius = .5;
  var cpOffset = KAPPA * .5;
  var centerx = .5;
  var centery = .5;
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, false);
  geo.add(fig);

  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h).close());
  radius = .05;
  cpOffset = KAPPA * .05;
  centerx = .5;
  centery = .8;
  var fig2 = new go.PathFigure((centerx - radius) * w, centery * h, false);
  geo.add(fig2);
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h).close());
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.7 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.2 * h, 0.75 * w, 0.475 * h, 0.75 * w, 0.225 * h));
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0.35 * h, 0.4 * w, 0.2 * h, 0.3 * w, 0.25 * h));
  return geo;
});


var neuerKnoten = { hauptInfo: "mehr Info",
                //restInfo:[{'mehr':[{'nochMehr':'beschreibung unterbegriff' }]},{'mehr':[{'nochMehr':'beschreibung unterbegriff'}]}],
                hintergrund:false, vordergrund:true, category:"allesSehen",restInfo:"Definition oder Eigenschaften",
                info: []};
        //{ 'text': "Unterbegriff/Eigenschaft" , 'mehr':["mehr dazu"], 'c':1}




    neuesDiagramm = jo(go.Diagram, "mainDiagram", {


        "grid.visible": true,
        "grid.gridCellSize": new go.Size(25, 25),
        //"commandHandler.copiesParentKey": false,

            //"clickCreatingTool.isGridSnapEnabled":true
            "undoManager.isEnabled": true,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
//beim Doppelclick in den Hintergrund wird ein neuer Knoten erstellt
          //  "clickCreatingTool.archetypeNodeData": neuerKnoten,


        //Eventuell im Html Document unsichtbar den Punkt zwischenspeichern und von "außen" die initialPosition setzen!
        initialPosition: new go.Point(modelCenter[0],modelCenter[1]),
        scale:1,


          });


// Addons für Bewegliche Linkbeschreibungen und Zoom
            neuesDiagramm.toolManager.mouseMoveTools.insertAt(0, new LinkLabelOnPathDraggingTool());
            //neuesDiagramm.toolManager.mouseMoveTools.insertAt(1, new DragZoomingTool());

    let geoReshape = new GeometryReshapingTool();
   /*
    geoReshape.handleArchetype=
        jo(go.Shape,
                 {fill:"blue",
                     minSize:new go.Size(16,16)});


    */

    neuesDiagramm.toolManager.mouseDownTools.insertAt(3, geoReshape);
    console.log("test unter georeshape");
    neuesDiagramm.toolManager.mouseDownTools.next;
    neuesDiagramm.toolManager.mouseDownTools.next;
    neuesDiagramm.toolManager.mouseDownTools.next;

    neuesDiagramm.toolManager.mouseDownTools.each(function(e){
    if(e.Ra == "GeometryReshaping") {
       neuesDiagramm.model.startTransaction("adornment");
            neuesDiagramm.toolManager.resizingTool.handleArchetype =
    jo(go.Panel, "Auto",
      jo(go.Shape, "RoundedRectangle",
        { name: "", fill: "dodgerblue", stroke: "white", strokeWidth: 3,
        minSize:new go.Size(20,20)}));

//            console.log(e.handleArchetype.Rn.width = 40);
    neuesDiagramm.model.commitTransaction("adornment");}
    });
    neuesDiagramm.scrollMode = go.Diagram.InfiniteScroll;

              neuesDiagramm.toolManager.dragSelectingTool.isPartialInclusion = true;
              neuesDiagramm.toolManager.dragSelectingTool.box =
    jo(go.Part,
      { layerName: "Tool" },
      jo(go.Shape, "RoundedRectangle",
        { name: "SHAPE", fill: null, stroke: "white", strokeWidth: 6 })
    );

//Zentriert ausgewähltes Element
            neuesDiagramm.addDiagramListener("LinkDrawn", function(e) {
                var part = e.subject;

                neuesDiagramm.startTransaction("gibt Link Farbe");
                neuesDiagramm.model.setCategoryForLinkData(part.data,"linkTem");
                neuesDiagramm.model.setDataProperty(part.data,"color", "green");
                neuesDiagramm.model.setDataProperty(part.data,"linklabel", true);

                neuesDiagramm.commitTransaction("gibt Link Farbe");
                console.log(part.data.color);


            });

                /*
                if(e)
                {
                    console.log(e);

                }

                neuesDiagramm.centerRect(new go.Rect(neuesDiagramm.lastInput.documentPoint.x,neuesDiagramm.lastInput.documentPoint.y,0,0));
                });


            neuesDiagramm.addDiagramListener("InitialLayoutCompleted", function(e) {
        console.log(e);
            });
*/
            //neuesDiagramm.layout = jo(go.TreeLayout);

      neuesDiagramm.commandHandler.archetypeGroupData =
    { isGroup: true, color: "blue" };

  neuesDiagramm.addModelChangedListener(function(evt) {
    // ignore unimportant Transaction events
    if (!evt.isTransactionFinished) return;
    var txn = evt.object;  // a Transaction
    if (txn === null) return;
    console.log(evt);
    // iterate over all of the actual ChangedEvents of the Transaction
    txn.changes.each(function(e) {
      // ignore any kind of change other than adding/removing a node
      if (e.modelChange !== "nodeDataArray") return;
      // record node insertions and removals
      if (e.change === go.ChangedEvent.Insert) {

        //modelCentr = e.newValue.loc.split(" ");
        //modelCentr = modelCentr[0]+","+modelCentr[1].toString();

          console.log("e.newValue");
          console.log(e.newValue);

        console.log(evt.propertyName + " added node with location : " + e.newValue);

      } else if (e.change === go.ChangedEvent.Remove) {
        console.log(evt.propertyName + " removed node with key: " + e.oldValue.key);
      }
    });
    return neuesDiagramm;
  });


            //Diagrammlistener der bei Änderungen die Speicherfunktion ermöglicht
            // und nach 34 Sekunden autospeichert
neuesDiagramm.addDiagramListener("Modified", function(e) {
    var button = document.getElementById("savior");
    if (button) button.disabled = !neuesDiagramm.isModified;
    var idx = document.title.indexOf("*");
    if(!neuesDiagramm.model.nodeDataArray == []) {
    setTimeout(sendData, 14000);
    if (neuesDiagramm.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.slice(0, idx);
    }}});

//Gibt Inhalt des geladenen Models in der Konsole aus
//    console.log("neuesDiagramm.model");
//    console.log(neuesDiagramm.model);


    neuesDiagramm.model = new go.GraphLinksModel([], []); //Modelinitialisierung als GraphlinksModel nötigf

//Möglich, dass das noch gebraucht wird:
//neuesDiagramm.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;
//neuesDiagramm.animationManager.initialAnimationStyle = go.AnimationManager.None;
//neuesDiagramm.layout.isInitial = false;
/*
    neuesDiagramm.addDiagramListener('InitialAnimationStarting', function(e) {
        var animation = e.subject.defaultAnimation;
        animation.easing = go.Animation.EaseOutExpo;
        animation.duration = 900;
        animation.add(e.diagram, 'scale', 0.1, 1);
        animation.add(e.diagram, 'opacity', 0, 1);
});

 */

    if (document.getElementById("derInspektor")) {
        inspectore();
    }

    return neuesDiagramm;
}


//Erstellt einen neuen Knoten bei Eingabe in ein Textfeld
function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    neuesDiagramm.startTransaction("make new node");

                    var neuerKnoten = { hauptInfo: toAdd, scale:"1", scaleZu:"1",
                //restInfo:[{'mehr':[{'nochMehr':'beschreibung unterbegriff' }]},{'mehr':[{'nochMehr':'beschreibung unterbegriff'}]}],
                hintergrund:false, vordergrund:true, category:"allesSehen",restInfo:"Definition oder Eigenschaften",
                info: [{ 'text': "Unterbegriff/Eigenschaft" , 'mehr':["mehr dazu"], 'c':1}]};
        //


    neuesDiagramm.model.addNodeData(neuerKnoten);
    neuesDiagramm.commitTransaction("make new node");
    document.getElementById('dieInfo').value = ''
}

//Sendet den Modellinhalt als JSON zurück an den Server
//Potenzielle Sicherheitslücke, Zugriff auf DB-Eintrag ist aber durch user_login kontrolliert
function sendData() {

    //console.log('url is : ')
    //Der einzige Weg zu einem Diagramm ist über /saved/DiagrammID außer bei der Erstellung
    if (!current_url) { current_url = window.location.href}
    console.log(window.location.href);

    let modelAsJson = neuesDiagramm.model.toJson();

// Hier noch mit XMLHttpRequest, später mit Fetch
    let xhr = new XMLHttpRequest();
    //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
    xhr.open("POST", current_url, true);
    xhr.setRequestHeader("Content-Type", "application/json");


    //console.log('folgendes json file wird geschickt: ');
    //console.log(modelAsJson.toString());
    xhr.send(modelAsJson);
    neuesDiagramm.isModified = false;
}


//Wird bei der Neuerstellung eines Diagramms benötigt um Titel und ID zu bekommen
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
//           console.log('response: ');
//           console.log(response);
            model_id = response;
            current_url = "/saved/"+response;
            console.log("curr url is: " + current_url);
            console.log('Model ID ist: ' + model_id);
            if (response.status !== 200)     {
              //console.log(`Looks like there was a problem. Status code: ${response.status}`);
              return;
            }
       //    console.log('im response block');
       //    console.log(response.text());

            response.text().then(function (data) {
              //console.log('hier kann noch mehr passieren');
            });
          })
          .catch(function (error) {
            console.log("Fetch error: " + error);
          });

      }
//diese Funktion fordert vom Server eine gespeichertes Diagrammodell an
function getDiagramData() {
    let request = new XMLHttpRequest();
    request.open("GET", url=window.location.href);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if ((JSON).parse(this.responseText)) {
            var model_json = JSON.parse(this.responseText);
            console.log(model_json);
            //console.log(model_json.isJSON());

            if(model_json.nodeDataArray) {


                //Das Diagramm läd als erste Position den Mittelwert aller Locations
                //Könnte vielleicht verschoben, aber hier hat man das JSON direkt
                var ce = [0.0, 0.0];
                            //        let temp = model_json.WOOOOO.loc.split(" ");

                //ce[0]=mparseFloat(Math.abs(temp[0]));
                //ce[1]=mparseFloat(Math.abs(temp[1]));



                nodeNo = 0.0;
                model_json.nodeDataArray.forEach(function (e) {
                    if (e.loc){
                    let temp = e.loc.split(" ");
                    if (parseFloat(Math.abs(temp[0])) < 10000 && parseFloat(Math.abs(temp[1])) < 10000) {
                        ce[0] += parseFloat(temp[0]);
                        ce[1] += parseFloat(temp[1]);
                        nodeNo = nodeNo + 1.0;
                    }
                }});

                //Achtung das folgende ist nur ein Fix weil veraltete Datenbankeinträge
                // aufgrund ihrer mangelnden Category nicht richtig angezeigt werden!

                counter = 0;
                model_json.nodeDataArray.forEach(function (x) {
                   counter++;
                   console.log(x.category);
                    console.log(counter + " elemente von model json: ");
                    if(!x.category){
                    console.log(x.category);
                }});


                ce[0] /= nodeNo;
                ce[1] /= nodeNo;
                modelCenter = ce;


                console.log(modelCenter);
            }
            //zum Debuggen
            //console.log('Diagramm Data: ');
            //console.log(model_json);

            //Stellt sicher, dass das Diagramm initialisiert wurde
            if(!neuesDiagramm) { neuesDiagramm = make_dia(); }

            //läd die Objekttemplates bevor das Modell geladen wird
            style_dia();
            neuesDiagramm.model  =   new go.Model.fromJson(model_json);

        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

// Diagram style
function style_dia() {



        var nochEinItemTemplate =
            jo(go.Panel, "Auto",
                {                    alignment:go.Spot.LeftCenter
                },

                jo(go.Panel, "Auto",
              { margin: 2 ,
              alignment:go.Spot.Left,
              padding:10},
/*
              jo(go.Shape, "RoundedRectangle",
                {
                    fill: "lime",
                    minSize:new go.Size(420,40),
                //    alignment:go.Spot.Left,
                    stretch:go.GraphObject.Vertical,
                }),
*/

            jo(go.Panel, "Auto",
                jo(go.Shape, "RoundedRectangle",
                    {fill:"white"}),

                jo(go.TextBlock, new go.Binding("text", "nochMehr").makeTwoWay(),
                    { margin: 2,
                    editable:true})
            )));  // end of itemTemplate



    var itemTemplate =
            jo(go.Panel, "Auto",
                {                    alignment:go.Spot.LeftCenter
                },

                jo(go.Panel, "Auto",
              { margin: 2 ,
              alignment:go.Spot.Left,
              padding:10},
/*
              jo(go.Shape, "RoundedRectangle",
                {
                    fill: "lime",
                    minSize:new go.Size(420,40),
                //    alignment:go.Spot.Left,
                    stretch:go.GraphObject.Vertical,
                }),
*/

            jo(go.Panel, "Auto",
                jo(go.Shape, "RoundedRectangle",
                    {fill:"white"}),

                jo(go.TextBlock, new go.Binding("text").makeTwoWay(),
                    { margin: 2,
                    editable:true})
            )));  // end of itemTemplate




    //temTem = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Panel>();
            var itemTem =
           jo(go.Panel, "Auto",
                                  {padding:5},

               jo(go.Shape, "RoundedRectangle",
                //Bildet den Hintergrund des Unterpunktes
                   {fill:"green",
                      // stretch:go.GraphObject.Horizontal,
                minSize:new go.Size(490,30)
                   },
                ), //diese Panels und die Form umfassen den Rest


               jo(go.TextBlock,
          new go.Binding("text","nochMehr").makeTwoWay(),
                   {
                       alignment:go.Spot.TopLeft,

                           //new go.Spot(0,0-16,16),
                       scale:1.2,
                   margin:20,
                   editable:true}),

               jo("Button",
                {
                    alignment:new go.Spot(1,1,0,0),
                  margin: new go.Margin(0, 0, 0, 0),
                  click: machNeuenUntereintrag
                },
                jo(go.Shape, "PlusLine",
                  { desiredSize: new go.Size(16, 16) })

        ),


               jo(  go.Panel, "Vertical",
                new go.Binding("itemArray", "mehr").makeTwoWay(),
                {
                    itemTemplate:nochEinItemTemplate,
                    margin:0,
                    alignment:go.Spot.Center,
                    defaultAlignment: go.Spot.Left
                },

            ));








         // Array-Template

                var itemTemplateUber =
            jo(go.Panel, "Auto",
                {
                    padding:20,
                    alignment:go.Spot.LeftCenter
                },
                jo(go.Shape, "RoundedRectangle",

                    {strokeWidth:1,
                        fill:"#929292",
                stroke:"transparent"
                    }
                    ,new go.Binding("stroke", "knotenfarbe").makeTwoWay()
                    ),
                jo(go.Panel, "Vertical",
              { margin: 16 ,
              alignment:go.Spot.TopLeft,
              //Parameter1: 40,
              padding:2},
/*
              jo(go.Shape, "RoundedRectangle",
                {
                    fill: "lime",
                    minSize:new go.Size(420,40),
                //    alignment:go.Spot.Left,
                    stretch:go.GraphObject.Vertical,
                }),
*/

      /*


             jo("Button",
          { margin: 2,
              alignment:new go.Spot(0,0,-4,-6)
          },

      jo(go.TextBlock,
            new go.Binding("text","c"),
            {background:"black",
                stroke:"white",
                margin:new go.Margin(0,4,0,4),
                minSize:new go.Size(16,20),
                stretch:go.GraphObject.Horizontal,
            font:"bold 38px Lucida Sans Typewriter"}),
             ),

            */
         //   scale:4,
//                function(e) {
  //              console.log(neuesDiagramm.lastInput);
    //        }),

//Leider kann hier kein individuelles Binding erstellt werden,
// die Click Funktion ist bei allen Buttons gleich, auf das individuelle "c" kann nicht zugegriffen werden >:o





       /*     click:function() {

            console.log(neuesDiagramm.lastInput.event);
                },
                //margin:new go.Margin(0,20,0,0),
                minSize: new go.Size(30,22),
                stroke:"white",
                scale:1,
                background:"black",
            alignment: new go.Spot(0,0.4,-32,29)
            })
            */



            jo(go.Panel, "Auto",
                {alignment:new go.Spot(0.5,0,20,0)},
                jo(go.Shape, "RoundedRectangle",
                    {fill:"slategray",
                    margin:20,
                    alignment:go.Spot.Center,
                    margin:new go.Margin(10,20,0,0),
                    minSize:new go.Size(820,20),
                    maxSize:new go.Size(1000,NaN),

                    //maxSize: new go.Size(700, NaN)
                    }),


//mit Text von Info Array verknüpft
                jo(go.TextBlock, new go.Binding("text","text").makeTwoWay(),
                    {
                        font:" bold 42pt  Andale Mono serif",
                        margin: new go.Margin(32,32,54,32),
                        isMultiline:true,
                        width:640,
                    textAlign: "center",
                    editable:true}),
          jo("PanelExpanderButton", "HIA",
              {alignment:new go.Spot(0.5,1,0,10),
                  margin:10,
              scale:3})
            ),
                jo(go.Panel, "Vertical",
                    new go.Binding("itemArray", "mehr").makeTwoWay(),

                {
                    alignment:go.Spot.BottomCenter,
                 name:"HIA",
                    visible:false,
                   itemTemplate:
                       jo(go.Panel, "Auto",
                { margin: 2 },


              jo(go.Shape, "RoundedRectangle",
                { fill: "darkslategray",
                margin:new go.Margin(10,10,10,10),

                minSize: new go.Size(330,110),
                maxSize: new go.Size(1000, NaN)}),
              jo(go.TextBlock, new go.Binding("text", "").makeTwoWay(),
                { margin: 42 ,
                    overflow: go.TextBlock.OverflowClip,
                    isMultiline:true,
                    width:730,
                    font:"22pt Andale Mono serif ",

                    wrap: go.TextBlock.WrapDesiredSize,
                    stroke:"lightgoldenrodyellow",
                editable:true})
            )  // end of itemTemplate

                    ,
                    padding:10,
                    alignment:go.Spot.Left,
                    defaultAlignment: go.Spot.Left
                },
                ),






                ));  // end of itemTemplate

    var idea =
             jo(go.Node, "Auto",
        locator(),

        jo(go.Panel,"Vertical",
        jo(go.Panel, "Auto",
            jo(go.Shape, "ElectricalHazard",
              { fill:"yellow",

            stroke:"white",
                strokeWidth:2,
                  scale:1.8,
            minSize:new go.Size(300,300),

                //fromSpot: go.Spot.LeftRightSides,
               //toSpot: go.Spot.TopBottomSides,
                doubleClick:frageEinAusblenden
            })),
            jo(go.Panel, "Auto",
                new go.Binding("visible").makeTwoWay(),
                {alignment: new go.Spot(0.5,1,0,10),
                    name:"Frage"},

            jo(go.Shape, "RoundedRectangle",
                             //   new go.Binding("visible","visible").makeTwoWay(),
                new go.Binding("fill","color").makeTwoWay(),
                {maxSize:new go.Size(500,NaN),

                    doubleClick:zentrierAlles,
              portId: "",
               toLinkable: true,
                  fromLinkable:true,
              toSpot:go.Spot.NotTopSide,
                  toSpot:go.Spot.NotTopSide,



                    fill:"white"
                }),
                jo(go.TextBlock, "!",
                    new go.Binding("text").makeTwoWay(),
                    {editable:true,
                        stroke:"black",
                        maxSize:new go.Size(420,NaN),
                        font:"bold 32pt Segoe UI sans-serif",
                        isMultiline:true,
                        margin:new go.Margin(20,20,50,20)
                    }),
            )
)
)
;



    var faktum =
    jo(go.Node, "Auto",
        locator(),
        jo(go.Panel, "Auto",
            new go.Binding("visible", "klein").makeTwoWay(),




            jo(go.Shape, "SpeechBubble", {fill:"white", background:"transparent", visible:true,
                isPanelMain:true, click:textsicht,
            minSize: new go.Size(60,36),

            },
                new go.Binding("fill", "color").makeTwoWay(),
            )),

    jo(go.Panel, "Auto",
        new go.Binding("visible", "expand").makeTwoWay(),
    jo(go.Shape, "RoundedRectangle",
        {
            click:textsicht,
            maxSize: new go.Size(480,NaN),
         //   minSize: new go.Size(480,NaN)
}),

    jo(go.TextBlock,
        new go.Binding("text").makeTwoWay(),
        {editable:true,
        stroke:"white",
        //font:"10pt",
        isMultiline:true,
        margin: 20,
            maxSize: new go.Size(440,NaN),
})));





     // Detail-Template
    var allesSehen =


    jo(go.Node, "Auto",
        //{name:"MEHR"},
        new go.Binding("text", "category"),
        new go.Binding("scale").makeTwoWay(),
        locator(),



        jo(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "knotenfarbe").makeTwoWay(),
            {fill:"grey",
            strokeWidth:30,
            stroke:"transparent",
            parameter1:20,
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
            toSpot: go.Spot.NotBottomSide,fromSpot: go.Spot.Bottom}
            ),




        jo(go.Panel, "Auto",



        jo(go.Panel, "Vertical",

                   jo(go.TextBlock,
                       new go.Binding("text","hauptInfo").makeTwoWay(),
                       new go.Binding("background", "knotenfarbe").makeTwoWay(),
                       new go.Binding("stroke", "textfarbe").makeTwoWay(),


                {
                    alignment:go.Spot.TopCenter,
                    background:"green",
                    stroke:"white",
                    font:"small-caps bold 86px Georgia, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(830,110),
                    margin:10,
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                },
            ),

               jo(go.Shape, "Rectangle",
                   {fill:"black",
                       stroke:"black",
                       strokeWidth:16.8,
                    minSize:new go.Size(30,1),
                    maxSize:new go.Size(NaN,1),

                   margin:new go.Margin(-18,0,0,0),
                   stretch:go.GraphObject.Horizontal
                   }),


           jo(go.Panel, "Vertical",
               {padding:20,
               name:"defPan"
               },
               jo("PanelExpanderButton", "hanspet",
            { scale:3 }),

            jo(go.Panel, "Auto",
                    {name:"hanspet"},
               jo(go.Shape, "RoundedRectangle",
                   {fill:"transparent",
                   strokeWidth:5,
                       maxSize: new go.Size(880,NaN)
                   }),
               jo(go.TextBlock,
                    new go.Binding("text", "restInfo").makeTwoWay(),
                   new go.Binding("background", "knotenfarbe").makeTwoWay(),
                   new go.Binding("stroke", "textfarbe").makeTwoWay(),


                               {
                    alignment:go.Spot.TopCenter,
                    stroke:"white",
                    font:" bold 22px Arial, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(800,60),
                   maxSize: new go.Size(800,NaN),

                    margin:32,
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                })),


               jo(  go.Panel, "Vertical",
                new go.Binding("itemArray", "info").makeTwoWay(),
                {
                    itemTemplate:itemTemplateUber,
                    alignment:go.Spot.Left,
                    defaultAlignment: go.Spot.Left,
                    margin:50,
                    //fill:"slategray"
                }

                ),

               jo("Button",
                {
                    alignment:new go.Spot(1,1,-50,-40),
                  margin: new go.Margin(0, 0, 0, 0),
                  scale:0.5,
                    click: machNeuenUntereintrag
                    },
                jo(go.Shape, "Rectangle" ,{fill:"slategray", stroke:"slategray"},
                  {
                  //    desiredSize: new go.Size(26, 26)
                  }),
                jo(go.Shape, "PlusLine",  { alignment:go.Spot.Center,
                                      strokeWidth:10, stroke:"white"
})),



                          jo("Button",
                {
                    scale:1.2,
                    alignment:new go.Spot(0,1,40,-40),
                  margin: new go.Margin(0, 0, 0, 0),
                  click: changeCategory

  /*  {



                        node = neuesDiagramm.findNodeForKey(obj.Jj.hb.key);
                    console.log(node.data.category);
                                     neuesDiagramm.model.startTransaction("neue Cat");

                    neuesDiagramm.model.setCategoryForNodeData(node.data, "simple");
                    neuesDiagramm.model.commitTransaction("neue Cat");

                   neuesDiagramm.model.startTransaction("neuer Unterbegriff");
                        let neu = {'mehr': [{'unter': 'Unterbegriff'}, {'text': 'Mehr dazu...'}]};
                    neuesDiagramm.model.insertArrayItem(node.data.restInfo, "restInfo", neu); }
                  */

                },
                jo(go.Shape, "RoundedRectangle",
                    new go.Binding("fill", "knotenfarbe").makeTwoWay(),

                  {
                      //desiredSize: new go.Size(26, 26),
                      fill:"green", stroke:"white",
                  strokeWidth:6})
              )),




           ),
        )
    );



    //Definiert das Linkaussehen und Verhalten

     var detailansicht =
    jo(go.Node, "Auto",
        {selectionObjectName:"MEHR",
        selectionObjectName:"TEXT"},
        new go.Binding("text","category"),

        jo(go.Panel, "Table",



           //   new go.Binding("scale").makeTwoWay(),
              new go.Binding("itemArray", "info").makeTwoWay(),
              {name:"MEHR",
                itemTemplate: itemTem,
                  defaultAlignment: go.Spot.BottomCenter
              //  itemCategoryProperty: ""
              }),

                    jo("Button",
                {
                    alignment:go.Spot.TopRight,
                  margin: new go.Margin(0, 1, 0, 0),
                  click: function(e, obj) {

                    //console.log(obj);
                  }
                },
                jo(go.Shape, "MinusLine",
                  { desiredSize: new go.Size(16, 16) })
              ),


        jo(go.Panel, "Auto",
          //{padding:110},
            jo(go.Shape, "RoundedRectangle",
                {fill:"blue"}),
          //new go.Binding("fill", "color")),
        jo(go.Panel, "Vertical",
          { defaultAlignment: go.Spot.TopCenter },
          jo(go.TextBlock,
              {
                  //alignment:go.Spot.Center,
                  background:"red",
                  font:"14pt bold",
              stroke:"white",
              margin:20},
              new go.Binding("text", "hauptInfo")))
          ,
          jo(go.Panel, "Vertical",
            jo(go.TextBlock, "Definition",

              {alignment:new go.Spot(0.5,1,0,30)},
              new go.Binding("text", "definition").makeTwoWay()
        ),
            jo(go.TextBlock,
                {background:"white",
                margin:10}
              ),


          /*
            jo(go.Panel, "Spot",

              {
                  name:"TEXT",
                  margin: 2 },
              jo(go.Shape, "RoundedRectangle",
                { fill: "white" ,
                    minSize:new go.Size(12,30)
                }),
              jo(go.TextBlock, new go.Binding("text", "t").makeTwoWay(),
                  new go.Binding("scale", "c").makeTwoWay(),
                  //new go.Binding("location").makeTwoWay(),

                { margin: 2,
                editable:true}))}) */





               jo("Button",
            { alignment: go.Spot.BottomRight },
            jo(go.Shape, "PlusLine", { width: 8, height: 8 }),
            { click: neuerUntereintrag}

               ),


      jo("Button",
        { alignment: go.Spot.TopRight },
        jo(go.Shape, "MinusLine", { width: 8, height: 8 }),
        { click: changeCategory })
    )));

  // this function changes the category of the node data to cause the Node to be replaced
  function changeCategory(e, obj) {
    var node = obj.part;
    if (node) {
      var diagram = node.diagram;
      diagram.startTransaction("changeCategory");
      var cat = neuesDiagramm.model.getCategoryForNodeData(node.data);
      if (cat === "simple"){
        cat = "allesSehen";
        node.data.hintergrund = false; node.data.vordergrund = true;}
      else
        cat = "simple";
      diagram.model.setCategoryForNodeData(node.data, cat);
      diagram.commitTransaction("changeCategory");
    }
  }


    function textsicht(e, obj) {
      let node = obj.part;
      if (node) {
          let aktuell = node.data.expand;
          console.log("aktuell wahrheitswert");
          console.log(aktuell);
          neuesDiagramm.startTransaction("einausblenden");
          neuesDiagramm.model.setDataProperty(node.data, "expand", !aktuell);
          neuesDiagramm.model.setDataProperty(node.data, "klein", aktuell);
          if(node.data.klein == false){
          neuesDiagramm.scale = 1.3;
          neuesDiagramm.centerRect(new go.Rect(e.documentPoint.x+0,e.documentPoint.y, 0,0));
          console.log("in if schleife");
          }


          neuesDiagramm.commitTransaction("einausblenden");

          console.log("nach der if schleife");
          console.log(node.data.klein);
          console.log(node.data.expand);
      }
    };


var lili =

        jo(go.Link,

          {
              routing: go.Link.Orthogonal,
                    corner:100,
                    routing: go.Link.AvoidsNodes,
          doubleClick:linkDoubleClick},
          jo(go.Shape,
              new go.Binding("stroke","color").makeTwoWay(),
            { stroke: "white", strokeWidth: 42}),

            jo(go.Panel, "Auto",
                new go.Binding("visible"),

                {               segmentIndex:NaN,

                    segmentFraction: 0.05,
 _isLinkLabel: true, segmentIndex: NaN},
                    new go.Binding("segmentFraction","eins").makeTwoWay(),

                jo(go.Shape, "RoundedRectangle"),

          jo(go.TextBlock, "auch mit Text",
            new go.Binding("text", "fromText"),
            {
                editable:true,
                margin:10,
              segmentIndex:NaN,
              stroke: "orange",
              maxSize: new go.Size(180, NaN)
            })),
jo(go.Panel, "Vertical",
                    jo(go.Panel, "Auto",
                        {scale:2,
                            visible:false,
                            segmentIndex:NaN,
                    segmentFraction: 0.5
                },
                jo(go.Shape, "RoundedRectangle",
                    {fill:"white"}),
                        jo(go.Shape, "LogicAnd",
                            new go.Binding("visible","visand").makeTwoWay(),
                            {stroke:"black",
                                margin:20,
                            strokeWidth:10}),

                        jo(go.Shape, "LogicOr",
                            new go.Binding("visible","visor").makeTwoWay(),
                            {stroke:"black",
                                                                margin:20,

                            strokeWidth:10}),
                        jo(go.Shape, "Arrow",
                            new go.Binding("visible","visimp").makeTwoWay(),
                            {stroke:"black",
                                                                margin:20,

                            strokeWidth:10}),
                        jo(go.Shape, "DoubleEndArrow",
                            new go.Binding("visible","visiff").makeTwoWay(),
                            {stroke:"black",
                                                                margin:20,

                            strokeWidth:10}),
                        jo(go.Shape, "Arrow",
                            new go.Binding("visible","vispim").makeTwoWay(),
                            {stroke:"black",
                                angle:180,
                                                                margin:20,

                            strokeWidth:10})



                        )),





            jo(go.Panel, "Auto",
                new go.Binding("visible"),

                    { segmentIndex: NaN, segmentFraction: .95 ,
 _isLinkLabel: true, segmentIndex: NaN},
                    new go.Binding("segmentFraction","zwei").makeTwoWay(),


                jo(go.Shape, "RoundedRectangle"),


            jo(go.TextBlock, "auch mit Textdsfdgagsdfsfs    ",
            new go.Binding("text", "toText"),
            {
                editable:true,
                margin:10,
                //segmentIndex:NaN,
                segmentFraction: 0.95,
              stroke: "orange",
                maxSize: new go.Size(180, NaN)
            })));




        var linkTem =
            jo(go.Link,

                //Speichert die veränderbare Linkform
                new go.Binding("points").makeTwoWay(),

                    //Link doppelklicken blendet das Beschreibungsfeld aus
                    {doubleClick: linkDoubleClick,
                    toShortLength: 20,
                    fromShortLength:20,
                    //routing: go. Link.AvoidsNodes,
                    reshapable: true,
                    //TODO: rausfinden wie die Segmente begrenzt werden können!
                    //Bisher entsteht für jede Positionsveränderung ein neues Segment und Punkt im Array
                    resegmentable: true,
                    routing: go.Link.Orthogonal,
                    //curve: go.Link.Bezier,
                        curviness:0,
                    //routing: go. Link.AvoidsNodes,
                    corner:100,
                    routing: go.Link.AvoidsNodes,

                fromEndSegmentLength:60,
                toEndSegmentLength:60,
                    //corner: 220,
                    relinkableFrom: true, relinkableTo: true},




                //unsichtbare Form die das Klicken auf den Link erleichtert
                jo(go.Shape, { isPanelMain: true, stroke: "transparent", strokeWidth: 30 }),

               //der tatsächliche Link
                jo(go.Shape,
                    new go.Binding("stroke","color").makeTwoWay(),
                    new go.Binding("fill","color").makeTwoWay(),


                    {
                        opacity: 0.95,
                        isPanelMain: true,
                        strokeWidth: 50,
                        stroke: "#F5F5F5",
                    }),
                //die Pfeilspitze
                jo(go.Shape,
                    new go.Binding("stroke","color").makeTwoWay(),
                    new go.Binding("fill","color").makeTwoWay(),
                    { strokeWidth: 2, toArrow: "NormalArrow", fill: 'green', stroke: 'green', scale: 8}),
                //das Pfeilende
                jo(go.Shape,
                    { strokeWidth: 2, fromArrow: "PentagonArrow", fill: 'white', stroke: 'green', scale: 4}),

                // das Panel in dem sich der Textblock befindet, verschiebbar gemacht und anfangs in der Mitte
                jo(go.Panel, "Auto",
                    { _isLinkLabel: true, segmentIndex: NaN, segmentFraction: .5 },
                    new go.Binding("segmentFraction").makeTwoWay(),
                    new go.Binding("visible"),
                    new go.Binding("background"),

                    //  {segmentOrientation: go.Link.OrientUpright}, lässt LinkLabel orthogonal zum Link ausgerichtet sein
                    jo(go.Shape, "RoundedRectangle",
                        {
                            visible: false
                        }),
                // der eigentliche Text - über SegmentFraction verschiebbar
                    jo(go.Panel, "Auto",
                        jo(go.TextBlock, "Link doppelt klicken \n lässt dieses Textfeld verschwinden!",
                            new go.Binding("text", "description").makeTwoWay(),
                            new go.Binding("segmentFraction").makeTwoWay(),
                            new go.Binding("visible"),

                            {
                                maxSize:new go.Size(666,NaN),
                                //Versuch eine dynamische Größe beim Zoomen oder Vergrößern zu realisieren - geht noch nicht
                                //new go.Size(Math.abs(neuesDiagramm.findNodeForKey(from).dg.x-neuesDiagramm.findNodeForKey(to).dg.x), NaN),
                                isMultiline: true,
                                font: "bold 50pt Segoe UI sans-serif",
                                visible: false,
                                editable: true,
                                minSize: new go.Size(10, 16),
                                background: "#000000",
                                opacity: 0.9, stroke: "#F5F5F5",
                            }),



)));


        var logiktemplate =
            jo(go.Node, "Auto",
            locator(),
            jo(go.Panel, "Vertical",
                    jo(go.Panel, "Auto",
                        {scale:2},
                jo(go.Shape, "RoundedRectangle",
                    {
                        fill:"white", fromLinkable:true,
                        toLinkable:true,
                    portId:"", fromSpot:go.Spot.AllSides,
                        toSpot:go.Spot.AllSides,
                        minSize:new go.Size(200,200),
                        doubleClick: function(e,obj) {
                            neuesDiagramm.startTransaction("logiktext ein-ausblenden");
                            neuesDiagramm.model.setDataProperty(obj.part.data,"visible", !obj.part.data.visible);
                            neuesDiagramm.commitTransaction("logiktext ein-ausblenden")}
}),
                        jo(go.Shape, "LogicAnd",
                            new go.Binding("visible","visand").makeTwoWay(),
                            {stroke:"black",
                                margin:25,
                            strokeWidth:20}),

                        jo(go.Shape, "LogicOr",
                            new go.Binding("visible","visor").makeTwoWay(),
                            {stroke:"black",strokeWidth:25,
                                                                margin:20}),
                        jo(go.Shape, "Arrow",
                            new go.Binding("visible","visimp").makeTwoWay(),
                           {stroke:"black",
                               margin:20,
                               maxSize:new go.Size(NaN,62),
                            strokeWidth:20}),
                        jo(go.Shape, "DoubleEndArrow",
                            new go.Binding("visible","visiff").makeTwoWay(),
                            {stroke:"black",
                             strokeWidth:14,                                   margin:20,
                                minSize:new go.Size(160,NaN)
                            }),
                        jo(go.Shape, "Arrow",
                            new go.Binding("visible","vispim").makeTwoWay(),
                            {stroke:"black",
                                angle:180,
                                                                margin:20,

                                                                maxSize:new go.Size(NaN,62),

                            strokeWidth:20}),
                              jo(go.Shape, "LogicThereExists",
                            new go.Binding("visible","visex").makeTwoWay(),
                            {stroke:"black",
                                margin:20,

                            strokeWidth:20}),
                        jo(go.Shape, "LogicForAll",
                            new go.Binding("visible","visall").makeTwoWay(),
                            {stroke:"black",
                                margin:20,

                            strokeWidth:20})
                        ),
    jo(go.Panel, "Auto",
    new go.Binding("visible").makeTwoWay(),
        {visible:true},
    jo(go.Shape, "RoundedRectangle",
        {}),
    jo(go.TextBlock, "RoundedRectangle",
        new go.Binding("text").makeTwoWay(),
        {
            maxSize:new go.Size(444,NaN),
            editable:true,
            visible:true,
        scale:2,
            margin:10,
        stroke:"white"}))));



    var helptemplate =
      jo(go.Node, "Auto",
        locator(),
        jo(go.Panel,"Vertical",
        jo(go.Panel, "Auto",
            jo(go.Shape, "Circle",
                {fill:"transparent",
                    stroke:"transparent",
                    portId: "",
               toLinkable: true,
                    fromLinkable:true,
              toSpot:go.Spot.AllSides,
              fromSpot:go.Spot.AllSides}),
            jo(go.Panel,"Auto",
            jo(go.Shape, "Circle",

              { fill:"red",
                  margin:30}),

          jo(go.Shape, "Help",
            {stroke:"white",
                strokeWidth:26,
                margin:20,
            minSize:new go.Size(300,300),

                //fromSpot: go.Spot.LeftRightSides,
               //toSpot: go.Spot.TopBottomSides,
                click:frageEinAusblenden
            })),
            jo(go.Panel, "Auto",
                new go.Binding("visible").makeTwoWay(),
                {alignment: new go.Spot(0.5,1,0,60),
                    name:"Frage"},

            jo(go.Shape, "RoundedRectangle",
                             //   new go.Binding("visible","visible").makeTwoWay(),
                new go.Binding("fill","color").makeTwoWay(),
                {maxSize:new go.Size(300,NaN)},
                {
                    click:zentrierAlles,

                    fill:"red"
                }),
                jo(go.TextBlock, "Was ist fragwürdig?",
                    new go.Binding("text","frage").makeTwoWay(),
                    {editable:true,
                        stroke:"white",
                        maxSize:new go.Size(280,NaN),
                        font:"bold 32pt Segoe UI sans-serif",
                        isMultiline:true,
                        margin:new go.Margin(20,20,50,20)
                    }),
                jo(go.TextBlock, "Erklärung",
                    new go.Binding("text","antwort").makeTwoWay(),
                    {editable:true,
                        stroke:"white",
                        maxSize:new go.Size(0,0),
                        font:"bold 32pt Segoe UI sans-serif",
                        isMultiline:true,
                        margin:new go.Margin(20,20,50,20)
                    })
            )
)))
;



      var answertemplate =
      jo(go.Node, "Auto",
        locator(),

        jo(go.Panel,"Auto",

        jo(go.Panel, "Vertical",

jo(go.Panel, "Auto",
          jo(go.Shape, "Rectangle",
              {fill:"transparent",
              stroke:"transparent"}),
          jo(go.TextBlock , "!",
            {stroke:"#18B656",
               toLinkable: true,
              toSpot:go.Spot.LeftRightSides,
                portId:"",


                scale:30,
                font:"20pt serif",
            background:"transparent",
                alignment: new go.Spot(0,1,-30,200),
                margin:new go.Margin(0,0,0,15),
                click:frageEinAusblenden,
            //isPanelMain:true,

            })),
            jo(go.Panel, "Auto",
                new go.Binding("visible").makeTwoWay(),
                {alignment: new go.Spot(0.5,1,0,10),
                    name:"Frage"},

            jo(go.Shape, "RoundedRectangle",
                             //   new go.Binding("visible","visible").makeTwoWay(),
                {maxSize:new go.Size(500,NaN)},
                new go.Binding("visible").makeTwoWay(),
                {
                                  click:zentrierAlles,

                    fill:"#18B656"
                }),
                jo(go.Panel, "Vertical",
                jo(go.TextBlock, "Was ist fragwürdig?",
                    new go.Binding("text","frage").makeTwoWay(),
                    {editable:true,
                        background:"red",
                        stroke:"white",
                        maxSize:new go.Size(280,NaN),
                        font:"bold 22pt Segoe UI sans-serif",
                        isMultiline:true,
                        margin:20
                    }),



                jo(go.Panel, "Auto",
                jo(go.TextBlock, "Erklärung",
                    new go.Binding("text","antwort").makeTwoWay(),
                    {editable:true,
                        stroke:"white",
                        background:"#18B656",
                        maxSize:new go.Size(420,NaN),
                        font:"bold 32pt Segoe UI sans-serif",
                        isMultiline:true,
                        margin: 20
                    })))
            ))
)
)
;







//neuesDiagramm.nodeTemplate =
  var simpletemplate =
      jo(go.Node, "Auto",
                    new go.Binding("scale","scaleZu").makeTwoWay(),
                    locator(),

                  jo(go.Panel, "Auto",
                //new go.Binding("location", "vorderLoc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("visible", "vordergrund"),

                jo(go.Shape,
                    "RoundedRectangle",
                    new go.Binding("fill", "knotenfarbe").makeTwoWay(),

                    {minSize: new go.Size(300, 250),
                        maxSize: new go.Size(1280,NaN),
                        fill: "green",
                        parameter1:20,
                        doubleClick : zentrierAlles,

                        margin:10,
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                        fromSpot: go.Spot.Bottom,toSpot: go.Spot.NotBottomSide

                    }),

                  jo(go.Panel, "Vertical",



                      //Textblock in dem der Überbegriff gespeichert wird
                jo(go.TextBlock,        "Übergriff",
                    new go.Binding("text", "hauptInfo").makeTwoWay(),
                    //new go.Binding("font","schriftgrosseVorne").makeTwoWay(),

                   // new go.Binding("zOrder"), falls Elemente andere überdecken sollen
                    {minSize: new go.Size(20, 40),
                        name: "TEXT",
                        font:"bold 99pt Segoe UI sans-serif",

                        maxSize: new go.Size(1200,NaN),
                        stroke:"white",
                        editable: false,
                        //margin: new go.Margin(10,20,20,60)
                        margin:100
                    },

                ),
                  jo(go.Panel, "Vertical",
                      new go.Binding("visible", "hintergrund").makeTwoWay(),


                      {name:"restInf",
                          alignment:go.Spot.Center,
                          minSize: new go.Size(300,NaN),

                      maxSize: new go.Size(1000,NaN)
                      },
                      jo(go.TextBlock, "Definition",
                          //{alignment: new go.Spot(0,0,-4,-12)
                          {font:"bold 20pt Segoe UI sans-serif",
                          stroke:"white",
                              textAlign:"center",
                          stretch:go.GraphObject.Horizontal},
),

                      jo(go.TextBlock,
                          {isMultiline:true,
                              wrap: go.TextBlock.WrapFit,
                              background:"black",
                              stroke:"white",
                              font:"bold 18pt Segoe UI sans-serif",
                              editable:true,
                          stretch:go.GraphObject.Horizontal,
                              minSize: new go.Size(550,NaN),
                          textAlign: "center",
                              margin: new go.Margin(10,20,20,20)},
                          new go.Binding("text", "restInfo").makeTwoWay()),

                      )





                  ),
                            jo("Button",
                    { alignment: new go.Spot(1,1)},
                    jo(go.Shape, "MultiProcess", { fill:"white",
                    scale:0.5}),
                    { click: changeCategory }),

                  jo("PanelExpanderButton", "restInf",

                      { alignment: new go.Spot(0, 0.5,-10,10),
                      scale:3.5}),






                )
);


  var detailGruppe =
         jo(go.Group, "Vertical",
        //{name:"MEHR"},
        new go.Binding("text", "category"),
        new go.Binding("scale").makeTwoWay(),

                     {
            subGraphExpandedChanged: function(group) {console.log(group.memberParts.each(function(e) {
            if (e.category== "allesSehen") {
                console.log("hey");
                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e, "helptemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
            }))}},


                {
            selectionAdorned: true, selectionObjectName: "SHAPE",
            selectionAdornmentTemplate:  // custom selection adornment: a blue rectangle
              jo(go.Adornment, "Auto",
                jo(go.Shape, { stroke: "dodgerblue", fill: null }),
                jo(go.Placeholder, { margin: -1 }))
          },
          { resizable: true, resizeObjectName: "SHAPE" },
          { rotatable: true, rotateObjectName: "SHAPE" },
          { reshapable: true },


                        {mouseDrop: function(e, node) {
              var diagram = node.diagram;
              var selnode = diagram.selection.first();  // assume just one Node in selection
                console.log(diagram.selection.first().data.group);
                    diagram.selection.each(function(a){console.log(a.data)});
                console.log(node.data.key);
                neuesDiagramm.model.startTransaction("Zu Gruppe");

                let hintergruppe = false;
                let gibtgruppe = false;

                diagram.selection.each(function(i){
                    if(i.data.isGroup == true && i.data.group == "") {
                        neuesDiagramm.model.setDataProperty(i.data, "group", node.data.key);
                        hintergruppe = true;
                    }
});

                diagram.selection.each(function(o){
                    neuesDiagramm.model.setDataProperty(o.data, "group", node.data.key);
                });
                //neuesDiagramm.model.setDataProperty(selnode.data, "group", node.data.key);
                console.log(diagram.selection.first().data.group);

                neuesDiagramm.model.commitTransaction("Zu Gruppe");

              }
            },




jo(go.Panel, "Vertical",

jo(go.Panel, "Auto",
        jo(go.Shape, "RoundedRectangle",
            new go.Binding("fill", "knotenfarbe").makeTwoWay(),
            {fill:"grey",
            strokeWidth:30,
            stroke:"transparent",
                maxSize:new go.Size(1111,NaN),
            parameter1:20,
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
            toSpot: go.Spot.NotBottomSide,fromSpot: go.Spot.Bottom,
            alignment: new go.Spot(0.5,1,0,-500)}
            ),



jo(go.Panel, "Vertical",
        jo(go.Panel, "Vertical",

                   jo(go.TextBlock,
                       new go.Binding("text","hauptInfo").makeTwoWay(),
                       new go.Binding("background", "knotenfarbe").makeTwoWay(),
                       new go.Binding("stroke", "textfarbe").makeTwoWay(),


                {
                    alignment:go.Spot.TopCenter,
                    background:"green",
                    font:"small-caps bold 86px Georgia, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(830,110),
                    maxSize:new go.Size(999,NaN),

                    margin:10,
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                },
            ),

               jo(go.Shape, "Rectangle",
                   {fill:"black",
                       stroke:"black",
                       strokeWidth:16.8,
                    minSize:new go.Size(30,1),
                    maxSize:new go.Size(999,1),

                   margin:new go.Margin(-18,0,0,0),
                   stretch:go.GraphObject.Horizontal
                   }),


           jo(go.Panel, "Vertical",
               {padding:20,
               name:"defPan"
               },
               jo("PanelExpanderButton", "hanspet",
            { scale:3 }),

            jo(go.Panel, "Auto",
                    {name:"hanspet"},
               jo(go.Shape, "RoundedRectangle",
                   {fill:"transparent",
                   strokeWidth:5,
                       maxSize: new go.Size(880,NaN)
                   }),
               jo(go.TextBlock,
                    new go.Binding("text", "restInfo").makeTwoWay(),
                   new go.Binding("background", "knotenfarbe").makeTwoWay(),
                       new go.Binding("stroke", "textfarbe").makeTwoWay(),
                               {
                    alignment:go.Spot.TopCenter,
                    font:" bold 22px Arial, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(800,60),
                   maxSize: new go.Size(800,NaN),

                    margin:32,
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                }))),


               jo(  go.Panel, "Vertical",
                new go.Binding("itemArray", "info").makeTwoWay(),
                {
                    itemTemplate:itemTemplateUber,
                    alignment:go.Spot.Left,
                    defaultAlignment: go.Spot.Left,
                    margin:50,
                    //fill:"slategray"
                }

                ),

               jo("Button",
                {
                    alignment:new go.Spot(1,1,-50,-40),
                  margin: new go.Margin(0, 0, 0, 0),
                  scale:0.5,
                    click: machNeuenUntereintrag
                    },
                jo(go.Shape, "Rectangle" ,{fill:"slategray", stroke:"slategray"},
                  {
                  //    desiredSize: new go.Size(26, 26)
                  }),
                jo(go.Shape, "PlusLine",  { alignment:go.Spot.Center,
                                      strokeWidth:10, stroke:"white"
}))))),




                 jo(go.Panel, "Auto",


        jo(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
            {stroke:"transparent",
                parameter1:100,

                strokeWidth:40,
                parameter1: 14,
            opacity:0.5,
            fill:"white",
            toLinkable:true,
            fromLinkable:true,
            portId:"",
            toSpot:go.Spot.AllSides,
            fromSpot:go.Spot.AllSides}),
        jo(go.Panel, "Auto",
            {name:"SHAPE",
            margin:30},
        jo(go.Shape, "RoundedRectangle",
            new go.Binding("fill","color").makeTwoWay(),
            {
                parameter1:200,
                isPanelMain:true,
                doubleClick: function(e,obj) {
                            neuesDiagramm.startTransaction("logiktext ein-ausblenden");
                            neuesDiagramm.model.setDataProperty(obj.part.data,"visible", !obj.part.data.visible);
                            neuesDiagramm.commitTransaction("logiktext ein-ausblenden")},
                margin:40,
            minSize:new go.Size(1000,1000),
            opacity:0.5})
 ,
        jo(go.Placeholder,    // represents the area of all member parts,
          {padding: 240,
          isPanelMain:true}))  // with some extra padding around them
      ,
      //jo(go.TextBlock,         // group title
        //{ alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" }, // ich weiß nicht warum,
          // Textblock aber nicht entfernt werden ohne dass der Textblock in dem anderen Panel seine Formatierung verliert?!
        )





           ),

        );




var grouptemp =
    jo(go.Group, "Vertical",
      locator(),


        {
            selectionAdorned: true, selectionObjectName: "SHAPE",
            selectionAdornmentTemplate:  // custom selection adornment: a blue rectangle
              jo(go.Adornment, "Auto",
                jo(go.Shape, { stroke: "dodgerblue", fill: null }),
                jo(go.Placeholder, { margin: -1 }))
          },
          { resizable: true, resizeObjectName: "SHAPE" },
          { rotatable: true, rotateObjectName: "SHAPE" },
          { reshapable: true },


        {
            subGraphExpandedChanged: function(group) {console.log(group.memberParts.each(function(e) {
            if (e.category== "allesSehen") {
                console.log("hey");
                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e, "helptemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
            }))}},

        /*
            forEach(function(e) {
            if(e.part.data.category =="allesSehen"){
                console.log("hallo");
            }
            } )
        }
        },
         */

            {mouseDrop: function(e, node) {
              var diagram = node.diagram;
              var selnode = diagram.selection.first();  // assume just one Node in selection
                console.log(diagram.selection.first().data.group);
                    diagram.selection.each(function(a){console.log(a.data)});
                console.log(node.data.key);
                neuesDiagramm.model.startTransaction("Zu Gruppe");

                let hintergruppe = false;
                let gibtgruppe = false;

                diagram.selection.each(function(i){
                    if(i.data.isGroup == true && i.data.group == "") {
                        neuesDiagramm.model.setDataProperty(i.data, "group", node.data.key);
                        hintergruppe = true;
                    }
});

                diagram.selection.each(function(o){
                    neuesDiagramm.model.setDataProperty(o.data, "group", node.data.key);
                });
                //neuesDiagramm.model.setDataProperty(selnode.data, "group", node.data.key);
                console.log(diagram.selection.first().data.group);

                neuesDiagramm.model.commitTransaction("Zu Gruppe");

              }
            },


       jo(go.Panel, "Auto",
        jo(go.Shape, "RoundedRectangle",
            {fill:"white"}),
            jo(go.TextBlock, "Ein Gruppenname",
                new go.Binding("text").makeTwoWay(),
                new go.Binding("visible").makeTwoWay(),
        {
            minSize:new go.Size(120,NaN),
            maxSize:new go.Size(900,NaN),
            editable:true,
            visible:true,
        scale:2,
        textAlign: 'center',
        margin:new go.Margin(120,20,20,20),
            alignment:new go.Spot(0.5,0,0,0),
            font:"bold 60px Georgia",
        stroke:"black"}),

                                         jo("Button",
                    new go.Binding("visible","zu").makeTwoWay(),

                         {margin:20,
                             scale:4,
                         click:function(e,obj){
                             neuesDiagramm.model.startTransaction("ok");

                             e.diagram.commandHandler.expandSubGraph(obj.part);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "zu", false);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "auf", true);
                             neuesDiagramm.model.commitTransaction("ok");


                             obj.part.memberParts.each(function(e) {
                                 console.log(e.data.info);
            if (e.category== "helptemplate" && e.data.info) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "allesSehen");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }});






//                             neuesDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);

                         } },
                         jo(go.TextBlock, "Expandieren"),
                                             new go.Binding("visible","zu").makeTwoWay(),

                                             {
                                                 alignment:new go.Spot(0.05,0,0,0)
}),



                     jo("Button",
                         new go.Binding("visible","auf").makeTwoWay(),
                         {margin:20,
                             scale:4,
                             alignment:new go.Spot(0.1,0,0,0),
                         click:function(e,obj){
                             neuesDiagramm.model.startTransaction("ok");


                obj.part.memberParts.each(function(e) {
            if (e.category== "allesSehen") {
                neuesDiagramm.model.startTransaction("Kleiner Umweg");



                neuesDiagramm.model.setDataProperty(obj.part.data, "zu", true);
                neuesDiagramm.model.setDataProperty(obj.part.data, "auf", false);
                neuesDiagramm.model.setCategoryForNodeData(e.data, "helptemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }});





                             e.diagram.commandHandler.collapseSubGraph(obj.part);
//                             neuesDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);
                         neuesDiagramm.model.commitTransaction("ok");

                         } },
                         jo(go.TextBlock, "Minimieren",
                             new go.Binding("visible","auf").makeTwoWay(),
                               {alignment:new go.Spot(0.05,0,0,0)}
)))
        ,
      jo(go.Panel, "Auto",
          {name:"SHAPE"},

        jo(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
            {stroke:"transparent",
                strokeWidth:40,
                parameter1: 14,
            opacity:0.5,
            fill:"white",
            toLinkable:true,
            fromLinkable:true,
            portId:"",
            toSpot:go.Spot.AllSides,
            fromSpot:go.Spot.AllSides}),
        jo(go.Panel, "Auto",

        jo(go.Shape, "RoundedRectangle",
            new go.Binding("fill","color").makeTwoWay(),
            {
                isPanelMain:true,
                doubleClick: function(e,obj) {
                            neuesDiagramm.startTransaction("logiktext ein-ausblenden");
                            neuesDiagramm.model.setDataProperty(obj.part.data,"visible", !obj.part.data.visible);
                            neuesDiagramm.commitTransaction("logiktext ein-ausblenden")},
                margin:40,
            minSize:new go.Size(1000,1000),
            opacity:0.4})
 ,
        jo(go.Placeholder,    // represents the area of all member parts,
          {padding: 240}))  // with some extra padding around them
      ,
      //jo(go.TextBlock,         // group title
        //{ alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" }, // ich weiß nicht warum,
          // Textblock aber nicht entfernt werden ohne dass der Textblock in dem anderen Panel seine Formatierung verliert?!
        ),


    );






      var simplybad =
        jo(go.Node, "Auto",
            {
                selectionObjectName: "TEXT" },
            locator(),

         //   new go.Binding("scale", "grosse").makeTwoWay(),
            {
            //Doppelklicken auf den Knoten erstellt einen neuen damit verbundenen
            doubleClick: nodeDoubleClick,
            fromSpot: go.Spot.Center, toSpot: go.Spot.Center
},

            jo(go.Panel, "Auto", {padding:0},

                //Platzhalter für alle Ebenen der Node
                jo(go.Shape, "Rectangle",
                {
                    fill: "transparent",
                    stroke: "transparent",
                    strokeWidth:13
                }),






            //Panel das die Node in 2. Ebene repräsentiert und Positionierung erlaubt



            //Panel hält den Text der im Vordergrund steht
            jo(go.Panel, "Auto",
                //Binding für den Sichtbarkeitswert
                //new go.Binding("scale", "grosseVorn").makeTwoWay(),

                {position:new go.Point (0,0)},




                jo(go.Panel, "Auto",
                    {padding:0},
                    new go.Binding("visible", "hintergrund"),


                    jo(go.Shape, "RoundedRectangle",
                    {   minSize: new go.Size(420,400),
                        maxSize: new go.Size(730,NaN),
                        fill: "black",
                        margin:10,
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                    toSpot: go.Spot.LeftRightSides,fromSpot: go.Spot.TopBottomSides

                    }),



                    jo(go.Panel, "Vertical  ",


                    jo(go.TextBlock, "Definition: ",
                            {stroke:"white",
                            font:"bold 22pt Segoe UI sans-serif",
                            textAlign: "center",
                            minSize: new go.Size(60,30),
                            alignment: new go.Spot(0,0,4,20)}
                        )   ,



                    jo(go.TextBlock, "etwas Sinnvolles",
                            new go.Binding("text", "restInfo"),
                              {stroke:"white",
                            editable:true,
                            isMultiline:true,
                            width:380,
                            textAlign: "center",
                            font:"bold 18pt Segoe UI sans-serif",
                                  margin:new go.Margin(42,10,10,10),
                          alignment: new go.Spot(0,0.1,4,2)},

                        )  ),
                    jo(go.Shape, "RoundedRectangle",
                    {minSize: new go.Size(40, 50),
                        maxSize: new go.Size(730,NaN),
                        fill: "black",
                        margin:10,
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                    toSpot: go.Spot.LeftRightSides,fromSpot: go.Spot.TopBottomSides

                    }),



 //   ),//verti panel zu

                jo("Button",
                    { alignment: new go.Spot(1,0), scale:1},
                    jo(go.Shape, "PlusLine", { width: 20, height: 20 }),
                    { click: changeCategory }),



                jo("Button",
                          {
                            click: einblenden,
                              //alignment: new go.Spot(1, 0, 10, 10)
                          alignment: new go.Spot(1, 1,0,0),
                              scale:1,
                              margin:0
                          },
                          jo(go.Shape, "Circle",
                              {fill:"transparent",
                              alignment:go.Spot.Center,
                              maxSize:new go.Size(16,16)}),
                      ),
                    ),

            //Wieder ein Panel dessen Größe sich automatisch an die erste Shape anpasst
            jo(go.Panel, "Auto",
                //new go.Binding("location", "vorderLoc", go.Point.parse).makeTwoWay(go.Point.stringify),
                new go.Binding("visible", "vordergrund"),

                jo(go.Shape, "RoundedRectangle",
                    {minSize: new go.Size(40, 50),
                        maxSize: new go.Size(730,NaN),
                        fill: "green",
                        margin:10,
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                                                        toSpot: go.Spot.LeftRightSides,fromSpot: go.Spot.TopBottomSides

                    }),

                //Textblock in dem der Überbegriff gespeichert wird
                jo(go.TextBlock,        "Übergriff",
                    new go.Binding("text", "hauptInfo").makeTwoWay(),
                   // new go.Binding("font","schriftgrosseVorne").makeTwoWay(),

                   // new go.Binding("zOrder"), falls Elemente andere überdecken sollen
                    {minSize: new go.Size(20, 40),
                        name: "TEXT",
                        font:"bold 52pt Segoe UI sans-serif",

                        maxSize: new go.Size(700,NaN),
                        stroke:"white",
                        editable: true,
                        margin: 30},

                ),
                            jo("Button",
                    { alignment: new go.Spot(1,0), scale:1},
                    jo(go.Shape, "PlusLine", { width: 20, height: 20 }),
                    { click: changeCategory }),



                jo("Button",
                          {
                            click: einblenden,
                              //alignment: new go.Spot(1, 0, 10, 10)
                          alignment: new go.Spot(1, 1,0,0),
                              scale:1,
                              margin:0
                          },
                          jo(go.Shape, "Circle",
                              {fill:"transparent",
                              alignment:go.Spot.Center,
                              maxSize:new go.Size(16,16)}),
                      )




                ),


            ),           //Panel Hauptbegriff Ende



            ));

var templateMap = new go.Map();
templateMap.add("idea", idea);
templateMap.add("kommentar", faktum);
templateMap.add("simple", simpletemplate);
templateMap.add("allesSehen", allesSehen);
templateMap.add("helptemplate", helptemplate);
templateMap.add("answertemplate", answertemplate);
templateMap.add("logiktemplate", logiktemplate);

var grouMap = new go.Map();
grouMap.add("grouptemp", grouptemp);
grouMap.add("detailGruppe", detailGruppe);

neuesDiagramm.groupTemplateMap = grouMap;
//neuesDiagramm.groupTemplate =  neuesDiagramm.groupTemplateMap;
//neuesDiagramm.groupTemplateMap.add("grouptemp", grouptemp);

//neuesDiagramm.groupTemplateMap.add("detailGruppe", detailGruppe);

var linktemplateMap = new go.Map();
linktemplateMap.add("linkTem",linkTem);
linktemplateMap.add("lili",lili);


neuesDiagramm.nodeTemplateMap = templateMap;
neuesDiagramm.linkTemplateMap = linktemplateMap;
    //MUSS NOCH FUNKTIONALITÄT EINGEBAUT WERDEN:


    neuesDiagramm.nodeTemplateMap.get("helptemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Antwort?!"),
            { click: function(e, obj) {
                    var node = obj.part;
                    console.log("node.scale");
                    console.log(node.data.category);

                    neuesDiagramm.startTransaction("Beantworten");
                    let check = true;
            if(node.data.category == "answertemplate"){neuesDiagramm.model.setCategoryForNodeData(node.data, "helptemplate");
                check= false;}

            else if(check){neuesDiagramm.model.setCategoryForNodeData(node.data, "answertemplate");}

                    neuesDiagramm.commitTransaction("Beantworten");
                    } }));

        neuesDiagramm.nodeTemplateMap.get("answertemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Antwort?!"),
            { click: function(e, obj) {
                    var node = obj.part;
                    console.log("node.scale");
                    console.log(node.data.category);

                    neuesDiagramm.startTransaction("Beantworten");
                    let check = true;
            if(node.data.category == "answertemplate"){neuesDiagramm.model.setCategoryForNodeData(node.data, "helptemplate");
                check= false;}

            else if(check){neuesDiagramm.model.setCategoryForNodeData(node.data, "answertemplate");}

                    neuesDiagramm.commitTransaction("Beantworten");
                    } }));




    console.log(neuesDiagramm.nodeTemplateMap.get("simple"));
    console.log(neuesDiagramm.nodeTemplateMap.first());
              neuesDiagramm.nodeTemplateMap.get("simple").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Bigger"),
            { click: function(e, obj) { newSizeChange(obj, 1.14); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Smaller"),
            { click: function(e, obj) { newSizeChange(obj, 0.9); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Bold/Normal"),
            { click: function(e, obj) { toggleTextWeight(obj); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Copy"),
            { click: function(e, obj) { e.diagram.commandHandler.copySelection(); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Delete"),
            { click: function(e, obj) { e.diagram.commandHandler.deleteSelection(); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Undo"),
            { click: function(e, obj) { e.diagram.commandHandler.undo(); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Redo"),
            { click: function(e, obj) { e.diagram.commandHandler.redo(); } }));
//Links
                neuesDiagramm.linkTemplateMap.get("linkTem").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Linkkategorie wechseln"),
            { click: function(e, obj) {
            let link = obj.part.data;
            neuesDiagramm.startTransaction("Linkkategorie wechseln");

            neuesDiagramm.model.setCategoryForLinkData(link,"lili");


            neuesDiagramm.commitTransaction("Linkkategorie wechseln");
            } }))   ;


                                neuesDiagramm.linkTemplateMap.get("lili").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Linkkategorie wechseln"),
            { click: function(e, obj) {
            let link = obj.part.data;
            neuesDiagramm.startTransaction("Linkkategorie wechseln");

            neuesDiagramm.model.setCategoryForLinkData(link,"linkTem");


            neuesDiagramm.commitTransaction("Linkkategorie wechseln");
            } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Logische Verknüpfung wechseln"),
            { click: function(e,obj){logik(e,obj)}}));

        neuesDiagramm.nodeTemplateMap.get("logiktemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Logische Relation ändern"),
            { click: function(e,obj){logik(e,obj)}}));



              //Hintergrund
                neuesDiagramm.contextMenu =
    jo("ContextMenu",


             jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Node"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { knotenfarbe: "green", hauptInfo: "mehr Info", scale:"1.0",scaleZu:"1.0",
                //restInfo:[{'mehr':[{'nochMehr':'beschreibung unterbegriff' }]},{'mehr':[{'nochMehr':'beschreibung unterbegriff'}]}],
                textfarbe:"white", hintergrund:false, vordergrund:true, category:"allesSehen",restInfo:"Definition oder Eigenschaften",
                info: [{ 'text': "Unterbegriff/Eigenschaft" , 'mehr':["mehr dazu"], 'c':1}]};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),

             jo("ContextMenuButton",
            jo(go.TextBlock, "Logische Verknüpfung"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var logiKnoten = {  category:"logiktemplate", visible:true, visand:true, visor:false,visiff:false,vispim:false,visimp:false,visall:false, visex:false};
        //
            d.model.addNodeData(logiKnoten);
            part = d.findPartForData(logiKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten')
            }}),



      jo("ContextMenuButton",
        jo(go.TextBlock, "Undo"),
        { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
        new go.Binding("visible", "", function(o) { return o.diagram.commandHandler.canUndo();}).ofObject()),
      jo("ContextMenuButton",
        jo(go.TextBlock, "Redo"),
        { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
        new go.Binding("visible", "", function(o) {
                                          return o.diagram.commandHandler.canRedo();
                                        }).ofObject()),
      // no binding, always visible button:
      jo("ContextMenuButton",
        jo(go.TextBlock, "Neue Unklarheit"),
        { click: function(e, obj) {
          e.diagram.commit(function(d) {
            var data = {frage:"Frage oder Unklarheit", antwort:"Eine ErklärungErklärungErklärungErklärungErklärung", category:"helptemplate", hauptInfo:"nicht leer", visible:true};
            d.model.addNodeData(data);
            part = d.findPartForData(data);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
          }, 'new node');
        } }),


        jo("ContextMenuButton",
            jo(go.TextBlock, "Neuer Kommentar"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = {  category:"kommentar",color:"yellow",text:"Ergänzend:",expand:false, klein: true};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),
        jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Idee"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = {  category:"idea",color:"green",text:"Geistesblitz!"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),

                                         jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Gruppe"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { category: "detailGruppe",isGroup:true, group:"", color:"yellow", visible:true, auf:true, zu:false,
                restInfo:"Definition oder Eigenschaften", textfarbe:"white",
                info: [{ 'text': "Unterbegriff/Eigenschaft" , 'mehr':["mehr dazu"], 'c':1}], knotenfarbe:"green"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neue Gruppe');}}));




        neuesDiagramm.nodeTemplateMap.get("allesSehen").contextMenu=
            jo("ContextMenu",
              jo("ContextMenuButton",
                jo(go.TextBlock, "Bigger"),
                { click: function(e, obj) { newSizeChange(obj, 1.11); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Smaller"),
                { click: function(e, obj) { newSizeChange(obj, 0.92); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Copy"),
                { click: function(e, obj) { e.diagram.commandHandler.copySelection(); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Undo"),
                { click: function(e, obj) { e.diagram.commandHandler.undo(); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Keine Gruppe"),
                { click: function(e, obj) { e.diagram.commandHandler.redo(); } }),
                            jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") } });

}

function checkDuplicates(inx) {
    let indizes =  [];
    neuesDiagramm.nodes.each( function(e) {
        indizes.push(e.data.key);
    });
    for(i=0; i<indizes.length; i++) {
    if (indizes[i] == inx) {
        return false;
    }
    else {return true;}
    }
}

function check(element, inx) {
    if(inx == element) {
    return false}
    else return true;
}

/*

Vielleicht besser den View hiermit zu zentralisieren
function onSelectionChanged(e) {
    var node = e.diagram.selection.first();
    if (node instanceof go.Node) {
    } else {
    }
}

 */
//Erstellt beim Doppelklick einers Knotens einen neuen, der  mit dem geklickten verbunden ist

function nodeDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
      var ersterKnoten = clicked.data;
      neuesDiagramm.startTransaction("add infoblock");
      var neuerKnoten = { hauptInfo: "Etwas Neues", key:ersterKnoten.key+1, restInfo:"mehr dazu",definition:"Erstmal Definieren.", hintergrund:true, vordergrund:false, category: "allesSehen",             info: [
              { text: "Unterbegriff/Eigenschaft" , mehr:["mehr dazu"], c:1},
            ]};
      neuesDiagramm.model.addNodeData(neuerKnoten);
      neuesDiagramm.model.addLinkData({ from: ersterKnoten.key, to: neuerKnoten.key });
      neuesDiagramm.commitTransaction("add infoblock");
    }
    }




//Lässt das Linklabel eines Links unsichtbar werden
function linkDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
        var thislink = clicked.data;
    }

    //Kann nötig werden direkt auf die Positionen zuzugreifen
    //console.log(Math.abs(neuesDiagramm.findNodeForKey(thislink.from).dg.x-neuesDiagramm.findNodeForKey(thislink.to).dg.x));

    neuesDiagramm.startTransaction("changeLink");

    if (thislink.visible == false) {
        neuesDiagramm.model.setDataProperty(thislink, "visible", true);
    } else {
        neuesDiagramm.model.setDataProperty(thislink, "visible", false);
    }
    neuesDiagramm.commitTransaction("changeLink");

}

//Funktion die Hinter- und Vordergrund jeweils ein- oder ausblendet
    function einblenden(e, obj) {
        var node = obj.part;
        var data = node.data;

        neuesDiagramm.startTransaction("neue Sicht");

         if (data.vordergrund == false) {
            neuesDiagramm.model.setDataProperty(data, "hintergrund", false);
            neuesDiagramm.model.setDataProperty(data, "vordergrund", true);
        } else if (data.vordergrund == true) {
            neuesDiagramm.model.setDataProperty(data, "hintergrund", true);
            neuesDiagramm.model.setDataProperty(data, "vordergrund", false);
        }
        else if (!data.vordergrund) {
            neuesDiagramm.model.setDataProperty(data, "vordergrund", true);
            neuesDiagramm.model.setDataProperty(data, "hintergrund", false);

        }
        neuesDiagramm.commitTransaction("neue Sicht");

    }

//Der Inspektor wird in einem eigenen Div initialisiert und ermöglicht außerhalb des Diagramms Änderungen an
// Eigenschaften von Knoten/Links vorzunehmen
    function inspectore() {
    var inspector = new Inspector('derInspektor', neuesDiagramm,
        {
          // allows for multiple nodes to be inspected at once
          multipleSelection: true,
          // max number of node properties will be shown when multiple selection is true
          showSize: 4,
          // when multipleSelection is true, when showAllProperties is true it takes the union of properties
          // otherwise it takes the intersection of properties
          //showAllProperties: false,
          // uncomment this line to only inspect the named properties below instead of all properties on each object:
          includesOwnProperties: false,
          properties: {
              //Key sollte unveränderbar bleiben
            // "key": { readOnly: true, show: Inspector.showIfPresent },
            //TODO: Color Picker soll hier noch angezeigt werden!
              "color": { show: Inspector.showIfPresent, type: 'color' },
              "knotenfarbe": { show: Inspector.showIfPresent, type: 'color' },
              "textfarbe": { show: Inspector.showIfPresent, type: 'color' },


            // Comments and LinkComments are not in any node or link data (yet), so we add them here:
           // "Comments": { show: Inspector.showIfNode },
           // "LinkComments": { show: Inspector.showIfLink },

              //Kann später für Gruppenfunktion gebraucht werden
            /*"isGroup": { readOnly: true, show: Inspector.showIfPresent },
            "flag": { show: Inspector.showIfNode, type: 'checkbox' },
            "state": {
              show: Inspector.showIfNode,
              type: "select",
              choices: function(node, propName) {
                if (Array.isArray(node.data.choices)) return node.data.choices;
                return ["one", "two", "three", "four", "five"];
              }
            }, */
          }
        });



}
//Eine Funktion um Zugriff auf die Location der node zu haben
 function locator() {
        return [
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            locationSpot: go.Spot.Center
          }
        ];
      }

    function newSizeChange( obj, sz) {
    var node = obj.part;

    console.log("node.scale");
    console.log(node.data.scaleZu);
    if (node.data.scale ){

        neuesDiagramm.startTransaction("Change Text Size");
        if(node.data.category == "allesSehen") {
            let neuScale = parseFloat(node.data.scale) * sz;
            if (node.data.scale > 22) {
                alert("Maximalgröße erreicht");
                node.data.scale = 22.0
            }
            ;
            neuScale = neuScale.toString();
            console.log(node.data.scale);


        neuesDiagramm.model.setDataProperty(node.data, "scale", neuScale);


        }
        else if (node.data.category == "simple") {

            let neuScale = parseFloat(node.data.scaleZu) * sz;

            if (node.data.scaleZu > 22) {
                alert("Maximalgröße erreicht");
                node.data.scaleZu = 22.0
            }
            ;

            neuesDiagramm.model.setDataProperty(node.data, "scaleZu", neuScale);


        }
        neuesDiagramm.commitTransaction("Change Text Size");

    }


    }



        /*

        node.diagram.startTransaction("Change Scale");
        let itemz = node.adornedPart.findObject("MEHR").scale+0.4;
        console.log("scale < 22");
        node.diagram.commitTransaction("Change Scale"); }


    console.log(node.scale);
    if(node.adornedPart.Hb) {
    console.log(node.adornedPart.Hb); }
    node.adornedPart.Bh.hb.category="simple";
    }
*/


      //Funktion um die Textgröße mit dem Contextmanager ändern zu können
    function changeTextSize(obj, sz) {
      var nodeData = obj.part;
      nodeData.diagram.startTransaction("Change Text Size");
      var node = nodeData.adornedPart;
      var tb = node.findObject("TEXT");
      console.log("tb.scale");
      console.log(tb.scale);
      //HÄNGT VON FONT DEFINITION in Stringform ab!!
      let txtsz = parseInt(tb.font.slice(5,7));
      txtsz+=sz;

      if (txtsz < 10) {txtsz=10;}
      else if (txtsz>99) {txtsz=99; alert("Die Textgröße ist bei 99 gedeckelt!");}

      tb.font = "bold "+txtsz+"pt Segoe UI sans-serif";

      nodeData.diagram.commitTransaction("Change Text Size");
    }



      // the Search functionality highlights all of the nodes that have at least one data property match a RegExp
    var counter =1;
    var suchmenge = 0;
    var wiederholKoordinaten =[];
    var letzteSuche ="quatsch";
    var knotenKeys = [];
    var anders = 0;
    var letzteVer = false;
    if (!wiederholKoordinaten) {wiederholKoordinaten}
    function suchFunktion() {  // called by button

        var input = document.getElementById("diaSuche");
        if (!input) return;
        if (input) {
            input.focus();

            //es wird nach einem "neuen" Begriff gesucht
            if (letzteSuche != input.value) {

                //aus dem Suchbegriff wird eine großschreibungsindifferente Regex gemacht
                var regex = new RegExp(input.value, "i");

                neuesDiagramm.startTransaction("highlight search");
                unterErgebnisse = neuesDiagramm.findNodesByExample(
                    {restInfo: regex});
                uberErgebnisse = neuesDiagramm.findNodesByExample(
                    {hauptInfo: regex});

                //ein Array wird angelegt um die Koordinaten zu speichern
                var coord = [];
                console.log("uberErgebnisse.count");
                console.log(uberErgebnisse.count);
                suchmenge = uberErgebnisse.count;
                if (uberErgebnisse.first() != null) {
                    uberErgebnisse.each(function (x) {
                        coord.push(x.actualBounds);
                    })
                }

                if (unterErgebnisse.first()) {
                    unterErgebnisse.each(function (x) {
                        coord.push(x.actualBounds);
                        knotenKeys.push(x.key);

                    })
                }

                if (coord.length != 0){

                anzahlHaupttreffer = uberErgebnisse.count;
                //counter++;
                //console.log(resultes.sg.Fb);
                console.log(coord);
                wiederholKoordinaten = coord;
                neuesDiagramm.centerRect(coord[0]); }
                letzteSuche = input.value;
                counter = 1;


                //Wird ein Suchbegriff wiederholt gesucht
            } else if (input.value == letzteSuche && wiederholKoordinaten.length > 1) {
//                console.log("array eintrag coord von counter " + counter + coord[counter]);
                if (letzteVer) {
                    console.log("letzte Veränderung wahrgenommen!");
                    let node = neuesDiagramm.findNodeForKey(anders);
                    console.log(node.data);
                    e = "unnütz";
                    if (node != undefined) {
                        neuesDiagramm.model.setDataProperty(node.data, "vordergrund", true);
                        //einblenden(e, node);
                    }
                anders = 0;
                    letzteVer=false;
                }

                //können die Koordinaten weiterverwendet werden
                coord = wiederholKoordinaten;

                if (counter>= coord.length ){
                    counter = 0;
                }
                console.log("suchmenge");
                console.log(suchmenge);

                if(counter- suchmenge >= 0) {
                    console.log("suchmenge: " + suchmenge + " counter: " + counter);
                    console.log("knotenKeys: ");
                    console.log(knotenKeys);
                    let gesuchterKnoten = neuesDiagramm.findNodeForKey(knotenKeys[counter-suchmenge]);
                        neuesDiagramm.startTransaction("einblenden");
                    if (gesuchterKnoten.data.vordergrund){
                        console.log("gesuchterKnoten");
                        e = "unnütz";
                        //einblenden(e,gesuchterKnoten);
                        letzteVer = true;
                        anders = knotenKeys[counter-suchmenge];
                      //  gesuchterKnoten.data.vordergrund=false;
                       // gesuchterKnoten.data.hintergrund=true;
//                    if (gesuchterKnoten.data.vordergrund == false){ gesuchterKnoten.data.hintergrund=true;
   //                     gesuchterKnoten.data.vordergrund = false;
                    console.log("gesuchterKnoten verändert: " );
                    console.log(gesuchterKnoten)}
                        neuesDiagramm.commitTransaction("einblenden");

                }



                }


                //der Fokus des Diagramms wird bei jeder neuen Suche auf einem weiteren Suchergebnis platziert
                neuesDiagramm.centerRect(coord[counter]);
                neuesDiagramm.scale = 0.9;



                // search four different data properties for the string, any of which may match for success
                // create a case insensitive RegExp from what the user typed

                //console.log("counter " + counter + " coord length: " + wiederholKoordinaten.length);

                coord = wiederholKoordinaten;
                counter++;

                console.log("counter am Ende: "  + counter);
                console.log("letzte veränderung: " + letzteVer);
                console.log("anders ende: " + anders);

            } else {  // empty string only clears highlighteds collection
                neuesDiagramm.clearHighlighteds();
            }


            neuesDiagramm.commitTransaction("highlight search");


        }






      /*
      if (!input) return;
      //input.focus();

      neuesDiagramm.startTransaction("highlight search");
        console.log(input.value);
      if (input.value) {
          // search four different data properties for the string, any of which may match for success
          // create a case insensitive RegExp from what the user typed
          var regex = new RegExp(input.value, "i");
          var results = neuesDiagramm.findNodesByExample({restInfo: regex},
              {hauptInfo: regex});
          var linkResults    = neuesDiagramm.findLinksByExample(
              {description: regex});


          console.log("results.first()");
          console.log(results.first());

          console.log("results.next()");
          console.log(results.next());

          neuesDiagramm.highlightCollection(results);


          //if (results.first().restInfo.match(regex)) {console.log("ganz komisch");}
          // try to center the diagram at the first node that was found
          //console.log(results.bc.cc[0]);
          //ist der Eintrag von dem ersten Überbegriff der gesucht wurde
          //console.log(results.la.value.hb.hauptInfo);


                     if(results) {


                         console.log("results anfang");
                         console.log(results.first());
                         console.log(linkResults);

                         //console.log(results.first().value);
                         console.log("nächstes linkResults ");
                         results.next();
                         console.log(results.value);
                         console.log("results.each ende");

                     }


          for (element in linkResults){
              console.log(element);
              for(el in element){
              }
          }


        if (linkResults.count > 0) {
            console.log("results.first().actualBounds)");
            console.log(linkResults.first().actualBounds);
            neuesDiagramm.centerRect(linkResults.first().getLocalPoint);
            }


      } else {  // empty string only clears highlighteds collection
        neuesDiagramm.clearHighlighteds();
      }


      neuesDiagramm.commitTransaction("highlight search");
    }

       */


      function neuerUntereintrag(e, obj) {
          /* var tb = node.findObject("MEHR");
          if(tb) {
              console.log(tb);
              console.log(node);
              console.log(textSize);
      }
          neuesDiagramm.insertArrayItem(tb.items, -1, "mehr dazu" );

           */
        console.log(obj.part);

        let was = obj.part.findObject("MEHR");
        console.log(obj.part.data.items);
        console.log(was);


      }

        function changeCategory(e, obj) {
    var node = obj.part;
    if (node) {
      var diagram = node.diagram;
      diagram.startTransaction("changeCategory");
      var cat = diagram.model.getCategoryForNodeData(node.data);
      if (cat === "allesSehen")
        cat = "simple";
      else
        cat = "allesSehen";
      diagram.model.setCategoryForNodeData(node.data, cat);
      diagram.commitTransaction("changeCategory");
    }
  }





       function machNeuenUntereintrag(e, obj) {


                        node = obj.part;
                        console.log("aktuelle info ist: ");

                        console.log(node.data);
                        //console.log(obj.part.data);
                        neuesDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.info) {
                            let neu = {'mehr': [{'text': 'Mehr dazu...'}]};
                            let neuU = {
                                text: 'Neue Eigenschaft/Überbegriff',
                                mehr: ["schön viele Einträge"],
                                c: node.data.info.length
                            };

                            console.log("node.data.info[0]: ");
                            console.log(typeof(node.data.info));


                            let array_index = node.data.info.length;

                            console.log(array_index);


                            //let zwischen;
                            let zwischen = node.data.info;


                            //zwischen.push(neuU);

                            let ez = Object.assign(zwischen, neuU);

                            console.log("zwischen: ");
                            console.log(zwischen);

                            neuesDiagramm.model.startTransaction("neuInfo");

                            neuesDiagramm.model.addArrayItem(node.data.info, neuU);
                            console.log("der key  hier ist: ");
                            console.log(node.data.key);
                            console.log("neuer eintrag hier ist: ");
                            console.log(neuU);
                            //neuesDiagramm.model.add(node.data, "info", ez);
                            neuesDiagramm.commitTransaction("neuInfo");
                            //neuesDiagramm.model.insertArrayItem(node.data.restInfo, node.data.restInfo.length, neu);
                            neuesDiagramm.model.commitTransaction("neuer UBText");
                            console.log(obj.part.data.info);
                        }

                  }

/*
  function untenDurchEintrag(e, obj) {
 alert(c);}
  */
           /*

              var node = obj.part;
    var data = node.data;
    if (data.info.length > 1 && data.info[data.info.length-1] ) {
        let eintraege = data.info[data.info.length].c-1;
      node.diagram.model.commit(function(m) {
          m.addArrayItem(data.info[data.info[eintraege]])

          m.set(d, "clickCount", data.clickCount + 1);
      }, "clicked");
    }
  }


            */

        var umstaendlichundalt = [];

        var umstaendlich = [];
        var umstandsnummer = 0;

           function printC(num){
                umstandsnummer = num;
               if (num  > umstaendlich.length ) umstaendlich.push(num);
           }


function zentrierAlles(e,obj){
               neuesDiagramm.centerRect(new go.Rect(e.documentPoint.x+0,e.documentPoint.y+100, 0,0));
               console.log(obj.part.data.info);
               neuesDiagramm.scale=0.8;

}

           function cEintrag(e,obj) {
               if(obj) {
                   console.log("wenigstens e  " + e.documentPoint.x);
                   console.log("wenigstens e  " + e.targetObject.toString());
                   console.log("function c eintrag hat : obj, umstaendlich: ");
                   console.log(obj.panel);
                   console.log(obj);
                   neuesDiagramm.centerRect(new go.Rect(e.documentPoint.x+400,e.documentPoint.y, 0,200));
                   console.log(neuesDiagramm.scale);
                   neuesDiagramm.scale=1.1;
                   console.log(obj.panel.measuredBounds);
                   console.log(umstaendlich);
                   if(umstaendlich > umstaendlichundalt && umstaendlichundalt){
                        return obj.part.data.info[umstaendlichundalt.length].mehr.text}
                   console.log(obj.part.data);
                   umstaendlichundalt = umstaendlich;

                   if(umstaendlich.length < 0) {
                   return obj.part.data.info[umstaendlichundalt].mehr.text;}
               }
           else {
                console.log("hier returnen wir nix " + e +"  num: "+ num);

                return console.log("obj von c eintrag war nicht definiert");}}



function frageEinAusblenden(e, obj) {

               e.diagram.commit(function(d) {
                   neuesDiagramm.model.setDataProperty(obj.part.data, "visible", !obj.part.data.visible);


               })};


           function logik( e,obj) {
               var node = obj.part.data;
               if(node.visand == true ) {
                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visand", false);
                   neuesDiagramm.model.setDataProperty(node, "visor", true);

                   neuesDiagramm.commitTransaction("Logikänderung");
               }
               else if (node.visor == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visor", false);
                   neuesDiagramm.model.setDataProperty(node, "visimp", true);

                   neuesDiagramm.commitTransaction("Logikänderung");

               }

               else if (node.visimp == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visimp", false);
                   neuesDiagramm.model.setDataProperty(node, "visiff", true);

                   neuesDiagramm.commitTransaction("Logikänderung");

               }


               else if (node.visiff == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visiff", false);
                   neuesDiagramm.model.setDataProperty(node, "vispim", true);

                   neuesDiagramm.commitTransaction("Logikänderung");

               }

                              else if (node.vispim == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "vispim", false);
                   neuesDiagramm.model.setDataProperty(node, "visex", true);

                   neuesDiagramm.commitTransaction("Logikänderung");

               }
                  else if (node.visex == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visex", false);
                   neuesDiagramm.model.setDataProperty(node, "visall", true);

                   neuesDiagramm.commitTransaction("Logikänderung");}

                  else if (node.visall == true ){

                   neuesDiagramm.startTransaction("Logikänderung");

                   neuesDiagramm.model.setDataProperty(node, "visall", false);
                   neuesDiagramm.model.setDataProperty(node, "visand", true);

                   neuesDiagramm.commitTransaction("Logikänderung");}

           };
