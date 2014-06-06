// Create the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");



// Game objects
var player = new Object(),
    ball = new Object(),
    points = 0;

player.speed = 256;
player.x = 30;
player.y = canvas.height / 2;

ball.x = canvas.width / 2;
ball.y = canvas.width / 2;
ball.angle = 0;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

function resetBallPosition() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

var plusx = -2,
    plusy = +1

// Update game objects
function update(modifier) {
    if (38 in keysDown && player.y > 10) { // Player holding up
        player.y -= player.speed * modifier;
    }
    if (40 in keysDown && player.y < canvas.height - 40) { // Player holding down
        player.y += player.speed * modifier;
    }
    
    ball.x += plusx;
    ball.y += plusy;
    
    if ((Math.abs(ball.x - player.x) < 20) && (Math.abs(ball.y - player.y) < 30)) {
        plusx = +2;
        plusy = -2;
        points++;
    }
    
    if (ball.x == 0) {
        resetBallPosition();
    }
    
    document.getElementById("points").innerHTML = points;
}



// The main game loop
function main() {
    var now = Date.now();
    var delta = now - then;
    
    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
}



// Draw everithing
var playerImage = new Image();
playerImage.src = "images/player.png";

function render() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, 512, 480);
    
    ctx.fillStyle = "#5dd3c2";
    ctx.fillRect(ball.x, ball.y, 10, 10)
    
    ctx.drawImage(playerImage, player.x, player.y);
}



// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
main();