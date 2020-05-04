var jo = go.GraphObject.make;
var ein_dia;
var Diagramm0;
var Diagramm1;
var Diagramm2;
var Diagramm3;
var Diagramm4;
    var neuesDiagramm;
    var zieher;
    var kurzDiagramm;

diagramme = [Diagramm0,Diagramm1,Diagramm2,Diagramm3,Diagramm4];


function autoSpeichern2() {
        setTimeout(timeoutProblem2, 30000);
}

function timeoutProblem2() {
    autoSpeichern2();
    if (neuesDiagramm.isModified) {sendVerData('modella');}
}


diagramme_fertig = false;
function getDiagramData(id, diagramm) {
    let request = new XMLHttpRequest();
    request.open("GET", url=`saved/${id}`);
    console.log(`saved/${id}`);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
            console.log(this.responseText);
console.log(id);
        if ((JSON).parse(this.responseText)) {

            var model_json = JSON.parse(this.responseText);
            //console.log(model_json.isJSON());

            if(model_json.nodeDataArray) {
                let cnt = [0,0];
                let counter = 0;
                model_json.nodeDataArray.forEach(function (x) {

                        let ce = x.loc.split(" ");
                        ce[0] +=cnt[0];
                        ce[1] +=cnt[1];
                   counter++;
                    });
                    ce[0] /=counter;
                ce[1] /=counter;


               // ce[0] /= nodeNo;
                //ce[1] /= nodeNo;
                modelCenter = ce;
                console.log(ce);
            }
            //zum Debuggen
            //console.log('Diagramm Data: ');
            //console.log(model_json);
            //Stellt sicher, dass das Diagramm initialisiert wurde
            //läd die Objekttemplates bevor das Modell geladen wird

          //  style_dia();

        diagramm.model = new go.Model.fromJson(model_json);

        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

function fill_dias() {
    for(var i=0;i<4;i++) {
        let dia_no =parseInt(document.getElementById(`data${i}`).innerText);

        getDiagramData(i,dia_no)
    }
}




function getJson(numba){
    let dies = "data" + numba;
    var dieDaten = document.getElementById(dies).innerText;
    console.log(dieDaten);
    if(!dieDaten) { dieDaten = {'class':'GraphLinksModel', 'nodeDataArray':[], 'linkDataArray':[]}};
        dieDaten.toJSON();

    console.log(typeof(dieDaten));
    return dieDaten;
}


isEnabled:false

function make_dias() {
    //var nodeArray = document.getElementById("modelldaten").innerText;
    //console.log(typeof(nodeArray));
    //var dia = JSON.parse(nodeArray);

    //if(!nodeArray){ var nodeDataArray = [];}
    var diagrammzahl = parseInt(document.getElementById("counter").innerText);

    console.log(counter);

    for(var i=0;i<diagrammzahl;i++ ){
        console.log(`diagramme.push(Diagramm${i}`);
        var dies = document.getElementById("id"+i);
        if(dies){console.log("Digramm" + i)}


  diagramme[i]= jo(go.Diagram, `Diagramm${i}`, {
        //isEnabled: false,
//        initialPosition: new go.Point(parseFloat(modelCenter[0])-960,parseFloat(modelCenter[1])),
   scale:0.6
    });



        let eidie = parseInt(document.getElementById("id"+i).innerText);

        fetchdias(i,eidie);
        //daten = JSON.parse(daten);
        console.log(eidie);


      diagramme[i].nodeTemplate =
        jo(go.Node, "Auto",
            jo(go.Shape, "RoundedRectangle",
                {parameter1:50,
                    toLinkable:true,
                    fromLinkable:true,
                    portId:"",
                    fromSpot:go.Spot.Center,
                    toSpot: go.Spot.Center,
                    fill:"#2A3380"}),
            jo(go.Panel, "Auto",
            jo(go.Shape, "RoundedRectangle",
                {fill: "#4866FF",
                    parameter1:42,
                    stroke:"transparent",

            minSize:new go.Size(140,50)}),
            jo("HyperlinkText",
                function (node) {
                    return "http://127.0.0.1:5000/saved/" + node.data.id;
                },
                function (node) {
                    return node.data.title;
                },
                {margin: 10,
                scale:1.5}
            ))
        );

            diagramme[i].linkTemplate =
            jo(go.Link,

          {
            doubleClick:linkDoubleClick,

                    corner:10,
                    //routing: go.Link.AvoidsNodes,
     },
          jo(go.Shape,
              new go.Binding("stroke","color").makeTwoWay(),
            { fill:"white",
                stroke: "white", strokeWidth: 6}),

            jo(go.Panel, "Auto",
                new go.Binding("visible"),

                {               segmentIndex:NaN,

                    segmentFraction: 0.15,
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

                    { segmentIndex: NaN, segmentFraction: .75 ,
                    _isLinkLabel: true, segmentIndex: NaN},
                    new go.Binding("segmentFraction","zwei").makeTwoWay(),


                jo(go.Shape, "RoundedRectangle"),


            jo(go.TextBlock, "auch mit Text",
            new go.Binding("text", "toText"),
            {
                editable:true,
                margin:10,
                //segmentIndex:NaN,
              stroke: "orange",
                maxSize: new go.Size(180, NaN)
            })));

            diagramme[i].groupTemplate=
    jo(go.Group, "Vertical",
      jo(go.Panel, "Auto",
        jo(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
          { parameter1: 14,
            fill: "rgba(128,128,128,0.33)" }),
        jo(go.Placeholder,    // represents the area of all member parts,
          { padding: 5})  // with some extra padding around them
      ),
      jo(go.TextBlock,         // group title
        { alignment: go.Spot.TopRight, font: "Bold 42pt Sans-Serif",
        editable:true},
        new go.Binding("text", "name").makeTwoWay())
    );

    }}





function fetchdias(diaNummer, id) {
    var loc = window.location.href.toString();
    var wat = loc.split("/eigene");

   wat[0] = wat[0].concat("/einmodell/"+id);
   console.log("hole jetzt ein diagramm aus folgender URl: ");
   console.log(wat);

      fetch(wat[0], {
         method: "GET",
         headers: new Headers({
             "content-type": "application/json"
         })
     }).then((response) => response.text())
         .then(function (response) {
//           console.log('response: ');
//           console.log(response);

             var model_json = JSON.parse(response);
            console.log(typeof(model_json));

             diagramme[diaNummer].model =  go.Model.fromJSON(model_json);
             //console.log(neuesDiagramm.model);
             //console.log(diagramme[0].model);

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


function fetchdiar(miteidie) {

      fetch(`/saved/${miteidie}`, {
         method: "GET",
         headers: new Headers({
             "content-type": "application/json"
         })
     }).then((response) => response.text())
         .then(function (response) {
//           console.log('response: ');
//           console.log(response);

             var model_json = JSON.parse(response);
            console.log(response);

             kurzDiagramm.model =  go.Model.fromJSON(model_json);
            var maxx = 0;
            var maxy =0;
            var minx=0;
            var miny=0;
            var ausdehnung=[];
             kurzDiagramm.nodes.each(function(o){
                 var loc = o.data.loc;
                 locations = loc.split(" ");
                     if (locations[0] < minx) {minx = locations[0]}
                     else if (locations[0] > maxx) {maxx = locations[0]}
                     if (locations[1] > maxy) {maxy = locations[0]}
                     else if (locations[1] < miny) {miny = locations[0]}
                    ausdehnung[0] = parseFloat(minx);
                    ausdehnung[1] = parseFloat(maxx);
                    ausdehnung[2] = parseFloat(miny);
                    ausdehnung[3] = parseFloat(maxy);
             });
             let z = ((ausdehnung[2]+ausdehnung[3])*0.5)+300;
             kurzDiagramm.centerRect(new go.Rect(  (ausdehnung[0]+ausdehnung[1])*0.5,z,
                 Math.abs((ausdehnung[1]-ausdehnung[0])),Math.abs((ausdehnung[3]-ausdehnung[2]))+200 ));
             //console.log(diagramme[0].model);
            console.log(ausdehnung);
            kurzDiagramm.scale=0.5;



            console.log(Math.abs((ausdehnung[3]-ausdehnung[2])));
            console.log(Math.abs((ausdehnung[1]-ausdehnung[0])));

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

function fetchdia() {
          console.log(window.location.href);

      fetch(window.location.href, {
         method: "GET",
         headers: new Headers({
             "content-type": "application/json"
         })
     }).then((response) => response.text())
         .then(function (response) {
//           console.log('response: ');
//           console.log(response);

             var model_json = JSON.parse(response);
            console.log(response);

             neuesDiagramm.model =  go.Model.fromJSON(model_json);
            var maxx = 0;
            var maxy =0;
            var minx=0;
            var miny=0;
            var ausdehnung=[];
             neuesDiagramm.nodes.each(function(o){
                 var loc = o.data.loc;
                 locations = loc.split(" ");
                     if (locations[0] < minx) {minx = locations[0]}
                     else if (locations[0] > maxx) {maxx = locations[0]}
                     if (locations[1] > maxy) {maxy = locations[0]}
                     else if (locations[1] < miny) {miny = locations[0]}
                    ausdehnung[0] = parseFloat(minx);
                    ausdehnung[1] = parseFloat(maxx);
                    ausdehnung[2] = parseFloat(miny);
                    ausdehnung[3] = parseFloat(maxy);
             });
             let z = ((ausdehnung[2]+ausdehnung[3])*0.5)+300;
             neuesDiagramm.centerRect(new go.Rect(  (ausdehnung[0]+ausdehnung[1])*0.5,z,
                 Math.abs((ausdehnung[1]-ausdehnung[0])),Math.abs((ausdehnung[3]-ausdehnung[2]))+200 ));
             //console.log(diagramme[0].model);
            neuesDiagramm.scale=0.3;



            console.log(Math.abs((ausdehnung[3]-ausdehnung[2])));
            console.log(Math.abs((ausdehnung[1]-ausdehnung[0])));

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

function neuetmodell() {


    let title=document.getElementById('elTitel').value;
    console.log(title);
    //document.getElementById('überschrift').innerHTML=title;
    fetch("/eigenemodelle/1", {
         method: "POST",
         body: title,
         headers: new Headers({
             "content-type": "text/html;charset=UTF-8"
         })
     }).then((response) => response.text())
         .then(function (response) {
//           console.log('response: ');
//           console.log(response);
            console.log(typeof(response));
            count=response;
            document.getElementById("neueID").innerText=count;
            dahin = "/einmodell/"+response+"/1";
            location.assign(dahin);
            if (response.status !== 200)     {
              //console.log(`Looks like there was a problem. Status code: ${response.status}`);
              return;
            }
       //    console.log('im response block');
       //    console.log(response.text());

            response.text().then(function (data) {
                console.log("hier die daten aus dem komischen response text ding");
                console.log(data);
              //console.log('hier kann noch mehr passieren');

            });
          })
          .catch(function (error) {
            console.log("Fetch error: " + error);
          });

      }






function make_palette() {
    zieher = jo(go.Palette, "Palette",
        {initialPosition: new go.Point(0,-500)},
        {layout: jo(go.GridLayout,
        {sorting: go.GridLayout.Descending,

        spacing:new go.Size(20, 20),
            cellSize:new go.Size(200,100),
        wrappingColumn:2})});


zieher.nodeTemplate =
    jo(go.Node, "Auto",
      jo(go.Shape, "RoundedRectangle",
          {minSize: new go.Size(60,40)},
        new go.Binding("fill", "color")),

                    jo("HyperlinkText",
                function (node) {
                    return "http://127.0.0.1:5000/saved/" + node.data.id;
                },
                function (node) {
                    return node.data.title;
                },
                {margin: 20,
                scale:1.4}
            )
    );

    var ct = parseInt(document.getElementById("counter").innerText)
    for(var j = 0;j <ct;j++){
        var tl = document.getElementById("title"+j).innerText;
        var d = document.getElementById("id"+j).innerText;
        var knoten = {"title": tl, "id": d,"color": "lightskyblue"};
    zieher.model.addNodeData(knoten)}

    zieher.scale=0.8;
//    zieher.centerRect(new go.Rect(330,-100,300,800));






}


function sendVerData(welche) {

    //console.log('url is : ')
    //Der einzige Weg zu einem Diagramm ist über /saved/DiagrammID außer bei der Erstellung


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
    neuesDiagramm.isModified =false;}

        else if(welche == "modella") {
        var aqui = window.location.href.toString();
        wot = aqui.substr(0, aqui.lastIndexOf("/"));
        wot = parseInt(wot[wot.length-1]);
        wot=wot.toString();
        if ( wot == "NaN") {
            console.log("das sollte nur auf einmodell zu lesen sein!");
            warumeinfach();}
        else {
            console.log("das sollte nur auf einmodel// zu lesen sein!");
            sendVerData("modell");
    }}


        else if (welche == "titel") {

        var aqui = window.location.href.toString();
        wot = aqui.substr(0, aqui.lastIndexOf("/"));

            var derTitel = document.getElementById("derTitel").value;
        console.log(derTitel);
        // Hier noch mit XMLHttpRequest, später mit Fetch
        let xhr = new XMLHttpRequest();
        //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
        xhr.open("POST", wot, true);
        xhr.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
        xhr.send(derTitel);
neuesDiagramm.isModified =false;
    }
}
        function warumeinfach() {

    let modelAssJson = neuesDiagramm.model.toJson();


     fetch(window.location.href, {
         method: "POST",
         body: modelAssJson,
         headers: new Headers({
             "content-type": "application/json"
         })
     }).then((response) => response.text())
         .then(function (response) {
//           console.log('response: ');
//           console.log(response);
            neuesDiagramm.isModified =false;
            console.log(typeof(response));
            if (response.status !== 200)     {
              //console.log(`Looks like there was a problem. Status code: ${response.status}`);
              return;
            }
       //    console.log('im response block');
       //    console.log(response.text());

            response.text().then(function (data) {
                console.log("hier die daten aus dem komischen response text ding");
                console.log(data);
              //console.log('hier kann noch mehr passieren');

            });
          })
          .catch(function (error) {
            console.log("Fetch error: " + error);
          });


}



function sendDatar(ident) {

    //console.log('url is : ')
    //Der einzige Weg zu einem Diagramm ist über /saved/DiagrammID außer bei der Erstellung

//    var aqui = window.location.href.toString();
  //  wot = aqui.substr(0, aqui.lastIndexOf("/"));
    let modelAsJson = kurzDiagramm.model.toJson();
// Hier noch mit XMLHttpRequest, später mit Fetch
    let xhr = new XMLHttpRequest();
    //let url = `${window.origin}/saved/${model_id}`;  zum Testen noch drin wie folgende
    xhr.open("POST", `/saved/${ident}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");


    //console.log('folgendes json file wird geschickt: ');
    //console.log(modelAsJson.toString());
    xhr.send(modelAsJson);
    kurzDiagramm.isModified = false;
    return true;
}





function make_dia() {
    //var nodeArray = document.getElementById("modelldaten").innerText;
    //console.log(typeof(nodeArray));
    //var dia = JSON.parse(nodeArray);

    //if(!nodeArray){ var nodeDataArray = [];}

    neuesDiagramm= jo(go.Diagram, `Diagramm0`, {
        //isEnabled: false,
//        initialPosition: new go.Point(parseFloat(modelCenter[0])-960,parseFloat(modelCenter[1])),
       // scale: 1.2
        "undoManager.isEnabled": true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "grid.visible": true,
        "grid.gridCellSize": new go.Size(25, 25),
    });

    neuesDiagramm.toolManager.mouseMoveTools.insertAt(0, new LinkLabelOnPathDraggingTool());

    neuesDiagramm.scrollMode = go.Diagram.InfiniteScroll;

    neuesDiagramm.groupTemplate=
    jo(go.Group, "Vertical",
      locator(),
      jo(go.Panel, "Auto",
        jo(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
          { parameter1: 14,
            fill: "rgba(128,128,128,0.33)",
          minSize:new go.Size(111,77)},
              {mouseDrop: function(e, node) {
              var diagram = node.diagram;
              var knot = node.part.data;
              diagram.selection.each(function(e){
                  diagram.startTransaction("in die gruppe!");
                  diagram.model.setDataProperty(e.data, "group", knot.key);
                    diagram.commitTransaction("in die gruppe!");
              })
              }}),
        jo(go.Placeholder,    // represents the area of all member parts,
          { padding: 35})  // with some extra padding around them
      ),
      jo(go.TextBlock,         // group title
        { alignment: go.Spot.TopRight, font: "Bold 42pt Sans-Serif",
        editable:true},
        new go.Binding("text").makeTwoWay())
    );




    neuesDiagramm.nodeTemplate =
        jo(go.Node, "Auto",
            locator(),
            jo(go.Shape, "RoundedRectangle",
                {parameter1:50,
                    toLinkable:true,
                    fromLinkable:true,
                    portId:"",
                    fromSpot:go.Spot.Center,
                    toSpot: go.Spot.Center,
                    fill:"#2A3380"}),
            jo(go.Panel, "Auto",
            jo(go.Shape, "RoundedRectangle",
                {fill: "#4866FF",
                    parameter1:42,
                    stroke:"transparent",

            minSize:new go.Size(140,50)}),
            jo("HyperlinkText",
                function (node) {
                    return "http://127.0.0.1:5000/saved/" + node.data.id;
                },
                function (node) {
                    return node.data.title;
                },
                {margin: 10,
                scale:1.5}
            ))
        );

   neuesDiagramm.linkTemplate =
            jo(go.Link,

          {
            doubleClick:linkDoubleClick,

                    corner:10,
                    //routing: go.Link.AvoidsNodes,
     },
          jo(go.Shape,
              new go.Binding("stroke","color").makeTwoWay(),
            { fill:"white",
                stroke: "white", strokeWidth: 6}),

            jo(go.Panel, "Auto",
                new go.Binding("visible"),

                {               segmentIndex:NaN,

                    segmentFraction: 0.15,
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

                    { segmentIndex: NaN, segmentFraction: .75 ,
                    _isLinkLabel: true, segmentIndex: NaN},
                    new go.Binding("segmentFraction","zwei").makeTwoWay(),


                jo(go.Shape, "RoundedRectangle"),


            jo(go.TextBlock, "auch mit Text",
            new go.Binding("text", "toText"),
            {
                editable:true,
                margin:10,
                //segmentIndex:NaN,
              stroke: "orange",
                maxSize: new go.Size(180, NaN)
            })));



    neuesDiagramm.addDiagramListener("Modified", function(e) {

        var button = document.getElementById("savior");
    if (button) button.disabled = !neuesDiagramm.isModified;
    var idx = document.title.indexOf("*");
    if(!neuesDiagramm.model.nodeDataArray == []) {
    //setTimeout(sendVerData("modella"), 1000);
    if (neuesDiagramm.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.slice(0, idx);
    }}});




function modaler() {
    var modal=document.getElementById("exampleModal").attributes;
    console.log("$('#exampleModal').showModal()");
    console.log(modal[5]);
    if(modal[5] == 'aria-hidden="true"') {       $('#exampleModal').modal('hide');
}
    else {$('#exampleModal').modal('show');}
}






// Unter diesem Kommentar befindet sich der Code um ein temporäres Diagramm
// zu definieren und mit den vollen Funktionen zu initialisieren
// DAS HIER SOLLTE MÖGLICHST ALS GANZER BLOCK AM ENDE STEHEN



function diaTemp(einnummer) {


    if(kurzDiagramm) {kurzDiagramm.div=null;}
    kurzDiagramm=null;
    document.getElementById("tempspeichern").setAttribute("onclick",`sendDatar(${einnummer})`);

    kurzDiagramm = jo(go.Diagram, "tempDia", {


        "grid.visible": true,
        "grid.gridCellSize": new go.Size(25, 25),
        //"commandHandler.copiesParentKey": false,

            //"clickCreatingTool.isGridSnapEnabled":true
            "undoManager.isEnabled": true,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
//beim Doppelclick in den Hintergrund wird ein neuer Knoten erstellt
          //  "clickCreatingTool.archetypeNodeData": neuerKnoten,


        //Eventuell im Html Document unsichtbar den Punkt zwischenspeichern und von "außen" die initialPosition setzen!
        //initialPosition: new go.Point(parseFloat(modelCenter[0])-960,parseFloat(modelCenter[1])),
        scale:0.2,


          });


// Addons für Bewegliche Linkbeschreibungen und Zoom
            kurzDiagramm.toolManager.mouseMoveTools.insertAt(0, new LinkLabelOnPathDraggingTool());
            //kurzDiagramm.toolManager.mouseMoveTools.insertAt(1, new DragZoomingTool());

    let geoReshape = new GeometryReshapingTool();
   /*
    geoReshape.handleArchetype=
        jo(go.Shape,
                 {fill:"blue",
                     minSize:new go.Size(16,16)});


    */

    kurzDiagramm.toolManager.mouseDownTools.insertAt(3, geoReshape);
   // kurzDiagramm.toolManager.mouseDownTools.next;
   // kurzDiagramm.toolManager.mouseDownTools.next;
   // kurzDiagramm.toolManager.mouseDownTools.next;
    kurzDiagramm.toolManager.mouseDownTools.each(function(e){
    if(e.Ra == "GeometryReshaping") {
       kurzDiagramm.model.startTransaction("adornment");
       kurzDiagramm.toolManager.resizingTool.maxSize = new go.Size(100000,100000);
       kurzDiagramm.toolManager.resizingTool.minSize = new go.Size(1200,1200);

             kurzDiagramm.toolManager.linkReshapingTool.handleArchetype =
      jo(go.Shape, "RoundedRectangle",
          { width: 16, height: 16, fill: "dodgerblue",
          stroke:"transparent", strokeWidth:40 });
        kurzDiagramm.toolManager.linkReshapingTool.midHandleArchetype =
    jo(go.Shape, "RoundedRectangle",
          { width: 16, height: 16, fill: "white",
          stroke:"transparent", strokeWidth:40 });

            kurzDiagramm.toolManager.resizingTool.handleArchetype =
    jo(go.Panel, "Auto",
      jo(go.Shape, "RoundedRectangle",
        { name: "", fill: "dodgerblue", stroke: "transparent", strokeWidth:66,
            margin:-10,

            minSize:new go.Size(32,32),
        maxSize:new go.Size(64,64),}));

//            console.log(e.handleArchetype.Rn.width = 40);
    kurzDiagramm.model.commitTransaction("adornment");}
    });
    kurzDiagramm.scrollMode = go.Diagram.InfiniteScroll;

              kurzDiagramm.toolManager.dragSelectingTool.isPartialInclusion = true;
              kurzDiagramm.toolManager.dragSelectingTool.box =
    jo(go.Part,
      { layerName: "Tool" },
      jo(go.Shape, "RoundedRectangle",
        { name: "SHAPE", fill: null, stroke: "white", strokeWidth: 8 })
    );

//Zentriert ausgewähltes Element
            kurzDiagramm.addDiagramListener("LinkDrawn", function(e) {
                var part = e.subject;

                kurzDiagramm.startTransaction("gibt Link Farbe");
                kurzDiagramm.model.setCategoryForLinkData(part.data,"linkTem");
                kurzDiagramm.model.setDataProperty(part.data,"color", "green");
                kurzDiagramm.model.setDataProperty(part.data,"scale", "1.0");
                //kurzDiagramm.model.setDataProperty(part.data,"linkbreite", "1.0");
                kurzDiagramm.model.setDataProperty(part.data,"linklabel", true);
                //kurzDiagramm.model.setDataProperty(part.data,"linkbreite", "30.0");

                kurzDiagramm.commitTransaction("gibt Link Farbe");
                console.log(part.data.color);


            });

                /*
                if(e)
                {
                    console.log(e);

                }

                kurzDiagramm.centerRect(new go.Rect(kurzDiagramm.lastInput.documentPoint.x,kurzDiagramm.lastInput.documentPoint.y,0,0));
                });


            kurzDiagramm.addDiagramListener("InitialLayoutCompleted", function(e) {
        console.log(e);
            });
*/
            //kurzDiagramm.layout = jo(go.TreeLayout);

      kurzDiagramm.commandHandler.archetypeGroupData =
    { isGroup: true, color: "blue" };

  kurzDiagramm.addModelChangedListener(function(evt) {
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
    return kurzDiagramm;
  });


            //Diagrammlistener der bei Änderungen die Speicherfunktion ermöglicht
            // und nach 34 Sekunden autospeichert


//Gibt Inhalt des geladenen Models in der Konsole aus
//    console.log("kurzDiagramm.model");
//    console.log(kurzDiagramm.model);


    kurzDiagramm.model = new go.GraphLinksModel([], []); //Modelinitialisierung als GraphlinksModel nötigf






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

//Leider kann hier kein individuelles Binding erstellt werden,
// die Click Funktion ist bei allen Buttons gleich, auf das individuelle "c" kann nicht zugegriffen werden >:o

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
            )
)
)
;



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



var mingroup =
    jo(go.Node, "Auto",
    {visible:false});

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
            {
                //click: neuerUntereintrag
                   }

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
      var cat = kurzDiagramm.model.getCategoryForNodeData(node.data);
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
          kurzDiagramm.startTransaction("einausblenden");
          kurzDiagramm.model.setDataProperty(node.data, "expand", !aktuell);
          kurzDiagramm.model.setDataProperty(node.data, "klein", aktuell);
          if(node.data.klein == false){
          kurzDiagramm.scale = 1.3;
          kurzDiagramm.centerRect(new go.Rect(e.documentPoint.x+0,e.documentPoint.y, 0,0));
          console.log("in if schleife");
          }


          kurzDiagramm.commitTransaction("einausblenden");

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


            jo(go.TextBlock, "auch mit Text",
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
                                //new go.Size(Math.abs(kurzDiagramm.findNodeForKey(from).dg.x-kurzDiagramm.findNodeForKey(to).dg.x), NaN),
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
                            kurzDiagramm.startTransaction("logiktext ein-ausblenden");
                            kurzDiagramm.model.setDataProperty(obj.part.data,"visible", !obj.part.data.visible);
                            kurzDiagramm.commitTransaction("logiktext ein-ausblenden")}
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
                strokeWidth:26,
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







//kurzDiagramm.nodeTemplate =
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
              var selnode = diagram.selection.first();  // assume just one Node in selection
                console.log(diagram.selection.first().data.group);
                    diagram.selection.each(function(a){console.log(a.data)});
                console.log(node.data.key);
                kurzDiagramm.model.startTransaction("Zu Gruppe");

                let hintergruppe = false;
                let gibtgruppe = false;

                diagram.selection.each(function(i){
                    if(i.data.isGroup == true && i.data.group == "") {
                        kurzDiagramm.model.setDataProperty(i.data, "group", node.data.key);
                        hintergruppe = true;
                    }
});

                diagram.selection.each(function(o){
                    kurzDiagramm.model.setDataProperty(o.data, "group", node.data.key);
                });
                //kurzDiagramm.model.setDataProperty(selnode.data, "group", node.data.key);
                console.log(diagram.selection.first().data.group);

                kurzDiagramm.model.commitTransaction("Zu Gruppe");

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
    jo("Button",
        new go.Binding("visible","zu").makeTwoWay(),

             {margin:20,
                 alignment:new go.Spot(0.05,0,0,0),

                 scale:5,
                 maxSize:new go.Size(300,NaN),

 click:function(e,obj){
        kurzDiagramm.model.startTransaction("ok");

                             e.diagram.commandHandler.expandSubGraph(obj.part);
                             kurzDiagramm.model.setDataProperty(obj.part.data, "zu", false);
                             kurzDiagramm.model.setDataProperty(obj.part.data, "auf", true);
                             kurzDiagramm.model.commitTransaction("ok");


                             obj.part.memberParts.each(function(e) {
                                 console.log(e.data.info);
            if (e.category== "mingroup" && e.data.info) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "simple");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwer) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "idea");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwa) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "kommentar");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.qwo) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "logiktemplate");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.wa) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "helptemplate");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                             })}},
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
                             kurzDiagramm.model.startTransaction("ok");


                obj.part.memberParts.each(function(e) {
                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "mingroup");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");});




                kurzDiagramm.model.setDataProperty(obj.part.data, "zu", true);
                kurzDiagramm.model.setDataProperty(obj.part.data, "auf", false);
                             e.diagram.commandHandler.collapseSubGraph(obj.part);
//                             kurzDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);
                         kurzDiagramm.model.commitTransaction("ok");

                         } },
                         jo(go.TextBlock, "Minimieren",
                             new go.Binding("visible","auf").makeTwoWay(),
                               {
                                   alignment:new go.Spot(0.5,0,0,0),
                                   textAlign:"center",
})),
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
                            kurzDiagramm.startTransaction("logiktext ein-ausblenden");
                            console.log(obj.part.data);
                            if(obj.part.data.category == "detailGruppe")
                            {
                                kurzDiagramm.model.setCategoryForNodeData(obj.part, "grouptemp");}
                            else if(obj.part.data.category == "grouptemp")
                            {
                                kurzDiagramm.model.setCategoryForNodeData(obj.part, "detailGruppe");}
                            kurzDiagramm.commitTransaction("logiktext ein-ausblenden")},
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
                kurzDiagramm.model.startTransaction("Zu Gruppe");

                let hintergruppe = false;
                let gibtgruppe = false;

                diagram.selection.each(function(i){
                    if(i.data.isGroup == true && i.data.group == "") {
                        kurzDiagramm.model.setDataProperty(i.data, "group", node.data.key);
                        hintergruppe = true;
                    }
});

                diagram.selection.each(function(o){
                    kurzDiagramm.model.setDataProperty(o.data, "group", node.data.key);
                });
                //kurzDiagramm.model.setDataProperty(selnode.data, "group", node.data.key);
                console.log(diagram.selection.first().data.group);

                kurzDiagramm.model.commitTransaction("Zu Gruppe");

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
        stroke:"black"}),

                        jo("Button",
                    new go.Binding("visible","zu").makeTwoWay(),

                         {margin:20,
                             alignment:new go.Spot(0.05,0,0,0),

                             scale:5,
                             maxSize:new go.Size(300,NaN),
click:function(e,obj){
        kurzDiagramm.model.startTransaction("ok");

                             e.diagram.commandHandler.expandSubGraph(obj.part);
                             kurzDiagramm.model.setDataProperty(obj.part.data, "zu", false);
                             kurzDiagramm.model.setDataProperty(obj.part.data, "auf", true);
                             kurzDiagramm.model.commitTransaction("ok");


                             obj.part.memberParts.each(function(e) {
                                 console.log(e.data.info);
            if (e.category== "mingroup" && e.data.info) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "simple");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwer) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "idea");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");

            }
                              else if (e.category== "mingroup" && e.data.qwa) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "kommentar");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.qwo) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "logiktemplate");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                              else if (e.category== "mingroup" && e.data.wa) {

                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "helptemplate");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");}

                             })}},
            jo(go.TextBlock, "Expandieren"),
            new go.Binding("visible","zu").makeTwoWay(),
            {
}),
                            jo("Button",
                         new go.Binding("visible","auf").makeTwoWay(),

                                {margin:20,
                                    alignment:new go.Spot(0.05,0,0,0),

                             scale:5,
                             maxSize:new go.Size(300,NaN),
                             //alignment:new go.Spot(0.1,0,0,0),
                                       click:function(e,obj){
                             kurzDiagramm.model.startTransaction("ok");


                obj.part.memberParts.each(function(e) {
                kurzDiagramm.model.startTransaction("Kleiner Umweg");
                kurzDiagramm.model.setCategoryForNodeData(e.data, "mingroup");
                kurzDiagramm.model.commitTransaction("Kleiner Umweg");});




                kurzDiagramm.model.setDataProperty(obj.part.data, "zu", true);
                kurzDiagramm.model.setDataProperty(obj.part.data, "auf", false);
                             e.diagram.commandHandler.collapseSubGraph(obj.part);
//                             kurzDiagramm.model.setDataProperty(obj.part.data, "isSubGraphExpanded",false);
                         kurzDiagramm.model.commitTransaction("ok");

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
                            kurzDiagramm.startTransaction("logiktext ein-ausblenden");
                            console.log(obj.part.data);
                            if(obj.part.data.category == "detailGruppe")
                            {console.log(1);
                                kurzDiagramm.model.setCategoryForNodeData(obj.part, "grouptemp");}
                            else if(obj.part.data.category == "grouptemp")
                            {console.log(2);
                                kurzDiagramm.model.setCategoryForNodeData(obj.part, "detailGruppe");}
                            kurzDiagramm.commitTransaction("logiktext ein-ausblenden")},
                margin:40,
            minSize:new go.Size(1000,1000),
            maxSize:new go.Size(NaN,NaN),

            opacity:0.5})
 ,
        jo(go.Placeholder,    // represents the area of all member parts,
          {padding: 240,
          isPanelMain:true}))

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

kurzDiagramm.groupTemplateMap = grouMap;
//kurzDiagramm.groupTemplate =  kurzDiagramm.groupTemplateMap;
//kurzDiagramm.groupTemplateMap.add("grouptemp", grouptemp);

//kurzDiagramm.groupTemplateMap.add("detailGruppe", detailGruppe);

var linktemplateMap = new go.Map();
linktemplateMap.add("linkTem",linkTem);
linktemplateMap.add("lili",lili);


kurzDiagramm.nodeTemplateMap = templateMap;
kurzDiagramm.linkTemplateMap = linktemplateMap;
    //MUSS NOCH FUNKTIONALITÄT EINGEBAUT WERDEN:



        kurzDiagramm.nodeTemplateMap.get("kommentar").contextMenu=
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

    kurzDiagramm.nodeTemplateMap.get("helptemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Antwort?!"),
            { click: function(e, obj) {
                    var node = obj.part;
                    console.log("node.scale");
                    console.log(node.data.category);

                    kurzDiagramm.startTransaction("Beantworten");
                    let check = true;
            if(node.data.category == "answertemplate"){kurzDiagramm.model.setCategoryForNodeData(node.data, "helptemplate");
                check= false;}

            else if(check){kurzDiagramm.model.setCategoryForNodeData(node.data, "answertemplate");}

                    kurzDiagramm.commitTransaction("Beantworten");
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

        kurzDiagramm.nodeTemplateMap.get("answertemplate").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Antwort?!"),
            { click: function(e, obj) {
                    var node = obj.part;
                    console.log("node.scale");
                    console.log(node.data.category);

                    kurzDiagramm.startTransaction("Beantworten");
                    let check = true;
            if(node.data.category == "answertemplate"){kurzDiagramm.model.setCategoryForNodeData(node.data, "helptemplate");
                check= false;}

            else if(check){kurzDiagramm.model.setCategoryForNodeData(node.data, "answertemplate");}

                    kurzDiagramm.commitTransaction("Beantworten");
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




    console.log(kurzDiagramm.nodeTemplateMap.get("simple"));
    console.log(kurzDiagramm.nodeTemplateMap.first());
              kurzDiagramm.nodeTemplateMap.get("simple").contextMenu=
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
                kurzDiagramm.linkTemplateMap.get("linkTem").contextMenu=
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

            kurzDiagramm.startTransaction("Linkkategorie wechseln");

            kurzDiagramm.model.setCategoryForLinkData(link,"lili");


            kurzDiagramm.commitTransaction("Linkkategorie wechseln");
            } }));


                kurzDiagramm.linkTemplateMap.get("lili").contextMenu=
        jo("ContextMenu",
          jo("ContextMenuButton",
            jo(go.TextBlock, "Linkkategorie wechseln"),
            { click: function(e, obj) {
            let link = obj.part.data;
            kurzDiagramm.startTransaction("Linkkategorie wechseln");

            kurzDiagramm.model.setCategoryForLinkData(link,"linkTem");


            kurzDiagramm.commitTransaction("Linkkategorie wechseln");
            } }),
          jo("ContextMenuButton",
            jo(go.TextBlock, "Logische Verknüpfung wechseln"),
            { click: function(e,obj){logik(e,obj)}}),
                          jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));

        kurzDiagramm.nodeTemplateMap.get("logiktemplate").contextMenu=
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



              //Hintergrund
                kurzDiagramm.contextMenu =
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
            jo(go.TextBlock, "Neuer Logik-Knoten"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var logiKnoten = { color:"white", qwo:"eh", scale:"1.0", category:"logiktemplate", visible:true, visand:true, visor:false,visiff:false,vispim:false,visimp:false,visall:false, visex:false};
        //
            d.model.addNodeData(logiKnoten);
            part = d.findPartForData(logiKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten')
            }}),
      // no binding, always visible button:
      jo("ContextMenuButton",
        jo(go.TextBlock, "Neue Unklarheit"),
        { click: function(e, obj) {
          e.diagram.commit(function(d) {
            var data = {scale:"1.0",symbolfarbe:"green",color:"red",wa: " ",frage:"Frage oder Unklarheit", antwort:"Eine ErklärungErklärungErklärungErklärungErklärung", category:"helptemplate", hauptInfo:"nicht leer", visible:true};
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
                var neuerKnoten = { qwa:"so", scale:"1.0", category:"kommentar",color:"yellow",text:"Ergänzend:",expand:false, klein: true};
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
                var neuerKnoten = { category: "detailGruppe",isGroup:"True", group:"", color:"yellow", visible:"True", auf:"True", zu:"False",
                restInfo:"Definition oder Eigenschaften", textfarbe:"white", scale:1,
                info: [{ 'text': "Unterbegriff/Eigenschaft" , 'mehr':["mehr dazu"], 'c':1}], knotenfarbe:"green"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
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




        kurzDiagramm.nodeTemplateMap.get("allesSehen").contextMenu=
            jo("ContextMenu",
              jo("ContextMenuButton",
                jo(go.TextBlock, "Größer"),
                { click: function(e, obj) { newSizeChange(obj, 1.11); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Kleiner"),
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
                ));


        kurzDiagramm.nodeTemplateMap.get("idea").contextMenu=
            jo("ContextMenu",
              jo("ContextMenuButton",
                jo(go.TextBlock, "Größer"),
                { click: function(e, obj) { newSizeChange(obj, 1.08); } }),
              jo("ContextMenuButton",
                jo(go.TextBlock, "Kleiner"),
                { click: function(e, obj) { newSizeChange(obj, 0.95); } }),
                              jo("ContextMenuButton",
                  jo(go.TextBlock, "Ausgruppieren"),
                { click: function(e, obj) { e.diagram.model.setDataProperty(obj.part.data, "group", "") }}
                ));





fetchdiar(einnummer);


}

        neuesDiagramm.nodeTemplateMap.get("").contextMenu=
  jo("ContextMenu",
             jo("ContextMenuButton",
             jo(go.TextBlock, "Diagramm einblenden"),
                 {click:function(e,obj){
                                         console.log("obj.part.data");


                    console.log(obj.part.data.id);
                     modaler();
                    diaTemp(parseInt(obj.part.data.id));
                 }}));


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
            jo(go.TextBlock, "Neuer Logik-Knoten"),
            {click: function(e,obj){
            e.diagram.commit(function(d) {
                var logiKnoten = { color:"white", qwo:"eh", scale:"1.0", category:"logiktemplate", visible:true, visand:true, visor:false,visiff:false,vispim:false,visimp:false,visall:false, visex:false};
        //
            d.model.addNodeData(logiKnoten);
            part = d.findPartForData(logiKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neuer Allesknoten')
            }}),
      // no binding, always visible button:
      jo("ContextMenuButton",
        jo(go.TextBlock, "Neue Unklarheit"),
        { click: function(e, obj) {
          e.diagram.commit(function(d) {
            var data = {scale:"1.0",symbolfarbe:"green",color:"red",wa: " ",frage:"Frage oder Unklarheit", antwort:"Eine ErklärungErklärungErklärungErklärungErklärung", category:"helptemplate", hauptInfo:"nicht leer", visible:true};
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
                var neuerKnoten = { qwa:"so", scale:"1.0", category:"kommentar",color:"yellow",text:"Ergänzend:",expand:false, klein: true};
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
                var neuerKnoten = { isGroup:"True", group:"", text:"Gruppe"};
        //
            d.model.addNodeData(neuerKnoten);
            part = d.findPartForData(neuerKnoten);  // must be same data reference, not a new {}
            // set location to saved mouseDownPoint in ContextMenuTool
            part.location = d.toolManager.contextMenuTool.mouseDownPoint;
                },'neue Gruppe');}}),

              jo("ContextMenuButton",
        jo(go.TextBlock, "Undo"),
        { click: function(e, obj) { e.diagram.commandHandler.undo(); } },
        new go.Binding("visible", "", function(o) { return o.diagram.commandHandler.canUndo();}).ofObject()),
      jo("ContextMenuButton",
        jo(go.TextBlock, "Redo"),
        { click: function(e, obj) { console.log(e.diagram.toString())} },
        new go.Binding("text", "", function(o) {
            return o.diagram.commandHandler.canRedo();}).ofObject()));
        fetchdia();
    }

    function locator() {
        return [
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            locationSpot: go.Spot.TopLeft
          }
        ];
      }

      function frageEinAusblenden(e, obj) {

               e.diagram.commit(function(d) {
                   kurzDiagramm.model.setDataProperty(obj.part.data, "visible", !obj.part.data.visible);


               })}


function zentrierAlles(e,obj){
               kurzDiagramm.centerRect(new go.Rect(e.documentPoint.x+0,e.documentPoint.y+100, 0,0));
               console.log(obj.part.data.info);
               neuesDiagramm.scale=0.6;
}


function machNeuenUntereintrag(e, obj) {


                        node = obj.part;
                        console.log("aktuelle info ist: ");

                        console.log(node.data);
                        //console.log(obj.part.data);
                        kurzDiagramm.model.startTransaction("neuer UBText");
                        if(node.data.info) {
                            let neuU = {
                                text: 'Ein Eigenschaftsname',
                                mehr: ["Mehr"],
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

                            kurzDiagramm.model.startTransaction("neuInfo");

                            kurzDiagramm.model.addArrayItem(node.data.info, neuU);
                            console.log("der key  hier ist: ");
                            console.log(node.data.key);
                            console.log("neuer eintrag hier ist: ");
                            console.log(neuU);
                            //kurzDiagramm.model.add(node.data, "info", ez);
                            kurzDiagramm.commitTransaction("neuInfo");
                            //kurzDiagramm.model.insertArrayItem(node.data.restInfo, node.data.restInfo.length, neu);
                            kurzDiagramm.model.commitTransaction("neuer UBText");
                            console.log(obj.part.data.info);
                        }

                  }



function linkDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
        var thislink = clicked.data;
    }

    //Kann nötig werden direkt auf die Positionen zuzugreifen
    //console.log(Math.abs(kurzDiagramm.findNodeForKey(thislink.from).dg.x-kurzDiagramm.findNodeForKey(thislink.to).dg.x));
    console.log(e);
    console.log(e.diagram);
    e.diagram.startTransaction("changeLink");

    if (thislink.visible == false) {
        e.diagram.model.setDataProperty(thislink, "visible", true);
    } else {
        e.diagram.model.setDataProperty(thislink, "visible", false);
    }
    e.diagram.commitTransaction("changeLink");

}

//Funktion die Hinter- und Vordergrund jeweils ein- oder ausblendet
    function einblenden(e, obj) {
        var node = obj.part;
        var data = node.data;

        kurzDiagramm.startTransaction("neue Sicht");

         if (data.vordergrund == false) {
            kurzDiagramm.model.setDataProperty(data, "hintergrund", false);
            kurzDiagramm.model.setDataProperty(data, "vordergrund", true);
        } else if (data.vordergrund == true) {
            kurzDiagramm.model.setDataProperty(data, "hintergrund", true);
            kurzDiagramm.model.setDataProperty(data, "vordergrund", false);
        }
        else if (!data.vordergrund) {
            kurzDiagramm.model.setDataProperty(data, "vordergrund", true);
            kurzDiagramm.model.setDataProperty(data, "hintergrund", false);

        }
        kurzDiagramm.commitTransaction("neue Sicht");

    }
function sizer() {
        return [
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

        ];
      }


    function newSizeChange( obj, sz) {
    var node = obj.part;

    console.log(node.data);
    if (node.data.scale ){

        kurzDiagramm.startTransaction("Change Text Size");
        if(node.data.category !== "simple") {
            let neuScale = parseFloat(node.data.scale) * sz;
            if (node.data.scale > 22) {
                alert("Maximalgröße erreicht");
                node.data.scale = 22.0
            }
            if( node.data.category == "idea") {
                neuScale=neuScale*((sz+3)/4);
                neuScale.toString();
                kurzDiagramm.model.setDataProperty(node.data, "scaleText", neuScale);}

            neuScale = neuScale.toString();
            console.log(node.data.scale);


        kurzDiagramm.model.setDataProperty(node.data, "scale", neuScale);


        }
        else if (node.data.category == "simple") {

            let neuScale = parseFloat(node.data.scaleZu) * sz;

            if (node.data.scaleZu > 22) {
                alert("Maximalgröße erreicht");
                node.data.scaleZu = 22.0}

            kurzDiagramm.model.setDataProperty(node.data, "scaleZu", neuScale);

        }
        kurzDiagramm.commitTransaction("Change Text Size");

    }
    }


function nodeDoubleClick(e, obj) {
    var clicked = obj.part;
    if (clicked !== null) {
      var ersterKnoten = clicked.data;
      kurzDiagramm.startTransaction("add infoblock");
      var neuerKnoten = { hauptInfo: "Etwas Neues", key:ersterKnoten.key+1, restInfo:"mehr dazu",definition:"Erstmal Definieren.", hintergrund:true, vordergrund:false, category: "allesSehen",             info: [
              { text: "Unterbegriff/Eigenschaft" , mehr:["mehr dazu"], c:1},
            ]};
      kurzDiagramm.model.addNodeData(neuerKnoten);
      kurzDiagramm.model.addLinkData({ from: ersterKnoten.key, to: neuerKnoten.key });
      kurzDiagramm.commitTransaction("add infoblock");
    }
    }

