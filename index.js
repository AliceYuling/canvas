var stage = new Konva.Stage({
  container: 'container',
  width: 500,
  height: 500
});

var layer = new Konva.Layer();

stage.add(layer);

var circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4
});

circle.draggable('true');

layer.add(circle);

layer.draw();