import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# Flask backend
from flask import Flask, jsonify
from flask_cors import CORS
import json
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)


def get_iris_data():
    # Load iris dataset
    iris = datasets.load_iris()
    X = iris.data[:, :2]  # We use only the first two features for visualization
    y = iris.target

    # We'll focus on two classes for clearer visualization (setosa and versicolor)
    X = X[y != 2]
    y = y[y != 2]

    # Scale features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    return X_train, X_test, y_train, y_test, iris.feature_names[:2]


def train_model(kernel_type):
    X_train, X_test, y_train, y_test, feature_names = get_iris_data()

    # Set different parameters based on kernel type
    if kernel_type == 'rbf':
        svm = SVC(kernel='rbf', gamma='scale', C=1.0)
    elif kernel_type == 'linear':
        svm = SVC(kernel='linear', C=1.0)
    elif kernel_type == 'poly':
        svm = SVC(kernel='poly', degree=3, C=1.0)
    else:
        return {"error": "Invalid kernel type"}

    # Train the model
    svm.fit(X_train, y_train)

    # Make predictions
    y_pred = svm.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Plot decision boundary
    result = plot_decision_boundary(svm, X_train, y_train, feature_names, kernel_type)
    result['accuracy'] = float(accuracy * 100)
    result['n_support_vectors'] = int(sum(svm.n_support_))

    return result


def plot_decision_boundary(svm, X, y, feature_names, kernel_type):
    plt.figure(figsize=(10, 8))

    # Create a mesh to plot in
    h = 0.02  # Step size in the mesh
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))

    # Plot the decision boundary
    Z = svm.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    plt.contourf(xx, yy, Z, alpha=0.3)

    # Plot also the training points
    plt.scatter(X[:, 0], X[:, 1], c=y, cmap=plt.cm.Paired, edgecolors='k')

    # Highlight the support vectors
    plt.scatter(X[svm.support_, 0], X[svm.support_, 1], s=100,
                linewidth=1, facecolors='none', edgecolors='k')

    # For linear kernel, we can plot the separation line and margin lines
    if kernel_type == 'linear':
        # Get the separating hyperplane
        w = svm.coef_[0]
        a = -w[0] / w[1]
        xx = np.linspace(x_min, x_max)

        # Decision boundary
        yy_decision = a * xx - (svm.intercept_[0]) / w[1]
        plt.plot(xx, yy_decision, 'k-', label='Decision Boundary')

        # Margin lines
        yy_down = yy_decision - 1 / w[1]
        yy_up = yy_decision + 1 / w[1]
        plt.plot(xx, yy_down, 'k--', label='Margin')
        plt.plot(xx, yy_up, 'k--')

    plt.xlim(xx.min(), xx.max())
    plt.ylim(yy.min(), yy.max())
    plt.xlabel(feature_names[0])
    plt.ylabel(feature_names[1])
    plt.title(f'SVM with {kernel_type.upper()} Kernel')
    plt.legend()

    # Save the plot to a base64 string
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    image_png = buffer.getvalue()
    buffer.close()

    plot_data = base64.b64encode(image_png).decode('utf-8')

    return {'plot': plot_data}


@app.route('/api/train/<kernel_type>', methods=['GET'])
def api_train(kernel_type):
    result = train_model(kernel_type)
    return jsonify(result)


@app.route('/api/all', methods=['GET'])
def api_all_kernels():
    kernels = ['rbf', 'linear', 'poly']
    results = {}

    for kernel in kernels:
        results[kernel] = train_model(kernel)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
