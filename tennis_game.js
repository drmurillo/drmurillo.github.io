var canvas;
var canvasContext;

var ball;
var paddle1;
var paddle2;
var paddleHeight;

var mouseX;
var mouseY;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  //update mouse position
  canvas.addEventListener('mousemove',
    function(evt) {
      calculateMousePos(evt);
    });

  ball = new Ball(canvas.width / 2, (canvas.height / 2) - (20 / 2), 20, 20);
  //Paddle definitions
  paddleHeight = 150;
  var paddleWidth = 10;
  var paddleY = (canvas.height / 2) - (paddleHeight / 2);
  var paddle1X = canvas.width - canvas.width + 20;
  var paddle2X = canvas.width - 20;
  paddle1 = new Paddle(paddle1X, paddleY, paddleWidth, paddleHeight);
  paddle2 = new Paddle(paddle2X, paddleY, paddleWidth, paddleHeight);
  //Define FPS for the canvas
  var framesPerSecond = 60;
  var frameRate = 1000 / framesPerSecond;
  setInterval(draw, frameRate);
};

function draw() {
  background('black');
  ball.show();
  paddle1.show();
  if (mouseY) {
    paddle1.y = mouseY - paddleHeight / 2;
  }
  paddle2.show();
  ball.update();
  if (ball.collidesWith(paddle1) ||
  ball.collidesWith(paddle2)) {
    ball.reverseDirection();
  }
}

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;

  this.show = function(y) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(this.x, this.y, this.width, this.height);
  };

}

function Ball(x, y, height, width) {
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.xSpeed = 5;
  this.ySpeed = 2;

  this.show = function() {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(this.x, this.y, this.height, this.width);
  };

  this.update = function() {
    this.x += this.xSpeed;
    //this.y += this.xSpeed;
    //Right side collision
    if (this.x > canvas.width - this.width) {
      this.reverseDirection();
    }
    //Left side collision
    if (this.x <= 0) {
      this.resetPosition();
      this.reverseDirection();
    }
    //Top collision
    if (this.y > canvas.height - this.height ||
      this.y <= 0) {
      this.reverseDirection();
    }

  };

  this.collidesWith = function(object) {
    if (this.x == object.x + object.width) {
      if (this.y > object.y && this.y < object.y + object.height) {
        return true;
      } else {
        return false;
      }
    }
  };

  this.reverseDirection = function() {
    this.xSpeed = this.xSpeed * -1;
    this.ySpeed = this.ySpeed * -1;
  };

  this.resetPosition = function() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
  };
}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function background(color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}
