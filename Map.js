"use strict";
var MyMap = /** @class */ (function () {
    function MyMap(width, height) {
        this.tiles = [];
        for (var y = 0; y < height; y++) {
            this.tiles.push([]);
            for (var x = 0; x < width; x++) {
                this.tiles[y].push(new Grass());
            }
        }
    }
    MyMap.prototype.draw = function (g) {
        for (var y = 0; y < this.tiles.length; y++) {
            for (var x = 0; x < this.tiles[y].length; x++) {
                this.tiles[y][x].draw(g, x * TILE_SIZE, y * TILE_SIZE);
            }
        }
    };
    return MyMap;
}());
var map;
