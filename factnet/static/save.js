var jo = go.GraphObject.make;
var model_id;
var current_url;
var neuesDiagramm;

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
    let indicator =document.getElementById('mainDiagram');
    let tst = window.getComputedStyle(indicator, null).getPropertyValue('visibility');
    sendModelName();
    neuesDiagramm= make_dia();
    style_dia();
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

    };


//Erstellt aus dem Div Element ein neues Diagramm,

function make_dia() {
    neuesDiagramm = jo(go.Diagram, "mainDiagram", {
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(25, 25),

        "commandHandler.copiesParentKey": true,


            "undoManager.isEnabled": true,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
//beim Doppelclick in den Hintergrund wird ein neuer Knoten erstellt
            "clickCreatingTool.archetypeNodeData": { hauptInfo: "mehr Info", restInfo:"mehr dazu", hintergrund:true, vordergrund:false,
            //"clickCreatingTool.isGridSnapEnabled":true
            }
          });
// Addons für Bewegliche Linkbeschreibungen und Zoom
            neuesDiagramm.toolManager.mouseMoveTools.insertAt(0, new LinkLabelOnPathDraggingTool());
            neuesDiagramm.toolManager.mouseMoveTools.insertAt(1, new DragZoomingTool());

//Zentriert ausgewähltes Element
            neuesDiagramm.addDiagramListener("ChangedSelection", function(e) {
                //var part = e.subject;
                //console.log(part);
                //console.log(neuesDiagramm.lastInput.documentPoint.x);
                neuesDiagramm.centerRect(new go.Rect(neuesDiagramm.lastInput.documentPoint.x,neuesDiagramm.lastInput.documentPoint.y,0,0));
                });

//Diagrammlistener der bei Änderungen die Speicherfunktion ermöglicht TODO:Listener alle 34 Sekunden Autospeichern lassen
neuesDiagramm.addDiagramListener("Modified", function(e) {
    var button = document.getElementById("savior");
    if (button) button.disabled = !neuesDiagramm.isModified;
    var idx = document.title.indexOf("*");
    if (neuesDiagramm.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.slice(0, idx);
    }});

//Gibt Inhalt des geladenen Models in der Konsole aus
//    console.log("neuesDiagramm.model");
//    console.log(neuesDiagramm.model);


    neuesDiagramm.model = new go.GraphLinksModel([], []); //Modelinitialisierung

//Möglich, dass das nicht unnütz ist:
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
    neuesDiagramm.model.addNodeData({hauptInfo:toAdd, vordergrund: true, hintergrund:false, restInfo:"mehr dazu"});
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
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);


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

    //Definiert das Linkaussehen und Verhalten

        neuesDiagramm.linkTemplate =
            jo(go.Link,

                //Speichert die veränderbare Linkform
                new go.Binding("points").makeTwoWay(),

                    //Link doppelklicken blendet das Beschreibungsfeld aus
                    {doubleClick: linkDoubleClick,
                    toShortLength: 8,
                    fromShortLength:8,
                    //routing: go. Link.AvoidsNodes,
                    reshapable: true,
                    //TODO: rausfinden wie die Segmente begrenzt werden können!
                    //Bisher entsteht für jede Positionsveränderung ein neues Segment und Punkt im Array
                    resegmentable: true,
                    //curve: go.Link.Bezier,
                       // curviness:200,
                    //routing: go. Link.AvoidsNodes,
                    //corner:10,
                    //corner: 220,
                    relinkableFrom: true, relinkableTo: true},

                //unsichtbare Form die das Klicken auf den Link erleichtert
                jo(go.Shape, { isPanelMain: true, stroke: "transparent", strokeWidth: 30 }),

               //der tatsächliche Link
                jo(go.Shape,
                    {
                        opacity: 0.8,
                        isPanelMain: true,
                        strokeWidth: 10,
                        stroke: "#F5F5F5",
                    }),
                //die Pfeilspitze
                jo(go.Shape,
                    { strokeWidth: 2, toArrow: "NormalArrow", fill: 'green', stroke: 'white', scale: 2}),
                //das Pfeilende
                jo(go.Shape,
                    { strokeWidth: 2, fromArrow: "PentagonArrow", fill: 'white', stroke: 'green', scale: 1.4}),

                // das Panel in dem sich der Textblock befindet, verschiebbar gemacht und anfangs in der Mitte
                jo(go.Panel, "Auto",
                    { _isLinkLabel: true, segmentIndex: NaN, segmentFraction: .5 },
                    new go.Binding("segmentFraction").makeTwoWay(),
                    new go.Binding("visible"),
                    new go.Binding("background"),

                    //  {segmentOrientation: go.Link.OrientUpright}, lässt LinkLabel orthogonal zum Link ausgerichtet sein
                    jo(go.Shape, "RoundedRectangle",
                        {
                            visible: true
                        }),
                // der eigentliche Text - über SegmentFraction verschiebbar
                    jo(go.Panel, "Auto",
                        jo(go.TextBlock, "Link doppelt klicken \n lässt mich verschwinden!",
                            new go.Binding("text", "description").makeTwoWay(),
                            new go.Binding("segmentFraction").makeTwoWay(),
                            {
                                maxSize:new go.Size(222,NaN),
                                //Versuch eine dynamische Größe beim Zoomen oder Vergrößern zu realisieren - geht noch nicht
                                //new go.Size(Math.abs(neuesDiagramm.findNodeForKey(from).dg.x-neuesDiagramm.findNodeForKey(to).dg.x), NaN),
                                isMultiline: true,
                                row: 0, column: 0, columnSpan: 5,
                                font: "bold 10pt Segoe UI sans-serif",
                                visible: true,
                                editable: true,
                                minSize: new go.Size(10, 16),
                                background: "#000000",
                                opacity: 0.9, stroke: "#F5F5F5",
                            }),



)));


