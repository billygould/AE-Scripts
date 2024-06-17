/*
This After Effects script adds a basic non-destructive CAMERA SHAKE setup to an after effects comp using the following steps.
- Adds a null layer
- Parents selected layer/comp to null
- Adds Slider Control effect and parents it to Wiggle expression
- Creates three keyframes with default value of 2.0 at middle keyframe

If there's already a null layer with the shake effect present, the script
will instead add three new keyframes begtinning at the playhead location
in order to add a second SHAKE to the composition.
*/
function cameraHit() {
    //get Comp
    var comp = app.project.activeItem;

    if (comp instanceof CompItem) {
        //get Current Layer and Effect Start time
        var currentLayer = comp.selectedLayers[0];
        if (currentLayer) {
            var effectStart = currentLayer.time;
        } else {
            alert("Please Select a Layer");
            return;
        }

        var intensity = 2
        var duration = 1.5

        //Check if currentLayer is parented to a null layer
        var isParentedToNull = false;

        if (currentLayer.parent !== null && currentLayer.parent instanceof AVLayer && currentLayer.parent.nullLayer) {
            isParentedToNull = true;
        }

        if (!isParentedToNull) {
            //Add null at effectStart and parent to currentLayer
            var newNull = comp.layers.addNull(duration);
            newNull.name = "CamShake_Null"
            newNull.startTime = effectStart;
            currentLayer.parent = newNull;

            //set Expressions
            var sliderExpression = 'effect("Slider Control")(1)';
            var wiggleExpression = 'wiggle(15,10*effect("Slider Control")("Slider"))';
            var rotateExpression = 'transform.rotation';

            //add Slider Control and its Expression
            var sliderEffect = newNull.property("Effects").addProperty("Slider Control");
            var sliderProperty = sliderEffect.property("Slider");
            sliderProperty.expression = sliderExpression;

            //add Wiggle and Rotation Expressions
            newNull.property("Position").dimensionsSeparated = true;
            newNull.property("Transform").property("X Position").expression = wiggleExpression;
            newNull.property("Transform").property("Y Position").expression = wiggleExpression;

            newNull.property("Transform").property("Rotation").expression = rotateExpression;

            //add repeTile
            currentLayer.property("Effects").addProperty("CC RepeTile")
            //set repeTile values
            var repeTile = currentLayer.property("Effects").property("CC RepeTile")
            for (var i = 1; i <= 4; i++) {
                repeTile.property(i).setValue(300)
            }
        } else {
            var sliderProperty = currentLayer.parent.property("Effects").property("Slider Control").property("Slider");
        }

        //place Keyframes
        sliderProperty.setValueAtTime(effectStart, 0.00);
        sliderProperty.setValueAtTime((effectStart + (duration / 3)), intensity);
        sliderProperty.setValueAtTime((effectStart + duration), 0.00);

        // Apply Easy Ease to the keyframes
        sliderProperty.setTemporalEaseAtKey(1, [new KeyframeEase(0.33, 33)], [new KeyframeEase(0.33, 33)]);
        sliderProperty.setTemporalEaseAtKey(2, [new KeyframeEase(0.33, 33)], [new KeyframeEase(0.33, 33)]);
        sliderProperty.setTemporalEaseAtKey(3, [new KeyframeEase(0.33, 33)], [new KeyframeEase(0.33, 33)]);
    } else {
        alert("Please select a comp.")
    }
}

cameraHit();