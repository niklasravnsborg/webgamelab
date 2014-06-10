/*global $, Audio, addEventListener*/
/*jslint white: true */

var	// Defining a lot of variables

	// General - Functions
	ctx = document.getElementById("canvas").getContext("2d"),
	mode = 0, // 0: game | 1: Endscreen
	menu_mode = 0,
	keysDown = {},
	time = 12000,


	// Ball - Variables
	ball_state = 0, // 0 - still  1 - in Spiel
	ball_pos_x = 310,
	ball_pos_y = 220,
	ball_speed = 1,
	ball_di_x = 0,
	ball_di_y = 0,
	img_ball_size = 20,
	img_ball_offset = 20,


	// Bats - Variables
	img_bat_size_x = 20,
	img_bat_size_y = 120,
	img_bat_offset = 25,
	bat_speed = 5,

	bat_l_pos_x = img_bat_offset,
	bat_l_pos_y = (480 / 2) - (img_bat_size_y / 2),

	bat_r_pos_x = 640 - img_bat_size_x - img_bat_offset,
	bat_r_pos_y = (480 / 2) - (img_bat_size_y / 2),


	// Player - Variables
	player_r_points = 0,
	player_l_points = 0,


	// Image - Variables    
	images_game = [],

	images_game_load = [
		"field_1.png",				// 0
		"ball_1.png",				// 1
		"bat_1.png",				// 2
		"game_over_1.png"			// 3
	],            


	// Sound - Variables
	sounds = [],
	sounds_load = [
		"pong_1.mp3",				// 0
		"click_1.mp3",				// 1
		"score_1.mp3",				// 2
		"start_1.mp3"				// 3
	];     



// Game Functions
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

function setBallState(val) {
	"use strict";
	
	if (val === 0) {
		ball_state = 0;
		setBallPosition((640 / 2) - (img_ball_size / 2), (480 / 2) - (img_ball_size / 2));
		setRandDirection();
		ball_speed = 2;
		sounds[2].play();
	}

	if (val === 1) {
		ball_state = 1;
	}

}

function checkCollision() {
	"use strict";
	
	// Walls
	if (ball_pos_x - img_ball_size >= 600) {
		return 0; // Wall right
	}

	if (ball_pos_y + img_ball_size + img_ball_offset >= 480) {
		return 1; // Wall bottom
	}

	if (ball_pos_x <= 0) {
		return 2; // Wall left
	}

	if (ball_pos_y - img_ball_offset <= 0) {
		return 3; // Wall top
	}

	
	// Bats
	if (ball_pos_x + img_ball_size >= bat_r_pos_x &&
		ball_pos_y >= bat_r_pos_y &&
		ball_pos_y <= bat_r_pos_y + img_bat_size_y) {
		return 4; // Bat right
	}
	
	if (ball_pos_x <= bat_l_pos_x + img_bat_size_x &&
		ball_pos_y >= bat_l_pos_y &&
		ball_pos_y <= bat_l_pos_y + img_bat_size_y) {
		return 5; // Bat left
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
	
	if (keysDown[38]) { // Key Up
		if (bat_r_pos_y >= bat_speed + img_bat_offset) {
			bat_r_pos_y -= bat_speed;
		}
	}
	if (keysDown[40]) { // Key Down
		if (bat_r_pos_y <= 480 - img_bat_size_y - bat_speed - img_bat_offset) {
			bat_r_pos_y += bat_speed;
		}
	}
	if (keysDown[87]) { // Key W
		if (bat_l_pos_y >= bat_speed + img_bat_offset) {
			bat_l_pos_y -= bat_speed;
		}
	}
	if (keysDown[83]) { // Key S
		if (bat_l_pos_y <= 480 - img_bat_size_y - bat_speed - img_bat_offset) {
			bat_l_pos_y += bat_speed;
		}
	}
}

// Engine Functions
function mouse_move(event) {
	"use strict";
	
	var x = event.pageX - document.getElementById("canvas").offsetLeft,
		y = event.pageY - document.getElementById("canvas").offsetTop;
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
	
	var i, img;

	for (i = 0; i < images_game_load.length; i += 1) {
		img = new Image();
		img.src = "images/" + images_game_load[i];
		images_game.push(img);
	}
}

function loadSounds() {
	"use strict";
	
	var i, sound;
	
	for (i = 0; i < sounds_load.length; i += 1) {
		sound = new Audio("sounds/" + sounds_load[i]);
		sounds.push(sound);
	}
}

function logic() {
	"use strict";
	
	if (mode === 0) {
		time -= 1;
		moveBats();

		if (keysDown[13]) { // Enter
			setBallState(1);
			sounds[3].play();
		}

		if (ball_state === 1) {
			moveBall();
		}

		if (time <= 0) {
			mode = 1;
		}
	}
}

function render() {
	"use strict";
	
	if (mode === 0) { // Game
		ctx.drawImage(images_game[0], 0, 0);

		addText(player_l_points, 150, 30, "#e5f1c9", "100px impact", "right", "top");
		addText(player_r_points, 640 - 150, 30, "#e5f1c9", "100px impact", "left", "top");

/*		if (time > 500) {
			addText(Math.round(time / 100), 150, 445, "#e5f1c9", "40px impact", "left", "bottom");
		} else {
			addText(Math.round(time / 100), 150, 455, "#e5f1c9", "60px impact", "left", "bottom");
		}*/
		
		document.getElementById("time").innerHTML = Math.round(time / 100);

		ctx.drawImage(images_game[1], ball_pos_x, ball_pos_y);

		ctx.drawImage(images_game[2], bat_l_pos_x, bat_l_pos_y);
		ctx.drawImage(images_game[2], bat_r_pos_x, bat_r_pos_y);		
	}

	if (mode === 1) { // Endsrceen
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

$("#back").click(function () {
    "use strict";
	window.location = "../index.html";
});

$("#restart").click(function () {
    "use strict";
    
    mode = 0;
    
    setBallState(0); //Reset Ball
    
    //Reset Ponts
    player_l_points = 0;
    player_r_points = 0;
    
    time = 1000; //Restart Time
});

loadImages();
loadSounds();
eventListener();
setBallState(0);
loop();