// CONFIGS  

const GRID = 20;
const START_SPEED = 120;
const MIN_SPEED = 55;
const SPEED_STEP = 5;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const CELL = canvas.width / GRID;

const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start");

// CURRENT STATE

let snake, food, dir, nextDir, score, speed, timer;
let state = "menu"; // estado atual do jogo

function reset() {
    snake = [{x: 10, y: 10}, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = {x: 1, y: 0};
    nextDir = dir;
    score = 0;
    speed = START_SPEED;
    scoreEl.textContent = score;
    placeFood()
}

// GAME LOOP

function step() {
    dir = nextDir; // atualizar a direção da cobra
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    const hitWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
    // a cauda está na última posição da cobra, então não conta como colisão, porque vai se mover
    const hitSelf = snake.slice(0, -1).some(s => s.x === head.x && s.y === head.y);
    if (hitWall || hitSelf) return gameOver();
    snake.unshift(head); // adicionar a nova cabeça à frente
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        speed = Math.max(MIN_SPEED, speed - SPEED_STEP);
        placeFood(); // comeu, então fica com a cauda porque a cobra cresceu
    } else {
        snake.pop(); // remover a cauda
    }
    draw();
    timer = setTimeout(step, speed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171"
    ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

    ctx.fillStyle = "#4ade80"
    snake.forEach(s => ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1 , CELL - 1));
}

function placeFood() {
    const free = [];
    for (let x = 0; x < GRID; x++)
        for (let y = 0; y < GRID; y++)
            if (!snake.some(s => s.x === x && s.y === y)) free.push({ x, y });
    food = free[Math.floor(Math.random() * free.length)];
}

// INPUTS

const KEYS = {
    ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }
}

function turn(d) {
    // a cobra não pode virar 180 graus, senão vai contra si própria
    if (state === "playing" && d.x !== -dir.x && d.y !== -dir.y) nextDir = d;
}

document.addEventListener("keydown", e => {
    const d = KEYS[e.key] || KEYS[e.key.toLowerCase()];
    if (d) { e.preventDefault(); turn(d); }
    if (e.key === " ") {
        e.preventDefault();
        if (state === "menu" || state === "over") start();
        else togglePause();
    }
});

// STATES

function start() {
    reset();
    state = "playing";
    overlay.classList.add("hidden");
    draw();
    timer = setTimeout(step, speed);
}

function togglePause() {
    if (state === "playing") {
        state = "paused";
        clearTimeout(timer);
        showOverlay("Paused", "Press Space to continue", "Continue")
    } else if (state === "paused") {
        state = "playing";
        overlay.classList.add("hidden");
        timer = setTimeout(step, speed);
    }
}

function gameOver() {
    state = "over";
    showOverlay("Game Over", `Your score: ${score}`, "Try Again");
}

function showOverlay(title, text, btn) {
    overlayTitle.textContent = title;
    overlayText.innerHTML = text;
    startBtn.textContent = btn;
    overlay.classList.remove("hidden");
}

// START BUTTON

startBtn.addEventListener("click", () => {
    state === "paused" ? togglePause() : start();
});