"use strict";
var canvasElem = document.getElementById("canvas");
var canvasBounds = canvasElem.getBoundingClientRect();
var ctx = canvasElem.getContext("2d");
var sprites1AImg = new Image();
sprites1AImg.src = "Assets/Sprites/HC_Humans1A.png";
var SpriteSheet = /** @class */ (function () {
    function SpriteSheet(img, width, height) {
        this.img = img;
        this.subimgWidth = img.width / width;
        this.subimgHeight = img.height / height;
    }
    SpriteSheet.prototype.draw = function (g, x, y, posX, posY) {
        g.drawImage(this.img, x * this.subimgWidth, y * this.subimgHeight, this.subimgWidth, this.subimgHeight, posX, posY, this.subimgWidth, this.subimgHeight);
        /*
        g.putImageData(
          this.ctx.getImageData(
            x * this.subimgWidth,
            y * this.subimgHeight,
            this.subimgWidth,
            this.subimgHeight
          ),
          posX,
          posY
        );
        */
    };
    return SpriteSheet;
}());
var MyAnimation = /** @class */ (function () {
    function MyAnimation(sheet, x, y, length, duration, looping, backAndForth) {
        this.sheet = sheet;
        this.x = x;
        this.y = y;
        this.length = length;
        this.duration = duration;
        this.looping = looping;
        this.backAndForth = backAndForth;
        this.durationLeft = this.duration;
        this.dir = 1;
    }
    MyAnimation.prototype.draw = function (g, posX, posY) {
        this.sheet.draw(g, this.x + ~~((this.durationLeft / this.duration) * this.length), this.y, posX, posY);
    };
    MyAnimation.prototype.reset = function () {
        this.durationLeft = this.duration;
        this.dir = 1;
    };
    MyAnimation.prototype.update = function (elapsed) {
        this.durationLeft -= this.dir * elapsed;
        if (this.durationLeft < 0) {
            if (this.backAndForth) {
                this.dir = -this.dir;
                this.durationLeft = this.duration / this.length;
            }
            else if (this.looping) {
                this.durationLeft += this.duration;
            }
        }
        if (this.durationLeft > this.duration) {
            if (this.backAndForth) {
                this.dir = -this.dir;
                this.durationLeft = ((this.length - 1) * this.duration) / this.length;
            }
        }
    };
    return MyAnimation;
}());
function draw() {
    ctx.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
    characters.sort(function (a, b) { return a.getY() - b.getY(); });
    characters.forEach(function (c) {
        c.draw(ctx);
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
var Character = /** @class */ (function () {
    function Character(ani, posX, posY, speed, ai) {
        this.ani = ani;
        this.posX = posX;
        this.posY = posY;
        this.velX = 0;
        this.velY = 0;
        this.speed = speed / 1000;
        this.currentAnimation = ani.stand;
        if (ai)
            this.ai = new AI(this);
    }
    Character.prototype.draw = function (g) {
        this.currentAnimation.draw(g, Math.round(this.posX), Math.round(this.posY));
    };
    Character.prototype.update = function (elapsed) {
        var _a;
        this.posX += elapsed * this.velX;
        this.posY += elapsed * this.velY;
        var oldAni = this.currentAnimation;
        if (this.velY === this.velX) {
            this.currentAnimation = this.ani.stand;
        }
        else if (Math.abs(this.velY) > Math.abs(this.velX)) {
            if (this.velY > 0)
                this.currentAnimation = this.ani.walkDown;
            else
                this.currentAnimation = this.ani.walkUp;
        }
        else {
            if (this.velX > 0)
                this.currentAnimation = this.ani.walkRight;
            else
                this.currentAnimation = this.ani.walkLeft;
        }
        if (oldAni !== this.currentAnimation)
            this.currentAnimation.reset();
        this.currentAnimation.update(elapsed);
        (_a = this.ai) === null || _a === void 0 ? void 0 : _a.update();
    };
    Character.prototype.moveTowards = function (tX, tY) {
        this.move(tX - this.posX, tY - this.posY);
    };
    Character.prototype.move = function (dirX, dirY) {
        if (dirX === dirY) {
            this.velX = 0;
            this.velY = 0;
        }
        else {
            var length_1 = Math.hypot(dirX, dirY);
            var normX = dirX / length_1;
            var normY = dirY / length_1;
            this.velX = normX * this.speed;
            this.velY = normY * this.speed;
        }
    };
    Character.prototype.getX = function () {
        return this.posX;
    };
    Character.prototype.getY = function () {
        return this.posY;
    };
    return Character;
}());
var char;
var characters = [];
function walkAnimation(sheet, r, dir) {
    return new MyAnimation(sheet, 3 * (r % 4), ~~(r / 4) * 4 + dir, 3, 700, true, true);
}
function characterAnimation(sheet, r) {
    return {
        walkDown: walkAnimation(sheet, r, 0),
        walkLeft: walkAnimation(sheet, r, 1),
        walkRight: walkAnimation(sheet, r, 2),
        walkUp: walkAnimation(sheet, r, 3),
        stand: new MyAnimation(sheet, 3 * (r % 4) + 1, ~~(r / 4) * 4, 1, 1000, true, false),
    };
}
window.onload = function () {
    var sprites1A = new SpriteSheet(sprites1AImg, 12, 8);
    char = new Character(characterAnimation(sprites1A, 1), 100, 100, 100, false);
    characters.push(char);
    characters.push(new Character(characterAnimation(sprites1A, 4), 200, 100, 100, true));
    var r;
    do {
        r = ~~(Math.random() * 8);
    } while (r === 1 || r === 4);
    console.log(r);
    characters.push(new Character(characterAnimation(sprites1A, r), 200, 300, 100, true));
    gameLoop();
};
var EPSILON = 10;
var AI = /** @class */ (function () {
    function AI(char) {
        this.char = char;
        this.targetX = Math.random() * canvasBounds.width;
        this.targetY = Math.random() * canvasBounds.height;
    }
    AI.prototype.setTarget = function () {
        this.targetX = Math.random() * canvasBounds.width;
        this.targetY = Math.random() * canvasBounds.height;
    };
    AI.prototype.update = function () {
        var dist = Math.hypot(this.targetX - this.char.getX(), this.targetY - this.char.getY());
        if (dist < EPSILON) {
            this.setTarget();
        }
        this.char.moveTowards(this.targetX, this.targetY);
    };
    return AI;
}());
console.log("Loaded.");
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
