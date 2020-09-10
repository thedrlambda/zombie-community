"use strict";
var TILE_SIZE = 48;
var Grass = /** @class */ (function () {
    function Grass() {
    }
    Grass.prototype.draw = function (g, posX, posY) {
        tileMap.draw(g, 0, 11, posX, posY);
    };
    return Grass;
}());
