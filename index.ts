let canvasElem = document.getElementById("canvas") as HTMLCanvasElement;
let canvasBounds = canvasElem.getBoundingClientRect();
let ctx = canvasElem.getContext("2d")!;

let sprites1AImg = new Image();
sprites1AImg.src = "Assets/Sprites/HC_Humans1A.png";

class SpriteSheet {
  private subimgWidth: number;
  private subimgHeight: number;
  constructor(private img: HTMLImageElement, width: number, height: number) {
    this.subimgWidth = img.width / width;
    this.subimgHeight = img.height / height;
  }
  draw(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    posX: number,
    posY: number
  ) {
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
    /*
    g.putImageData(
      this.ctx.getImageData(
        x * this.subimgWidth,
        y * this.subimgHeight,
        this.subimgWidth,
        this.subimgHeight
      ),
      posX,
      posY
    );
    */
  }
}

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
    private backAndForth: boolean
  ) {
    this.durationLeft = this.duration;
    this.dir = 1;
  }
  draw(g: CanvasRenderingContext2D, posX: number, posY: number) {
    this.sheet.draw(
      g,
      this.x + ~~((this.durationLeft / this.duration) * this.length),
      this.y,
      posX,
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
}

function draw() {
  ctx.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
  characters.sort((a, b) => a.getY() - b.getY());
  characters.forEach((c) => {
    c.draw(ctx);
  });
}
function update(elapsed: number) {
  char.move(dirX, dirY);
  characters.forEach((c) => {
    c.update(elapsed);
  });
}

const FPS = 60;
const SLEEP = 1000 / FPS;

let lastBefore = Date.now();
let before = Date.now();
function gameLoop() {
  lastBefore = before;
  before = Date.now();
  update(before - lastBefore);
  draw();
  let after = Date.now();
  let sleep = SLEEP - (after - before);
  if (sleep < 5) console.log("Stayed up all night!");
  setTimeout(() => gameLoop(), sleep);
}

interface CharacterAnimation {
  walkDown: MyAnimation;
  walkLeft: MyAnimation;
  walkRight: MyAnimation;
  walkUp: MyAnimation;
  stand: MyAnimation;
}

class Character {
  private currentAnimation: MyAnimation;
  private velX: number = 0;
  private velY: number = 0;
  private speed: number;
  private ai?: AI;
  constructor(
    private ani: CharacterAnimation,
    private posX: number,
    private posY: number,
    speed: number,
    ai: boolean
  ) {
    this.speed = speed / 1000;
    this.currentAnimation = ani.stand;
    if (ai) this.ai = new AI(this);
  }
  draw(g: CanvasRenderingContext2D) {
    this.currentAnimation.draw(g, Math.round(this.posX), Math.round(this.posY));
  }
  update(elapsed: number) {
    this.posX += elapsed * this.velX;
    this.posY += elapsed * this.velY;
    let oldAni = this.currentAnimation;
    if (this.velY === this.velX) {
      this.currentAnimation = this.ani.stand;
    } else if (Math.abs(this.velY) > Math.abs(this.velX)) {
      if (this.velY > 0) this.currentAnimation = this.ani.walkDown;
      else this.currentAnimation = this.ani.walkUp;
    } else {
      if (this.velX > 0) this.currentAnimation = this.ani.walkRight;
      else this.currentAnimation = this.ani.walkLeft;
    }
    if (oldAni !== this.currentAnimation) this.currentAnimation.reset();
    this.currentAnimation.update(elapsed);
    this.ai?.update();
  }
  moveTowards(tX: number, tY: number) {
    this.move(tX - this.posX, tY - this.posY);
  }
  move(dirX: number, dirY: number) {
    if (dirX === dirY) {
      this.velX = 0;
      this.velY = 0;
    } else {
      let length = Math.hypot(dirX, dirY);
      let normX = dirX / length;
      let normY = dirY / length;
      this.velX = normX * this.speed;
      this.velY = normY * this.speed;
    }
  }
  getX() {
    return this.posX;
  }
  getY() {
    return this.posY;
  }
}

let char: Character;
let characters: Character[] = [];

function walkAnimation(sheet: SpriteSheet, r: number, dir: number) {
  return new MyAnimation(
    sheet,
    3 * (r % 4),
    ~~(r / 4) * 4 + dir,
    3,
    700,
    true,
    true
  );
}

function characterAnimation(sheet: SpriteSheet, r: number) {
  return {
    walkDown: walkAnimation(sheet, r, 0),
    walkLeft: walkAnimation(sheet, r, 1),
    walkRight: walkAnimation(sheet, r, 2),
    walkUp: walkAnimation(sheet, r, 3),
    stand: new MyAnimation(
      sheet,
      3 * (r % 4) + 1,
      ~~(r / 4) * 4,
      1,
      1000,
      true,
      false
    ),
  };
}

window.onload = () => {
  let sprites1A = new SpriteSheet(sprites1AImg, 12, 8);
  char = new Character(characterAnimation(sprites1A, 1), 100, 100, 100, false);
  characters.push(char);
  characters.push(
    new Character(characterAnimation(sprites1A, 4), 200, 100, 100, true)
  );
  let r;
  do {
    r = ~~(Math.random() * 8);
  } while (r === 1 || r === 4);
  console.log(r);
  characters.push(
    new Character(characterAnimation(sprites1A, r), 200, 300, 100, true)
  );
  gameLoop();
};

const EPSILON = 10;
class AI {
  private targetX: number;
  private targetY: number;
  constructor(private char: Character) {
    this.targetX = Math.random() * canvasBounds.width;
    this.targetY = Math.random() * canvasBounds.height;
  }
  setTarget() {
    this.targetX = Math.random() * canvasBounds.width;
    this.targetY = Math.random() * canvasBounds.height;
  }
  update() {
    let dist = Math.hypot(
      this.targetX - this.char.getX(),
      this.targetY - this.char.getY()
    );
    if (dist < EPSILON) {
      this.setTarget();
    }
    this.char.moveTowards(this.targetX, this.targetY);
  }
}

console.log("Loaded.");

const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
let dirX = 0;
let dirY = 0;
window.addEventListener("keydown", (e) => {
  if (e.keyCode === LEFT_KEY || e.key === "a") {
    if (dirY !== 0) dirX = -0.5;
    else dirX = -1;
  } else if (e.keyCode === UP_KEY || e.key === "w") {
    if (dirX !== 0) dirY = -0.5;
    else dirY = -1;
  } else if (e.keyCode === RIGHT_KEY || e.key === "d") {
    if (dirY !== 0) dirX = 0.5;
    else dirX = 1;
  } else if (e.keyCode === DOWN_KEY || e.key === "s") {
    if (dirX !== 0) dirY = 0.5;
    else dirY = 1;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.keyCode === LEFT_KEY || e.key === "a") {
    dirX = 0;
    dirY *= 2;
  } else if (e.keyCode === UP_KEY || e.key === "w") {
    dirX *= 2;
    dirY = 0;
  } else if (e.keyCode === RIGHT_KEY || e.key === "d") {
    dirX = 0;
    dirY *= 2;
  } else if (e.keyCode === DOWN_KEY || e.key === "s") {
    dirX *= 2;
    dirY = 0;
  }
});
