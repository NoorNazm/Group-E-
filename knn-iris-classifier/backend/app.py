from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.datasets import load_iris

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
CORS(app)


iris = load_iris()
X = iris.data
y = iris.target
feature_names = iris.feature_names
target_names = iris.target_names


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    sample = np.array([
        data['sepal_length'],
        data['sepal_width'],
        data['petal_length'],
        data['petal_width']
    ]).reshape(1, -1)

    k = data['k']


    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X, y)

    prediction = knn.predict(sample)[0]
    probabilities = knn.predict_proba(sample)[0]

    return jsonify({
        'predicted_class': int(prediction),
        'confidence': probabilities.tolist(),
        'class_names': target_names.tolist()
    })


@app.route('/train', methods=['POST'])
def train_model():
    data = request.get_json()
    test_size = data['test_size']
    k = data['k']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42)

    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)

    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(y_test, y_pred, output_dict=True)

    return jsonify({
        'confusion_matrix': cm,
        'accuracy': report['accuracy'],
        'metrics': {
            'macro_avg': report['macro avg'],
            'weighted_avg': report['weighted avg']
        },
        'class_reports': {
            'setosa': report['0'],
            'versicolor': report['1'],
            'virginica': report['2']
        }
    })


@app.route('/find_optimal_k', methods=['POST'])
def find_optimal_k():
    data = request.get_json()
    max_k = data['max_k']

    results = []
    for k in range(1, max_k + 1):
        knn = KNeighborsClassifier(n_neighbors=k)
        scores = cross_val_score(knn, X, y, cv=5)
        results.append({
            'k': k,
            'accuracy': np.mean(scores),
            'std_dev': np.std(scores)
        })

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)