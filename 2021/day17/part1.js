const target = {
  x: {
    min: 32,
    max: 65,
  },
  y: {
    min: -225,
    max: -177,
  },
};

const simulate = (vx, vy) => {
  const pos = {
    x: 0,
    y: 0,
  };
  const vel = {
    x: vx,
    y: vy,
  };
  let maxY = -Infinity;
  let reachedTarget = false;
  while (
    !(
      reachedTarget ||
      pos.x > target.x.max ||
      pos.y < target.y.min ||
      (vel.x === 0 && pos.x < target.x.min)
    )
  ) {
    const prevVel = {
      x: vel.x,
      y: vel.y,
    };
    const prevPos = {
      x: pos.x,
      y: pos.y,
    };
    pos.x = prevPos.x + prevVel.x;
    pos.y = prevPos.y + prevVel.y;
    if (prevVel.x > 0) {
      vel.x = prevVel.x - 1;
    } else if (prevVel.x < 0) {
      vel.x = prevVel.x + 1;
    }
    vel.y = prevVel.y - 1;
    if (pos.y > maxY) maxY = pos.y;
    if (
      pos.x >= target.x.min &&
      pos.x <= target.x.max &&
      pos.y <= target.y.max &&
      pos.y >= target.y.min
    )
      reachedTarget = true;
  }
  return reachedTarget ? maxY : -Infinity;
};

const findMaxY = (range) => {
  let maxY = -Infinity;
  for (let x = range.x.min; x <= range.x.max; x++) {
    for (let y = range.y.min; y <= range.y.max; y++) {
      const max = simulate(x, y);
      if (max > maxY) maxY = max;
    }
  }
  return maxY;
};

const findMinX = (xmin) => {
  let x = 0;
  while ((x * (x + 1)) / 2 < xmin) x++;
  return x;
};

try {
  const range = {
    x: {
      min: findMinX(target.x.min),
      max: target.x.max + 1,
    },
    y: {
      min: target.y.min - 1,
      max: 500,
    },
  };
  const result = findMaxY(range);
  console.log("result:", result);
} catch (error) {
  console.log(error);
}
