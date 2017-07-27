var mouseX;
var mouseY;

var car1;
var car2;

var trackGrid;
var trackPieceWidth = 40;
var trackPieceHeight = 40;

var track1;

const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;
const KEY_UP_ARROW = 38;
const KEY_DOWN_ARROW = 40;
const KEY_SPACEBAR = 32;

var keyHeldGas = false;
var keyHeldReverse = false;
var keyHeldTurnLeft = false;
var keyHeldTurnRight = false;

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;
const TRACK_FINISHLINE = 4;

var carImg = document.createElement('img');
var carImgLoaded = false;

function keyPressed(evt) {
  if (evt.keyCode == KEY_LEFT_ARROW) {
    //turn left
    keyHeldTurnLeft = true;
  }
  if (evt.keyCode == KEY_RIGHT_ARROW) {
    //turn right
    keyHeldTurnRight = true;
  }
  if (evt.keyCode == KEY_UP_ARROW) {
    //turn up
    keyHeldGas = true;
  }
  if (evt.keyCode == KEY_DOWN_ARROW) {
    //turn down
    keyHeldReverse = true;
  }
  //evt.preventDefault();
}

function keyReleased(evt) {
  if (evt.keyCode == KEY_LEFT_ARROW) {
    keyHeldTurnLeft = false;
  }
  if (evt.keyCode == KEY_RIGHT_ARROW) {
    keyHeldTurnRight = false;
  }
  if (evt.keyCode == KEY_UP_ARROW) {
    keyHeldGas = false;
  }
  if (evt.keyCode == KEY_DOWN_ARROW) {
    keyHeldReverse = false;
  }
}
window.onload = function() {
  //Canvas creation stuff
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  canvas.addEventListener('mousemove', updateMousePos);

  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);
  //Images
  carImg.onload = function() {
    carImgLoaded = true;
  };
  carImg.src = 'http://res.cloudinary.com/snugglepigs/image/upload/a_auto_right/a_90/v1501173683/car_pwzrat.png';
  //Create the tracks
  trackGrid = new TrackGrid(20, 15);
  track1 = new Track();
  trackGrid.create(track1.numOne());
  //Create players
  car1 = new Car();
  car1.findBegin(trackGrid);
  //Define FPS for canvas
  var framesPerSecond = 60;
  setInterval(draw, 1000 / framesPerSecond);
};

function draw() {
  background('pink');
  for (i = 0; i < trackGrid.layout.length; i++) {
    trackGrid.layout[i].show();
    car1.collision(trackGrid.layout[i]);
  }
  car1.show();
  car1.move();
}

//CONSTRUCTOR FUNCTIONS
function Car() {
  this.x;
  this.y;
  this.width = 20;
  this.height = 20;

  this.speed = 0;

  this.heading = 0;

  this.move = function() {
    var acceleration = 0.05;
    var turnRate = 0.04;
    var speedDecay = 0.02;
    //acceleration -= speedDecay;
    this.x += Math.cos(this.heading) * this.speed;
    this.y += Math.sin(this.heading) * this.speed;
    if (keyHeldGas) {
      //increase speed
      this.speed += acceleration;
    }

    if (keyHeldReverse) {
      //decrease speed
      this.speed -= acceleration * 2;
    }
    if (keyHeldTurnLeft) {
      //turn left
      this.heading -= turnRate;
    }
    if (keyHeldTurnRight) {
      //turn right
      this.heading += turnRate;
    }
  };

  this.show = function() {
    if (carImgLoaded) {
      drawWithRotation(carImg,
        this.x, this.y, this.heading);
    } else {
      fill('white');
      rect(this.x, this.y, this.width, this.height);
    }
  };

  this.collision = function(trackPiece) {
    var currentCol = Math.floor(this.x  / trackPieceWidth);
    var currentRow = Math.floor(this.y / trackPieceHeight);
    if (currentCol == trackPiece.col &&
        currentRow == trackPiece.row) {
      if (trackPiece.type == TRACK_WALL) {
        this.x -= Math.cos(this.heading) * this.speed;
        this.y -= Math.sin(this.heading) * this.speed;
        this.speed *= -0.25;
      }
      if (trackPiece.type == TRACK_FINISHLINE) {
        this.findBegin(trackGrid);
      }
    }
  };

  this.reset = function() {
    this.heading = -Math.PI / 2;
    this.speed = 0;
  };

  this.findBegin = function(trackGrid) {
    for (i = 0; i < trackGrid.layout.length; i++) {
      if (trackGrid.layout[i].type == TRACK_PLAYERSTART) {
        this.x = trackGrid.layout[i].x + this.width / 2;
        this.y = trackGrid.layout[i].y + this.height / 2;
        this.reset();
        break;
      }
    }
  };
}

function Piece(i, j) {
  this.width = trackPieceWidth;
  this.height = trackPieceHeight;
  this.x = i * this.width;
  this.y = j * this.height;

  this.col = this.x / this.width;
  this.row = this.y / this.height;

  this.type;

  this.show = function() {
    var brickGap = 2;
    if (this.type == TRACK_WALL) {
      fill('blue');
      rect(this.x, this.y, this.width - brickGap, this.height - brickGap);
    }
    if (this.type == TRACK_FINISHLINE) {
      fill('green');
      rect(this.x, this.y, this.width - brickGap, this.height - brickGap);
    }
    if (this.type == TRACK_PLAYERSTART) {
      fill('white');
      rect(this.x, this.y, this.width - brickGap, this.height - brickGap);
    }
    //Debugging. Displaying the row and col # for each brick
    //fill('white');
    //text('c# ' + this.x / this.width, this.x + this.width / 2 - 10, this.y + this.height / 2);
    //text('r#: ' + this.y / this.height, this.x + this.width / 2 - 10, this.y + this.height / 2 + 10);
    //text('i: ' + i, this.x + this.width / 2 - 10, this.y + this.height / 2);
  };
}

function Track() {
  //number legend:
  //0 = blank
  //1 = wall
  //2 = ??
  //3 = ??
  //4 = end
  this.track = [];

  this.numOne = function() {
    this.track = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1,
      1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1,
      1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1,
      1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 4, 4, 1,
      1, 2, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ];
    return this.track;
  };
}

function TrackGrid(cols, rows) {
  this.layout = [];
  this.layoutRows = rows;
  this.layoutCols = cols;

  this.create = function(track) {
    for (var j = 0; j < this.layoutRows; j++) {
      for (var i = 0; i < this.layoutCols; i++) {
        this.layout.push(new Piece(i, j));
      }
    }
    for (i = 0; i < this.layout.length; i++) {
      this.layout[i].type = track[i];
    }
  };
}

//HELPER FUNCTIONS
function drawWithRotation(img, x, y, angle) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(angle);
  canvasContext.drawImage(img, -img.width / 2, -img.height / 2);
  canvasContext.restore();
}

function text(string, x, y, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillText(string, x, y, color);
}

function rect(x, y, width, height) {
  canvasContext.fillRect(x, y, width, height);
}

function ellipse(x, y, radius) {
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function fill(color) {
  canvasContext.fillStyle = color;
}

function background(color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}
