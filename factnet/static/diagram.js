// PLATZ FÜR CODE SNIPPETS

function wasgeht() {
    console.log("was geht");
    let mehrInfo = document.getElementById("mehrInfos");
    let hans = document.getElementById("spielplatz");

    var el = document.createElement("BUTTON");   // Create a <button> element

    var btn = document.createElement("BUTTON");   // Create a <button> element
    mehrInfo.appendChild(el);

    el.outerHTML = '<button id = "ahso" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong"> Launch demo modal </button><!-- Modal --> <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> <textarea class="form-control col-xs-12">JA JETZ</textarea> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary">Save changes</button> </div> </div> </div> </div>';
    //el.outerHTML ='<button type=\"button\" id="ahso" class=\"btn btn-secondary btn-sm\" data-toggle=\"modal\" data-target=\"#exampleModal\">Launch demo modal</button>\n';

    let ahso = document.getElementById("ahso");
    console.log("el ist: ");
    console.log(ahso.outerHTML);

    hans.appendChild(btn);
    //mehrInfo.appendChild(el);


    //let kindiButton = "ok"

    //hans.outerHTML = kindiButton;
}


var detailtemplate =
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          new go.Binding("fill", "color")),
        $(go.Panel, "Table",
          { defaultAlignment: go.Spot.Left },
          $(go.TextBlock, { row: 0, column: 0, columnSpan: 2, font: "bold 12pt sans-serif" },
            new go.Binding("text", "key")),
          $(go.TextBlock, { row: 1, column: 0 }, "Description:"),
          $(go.TextBlock, { row: 1, column: 1 }, new go.Binding("text", "desc")),
          $(go.TextBlock, { row: 2, column: 0 }, "Color:"),
          $(go.TextBlock, { row: 2, column: 1 }, new go.Binding("text", "color"))
        )
      ),
      $("Button",
        { alignment: go.Spot.TopRight },
        $(go.Shape, "AsteriskLine", { width: 8, height: 8 }),
        { click: changeCategory })
    );
