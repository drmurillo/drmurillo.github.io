function Lazer(shipPos, shipHeading, shipFront) {
  this.shipPos = createVector(shipPos.x, shipPos.y);
  this.pos = createVector(shipFront.x, shipFront.y);
  this.vel = p5.Vector.fromAngle(shipHeading);
  this.vel.mult(10);
  this.heading = shipHeading;

  this.show = function() {
    push();
    stroke(255);
    strokeWeight(4);
    translate(shipPos.x, shipPos.y);
    rotate(this.heading + PI / 2);
    point(this.pos.x, this.pos.y);
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
