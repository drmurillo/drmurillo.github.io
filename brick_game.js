var mouseX;
var mouseY;

var ball;
var ballPic = document.createElement('img');
var ballPicLoaded = false;

var paddle;
var paddlePic = document.createElement('img');
var paddlePicLoaded = false;

var bricks;
var bricksPic = document.createElement('img');
var bricksPicLoaded = false;
var brickW = 100;
var brickH = 20;

var brickCount;
var bricksLeft;

var grid;

window.onload = function() {
  //Canvas loading
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  //Mouse position
  canvas.addEventListener('mousemove', updateMousePos);
  ballPic.onload = function() {
    ballPicLoaded = true;
  };
  paddlePic.onload = function() {
    paddlePicLoaded = true;
  };
  bricksPic.onload = function() {
    bricksPicLoaded = true;
  };

  ball = new Ball(canvas.width / 2, canvas.width / 2, ballPic);
  paddle = new Paddle(paddlePic);
  grid = new BrickGrid(8, 8);
  grid.create();
  //Define FPS for canvas
  var framesPerSecond = 60;
  setInterval(draw, 1000 / framesPerSecond);
};

function draw() {
  background('#8ce6ff');
  //computerMovement(paddle, ball);
  //Debugging
  //MouseX/Y displayed at cursor
  //text(mouseX + ',' + mouseY, mouseX + 10, mouseY, 'yellow');
  //var mouseBrickCol = Math.floor(mouseX / brickW);
  //var mouseBrickRow = Math.floor(mouseY / brickH);
  //var brickIndexUnderMouse = ColrowToArrayIndex(grid, mouseBrickCol, mouseBrickRow);
    //text(mouseBrickCol + ',' + mouseBrickRow + ':' + brickIndexUnderMouse, mouseX, mouseY, 'yellow');
  ball.show();
  ball.update();
  paddle.show();
  for (i = 0; i < grid.bricks.length; i++) {
    if (grid.bricks[i].display == true) {
      grid.bricks[i].show();
    }
  }
  for (i = 0; i < grid.bricks.length; i++) {
    if (ball.collidesWith(grid.bricks[i])) {
      grid.bricks[i].display = false;
      bricksLeft--;
    }
  }
}

function computerMovement(object, ball) {
  var objectCenter = object.x + object.width / 2;
  if (objectCenter < ball.x + 30) {
    object.x = object.x + 3;
  } else if (objectCenter > ball.x - 30) {
    object.x = object.x - 3;
  }
}

//CONSTRUCTOR FUNCTIONS
function BrickGrid(cols, rows) {
  this.bricks = [];
  this.brickCols = cols;
  this.brickRows = rows;

  this.create = function() {
    var extraBricks = 0;
    for (var x = 0; x < this.brickRows + 1; x++) {
      for (var y = 0; y < this.brickCols; y++) {
        this.bricks.push(new Brick(y, x, bricksPic));
      }
    }
    for (var i = 0; i < 3 * this.brickCols; i++) {
      this.bricks[i].display = false;
    }
    for (var i = this.brickRows * this.brickCols; i < grid.bricks.length; i++) {
      this.bricks[i].display = false;
      extraBricks++;
    }
    bricksLeft = grid.bricks.length - 3 * this.brickCols - extraBricks;
  };
}

function Brick(x, y, img) {
  this.width = brickW;
  this.height = brickH;
  this.x = x * this.width;
  this.y = y * this.height;

  this.display = true;
  this.col = Math.floor(this.x / this.width);
  this.row = Math.floor(this.y / this.height);
  this.arrayIndex = ColrowToArrayIndex(grid, this.col, this.row);
  this.img = img;
  this.img.src = 'http://res.cloudinary.com/snugglepigs/image/upload/v1500320826/brick_l3hv0e.png';

  this.show = function() {
    var brickGap = 2;
    if (bricksPicLoaded) {
      canvasContext.drawImage(this.img,
        this.x, this.y);
    } else {
      fill('blue');
      rect(this.x, this.y, this.width - brickGap, this.height - brickGap);
    }
    //Debugging
    //fill('white');
    //text('r# ' + this.x / this.width, this.x + this.width / 2, this.y + this.height / 2);
    //text('c#: ' + this.y / this.height, this.x + this.width / 2 + 20, this.y + this.height / 2);
  };
}

