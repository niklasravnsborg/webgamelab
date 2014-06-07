var ctx = document.getElementById("canvas").getContext("2d");

var mode = 0;       // 0 - Menü   1 - Spiel  2 - Game Over

var keysDown = {};

// Ball - Variables

var ball_state = 0, // 0 - still  1 - in Spiel
    ball_ready = 0;

var ball_pos_x = 310,
    ball_pos_y = 220,
    ball_speed = 4;

var ball_di_x = 0,
    ball_di_y = 0;

var img_ball_size = 20,
    img_ball_offset = 20;

// Bats - Variables
var img_bat_size_x = 20,
    img_bat_size_y = 120,
    img_bat_offset = 25,
    bat_speed = 5;

var bat_l_pos_x = img_bat_offset,
    bat_l_pos_y = (480 / 2) - (img_bat_size_y / 2);

var bat_r_pos_x = 640 - img_bat_size_x - img_bat_offset,
    bat_r_pos_y = (480 / 2) - (img_bat_size_y / 2);

// Player - Variables

var player_r_points = 0,
    player_l_points = 0;

// Image - Variables

var img_ball, img_ball_ready,
    img_bat, img_bat_ready,
    img_field, img_field_ready,
    
    img_b_credits_1, img_b_credits_1_ready,
    img_b_credits_2, img_b_credits_2_ready,
    img_b_opt_1, img_b_opt_1_ready,
    img_b_opt_2, img_b_opt_2_ready,
    img_b_play_1, img_b_play_1_ready,
    img_b_play_2, img_b_play_2_ready,
    img_b_quit_1, img_b_quit_1_ready,
    img_b_quit_2, img_b_quit_2_ready,
    img_menue, img_menue_ready;

var over_play = 0,
    over_credits = 0,
    over_options = 0,
    over_quit = 0;


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
    
    var rand_1 = Math.random() * 2 - 1,
        rand_2 = Math.random() * 2 - 1;
    
    ball_di_x = rand_1 / Math.sqrt(Math.pow(rand_1, 2) + Math.pow(rand_2, 2));
    ball_di_y = rand_2 / Math.sqrt(Math.pow(rand_1, 2) + Math.pow(rand_2, 2));
    
}

function checkCollision() {
    "use strict";
    
    // Walls
    
    if (ball_pos_x - img_ball_size >= 600) {                
        return 0;       // Wall right
    }
    
    if (ball_pos_y + img_ball_size + img_ball_offset>= 480) {
        return 1;       // Wall bottom
    }
    
    if (ball_pos_x <= 0) {
        return 2;       // Wall left
    }
    
    if (ball_pos_y - img_ball_offset <= 0) {
        return 3;       // Wall top
    }
    
    // Bats
    
    if (ball_pos_x + img_ball_size >= bat_r_pos_x &&            
        ball_pos_y >= bat_r_pos_y &&
        ball_pos_y <= bat_r_pos_y + img_bat_size_y) {
        return 4;       // Bat right
    }
    if (ball_pos_x <= bat_l_pos_x + img_bat_size_x &&
        ball_pos_y >= bat_l_pos_y &&
        ball_pos_y <= bat_l_pos_y + img_bat_size_y) {
        return 5;       // Bat left
    } 
}

function moveBall() {
    "use strict";
    
    ball_pos_x += ball_di_x * ball_speed;
    ball_pos_y += ball_di_y * ball_speed;


    var col = checkCollision();

    if (col === 0 || col === 2) {
        setBallState(0);
        ball_ready = 0;
        setBallPosition((640 / 2) - (img_ball_size / 2), (480 / 2) - (img_ball_size / 2));
        setRandDirection();
        if (col === 0) {
            player_l_points += 1;    
        } else {
            player_r_points += 1;   
        }
    }

    if (col === 1 || col === 3) {
        ball_di_y = -ball_di_y;
    }
    
    if (col === 4 || col === 5) {
        ball_di_x = -ball_di_x;   
    }
}


function moveBats() {
    "use strict";
    
    if (keysDown[38]) {                  // Hoch
        if (bat_r_pos_y >= bat_speed + img_bat_offset) {
            bat_r_pos_y -= bat_speed;
        }
    }
    if (keysDown[40]) {                  // Runter
        if (bat_r_pos_y <= 480 - img_bat_size_y - bat_speed - img_bat_offset) {
            bat_r_pos_y += bat_speed;
        } 
    }
    if (keysDown[87]) {                  // W
        if (bat_l_pos_y >= bat_speed + img_bat_offset) {
            bat_l_pos_y -= bat_speed;
        }
    }
    if (keysDown[83]) {                  // S
        if (bat_l_pos_y <= 480 - img_bat_size_y - bat_speed - img_bat_offset) {
            bat_l_pos_y += bat_speed;
        } 
    }
}



