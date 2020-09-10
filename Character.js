"use strict";
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
        if (this.currentAnimation.isUninterruptible()) {
        }
        else if (this.velY === this.velX) {
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
    Character.prototype.attack = function () {
        this.currentAnimation = this.ani.attack;
        this.currentAnimation.reset();
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
function characterAnimation(sheet, attack, r) {
    return {
        walkDown: walkAnimation(sheet, r, 0),
        walkLeft: walkAnimation(sheet, r, 1),
        walkRight: walkAnimation(sheet, r, 2),
        walkUp: walkAnimation(sheet, r, 3),
        stand: new MyAnimation(sheet, 3 * (r % 4) + 1, ~~(r / 4) * 4, 1, 1000, true, false, false, 0),
        attack: attackAnimation(attack),
    };
}
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
