let canvasElem = document.getElementById("canvas") as HTMLCanvasElement;
let canvasBounds = canvasElem.getBoundingClientRect();
let ctx = canvasElem.getContext("2d")!;
let g = new Graphics(ctx, canvasBounds);

let sprites1AImg = new Image();
sprites1AImg.src = "Assets/Sprites/HC_Humans1A.png";

let tileImage = new Image();
tileImage.src = "Assets/Tiles/TileA5_PHC_Exterior-General.png";

let attackImage = new Image();
attackImage.src = "Assets/Attack/3X Size/Felicity_PHC.png";

function draw() {
  g.translate(char.getX(), char.getY());
  g.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
  map.draw(g);
  characters.sort((a, b) => a.getY() - b.getY());
  characters.forEach((c) => {
    c.draw(g);
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

let tileMap: SpriteSheet;

window.onload = () => {
  tileMap = new SpriteSheet(tileImage, 8, 16);
  map = new MyMap(20, 20);
  let sprites1A = new SpriteSheet(sprites1AImg, 12, 8);
  let attackSprites = new SpriteSheet(attackImage, 5, 18);
  char = new Character(
    characterAnimation(sprites1A, attackSprites, 1),
    100,
    100,
    200,
    false
  );
  characters.push(char);
  characters.push(
    new Character(
      characterAnimation(sprites1A, attackSprites, 4),
      200,
      100,
      100,
      true
    )
  );
  let r;
  do {
    r = ~~(Math.random() * 8);
  } while (r === 1 || r === 4);
  console.log(r);
  characters.push(
    new Character(
      characterAnimation(sprites1A, attackSprites, r),
      200,
      300,
      100,
      true
    )
  );
  gameLoop();
};

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
  } else if (e.key === " ") {
    char.attack();
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

console.log("Loaded.");
