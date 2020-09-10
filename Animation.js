"use strict";
var MyAnimation = /** @class */ (function () {
    function MyAnimation(sheet, x, y, length, duration, looping, backAndForth, uninterruptible, baseX) {
        this.sheet = sheet;
        this.x = x;
        this.y = y;
        this.length = length;
        this.duration = duration;
        this.looping = looping;
        this.backAndForth = backAndForth;
        this.uninterruptible = uninterruptible;
        this.baseX = baseX;
        this.durationLeft = this.duration;
        this.dir = 1;
    }
    MyAnimation.prototype.draw = function (g, posX, posY) {
        this.sheet.draw(g, this.x +
            this.length -
            1 -
            ~~((this.durationLeft / this.duration) * this.length), this.y, posX - this.baseX, posY);
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
    MyAnimation.prototype.isUninterruptible = function () {
        return this.uninterruptible && this.durationLeft > 0;
    };
    return MyAnimation;
}());
function walkAnimation(sheet, r, dir) {
    return new MyAnimation(sheet, 3 * (r % 4), ~~(r / 4) * 4 + dir, 3, 700, true, true, false, 0);
}
var names = ["Alma", "Darya", "Felicity", "Gwen", "Ina", "Margot", "Marsha"];
function attackAnimation(sheet) {
    return new MyAnimation(sheet, 0, 7, 5, 700, false, false, true, 20);
}
