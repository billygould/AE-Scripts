/*
Programatically isolates and exports all layers in the current composition
one at a time, resulting in a number of exports equal to the number of 
layers, each containing just one solo'd layer.
*/

alert("Click OK to execute layer by layer.");

var comp = app.project.item(1);
var renderQueue = app.project.renderQueue;

var destination = Folder.selectDialog("Select Destination");
var fileName = prompt("Please Enter The File Name.");

for (var i = 1; i <= comp.layers.length; i++) {
    var currentLayer = comp.layer(i);

    if(currentLayer.enabled == true && currentLayer.selected == true) {

        currentLayer.solo = true;
        
        var renderQueueItem = renderQueue.items.add(comp);

        var outputModule = renderQueueItem.outputModule(1);
        outputModule.file = new File(String(destination) + "/" + fileName + i + ".mov");

        renderQueue.render();

        currentLayer.solo = false;
    }
}

