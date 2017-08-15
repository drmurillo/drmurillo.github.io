var data;
var tallestIndex;
var smallestIndex;

var sortedData;

var dataCount;

var originalDataLength;

var start;
var reset;

const WIDTH = 4;

function startSorting() {
  if (data.length != 0) {
    bubbleSort(data);
  }
}

function resetSorting() {
  data = [];
  sortedData = [];
  for (var rows = 0; rows < dataCount; rows++) {
    data.push(new Rectangle(rows));
  }
}

function setup() {
  createCanvas(1200, 800);
  dataCount = canvas.width / WIDTH;
  data = [];
  sortedData = [];
  for (var rows = 0; rows < dataCount; rows++) {
    data.push(new Rectangle(rows));
  }
  start = createButton('sort');
  //start.mousePressed(startSorting);
  reset = createButton('reset');
  reset.mousePressed(resetSorting);
}

function draw() {
  background(0);
  for (var i = 0; i < data.length; i++) {
    data[i].show();
  }
  startSorting();
  for (var i = 0; i < sortedData.length; i++) {
    if (sortedData[i].sorted == false) {
      sortedData[i].c = color(255, 255, 255);
      sortedData[i].x = i * sortedData[i].width;
      //sortedData[i].y = 0;
      //sortedData[i].height *= -1;
      sortedData[i].sorted = true;
    }
    sortedData[i].show();
  }
}

function Rectangle(x) {
  this.width = WIDTH;
  this.height = floor(random(-25, -window.height));
  this.x = x * this.width;
  this.y = window.height;
  this.c = color(0, 0, 255);
  //for random colors
  /*color(
  random(25, 255),
  random(10, 255),
  random(75, 255)); */

  this.sorted = false;

  this.show = function() {
    fill(this.c);
    rect(this.x, this.y, this.width, this.height);
  };
}

function bubbleSort(array) {
  //  while (array.length > 0) {
  tallestIndex = array[0];
  smallestIndex = array[0];
  for (var i = 0; i < array.length; i++) {
    if (tallestIndex.height > array[i].height) {
      tallestIndex = array[i];
    }
    if (smallestIndex.height < array[i].height) {
      smallestIndex = array[i];
      smallestIndex.c = color(0, 255, 0);
    }
  }
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == smallestIndex) {
      sortedData.push(array[i]);
      array.splice(i, 1);
    }
  }
  //}
}
