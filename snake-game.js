
function sound(src){
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

class Game {

    snake =[];

    food = null;
    director = null;
    direction = 2;
    sizeSquare = 10;
    canvas  = null;

    head = new Image();
    body = new Image();
    apple = new Image();
    lose = new Image();
    eatingNoise = new sound("media/food.mp3");


    isLost = false;
    detailDirection=["", "Up", "Right","Down", "Left"];
    
    constructor(txtButton, txtState, canvas){
        this.txtButton = txtButton;
        this.txtState = txtState;
        this.canvas = canvas;

        this.ctx = this.canvas.getContext("2d");

        this.head.src = "media/imagenes/snake-head.png";
        this.body.src = "media/imagenes/snake-body.png";
        this.apple.src = "media/imagenes/apple.png";
        this.lose.src = "media/imagenes/lose.png";
    }

    init () {

        let square = new Object();
        square.X = 15;
        square.Y = 15;
        square.X_old = 15;
        square.Y_old = 15;
        this.snake.push(square);

        document.addEventListener("keypress", (e) =>{
            this.printKey(e.key); // catching the key press player

            switch(e.key){
                case 'w':
                    if(this.direction != 3)
                        this.direction = 1;
                    break;
                case 'd':
                    if(this.direction != 4)
                        this.direction = 2;
                    break;
                case 's':
                    if(this.direction != 1)
                        this.direction = 3;
                    break;
                case 'a':
                    if(this.direction != 2)
                        this.direction = 4;
                    break;
            }


        });

        this.director = setInterval(()=> {
            this.rules();
            if(!this.isLost) {
                this.next();
                this.show();
            }else {
                clearInterval(this.director);
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(this.lose,0,0);
            }
        }, 100);
    }

    next() {
        this.printDirection();

        if(this.food == null)
            this.getFood();

        // I assing new positions to the snake
        this.snake.map((square) => {
            square.X_old = square.X;
            square.Y_old = square.Y;
        });

        // new head position
        switch(this.direction) {
            case 1:
                this.snake[0].Y--;
                break;
            case 2: 
                this.snake[0].X++;
                break;
            case 3:
                this.snake[0].Y++;
                break;
            case 4:
                this.snake[0].X--;
                break;
        }

        this.snake.map( (square, index, snake_) => {
            if(index != 0){
                square.X = snake_[index -1].X_old;
                square.Y = snake_[index -1].Y_old;
            }
        })

        if(this.food != null)
        this.isEating();
    }

    show() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.snake.map((square, index) => {
            if (index == 0) {
                this.ctx.drawImage(this.head, 
                    square.X * this.sizeSquare,
                    square.Y * this.sizeSquare);
            } else {
                this.ctx.drawImage(this.body, 
                    square.X * this.sizeSquare,
                    square.Y * this.sizeSquare);
            }

            if (this.food != null) {
                this.ctx.drawImage(this.apple, this.food.X * this.sizeSquare,
                    this.food.Y * this.sizeSquare);
            }
        });
    }

    rules() {

        // rule one, colisionss
        for(let j = 0; j < this.snake.length; j++){
            for(let i = 0; i < this.snake.length; i++){
                if(j != i){
                    if(this.snake[j].X == this.snake[i].X &&
                        this.snake[j.Y == this.snake[i].Y])
                            this.isLost = true;                        
                }
            }
        }
        //rule two, out of screem
        if(this.snake[0].X >= 30 || this.snake[0].X < 0 ||
            this.snake[0].Y >= 30 || this.snake[0].Y < 0)            
                this.isLost = true;
            
    }

    isEating() {
        if(this.snake[0].X == this.food.X &&
            this.snake[0].Y == this.food.Y){
                
            this.food = null;
            this.eatingNoise.play();

            let square = new Object();
            square.X = this.snake[this.snake.length -1].X_old;
            square.Y = this.snake[this.snake.length -1].Y_old;
            this.snake.push(square);
        }
    }

    getFood() {
        let square = new Object();
        square.X = Math.floor(Math.random() * 30);
        square.Y = Math.floor(Math.random() * 30);
        this.food = square;
    }

    printDirection() {
        this.txtState.value = this.detailDirection[this.direction];
    }    

    printKey(text) {

        this.txtButton.value = text;
    }

}

var game =new Game(document.getElementById("txtButton"),
    document.getElementById("txtState"), document.getElementById("canvas"));
game.init();