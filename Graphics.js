"use strict";
var Graphics = /** @class */ (function () {
    function Graphics(g, bounds) {
        this.g = g;
        this.bounds = bounds;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    Graphics.prototype.drawImage = function (img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var ax = dx - this.offsetX + this.bounds.width / 2 - dw / 2;
        var ay = dy - this.offsetY + this.bounds.height / 2 - dh;
        if (ax + dw < 0 ||
            ax - dw / 2 > this.bounds.width ||
            ay + dh < 0 ||
            ay >= this.bounds.height)
            return;
        this.g.drawImage(img, sx, sy, sw, sh, Math.round(ax), Math.round(ay), dw, dh);
    };
    Graphics.prototype.clearRect = function (x, y, w, h) {
        this.g.clearRect(x, y, w, h);
    };
    Graphics.prototype.translate = function (x, y) {
        this.offsetX = x;
        this.offsetY = y;
    };
    return Graphics;
}());
