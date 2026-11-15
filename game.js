const GRID = 20;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const CELL = canvas.width / GRID;

let snake = [{x: 10, y: 10}, { x: 9, y: 10 }, { x: 8, y: 10 }];
let food = { x: 15, y: 10 };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171"
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

    ctx.fillStyle = "#4ade80"
    snake.forEach(s => ctx.fillRect(s.x * CELL, s.y * CELL, CELL, CELL));
}

draw()