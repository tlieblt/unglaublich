var jo = go.GraphObject.make;
var model_id;
//alert("hallo, ick heb jeladen");
var nodeDataArray = [
    {key: "Informationen über die Welt"},
    {key: "Struktur"},
    {key: "Lernen"},
    {key: "(Re-)Präsentation"}
];
var DiagramConnections = [
    {to:"Struktur", from:"Informationen über die Welt"},
    {to: "(Re-)Präsentation", from:"Struktur"},
    {to: "Lernen", from:"(Re-)Präsentation"},
    {to: "Lernen", from:"Struktur"},
    {to: "(Re-)Präsentation", from:"Lernen"}
    ];
var mDiagram = jo(go.Diagram, "mainDiagram");
mDiagram.model = new go.GraphLinksModel(nodeDataArray,DiagramConnections);
style_dia();

//Sendet Modellnamen mit Enter
var input = document.getElementById("dieInfo");
input.addEventListener("keyup", function(event) {
    if(event.keyCode != undefined) {
        if (event.keyCode === 13) {
            //event.preventDefault();
            addData();
        }
    }
});
//Sendet Modellinhalt mit Enter
var input = document.getElementById("derTitel");
input.addEventListener("keyup", function(event) {
    if(event.keyCode != undefined) {
        if (event.keyCode === 13) {
            unhide();
            //event.preventDefault();
        }
    }
});




function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    mDiagram.startTransaction("make new node");
    mDiagram.model.addNodeData({key:toAdd});
    mDiagram.commitTransaction("make new node");
    document.getElementById('dieInfo').value = ''
}


function sendData() {
    let modelAsJson = mDiagram.model.toJson();
    let xhr = new XMLHttpRequest();
    let url = "/save";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(modelAsJson.toString());
    xhr.send(modelAsJson);
}

function sendModelName(){
    let title=document.getElementById('derTitel').value;

     fetch(`${window.origin}/save`, {
         method: "POST",
         body: title,
         headers: new Headers({
             "content-type": "text/html;charset=UTF-8"
         })
     }).then((response) => response.text())
         .then(function (response) {
             console.log(response)
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





function unhide() {
    let indic =document.getElementById('zweitDiagramm');
    let tst = window.getComputedStyle(indic, null).getPropertyValue('visibility');
    sendModelName();
    getID();
    if(tst == 'hidden') {
        let eins = document.getElementById('eenfa');
        let zwei = document.getElementById('derTitel');
        let drei = document.getElementById('kreaD');

        drei.parentNode.removeChild(drei);
        zwei.parentNode.removeChild(zwei);
        eins.parentNode.removeChild(eins);

        let rest = document.getElementsByClassName('anfang');
        Array.from(rest).forEach((element) => {
                element.style.visibility='visible';
        })

    };
}


function senndData() {
    let modelAsJson = mDiagram.model.toJson();
    //modelAsJson= modelAsJson.toString();
    console.log(modelAsJson);
    let xhr = new XMLHttpRequest();
    let url = "/save";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(modelAsJson);

}
function getID() {

    var request = new XMLHttpRequest();

    request.open("GET", '/save');
    request.setRequestHeader("Content-Type", "gibID");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            model_id = request.responseText;
            console.log(model_id);
            return model_id;
        } else {
            console.warn(request.statusText, request.responseText);
            model_id=1;
        }
    });
    request.send();
    return model_id;
}

function getDiagramData() {

    let url = '/saved/';
    let d_id = '15';
    url.concat(d_id);
    console.log(url)
    urli="/saved/14"
    let request = new XMLHttpRequest();
    request.open("GET", url=urli);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);
            console.log('Im Json steht: ')
            console.log(model_json.key)
            var Diagram = jo(go.Diagram, "zweitDiagramm");
            Diagram.model = go.Model.fromJson(model_json);

        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

/*function addData1() {
    mDiagram.add(
    jo(go.Node, go.Panel.Auto,
      jo(go.Shape,
        { figure: "RoundedRectangle",
          fill: "lightblue" }),
      jo(go.TextBlock,
        { text: "tetzt",
          margin: 5 })
));
    alert("hoho");
    javascript:void(0);
}
*/

//alert(document.querySelector("nInfo").value);
//document.getElementById("dieInfo").addEventListener("",addData1);

function fillDiagram() {


}


function style_dia() {
    mDiagram.linkTemplate =

        jo(go.Link,
         { curve: go.Link.Bezier },  // Bezier curve
        jo(go.Shape,
          { strokeWidth: 3, stroke: 'green'}),
        jo(go.Shape,
          { toArrow: "NormalArrow", fill: 'grey', stroke: 'green', scale:1.5})

      );
    mDiagram.nodeTemplate =
        jo(go.Node, 'Auto',
        jo(go.Shape, 'RoundedRectangle', {fill: 'white', stroke: 'green', strokeWidth: 1 },
            new go.Binding("fill", "color"),
          { portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),

        jo(go.TextBlock, { margin: 8, font: "bold 14px sans-serif", stroke: '#111'}, // Specify a margin to add some room around the text
                    // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "key"))
);
}