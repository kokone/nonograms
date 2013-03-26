function Cell(x, y, filled) {
  this.position = {
    x: x,
    y: y
  }
  this.filled = filled,
  this.selected = false,
  this.enabled = true
}

Cell.prototype.equals = function(cell) {
  return this.position.x == cell.position.x
    && this.position.y  == cell.position.y;
}

function Grid(puzzle) {
  var cells = new Array();
  for(var i = 0; i < puzzle.length; i++) {
    cells[i] = new Array(puzzle[i].length);
    for(var j = 0; j < puzzle[i].length; j++) {
      cells[i][j] = new Cell(j, i, puzzle[i][j] == 1);
    }
  }
  this.cells = cells;
  this.height = cells.length;
  this.width = cells[0].length;
}

Grid.prototype.getCell = function(x, y) {
  if(this.cells[y] && this.cells[y][x]) {
    return this.cells[y][x];
  }
  return false;
}

Grid.prototype.selectCell = function(x, y) {
  if(this.cells[y] && this.cells[y][x] && this.cells[y][x].enabled) {
    this.cells[y][x].selected = true;
  }
}

Grid.prototype.deselectCell = function(x, y) {
  if(this.cells[y] && this.cells[y][x]) {
    this.cells[y][x].selected = false;
  }
}

Grid.prototype.enableCell = function(x, y) {
  if(this.cells[y] && this.cells[y][x]) {
    this.cells[y][x].enabled = true;
  }
}

Grid.prototype.disableCell = function(x, y) {
  if(this.cells[y] && this.cells[y][x] && !this.cells[y][x].selected) {
    this.cells[y][x].enabled = false;
  }
}