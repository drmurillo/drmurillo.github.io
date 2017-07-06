var canvas;
var canvasContext;

var ball;

var paddle1;
var paddle2;

var paddleHeight;

var mouseX;
var mouseY;

var player1Score;
var player2Score;

var showWinningScreen = false;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  //update mouse position
  canvas.addEventListener('mousemove',
    function(evt) {
      calculateMousePos(evt);
    });
  canvas.addEventListener('mousedown', mouseIsPressed);
  ball = new Ball(canvas.width / 2, (canvas.height / 2) - (20 / 2), 20, 20);
  //Paddle definitions
  paddleHeight = 150;
  var paddleWidth = 10;
  var paddleY = (canvas.height / 2) - (paddleHeight / 2);
  var paddle1X = canvas.width - canvas.width + 20;
  var paddle2X = canvas.width - 20;
  paddle1 = new Paddle(paddle1X, paddleY, paddleWidth, paddleHeight);
  paddle2 = new Paddle(paddle2X, paddleY, paddleWidth, paddleHeight);
  //Score setup
  player1Score = new Score(100, 100);
  player2Score = new Score(700, 100);
  //Define FPS for the canvas
  var framesPerSecond = 60;
  var frameRate = 1000 / framesPerSecond;
  setInterval(draw, frameRate);
};

function draw() {
  if (showWinningScreen) {
    var textAdj = 60;
    if (player1Score.isWinner == true) {
      textSize(24);
      text('Player 1 WINS!', canvas.width / 2 - textAdj, canvas.height / 2, 'white');
      text('click to continue', canvas.width / 2 - textAdj, canvas.height / 2 + textAdj);
      return;
    } else if (player2Score.isWinner == true) {
      textSize(24);
      text('Player 2 WINS!', canvas.width / 2 - textAdj, canvas.height / 2, 'white');
      text('click to continue', canvas.width / 2 - textAdj, canvas.height / 2 + textAdj);
      return;
    }
  }
  background('black');
  computerMovement(paddle2, ball);
  ball.show();
  paddle1.show();
  if (mouseY) {
    paddle1.y = mouseY - paddleHeight / 2;
  }
  paddle2.show();
  ball.update();

  if (ball.collidesWith(paddle1)) {
    ball.deltaChange(paddle1);
    ball.reverseX();
  }
  if (ball.collidesWith(paddle2)) {
    ball.deltaChange(paddle2);
    ball.reverseX();
  }
  player1Score.show();
  player2Score.show();
  drawNet();
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(canvas.width / 2, i, 2, 20);
  }
}

function computerMovement(object, ball) {
  var objectCenter = object.y + object.height / 2;
  if (ball.x > canvas.width / 5) {
    if (objectCenter < ball.y + 35) {
      object.y = object.y + 4;
    } else if (objectCenter > ball.y - 35) {
      object.y = object.y - 4;
    }
  }
}

function Score(x, y) {
  this.score = 0;
  this.multiplier = 1;
  this.isWinner = false;

  this.show = function() {
    textSize(30);
    text(this.score, x, y, 'white');
  };

  this.increase = function() {
    var winningScore = 3;
    var scoreIncrement = 1;
    this.score += scoreIncrement * this.multiplier;
    if (this.score >= winningScore) {
      this.isWinner = true;
      showWinningScreen = true;
    }
  };

  this.reset = function() {
    this.score = 0;
    this.isWinner = false;
  };

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
  this.ySpeed = 3;

  this.show = function() {
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(this.x, this.y, this.height, this.width);
  };

  this.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    //Right side collision
    if (this.x > canvas.width - this.width) {
      this.resetPosition();
      this.reverseDirection();
      player1Score.increase();
    }
    //Left side collision
    if (this.x <= 0) {
      this.resetPosition();
      this.reverseDirection();
      player2Score.increase();
    }
    //Top & Bottom collision
    if (this.y > canvas.height - this.height ||
      this.y <= 0) {
      this.reverseY();
    }

  };

  this.collidesWith = function(object) {
    //Paddle2 check
    if (this.x + this.width == object.x) {
      if (this.y + this.height > object.y &&
        this.y < object.y + object.height) {
        return true;
      } else {
        return false;
      }
    }
    //Paddle1 check
    if (this.x == object.x + object.width) {
      if (this.y + this.height > object.y &&
        this.y < object.y + object.height) {
        return true;
      } else {
        return false;
      }
    }
  };
  this.deltaChange = function(object) {
    var deltaY = this.y - (object.y + object.height / 2);
    this.ySpeed = deltaY * 0.2;
  };

  this.reverseDirection = function() {
    this.xSpeed = this.xSpeed * -1;
    this.ySpeed = this.ySpeed * -1;
  };
  this.reverseY = function() {
    this.ySpeed = this.ySpeed * -1;
  };
  this.reverseX = function() {
    this.xSpeed = this.xSpeed * -1;
  };
  this.resetPosition = function() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.xSpeed = 5;
    this.ySpeed = 0;
  };
}
// Helper functions
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

function mouseIsPressed() {
  if (showWinningScreen == true) {
    showWinningScreen = false;
    player1Score.reset();
    player2Score.reset();
  }
}

function text(string, x, y, color) {
  canvasContext.fillStyle = 'color';
  canvasContext.fillText(string, x, y);
}

function textSize(size) {
  canvasContext.font = size + 'px sans-serif';
}
