var jo = go.GraphObject.make;
var model_id;
var current_url;
var neuesDiagramm;
var modelCenter =[0.0,0.0];
var wiederholung;

if(document.getElementById("Zentrum")){
    modelCenter[0]=document.getElementById("Zentrum").value;
}

//die nächsten beiden Funktionen autospeichert alle 30s falls Änderungen registriert wurden
function autoSpeichern() {
        setTimeout(timeoutProblem, 30000);
}

//Umgeht ein Problem mit setTimeout, speichert nach 30 Sekunden
function timeoutProblem() {
    autoSpeichern();
    if (neuesDiagramm.isModified) {sendData();}
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

//Geht abhängig von Browser und Betriebssystem
if (document.getElementById('derTitel')) {
    var modellTitel = document.getElementById("derTitel");
    modellTitel.addEventListener("keyup", function (event) {
        if (event.keyCode != undefined) {
            if (event.keyCode === 13) {
                unhide();
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

    }


//Erstellt aus dem Div Element ein neues Diagramm,

function make_dia() {
    neuesDiagramm = jo(go.Diagram, "mainDiagram",

        {
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(25, 25),
         "undoManager.isEnabled": true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            //beim Doppelclick in den Hintergrund wird ein neuer Knoten erstellt
            //  "clickCreatingTool.archetypeNodeData": neuerKnoten,

        //zentriert das Diagramm anfangs auf den Mittelpunkt aller Koordinaten (x Korrektur da Koordinaten links oben gemessen werden)
        initialPosition: new go.Point(parseFloat(modelCenter[0])-960,parseFloat(modelCenter[1])),
        scale:0.2,


          });


// Addons für Bewegliche Linkbeschreibungen und Zoom
            neuesDiagramm.toolManager.mouseMoveTools.insertAt(0, new LinkLabelOnPathDraggingTool());

//Auf manche Diagrammtools muss sehr umständlich zugegriffen werden...

        neuesDiagramm.toolManager.mouseUpTools.each(function(e){
    if (e.Ra == "TextEditing"){
               neuesDiagramm.model.startTransaction("textbearbeitung");


       neuesDiagramm.model.commitTransaction("textbearbeitung");


    }});
   neuesDiagramm.toolManager.mouseUpTools.each(function(e){
       console.log("e");
       console.log(e.Ra);
        if(e.Ra == "TextEditing") {
            neuesDiagramm.model.startTransaction("");
            console.log("e.defaultTextEditor.accept");

            neuesDiagramm.model.commitTransaction("");

        }});

   //Ermöglicht die Größenveränderung von Gruppen
    let geoReshape = new GeometryReshapingTool();

    neuesDiagramm.toolManager.mouseDownTools.insertAt(3, geoReshape);

    neuesDiagramm.toolManager.mouseDownTools.each(function(e){
        if(e.Ra == "GeometryReshaping") {
            neuesDiagramm.model.startTransaction("adornment");
            neuesDiagramm.toolManager.resizingTool.maxSize = new go.Size(100000,100000);
            neuesDiagramm.toolManager.resizingTool.minSize = new go.Size(200,200);
            neuesDiagramm.toolManager.linkReshapingTool.handleArchetype =
                jo(go.Shape, "RoundedRectangle",
                  { width: 16, height: 16, fill: "dodgerblue",
                  stroke:"transparent", strokeWidth:40 });
                  neuesDiagramm.toolManager.linkReshapingTool.midHandleArchetype =
                jo(go.Shape, "RoundedRectangle",
                  { width: 16, height: 16, fill: "white",
                  stroke:"transparent", strokeWidth:40 });
                    neuesDiagramm.toolManager.resizingTool.handleArchetype =
                jo(go.Panel, "Auto",
                  jo(go.Shape, "RoundedRectangle",
                    { name: "", fill: "dodgerblue", stroke: "transparent", strokeWidth:66,
                        margin:-10,
                        minSize:new go.Size(32,32),
                        maxSize:new go.Size(64,64),}));

//            console.log(e.handleArchetype.Rn.width = 40);
    neuesDiagramm.model.commitTransaction("adornment");}
    });

    neuesDiagramm.scrollMode = go.Diagram.InfiniteScroll;
    neuesDiagramm.toolManager.dragSelectingTool.isPartialInclusion = true;
    neuesDiagramm.toolManager.dragSelectingTool.box =
    jo(go.Part,
      { layerName: "Tool" },
      jo(go.Shape, "RoundedRectangle",
        { name: "SHAPE", fill: null, stroke: "white", strokeWidth: 8 })
    );

//Zentriert ausgewähltes Element
    neuesDiagramm.addDiagramListener("LinkDrawn", function(e) {
        var part = e.subject;

        neuesDiagramm.startTransaction("gibt Link Farbe");
        neuesDiagramm.model.setCategoryForLinkData(part.data,"linkTem");
        neuesDiagramm.model.setDataProperty(part.data,"color", "green");
        neuesDiagramm.model.setDataProperty(part.data,"scale", "1.0");
        //neuesDiagramm.model.setDataProperty(part.data,"linkbreite", "1.0");
        neuesDiagramm.model.setDataProperty(part.data,"linklabel", true);
        //neuesDiagramm.model.setDataProperty(part.data,"linkbreite", "30.0");

        neuesDiagramm.commitTransaction("gibt Link Farbe");
        console.log(part.data.color);


    });

      neuesDiagramm.commandHandler.archetypeGroupData =
    { isGroup: true, color: "blue" };


    //Diagrammlistener der bei Änderungen die Speicherfunktion ermöglicht
    // und nach 34 Sekunden autospeichert
    neuesDiagramm.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("savior");
        if (button) button.disabled = !neuesDiagramm.isModified;
        var idx = document.title.indexOf("*");
        if(!neuesDiagramm.model.nodeDataArray == []) {
        if (neuesDiagramm.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.slice(0, idx);
        }}});


    neuesDiagramm.model = new go.GraphLinksModel([], []); //Modelinitialisierung als GraphlinksModel nötigf


    if (document.getElementById("derInspektor")) {
        inspectore();
    }

    return neuesDiagramm;
}


//Erstellt einen neuen Knoten bei Eingabe in ein Textfeld
function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    neuesDiagramm.startTransaction("make new node");

    let lo = neuesDiagramm.viewportBounds;
    var punkt =  lo.x+0.5*lo.width;
    punkt= punkt.toString();
    var e = punkt;
    punkt = lo.y+0.5*lo.height;
    e = e +" "+ punkt.toString();
    console.log(e);

     var neuerKnoten = { knotenfarbe: "green", hauptInfo: toAdd, scale:"1.0",scaleZu:"1.0", loc:e,
                textfarbe:"white", hintergrund:false, vordergrund:true, category:"allesSehen",restInfo:"Definition oder Eigenschaften",
                info: []};

        //


    neuesDiagramm.model.addNodeData(neuerKnoten);
    neuesDiagramm.commitTransaction("make new node");
    document.getElementById('dieInfo').value = ''
}

//Sendet den Modellinhalt als JSON zurück an den Server
//Potenzielle Sicherheitslücke, Zugriff auf DB-Eintrag ist aber durch user_login kontrolliert
function sendData() {

    //Der einzige Weg zu einem Diagramm ist über /saved/DiagrammID außer bei der Erstellung
    if (!current_url) { current_url = window.location.href}
    console.log(window.location.href);

    let modelAsJson = neuesDiagramm.model.toJson();

// Hier noch mit XMLHttpRequest, später mit Fetch
    let xhr = new XMLHttpRequest();
    //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
    xhr.open("POST", current_url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
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
            model_id = response;
            current_url = "/saved/"+response;
            console.log("curr url is: " + current_url);
            console.log('Model ID ist: ' + model_id);
            if (response.status !== 200)     {
              return;
            }
            response.text().then(function (data) {
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

            if(model_json.nodeDataArray) {

                //Das Diagramm läd als erste Position den Mittelwert aller Locations
                //Könnte vielleicht verschoben, aber hier hat man das JSON direkt
                var ce = [0.0, 0.0];

                nodeNo = 0.0;

                //Achtung das folgende ist nur ein Fix weil veraltete Datenbankeinträge
                // aufgrund ihrer mangelnden Category nicht richtig angezeigt werden
                counter = 0;

                let cnt = 0;
                model_json.nodeDataArray.forEach(function (x) {
                    if(x.key < cnt ){
                        ce = x.loc.split(" ");
                        console.log(ce);

                    }
                   counter++;
                   console.log(x.category);
                    console.log(counter + " elemente von model json: ");
                    if(!x.category){
                    console.log(x.category);
                }});

                modelCenter = ce;
                console.log("modelCenter");

                    console.log(typeof(modelCenter[0]));
                    console.log(ce);

            }
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

// Diagrammelemente müssen vor der Anzeige des JSON Objektes erst definiert werden
function style_dia() {

        var nochEinItemTemplate =
            jo(go.Panel, "Auto",
                {                    alignment:go.Spot.LeftCenter
                },

                jo(go.Panel, "Auto",
              { margin: 2 ,
              alignment:go.Spot.Left,
              padding:10},

            jo(go.Panel, "Auto",
                jo(go.Shape, "RoundedRectangle",
                    {fill:"white"}),

                jo(go.TextBlock, new go.Binding("text", "nochMehr").makeTwoWay(),
                    { margin: 2,
                    editable:true})
            )));  // end of itemTemplate


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
                    font:"30pt Andale Mono serif ",

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

    //Template um Ideen festzuhalten

    var idea =
             jo(go.Node, "Auto",
        locator(),
        new go.Binding("scale").makeTwoWay(),

        jo(go.Panel,"Vertical",

        jo(go.Panel, "Auto",
            jo(go.Shape, "ElectricalHazard",
                new go.Binding("fill", "symbolfarbe").makeTwoWay(),
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
                new go.Binding("scale", "scaleText").makeTwoWay(),

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
                                jo(go.TextBlock, "!",
                    new go.Binding("text","qwer").makeTwoWay(),
                    {visible:false})
            )));


//Erstellt einen Kommentar
    var faktum =
    jo(go.Node, "Auto",
        locator(),
        new go.Binding("scale").makeTwoWay(),
        {scale:1},

        jo(go.Panel, "Auto",
            new go.Binding("visible", "klein").makeTwoWay(),


            jo(go.Shape, "SpeechBubble", {fill:"white", background:"transparent", visible:true,
                isPanelMain:true, click:textsicht,
            minSize: new go.Size(120,64),

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
        new go.Binding("text","qwa").makeTwoWay(),
        {visible:false}),
    jo(go.TextBlock,
        new go.Binding("text").makeTwoWay(),
        {editable:true,
        stroke:"white",
        //font:"10pt",
        isMultiline:true,
        margin: 20,
            maxSize: new go.Size(440,NaN),
})));

//Da das Minimieren einer Gruppe bei Objekten deren Location gebunden ist, zum Absturz führt
// müssen alle Gruppenmitglieder vorher in diese minimale Template umgewandelt werden...

var mingroup =
    jo(go.Node, "Auto",
    {visible:false});

     // Begriffsknoten der mit Eigenschaftsblöcken erweitert werden kann
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
            toSpot: go.Spot.NotBottomSide,fromSpot: go.Spot.Bottom,
            doubleClick:zentrierAlles}

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
                    font:" bold 42px Arial, Serif",
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







               jo("PanelExpanderButton", "quelli",
                    { alignment:go.Spot.TopCenter,
                    scale:5}),

               jo(go.Panel, "Vertical",
                new go.Binding("itemArray", "quellen").makeTwoWay(),
                {
                    visible:false,
                    scale:2,
                    name:"quelli",
                    alignment:go.Spot.BottomCenter,
                    defaultAlignment: go.Spot.Left,
                    margin:50,
                    //fill:"slategray"
                        itemTemplate:
                    jo(go.Panel, "Auto",
                      { margin: 2 },
                      jo(go.Shape, "RoundedRectangle",
                        { fill: "#91E3E0" }),
                      jo(go.TextBlock, new go.Binding("text", "").makeTwoWay(),
                        { margin: 2,
                        editable:true,
                        font: "bold 14px Arial"})
                    )  // end of itemTemplate
                    }
                ),



                          jo("Button",
                {
                    scale:1.2,
                    alignment:new go.Spot(0,1,40,-40),
                  margin: new go.Margin(0, 0, 0, 0),
                  click: changeCategory

                },
                jo(go.Shape, "RoundedRectangle",
                    new go.Binding("fill", "knotenfarbe").makeTwoWay(),

                  {
                      //desiredSize: new go.Size(26, 26),
                      fill:"green", stroke:"white",
                  strokeWidth:6})
              )),
           )
        )
    );


  // Wechselt die Knotenkategorie, detailliert und "simpel"
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

  //Beim Klicken wird ein Kommentar aufgedeckt, der Viewport zentriert und reingezoomt
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
    }

//Ungerichtete Linktemplate mit zwei verschiebbaren Linklabels
var lili =

        jo(go.Link,

          {
              routing: go.Link.Orthogonal,
                    corner:100,
                    //routing: go.Link.AvoidsNodes,
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


//Die gerichtete Linktemplate mit verschiebbaren Linklabel

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
                    //routing: go.Link.AvoidsNodes,

                fromEndSegmentLength:60,
                toEndSegmentLength:60,
                    //corner: 220,
                    relinkableFrom: true, relinkableTo: true,
                        selectionAdorned: true},


                //unsichtbare Form die das Klicken auf den Link erleichtert
                jo(go.Shape,
                    new go.Binding("strokeWidth", "linkbreite", function(o) { return parseFloat(o)}).makeTwoWay(),
                    { isPanelMain: true, stroke: "transparent", strokeWidth: 30 }),

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
                    new go.Binding("scale").makeTwoWay(),


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


        //Stellt logische Symbole als Knoten dar, die mit anderen verknüpft werden können
        var logiktemplate =
            jo(go.Node, "Auto",
            locator(),
            new go.Binding("scale").makeTwoWay(),
            jo(go.Panel, "Vertical",
                    jo(go.Panel, "Auto",
                        {scale:2},
                jo(go.Shape, "RoundedRectangle",
                    new go.Binding("fill", "color").makeTwoWay(),
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
                            strokeWidth:30}),

                        jo(go.Shape, "LogicOr",
                            new go.Binding("visible","visor").makeTwoWay(),
                            {stroke:"black",strokeWidth:35,
                                                                margin:20}),
                        jo(go.Shape, "SplitEndArrow",
                            new go.Binding("visible","visimp").makeTwoWay(),
                           {stroke:"black",
                               margin:10,
                               maxSize:new go.Size(NaN,62),
                            strokeWidth:26}),
                        jo(go.Shape, "DoubleEndArrow",
                            new go.Binding("visible","visiff").makeTwoWay(),
                            {stroke:"black",
                             strokeWidth:24,                                   margin:20,
                                minSize:new go.Size(160,NaN)
                            }),
                        jo(go.Shape, "SplitEndArrow",
                            new go.Binding("visible","vispim").makeTwoWay(),
                            {stroke:"black",
                                angle:180,
                                margin:10,
                                maxSize:new go.Size(NaN,62),
                            strokeWidth:30}),
                              jo(go.Shape, "LogicThereExists",
                            new go.Binding("visible","visex").makeTwoWay(),
                            {stroke:"black",
                                margin:20,

                            strokeWidth:30}),
                        jo(go.Shape, "LogicForAll",
                            new go.Binding("visible","visall").makeTwoWay(),
                            {stroke:"black",
                                margin:30,

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

//Eine Template um Fragen abspeichern zu können

    var helptemplate =
      jo(go.Node, "Auto",
        locator(),
        new go.Binding("scale").makeTwoWay(),
        jo(go.Panel,"Vertical",
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
                new go.Binding("fill", "color").makeTwoWay(),


              { fill:"red",
                  margin:30}),

          jo(go.Shape, "Help",
            {stroke:"white",
                strokeWidth:42,
                margin:20,
            minSize:new go.Size(300,300),

                //fromSpot: go.Spot.LeftRightSides,
               //toSpot: go.Spot.TopBottomSides,
                click:frageEinAusblenden
            })),
            jo(go.Panel, "Auto",
                new go.Binding("visible").makeTwoWay(),
                {alignment: new go.Spot(0.5,1,0,-30),
                    name:"Frage",
                margin:20},

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
                        margin:1
                    })
            )
))
;

//Ein Template das Antworten auf Fragen darstellen kann
      var answertemplate =
      jo(go.Node, "Auto",
        locator(),
        new go.Binding("scale").makeTwoWay(),
        jo(go.Panel,"Auto",

        jo(go.Panel, "Vertical",

jo(go.Panel, "Auto",

          jo(go.TextBlock , "!",
              new go.Binding("stroke", "symbolfarbe").makeTwoWay(),

            {verticalAlignment: go.Spot.Bottom,
                stroke:"#18B656",
               toLinkable: true,
                textAlign:"center",
              toSpot:go.Spot.LeftRightSides,
                portId:"",


                scale:1,
                font:"1000pt serif",
            background:"transparent",
                margin:20,
                doubleClick:frageEinAusblenden,
            //isPanelMain:true,

            })),
            jo(go.Panel, "Auto",

                new go.Binding("visible").makeTwoWay(),
                {
                alignment: new go.Spot(0.5,0,20,-380),

                    name:"Frage"},

            jo(go.Shape, "RoundedRectangle",
                             //   new go.Binding("visible","visible").makeTwoWay(),
                {maxSize:new go.Size(500,NaN)},
                new go.Binding("visible").makeTwoWay(),
                new go.Binding("fill", "symbolfarbe").makeTwoWay(),

                {
                                  click:zentrierAlles,

                    fill:"#18B656"
                }),
                jo(go.Panel, "Vertical",
                jo(go.TextBlock, "Was ist fragwürdig?",
                    new go.Binding("background","color").makeTwoWay(),
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
                    new go.Binding("background","symbolfarbe").makeTwoWay(),
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

//Stellt nur Haupt- und Restinfo eines Knotens dar
  var simpletemplate =
      jo(go.Node, "Auto",
                    new go.Binding("scale","scaleZu").makeTwoWay(),
                    locator(),

                  jo(go.Panel, "Auto",
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
                        editable:true,
                        maxSize: new go.Size(1200,NaN),
                        stroke:"white",
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
                      jo(go.TextBlock, "Definition:",
                          //{alignment: new go.Spot(0,0,-4,-12)
                          {font:"bold 50pt Segoe UI sans-serif",
                          stroke:"white",
                              textAlign:"center",
                          stretch:go.GraphObject.Horizontal},
),

                      jo(go.TextBlock,
                          {isMultiline:true,
                              wrap: go.TextBlock.WrapFit,
                              background:"black",
                              stroke:"white",
                              font:"bold 42pt Segoe UI sans-serif",
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



//Template der Detailgruppe mit erweiterbarem Überbegriff
  var detailGruppe =
         jo(go.Group, "Vertical",
             locator(),

        new go.Binding("text", "category"),
        new go.Binding("scale").makeTwoWay(),

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
                console.log(diagram.selection.first().data.group);
                    diagram.selection.each(function(a){console.log(a.data)});
                console.log(node.data.key);
                neuesDiagramm.model.startTransaction("Zu Gruppe");

                let hintergruppe = false;

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
            isPanelMain:true,

            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
            toSpot: go.Spot.NotBottomSide,fromSpot: go.Spot.AllSides,


            strokeWidth:30,
            stroke:"transparent",
            maxSize:new go.Size(1111,NaN),
            parameter1:20,


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
                    stroke:"white",
                    font:"small-caps bold 86px Georgia, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(830,110),
                    maxSize:new go.Size(1080,NaN),
                    margin: new go.Margin(0,0,0,220),
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                },
            ),

               jo(go.Shape, "Rectangle",
                   {fill:"black",
                       stroke:"black",
                       strokeWidth:16.8,
                    minSize:new go.Size(30,1),
                    maxSize:new go.Size(NaN,10),

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
                    font:" bold 42px Arial, Serif",
                    verticalAlignment: go.Spot.Center,
                    textAlign:"center",
                    minSize:new go.Size(800,60),
                   maxSize: new go.Size(800,NaN),

                    margin:32,
                    editable:true,
                    stretch:go.GraphObject.Horizontal
                })),
                             jo("Button",
                {
                    alignment:new go.Spot(1,1,-2,20),
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
}))),



               jo(  go.Panel, "Vertical",
                new go.Binding("itemArray", "info").makeTwoWay(),
                {
                    itemTemplate:itemTemplateUber,
                    alignment:go.Spot.Center,
                    defaultAlignment: go.Spot.Left,
                    margin:50,
                    //fill:"slategray"
                }

                ),

                jo("Button",
        new go.Binding("visible","zu").makeTwoWay(),

             {margin:20,
                 alignment:new go.Spot(0.05,0,0,0),

                 scale:5,
                 maxSize:new go.Size(300,NaN),

                 //ganz schlimm jedes Gruppenelement wieder aus dem Minimallayout zurücküberführen
 click:function(e,obj){
        neuesDiagramm.model.startTransaction("ok");

                             e.diagram.commandHandler.expandSubGraph(obj.part);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "zu", false);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "auf", true);
                             neuesDiagramm.model.commitTransaction("ok");


                             obj.part.memberParts.each(function(e) {
                                 console.log(e.data.info);
            if (e.category== "mingroup" && e.data.scaleZu) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "allesSehen");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwer) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "idea");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwa) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "kommentar");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.qwo) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "logiktemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.wa == " ") {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "helptemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.wa == "antwort") {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "answertemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.isGroup) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "detailGruppe");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}


                             })
             }},
            jo(go.TextBlock, "Expandieren"),
            new go.Binding("visible","zu").makeTwoWay(),
            {
                alignment:new go.Spot(0.05,0,0,0)
}),

                        jo("Button",
                    new go.Binding("visible","auf").makeTwoWay(),

                         {margin:20,
                             alignment:new go.Spot(0.05,0,0,0),

                             scale:5,
                             maxSize:new go.Size(300,NaN),
                         click:function(e,obj){

                             neuesDiagramm.model.startTransaction("ok");


                obj.part.memberParts.each(function(e) {
                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "mingroup");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");});




                neuesDiagramm.model.setDataProperty(obj.part.data, "zu", true);
                neuesDiagramm.model.setDataProperty(obj.part.data, "auf", false);
                             e.diagram.commandHandler.collapseSubGraph(obj.part);
//                             neuesDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);
                         neuesDiagramm.model.commitTransaction("ok");
                         } },
                         jo(go.TextBlock, "Minimieren",
                             new go.Binding("visible","auf").makeTwoWay(),
                               {
                                   alignment:new go.Spot(0.5,0,0,0),
                                   textAlign:"center",
}))))),




                 jo(go.Panel, "Auto",
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
                            console.log(obj.part.data);
                            if(obj.part.data.category == "detailGruppe")
                            {
                                neuesDiagramm.model.setCategoryForNodeData(obj.part, "grouptemp");}
                            else if(obj.part.data.category == "grouptemp")
                            {
                                neuesDiagramm.model.setCategoryForNodeData(obj.part, "detailGruppe");}
                            neuesDiagramm.commitTransaction("logiktext ein-ausblenden")},
                margin:40,
            minSize:new go.Size(500,500),

            opacity:0.5}),
        jo(go.Placeholder,    // represents the area of all member parts,
          {padding: 240,
          isPanelMain:true}))  // with some extra padding around them
        )));



