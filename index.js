
var stage;

var container = document.getElementById('container');
var eraser = document.getElementById('eraser');
var gen = document.getElementById('gen');

var layer = new Konva.Layer();

var startPos, lastLine;

var ellipse, currentNode, tr1, count=0;

drawImage();

var tools = {
  rect: {
    isSelected: false,
    isDrawing: false,
    isTransform: false
  },
  ellipse: {
    isSelected: false,
    isDrawing: false,
    isTransform: false
  },
  eraser: {
    isSelected: false,
    isDrawing: false,
    isTransform: false
  },
  pen: {
    isSelected: true,
    isDrawing: false
  },
  gen: {
    isSelected: false,
    isDrawing: false
  }
};
var selectedTool = 'pen';
const shapeTools = ['rect', 'circle'];

addToolbarEvents();

function addToolbarEvents() {
  let toolEls = document.getElementById('toolbar').getElementsByClassName('toolbar-item');
  Array.prototype.forEach.call(toolEls, item => {
    item.addEventListener('click', function(e) {
      container.style.cursor = 'default';
      tools[selectedTool].isSelected = false;
      tools[selectedTool].isDrawing = false;
      tools[selectedTool].isTransform = false;
      document.getElementById(selectedTool).style.borderColor = '#999';
      tools[item.id].isSelected = true;
      selectedTool = item.id;
      if (shapeTools.includes(selectedTool)) container.cursor = 'crosshair';
      document.getElementById(selectedTool).style.borderColor = '#87CEFA';
    })
  });
}

eraser.addEventListener('click', function(e) {
  let nodes = stage.find('.settled');
  nodes.each(function(node) {
    node.destroy();
  });
  nodes = stage.find('#current');
  nodes.each(function(node) {
    node.destroy();
  });
  tr1 && tr1.destroy();
  layer.batchDraw();
});

gen.addEventListener('click', function(e) {
  tr1 && tr1.destroy();
  let nodes = stage.find('.settled');
  nodes.each(function(node) {
    node.fill('white');
  });
  nodes = stage.find('#current');
  nodes.each(function(node) {
    node.fill('white');
  });
  var img = stage.toDataURL();
  var imageWrapper = document.getElementById('image-wrapper');
  var imgEl = document.createElement('img');
  imgEl.src = img;
  imageWrapper.append(imgEl);
});

function drawImage() {
  var imageObj = new Image();
  imageObj.onload = function() {
    stage = new Konva.Stage({
      container: 'container',
      width: imageObj.width,
      height: imageObj.height
    });
    var image = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: imageObj.width,
      height: imageObj.height
    });
    layer.add(image);
    layer.batchDraw();
    stage.add(layer);
    addMouseEvents();
  };
  imageObj.src = './test.jpg';
}

function addMouseEvents() {
  stage.on('mousedown touchstart', function(e) {
    let pos = stage.getPointerPosition();
    startPos = pos;
    if (!tools[selectedTool].isDrawing) {
      let node = null;
      if (stage.find('#current').length) {     
        node = stage.find('#current')[0];
      }
      if (tools[selectedTool].isTransform && selectedTool !== 'pen') {
        if (tr1.isTransforming() || (node && node.intersects(pos))) {
          // 在刚完成绘制的图形内部按下并移动鼠标，不会开始新的绘制，而是拖动图形
          return;
        } else {
          // 否则开始新的绘制，并清除scaling
          if (node) node.setAttr('draggable', false);
          startDrawing(pos);
        }
      }
      // 新绘制
      // 可能选择了另一图形工具，此时需要将上一次的Transformer清除，并重置current node
      else {
        if (node) node.setAttr('draggable', false);
        startDrawing(pos);
      }
    }
  });

  stage.on('mousemove touchmove', function(e) {
    if (!tools[selectedTool].isDrawing) return;
    let curPos = stage.getPointerPosition();
    if (curPos.x === startPos.x && curPos.y === startPos.y) return; // 阻止按下鼠标不拖动时的mousemove事件
    switch(selectedTool) {
      case 'pen':
        freeDraw(curPos.x, curPos.y);
        break;
      case 'ellipse':
        if (tools.ellipse.isTransform) return;
        drawEllipse(curPos.x, curPos.y);
        break;
      case 'rect':
        if (tools.rect.isTransform) return;
        drawRect(curPos.x, curPos.y);
        break;
      default:
        break;
    }
  })

  stage.on('mouseup touchend', function() {
    if (tools[selectedTool].isDrawing) {
      tools[selectedTool].isDrawing = false;
      if (selectedTool === 'pen') {
        lastLine.setAttr('closed', true);
        layer.batchDraw();
      }
      let node = stage.find('#current')[0];
      if (node) {
        tools[selectedTool].isTransform = true;
        tr1 = new Konva.Transformer({
          node,
          centeredScaling: true,
          id: 'tr1'
        });
        layer.add(tr1);
        layer.draw();
      }
    }
  });
}

function startDrawing(pos) {
  tr1 && tr1.destroy();
  node = stage.find('#current')[0];
  if (node) {
    node.setAttr('id', `settled${count}`);
    node.setAttr('name', 'settled');
    count++;
  }
  if (selectedTool === 'pen') {
    lastLine = new Konva.Line({
      stroke: 'white',
      strokeWidth: 5,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y]
    });
    layer.add(lastLine);
  }
  tools[selectedTool].isDrawing = true;
  tools[selectedTool].isTransform = false;
}

function freeDraw(curX, curY) {
  var newPoints = lastLine.points().concat([curX, curY]);
  lastLine.points(newPoints);
  layer.batchDraw();
}

function drawRect(curX, curY) {
  const x = startPos.x;
  const y = startPos.y;
  const width = Math.abs(curX - x);
  const height = Math.abs(curY - y);
  var oldRect = stage.find('.rect');
  oldRect.forEach(item => item.destroy());
  rect = new Konva.Rect({
    x,
    y,
    width,
    height,
    stroke: 'white',
    strokeWidth: 4,
    name: 'rect',
    draggable: true
  });

  rect.setAttr('id', 'current');

  layer.add(rect);

  layer.draw();
}

function drawEllipse(curX, curY) {
  let startX = startPos.x;
  let startY = startPos.y;
  let x = (curX + startX) / 2;
  let y = (curY + startY) / 2;
  let radiusX = Math.abs(curX - startX) / 2;
  let radiusY = Math.abs(curY - startY) / 2;
  var oldEllipse = stage.find('.ellipse');
  oldEllipse.forEach(item => item.destroy());
  ellipse = new Konva.Ellipse({
    x,
    y,
    radiusX,
    radiusY,
    stroke: 'white',
    strokeWidth: 4,
    name: 'ellipse',
    draggable: true
  });

  ellipse.setAttr('id', 'current');

  layer.add(ellipse);

  layer.draw();
}
