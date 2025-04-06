from flask import Flask, request, jsonify
from flask_cors import CORS
from autocomplete import get_autocomplete_suggestions, calculate_lcs

app = Flask(__name__)
CORS(app)

with open('wordlist.txt', 'r') as f:
    word_list = [line.strip() for line in f]

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    prefix = request.args.get('prefix', '')
    suggestions = get_autocomplete_suggestions(word_list, prefix)
    return jsonify(suggestions)

@app.route('/lcs', methods=['GET'])
def lcs():
    word1 = request.args.get('word1', '')
    word2 = request.args.get('word2', '')
    table, arrows, lcs_length, lcs_string = calculate_lcs(word1, word2)
    return jsonify({
        'table': table,
        'arrows': arrows,
        'lcs_length': lcs_length,
        'lcs_string': lcs_string,
        'similarity': lcs_length / max(len(word1), len(word2))
    })

if __name__ == '__main__':
    app.run(debug=True)