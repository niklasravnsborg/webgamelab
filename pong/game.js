var ctx = document.getElementById("canvas").getContext("2d");

var mode = 2;       // 0 - Menü   1 - Spiel  2 - Game Over
var menue_mode = 0; 

var keysDown = {};

// Ball - Variables

var ball_state = 0, // 0 - still  1 - in Spiel
    ball_ready = 0; // 0 - still  1

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

    
var images_menue = [],
    images_game = [];

var images_menue_load = [ "menue.png",              // 0
                          "button_play_1.png",      // 1
                          "button_play_2.png",      // 2
                          "button_options_1.png",   // 3
                          "button_options_2.png",   // 4
                          "button_credits_1.png",   // 5
                          "button_credits_2.png",   // 6
                          "button_quit_1.png",      // 7
                          "button_quit_2.png",      // 8
                          "button_back_1.png",      // 9
                          "button_back_2.png",      // 10
                          "button_restart_1.png",   // 11
                          "button_restart_2.png" ], // 12

    images_game_load = [ "field_1.png",             // 0
                         "ball_1.png",              // 1
                         "bat_1.png",               // 2
                         "game_over_1.png" ];       // 3

var sounds = [];

var sounds_load = [ "pong_1.mp3",   // 0
                    "click_1.mp3",  // 1
                    "score_1.mp3",  // 2
                    "start_1.mp3" ];// 3

var button_pos = [ [40, 120],      //play
                   [40, 195],      //options
                   [40, 270],      //credits
                   [40, 345],      //quit
                   [25, 400],      //back
                   [75, 400] ];    //restart



var over_play = 0,
    over_credits = 0,
    over_options = 0,
    over_quit = 0,
    over_back = 0,
    over_restart = 0;