//Eine einfache Gruppentemplate ohne Text
var grouptemp =
    jo(go.Group, "Vertical",
            locator(),


        {
            selectionAdorned: true, selectionObjectName: "SHAPE",
            selectionAdornmentTemplate:  // custom selection adornment: a blue rectangle
              jo(go.Adornment, "Auto",
                jo(go.Shape, { stroke: "dodgerblue", strokeWidth:10, fill:null}),
                jo(go.Placeholder, { margin: -1 }))
          },
          { resizable: true, resizeObjectName: "SHAPE" },
          { rotatable: true, rotateObjectName: "SHAPE" },
          { reshapable: true },

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
            new go.Binding("fill","knotenfarbe").makeTwoWay(),
            {fill:"white",
                portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
            toSpot: go.Spot.NotBottomSide,fromSpot: go.Spot.NotBottomSide,
}),
            jo(go.TextBlock, "Ein Gruppenname",
                new go.Binding("text", "hauptInfo").makeTwoWay(),
                new go.Binding("visible").makeTwoWay(),
        {
            minSize:new go.Size(120,NaN),
            maxSize:new go.Size(1400,NaN),
            editable:true,
            visible:true,
        scale:2,
        textAlign: 'center',
        margin:new go.Margin(120,50,50,50),
            alignment:new go.Spot(0.5,0,0,0),
            font:"bold 82px Georgia",
        stroke:"black"})),
