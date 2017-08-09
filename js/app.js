/* SNAKE NINJA v1.0 by Oskar Kosela */
function init() {
	var canvas = document.querySelector("#app");
	var ctx = canvas.getContext("2d");
	


function gameMap(ctx, canvas) {
	
	this.canvas = canvas;
	this.ctx = ctx;
	this.playtime = 0;
	//drawing Map
	this.drawMap = function(score) {
		
		this.score = score;
		

		
		this.ctx.beginPath();
		this.ctx.rect(0, 0, 500, 500);

		


		this.ctx.fillStyle = 'black';
		this.ctx.fill();
		this.ctx.font = '20px serif';
		this.ctx.fillStyle = 'white';

		this.ctx.fillText('SCORE: ' + this.score, 10, 20);
		this.ctx.fillText('SPEED: ' + ninja.snake.speed, 10, 50);
		this.ctx.fillText('PLAY TIME: ' + this.playtime, 350, 20);
		this.ctx.closePath();
		if(ninja.snake.paused)
		{
			this.ctx.beginPath();
			this.ctx.font = '50px serif';
			this.ctx.fillStyle = 'white';
			this.ctx.fillText('PAUSE', 170, 240);
			this.ctx.closePath();			
		}
	};
		
}
function Apple(ctx, canvas) {
	this.canvas = canvas;
	this.ctx = ctx;
	this.size = 25;
	this.onBoard = false;
	this.x = 0;
	this.y = 0;
	this.scoreValue = 5;
	this.radius = 25/2;
	//random position of Apple
	this.randomize = function() {
		
		this.x = Math.floor(Math.random() * (this.canvas.width/this.size))*this.size+25/2;
		//console.log('x apple: ',this.x);
		this.y = Math.floor(Math.random() * (this.canvas.height/this.size))*this.size+25/2;		
		//console.log('y apple: ',this.y);
	};
	//drawing Apple 
	this.drawApple = function() {
		this.ctx.fillStyle = 'green';
		this.ctx.beginPath();

	
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		//this.ctx.rect(this.x*this.size, this.y*this.size, this.size, this.size);
		this.ctx.fill();
		this.ctx.closePath();
	};
}

function Snake(ctx, canvas) {
	var that = this;
	this.canvas = canvas;
	this.ctx = ctx;
	this.speed = 140;
	this.changeSpeed = function(addspeed) {
		this.speed = this.changeSpeed + addspeed;
	};
	this.size = 25;
	this.bodyParts = 10;
	this.bodyPartsHolder = [];
	this.direction = 'down';
	this.paused = false;
	this.alive = true;
	this.eaten = false;
	//init Snake
	this.initSnake = function() {
		for (var i = 0; i < this.bodyParts; i++) {
			this.bodyPartsHolder.push({x:12.5, y:12.5});
		};
		this.makeSnakeListen(window);
	};
	//update position of every each part of Snake
	this.updatePosition = function() {
		var tempx = this.bodyPartsHolder[this.bodyParts-1].x;
		var tempy = this.bodyPartsHolder[this.bodyParts-1].y;
		var prevX = tempx;
		var prevY = tempy;
		switch (this.direction) {
			case 'right':
				this.bodyPartsHolder[this.bodyParts-1].x++;
				break;
			case 'down':
				this.bodyPartsHolder[this.bodyParts-1].y++;
				break;
			case 'left':
				this.bodyPartsHolder[this.bodyParts-1].x--;
				break;
			case 'up':
				this.bodyPartsHolder[this.bodyParts-1].y--;
				break;
		}

		for (var i = this.bodyParts-2; i >= 0; i--) {
			tempx = this.bodyPartsHolder[i].x;
			tempy = this.bodyPartsHolder[i].y;
			this.bodyPartsHolder[i].x = prevX;
			this.bodyPartsHolder[i].y = prevY;
			prevX = tempx;
			prevY = tempy;
		};

	};
	//make Snake listen keyboard's arrows
	this.makeSnakeListen = function(window) {
		window.onkeydown = function(e) {
			switch(e.keyCode) {
				case 37:
					if(that.direction != 'right') {
						that.direction = 'left';
					};
					break;
				case 38:
					if(that.direction != 'down') {
						that.direction = 'up';
					};
					break;
				case 39:
					if(that.direction != 'left') {
						that.direction = 'right';
					};
					break;
				case 40:
					if(that.direction != 'up') {
						that.direction = 'down';
					};
					break;
			
				case 32: /* space */
					if(that.paused) {
						that.paused = false;
					} else {
						that.paused = true;
						
					};
					break;
			};
		};
	};
	//moving Snake
	this.moveSnake = function() {
		this.drawSnake();
		this.updatePosition();
	};
	//drawing Snake
	this.drawSnake = function() {
		for(var i = 0; i < this.bodyParts; i++) {
			this.ctx.beginPath();
			var radius = 25/2;
			this.ctx.arc(this.bodyPartsHolder[i].x*this.size, this.bodyPartsHolder[i].y*this.size, radius, 0, Math.PI * 2, false);
			this.ctx.fillStyle="red";
			//console.log('snake x:', this.bodyPartsHolder[this.bodyParts-1].x*this.size);
			//console.log('snake y:', this.bodyPartsHolder[this.bodyParts-1].y*this.size);
			this.ctx.fill();
			this.ctx.closePath();
		};
	};
	//checking collisions snake vs apple
	this.checkCollissions = function(appleX, appleY) {
		var sneakHead = this.bodyPartsHolder[this.bodyParts-1];
		if(sneakHead.x*this.size >= canvas.width || sneakHead.x < 0) {
			this.alive = false;
		}
		if(sneakHead.y*this.size >= canvas.height || sneakHead.y < 0) {
			this.alive = false;
		}
		if(sneakHead.x*this.size == appleX && sneakHead.y*this.size == appleY) {
			this.eaten = true;
			ninja.music.play(ninja.music.eaten_sound);
		}
		for (var i = 0; i < this.bodyPartsHolder.length-1; i++) {
			if(sneakHead.x == this.bodyPartsHolder[i].x && sneakHead.y == this.bodyPartsHolder[i].y) {
				this.alive =  false;
			}
		}
	};
	// Snake growing
	this.grow = function() {
		this.bodyParts++;
		this.bodyPartsHolder.unshift({x:-1, y:-1});
	};
};

function Music() {
	this.track_game = new Audio("mid/track1.mp3");
	this.track_start = new Audio("mid/track2.mp3");
	this.track_end = new Audio("mid/track4.mp3");
	this.eaten_sound = new Audio("mid/apple.mp3");
	this.play = function(song) {
		song.play();
	};
	this.pause = function(song) {
		song.pause();
	};
	this.end = function(song) {
		song.pause();
		delete song;
		//currentTime ? 
	};

};

//heart of the GAME

function Game(){
	var that = this;
	this.canvas = canvas;
	this.ctx = ctx;
	this.width = canvas.width;
	this.height = canvas.height;
	this.state = 'New';
	this.snake = new Snake(this.ctx, this.canvas);
	this.apple = new Apple(this.ctx, this.canvas);
	this.gamemap = new gameMap(this.ctx, this.canvas);
	this.music = new Music();
	this.appleCorrect = true;
	this.score = 0;
	//drawing Welcome screen
	this.drawWelcome = function() {
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,this.width,this.height);


		var logo_start = new Image();
		logo_start.onload = function(){
			ctx.drawImage(logo_start, 175, 150, 150, 130);
		};
		logo_start.src = 'img/snake.png';
		
		ctx.fillStyle = "white";
		ctx.font = '48px serif';
		ctx.fillText('SNAKE NINJA', 100, 50);
		ctx.fillStyle = "red";
		ctx.fillText('v1.0 Beta', 150, 100);
		ctx.font = '24px serif';
		ctx.fillStyle = "white";
	
		ctx.fillText('Press ENTER to start', 150, 400);

		ctx.fillText('Press SPACE to pause', 150, 450);
		// waiting for ENTER key
		window.onkeydown = function(e) {
			switch(e.keyCode) {
				case 13: /* enter keycode*/
				that.state = 'PlayGame';
				that.init();
				break;
			};	
		};

	};
	//game activation
	this.activateGame = function() {
		
		this.snake.initSnake();

		
		this.intervalID = setInterval(function() {

			if(that.snake.eaten) {
				that.score += that.apple.scoreValue;
				that.apple.onBoard = false;
				that.snake.grow();
				that.snake.eaten = false;
			}
			if(that.snake.paused != true) {
				that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
			};
			if (that.snake.alive) {
				that.gamemap.drawMap(that.score);
				that.gamemap.playtime++;
			}
			if(that.apple.onBoard) {

				that.apple.drawApple();
			} else {
				do {
					that.appleCorrect = true;
					that.apple.randomize();
					for(var i = 0; i < that.snake.bodyPartsHolder.length; i++) {
						if(that.apple.x == that.snake.bodyPartsHolder[i].x && that.apple.y == that.snake.bodyPartsHolder[i].y) {
							that.appleCorrect = false;
							break;
						}
					}
				} while(!(that.appleCorrect));
				that.apple.onBoard = true;
				that.apple.drawApple();
			}
			if(that.snake.alive) {
				if(that.snake.paused != true) {
					
					that.snake.moveSnake();

					that.snake.checkCollissions(that.apple.x, that.apple.y);
				}
			} else {
				that.ctx.beginPath();
				that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
				that.ctx.beginPath();
				that.ctx.rect(0, 0, 500, 500);
				that.ctx.fillStyle = 'black';
				that.ctx.fill();
				that.ctx.font = '50px serif';
				that.ctx.fillStyle = 'red';
				that.ctx.fillText('GAME OVER', 120, 200);
				that.ctx.font = "30px serif";
				that.ctx.fillText('Press ENTER', 180, 250);
				that.ctx.fillText('Your Score: '+that.score, 180, 285);
				that.ctx.fillStyle = 'white';
				that.ctx.closePath();
				clearInterval(that.intervalID);
				that.state = 'GameLost';
				that.init();
			}
		}, this.snake.speed);
	};
	//game initialization
	this.init = function() {
		switch(this.state) {
			case 'New':
				this.drawWelcome();
				that.music.play(that.music.track_start);
				break;
			case 'PlayGame':
				this.activateGame();
				that.music.end(that.music.track_start);
				that.music.play(that.music.track_game);

				break;
			case 'GameLost':
				that.music.end(that.music.track_game);
				that.music.play(that.music.track_end);
				window.onkeydown = function(e) {
					switch(e.keyCode) {
						case 13: /* Enter */
						that.score = 0;
						that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
						that.snake = null;
						that.snake = new Snake(that.ctx, that.canvas);
						that.apple = new Apple(that.ctx, that.canvas);
						that.state = 'New';
						that.music.end(that.music.track_end);
						that.init();
						break;
					};
				};
				break;
		};
	};
};




	var ninja = new Game(ctx, canvas);
	ninja.init();
	
};
init();