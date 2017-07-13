var img;

var counter;

var col;
var row;

var frameWidth;
var frameHeight;
//top left corner of the source image
var x;
var y;

var currentFrame;
var endFrame;
var framesPerRow;
var frameSpeed;

function preload() {
  img = loadImage('http://res.cloudinary.com/snugglepigs/image/upload/v1499905897/sphinx_idle_sprite_sheet_wqhlra.png');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  currentFrame = 0;
  frameWidth = 166;
  frameHeight = 180;
  endFrame = 12;
  framesPerRow = floor(664 / frameWidth);
  //Higher value = slower speed.
  //example: a value of 4 = 15 fps
  var fps = 60;
  frameSpeed = 2.5;
  counter = 0;
  x = 0;
  y = 0;
}

function draw() {
  background(51);
  currentFrame = currentFrame % endFrame;
  col = floor(currentFrame / framesPerRow);
  row = floor(currentFrame % framesPerRow);
  counter += 1;
  if (counter > frameSpeed - 1) {
    counter = 0;
    if (currentFrame < endFrame - 1) {
      currentFrame += 1;
    } else if (currentFrame == endFrame - 1) {
      currentFrame = 0;
    }
  }
  console.log('col: ' + col);
  console.log('row: ' + row);
  image(img, x, y, frameWidth, frameHeight, row * frameWidth, col * frameHeight, frameWidth, frameHeight);
}

/*function loadSpriteSheet(path, frameWidth, frameHeight, frameSpeed, endFrame) {
  this.img = loadImage(path);
  this.framesPerRow;

  this.currentFrame = 0;
  this.counter = 0;

  this.image.onload = function() {
    //1600 magic number is the width of the image
    this.framesPerRow = floor(1600 / frameWidth);
  };

  this.update = function() {
    if (this.counter == (frameSpeed - 1)) {
      this.currentFrame = (this.currentFrame + 1) % endFrame;
    }
    this.counter = (this.counter + 1) % frameSpeed;
  };

  this.draw = function(x, y) {
    var row = floor(currentFrame / this.framesPerRow);
    var col = floor(currentFrame % this.framesPerRow);
    image(this.img,
    col * frameWidth,
    row * frameHeight,
    frameWidth, frameHeight,
    x, y,
    frameWidth, frameHeight);
  };
}
*/
