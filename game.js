var myObstacles = [];

var myGameArea = { // DGG: Para crear el escenario
  canvas : document.createElement('canvas'),
  frames: 0,
  start : function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.canvas.style.border = "2px dotted green"; // DGG: Para poner un borde al tablero
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.internal = setInterval(updateGameArea, 20);
  },
  clear: function() { // DGG: Para limpiar la pantalla antes de cada refresco
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.internal);
  },
  score: function() {
    points = ( Math.floor( this.frames/5 ) );
    this.context.font = '18px serif';
    this.context.fillStyle = 'black';
    this.context.fillText('Score: ' + points, 350, 50);
  },
}

function Component (width, height, color, x, y) { // DGG: Para crear el personaje y los obstáculos
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.left   = function() { return this.x };
  this.right  = function() { return (this.x + this.width) };
  this.top    = function() { return this.y };
  this.bottom = function() { return (this.y + this.height) };

  this.crashWith = function(obstacle) {
    return !(( this.bottom() < obstacle.top() )    ||
             ( this.top()    > obstacle.bottom() ) ||
             ( this.right()  < obstacle.left() )   ||
             ( this.left()   > obstacle.right() ) )
  }
}

function moveUp() {
  player.speedY -= 1;
}

function moveDown() {
  player.speedY += 1;
}

function moveLeft() {
  player.speedX -= 1;
}

function moveRight() {
  player.speedX += 1;
}

document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 38:
      moveUp();
      break;
    case 40:
      moveDown();
      break;
    case 37:
      moveLeft();
      break;
    case 39:
      moveRight();
      break;  
  }
}

document.onkeyup = function(e) {
  stopMove();
}

function stopMove() {
  player.speedX = 0;
  player.speedY = 0;
}

function updateGameArea() {
  myGameArea.clear();
  player.update();
  player.newPos();
  myGameArea.score();
  myGameArea.frames += 1;
  if ( myGameArea.frames % 120 === 0 ) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor( Math.random() * (maxHeight - minHeight + 1) + minHeight );
    minGap = 50;
    maxGap = 200;
    gap = Math.floor ( Math.random() * (maxGap - minGap + 1) + minGap );
    myObstacles.push( new Component(10, height, "brown", x, 0) );
    myObstacles.push( new Component(10, x - height - gap, "brown", x, height + gap) );
  }

  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update(); 
  }  


  var crashed = myObstacles.some(function(obstacle) {
    return player.crashWith(obstacle);
  })
  if (crashed) {
    myGameArea.stop();
  }
}



myGameArea.start();
player = new Component(30, 30, 'blue', 0, 110); // DGG: Se crea el personaje