var mode = 0;
var over_go = 0;

var ghosts = new Array(0);

var all_g = 0;
var counter = 0;
var score = 0;
var wave = 0;

var go_x = 100;
var go_y = 210;

var m_speed = 1;


function init() {
    "use strict";
    var main_can = document.getElementById("main_can");
    var main_ctx = main_can.getContext("2d");
    return main_ctx;
}


//ASSETS
var m_bgReady = false;
var m_bgImage = new Image();
m_bgImage.onload = function () {
    "use strict";
    m_bgReady = true;
};
m_bgImage.src = "assets/startscreen.png";

var go1Ready = false;
var go1Image = new Image();
go1Image.onload = function () {
    "use strict";
    go1Ready = true;
};
go1Image.src = "assets/go.png";

var go2Ready = false;
var go2Image = new Image();
go2Image.onload = function () {
    "use strict";
    go2Ready = true;
};

go2Image.src = "assets/go_pressed.png";

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    "use strict";
    bgReady = true;
};

bgImage.src = "assets/map.png";

var brettReady = false;
var brettImage = new Image();
brettImage.onload = function () {
    "use strict";
    brettReady = true;
};
brettImage.src = "assets/wood.png";

var enReady = false;
var enImage = new Image();
enImage.onload = function () {
    "use strict";
    enReady = true;
};
enImage.src = "assets/ghost.png";

var ghReady = false;
var ghImage = new Image();
ghImage.onload = function () {
    "use strict";
    ghReady = true;
};
ghImage.src = "assets/ghost_explode.png";

var ovReady = false;
var ovImage = new Image();
ovImage.onload = function () {
    "use strict";
    ovReady = true;
};
ovImage.src = "assets/gameover.png";

var audio = new Audio("assets/music.mp3");
audio.loop = true;



// GAME
function changeDirection(ghost) {
    "use strict";
    ghost[2] = Math.round(Math.random() * 3);
}

function autoChange() {
    "use strict";
    ghosts[Math.round(Math.random() * (ghosts.length - 1))][2] = Math.round(Math.random() * 3);
    window.setTimeout(autoChange, 800 / ghosts.length);
}

function moveGhosts() {
    "use strict";
    var i;
    for (i = 0; i < ghosts.length; i += 1) {

        if (ghosts[i][2] === 0) {
            if (ghosts[i][1] <= brettImage.height) {
                changeDirection(ghosts[i]);
            } else {
                ghosts[i][1] -= m_speed;
            }
        }

        if (ghosts[i][2] === 1) {
            if (ghosts[i][0] >= 600 - 70) {
                changeDirection(ghosts[i]);
            } else {
                ghosts[i][0] += m_speed;
            }
        }

        if (ghosts[i][2] === 2) {
            if (ghosts[i][1] >= 600 - 70) {
                changeDirection(ghosts[i]);
            } else {
                ghosts[i][1] += m_speed;
            }
        }

        if (ghosts[i][2] === 3) {
            if (ghosts[i][0] <= 0) {
                changeDirection(ghosts[i]);
            } else {
                ghosts[i][0] -= m_speed;
            }
        }
    }
}

function grick(event) {
    "use strict";
    var m_x = event.pageX - document.getElementById("game_obj").offsetLeft,
        m_y = event.pageY - document.getElementById("game_obj").offsetTop,
        i;

    if (mode === 0) {
        if (m_x >= go_x && m_x <= go_x + go1Image.width && m_y >= go_y && m_y <= go_y + go1Image.height) {
            mode = 1;
            ghosts.length = 0;
            addGhosts(1);
            counter = 1;
            autoChange();
            score = 600;
            wave = 1;
            over_go = 0;
            all_g = 0;
            m_speed = 1;
            audio.play();
        }
    }

    if (mode === 1) {
        for (i = 0; i < ghosts.length; i += 1) {
            if (m_x >= ghosts[i][0] && m_x <= ghosts[i][0] + 70 && m_y >= ghosts[i][1] && m_y <= ghosts[i][1] + 70) {
                ctx.drawImage(ghImage, ghosts[i][0] - 35, ghosts[i][1] - 35);
                ghosts.splice(i, 1);
                counter -= 1;
                score += 50;
                all_g += 1;
                return;
            }
        }
        score -= 300;
    }

    if (mode === 2) {
        if (m_x >= 300 - (go1Image.width / 2) && m_x <= 300 + (go1Image.width / 2) && m_y >= 500 - (go1Image.height / 2) && m_y <= 500 + (go1Image.height / 2)) {
            mode = 0;
        }
    }
}

