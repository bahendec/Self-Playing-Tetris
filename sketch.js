const WINDOW_WIDTH_MODIFIER = 0.475;
const WINDOW_HEIGHT_MODIFIER = 0.95;
const GRIDLINES_COLOR = [205, 13, 247];
const windowExtra = 0.475 / 2;

let grid = new Grid();
let extraWidth;
let nextPiece = new NextPiece();

function setup() {
  window.canvas = createCanvas(windowHeight*WINDOW_WIDTH_MODIFIER + (windowHeight * windowExtra), windowHeight*WINDOW_HEIGHT_MODIFIER);
  extraWidth = windowHeight * windowExtra;
  frameRate(60);
  grid.setSize((width-extraWidth)/10, 0);
}

function draw() {
  background(0);
  // rectangle
  fill([255, 255, 255]);
  noStroke();
  rect((width - extraWidth), height * 0.25, extraWidth, height * 0.75);
  // text
  fill([90, 158, 240]);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Next', (width - (0.5 * extraWidth)), height * 0.3);


  drawVertGrid();
  drawHorzGrid();

  // draw next piece
  if (grid.hasNextPiece() && grid.isActivePiece()) {
    nextPiece.setShape(grid.getNext());
  }

  grid.update();
  grid.draw();
  nextPiece.draw();
}

function drawVertGrid() {
  stroke(GRIDLINES_COLOR);
  for (let x = 0; x < 11; x += 1) {
    line(x*((width - extraWidth)/10), 0, x*((width - extraWidth)/10), height);
  }
}

function drawHorzGrid() {
  stroke(GRIDLINES_COLOR);
  for (let y = 0; y < 22; y += 1) {
    line(0, y*(height/20), (width - extraWidth), y*(height/20));
  }
}

function windowResized() {
  resizeCanvas(windowHeight*WINDOW_WIDTH_MODIFIER + (windowHeight * windowExtra), windowHeight*WINDOW_HEIGHT_MODIFIER);
  extraWidth = windowHeight * windowExtra;
  grid.setSize((width - extraWidth)/10);
}

// Change Later
function keyPressed() {
  if (keyCode === 37) {
    grid.moveLeft();
  } else if (keyCode === 39) {
    grid.moveRight();
  } else if (keyCode === 38) {
    grid.rotate(true);
  } else if (keyCode === 90) {
    grid.rotate(false);
  }
}