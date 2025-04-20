import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [boardSize, setBoardSize] = useState(8);
  const [numKnights, setNumKnights] = useState(14);
  const [populationSize, setPopulationSize] = useState(30);
  const [generations, setGenerations] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [bestSolutions, setBestSolutions] = useState([]);
  const [currentSolution, setCurrentSolution] = useState(null);
  const [message, setMessage] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState(500);

  const autoRunRef = useRef(autoRun);
  autoRunRef.current = autoRun;

  useEffect(() => {
    let timer;
    if (isRunning && autoRun) {
      timer = setTimeout(runNextGeneration, animationSpeed);
    }
    return () => clearTimeout(timer);
  }, [isRunning, autoRun, currentGeneration]);

  useEffect(() => {
    if (currentSolution) {
      const index = bestSolutions.findIndex(solution =>
        solution.generation === currentGeneration
      );
      if (index !== -1) {
        setCurrentSolution(bestSolutions[index]);
      }
    }
  }, [currentGeneration, bestSolutions]);

  const startGeneticAlgorithm = async () => {
    try {
      setIsRunning(true);
      setMessage('Starting genetic algorithm...');
      setBestSolutions([]);

      const response = await fetch('http://localhost:5000/api/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          boardSize,
          numKnights,
          populationSize,
          generations
        })
      });

      const data = await response.json();
      setCurrentGeneration(data.generation);

      // Add generation number to the solution
      const solution = {...data.best_solution, generation: data.generation};
      setBestSolutions([solution]);
      setCurrentSolution(solution);

      setMessage(`Generation ${data.generation} complete. Fitness: ${solution.fitness}`);

      if (data.complete) {
        setIsRunning(false);
        setMessage('Genetic algorithm completed!');
      }
    } catch (error) {
      console.error('Error starting GA:', error);
      setMessage('Error starting genetic algorithm');
      setIsRunning(false);
    }
  };

  const runNextGeneration = async () => {
    if (!isRunning) return;

    try {
      const response = await fetch('http://localhost:5000/api/next');
      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
        setIsRunning(false);
        setAutoRun(false);
        return;
      }

      setCurrentGeneration(data.generation);

      // Add generation number to the solution
      const solution = {...data.best_solution, generation: data.generation};
      setBestSolutions(prev => [...prev, solution]);
      setCurrentSolution(solution);

      setMessage(`Generation ${data.generation} complete. Fitness: ${solution.fitness}`);

      if (data.complete) {
        setIsRunning(false);
        setAutoRun(false);
        setMessage('Genetic algorithm completed!');
      }
    } catch (error) {
      console.error('Error running next generation:', error);
      setMessage('Error running next generation');
      setIsRunning(false);
      setAutoRun(false);
    }
  };

  const saveSolutions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST'
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      console.error('Error saving solutions:', error);
      setMessage('Error saving solutions');
    }
  };

  const loadSolutions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/load');
      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
        return;
      }

      // Add generation numbers to the loaded solutions
      const solutions = data.results.map((solution, index) => ({
        ...solution,
        generation: index + 1
      }));

      setBestSolutions(solutions);
      setCurrentGeneration(solutions.length);
      setCurrentSolution(solutions[solutions.length - 1]);
      setMessage(data.message);
      setIsRunning(false);
      setAutoRun(false);
    } catch (error) {
      console.error('Error loading solutions:', error);
      setMessage('Error loading solutions');
    }
  };

  const handleGenerationSlider = (e) => {
    const gen = parseInt(e.target.value);
    setCurrentGeneration(gen);
    const solution = bestSolutions.find(sol => sol.generation === gen);
    if (solution) {
      setCurrentSolution(solution);
    }
  };

  const renderChessBoard = () => {
    if (!currentSolution) return null;

    const board = [];
    const size = currentSolution.size;

    // Create a set of knight positions for O(1) lookup
    const knightPositions = new Set(
      currentSolution.positions.map(([x, y]) => `${x},${y}`)
    );

    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const isKnight = knightPositions.has(`${x},${y}`);
        const isEvenSquare = (x + y) % 2 === 0;
        const squareClass = `square ${isEvenSquare ? 'light' : 'dark'}`;

        board.push(
          <div key={`${x}-${y}`} className={squareClass}>
            {isKnight && <div className="knight">♞</div>}
          </div>
        );
      }
    }

    return (
      <div className="chess-board" style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`
      }}>
        {board}
      </div>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>N-Knights Problem Solver</h1>
        <p>Genetic Algorithm Visualization</p>
      </header>

      <div className="main-container">
        <div className="control-panel">
          <h2>Parameters</h2>

          <div className="input-group">
            <label htmlFor="board-size">Board Size:</label>
            <input
              id="board-size"
              type="number"
              min="4"
              max="12"
              value={boardSize}
              onChange={(e) => setBoardSize(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="input-group">
            <label htmlFor="num-knights">Number of Knights:</label>
            <input
              id="num-knights"
              type="number"
              min="4"
              max={boardSize * boardSize}
              value={numKnights}
              onChange={(e) => setNumKnights(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="input-group">
            <label htmlFor="population-size">Population Size:</label>
            <input
              id="population-size"
              type="number"
              min="10"
              max="100"
              value={populationSize}
              onChange={(e) => setPopulationSize(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="input-group">
            <label htmlFor="generations">Generations:</label>
            <input
              id="generations"
              type="number"
              min="10"
              max="200"
              value={generations}
              onChange={(e) => setGenerations(parseInt(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="input-group">
            <label htmlFor="animation-speed">Animation Speed (ms):</label>
            <input
              id="animation-speed"
              type="range"
              min="100"
              max="2000"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            />
            <span>{animationSpeed}ms</span>
          </div>

          <div className="button-group">
            <button
              onClick={startGeneticAlgorithm}
              disabled={isRunning}
              className="primary-button"
            >
              Start New
            </button>

            <button
              onClick={runNextGeneration}
              disabled={!isRunning || autoRun}
              className="action-button"
            >
              Next Generation
            </button>

            <button
              onClick={() => setAutoRun(!autoRun)}
              disabled={!isRunning}
              className={`action-button ${autoRun ? 'active' : ''}`}
            >
              {autoRun ? 'Pause' : 'Auto Run'}
            </button>
          </div>

          <div className="button-group">
            <button onClick={saveSolutions} className="secondary-button">
              Save Solutions
            </button>

            <button onClick={loadSolutions} className="secondary-button">
              Load Solutions
            </button>
          </div>

          <div className="stats">
            <p>Current Generation: {currentGeneration} / {generations}</p>
            {currentSolution && (
              <p>Best Fitness: {currentSolution.fitness} / {currentSolution.knights}</p>
            )}
            <p className="message">{message}</p>
          </div>
        </div>

        <div className="visualization">
          <h2>Chess Board Visualization</h2>
          {renderChessBoard()}

          {bestSolutions.length > 0 && (
            <div className="generation-slider">
              <input
                type="range"
                min="1"
                max={bestSolutions.length}
                value={currentGeneration}
                onChange={handleGenerationSlider}
                className="slider"
              />
              <div className="slider-label">
                Generation: {currentGeneration} / {bestSolutions.length}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer>
        <p>N-Knights Problem Solver - Genetic Algorithm Implementation</p>
      </footer>
    </div>
  );
}

export default App;