function over(event) {
    "use strict";
    var m_x = event.pageX - document.getElementById("game_obj").offsetLeft;
    var m_y = event.pageY - document.getElementById("game_obj").offsetTop;

    if (mode === 0) {
        if (m_x >= go_x && m_x <= go_x + go1Image.width && m_y >= go_y && m_y <= go_y + go1Image.height) {

            over_go = 1;
        } else {
            over_go = 0;
        }
    }

    if (mode === 2) {
        if (m_x >= 300 - (go1Image.width / 2) && m_x <= 300 + (go1Image.width / 2) && m_y >= 500 - (go1Image.height / 2) && m_y <= 500 + (go1Image.height / 2)) {

            over_go = 1;
        } else {
            over_go = 0;
        }
    }
}

function addGhosts(number) {
    "use strict";
    var i;
    for (i = 0; i < number; i += 1) {
        var pos = new Array(2);
        pos[0] = Math.random() * (600 - enImage.width);
        pos[1] = brettImage.height + Math.random() * (600 - enImage.height - brettImage.height);
        pos[2] = Math.round(Math.random() * 3);
        ghosts.push(pos);
    }
}



function loop() {
    "use strict";
    logic();
    render();
    window.setTimeout(loop, 50);
}

function logic() {
    "use strict";
    if (mode === 1) {
        moveGhosts();
        if (ghosts.length === 0) {
            counter = Math.round(wave + 1);
            addGhosts(Math.round(wave + 1));
            wave += 1;
            m_speed += 1;
        }
        if (score < 0) {
            mode = 2;
        }
    }
}

function render() {
    "use strict";
    if (mode === 0) {
        if (m_bgReady) {
            ctx.drawImage(m_bgImage, 0, 0);
        }

        if (over_go === 1) {
            if (go2Ready) {
                ctx.drawImage(go2Image, go_x, go_y);
            }
        } else {
            if (go1Ready) {
                ctx.drawImage(go1Image, go_x, go_y);
            }
        }
    }
    if (mode === 1) {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        if (brettReady) {
            ctx.drawImage(brettImage, 0, 0);
        }

        if (enReady) {
            for (var i = 0; i < ghosts.length; i++) {
                ctx.drawImage(enImage, ghosts[i][0], ghosts[i][1]);
            }
        }

        ctx.fillStyle = "black";
        ctx.font = "40px impact";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Ghosts: " + counter, 25, 13);

        ctx.fillStyle = "black";
        ctx.font = "40px impact";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("Wave: " + wave, 270, 13);

        ctx.fillStyle = "black";
        ctx.font = "40px impact";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("Score: " + score, 550, 13);
    }

    if (mode === 2) {
        if (ovReady) {
            ctx.drawImage(ovImage, 0, 0);
        }

        if (over_go === 1) {
            if (go2Ready) {
                ctx.drawImage(go2Image, 300 - (go1Image.width / 2), 500 - (go1Image.height / 2));
            }
        } else {
            if (go1Ready) {
                ctx.drawImage(go1Image, 300 - (go1Image.width / 2), 500 - (go1Image.height / 2));
            }
        }

        ctx.fillStyle = "black";
        ctx.font = "30px impact";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("Ghosts eliminated: " + all_g, 580, 550);

        ctx.fillStyle = "black";
        ctx.font = "30px impact";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Waves: " + wave, 20, 550);
    }
}



var ctx = init();

//Global_Game_Loop
loop();
