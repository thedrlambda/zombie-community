class MyMap {
  private tiles: Tile[][];
  constructor(width: number, height: number) {
    this.tiles = [];
    for (let y = 0; y < height; y++) {
      this.tiles.push([]);
      for (let x = 0; x < width; x++) {
        this.tiles[y].push(new Grass());
      }
    }
  }
  draw(g: Graphics) {
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        this.tiles[y][x].draw(g, x * TILE_SIZE, y * TILE_SIZE);
      }
    }
  }
}

let map: MyMap;
