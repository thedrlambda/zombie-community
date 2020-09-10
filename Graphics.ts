class Graphics {
  private offsetX = 0;
  private offsetY = 0;
  constructor(private g: CanvasRenderingContext2D, private bounds: DOMRect) {}
  drawImage(
    img: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) {
    let ax = dx - this.offsetX + this.bounds.width / 2 - dw / 2;
    let ay = dy - this.offsetY + this.bounds.height / 2 - dh;
    if (
      ax + dw < 0 ||
      ax - dw / 2 > this.bounds.width ||
      ay + dh < 0 ||
      ay >= this.bounds.height
    )
      return;
    this.g.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      Math.round(ax),
      Math.round(ay),
      dw,
      dh
    );
  }
  clearRect(x: number, y: number, w: number, h: number) {
    this.g.clearRect(x, y, w, h);
  }
  translate(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }
}