//Das Template für einen Knoten
neuesDiagramm.nodeTemplate =
        jo(go.Node, "Position",
            { selectionObjectName: "TEXT" },
            locator(),
         //   new go.Binding("scale", "grosse").makeTwoWay(),
            {
            //Doppelklicken auf den Knoten erstellt einen neuen damit verbundenen
            doubleClick: nodeDoubleClick,
            fromSpot: go.Spot.Center, toSpot: go.Spot.Center
},

            jo(go.Panel, "Auto",

                //Platzhalter für alle Ebenen der Node
                jo(go.Shape, "Rectangle",
                {
                    fill: "transparent",
                    stroke: "transparent"
                }),


            //Panel das die Node in 2. Ebene repräsentiert und Positionierung erlaubt
                jo(go.Panel, "Spot",
                    new go.Binding("visible", "vordergrund"),

            //Panel für den Hintergrundtext, passt die Größe automatisch an
                    jo(go.Panel, "Auto",

                        jo(go.Shape, "RoundedRectangle",
                            {minSize: new go.Size(66, 77),
                                maxSize: new go.Size(290,NaN),
                                fill: "black",
                                portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                                fromSpot: go.Spot.AllSides
                            }),
                        jo(go.TextBlock, //"Platz für mehr Text",
                            new go.Binding("text", "restInfo").makeTwoWay(),
                            {   maxSize: new go.Size(260,NaN),
                                font: "bold 14pt Segoe UI sans-serif",
                               //overflow: go.TextBlock.OverflowClip,
                                //wrap:go.TextBlock.WrapFit,
                               //stroke: "white",
                                margin: 10,
                                editable: true,
                                background: "black",
                                stroke:"white"
                            }
                            )),

                    //Panel das einen Button außerhalb der Node platzieren kann
                    jo(go.Panel, "Spot",
                        {
                            alignment: new go.Spot(1, 1,-14,-14)
                        },
                        //definiert was der Minusbutton können soll & die Position
                      jo("Button",
                          {
                              click: einblenden, //wechselt zwischen Vorder- und Hintergrundansicht
                              alignment: new go.Spot(0.5, 0,0,0),
                              scale:2,
                              margin:0
                          },
                          jo(go.Shape, "MinusLine",
                              {fill:"transparent",
                              alignment:new go.Spot(1, 0,0,0),
                              maxSize:new go.Size(6,6)}),
                    )
                )
                )
                ,

            //Panel hält den Text der im Vordergrund steht
            jo(go.Panel, "Spot",
                //Binding für den Sichtbarkeitswert
                new go.Binding("visible", "hintergrund"),
                //new go.Binding("scale", "grosseVorn").makeTwoWay(),

                {position:new go.Point (0,0)},

            //Wieder ein Panel dessen Größe sich automatisch an die erste Shape anpasst
            jo(go.Panel, "Auto",
                //new go.Binding("location", "vorderLoc", go.Point.parse).makeTwoWay(go.Point.stringify),

                jo(go.Shape, "RoundedRectangle",
                    {minSize: new go.Size(40, 50),
                        maxSize: new go.Size(NaN,NaN),
                        fill: "green",
                        margin:0,
                    portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
                                                        fromSpot: go.Spot.AllSides

                    }),

                //Textblock in dem der Überbegriff gespeichert wird
                jo(go.TextBlock,        "Übergriff",
                    new go.Binding("text", "hauptInfo").makeTwoWay(),
                    new go.Binding("font","schriftgrosseVorne").makeTwoWay(),

                   // new go.Binding("zOrder"), falls Elemente andere überdecken sollen
                    {minSize: new go.Size(20, 40),
                        name: "TEXT",
                        font: "bold 18pt Segoe UI sans-serif",
                        maxSize: new go.Size(NaN,NaN),
                        stroke:"white",
                        editable: true,
                        margin: 20},

                ),
            ),
                //Panel für den Expandierbutton
                jo(go.Panel, "Spot",
                        { alignment: new go.Spot(1, 1)},
                      jo("Button",
                          { background:"pink",
                            click: einblenden,
                              //alignment: new go.Spot(1, 0, 10, 10)
                          alignment: new go.Spot(0.5, 0,0,0),
                              scale:2,
                              margin:0
                          },
                          jo(go.Shape, "PlusLine",
                              {fill:"transparent",
                              alignment:new go.Spot(1, 0,0,0),
                              maxSize:new go.Size(6,6)}),
                      )
                ))));


    //MUSS NOCH FUNKTIONALITÄT EINGEBAUT WERDEN:
              neuesDiagramm.nodeTemplate.contextMenu =
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Bigger"),
            { click: function(e, obj) { changeTextSize(obj, 3); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Smaller"),
            { click: function(e, obj) { changeTextSize(obj, -2); } }),
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
            { click: function(e, obj) { e.diagram.commandHandler.redo(); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Layout"),
            {
              click: function(e, obj) {
                    alert("bald gibts eine gruppenfunktion!");
              }
            }
          )
        );
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
      var neuerKnoten = { hauptInfo: "Etwas Neues", key:ersterKnoten.key+1, restInfo:"mehr dazu", hintergrund:true, vordergrund:false};
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

            console.log(!data.vordergrund);
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
          showAllProperties: true,
          // uncomment this line to only inspect the named properties below instead of all properties on each object:
          // includesOwnProperties: false,
          properties: {
              //Key sollte unveränderbar bleiben
              "key": { readOnly: true, show: Inspector.showIfPresent },
            //TODO: Color Picker soll hier noch angezeigt werden!
              "color": { show: Inspector.showIfPresent, type: 'color' },
            // Comments and LinkComments are not in any node or link data (yet), so we add them here:
            "Comments": { show: Inspector.showIfNode },
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

      //Funktion um die Textgröße mit dem Contextmanager ändern zu können
    function changeTextSize(obj, sz) {
      var textSize = obj.part;
      textSize.diagram.startTransaction("Change Text Size");
      var node = textSize.adornedPart;
      var tb = node.findObject("TEXT");

      //HÄNGT VON FONT DEFINITION in Stringform ab!!
      let txtsz = parseInt(tb.font.slice(5,7));
      txtsz+=sz;
      if (txtsz < 10) {txtsz=10;}
      else if (txtsz>99) {txtsz=99; alert("Die Textgröße ist bei 99 gedeckelt!");}

      tb.font = "bold "+txtsz+"pt Segoe UI sans-serif";

      textSize.diagram.commitTransaction("Change Text Size");
    }