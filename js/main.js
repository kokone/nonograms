var grid;
var canvas;
var ctx;
var cellWidth, cellHeight;
var horizontal, vertical;
var gridOffsetX, gridOffsetY;

function initialize(width, height) {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  var startTime = new Date().getTime();
  var param = window.location.hash;
  if(param) grid = new Grid(puzzles[param.substring(1)]);
  else grid = new Grid(puzzles[0]);
  cellWidth = cellHeight = 20;
  gridOffsetX = gridOffsetY = 125;
  initListeners();
  calculateNumbers();
  draw();
  var totalTime = new Date().getTime() - startTime;
  document.getElementById("time").innerHTML = "generated in " + totalTime + "ms";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawNumbers();
}

function drawGrid() {
  for(var height = 0; height < grid.height; height++) {
    for(var width = 0; width < grid.width; width++) {
      var cell = grid.getCell(height, width);
      ctx.clearRect (cell.position.x*cellWidth+gridOffsetX, cell.position.y*cellHeight+gridOffsetY, cell.position.x * cellWidth + cellWidth, cell.position.y * cellHeight + cellHeight);
      if(cell.selected) {
        fillCell(cell.position.x, cell.position.y, "#444444", "#AAAAAA");
      } else if(!cell.enabled) {
        drawDisabledCell(cell.position.x, cell.position.y, "#AAAAAA");
      }
      drawCell(cell.position.x, cell.position.y, "#AAAAAA");
      if(width % 5 == 0 && width != 0) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#AAAAAA";
        ctx.beginPath();
        ctx.moveTo(gridOffsetX, gridOffsetY + width * cellHeight);
        ctx.lineTo(gridOffsetX + grid.height * cellWidth, gridOffsetY + width * cellWidth);
        ctx.stroke();
      }
      ctx.lineWidth = 1;
    }
    if(height % 5 == 0 && height != 0) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#AAAAAA";
      ctx.beginPath();
      ctx.moveTo(gridOffsetX + height * cellWidth, gridOffsetY);
      ctx.lineTo(gridOffsetX + height * cellWidth, gridOffsetY + grid.width * cellWidth);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  }
}

function drawCell(x, y, color) {
  x = x * cellWidth + gridOffsetX;
  y = y * cellHeight + gridOffsetY;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+cellWidth, y);
  ctx.lineTo(x+cellWidth, y+cellHeight);
  ctx.lineTo(x, y+cellHeight);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function fillCell(x, y, color, stroke) {
  x = x * cellWidth + gridOffsetX;
  y = y * cellHeight + gridOffsetY;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+cellWidth, y);
  ctx.lineTo(x+cellWidth, y+cellHeight);
  ctx.lineTo(x, y+cellHeight);
  ctx.lineTo(x, y);
  ctx.fill();
  if(stroke != undefined) {
    drawCell(x, y, stroke);
  }
}

function drawDisabledCell(x, y, color) {
  x = x * cellWidth + gridOffsetX + cellWidth / 2;
  y = y * cellHeight + gridOffsetY + cellHeight / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x,y,2.5,0,Math.PI*2,false);
  ctx.fill();
}

function calculateNumbers() {
  horizontal = new Array();
  vertical = new Array();
  var hline, vline;
  var sum = 0;
  for(var w = 0; w < grid.width; w++) {
    vline = new Array();
    for(var h = 0; h < grid.height; h++) {
      if(grid.cells[h][w].filled) {
        sum++;
      } else if(sum > 0) {
        vline.push({num: sum, enabled: true});
        sum = 0;
      }
    }
    if(sum > 0) {
      vline.push({num: sum, enabled: true});
      sum = 0;
    }
    vertical.push(vline.reverse());
  }
  sum = 0;
  for(var h = 0; h < grid.height; h++) {
    hline = new Array();
    for(var w = 0; w < grid.width; w++) {
      if(grid.cells[h][w].filled) {
        sum++;
      } else if(sum > 0) {
        hline.push({num: sum, enabled: true});
        sum = 0;
      }
    }
    if(sum > 0) {
      hline.push({num: sum, enabled: true});
      sum = 0;
    }
    horizontal.push(hline.reverse());
  }
}

function drawNumbers() {
  var offsetX = grid.width * cellWidth;
  var offsetY = grid.height * cellHeight;
  for(var i = 0; i < horizontal.length; i++) {
    for(var j = horizontal[i].length-1; j >= 0; j--) {
      if(horizontal[i][j].enabled) ctx.fillStyle = "#444444";
      else ctx.fillStyle = "#dddddd";
      ctx.fillText(""+horizontal[i][j].num, gridOffsetX - cellWidth - j * cellWidth, gridOffsetY + i * cellHeight + cellHeight/1.5);
    }
  }
  for(var i = 0; i < vertical.length; i++) {
    for(var j = vertical[i].length - 1; j >= 0 ; j--) {
      if(vertical[i][j].enabled) ctx.fillStyle = "#444444";
      else ctx.fillStyle = "#dddddd";
      ctx.fillText(""+vertical[i][j].num, gridOffsetX + i * cellWidth + cellWidth/2.5, gridOffsetY - 5 - j * cellHeight);
    }
  }
}

function checkCompleted() {
  for(var height = 0; height < grid.height; height++) {
    for(var width = 0; width < grid.width; width++) {
      var cell = grid.getCell(height, width);
      if(cell.filled != cell.selected) return false;
    }
  }
  return true;
}