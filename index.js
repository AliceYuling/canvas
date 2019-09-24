var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var img, isImgLoaded, isIconLoaded, isPainting, startX, startY, curX, curY, prevX, prevY;

loadImage();
drawImage();

canvas.onmousedown = function(e) {
  isPainting = true;
  startX = e.pageX - canvas.offsetLeft;
  startY = e.pageY - canvas.offsetTop;
  prevX = startX;
  prevY = startY;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000';
};

canvas.onmousemove = function(e) {
  if (isPainting) {
    curX = e.pageX - canvas.offsetLeft;
    curY = e.pageY - canvas.offsetTop;
    drawPath(curX, curY);
  }
};

canvas.onmouseleave = function(e) {
  isPainting = false;
};

canvas.onmouseup = function(e) {
  isPainting = false;
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};

function drawPath(x, y) {
  /*
  const radius = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();
  */
  // ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();
  prevX = x;
  prevY = y;
}

function loadImage() {
  img = new Image();
  img.onload = function() {
    // canvas.width = img.width;
    // canvas.height = img.height;
    isImgLoaded = true;
    drawImage();
  };
  img.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569233132184&di=a1a45444230d083a872aff5db08ec216&imgtype=0&src=http%3A%2F%2Fphotocdn.sohu.com%2F20090224%2FImg262436027.jpg";
}

function drawImage() {
  ctx.drawImage(img, 0, 0);
}
