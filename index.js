const board_border = 'black';
const board_background = "white";
const snake_col = 'orange';
const snake_border = 'red';

let snake = [ 
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
];

let score = 0;

// True if changing direction
let changing_direction = false;


//postion of food
let food_x;
let food_y;

// Horizontal and vertical velocity
let dx = 10;
let dy = 0;

// Get the canvas element
const snakecanvas = document.getElementById("snakecanvas");
const snakecanvas_ctx = snakecanvas.getContext("2d");


main(); // start game

spawn_food(); // put the food at random location

document.addEventListener("keydown", change_direction);


function main() { 
    if (has_game_ended()) return;

    changing_direction = false;

    setTimeout(function onTick() { 
        empty_board();
        makeFood();
        move_snake();
        makeSnake();
        // Call main again
        main();
    }, 100)
}


//functin for empty the board

function empty_board() { 
    snakecanvas_ctx.fillStyle = board_background;
    snakecanvas_ctx.strokestyle = board_border;
    snakecanvas_ctx.fillRect(0, 0, snakecanvas.width, snakecanvas.height);
    snakecanvas_ctx.strokeRect(0, 0, snakecanvas.width, snakecanvas.height);
}


function makeSnake() {
    snake.forEach(makeSnakePart)
}

function makeFood() {
    snakecanvas_ctx.fillStyle = 'lightgreen';
    snakecanvas_ctx.strokestyle = 'darkgreen';
    snakecanvas_ctx.fillRect(food_x, food_y, 10, 10);
    snakecanvas_ctx.strokeRect(food_x, food_y, 10, 10);
}


function makeSnakePart(snakePart) {
    snakecanvas_ctx.fillStyle = snake_col;
    snakecanvas_ctx.strokestyle = snake_border;
    snakecanvas_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakecanvas_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}


function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
       if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }

    const hitLeftWall = snake[0].x < 0; 
    const hitRightWall = snake[0].x > snakecanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakecanvas.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}



function random_food(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}


function spawn_food() {
    food_x = random_food(0, snakecanvas.width - 10);
    food_y = random_food(0, snakecanvas.height - 10);
    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) spawn_food();
    });
}

function change_direction(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40; 

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    if (keyPressed === LEFT_KEY && !goingRight) { 
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) { 
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) { 
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {  
        dx = 0;
        dy = 10;
    }
}


function move_snake() { 

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) { 
        //increase score
        score +=1;
        //display score on screen
        document.getElementById('score').innerHTML = score;
        //generate new food location randomly
        spawn_food();
    } else {
        //remove the last part of snake body
        snake.pop();
    }
}


//toggle

function toggleTheme() {
    const body = document.body;

    body.classList.toggle("dark-theme"); 
    // localStorage.setItem("theme", body.classList.contains("dark-theme") ? "dark" : "light");
    localStorage.setItem('darkTheme', isDarkTheme);
}

const storedTheme = localStorage.getItem('darkTheme');
if(storedTheme == 'true') {
    toggleTheme();
}

const themeToggleBtn = document.getElementById('themeToggle')
if(themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme)
}