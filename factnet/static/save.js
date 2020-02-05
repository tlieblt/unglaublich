var jo = go.GraphObject.make;
var model_id;
var neuesDiagramm;

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
var modellTitel = document.getElementById("derTitel");
modellTitel.addEventListener("keyup", function(event) {
    if(event.keyCode != undefined) {
        if (event.keyCode === 13) {
            unhide();
            //event.preventDefault();
        }
    }
});

function vanish(html_id) {
    let temp = document.getElementById(html_id);
    temp.parentNode.removeChild(temp);
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

    };

function make_dia() {
    neuesDiagramm = jo(go.Diagram, "mainDiagram");
    neuesDiagramm.model = new go.GraphLinksModel([], []);
    neuesDiagramm.animationManager.initialAnimationStyle = go.AnimationManager.AnimateLocations;
    style_dia();
}

function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    neuesDiagramm.startTransaction();
    neuesDiagramm.model.addNodeData({key:toAdd});
    neuesDiagramm.commitTransaction("make new node");
    document.getElementById('dieInfo').value = ''
}

function sendData() {
    console.log('url is : ')
    console.log(window.location.href)
    let modelAsJson = neuesDiagramm.model.toJson();
    let xhr = new XMLHttpRequest();
    let url = window.location.href;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log('folgendes json file wird geschickt: ')
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


function getID() {
    var request = new XMLHttpRequest();
    request.open("GET", '/save');
    request.setRequestHeader("Content-Type", "gibID");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            model_id = request.responseText;
            console.log(model_id)
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
    let request = new XMLHttpRequest();
    request.open("GET", url=window.location.href);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener('load', function (event) {
        if (request.status >= 200 && request.status < 300) {
            var model_json = JSON.parse(this.responseText);
            console.log(typeof(model_json))
            if(!neuesDiagramm) { make_dia() }
            neuesDiagramm.model = go.Model.fromJson(model_json);

        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
}

// Diagram style
function style_dia() {
    neuesDiagramm.linkTemplate =

        jo(go.Link,
         { curve: go.Link.Bezier },  // Bezier curve
        jo(go.Shape,
          { strokeWidth: 4, stroke: 'white'}),
        jo(go.Shape,
          { toArrow: "NormalArrow", fill: 'white', stroke: 'white', scale:1.5})

        //jo(go.Shape, new go.Binding("toArrow", "toArrow"), { scale: 2, fill: "#D4B52C" })
      );
    neuesDiagramm.nodeTemplate =
        jo(go.Node, 'Auto',
        jo(go.Shape, 'RoundedRectangle', {fill: 'white', stroke: 'gray', strokeWidth: 1 },
            new go.Binding("fill", "color"),
          { portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),

        jo(go.TextBlock, { margin: 8, font: "bold 14px sans-serif", stroke: '#111'}, // Specify a margin to add some room around the text
                    // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "key"))
);
}





