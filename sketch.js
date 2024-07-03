const WINDOW_WIDTH_MODIFIER = 0.475;
const WINDOW_HEIGHT_MODIFIER = 0.95;
const GRIDLINES_COLOR = [205, 13, 247];

let grid = new Grid();

function setup() {
  window.canvas = createCanvas(windowHeight*WINDOW_WIDTH_MODIFIER, windowHeight*WINDOW_HEIGHT_MODIFIER);
  frameRate(60);
  grid.setSize(width/10);
}

function draw() {
  background(0);
  drawVertGrid();
  drawHorzGrid();

  grid.update();
  grid.draw();
}

function drawVertGrid() {
  stroke(GRIDLINES_COLOR);
  for (let x = 0; x < 12; x += 1) {
    line(x*(width/10), 0, x*(width/10), height);
  }
}

function drawHorzGrid() {
  stroke(GRIDLINES_COLOR);
  for (let y = 0; y < 22; y += 1) {
    line(0, y*(height/20), width, y*(height/20));
  }
}

function windowResized() {
  resizeCanvas(windowHeight*WINDOW_WIDTH_MODIFIER, windowHeight*WINDOW_HEIGHT_MODIFIER);
  grid.setSize(width/10);
}

// Change Later
function keyPressed() {
  if (keyCode === 37) {
    grid.moveLeft();
  } else if (keyCode === 39) {
    grid.moveRight();
  }
}