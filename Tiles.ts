const TILE_SIZE = 48;

interface Tile {
  draw(g: Graphics, posX: number, posY: number): void;
}
class Grass implements Tile {
  draw(g: Graphics, posX: number, posY: number) {
    tileMap.draw(g, 0, 11, posX, posY);
  }
}
