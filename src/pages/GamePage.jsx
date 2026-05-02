import { useEffect, useRef, useState } from "react";

const gridSize = 18;
const startTruck = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];

function randomCargo(truck) {
  let cargo;

  do {
    cargo = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (truck.some((part) => part.x === cargo.x && part.y === cargo.y));

  return cargo;
}

export default function GamePage() {
  const [truck, setTruck] = useState(startTruck);
  const [cargo, setCargo] = useState(randomCargo(startTruck));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState("Press start to begin hauling.");
  const gameLoopRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key.toLowerCase();

      if ((key === "arrowup" || key === "w") && direction.y !== 1) {
        setNextDirection({ x: 0, y: -1 });
      }

      if ((key === "arrowdown" || key === "s") && direction.y !== -1) {
        setNextDirection({ x: 0, y: 1 });
      }

      if ((key === "arrowleft" || key === "a") && direction.x !== 1) {
        setNextDirection({ x: -1, y: 0 });
      }

      if ((key === "arrowright" || key === "d") && direction.x !== -1) {
        setNextDirection({ x: 1, y: 0 });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!started || gameOver) return;

    gameLoopRef.current = setInterval(moveTruck, 150);

    return () => clearInterval(gameLoopRef.current);
  }, [truck, nextDirection, started, gameOver]);

  function startGame() {
    setStarted(true);
    setMessage("Collect cargo and grow your hauling rig.");
  }

  function moveTruck() {
    setDirection(nextDirection);

    const head = truck[0];
    const newHead = {
      x: head.x + nextDirection.x,
      y: head.y + nextDirection.y,
    };

    const hitWall =
      newHead.x < 0 ||
      newHead.x >= gridSize ||
      newHead.y < 0 ||
      newHead.y >= gridSize;

    const hitSelf = truck.some(
      (part) => part.x === newHead.x && part.y === newHead.y
    );

    if (hitWall || hitSelf) {
      setGameOver(true);
      setMessage("Crash! Your rig couldn’t handle the turn.");
      return;
    }

    const ateCargo = newHead.x === cargo.x && newHead.y === cargo.y;
    const newTruck = [newHead, ...truck];

    if (ateCargo) {
      const newScore = score + 1;
      setScore(newScore);
      setCargo(randomCargo(newTruck));

      if (newScore % 5 === 0) {
        setMessage("New trailer attached! Rig extended.");
      } else {
        setMessage("Cargo collected.");
      }

      setTruck(newTruck);
    } else {
      newTruck.pop();
      setTruck(newTruck);
    }
  }

  function restartGame() {
    setTruck(startTruck);
    setCargo(randomCargo(startTruck));
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setMessage("Press start to begin hauling.");
  }

  function getCellContent(x, y) {
    const head = truck[0];

    if (head.x === x && head.y === y) return "🚚";
    if (cargo.x === x && cargo.y === y) return "📦";

    const index = truck.findIndex((p) => p.x === x && p.y === y);

    if (index > 0) {
      return index % 5 === 0 ? "🚛" : "▰";
    }

    return "";
  }

  return (
    <section className="game-page">
      <div className="game-card">
        <div className="game-header">
          <div>
            <p className="eyebrow">Bonus Mini Game</p>
            <h1>HaulSnake</h1>
            <p className="subtext">
              Drive the rig, collect cargo, and grow longer trailers.
            </p>
          </div>

          <div className="game-score">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
        </div>

        {!started && !gameOver && (
          <div className="game-start-overlay">
            <h2>Ready to haul?</h2>
            <p>Use arrow keys or WASD to drive your truck.</p>
            <button onClick={startGame}>Start Game</button>
          </div>
        )}

        <div className="game-board">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);

            return (
              <div className="game-cell" key={index}>
                {getCellContent(x, y)}
              </div>
            );
          })}
        </div>

        <div className="game-footer">
          <p>{message}</p>
          <button onClick={restartGame}>
            {gameOver ? "Restart Haul" : "Reset"}
          </button>
        </div>

        <p className="game-controls">
          Controls: Arrow keys or WASD
        </p>
      </div>
    </section>
  );
}