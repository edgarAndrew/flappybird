// Flappy Bird js script
// Developed by Edgar Camelo, 2nd Year B.E Information Technology
// Date: 18-03-2022

// VARIABLES

//1. DOM element variables
const screen = document.querySelector('.screen');
const menu = document.querySelector('.menu');
const playButton = document.querySelector('.play-btn');
const bird = document.querySelector('.bird');
const scoreBoard = document.querySelector('.score');

//2. Obstacle blocks array
const blocksArray = []

//3. Boolean conditions
let gameStarted = false;
let isJumping = false;
let screenEnabled = false;

//4. Counters and score variables
let jumpCount = 0;
let freefall = 0;
let jumpLimit = 0;
let score = 0;
let bestScore = 0;

//5. Set Interval variables
let blockMotion = 0;
let gravityTimer = 0;
let collisonChecker = 0;
let scoreUpdater = 0;

//6. Element Position variables
let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue('left'));
let holeTop = 0;
let blockLeft = 0;


// TEMPLATE CLASS

// Class to add Obstacles (Blocks) to screen 
class Block{
    constructor(blockLeft){
        // For Block part of Obstacle
        this.left = (screen.offsetWidth > 480 ? blockLeft + 280 : blockLeft + 250);
        this.block = document.createElement('div');
        
        const block = this.block;
        block.classList.add('block')
        block.style.left = this.left + 'px';
        screen.appendChild(block)

        // For Hole part of Obstacle
        this.top = (screen.offsetWidth>480?((Math.random() * 200) + 100):((Math.random() * 300) + 50))
        this.hole = document.createElement('div');

        const hole = this.hole;
        hole.classList.add('hole');
        hole.style.top = this.top + 'px';
        hole.style.left = this.left +'px';
        screen.appendChild(hole);
    }
}


// FUNCTIONS

//1. Function to create blocks
function createBlocks(){
    let blockCount = 2;
    let blockLeft = 150;
    for(let i = 0; i < blockCount; i++){
        let newBlock = new Block(blockLeft);
        blockLeft = newBlock.left;
        blocksArray.push(newBlock);
    }
}

//2. Function to move blocks from right to left
function moveBlocks(){
    if(gameStarted){
        blocksArray.forEach(item=>{
            item.left -= 4;
            const block = item.block;
            const hole = item.hole;

            block.style.left = item.left + 'px'; 
            hole.style.left = item.left + 'px';

            if(item.left < -50 ){
                block.classList.remove('block');
                hole.classList.remove('hole');
                blocksArray.shift();

                let newBlock = (screen.offsetWidth > 480 ? new Block(240) : new Block(220));
                blocksArray.push(newBlock);
                score++;
            }
        })
    }
}

//3. Function for gravity
function gravity(){
    if(gameStarted){
        if(!isJumping){
            birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
            
            birdTop = birdTop + 5;
            bird.style.top = birdTop + "px";
    
            if(freefall > 10){  // sudden dive when bird is inactive for 10 calls without jump
                birdTop = birdTop + 3;
                bird.style.top = birdTop + "px";
            }
        }
    }
    freefall++;
}

//4. Function for bird jump
function jump(){
    if(gameStarted){
        isJumping = true;
        jumpCount = 0;
        freefall = 0;
        let jump_interval = setInterval(function(){
            if(birdTop > 6){
                birdTop = birdTop - 5;
                bird.style.top = birdTop + 'px';
            }
            else{
                birdTop = birdTop + 2;
                bird.style.top = birdTop + 'px';
            }
            jumpLimit = (window.screen.width > 900 ? 12 : 10)
            if(jumpCount > jumpLimit){
                isJumping = false;
                clearInterval(jump_interval);
                jumpCount = 0;
            }
            jumpCount++;
        },10)    
    }  
}

//5. Function to check if collision has occured
function check_collision(){
    if(gameStarted){
            let item = blocksArray[0];
            birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
            holeTop = item.top;
            blockLeft = item.left;

            // All calculations done w.r.t
            // blockwidth = 55px, holeHeight = 135px, birdHeight = 30px
            if(screen.offsetWidth > 480) // For larger screens
            {
                // All calculations are done w.r.t birdLeft = 96px, screenHeight = 480px
                if((birdTop > 450) || ((blockLeft<128) && (blockLeft>40) &&
                    ((birdTop < holeTop) || (birdTop>=(holeTop+135-30))))){
                        stopGame();
                }
            }
            else    // for mobile devices
            {
                 // All calculations are done w.r.t birdLeft = 81px, screenHeight = 580px 
                if((birdTop > 550) || ((blockLeft<112) && (blockLeft>25) &&
                    ((birdTop <= holeTop) || (birdTop>=(holeTop+135-30))))){
                        stopGame();
                    }
            }
    } 
};

//6. Function to Stop the game
function stopGame(){
    clearInterval(blockMotion);
    clearInterval(gravityTimer);
    clearInterval(collisonChecker);
    gameStarted = false;
    screenEnabled = false;
    menu.style.zIndex = "2";
}

//7. Function to update score
function keepScore(){
    if(score > bestScore){
        bestScore = score;
        menu.childNodes[3].innerHTML = `<h3>Best</h3>${bestScore}`;
    }
    scoreBoard.innerHTML = `<h3>Score</h3><li>${score}</li>`;
    menu.childNodes[1].innerHTML = `<h3>Score</h3>${score}`;
}

//8. Function to remove all blocks from screen
function clearScreen(){
    let blockCount = 2;
    if(blocksArray.length > 0){
        for(let i = 0; i < blockCount; i++){
            let item = blocksArray[0];
            let block = item.block;
            let hole = item.hole;
            block.remove();
            hole.remove();
            blocksArray.shift();
        }   
    }
}


// EVENT LISTENERS

//1. Event listener on Play Button on the menu
playButton.addEventListener('click',function(event){
    event.stopPropagation();
    menu.style.zIndex = "0";
    bird.style.top = '50%';
    score = 0;
    clearScreen();
    createBlocks();

    // Changing BlockMotion and gravityTimer depending on User screen width
    blockMotion = (window.screen.width > 900 ? setInterval(moveBlocks,16):setInterval(moveBlocks,26));
    gravityTimer = (window.screen.width > 900 ? setInterval(gravity,20):setInterval(gravity,30));
    collisonChecker = setInterval(check_collision,15);
    scoreUpdater = setInterval(keepScore,250);
});

//2. Touch Start event listener (works well on mobile)
screen.addEventListener('touchStart',(e)=>{
    if(screenEnabled){
        gameStarted = true;
        jump();
    }
    screenEnabled = true;
    e.preventDefault();
})

//3. Click event Listener (works well on desktop)
screen.addEventListener('click',(e)=>{
    if(screenEnabled){
        gameStarted = true;
        jump();
    }
    screenEnabled = true;
    e.preventDefault();
},false)
