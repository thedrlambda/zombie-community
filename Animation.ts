class MyAnimation {
  private durationLeft: number;
  private dir: number;
  constructor(
    private sheet: SpriteSheet,
    private x: number,
    private y: number,
    private length: number,
    private duration: number,
    private looping: boolean,
    private backAndForth: boolean,
    private uninterruptible: boolean,
    private baseX: number
  ) {
    this.durationLeft = this.duration;
    this.dir = 1;
  }
  draw(g: Graphics, posX: number, posY: number) {
    this.sheet.draw(
      g,
      this.x +
        this.length -
        1 -
        ~~((this.durationLeft / this.duration) * this.length),
      this.y,
      posX - this.baseX,
      posY
    );
  }
  reset() {
    this.durationLeft = this.duration;
    this.dir = 1;
  }
  update(elapsed: number) {
    this.durationLeft -= this.dir * elapsed;
    if (this.durationLeft < 0) {
      if (this.backAndForth) {
        this.dir = -this.dir;
        this.durationLeft = this.duration / this.length;
      } else if (this.looping) {
        this.durationLeft += this.duration;
      }
    }
    if (this.durationLeft > this.duration) {
      if (this.backAndForth) {
        this.dir = -this.dir;
        this.durationLeft = ((this.length - 1) * this.duration) / this.length;
      }
    }
  }
  isUninterruptible() {
    return this.uninterruptible && this.durationLeft > 0;
  }
}

function walkAnimation(sheet: SpriteSheet, r: number, dir: number) {
  return new MyAnimation(
    sheet,
    3 * (r % 4),
    ~~(r / 4) * 4 + dir,
    3,
    700,
    true,
    true,
    false,
    0
  );
}

let names = ["Alma", "Darya", "Felicity", "Gwen", "Ina", "Margot", "Marsha"];
function attackAnimation(sheet: SpriteSheet) {
  return new MyAnimation(sheet, 0, 7, 5, 700, false, false, true, 20);
}
