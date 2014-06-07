var mode = 1;

var keysDown = {};

var ball_state = 0; // 0 - still  1 - in Spiel

var ball_pos_x = 310;
var ball_pos_y = 220;
var ball_speed = 5;

var ball_di_x = 1;
var ball_di_y = 1;

var img_ball_size = 20;

var img_ball, img_ball_ready;
var img_bat, img_bat_ready;
var img_field, img_field_ready;

function setBallState(val) {
    "use strict";
    
    ball_state = val;
}

function setBallPosition(x, y) {
    "use strict";
    
    ball_pos_x = x;
    ball_pos_y = y;
}

function setRandDirection() {
    "use strict";
    
    var rand_1 = Math.random() * 2 - 1;
    var rand_2 = Math.random() * 2 - 1;
    
    var ball_di_x = rand_1 / Math.sqrt(Math.pow(rand_1, 2) + Math.pow(rand_2, 2));
    var ball_di_y = rand_2 / Math.sqrt(Math.pow(rand_1, 2) + Math.pow(rand_2, 2));
}

function checkCollision() {
    "use strict";
    
    if (ball_pos_x - img_ball_size >= 600) {
        return 0;
    }
    
    if (ball_pos_y + img_ball_size >= 480) {
        return 1;
    }
    
    if (ball_pos_x <= 0) {
        return 2;
    }
    
    if (ball_pos_y <= 0) {
        return 3;
    }
}



function eventListener() {
    "use strict";
    
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);
}

function init() {
    "use strict";
    
    var canvas_ctx = document.getElementById("canvas").getContext("2d");
    return canvas_ctx;
}

function loadImages() {
    "use strict";
    
    img_field_ready = false;
    img_field = new Image();
    img_field.onload = function () {
        img_field_ready = true;
    };
    img_field.src = "images/field_1.png";

    img_ball_ready = false;
    img_ball = new Image();
    img_ball.onload = function () {
        img_ball_ready = true;
    };
    img_ball.src = "images/ball_1.png";

    img_bat_ready = false;
    img_bat = new Image();
    img_bat.onload = function () {
        img_bat_ready = true;
    };
    img_bat.src = "images/bat_1.png";
}

function logic() {
    "use strict";
    
    
    
    if (mode === 1) {
        
        if (ball_state === 0) {
        
            setBallPosition((640 / 2) - (img_ball_size / 2), (480 / 2) - (img_ball_size / 2));
            setRandDirection();
            
            if (ball_ready) {
                
                setBallState(1);
                
            }
            
        }
        
        if (ball_state === 1) {
            
            ball_pos_x += ball_di_x * ball_speed;
            ball_pos_y += ball_di_y * ball_speed;

            var col = checkCollision();

            if (col === 0 || col === 2) {
                setBallState(0);
            }

            if (col === 1 || col === 3) {
                ball_di_y = -ball_di_y;
            }
        
        }
        
    }
}

function render() {
    "use strict";
    
    if (mode === 1) {
        if (img_field_ready) {
            ctx.drawImage(img_field, 0, 0);
        }
        if (img_ball_ready) {
            ctx.drawImage(img_ball, ball_pos_x, ball_pos_y);
        }
    }
}

function loop() {
    "use strict";
    
    logic();
    render();
    window.setTimeout(loop, 50);
}

var ctx = init();

loadImages();
loop();