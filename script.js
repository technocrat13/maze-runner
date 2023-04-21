const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerCanvas = document.getElementById('playerCanvas');
const playerCtx = playerCanvas.getContext('2d');

const tileSize = 10;
const mazeWidth = 75;
const mazeHeight = 75;

const maze = rotateMaze180(generateMaze(mazeWidth, mazeHeight));
const mazeCanvas = document.createElement('canvas');
mazeCanvas.width = mazeWidth * tileSize;
mazeCanvas.height = mazeHeight * tileSize;
const mazeCtx = mazeCanvas.getContext('2d');

const player = {
    x: 1,
    y: 1,
};

const exit = {
    x: mazeWidth - 2,
    y: mazeHeight - 2,
};

function generateMaze(width, height) {
    const maze = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => 1)
    );

    function dfs(x, y) {
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];

        maze[y][x] = 0;

        const depthProb = 0.5; // Probability to prioritize depth-first exploration

        // Sort the directions based on the depth-first exploration probability
        directions.sort(() => {
            return Math.random() < depthProb ? -1 : 1;
        });

        for (const [dx, dy] of directions) {
            const newX = x + dx * 2;
            const newY = y + dy * 2;

            if (newX >= 0 && newX < width && newY >= 0 && newY < height && maze[newY][newX] === 1) {
                maze[y + dy][x + dx] = 0;
                dfs(newX, newY);
            }
        }
    }

    dfs(1, 1);
    return maze;
}

function rotateMaze180(maze) {
    const rotatedMaze = maze.map(row => row.slice().reverse());
    return rotatedMaze.reverse();
}


function drawMaze() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x]) {
                mazeCtx.fillStyle = 'black';
            } else {
                mazeCtx.fillStyle = 'white';
            }
            mazeCtx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Draw the exit
    mazeCtx.fillStyle = 'green';
    mazeCtx.fillRect(exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);
}

function drawPlayer() {
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    playerCtx.drawImage(mazeCanvas, 0, 0);
    playerCtx.fillStyle = 'red';
    playerCtx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// function draw() {
//     drawPlayer();
//     requestAnimationFrame(draw);
// }

// ... (rest of the code remains the same)



// ... (rest of the code remains the same)


function drawMaze() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x]) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Draw the exit
    ctx.fillStyle = 'green';
    ctx.fillRect(exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);
}


const visited = Array.from({ length: mazeHeight }, () =>
    Array.from({ length: mazeWidth }, () => 0)
);
visited[player.y][player.x] = 1;

function drawPlayer() {
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    playerCtx.drawImage(mazeCanvas, 0, 0);

    for (let y = 0; y < visited.length; y++) {
        for (let x = 0; x < visited[y].length; x++) {
            if (visited[y][x]) {
                if (visited[y][x] === 1) {
                    playerCtx.fillStyle = 'red';
                } else {
                    playerCtx.fillStyle = 'purple';
                }
                playerCtx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    playerCtx.strokeStyle = 'yellow';
    playerCtx.lineWidth = 2;
    playerCtx.strokeRect(player.x * tileSize + 1, player.y * tileSize + 1, tileSize - 2, tileSize - 2);
}



const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
};

function handleKeyDown(event) {
    if (event.key.toLowerCase() in keys) {
        event.preventDefault();
        keys[event.key.toLowerCase()] = true;
    }
}

function handleKeyUp(event) {
    if (event.key.toLowerCase() in keys) {
        event.preventDefault();
        keys[event.key.toLowerCase()] = false;
    }
}

const moveInterval = 50; // Time in milliseconds between each move
let lastMoveTime = 0;

function movePlayer() {

    const currentTime = performance.now();
    if (currentTime - lastMoveTime < moveInterval) return;

    const oldX = player.x;
    const oldY = player.y;

    if (keys.w) player.y--;
    if (keys.a) player.x--;
    if (keys.s) player.y++;
    if (keys.d) player.x++;

    if (maze[player.y] === undefined || maze[player.y][player.x] === 1) {
        player.x = oldX;
        player.y = oldY;
    } else {
        if (visited[player.y][player.x] === 1) {
            visited[oldY][oldX] = 2;
        } else {
            visited[oldY][oldX] = 1;
        }
        visited[player.y][player.x] = 1;
        lastMoveTime = currentTime;
    }
}

const timerCanvas = document.getElementById('timerCanvas');
const timerCtx = timerCanvas.getContext('2d');

let timer = 0;
let timerInterval;
let gameFinished = false;

function startTimer() {
    timerInterval = setInterval(() => {
        timer += 10; // Update the timer every 10 milliseconds
        drawTimer();
    }, 10);
}

function drawTimer() {
    timerCtx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

    const seconds = (timer / 1000).toFixed(3); // Convert milliseconds to seconds with 3 decimal places
    timerCtx.font = '20px Arial';
    timerCtx.fillStyle = 'black';
    timerCtx.fillText(`Time: ${seconds}s`, 10, 30);
}

function checkForExit() {
    if (player.x === exit.x && player.y === exit.y && !gameFinished) {
        clearInterval(timerInterval);
        gameFinished = true;
        displayCompletionScreen();
    }
}

function displayCompletionScreen() {
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlayText');
    const seconds = (timer / 1000).toFixed(3);

    overlayText.innerHTML = `Congratulations!<br>You completed the maze in ${seconds}s`;
    overlay.style.display = 'block';
}

function draw() {
    movePlayer();
    drawPlayer();
    checkForExit();
    requestAnimationFrame(draw);
}
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

draw();
drawMaze();
startTimer();