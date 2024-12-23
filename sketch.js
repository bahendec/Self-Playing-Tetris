const WINDOW_WIDTH_MODIFIER = 0.475;
const WINDOW_HEIGHT_MODIFIER = 0.95;
const GRIDLINES_COLOR = [205, 13, 247];
const windowExtra = 0.475;

let grid = new Grid();
let extraWidth;
let nextPiece = new NextPiece();
let holdPiece = new HoldPiece();
let player = new Player();

function setup() {
  window.canvas = createCanvas(windowHeight*WINDOW_WIDTH_MODIFIER + (windowHeight * windowExtra), windowHeight*WINDOW_HEIGHT_MODIFIER);
  extraWidth = windowHeight * windowExtra;
  frameRate(60);
  grid.setSize((width-extraWidth)/10, extraWidth/2);
}

function draw() {
  background(0);
  // rectangle for next piece
  fill([255, 255, 255]);
  noStroke();
  rect((width - extraWidth/2), height * 0.25, extraWidth/2, height * 0.75);
  // text for next piece
  fill([90, 158, 240]);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Next', (width - (0.5 * extraWidth/2)), height * 0.3);

  // rect for held piece
  fill([255, 255, 255]);
  noStroke();
  rect(0, height * 0.25, extraWidth/2, height * 0.75);

  // text for held piece
  fill([90, 158, 240]);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Hold', ((0.5 * extraWidth/2)), height * 0.3);

  drawVertGrid();
  drawHorzGrid();

  // set next piece
  if (grid.hasNextPiece() && grid.isActivePiece()) {
    nextPiece.setShape(grid.getNext());
  }

  // draw held piece
  if (grid.hasHeld()) {
    holdPiece.setShape(grid.getHold());
  }

  grid.update();
  grid.setSize((width-extraWidth)/10, extraWidth/2);
  grid.draw();
  nextPiece.draw();
  holdPiece.draw();
  // text for score
  let score = grid.getScore();
  fill([90, 158, 240]);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Score:', (width - (0.5 * extraWidth/2)), height * 0.5);
  text(score.toString(), (width - (0.5 * extraWidth/2)), height * 0.6);
  // check for game over
  if (grid.getGameOver()) {
    console.log(score.toString());
    grid = new Grid();
    grid.setSize((width-extraWidth)/10, extraWidth/2);
    nextPiece.reset();
    holdPiece.reset();
  } else {
    if (grid.isNewActive()) {
      player.setGameState(grid.getMatrix(), grid.getActive(), grid.getActiveType(), grid.getHold(), grid.getCanHold(), grid.hasHeld(), grid.getNext());
      let instructions = player.getInstructions();
      executeInstructions(instructions);
    }
  }
}

function executeInstructions(instructions) {
  for (let i of instructions) {
    switch(i) {
      case 'l':
        grid.moveLeft();
        break;
      case 'r':
        grid.moveRight();
        break;
      case 'u':
        grid.rotate(true);
        break;
      case 'x':
        grid.rotate(false);
        break;
      case 'c':
        grid.doHold();
        break;
    }
  }
}

function drawVertGrid() {
  stroke(GRIDLINES_COLOR);
  for (let x = 0; x < 11; x += 1) {
    line(x*((width - extraWidth)/10) + extraWidth/2, 0, x*((width - extraWidth)/10) + extraWidth/2, height);
  }
}

function drawHorzGrid() {
  stroke(GRIDLINES_COLOR);
  for (let y = 0; y < 22; y += 1) {
    line(extraWidth/2, y*(height/20), (width - extraWidth/2), y*(height/20));
  }
}

function windowResized() {
  resizeCanvas(windowHeight*WINDOW_WIDTH_MODIFIER + (windowHeight * windowExtra), windowHeight*WINDOW_HEIGHT_MODIFIER);
  extraWidth = windowHeight * windowExtra;
  grid.setSize((width - extraWidth)/10, extraWidth/2);
}

function keyPressed() {
  if (keyCode === 37) {
    grid.moveLeft();
  } else if (keyCode === 39) {
    grid.moveRight();
  } else if (keyCode === 38) {
    grid.rotate(true);
  } else if (keyCode === 90) {
    grid.rotate(false);
  } else if (keyCode === 67) {
    grid.doHold();
  }
}