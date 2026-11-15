const GRID = 20;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const CELL = canvas.width / GRID;
const SPEED = 120;

let snake = [{x: 10, y: 10}, { x: 9, y: 10 }, { x: 8, y: 10 }];
let food;
let dir = {x: 1, y: 0};
let nextDir = dir;

function step() {
    dir = nextDir; // atualizar a direção da cobra
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    snake.unshift(head); // adicionar a nova cabeça à frente
    if (head.x === food.x && head.y === food.y) {
        placeFood(); // comeu, então fica com a cauda porque a cobra cresceu
    } else {
        snake.pop(); // remover a cauda
    }
    draw();
    setTimeout(step, SPEED);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171"
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

    ctx.fillStyle = "#4ade80"
    snake.forEach(s => ctx.fillRect(s.x * CELL, s.y * CELL, CELL, CELL));
}
placeFood();
draw()
setTimeout(step, SPEED);

const KEYS = {
    ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }
}

function turn(d) {
    // a cobra não pode virar 180 graus, senão vai contra si própria
    if (d.x !== -dir.x && d.y !== -dir.y) nextDir = d;
}

document.addEventListener("keydown", e => {
    const d = KEYS[e.key] || KEYS[e.key.toLowerCase()];
    if (d) { e.preventDefault(); turn(d); }
});

function placeFood() {
    const free = [];
    for (let x = 0; x < GRID; x++)
        for (let y = 0; y < GRID; y++)
            if (!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
    food = free[Math.floor(Math.random() * free.length)];
}