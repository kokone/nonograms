var mouse;

var Actions = {
  PLACE: 0,
  REMOVE: 1,
  ENABLE: 2,
  DISABLE: 3
}

function Point(x, y) {
  this.x = x == null ? -1 : x;
  this.y = y == null ? -1 : y;
  this.isdown = false;
  this.latestaction = Actions.PLACE;
}

function initListeners() {
  mouse = new Point();
  canvas.onmousemove = mouseMove;
  canvas.onmousedown = mouseDown;
  canvas.onmouseup = mouseUp;
  canvas.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
}

function mouseMove(e) {
  var coords = canvas.relativeMouseCoordinates(e);
  mouse.x = coords.x;
  mouse.y = coords.y;
  if(mouse.isdown) {
    if(mouse.latestaction == Actions.DISABLE || mouse.latestaction == Actions.ENABLE) {
      if(mouse.latestaction == Actions.DISABLE && grid.getCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight)).enabled) {
        grid.disableCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      } else if(mouse.latestaction == Actions.ENABLE) {
        grid.enableCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      }
    } else {
      if(mouse.latestaction == Actions.REMOVE && grid.getCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight)).selected) {
        grid.deselectCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      } else if(mouse.latestaction == Actions.PLACE) {
        grid.selectCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      }
    }
    draw();
  }
}

function mouseDown(e) {
  mouse.isdown = true;
  if(e.button && e.button == 2) {
    if(grid.getCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight)).enabled) {
      grid.disableCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      mouse.latestaction = Actions.DISABLE;
    } else {
      grid.enableCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      mouse.latestaction = Actions.ENABLE;
    }
  } else {
      if(grid.getCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight)).selected) {
      grid.deselectCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      mouse.latestaction = Actions.REMOVE;
    } else {
      grid.selectCell(Math.floor(mouse.x / cellWidth), Math.floor(mouse.y / cellHeight));
      mouse.latestaction = Actions.PLACE;
    }
  }
  
  if(mouse.x < 0 || mouse.y < 0) {
    var px = Math.floor(mouse.x / cellWidth);
    var py = Math.floor(mouse.y/ cellHeight);
    if(px < 0) {
      if(horizontal[py] && horizontal[py][-px - 1]) {
        horizontal[py][-px - 1].enabled = !horizontal[py][-px - 1].enabled;
      }
    }
    if(py < 0) {
      if(vertical[px] && vertical[px][-py - 1]) {
        vertical[px][-py - 1].enabled = !vertical[px][-py - 1].enabled;
      }
    }
  }
  draw();
}

function mouseUp() {
  mouse.isdown = false;
}

function findPos(obj) {
  var curleft = curtop = 0;
  if(obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while(obj = obj.offsetParent);
  }
  return {x: curleft, y: curtop};
}

function relativeMouseCoordinates(event){
  var totalOffsetX = gridOffsetX;
  var totalOffsetY = gridOffsetY;
  var canvasX = 0;
  var canvasY = 0;
  var element = this;

  do{
    totalOffsetX += element.offsetLeft;
    totalOffsetY += element.offsetTop;
  } while(element = element.offsetParent);

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relativeMouseCoordinates = relativeMouseCoordinates;