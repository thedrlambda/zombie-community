"use strict";
var canvasElem = document.getElementById("canvas");
var canvasBounds = canvasElem.getBoundingClientRect();
var ctx = canvasElem.getContext("2d");
var g = new Graphics(ctx, canvasBounds);
var sprites1AImg = new Image();
sprites1AImg.src = "Assets/Sprites/HC_Humans1A.png";
var tileImage = new Image();
tileImage.src = "Assets/Tiles/TileA5_PHC_Exterior-General.png";
var attackImage = new Image();
attackImage.src = "Assets/Attack/3X Size/Felicity_PHC.png";
function draw() {
    g.translate(char.getX(), char.getY());
    g.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
    map.draw(g);
    characters.sort(function (a, b) { return a.getY() - b.getY(); });
    characters.forEach(function (c) {
        c.draw(g);
    });
}
function update(elapsed) {
    char.move(dirX, dirY);
    characters.forEach(function (c) {
        c.update(elapsed);
    });
}
var FPS = 60;
var SLEEP = 1000 / FPS;
var lastBefore = Date.now();
var before = Date.now();
function gameLoop() {
    lastBefore = before;
    before = Date.now();
    update(before - lastBefore);
    draw();
    var after = Date.now();
    var sleep = SLEEP - (after - before);
    if (sleep < 5)
        console.log("Stayed up all night!");
    setTimeout(function () { return gameLoop(); }, sleep);
}
var tileMap;
window.onload = function () {
    tileMap = new SpriteSheet(tileImage, 8, 16);
    map = new MyMap(20, 20);
    var sprites1A = new SpriteSheet(sprites1AImg, 12, 8);
    var attackSprites = new SpriteSheet(attackImage, 5, 18);
    char = new Character(characterAnimation(sprites1A, attackSprites, 1), 100, 100, 200, false);
    characters.push(char);
    characters.push(new Character(characterAnimation(sprites1A, attackSprites, 4), 200, 100, 100, true));
    var r;
    do {
        r = ~~(Math.random() * 8);
    } while (r === 1 || r === 4);
    console.log(r);
    characters.push(new Character(characterAnimation(sprites1A, attackSprites, r), 200, 300, 100, true));
    gameLoop();
};
var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var dirX = 0;
var dirY = 0;
window.addEventListener("keydown", function (e) {
    if (e.keyCode === LEFT_KEY || e.key === "a") {
        if (dirY !== 0)
            dirX = -0.5;
        else
            dirX = -1;
    }
    else if (e.keyCode === UP_KEY || e.key === "w") {
        if (dirX !== 0)
            dirY = -0.5;
        else
            dirY = -1;
    }
    else if (e.keyCode === RIGHT_KEY || e.key === "d") {
        if (dirY !== 0)
            dirX = 0.5;
        else
            dirX = 1;
    }
    else if (e.keyCode === DOWN_KEY || e.key === "s") {
        if (dirX !== 0)
            dirY = 0.5;
        else
            dirY = 1;
    }
    else if (e.key === " ") {
        char.attack();
    }
});
window.addEventListener("keyup", function (e) {
    if (e.keyCode === LEFT_KEY || e.key === "a") {
        dirX = 0;
        dirY *= 2;
    }
    else if (e.keyCode === UP_KEY || e.key === "w") {
        dirX *= 2;
        dirY = 0;
    }
    else if (e.keyCode === RIGHT_KEY || e.key === "d") {
        dirX = 0;
        dirY *= 2;
    }
    else if (e.keyCode === DOWN_KEY || e.key === "s") {
        dirX *= 2;
        dirY = 0;
    }
});
console.log("Loaded.");