function Paddle(img) {
  this.width = 200;
  this.height = 20;

  this.x = (canvas.width / 2) - (this.width / 2);
  this.y = canvas.height - 100;
  this.img = img;
  this.img.src = 'http://res.cloudinary.com/snugglepigs/image/upload/v1500320820/paddle_rhlax5.png';

  this.show = function() {
    if (!mouseX) {
      this.x = this.x;
    } else if (mouseX >= canvas.width - this.width ||
      mouseX <= 0) {
      this.x = this.x;
    } else if (mouseX) {
      this.x = mouseX;
    }
    if (paddlePicLoaded) {
      canvasContext.drawImage(this.img,
        this.x, this.y);
    } else {
      fill('white');
      rect(this.x, this.y, this.width, this.height);
    }
  };
}

function Ball(x, y, img) {
  this.x = x;
  this.y = y;
  this.radius = 10;

  this.xSpeed = 0;
  this.ySpeed = 8;

  this.img = img;
  this.img.src = 'http://res.cloudinary.com/snugglepigs/image/upload/v1500320826/ball_cduque.png';

  this.show = function() {
    /*if (mouseX && mouseY) {
      this.x = mouseX;
      this.y = mouseY;
    } */
    if (ballPicLoaded) {
      canvasContext.drawImage(this.img,
        this.x - this.img.width / 2, this.y - this.img.height / 2);
    }
    //ellipse(this.x, this.y, this.radius);
  };

  this.angleChange = function(angle) {
    this.xSpeed = angle * 0.15;
  };

  this.reset = function() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.xSpeed = 0;
    this.ySpeed = 6;
  };

  this.paddleCollision = function(object) {
    if (this.y + this.radius >= object.y &&
      this.y - this.radius <= object.y + object.height &&
      this.x + this.radius >= object.x &&
      this.x - this.radius <= object.x + object.width) {
      var objectCenter = object.x + object.width / 2;
      var ballDistFromCenter = this.x - objectCenter;
      this.angleChange(ballDistFromCenter);
      return true;
    } else {
      return false;
    }
  };

  this.collidesWith = function(brick) {
    var ballCol = Math.floor(this.x / brickW);
    var ballRow = Math.floor(this.y / brickH);
    var ballIndex = ColrowToArrayIndex(grid, ballCol, ballRow);
    if (ballCol >= 0 && ballCol < grid.brickCols &&
        ballRow >= 0 && ballRow < grid.brickRows) {
      var xPrevious = this.x - this.xSpeed;
      var yPrevious = this.y - this.ySpeed;
      var previousBallCol = Math.floor(xPrevious / brickW);
      var previousBallRow = Math.floor(yPrevious / brickH);
      if (ballIndex == brick.arrayIndex && brick.display == true) {
        var bothTestsFailed = true;
        if (previousBallCol != ballCol) {
          var adjBrickSide = ColrowToArrayIndex(grid, previousBallCol, ballRow);
          if (adjBrickSide <= grid.brickRows) {
            if (grid.bricks[adjBrickSide].display == false) {
              this.xSpeed *= -1;
              bothTestsFailed = false;
            }
          }
        }
        if (previousBallRow != ballRow) {
          var adjBrickTopBot = ColrowToArrayIndex(grid, ballCol, previousBallRow);
          if (grid.bricks[adjBrickTopBot].display == false) {
            this.ySpeed *= -1;
            bothTestsFailed = false;
          }
        }
        if (bothTestsFailed) { //prevents ball from going through 2 adjacent bricks
          this.xSpeed *= -1;
          this.ySpeed *= -1;
        }
        return true;
      } else {
        return false;
      }
    }
  };

  this.edges = function() {
    //Edge Detection
    if (this.x > canvas.width && this.xSpeed > 0) {
      this.xSpeed *= -1;
    }
    if (this.x < 0 && this.xSpeed < 0) {
      this.xSpeed *= -1;
    }
    if (this.y < 0 && this.ySpeed < 0) {
      this.ySpeed *= -1;
    }
    if (this.y + this.radius > canvas.height) {
      this.reset();
    }
  };

  this.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.edges();
    if (this.paddleCollision(paddle)) {
      this.ySpeed *= -1;
      if (bricksLeft == 0) {
        grid.bricks = [];
        grid.create();
      }
    }
    this.collidesWith(grid);
  };
}

//HELPER FUNCTIONS
function isBrickAtColRow(col, row) {
  if (col >= 0 && col < grid.brickCols &&
    row >= 0 && row < grid.brickRows) {
    var brickIndexUnderCoord = ColrowToArrayIndex(grid, col, row);
    return brickGrid[brickIndexUnder];
  } else {
    return false;
  }
}

function ColrowToArrayIndex(grid, col, row) {
  return col + grid.brickCols * row;
}

function text(string, x, y, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillText(string, x, y);
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
