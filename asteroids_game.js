//Known issues: Ship turn at Line 70 still isn't working with a variable name
//Hit detection for asteroids is based on their size. Line 34 has debugging for seeing the actual hitbox. Need to adjust.

//TO DO
//Add score!
//Add lives
//Add game over screen when you run out of lives

var ship;

var asteroids = [];
var asteroidCount = 10;
var asteroidMinSize = 20;

var lazers = [];

//Keycodes for controls
var spaceBar = 32;
//WASD controls
var turnLeft = 65;
var turnRight = 68;
var moveForward = 87;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (i = 0; i < asteroidCount; i++) {
    asteroids.push(new Asteroid());
  }
  ship = new Ship();
}

function draw() {
  background(0);
  for (i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].show();
    //Debugging: this is the hit box of each asteroid visualized.
    //ellipse(asteroids[i].pos.x, asteroids[i].pos.y, asteroids[i].asteroidSize, asteroids[i].asteroidSize);
    asteroids[i].move();
    asteroids[i].edges();
    //Death check
    if (ship.hits(asteroids[i])) {
      ship.isAlive = false;
      //Minus 1 life
    }
  }
  for (i = lazers.length - 1; i >= 0; i--) {
    lazers[i].show();
    lazers[i].move();
    if (lazers[i].offscreen()) {
      lazers.splice(i, 1);
    } else {
      for (j = asteroids.length - 1; j >= 0; j--) {
        if (lazers[i].hits(asteroids[j])) {
          if (asteroids[j].asteroidSize > asteroidMinSize) {
            //Create two new asteroids as an array and copies them
            var newAsteroid = asteroids[j].breakup();
            //Join the newAsteroid array with asteroids array
            asteroids = asteroids.concat(newAsteroid);
            //Increase Score!
          }
          //Remove the asteroid that got hit
          asteroids.splice(j, 1);
          //Remove the lazer that hit the asteroid
          lazers.splice(i, 1);
          break;
        }
      }
    }
  }
  if (ship.isDead() == false) {
    ship.show();
    ship.move();
    ship.edges();
  } else if (ship.isDead() == true) {
    ship.deathAnimation();
    //At the end of the death animation, ship.isAlive is set to true
    if (ship.isAlive == true) {
      ship = new Ship();
    }
  }
  if (ship.isDead() == false && keyIsDown(LEFT_ARROW) || keyIsDown(turnLeft)) {
    //Determines how quickly the ship turns. Higher value = faster turn
    var turnRate = 0.08;
    ship.turn(turnRate * -1);
  } else if (ship.isDead() == false && keyIsDown(RIGHT_ARROW) || keyIsDown(turnRight)) {
    //bug: can't pass 'turnRate' in without breaking
    ship.turn(0.08);
  }
  if (ship.isDead() == false && keyIsDown(UP_ARROW) || keyIsDown(moveForward)) {
    ship.boost();
  }
}

function keyPressed() {
  if (keyCode == spaceBar && ship.isDead() == false) {
    lazers.push(new Lazer(ship.pos, ship.heading));
  }
}
