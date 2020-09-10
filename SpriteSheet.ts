class SpriteSheet {
  private subimgWidth: number;
  private subimgHeight: number;
  constructor(private img: HTMLImageElement, width: number, height: number) {
    this.subimgWidth = img.width / width;
    this.subimgHeight = img.height / height;
  }
  getWidth() {
    return this.subimgWidth;
  }
  getHeight() {
    return this.subimgHeight;
  }
  draw(g: Graphics, x: number, y: number, posX: number, posY: number) {
    g.drawImage(
      this.img,
      x * this.subimgWidth,
      y * this.subimgHeight,
      this.subimgWidth,
      this.subimgHeight,
      posX,
      posY,
      this.subimgWidth,
      this.subimgHeight
    );
  }
}
