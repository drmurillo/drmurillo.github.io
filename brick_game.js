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
var paddlePicLoaded = false;

var brickCount;
var bricksLeft;

var grid;

function BrickGrid(rows, cols) {
  this.bricks = [];
  this.brickRows = rows;
  this.brickCols = cols;

  this.create = function() {
    for (var j = 3; j < this.brickRows; j++) {
      for (var i = 0; i < this.brickCols; i++) {
        this.bricks.push(new Brick(i, j, bricksPic));
      }
    }
  };
}

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

  ball = new Ball(canvas.width / 2, canvas.height / 2, ballPic);
  paddle = new Paddle(paddlePic);
  grid = new BrickGrid(8, 8);
  grid.create();
  bricksLeft = grid.bricks.length;
  //Define FPS for canvas
  var framesPerSecond = 60;
  setInterval(draw, 1000 / framesPerSecond);
};

function draw() {
  background('black');
  //computerMovement(paddle, ball);
  //text(mouseX + ',' + mouseY, mouseX + 10, mouseY, 'yellow');
  ball.show();
  ball.update();
  paddle.show();
  for (i = grid.bricks.length - 1; i >= 0; i--) {
    grid.bricks[i].show();
    if (ball.collidesWith(grid.bricks[i])) {
      grid.bricks.splice(i, 1);
      bricksLeft--;
      ball.ySpeed *= -1;
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
function Brick(i, j, img) {
  this.width = 100;
  this.height = 20;
  this.x = i * this.width;
  this.y = j * this.height;

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
  this.x = canvas.width / 2;
  this.y = canvas.height - 100;
  this.width = 200;
  this.height = 20;

  this.img = img;
  this.img.src = 'http://res.cloudinary.com/snugglepigs/image/upload/v1500320820/paddle_rhlax5.png';

  this.show = function() {
    if (mouseX) {
      this.x = mouseX;
    } else {
      this.x = canvas.width / 2;
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
    }*/
    fill('red');
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

  this.collidesWith = function(object) {
    if (this.y + this.radius >= object.y &&
      this.y - this.radius <= object.y + object.height &&
      this.x + this.radius >= object.x &&
      this.x - this.radius <= object.x + object.width) {
      return true;
    } else {
      return false;
    }
  };

  this.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
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
    if (this.paddleCollision(paddle)) {
      this.ySpeed *= -1;
      if (bricksLeft == 0) {
        this.reset();
        grid.create();
      }
    }
  };
}

//HELPER FUNCTIONS
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