jo(go.Panel, "Auto",
                        jo("Button",
                    new go.Binding("visible","zu").makeTwoWay(),

                         {margin:20,
                             alignment:new go.Spot(0.95,1,0,0),

                             scale:2,
                             maxSize:new go.Size(30,NaN),
click:function(e,obj){
        neuesDiagramm.model.startTransaction("ok");

                             e.diagram.commandHandler.expandSubGraph(obj.part);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "zu", false);
                             neuesDiagramm.model.setDataProperty(obj.part.data, "auf", true);
                             neuesDiagramm.model.commitTransaction("ok");


                             obj.part.memberParts.each(function(e) {
                                 console.log(e.data.info);
            if (e.category== "mingroup" && e.data.info) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "simple");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwer) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "idea");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwa) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "kommentar");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.qwo) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "logiktemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.wa) {

                neuesDiagramm.model.startTransaction("Kleiner Umweg");
                neuesDiagramm.model.setCategoryForNodeData(e.data, "helptemplate");
                neuesDiagramm.model.commitTransaction("Kleiner Umweg");}

                             })}},
            jo(go.TextBlock, "Expandieren"),
            new go.Binding("visible","zu").makeTwoWay(),
            {
}),
                            jo("Button",
                         new go.Binding("visible","auf").makeTwoWay(),

                                {margin:20,
                                    alignment:new go.Spot(0.95,1,0,0),

                             scale:2,
                             maxSize:new go.Size(100,NaN),
                             //alignment:new go.Spot(0.1,0,0,0),
                click:function(e,obj){
                        neuesDiagramm.model.startTransaction("ok");


                        obj.part.memberParts.each(function(e) {
                        neuesDiagramm.model.startTransaction("Kleiner Umweg");
                        neuesDiagramm.model.setCategoryForNodeData(e.data, "mingroup");
                        neuesDiagramm.model.commitTransaction("Kleiner Umweg");});




                neuesDiagramm.model.setDataProperty(obj.part.data, "zu", true);
                neuesDiagramm.model.setDataProperty(obj.part.data, "auf", false);
                             e.diagram.commandHandler.collapseSubGraph(obj.part);
//                             neuesDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);
                         neuesDiagramm.model.commitTransaction("ok");

                         }},
                         jo(go.TextBlock, "Minimieren",
                             new go.Binding("visible","auf").makeTwoWay(),
                               //{alignment:new go.Spot(0.05,0,0,0)}
))),

  jo(go.Panel, "Auto",
       sizer(),
            {name:"SHAPE",
            margin:30},
        jo(go.Shape, "RoundedRectangle",
            new go.Binding("fill","color").makeTwoWay(),
            {
                parameter1:200,
                isPanelMain:true,
                doubleClick: function(e,obj) {
                            neuesDiagramm.startTransaction("logiktext ein-ausblenden");
                            if(obj.part.data.category == "detailGruppe")
                            {
                                neuesDiagramm.model.setCategoryForNodeData(obj.part, "grouptemp");}
                            else if(obj.part.data.category == "grouptemp")
                            {
                                neuesDiagramm.model.setCategoryForNodeData(obj.part, "detailGruppe");}
                            neuesDiagramm.commitTransaction("logiktext ein-ausblenden")},
                margin:40,
            minSize:new go.Size(300,300),
            maxSize:new go.Size(NaN,NaN),

            opacity:0.5})
 ,
        jo(go.Placeholder,    // represents the area of all member parts,
          {padding: 240,
          isPanelMain:true}))

    );

