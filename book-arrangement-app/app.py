from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)


def permutation_dp(n, r):
    
    dp = np.zeros((n + 1, r + 1), dtype=int)


    for i in range(n + 1):
        dp[i][0] = 1


    for i in range(1, n + 1):
        for j in range(1, min(r + 1, i + 1)):
            if j == i:
                dp[i][j] = i * dp[i - 1][j - 1]
            else:
                dp[i][j] = j * dp[i - 1][j - 1] + dp[i - 1][j]


    dp_list = dp.tolist()

    return dp_list, int(dp[n][r])

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    n = int(data['n'])
    r = int(data['r'])

    if r > n:
        return jsonify({
            'error': 'Group size cannot exceed total books'
        }), 400

    dp_table, result = permutation_dp(n, r)

    return jsonify({
        'result': result,
        'dp_table': dp_table,
        'n': n,
        'r': r
    })

if __name__ == '__main__':
    app.run(debug=True)