function mouse_move(event) {
    var x = event.pageX - document.getElementById("canvas").offsetLeft,
        y = event.pageY - document.getElementById("canvas").offsetLeft;    
    
    if (x >= 40 &&
        x <= 40 + img_b_play_1.width &&
        y >= 120 &&
        y <= 120 + img_b_play_1.height) {
        over_play = 1;
    } else {
        over_play = 0;
    }
    
    if (x >= 40 &&
        x <= 40 + img_b_play_1.width &&
        y >= 195 &&
        y <= 195 + img_b_play_1.height) {
        over_options = 1;
    } else {
        over_options = 0;
    }
    
    if (x >= 40 &&
        x <= 40 + img_b_play_1.width &&
        y >= 270 &&
        y <= 270 + img_b_play_1.height) {
        over_credits = 1;
    } else {
        over_credits = 0;
    }
    
    if (x >= 40 &&
        x <= 40 + img_b_play_1.width &&
        y >= 345 &&
        y <= 345 + img_b_play_1.height) {
        over_quit = 1;
    } else {
        over_quit = 0;
    }
}

function addText(text, x, y, color, font, align, base) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.fillText(text, x, y);
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

function loadImages() {
    "use strict";
    
    //Menue
    
    img_b_play_1_ready = false;
    img_b_play_1 = new Image();
    img_b_play_1.onload = function () {
        img_b_play_1_ready = true;
    };
    img_b_play_1.src = "images/button_play_1.png";
    
    img_menue_ready = false;
    img_menue = new Image();
    img_menue.onload = function () {
        img_menue_ready = true;
    };
    img_menue.src = "images/menue.png";
    
    img_b_play_2_ready = false;
    img_b_play_2 = new Image();
    img_b_play_2.onload = function () {
        img_b_play_2_ready = true;
    };
    img_b_play_2.src = "images/button_play_2.png";
    
    img_b_opt_1_ready = false;
    img_b_opt_1 = new Image();
    img_b_opt_1.onload = function () {
        img_b_opt_1_ready = true;
    };
    img_b_opt_1.src = "images/button_options_1.png";
    
    img_b_opt_2_ready = false;
    img_b_opt_2 = new Image();
    img_b_opt_2.onload = function () {
        img_b_opt_2_ready = true;
    };
    img_b_opt_2.src = "images/button_options_2.png";
    
    img_b_credits_1_ready = false;
    img_b_credits_1 = new Image();
    img_b_credits_1.onload = function () {
        img_b_credits_1_ready = true;
    };
    img_b_credits_1.src = "images/button_credits_1.png";
    
    img_b_credits_2_ready = false;
    img_b_credits_2 = new Image();
    img_b_credits_2.onload = function () {
        img_b_credits_2_ready = true;
    };
    img_b_credits_2.src = "images/button_credits_2.png";
    
    img_b_quit_1_ready = false;
    img_b_quit_1 = new Image();
    img_b_quit_1.onload = function () {
        img_b_quit_1_ready = true;
    };
    img_b_quit_1.src = "images/button_quit_1.png";
    
    img_b_quit_2_ready = false;
    img_b_quit_2 = new Image();
    img_b_quit_2.onload = function () {
        img_b_quit_2_ready = true;
    };
    img_b_quit_2.src = "images/button_quit_2.png";
    
    //Game
    
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
        
        if (keysDown[13]) {                 // Enter
            ball_ready = 1;
        }

        moveBats();
        
        if (ball_state === 0) {
                   
            if (ball_ready) {
                setBallState(1);
            }
            
        }
        
        if (ball_state === 1) {
            
            moveBall(); 
        
        }
        
    }
}

function render() {
    "use strict";
    
    if (mode === 0) {
        if (img_menue_ready) {
            ctx.drawImage(img_menue, 0, 0);
        } 
        
        if (img_b_play_1_ready && img_b_play_2_ready) {
            if (over_play) {
                ctx.drawImage(img_b_play_1, 40, 120);
            } else {
                ctx.drawImage(img_b_play_2, 40, 120);
            }
        }
        
        if (img_b_opt_1_ready && img_b_opt_2_ready) {
            if (over_options) {
                ctx.drawImage(img_b_opt_1, 40, 195);
            } else {
                ctx.drawImage(img_b_opt_2, 40, 195);
            }
        }
        
        if (img_b_credits_1_ready && img_b_credits_2_ready) {
            if (over_credits) {
                ctx.drawImage(img_b_credits_1, 40, 270);
            } else {
                ctx.drawImage(img_b_credits_2, 40, 270);
            }
        }
        
        if (img_b_quit_1_ready && img_b_quit_2_ready) {
            if (over_quit) {
                ctx.drawImage(img_b_quit_1, 40, 345);
            } else {
                ctx.drawImage(img_b_quit_2, 40, 345);
            }
        }
    }
    
    if (mode === 1) {
        if (img_field_ready) {
            ctx.drawImage(img_field, 0, 0);
        }
        
        addText(player_l_points, 150, 30, "#e5f1c9", "100px impact", "right", "top");
        addText(player_r_points, 640 - 150, 30, "#e5f1c9", "100px impact", "left", "top");
                
        if (img_ball_ready) {
            ctx.drawImage(img_ball, ball_pos_x, ball_pos_y);
        }
        if (img_bat_ready) {
            ctx.drawImage(img_bat, bat_l_pos_x, bat_l_pos_y);
            ctx.drawImage(img_bat, bat_r_pos_x, bat_r_pos_y);
        }
        
    }
}

function loop() {
    "use strict";
    
    logic();
    render();
    window.setTimeout(loop, 10);
}

loadImages();
eventListener();
setRandDirection();
loop();