//Alle Templates werden gemappt, sodass das Diagramm darauf zugreifen kann

var templateMap = new go.Map();
templateMap.add("idea", idea);
templateMap.add("mingroup", mingroup);
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

var linktemplateMap = new go.Map();
linktemplateMap.add("linkTem",linkTem);
linktemplateMap.add("lili",lili);


neuesDiagramm.nodeTemplateMap = templateMap;
neuesDiagramm.linkTemplateMap = linktemplateMap;

//Für alle Templates werden Contextmenüs definiert die sich beim Rechtsklicken öffnen

        neuesDiagramm.nodeTemplateMap.get("kommentar").contextMenu=
        jo("ContextMenu",
              jo("ContextMenuButton",
                jo(go.TextBlock, "Größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.15); }}),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Smaller"),
                { click: function(e, obj) { newSizeChange(obj, 0.92); } }),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));

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
                check= false;
                neuesDiagramm.model.setDataProperty(node.data, "wa", " ");
}

            else if(check){neuesDiagramm.model.setCategoryForNodeData(node.data, "answertemplate");}
                    neuesDiagramm.model.setDataProperty(node.data, "wa", "antwort");
                    neuesDiagramm.commitTransaction("Beantworten");
                    } }),
                         jo("ContextMenuButton",
                jo(go.TextBlock, "Größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.15); }}),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Kleiner"),
                { click: function(e, obj) { newSizeChange(obj, 0.92); } }),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));

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
                    } }),
                         jo("ContextMenuButton",
                jo(go.TextBlock, "Größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.15); }}),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Kleiner"),
                { click: function(e, obj) { newSizeChange(obj, 0.92); } }),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));



    console.log(neuesDiagramm.nodeTemplateMap.get("simple"));
    console.log(neuesDiagramm.nodeTemplateMap.first());
              neuesDiagramm.nodeTemplateMap.get("simple").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.14); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Kleiner"),
            { click: function(e, obj) { newSizeChange(obj, 0.9); } }),
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
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));
//Links
                neuesDiagramm.linkTemplateMap.get("linkTem").contextMenu=
        jo("ContextMenu",
            jo("ContextMenuButton",
            jo(go.TextBlock, "Textfeld größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.05); } }),
            jo("ContextMenuButton",
            jo(go.TextBlock, "Textfeld kleiner"),
            { click: function(e, obj) { newSizeChange(obj, 0.96); } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Linkkategorie wechseln"),
            { click: function(e, obj) {
            let link = obj.part.data;

            neuesDiagramm.startTransaction("Linkkategorie wechseln");

            neuesDiagramm.model.setCategoryForLinkData(link,"lili");


            neuesDiagramm.commitTransaction("Linkkategorie wechseln");
            } }));


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
            { click: function(e,obj){logik(e,obj)}}),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));

        neuesDiagramm.nodeTemplateMap.get("logiktemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Logische Relation ändern"),
            { click: function(e,obj){logik(e,obj)}}),
            jo("ContextMenuButton",
            jo(go.TextBlock, "Größer"),
            { click: function(e, obj) { newSizeChange(obj, 1.1); } }),
            jo("ContextMenuButton",
            jo(go.TextBlock, "Kleiner"),
            { click: function(e, obj) { newSizeChange(obj, 0.9); } }),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));



              //Klick im Hintergrund
                neuesDiagramm.contextMenu =
    jo("ContextMenu",
             jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Node"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { knotenfarbe: "green", hauptInfo: "mehr Info", scale:"1.0",scaleZu:"1.0",
                textfarbe:"white", hintergrund:false, vordergrund:true, category:"allesSehen",restInfo:"Definition oder Eigenschaften",
                info: [], quellen: []};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),

             jo("ContextMenuButton",
            jo(go.TextBlock, "Neuer Logik-Knoten"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var logiKnoten = { color:"white", qwo:"eh", scale:"1.0", category:"logiktemplate", visible:true, visand:true, visor:false,visiff:false,vispim:false,visimp:false,visall:false, visex:false};
        //
            d.model.addNodeData(logiKnoten);
            part = d.findPartForData(logiKnoten);
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten')
            }}),
      // no binding, always visible button:
      jo("ContextMenuButton",
        jo(go.TextBlock, "Neue Unklarheit"),
        { click: function(e, obj) {
          e.diagram.commit(function(d) {
            var data = {scale:"1.0",symbolfarbe:"green",color:"red",wa: " ",frage:"Frage oder Unklarheit", antwort:"Eine ErklärungErklärungErklärungErklärungErklärung", category:"helptemplate",visible:true};
            d.model.addNodeData(data);
            part = d.findPartForData(data);
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
          }, 'new node');
        } }),


        jo("ContextMenuButton",
            jo(go.TextBlock, "Neuer Kommentar"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { qwa:"so", scale:"1.0", category:"kommentar",color:"yellow",text:"Ergänzend:",expand:false, klein: true};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),
        jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Idee"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { symbolfarbe: "yellow", qwer:"q",scale:"1.0", category:"idea",color:"green",text:"Geistesblitz!"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten');}}),

        jo("ContextMenuButton",
        jo(go.TextBlock, "Redo"),
        { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
        new go.Binding("visible", "", function(o) {
            return o.diagram.commandHandler.canRedo();}).ofObject()),
                                         jo("ContextMenuButton",
            jo(go.TextBlock, "Neue Gruppe"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var neuerKnoten = { hauptInfo:"Eine Gruppe", category: "detailGruppe",isGroup:"True", group:"", color:"yellow", visible:"True", auf:"False", zu:"True",
                restInfo:"Definition oder Eigenschaften", textfarbe:"white", scale:1,
                info: [], knotenfarbe:"green"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neue Gruppe');}}),

              jo("ContextMenuButton",
        jo(go.TextBlock, "Undo"),
        { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
        new go.Binding("visible", "", function(o) { return o.diagram.commandHandler.canUndo();}).ofObject()),
      jo("ContextMenuButton",
        jo(go.TextBlock, "Redo"),
        { click: function(e, obj) { e.diagram.commandHandler.redo(); } },
        new go.Binding("visible", "", function(o) {
            return o.diagram.commandHandler.canRedo();}).ofObject()));






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
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ),
                jo("ContextMenuButton",
                  jo(go.TextBlock, "Neue Quelle hinzufügen"),
                { click: function(e, obj) { machNeueQuelle(e,obj) }}
                ),
                jo("ContextMenuButton",
                  jo(go.TextBlock, "Letzte Quelle entfernen"),
                { click: function(e, obj) { loeschLetzteQuelle(e,obj) }}
                ),
                jo("ContextMenuButton",
                  jo(go.TextBlock, "Letzten Eigenschaftsblock entfernen"),
                { click: function(e, obj) { loeschUnter(e,obj) }}
                ));


        neuesDiagramm.nodeTemplateMap.get("idea").contextMenu=
            jo("ContextMenu",
              jo("ContextMenuButton",
                jo(go.TextBlock, "Bigger"),
                { click: function(e, obj) { newSizeChange(obj, 1.08); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Smaller"),
                { click: function(e, obj) { newSizeChange(obj, 0.95); } }),
                              jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));
        //nach Initialisierung des Diagrammes beginnt die Autospeicherschleife
        autoSpeichern();
}

//Erstellt beim Doppelklick einers Knotens einen neuen, der  mit dem geklickten verbunden ist





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

//Der Inspektor wird in einem eigenen Div initialisiert und ermöglicht die Farbänderung von Diagrammelementen
    function inspectore() {
    var inspector = new Inspector('derInspektor', neuesDiagramm,
        {
          multipleSelection: true,
          showSize: 4,
          includesOwnProperties: false,
          properties: {

              "color": { show: Inspector.showIfPresent, type: 'color' },
              "knotenfarbe": { show: Inspector.showIfPresent, type: 'color' },
              "textfarbe": { show: Inspector.showIfPresent, type: 'color' },
              "symbolfarbe": { show: Inspector.showIfPresent, type: 'color' },

          }
        });
}


//Zwei Funktionen um die Position/Größe der Objektdaten speichern zu können
 function locator() {
    return [
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            locationSpot: go.Spot.TopLeft
          }
        ];
      }
  function sizer() {
        return [
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

        ];
      }


//So können Knoten größenverändert werden (per Contextmenü)

    function newSizeChange( obj, sz) {
    var node = obj.part;

    console.log(node.data);
    if (node.data.scale ){

        neuesDiagramm.startTransaction("Change Text Size");
        if(node.data.category !== "simple") {
            let neuScale = parseFloat(node.data.scale) * sz;
            if (node.data.scale > 22) {
                alert("Maximalgröße erreicht");
                node.data.scale = 22.0
            }
            if( node.data.category == "idea") {
                neuScale=neuScale*((sz+3)/4);
                neuScale.toString();
                neuesDiagramm.model.setDataProperty(node.data, "scaleText", neuScale);}

            neuScale = neuScale.toString();
            console.log(node.data.scale);


        neuesDiagramm.model.setDataProperty(node.data, "scale", neuScale);


        }
        else if (node.data.category == "simple") {

            let neuScale = parseFloat(node.data.scaleZu) * sz;

            if (node.data.scaleZu > 22) {
                alert("Maximalgröße erreicht");
                node.data.scaleZu = 22.0}

            neuesDiagramm.model.setDataProperty(node.data, "scaleZu", neuScale);

        }
        neuesDiagramm.commitTransaction("Change Text Size");

    }


    }


// Der Suchbegriff wird als Regex mit allen Knoten abgeglichen - für alle Suchtreffer wird ein Knoten
// im Viewport zentriert und bei einer wiederholten Suche wandert der Fokus zum nächsten Treffer
    var counter =1;
    var suchmenge = 0;
    var wiederholKoordinaten =[];
    var letzteSuche ="quatsch";
    var knotenKeys = [];
    var anders = 0;
    var letzteVer = false;
    if (!wiederholKoordinaten) {wiederholKoordinaten}
  function suchFunktion() {  // called by button
        var coord = [];

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


                neuesDiagramm.nodes.each(function(e) {
                    console.log(e.data);
                    if (e.data.category == "simple" || e.data.category == "allesSehen" || e.data.category == "detailgruppe") {

                    for (var i = 0; i < e.data.info.length; i++) {
                        var node = e.data;
                        if (regex.test(node.info[i].text) || regex.test(node.info[i].mehr[0])) {
                            coord.push(e.actualBounds);
                            console.log("for schleife")
                            i = node.info.length;
                        }

                    }
                }

                });

                //ein Array wird angelegt um die Koordinaten zu speichern
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


                }



                }


                //der Fokus des Diagramms wird bei jeder neuen Suche auf einem weiteren Suchergebnis platziert
                neuesDiagramm.centerRect(coord[counter]);
                neuesDiagramm.scale = 0.6;
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

    //Eine Funktion um Knoten in den Viewport zu bekommen
function zentrierAlles(e,obj){
               e.diagram.commit(function(d) {
                console.log(obj.part.data.category);
                   if(obj.part.data.category == "answertemplate"){
                       neuesDiagramm.centerRect(new go.Rect(e.documentPoint.x, e.documentPoint.y+700,0,0 ));
                    console.log("sonderfall");
                   neuesDiagramm.scale = 0.6;
                   e.diagram.background = "#f50f13";

                   }
                   else {neuesDiagramm.centerRect(new go.Rect(e.documentPoint.x, e.documentPoint.y,0,0 ));

                   neuesDiagramm.scale = 0.6;}

               })
}

    //Beim Klick auf Fragentemplate kann das Textfeld ein- und ausgeblendet werden
function frageEinAusblenden(e, obj) {
        if (!obj.part.data.visible) {zentrierAlles(e,obj);}
               e.diagram.commit(function(d) {
                   neuesDiagramm.model.setDataProperty(obj.part.data, "visible", !obj.part.data.visible);


               })}

//Wechselt zwischen den logischen Symbolen eines Logikknotens

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

}