function setBallState(val) {
    "use strict";
    
    if (val === 0) {
        ball_state = 0;
        ball_ready = 0;
        setBallPosition((640 / 2) - (img_ball_size / 2), (480 / 2) - (img_ball_size / 2));
        setRandDirection();
        ball_speed = 1;
        sounds[2].play();
    }
    
    if (val === 1) {
        ball_state = 1;   
    }

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
    
    if (ball_pos_y + img_ball_size + img_ball_offset >= 480) {
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
        if (col === 0) {
            player_l_points += 1;
        } else {
            player_r_points += 1;
        }
    }

    if (col === 1 || col === 3) {
        ball_di_y = -ball_di_y;
        sounds[0].play();
    }
    
    if (col === 4 || col === 5) {
        ball_di_x = -ball_di_x;
        ball_speed += 0.35;
        sounds[0].play();
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
    "use strict";
    
    var x = event.pageX - document.getElementById("canvas").offsetLeft,
        y = event.pageY - document.getElementById("canvas").offsetLeft;
    
    if (mode === 0) {
    
        if (overButton("play", x, y)) {
            over_play = 1;
        } else {
            over_play = 0;
        }

        if (overButton("options", x, y)) {
            over_options = 1;
        } else {
            over_options = 0;
        }

        if (overButton("credits", x, y)) {
            over_credits = 1;
        } else {
            over_credits = 0;
        }

        if (overButton("quit", x, y)) {
            over_quit = 1;
        } else {
            over_quit = 0;
        }
    
    }
    
    if (mode === 1) {
        
        if (overButton("back", x, y)) {
            over_back = 1;
        } else {
            over_back = 0;
        }
        
        if (overButton("restart", x, y)) {
            over_restart = 1;
        } else {
            over_restart = 0;
        }
        
    }
}

function mouse_click(event) {
    "use strict";
    
    var x = event.pageX - document.getElementById("canvas").offsetLeft,
        y = event.pageY - document.getElementById("canvas").offsetLeft;
    
    if (mode === 0) {
        if (overButton("play", x, y)) {
            mode = 1;
            setBallState(0);
            sounds[1].play();
        }
        if (overButton("options", x, y)) {
            menue_mode = 1;
            sounds[1].play();
        }

        if (overButton("credits", x, y)) {
            menue_mode = 2;
            sounds[1].play();
        }

        if (overButton("quit", x, y)) {
            sounds[1].play();
            window.location = "../index.html";
        }
    }
    
    if (mode === 1) {
        if (overButton("back", x, y)) {
            mode = 0;
        }
        if (overButton("restart", x, y)) {
            setBallState(0);
            player_l_points = 0;
            player_r_points = 0;
        }
    }
}

function overButton(button, x, y) {
    "use strict";
    
    if (button === "play") {
        if (x >= button_pos[0][0] &&
            x <= button_pos[0][0] + images_menue[1].width &&
            y >= button_pos[0][1] &&
            y <= button_pos[0][1] + images_menue[1].height) {
            return 1;
        } else {
            return 0;
        }
    }
    
    if (button === "options") {
        if (x >= button_pos[1][0] &&
            x <= button_pos[1][0] + images_menue[1].width &&
            y >= button_pos[1][1] &&
            y <= button_pos[1][1] + images_menue[1].height) {
            return 1;
        } else {
            return 0;
        }
    }
    
    if (button === "credits") {
        if (x >= button_pos[2][0] &&
            x <= button_pos[2][0] + images_menue[1].width &&
            y >= button_pos[2][1] &&
            y <= button_pos[2][1] + images_menue[1].height) {
            return 1;   
        } else {
            return 0;
        }
    }
    
    if (button === "quit") {
        if (x >= button_pos[3][0] &&
            x <= button_pos[3][0] + images_menue[1].width &&
            y >= button_pos[3][1] &&
            y <= button_pos[3][1] + images_menue[1].height) {
            return 1;
        } else {
            return 0;
        }
    }
    
    if (button === "back") {
        if (x >= button_pos[4][0] &&
            x <= button_pos[4][0] + images_menue[9].width &&
            y >= button_pos[4][1] &&
            y <= button_pos[4][1] + images_menue[9].height) {
            return 1;
        } else {
            return 0;
        }
    }
    
    if (button === "restart") {
        if (x >= button_pos[5][0] &&
            x <= button_pos[5][0] + images_menue[9].width &&
            y >= button_pos[5][1] &&
            y <= button_pos[5][1] + images_menue[9].height) {
            return 1;
        } else {
            return 0;
        }
    }
}

function addText(text, x, y, color, font, align, base) {
    "use strict";
    
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
                        
    var i;
    for (i = 0; i < images_menue_load.length; i++) {
        var img = new Image();
        img.src = "images/" + images_menue_load[i];
        images_menue.push(img);
    }
    
    for (i = 0; i < images_game_load.length; i++) {
        img = new Image();
        img.src = "images/" + images_game_load[i];
        images_game.push(img);
    }
   
}

function loadSounds() {
    var i;
    for (i = 0; i < sounds_load.length; i++) {
        var sound = new Audio("sounds/" + sounds_load[i]);
        sounds.push(sound);
    }
}

function logic() {
    "use strict";
       
    
    if (mode === 1) {
        
        if (keysDown[13]) {                 // Enter
            setBallState(1);
            sounds[3].play();
        }

        moveBats();
        
        if (ball_state === 1) {
            
            moveBall();
        
        }
        
    }
}

function render() {
    "use strict";
    
    
    if (mode === 0) {
        
        ctx.drawImage(images_menue[0], 0, 0);

        if (over_play) {
            ctx.drawImage(images_menue[1], button_pos[0][0], button_pos[0][1]);
        } else {
            ctx.drawImage(images_menue[2], 40, 120);
        }

        if (over_options) {
            ctx.drawImage(images_menue[3], button_pos[1][0], button_pos[1][1]);
        } else {
            ctx.drawImage(images_menue[4], 40, 195);
        }

        if (over_credits) {
            ctx.drawImage(images_menue[5], button_pos[2][0], button_pos[2][1]);
        } else {
            ctx.drawImage(images_menue[6], 40, 270);
        }

        if (over_quit) {
            ctx.drawImage(images_menue[7], button_pos[3][0], button_pos[3][1]);
        } else {
            ctx.drawImage(images_menue[8], 40, 345);
        }

    }
    
    if (mode === 1) {

        ctx.drawImage(images_game[0], 0, 0);
        
        addText(player_l_points, 150, 30, "#e5f1c9", "100px impact", "right", "top");
        addText(player_r_points, 640 - 150, 30, "#e5f1c9", "100px impact", "left", "top");
                
        ctx.drawImage(images_game[1], ball_pos_x, ball_pos_y);

        ctx.drawImage(images_game[2], bat_l_pos_x, bat_l_pos_y);
        ctx.drawImage(images_game[2], bat_r_pos_x, bat_r_pos_y);
        
        if (over_back) {
            ctx.drawImage(images_menue[9], button_pos[4][0], button_pos[4][1]);
        } else {
            ctx.drawImage(images_menue[10], button_pos[4][0], button_pos[4][1]);
        }
        
        if (over_restart) {
            ctx.drawImage(images_menue[11], button_pos[5][0], button_pos[5][1]);
        } else {
            ctx.drawImage(images_menue[12], button_pos[5][0], button_pos[5][1]);
        }
              
    }
    
    if (mode === 2) {
        
        ctx.drawImage(images_game[3], 0, 0);
        
        if (player_l_points > player_r_points) {
            
            addText("Left player won!", 320, 30, "white", "80px impact", "center", "top");
        
        } 
        
        if (player_l_points < player_r_points) {
            
            addText("Right player won!", 320, 30, "white", "80px impact", "center", "top");
            
        }
        
        if (player_l_points === player_r_points) {
            
            addText("Draw!", 320, 30, "white", "80px impact", "center", "top");   
            
        }
        
        addText(player_l_points + " : " + player_r_points, 320, 180, "white", "80px impact", "center", "top");
    }
}

function loop() {
    "use strict";
    
    logic();
    render();
    window.setTimeout(loop, 10);
}

loadImages();
loadSounds();
eventListener();
setBallState(0);
loop();