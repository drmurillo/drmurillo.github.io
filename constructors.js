////////////////////////////////////////////////////////////////////////////////
////////////////////////// SHIP CONSTRUCTOR ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Ship() {
  this.pos = createVector(width / 2, height / 2);
  //Controls the shipSize of the ship. Higher value = larger ship
  this.shipSize = 18;
  //Adjusts the width of the ship. Higher value = skinnier ship
  this.widthAdj = 5;
  //Adjusts the indent on the ship proportionally to shipSize
  this.backAdj = this.shipSize / 2;
  //Defines the ship's vertex placement
  this.frontShip = createVector(0, -this.shipSize);
  this.bLeftShip = createVector(-this.shipSize + this.widthAdj, this.shipSize);
  this.backShip = createVector(0, this.backAdj);
  this.bRightShip = createVector(this.shipSize - this.widthAdj, this.shipSize);

  this.vel = createVector(0, 0);
  this.heading = 0;

  this.show = function() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    stroke(255);
    beginShape();
    fill(0);
    vertex(this.frontShip.x, this.frontShip.y);
    vertex(this.bLeftShip.x, this.bLeftShip.y);
    vertex(this.backShip.x, this.backShip.y);
    vertex(this.bRightShip.x, this.bRightShip.y);
    endShape(CLOSE);
    pop();
  };
  this.boost = function() {
    //Controls how fast the ship moves. Higher value = more boost
    var speedControl = 0.80;
    //Creates a vector that points in the direction of the ship
    var force = p5.Vector.fromAngle(this.heading);
    this.vel.add(force);
    this.vel.mult(speedControl);
  };

  this.turn = function(angle) {
    this.heading = this.heading + angle;
  };

  this.move = function() {
    this.pos.add(this.vel);
    //Reduces the speed of the ship over time. Higher value = more reduction
    this.vel.mult(0.98);
  };

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.shipSize) {
      return true;
    } else {
      return false;
    }
  };

  this.edges = function() {
    //Refers to the sides of the screen
    var left = width - width;
    var right = width;
    var top = height - height;
    var bottom = height;
    //Screenwrap
    if (this.pos.x - this.shipSize > right) {
      this.pos.x = left - this.shipSize;
    } else if (this.pos.x + this.shipSize < left) {
      this.pos.x = right + this.shipSize;
    }
    if (this.pos.y - this.shipSize > bottom) {
      this.pos.y = top - this.shipSize;
    } else if (this.pos.y < top - this.shipSize) {
      this.pos.y = bottom + this.shipSize;
    }
  };
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// LAZER CONSTRUCTOR ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Lazer(shipPos, shipHeading) {
  this.pos = createVector(shipPos.x, shipPos.y);
  this.velocity = p5.Vector.fromAngle(shipHeading);
  //Increases the speed of the laser. Higher value = more speed
  this.velocity.mult(15);

  this.move = function() {
    this.pos.add(this.velocity);
  };

  this.show = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  };

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.asteroidSize) {
      return true;
    } else {
      return false;
    }
  };

  //Function to remove lazers out of the array when they go offscreen
  //Currently not being used due to errors
  this.offscreen = function() {
    //Refers to the sides of the screen
    var left = width - width;
    var right = width;
    var top = height - height;
    var bottom = height;

    if (this.pos.x > right || this.pos.x < left) {
      return true;
    }
    if (this.pos.y > bottom || this.pos.y < top) {
      return true;
    }
    return false;
  };
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// ASTEROID CONSTRUCTOR ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function Asteroid(newAsteroid, newSize) {
  //If Asteroid receives a new Asteroid object, copy the new Asteroid's position
  //Otherwise the asteroid's position is random
  if (newAsteroid) {
    this.pos = newAsteroid.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }
  if (newSize) {
    //Reduces the size of the asteroid by half if it receives a size
    this.asteroidSize = newSize * 0.5;
  } else {
    //Sets the minimum and maximum size an asteroid can be
    this.asteroidSize = random(15, 75);
  }

  this.vel = createVector(random(-1, 1), random(-1, 1));
  //Total number of vertexes
  this.total = floor(random(5, 15));

  this.mutate = [];
  for (var i = 0; i < this.total; i++) {
    //Modifies the position of each vertex by a function of it's size
    this.mutate[i] = random(-this.asteroidSize * 0.5, this.asteroidSize * 0.5);
  }
  this.show = function() {
    push();
    stroke(255);
    noFill();
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.asteroidSize + this.mutate[i];
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

  this.breakup = function() {
    //Creates 2 new asteroids
    //Retains the position and size of the asteroid that was destroyed
    var newAsteroid = [];
    newAsteroid[0] = new Asteroid(this.pos, this.asteroidSize);
    newAsteroid[1] = new Asteroid(this.pos, this.asteroidSize);
    return newAsteroid;
  };
  this.edges = function() {
    //Refers to the sides of the screen
    var left = width - width;
    var right = width;
    var top = height - height;
    var bottom = height;

    if (this.pos.x - this.asteroidSize > right) {
      this.pos.x = left - this.asteroidSize;
    } else if (this.pos.x + this.asteroidSize < left) {
      this.pos.x = right + this.asteroidSize;
    }
    if (this.pos.y - this.asteroidSize > bottom) {
      this.pos.y = top - this.asteroidSize;
    } else if (this.pos.y < top - this.asteroidSize) {
      this.pos.y = bottom + this.asteroidSize;
    }
  };
}
