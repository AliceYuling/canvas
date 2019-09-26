var oriCanvas = document.getElementById('oriCanvas');
var maskCanvas = document.getElementById('maskCanvas');
var oriCtx = oriCanvas.getContext('2d');
var maskCtx = maskCanvas.getContext('2d');
var eraser = document.getElementById('eraser');
var pen = document.getElementById('pen');
var gen = document.getElementById('gen');
var isPenSelected = true;
var isEraserSelected = false;
var img, isImgLoaded, isIconLoaded, isPainting, startX, startY, curX, curY, prevX, prevY, isClearing;

loadImage();
drawImage();

eraser.addEventListener('click', function() {
  isEraserSelected = true;
  isPenSelected = false;
});

pen.addEventListener('click', function() {
  isEraserSelected = false;
  isPenSelected = true;
});

gen.addEventListener('click', function() {
  oriCtx.drawImage(maskCanvas, 0, 0);
  var resImg = oriCanvas.toDataURL();
  var resEl = document.createElement('img');
  resEl.src = resImg;
  document.getElementById('container').append(resEl);
});

maskCanvas.onmousedown = function(e) {
  if (isPenSelected) {
    isPainting = true;
    startX = e.pageX - maskCanvas.offsetLeft;
    startY = e.pageY - maskCanvas.offsetTop;
    prevX = startX;
    prevY = startY;
    maskCtx.beginPath();
    maskCtx.moveTo(startX, startY);
    maskCtx.lineWidth = 1;
    maskCtx.strokeStyle = '#fff';
  } else {
    isClearing = true;
  }
};

maskCanvas.onmousemove = function(e) {
  curX = e.pageX - maskCanvas.offsetLeft;
  curY = e.pageY - maskCanvas.offsetTop;
  if (isPainting) {
    drawPath(curX, curY);
  } else if (isClearing) {
    clear(curX, curY);
  }
};

maskCanvas.onmouseleave = function(e) {
  if (isClearing) {
    isClearing = false;
  } else {
    isPainting = false;
  }
};

maskCanvas.onmouseup = function(e) {
  if (isPainting) {
    isPainting = false;
    maskCtx.closePath();
    maskCtx.stroke();
    maskCtx.fillStyle = '#fff';
    maskCtx.fill();
  }
  isClearing = false;
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
