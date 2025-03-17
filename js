//board
let board;
let boardWidth = 560;
let boardHeight = 640;
let context;

//bird
let birdWidth = 84; //width/height ratio = 408/228 = 17/12
let birdHeight = 74;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird moving up
let gravity = 0.4;

let gameOver = false;
let score = 0;

let hitSound = new Audio("photo/audio (3) (1).mp3");

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load bird images
    birdImg = new Image();
    birdImg.src = "photo/george face 2.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //load crash image
    crashImg = new Image();
    crashImg.src = "photo/george gosa.png";

    topPipeImg = new Image();
    topPipeImg.src = "photo/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "photo/bottompipe.png";

     // Start button event listener
     document.getElementById("startButton").addEventListener("click", startGame);
    }
    
    function startGame() {
        document.getElementById("startButton").style.display = "none"; // Hide the start button

    requestAnimationFrame(update);
    setInterval(placePipes, 1700); //every 1.5 seconds
    document.addEventListener("keydown", movebird);
    
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        context.clearRect(0, 0, board.width, board.height);
        // Draw the crash image instead of the bird when game over
        context.drawImage(crashImg, (boardWidth - bird.width * 3) / 2, (boardHeight - bird.height * 3) / 2, bird.width * 3, bird.height * 3);
        context.fillStyle = "black";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);
        context.fillText("اعطاني خساره", 180, 180);
        context.fillStyle = "black";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.strokeRect(80, 455, 400, 60);
        context.fillStyle = "black";
        context.fillText(" 😊سوف اعطيك فرصه", 85, 500);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y >= boardHeight) {
        gameOver = true;
    } 


    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;    
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)) {
            hitSound.play();
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //remove the first element from the array
    }

    //score
   context.fillStyle = "white";
   context.font = "45px sans-serif";
   context.fillText(score, 5, 45); 
   
   if (gameOver) {
       context.fillText("Game Over", 5, 90);
   }

}    

function placePipes() {
   if (gameOver) {
       return;
   }

    //(0-1)*pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) =3/4 pipeHeight
   let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
   let openingSpace = boardHeight/2.5; //space between top and bottom pipes
   
   let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    } 

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace, 
        width : pipeWidth,
        height : pipeHeight
    }
    pipeArray.push(bottomPipe);
}

function movebird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }      
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