//Multifunktions-Funktion die hier für eine Titeländerung oder Autospeichern Daten "postet"

function sendVerData(welche) {


    if(welche == "modell") {
        var aqui = window.location.href.toString();
        wot = aqui.substr(0, aqui.lastIndexOf("/"));
        console.log(wot);
        let modelAsJson = neuesDiagramm.model.toJson();
    // Hier noch mit XMLHttpRequest, später mit Fetch
        let xhr = new XMLHttpRequest();
        //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
        xhr.open("POST", wot, true);
        xhr.setRequestHeader("Content-Type", "application/json");


        //console.log('folgendes json file wird geschickt: ');
        //console.log(modelAsJson.toString());
        xhr.send(modelAsJson);
        neuesDiagramm.isModified = false;}

        else if (welche == "titel") {

        var aqui = window.location.href.toString();

            var derTitel = document.getElementById("ModelName").value;
        console.log(derTitel);
        // Hier noch mit XMLHttpRequest, später mit Fetch
        let xhr = new XMLHttpRequest();
        //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
        xhr.open("POST", aqui, true);
        xhr.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
        xhr.send(derTitel);
    }
}


//Erweitert das info-Array eines Knotens um einen Eigenschaftsblock
function machNeuenUntereintrag(e, obj) {

                        node = obj.part;

                        neuesDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.info) {
                            let neuU = {
                                text: 'Eine Eigenschaft',
                                mehr: ["Mehr"],
                                c: node.data.info.length
                            };

                            neuesDiagramm.model.startTransaction("neuInfo");

                            neuesDiagramm.model.addArrayItem(node.data.info, neuU);

                            neuesDiagramm.commitTransaction("neuInfo");
                            neuesDiagramm.model.commitTransaction("neuer UBText");
                        }

                  }

