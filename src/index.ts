import p5 from "p5";

const BLOCK_SIZE = 25;
let p: p5;

class Block {
  constructor(public x: number, public y: number) {}

  public draw() {
    p.push();
    p.rect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    p.pop();
  }
}

export class Mino {
  constructor(
    public x: number,
    public y: number,
    public rotation: number,
    private shape: number
  ) {}

  public draw() {
    const blocks = this.calcBlocks();
    blocks.forEach((b) => {
      b.draw();
    });
  }

  public calcBlocks() {
    const T = [
      new Block(-1, 0),
      new Block(0, 0),
      new Block(0, -1),
      new Block(1, 0),
    ];
    const Z = [
      new Block(-1, -1),
      new Block(0, -1),
      new Block(0, 0),
      new Block(1, 0),
    ];
    const S = [
      new Block(-1, 0),
      new Block(0, 0),
      new Block(0, -1),
      new Block(1, -1),
    ];
    const L = [
      new Block(-1, -2),
      new Block(-1, -1),
      new Block(-1, 0),
      new Block(0, 0),
    ];
    const J = [
      new Block(0, -2),
      new Block(0, -1),
      new Block(-1, 0),
      new Block(0, 0),
    ];
    const O = [
      new Block(-1, -1),
      new Block(-1, 0),
      new Block(0, 0),
      new Block(0, -1),
    ];
    const I = [
      new Block(-2, 0),
      new Block(-1, 0),
      new Block(0, 0),
      new Block(1, 0),
    ];

    const MINOS = [T, Z, S, L, J, O, I];

    let blocks = MINOS[this.shape];

    const rot = (400000 + this.rotation) % 4;
    for (let r = 0; r < rot; r++) {
      // rotate 90
      blocks = blocks.map((b) => new Block(-b.y, b.x));
    }

    blocks.forEach((b) => {
      b.x += this.x;
      b.y += this.y;
    });

    return blocks;
  }

  public copy() {
    return new Mino(this.x, this.y, this.rotation, this.shape);
  }
}

class Field {
  private tiles = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  public draw() {
    const H = this.tiles.length;
    const W = this.tiles[0].length;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (this.tileAt(x, y) === 1) {
          new Block(x, y).draw();
        }
      }
    }
  }

  public tileAt(x: number, y: number) {
    const H = this.tiles.length;
    const W = this.tiles[0].length;
    if (x < 0 || x >= W || y < 0 || y >= H) return 1; //画面外
    return this.tiles[y][x];
  }

  public putBlock(x: number, y: number) {
    this.tiles[y][x] = 1;
  }

  findLineFilled() {
    const H = this.tiles.length;
    for (let y = 0; y < H-1; y++) {
      const isFilled = this.tiles[y].every((t) => t === 1);
      if (isFilled) return y;
    }
    return -1;
  }

  cutLine(y: number) {
    this.tiles.splice(y, 1);
    this.tiles.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
  }
}

class Game {
  constructor() {
    this.mino = Game.makeMino();
  }

  static makeMino() {
    return new Mino(5, 2, 0, p.floor(p.random(0, 7)));
  }

  static isMinoMovable(mino: Mino, field: Field) {
    const blocks = mino.calcBlocks();
    return blocks.every((b) => {
      return field.tileAt(b.x, b.y) === 0;
    });
  }

  public minoVx = 0;
  public minoVy = 0;
  public minoVr = 0;
  public minoDrop = 0;
  private mino: Mino;
  private field = new Field();
  private fc = 0;

  public tick() {
    // 落下
    if (this.minoVy === 1 || this.fc % 20 === 19) {
      const featureMino = this.mino.copy();

      featureMino.y += 1;
      if (Game.isMinoMovable(featureMino, this.field)) {
        this.mino.y += 1;
      } else {
        const blocks = this.mino.calcBlocks();

        blocks.forEach((b) => {
          this.field.putBlock(b.x, b.y);
        });
        this.mino = Game.makeMino();
      }

      this.minoVy = 0;
    }

    if (this.minoDrop === 1) {
      const featureMino = this.mino.copy();
      do {
        featureMino.y += 1;
      } while (Game.isMinoMovable(featureMino, this.field));
      this.mino.y = featureMino.y - 1;
      const blocks = this.mino.calcBlocks();

      blocks.forEach((b) => {
        this.field.putBlock(b.x, b.y);
      });
      this.minoDrop = 0;
    }

    // 消去
    let line = -1;
    while ((line = this.field.findLineFilled()) !== -1) {
      this.field.cutLine(line);
    }

    // 左右移動
    if (this.minoVx !== 0) {
      const featureMino = this.mino.copy();
      featureMino.x += this.minoVx;
      if (Game.isMinoMovable(featureMino, this.field)) {
        this.mino.x += this.minoVx;
      }
      this.minoVx = 0;
    }

    if (this.minoVr !== 0) {
      const featureMino = this.mino.copy();
      featureMino.rotation += this.minoVr;
      if (Game.isMinoMovable(featureMino, this.field)) {
        this.mino.rotation += this.minoVr;
      }
      this.minoVr = 0;
    }

    p.background(64);
    this.mino.draw();
    this.field.draw();
    this.fc++;
  }
}

const sketch = (_p: p5) => {
  let game: Game;

  _p.setup = () => {
    _p.createCanvas(BLOCK_SIZE * 12, BLOCK_SIZE * 21);
    _p.background(64);
    p = _p;
    game = new Game();
  };

  _p.draw = () => {
    game.tick();

    // @ts-expect-error
    window.game = game; // for debug with browser console
  };

  _p.keyPressed = () => {
    if (_p.keyCode === 37 /* left arrow */) game.minoVx = -1;
    if (_p.keyCode === 39 /* right arrow */) game.minoVx = 1;
    if (_p.keyCode === 40 /* bottom arrow */) game.minoVy = 1;

    if (_p.keyCode === 83 /* s key, right rotation */) game.minoVr = 1;
    if (_p.keyCode === 65 /* a key, left rotation */) game.minoVr = -1;

    if (_p.keyCode === 13 /* return key */) game.minoDrop = 1;
  };
};

new p5(sketch);
