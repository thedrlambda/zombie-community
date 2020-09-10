"use strict";
var SpriteSheet = /** @class */ (function () {
    function SpriteSheet(img, width, height) {
        this.img = img;
        this.subimgWidth = img.width / width;
        this.subimgHeight = img.height / height;
    }
    SpriteSheet.prototype.getWidth = function () {
        return this.subimgWidth;
    };
    SpriteSheet.prototype.getHeight = function () {
        return this.subimgHeight;
    };
    SpriteSheet.prototype.draw = function (g, x, y, posX, posY) {
        g.drawImage(this.img, x * this.subimgWidth, y * this.subimgHeight, this.subimgWidth, this.subimgHeight, posX, posY, this.subimgWidth, this.subimgHeight);
    };
    return SpriteSheet;
}());
