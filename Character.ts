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
  draw(g: Graphics) {
    this.currentAnimation.draw(g, Math.round(this.posX), Math.round(this.posY));
  }
  update(elapsed: number) {
    this.posX += elapsed * this.velX;
    this.posY += elapsed * this.velY;
    let oldAni = this.currentAnimation;
    if (this.currentAnimation.isUninterruptible()) {
    } else if (this.velY === this.velX) {
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
  attack() {
    this.currentAnimation = this.ani.attack;
    this.currentAnimation.reset();
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

interface CharacterAnimation {
  walkDown: MyAnimation;
  walkLeft: MyAnimation;
  walkRight: MyAnimation;
  walkUp: MyAnimation;
  stand: MyAnimation;
  attack: MyAnimation;
}

function characterAnimation(
  sheet: SpriteSheet,
  attack: SpriteSheet,
  r: number
): CharacterAnimation {
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
      false,
      false,
      0
    ),
    attack: attackAnimation(attack),
  };
}

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
