const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 1;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    ///redundant, defined below
    x: 0,
    y: 0,
  },
  imageSrc: "./img/hellminth/idle.png",
  frames: 8,
  scale: 2,
  offset: {
    x: 215,
    y: 133,
  },
  sprites: {
    idle: {
      imageSrc: "./img/hellminth/idle_hellminth2.png",
      frames: 8,
    },

    run: {
      imageSrc: "./img/hellminth/runFlip.png",
      frames: 8,
    },

    jump: {
      imageSrc: "./img/hellminth/runflip.png",
      frames: 2,
    },

    fall: {
      imageSrc: "./img/hellminth/runFlip.png",
      frames: 8,
    },

    attack1: {
      imageSrc: "./img/hellminth/attack1.png",
      frames: 6,
    },

    hit: {
      imageSrc: "./img/hellminth/hit.png",
      frames: 4,
    },
    death: {
      imageSrc: "./img/hellminth/death.png",
      frames: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  //
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    ///redundant, defined below
    x: 0,
    y: 0,
  },
  imageSrc: "./img/kenji/idle.png",
  frames: 4,
  scale: 1.8,
  offset: {
    x: 215,
    y: 10,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/idle.png",
      frames: 4,
    },

    run: {
      imageSrc: "./img/kenji/run.png",
      frames: 8,
    },

    jump: {
      imageSrc: "./img/kenji/jump.png",
      frames: 2,
    },

    fall: {
      imageSrc: "./img/kenji/fall.png",
      frames: 2,
    },

    attack1: {
      imageSrc: "./img/kenji/attack1.png",
      frames: 4,
    },

    hit: {
      imageSrc: "./img/kenji/hit.png",
      frames: 3,
    },
    death: {
      imageSrc: "./img/kenji/death.png",
      frames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 40,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

let lastKey;

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate); // repeats animate() function over and over
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); // clears rect

  background.update();
  //shop.update();
  c.fillStyle = "rgba(255,255,255, 0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player  movement
  player.velocity.x = 0;

  // jump stop limit: height <  (500ish) then velocity = positive until ground offset is reached ?
  if (player.position.y > 450) {
    player.velocity.y = 20;
  }

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  enemy.velocity.x = 0;

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //collision detection pVe
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealth", { width: enemy.health + "%" });
  }

  //player misses attack

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  // collision eVp
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealth", { width: player.health + "%" });
    //document.querySelector('#playerHealth').style.width = player.health + '%'
  }
  //enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //end game on KO
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      //player 1 controls
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;

        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    // player 2 controls
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
