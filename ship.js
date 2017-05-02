function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.r = 20;
  this.heading = 0;
  this.vel = createVector(0, 0);

  this.show = function() {
    //Adjusts the width of the ship. Higher value = skinnier ship
    var widthAdj = 5;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    stroke(255);
    noFill();
    //Ship center is x: 0, y: 0
    //Top to Bottom Left
    line(0, -this.r, -this.r + widthAdj, this.r);
    //Bottom Right to Top
    line(this.r - widthAdj, this.r, 0, -this.r);
    //Bottom left to Center
    line(-this.r + widthAdj, this.r, 0, 8);
    //Bottom right to Center
    line(this.r - widthAdj, this.r, 0, 8);
    pop();
  };

  this.boost = function() {
    var force = p5.Vector.fromAngle(this.heading);
    this.vel.add(force);
    this.vel.mult(0.80);
  };

  this.turn = function(angle) {
    this.heading = this.heading + angle;
  };
  this.move = function() {
    this.pos.add(this.vel);
  };
  this.edges = function() {
    var left = width - width;
    var right = width;
    var top = height - height;
    var bottom = height;
    //Screenwrap
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
