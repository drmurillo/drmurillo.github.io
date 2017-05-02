function Asteroid() {
  this.pos = createVector(random(width), random(height));
  //Size of Asteroid
  this.r = random(15, 75);

  this.vel = createVector(random(-1, 1), random(-1, 1));
  this.total = floor(random(5, 15));

  this.mutate = [];
  for (var i = 0; i < this.total; i++) {
    this.mutate[i] = random(-12, 12);
  }
  this.show = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.mutate[i];
      var x = r * cos(angle);
      var y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  };

  this.move = function() {
    this.pos.add(this.vel);
  };

  this.edges = function() {
    var left = width - width;
    var right = width;
    var top = height - height;
    var bottom = height;

    if (this.pos.x - this.r > right) {
      this.pos.x = left - this.r;
    } else if (this.pos.x + this.r < left) {
      this.pos.x = right + this.r;
    }
    if (this.pos.y - this.r > bottom) {
      this.pos.y = top - this.r;
    } else if (this.pos.y < top - this.r) {
      this.pos.y = bottom + this.r;
    }
  };
}
