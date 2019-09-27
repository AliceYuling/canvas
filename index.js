var oriCanvas = document.getElementById('oriCanvas');
var maskCanvas = document.getElementById('maskCanvas');
var oriCtx = oriCanvas.getContext('2d');
var maskCtx = maskCanvas.getContext('2d');
var eraser = document.getElementById('eraser');
var pen = document.getElementById('pen');
var gen = document.getElementById('gen');
var circle = document.getElementById('circle');
var isPenSelected = true;
var isEraserSelected = false;
var img, isImgLoaded, isIconLoaded, isPainting, startX, startY, curX, curY, prevX, prevY, isClearing;
var tools = {
  rect: {
    isSelected: false,
    isDrawing: false
  },
  circle: {
    isSelected: false,
    isDrawing: false
  },
  eraser: {
    isSelected: false,
    isDrawing: false
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
var rectangle;

loadImage();
drawImage();
addToolbarEvents();

function addToolbarEvents() {
  let toolEls = document.getElementById('toolbar').getElementsByClassName('toolbar-item');
  Array.prototype.forEach.call(toolEls, item => {
    item.addEventListener('click', function(e) {
      maskCanvas.style.cursor = 'default';
      tools[selectedTool].isSelected = false;
      tools[selectedTool].isDrawing = false;
      tools[item.id].isSelected = true;
      selectedTool = item.id;
      if (shapeTools.includes(selectedTool)) maskCanvas.style.cursor = 'crosshair';
    })
  });
}

gen.addEventListener('click', function() {
  oriCtx.drawImage(maskCanvas, 0, 0);
  var resImg = oriCanvas.toDataURL();
  var resEl = document.createElement('img');
  resEl.src = resImg;
  document.getElementById('container').append(resEl);
});

maskCanvas.onmousedown = function(e) {
  tools[selectedTool].isDrawing = true;
  startX = e.pageX - maskCanvas.offsetLeft - 12;
  startY = e.pageY - maskCanvas.offsetTop - 12;
  maskCtx.lineWidth = 1;
  maskCtx.strokeStyle = '#fff';
  switch (selectedTool) {
    case 'pen': 
      prevX = startX;
      prevY = startY;
      maskCtx.beginPath();
      maskCtx.moveTo(startX, startY);
      break;
    case 'eraser':
      break;
    case 'rect':
      rectangle = new Path2D();
      break;
    default:
      return;
  }
};

maskCanvas.onmousemove = function(e) {
  curX = e.pageX - maskCanvas.offsetLeft - 12;
  curY = e.pageY - maskCanvas.offsetTop - 12;
  switch(selectedTool) {
    case 'pen':
      if (tools['pen'].isDrawing) drawPath(curX, curY);
      break;
    case 'eraser':
      if (tools['eraser'].isDrawing) clear(curX, curY);
      break;
    case 'rect':
      if (tools['rect'].isDrawing) {
        drawRect(curX, curY);
      }
      break;
    default:
      return;
  }
};

maskCanvas.onmouseleave = function(e) {
  tools[selectedTool].isDrawing = false;
};

maskCanvas.onmouseup = function(e) {
  switch (selectedTool) {
    case 'pen':
      if (tools['pen'].isDrawing) {
        tools['pen'].isDrawing = false;
        maskCtx.closePath();
        maskCtx.stroke();
        maskCtx.fillStyle = '#fff';
        maskCtx.fill();
      }
      break;
    case 'eraser':
      tools['eraser'].isDrawing = false;
      break;
    case 'rect':
      tools['rect'].isDrawing = false;
      break;
    default:
      break;
  }
};

function drawPath(x, y) {
  maskCtx.lineTo(x, y);
  maskCtx.stroke();
  prevX = x;
  prevY = y;
}

function clear(x, y) {
  maskCtx.clearRect(x, y, 8, 8);
}

function drawRect(x, y) {
  maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskCtx.strokeRect(Math.min(startX, x), Math.min(startY, y), Math.abs(x-startX), Math.abs(y-startY));
  // maskCtx.stroke(rectangle);
}

function loadImage() {
  img = new Image();
  img.onload = function() {
    isImgLoaded = true;
    oriCanvas.width = this.width;
    oriCanvas.height = this.height;
    maskCanvas.width = this.width;
    maskCanvas.height = this.height;
    drawImage();
  };
  img.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569233132184&di=a1a45444230d083a872aff5db08ec216&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20090224%2FImg262436027.jpg";
}

function drawImage() {
  oriCtx.drawImage(img, 0, 0);
}
