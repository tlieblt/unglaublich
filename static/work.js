var jo = go.GraphObject.make;
//alert("hallo, ick heb jeladen");
var nodeDataArray = [
    {key: "Model"},
    {key: "View"},
    {key: "Controller"},
    {key: "Crontroller"}
];
var DiagramConnections = [
    {to:"Model", from:"View"},
    {to: "View", from:"Model"},
    {to: "Controller", from:"Model"},
    {to: "Controller", from:"View"}
];
var mDiagram = jo(go.Diagram, "mainDiagram");
mDiagram.model = new go.GraphLinksModel(nodeDataArray,DiagramConnections);

var input = document.getElementById("dieInfo");
input.addEventListener("keyup", function(event) {
    if(event.keyCode != undefined) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("senderino").click();
        }
    }
});

function addData() {
    var toAdd = document.getElementById("dieInfo").value;
    mDiagram.add(
    jo(go.Node, go.Panel.Auto,
      jo(go.Shape,
        { figure: "RoundedRectangle",
          fill: "lightblue" }),
      jo(go.TextBlock,
        { text: toAdd,
          margin: 5 })
));
    document.getElementById('dieInfo').value = ''
    onsubmit.preventDefault();
    javascript:void(0);
}

// Get the input field
var input = document.getElementById("dieInfo");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("myBtn").click();
  }
});


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