//Fügt ein Item in das Quellenarray von Textknoten ein
function machNeueQuelle(e, obj) {

                        node = obj.part;

                        neuesDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.quellen) {

                            neuesDiagramm.model.startTransaction("neuInfo");

                            neuesDiagramm.model.addArrayItem(node.data.quellen, "Eine Quelle");

                            neuesDiagramm.commitTransaction("neuInfo");
                            neuesDiagramm.model.commitTransaction("neuer UBText");
                        }

                  }

//Löscht das letzte Item eines Quellenarrays von Textknoten

    function loeschLetzteQuelle(e, obj) {

                        node = obj.part;

                        neuesDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.quellen) {

                            neuesDiagramm.model.startTransaction("neuInfo");

                            neuesDiagramm.model.removeArrayItem(node.data.quellen, node.data.quellen.length-1);

                            neuesDiagramm.commitTransaction("neuInfo");
                            neuesDiagramm.model.commitTransaction("neuer UBText");
                        }

                  }
//Löscht das letzte Item eines Infoarrays von Textknoten

        function loeschUnter(e, obj) {

                        node = obj.part;

                        neuesDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.quellen) {

                            neuesDiagramm.model.startTransaction("neuInfo");

                            neuesDiagramm.model.removeArrayItem(node.data.info, node.data.info.length-1);

                            neuesDiagramm.commitTransaction("neuInfo");
                            neuesDiagramm.model.commitTransaction("neuer UBText");
                        }

                  }
