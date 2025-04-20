import os
import json
import pickle
import random
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)


class KnightBoard:
    def __init__(self, size, knights):
        self.size = size
        self.knights = knights
        self.board = [[0] * size for _ in range(size)]
        self.positions = []
        self.place_knights()

    def place_knights(self):
        self.positions.clear()
        placed = 0
        while placed < self.knights:
            x, y = random.randint(0, self.size - 1), random.randint(0, self.size - 1)
            if self.board[x][y] == 0:
                self.board[x][y] = 1
                self.positions.append((x, y))
                placed += 1

    def is_valid(self):
        for i, (x1, y1) in enumerate(self.positions):
            for j, (x2, y2) in enumerate(self.positions):
                if i != j and self.threatens(x1, y1, x2, y2):
                    return False
        return True

    def threatens(self, x1, y1, x2, y2):
        return (abs(x1 - x2), abs(y1 - y2)) in [(2, 1), (1, 2)]

    def fitness(self):
        score = 0
        for i, (x1, y1) in enumerate(self.positions):
            safe = True
            for j, (x2, y2) in enumerate(self.positions):
                if i != j and self.threatens(x1, y1, x2, y2):
                    safe = False
                    break
            if safe:
                score += 1
        return score

    def to_dict(self):
        return {
            "size": self.size,
            "knights": self.knights,
            "positions": self.positions,
            "fitness": self.fitness()
        }


class GeneticAlgorithm:
    def __init__(self, board_size, num_knights, population_size, generations):
        self.board_size = board_size
        self.num_knights = num_knights
        self.population_size = population_size
        self.generations = generations
        self.population = []
        self.best_per_gen = []
        self.current_generation = 0

    def create_individual(self):
        return KnightBoard(self.board_size, self.num_knights)

    def crossover(self, parent1, parent2):
        child = KnightBoard(self.board_size, self.num_knights)
        split = self.num_knights // 2
        child.positions = parent1.positions[:split] + parent2.positions[split:]
        child.board = [[0] * self.board_size for _ in range(self.board_size)]
        for x, y in child.positions:
            if 0 <= x < self.board_size and 0 <= y < self.board_size:
                child.board[x][y] = 1
        return child

    def mutate(self, board):
        if board.positions:
            i = random.randint(0, len(board.positions) - 1)
            x, y = random.randint(0, self.board_size - 1), random.randint(0, self.board_size - 1)
            board.board[board.positions[i][0]][board.positions[i][1]] = 0
            board.positions[i] = (x, y)
            board.board[x][y] = 1

    def run_generation(self):
        if self.current_generation == 0:
            self.population = [self.create_individual() for _ in range(self.population_size)]

        self.population.sort(key=lambda x: x.fitness(), reverse=True)
        self.best_per_gen.append(self.population[0])
        new_gen = self.population[:2]

        while len(new_gen) < self.population_size:
            p1, p2 = random.sample(self.population[:10], 2)
            child = self.crossover(p1, p2)
            if random.random() < 0.3:
                self.mutate(child)
            new_gen.append(child)

        self.population = new_gen
        self.current_generation += 1

        return {
            "generation": self.current_generation,
            "best_solution": self.best_per_gen[-1].to_dict(),
            "complete": self.current_generation >= self.generations
        }

    def get_all_best(self):
        return [board.to_dict() for board in self.best_per_gen]


# Global GA instance
ga_instance = None


@app.route('/api/start', methods=['POST'])
def start_ga():
    global ga_instance
    data = request.json
    board_size = data.get('boardSize', 8)
    num_knights = data.get('numKnights', 14)
    population_size = data.get('populationSize', 30)
    generations = data.get('generations', 50)

    ga_instance = GeneticAlgorithm(board_size, num_knights, population_size, generations)
    result = ga_instance.run_generation()

    return jsonify(result)


@app.route('/api/next', methods=['GET'])
def next_generation():
    global ga_instance
    if ga_instance is None:
        return jsonify({"error": "No genetic algorithm running"}), 400

    result = ga_instance.run_generation()
    return jsonify(result)


@app.route('/api/results', methods=['GET'])
def get_results():
    global ga_instance
    if ga_instance is None:
        return jsonify({"error": "No genetic algorithm running"}), 400

    results = ga_instance.get_all_best()
    return jsonify(results)


@app.route('/api/save', methods=['POST'])
def save_solution():
    global ga_instance
    if ga_instance is None:
        return jsonify({"error": "No genetic algorithm running"}), 400

    try:
        with open('best_solutions.pkl', 'wb') as f:
            pickle.dump(ga_instance.best_per_gen, f)
        return jsonify({"message": "Solutions saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/load', methods=['GET'])
def load_solution():
    global ga_instance
    try:
        with open('best_solutions.pkl', 'rb') as f:
            loaded = pickle.load(f)

        if not ga_instance:
            # Create a default instance if none exists
            board_size = loaded[0].size if loaded else 8
            num_knights = loaded[0].knights if loaded else 14
            ga_instance = GeneticAlgorithm(board_size, num_knights, 30, 50)

        ga_instance.best_per_gen = loaded
        ga_instance.current_generation = len(loaded)

        return jsonify({
            "message": "Solutions loaded successfully",
            "results": ga_instance.get_all_best()
        })
    except FileNotFoundError:
        return jsonify({"error": "No saved solution file found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)