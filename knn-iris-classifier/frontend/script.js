
let features = [];
let labels = [];
let labelNames = ["Setosa", "Versicolor", "Virginica"];
let featureNames = ["Sepal Length", "Sepal Width", "Petal Length", "Petal Width"];
let trainedModel = null;
let confidenceChart = null;
let hyperparameterChart = null;
let scatterChart = null;
let decisionChart = null;


const irisData = `5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
4.6,3.1,1.5,0.2,Iris-setosa
5.0,3.6,1.4,0.2,Iris-setosa
5.4,3.9,1.7,0.4,Iris-setosa
4.6,3.4,1.4,0.3,Iris-setosa
5.0,3.4,1.5,0.2,Iris-setosa
4.4,2.9,1.4,0.2,Iris-setosa
4.9,3.1,1.5,0.1,Iris-setosa
5.4,3.7,1.5,0.2,Iris-setosa
4.8,3.4,1.6,0.2,Iris-setosa
4.8,3.0,1.4,0.1,Iris-setosa
4.3,3.0,1.1,0.1,Iris-setosa
5.8,4.0,1.2,0.2,Iris-setosa
5.7,4.4,1.5,0.4,Iris-setosa
5.4,3.9,1.3,0.4,Iris-setosa
5.1,3.5,1.4,0.3,Iris-setosa
5.7,3.8,1.7,0.3,Iris-setosa
5.1,3.8,1.5,0.3,Iris-setosa
5.4,3.4,1.7,0.2,Iris-setosa
5.1,3.7,1.5,0.4,Iris-setosa
4.6,3.6,1.0,0.2,Iris-setosa
5.1,3.3,1.7,0.5,Iris-setosa
4.8,3.4,1.9,0.2,Iris-setosa
5.0,3.0,1.6,0.2,Iris-setosa
5.0,3.4,1.6,0.4,Iris-setosa
5.2,3.5,1.5,0.2,Iris-setosa
5.2,3.4,1.4,0.2,Iris-setosa
4.7,3.2,1.6,0.2,Iris-setosa
4.8,3.1,1.6,0.2,Iris-setosa
5.4,3.4,1.5,0.4,Iris-setosa
5.2,4.1,1.5,0.1,Iris-setosa
5.5,4.2,1.4,0.2,Iris-setosa
4.9,3.1,1.5,0.2,Iris-setosa
5.0,3.2,1.2,0.2,Iris-setosa
5.5,3.5,1.3,0.2,Iris-setosa
4.9,3.6,1.4,0.1,Iris-setosa
4.4,3.0,1.3,0.2,Iris-setosa
5.1,3.4,1.5,0.2,Iris-setosa
5.0,3.5,1.3,0.3,Iris-setosa
4.5,2.3,1.3,0.3,Iris-setosa
4.4,3.2,1.3,0.2,Iris-setosa
5.0,3.5,1.6,0.6,Iris-setosa
5.1,3.8,1.9,0.4,Iris-setosa
4.8,3.0,1.4,0.3,Iris-setosa
5.1,3.8,1.6,0.2,Iris-setosa
4.6,3.2,1.4,0.2,Iris-setosa
5.3,3.7,1.5,0.2,Iris-setosa
5.0,3.3,1.4,0.2,Iris-setosa
7.0,3.2,4.7,1.4,Iris-versicolor
6.4,3.2,4.5,1.5,Iris-versicolor
6.9,3.1,4.9,1.5,Iris-versicolor
5.5,2.3,4.0,1.3,Iris-versicolor
6.5,2.8,4.6,1.5,Iris-versicolor
5.7,2.8,4.5,1.3,Iris-versicolor
6.3,3.3,4.7,1.6,Iris-versicolor
4.9,2.4,3.3,1.0,Iris-versicolor
6.6,2.9,4.6,1.3,Iris-versicolor
5.2,2.7,3.9,1.4,Iris-versicolor
5.0,2.0,3.5,1.0,Iris-versicolor
5.9,3.0,4.2,1.5,Iris-versicolor
6.0,2.2,4.0,1.0,Iris-versicolor
6.1,2.9,4.7,1.4,Iris-versicolor
5.6,2.9,3.6,1.3,Iris-versicolor
6.7,3.1,4.4,1.4,Iris-versicolor
5.6,3.0,4.5,1.5,Iris-versicolor
5.8,2.7,4.1,1.0,Iris-versicolor
6.2,2.2,4.5,1.5,Iris-versicolor
5.6,2.5,3.9,1.1,Iris-versicolor
5.9,3.2,4.8,1.8,Iris-versicolor
6.1,2.8,4.0,1.3,Iris-versicolor
6.3,2.5,4.9,1.5,Iris-versicolor
6.1,2.8,4.7,1.2,Iris-versicolor
6.4,2.9,4.3,1.3,Iris-versicolor
6.6,3.0,4.4,1.4,Iris-versicolor
6.8,2.8,4.8,1.4,Iris-versicolor
6.7,3.0,5.0,1.7,Iris-versicolor
6.0,2.9,4.5,1.5,Iris-versicolor
5.7,2.6,3.5,1.0,Iris-versicolor
5.5,2.4,3.8,1.1,Iris-versicolor
5.5,2.4,3.7,1.0,Iris-versicolor
5.8,2.7,3.9,1.2,Iris-versicolor
6.0,2.7,5.1,1.6,Iris-versicolor
5.4,3.0,4.5,1.5,Iris-versicolor
6.0,3.4,4.5,1.6,Iris-versicolor
6.7,3.1,4.7,1.5,Iris-versicolor
6.3,2.3,4.4,1.3,Iris-versicolor
5.6,3.0,4.1,1.3,Iris-versicolor
5.5,2.5,4.0,1.3,Iris-versicolor
5.5,2.6,4.4,1.2,Iris-versicolor
6.1,3.0,4.6,1.4,Iris-versicolor
5.8,2.6,4.0,1.2,Iris-versicolor
5.0,2.3,3.3,1.0,Iris-versicolor
5.6,2.7,4.2,1.3,Iris-versicolor
5.7,3.0,4.2,1.2,Iris-versicolor
5.7,2.9,4.2,1.3,Iris-versicolor
6.2,2.9,4.3,1.3,Iris-versicolor
5.1,2.5,3.0,1.1,Iris-versicolor
5.7,2.8,4.1,1.3,Iris-versicolor
6.3,3.3,6.0,2.5,Iris-virginica
5.8,2.7,5.1,1.9,Iris-virginica
7.1,3.0,5.9,2.1,Iris-virginica
6.3,2.9,5.6,1.8,Iris-virginica
6.5,3.0,5.8,2.2,Iris-virginica
7.6,3.0,6.6,2.1,Iris-virginica
4.9,2.5,4.5,1.7,Iris-virginica
7.3,2.9,6.3,1.8,Iris-virginica
6.7,2.5,5.8,1.8,Iris-virginica
7.2,3.6,6.1,2.5,Iris-virginica
6.5,3.2,5.1,2.0,Iris-virginica
6.4,2.7,5.3,1.9,Iris-virginica
6.8,3.0,5.5,2.1,Iris-virginica
5.7,2.5,5.0,2.0,Iris-virginica
5.8,2.8,5.1,2.4,Iris-virginica
6.4,3.2,5.3,2.3,Iris-virginica
6.5,3.0,5.5,1.8,Iris-virginica
7.7,3.8,6.7,2.2,Iris-virginica
7.7,2.6,6.9,2.3,Iris-virginica
6.0,2.2,5.0,1.5,Iris-virginica
6.9,3.2,5.7,2.3,Iris-virginica
5.6,2.8,4.9,2.0,Iris-virginica
7.7,2.8,6.7,2.0,Iris-virginica
6.3,2.7,4.9,1.8,Iris-virginica
6.7,3.3,5.7,2.1,Iris-virginica
7.2,3.2,6.0,1.8,Iris-virginica
6.2,2.8,4.8,1.8,Iris-virginica
6.1,3.0,4.9,1.8,Iris-virginica
6.4,2.8,5.6,2.1,Iris-virginica
7.2,3.0,5.8,1.6,Iris-virginica
7.4,2.8,6.1,1.9,Iris-virginica
7.9,3.8,6.4,2.0,Iris-virginica
6.4,2.8,5.6,2.2,Iris-virginica
6.3,2.8,5.1,1.5,Iris-virginica
6.1,2.6,5.6,1.4,Iris-virginica
7.7,3.0,6.1,2.3,Iris-virginica
6.3,3.4,5.6,2.4,Iris-virginica
6.4,3.1,5.5,1.8,Iris-virginica
6.0,3.0,4.8,1.8,Iris-virginica
6.9,3.1,5.4,2.1,Iris-virginica
6.7,3.1,5.6,2.4,Iris-virginica
6.9,3.1,5.1,2.3,Iris-virginica
5.8,2.7,5.1,1.9,Iris-virginica
6.8,3.2,5.9,2.3,Iris-virginica
6.7,3.3,5.7,2.5,Iris-virginica
6.7,3.0,5.2,2.3,Iris-virginica
6.3,2.5,5.0,1.9,Iris-virginica
6.5,3.0,5.2,2.0,Iris-virginica
6.2,3.4,5.4,2.3,Iris-virginica
5.9,3.0,5.1,1.8,Iris-virginica`;


function parseData() {
    Papa.parse(irisData, {
        delimiter: ",",
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            processData(results.data);
            // After loading data, automatically train the model with default parameters
            document.getElementById('train-btn').click();
        }
    });
}


function processData(data) {
    features = [];
    labels = [];

    data.forEach(row => {

        const rowFeatures = [row[0], row[1], row[2], row[3]];
        features.push(rowFeatures);


        const label = row[4];
        if (label === "Iris-setosa") {
            labels.push(0);
        } else if (label === "Iris-versicolor") {
            labels.push(1);
        } else {
            labels.push(2);
        }
    });


    updateScatterPlot();
}


function euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
}

// k-NN algorithm
function knn(sample, k) {
    // Calculate distances
    const distances = features.map((feature, i) => {
        return {
            distance: euclideanDistance(feature, sample),
            label: labels[i]
        };
    });


    distances.sort((a, b) => a.distance - b.distance);

    const kNearest = distances.slice(0, k);


    const votes = [0, 0, 0]; // Setosa, Versicolor, Virginica
    kNearest.forEach(neighbor => {
        votes[neighbor.label]++;
    });


    const confidence = votes.map(vote => vote / k);


    let maxVote = 0;
    let predictedClass = 0;
    votes.forEach((vote, i) => {
        if (vote > maxVote) {
            maxVote = vote;
            predictedClass = i;
        }
    });

    return {
        predictedClass,
        confidence
    };
}


function trainTestSplit(testSize = 0.3) {
    const indices = Array.from({ length: features.length }, (_, i) => i);
    const shuffled = _.shuffle(indices);

    const testCount = Math.floor(features.length * testSize);
    const testIndices = shuffled.slice(0, testCount);
    const trainIndices = shuffled.slice(testCount);

    const X_train = trainIndices.map(i => features[i]);
    const y_train = trainIndices.map(i => labels[i]);
    const X_test = testIndices.map(i => features[i]);
    const y_test = testIndices.map(i => labels[i]);

    return { X_train, y_train, X_test, y_test };
}


function trainAndEvaluate(k, testSize = 0.3) {
    const { X_train, y_train, X_test, y_test } = trainTestSplit(testSize);

    // Make predictions
    const predictions = X_test.map(sample => knn(sample, k).predictedClass);

    // Calculate confusion matrix
    const confusionMatrix = Array(3).fill().map(() => Array(3).fill(0));
    predictions.forEach((pred, i) => {
        confusionMatrix[y_test[i]][pred]++;
    });

    // Calculate metrics
    const accuracy = predictions.filter((pred, i) => pred === y_test[i]).length / predictions.length;


    const classMetrics = [];
    for (let c = 0; c < 3; c++) {
        const tp = confusionMatrix[c][c];
        const fp = confusionMatrix.reduce((sum, row, i) => sum + (i !== c ? row[c] : 0), 0);
        const fn = confusionMatrix[c].reduce((sum, val, i) => sum + (i !== c ? val : 0), 0);
        const tn = confusionMatrix.reduce((sum, row, i) =>
            sum + row.reduce((rowSum, val, j) => rowSum + (i !== c && j !== c ? val : 0), 0), 0);

        const precision = tp / (tp + fp) || 0;
        const recall = tp / (tp + fn) || 0;
        const f1 = 2 * (precision * recall) / (precision + recall) || 0;
        const support = y_test.filter(label => label === c).length;

        classMetrics.push({
            precision,
            recall,
            f1,
            support
        });
    }


    const avgPrecision = classMetrics.reduce((sum, metric) => sum + metric.precision, 0) / 3;
    const avgRecall = classMetrics.reduce((sum, metric) => sum + metric.recall, 0) / 3;
    const avgF1 = classMetrics.reduce((sum, metric) => sum + metric.f1, 0) / 3;

    return {
        confusionMatrix,
        accuracy,
        precision: avgPrecision,
        recall: avgRecall,
        f1: avgF1,
        classMetrics
    };
}


function findOptimalK() {
    const kValues = Array.from({ length: 20 }, (_, i) => i + 1);
    const results = [];
    const folds = 5;

    kValues.forEach(k => {
        let avgAccuracy = 0;
        let avgPrecision = 0;
        let avgRecall = 0;
        let avgF1 = 0;

        for (let fold = 0; fold < folds; fold++) {
            const { accuracy, precision, recall, f1 } = trainAndEvaluate(k, 0.3);
            avgAccuracy += accuracy;
            avgPrecision += precision;
            avgRecall += recall;
            avgF1 += f1;
        }

        avgAccuracy /= folds;
        avgPrecision /= folds;
        avgRecall /= folds;
        avgF1 /= folds;

        results.push({
            k,
            accuracy: avgAccuracy,
            precision: avgPrecision,
            recall: avgRecall,
            f1: avgF1
        });
    });

    // Sort by accuracy to find the best k
    results.sort((a, b) => b.accuracy - a.accuracy);

    return {
        allResults: results,
        bestK: results[0].k,
        bestAccuracy: results[0].accuracy,
        bestMetrics: results[0]
    };
}

function updatePredictionResult(result) {
    const predictionResult = document.getElementById('prediction-result');
    const speciesBadge = predictionResult.querySelector('.species-badge');
    const resultText = predictionResult.querySelector('.result');
    const confidenceChartContainer = document.getElementById('confidence-chart');

    speciesBadge.className = 'species-badge';
    speciesBadge.classList.add(`species-${labelNames[result.predictedClass].toLowerCase()}`);
    speciesBadge.textContent = labelNames[result.predictedClass];


    resultText.textContent = `Predicted with ${(result.confidence[result.predictedClass] * 100).toFixed(2)}% confidence`;
    resultText.className = 'result success';


    confidenceChartContainer.style.display = 'block';


    if (confidenceChart) {
        confidenceChart.destroy();
    }

    const ctx = document.getElementById('confidenceCanvas').getContext('2d');
    confidenceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelNames,
            datasets: [{
                label: 'Confidence',
                data: result.confidence.map(c => c * 100),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Confidence (%)'
                    }
                }
            }
        }
    });
}


function updateConfusionMatrix(matrix) {
    const cmEl = document.getElementById('confusionMatrix');
    cmEl.innerHTML = '';

    const rowTotals  = matrix.map(r => r.reduce((s,v) => s+v, 0));
    const colTotals  = matrix[0].map((_,i) => matrix.reduce((s,r) => s + r[i], 0));
    const grandTotal = rowTotals.reduce((s,v) => s+v, 0);


    cmEl.appendChild(Object.assign(document.createElement('div'), {
        className: 'matrix-cell matrix-header',
        textContent: '' 
    }));
   
    labelNames.forEach(name => {
        cmEl.appendChild(Object.assign(document.createElement('div'), {
            className: 'matrix-cell matrix-header',
            textContent: name
        }));
    });
   
    cmEl.appendChild(Object.assign(document.createElement('div'), {
        className: 'matrix-cell matrix-header',
        textContent: 'Total'
    }));

    // ---- DATA ROWS ----
    matrix.forEach((row, i) => {
       
        cmEl.appendChild(Object.assign(document.createElement('div'), {
            className: 'matrix-cell matrix-header',
            textContent: labelNames[i]
        }));
       
        row.forEach((count, j) => {
            cmEl.appendChild(Object.assign(document.createElement('div'), {
                className: count === row[j] && j === i
                    ? 'matrix-cell matrix-true'
                    : 'matrix-cell matrix-false',
                textContent: count
            }));
        });
       
        cmEl.appendChild(Object.assign(document.createElement('div'), {
            className: 'matrix-cell matrix-header',
            textContent: rowTotals[i]
        }));
    });

  
    cmEl.appendChild(Object.assign(document.createElement('div'), {
        className: 'matrix-cell matrix-header',
        textContent: 'Total'
    }));

    colTotals.forEach(total => {
        cmEl.appendChild(Object.assign(document.createElement('div'), {
            className: 'matrix-cell matrix-header',
            textContent: total
        }));
    });
    
    cmEl.appendChild(Object.assign(document.createElement('div'), {
        className: 'matrix-cell matrix-header',
        textContent: grandTotal
    }));
}



function updateMetrics(metrics) {
    document.getElementById('accuracy').textContent = metrics.accuracy.toFixed(2);
    document.getElementById('precision').textContent = metrics.precision.toFixed(2);
    document.getElementById('recall').textContent = metrics.recall.toFixed(2);
    document.getElementById('f1').textContent = metrics.f1.toFixed(2);


    const metricsContainer = document.querySelector('.metrics-container');


    const existingReport = document.getElementById('detailed-classification-report');
    if (existingReport) {
        existingReport.remove();
    }

    const reportDiv = document.createElement('div');
    reportDiv.id = 'detailed-classification-report';
    reportDiv.style.gridColumn = '1 / -1';
    reportDiv.style.marginTop = '1rem';


    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.textAlign = 'center';


    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = 'var(--primary-light)';
    headerRow.style.color = 'white';

    const headers = ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.padding = '0.5rem';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);


    const tbody = document.createElement('tbody');
    metrics.classMetrics.forEach((metric, i) => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #ddd';

        if (i % 2 === 0) {
            row.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
        }

        const classCell = document.createElement('td');
        classCell.textContent = labelNames[i];
        classCell.style.padding = '0.5rem';
        row.appendChild(classCell);

        const precCell = document.createElement('td');
        precCell.textContent = metric.precision.toFixed(2);
        row.appendChild(precCell);

        const recallCell = document.createElement('td');
        recallCell.textContent = metric.recall.toFixed(2);
        row.appendChild(recallCell);

        const f1Cell = document.createElement('td');
        f1Cell.textContent = metric.f1.toFixed(2);
        row.appendChild(f1Cell);

        const supportCell = document.createElement('td');
        supportCell.textContent = metric.support;
        row.appendChild(supportCell);

        tbody.appendChild(row);
    });


    const avgRow = document.createElement('tr');
    avgRow.style.backgroundColor = 'rgba(106, 17, 203, 0.1)';
    avgRow.style.fontWeight = 'bold';

    const avgLabelCell = document.createElement('td');
    avgLabelCell.textContent = 'Macro Avg';
    avgLabelCell.style.padding = '0.5rem';
    avgRow.appendChild(avgLabelCell);

    const avgPrecCell = document.createElement('td');
    avgPrecCell.textContent = metrics.precision.toFixed(2);
    avgRow.appendChild(avgPrecCell);

    const avgRecallCell = document.createElement('td');
    avgRecallCell.textContent = metrics.recall.toFixed(2);
    avgRow.appendChild(avgRecallCell);

    const avgF1Cell = document.createElement('td');
    avgF1Cell.textContent = metrics.f1.toFixed(2);
    avgRow.appendChild(avgF1Cell);

    const avgSupportCell = document.createElement('td');
    avgSupportCell.textContent = metrics.classMetrics.reduce((sum, m) => sum + m.support, 0);
    avgRow.appendChild(avgSupportCell);

    tbody.appendChild(avgRow);
    table.appendChild(tbody);

    reportDiv.appendChild(table);
    metricsContainer.appendChild(reportDiv);
}


function updateHyperparameterChart(results) {
    const ctx = document.getElementById('hyperparameterCanvas').getContext('2d');

    if (hyperparameterChart) {
        hyperparameterChart.destroy();
    }

    hyperparameterChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: results.map(r => r.k),
            datasets: [
                {
                    label: 'Accuracy',
                    data: results.map(r => r.accuracy),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Precision',
                    data: results.map(r => r.precision),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Recall',
                    data: results.map(r => r.recall),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'F1-Score',
                    data: results.map(r => r.f1),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'k Value'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(3)}`;
                        }
                    }
                }
            }
        }
    });


    const bestResult = results.reduce((best, current) =>
        current.accuracy > best.accuracy ? current : best, results[0]);

    document.getElementById('best-k-result').innerHTML = `
        <strong>Best k:</strong> ${bestResult.k}<br>
        <strong>Accuracy:</strong> ${(bestResult.accuracy * 100).toFixed(2)}%<br>
        <strong>Precision:</strong> ${(bestResult.precision * 100).toFixed(2)}%<br>
        <strong>Recall:</strong> ${(bestResult.recall * 100).toFixed(2)}%<br>
        <strong>F1-Score:</strong> ${(bestResult.f1 * 100).toFixed(2)}%<br>
        <small>Note: A very high k value may perform poorly because it includes points that are too far away,
        potentially introducing noise from irrelevant data points.</small>
    `;
}

// Update scatter plot
function updateScatterPlot() {
    const xFeatureIdx = parseInt(document.getElementById('x-feature').value);
    const yFeatureIdx = parseInt(document.getElementById('y-feature').value);

    const ctx = document.getElementById('scatterCanvas').getContext('2d');

    if (scatterChart) {
        scatterChart.destroy();
    }

    // Prepare datasets for each class
    const datasets = [];
    for (let c = 0; c < 3; c++) {
        const data = [];
        features.forEach((feature, i) => {
            if (labels[i] === c) {
                data.push({
                    x: feature[xFeatureIdx],
                    y: feature[yFeatureIdx]
                });
            }
        });

        datasets.push({
            label: labelNames[c],
            data: data,
            backgroundColor: c === 0 ? 'rgba(255, 99, 132, 0.7)' :
                            c === 1 ? 'rgba(54, 162, 235, 0.7)' :
                                      'rgba(153, 102, 255, 0.7)',
            borderColor: c === 0 ? 'rgba(255, 99, 132, 1)' :
                        c === 1 ? 'rgba(54, 162, 235, 1)' :
                                  'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            pointRadius: 5
        });
    }

    scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: featureNames[xFeatureIdx]
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: featureNames[yFeatureIdx]
                    }
                }
            }
        }
    });
}


function plotDecisionBoundaries() {
    const xFeatureIdx = parseInt(document.getElementById('x-feature').value);
    const yFeatureIdx = parseInt(document.getElementById('y-feature').value);

    // Get min/max for the grid
    const xValues = features.map(f => f[xFeatureIdx]);
    const yValues = features.map(f => f[yFeatureIdx]);

    const xMin = Math.min(...xValues) - 0.5;
    const xMax = Math.max(...xValues) + 0.5;
    const yMin = Math.min(...yValues) - 0.5;
    const yMax = Math.max(...yValues) + 0.5;

    // Create mesh grid
    const step = 0.1;
    const xSteps = Math.ceil((xMax - xMin) / step);
    const ySteps = Math.ceil((yMax - yMin) / step);

    const decisionPoints = [];


    for (let i = 0; i <= xSteps; i++) {
        for (let j = 0; j <= ySteps; j++) {
            const x = xMin + i * step;
            const y = yMin + j * step;


            const sample = Array(4).fill(0);


            for (let f = 0; f < 4; f++) {
                if (f !== xFeatureIdx && f !== yFeatureIdx) {
                    const values = features.map(feature => feature[f]);
                    values.sort((a, b) => a - b);
                    const mid = Math.floor(values.length / 2);
                    sample[f] = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
                }
            }

           
            sample[xFeatureIdx] = x;
            sample[yFeatureIdx] = y;


            const k = parseInt(document.getElementById('k-value').value);
            const result = knn(sample, k);

            decisionPoints.push({
                x: x,
                y: y,
                class: result.predictedClass
            });
        }
    }


    const ctx = document.getElementById('decisionCanvas').getContext('2d');
    document.getElementById('decision-boundary-container').style.display = 'block';

    if (decisionChart) {
        decisionChart.destroy();
    }


    const backgroundDatasets = [];
    for (let c = 0; c < 3; c++) {
        backgroundDatasets.push({
            label: `${labelNames[c]} Region`,
            data: decisionPoints.filter(p => p.class === c).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: c === 0 ? 'rgba(255, 99, 132, 0.2)' :
                            c === 1 ? 'rgba(54, 162, 235, 0.2)' :
                                      'rgba(153, 102, 255, 0.2)',
            pointRadius: 3,
            borderWidth: 0
        });
    }


    const pointDatasets = [];
    for (let c = 0; c < 3; c++) {
        const data = [];
        features.forEach((feature, i) => {
            if (labels[i] === c) {
                data.push({
                    x: feature[xFeatureIdx],
                    y: feature[yFeatureIdx]
                });
            }
        });

        pointDatasets.push({
            label: labelNames[c],
            data: data,
            backgroundColor: c === 0 ? 'rgba(255, 99, 132, 1)' :
                            c === 1 ? 'rgba(54, 162, 235, 1)' :
                                      'rgba(153, 102, 255, 1)',
            pointRadius: 5,
            borderWidth: 1,
            borderColor: 'white'
        });
    }

    decisionChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [...backgroundDatasets, ...pointDatasets]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: featureNames[xFeatureIdx]
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: featureNames[yFeatureIdx]
                    }
                }
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // Parse data
    parseData();


    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');


            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');


            if (tabId === 'visualization') {
                updateScatterPlot();
            }
        });
    });


    document.getElementById('prediction-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const sepalLength = parseFloat(document.getElementById('sepal-length').value);
        const sepalWidth = parseFloat(document.getElementById('sepal-width').value);
        const petalLength = parseFloat(document.getElementById('petal-length').value);
        const petalWidth = parseFloat(document.getElementById('petal-width').value);
        const k = parseInt(document.getElementById('k-value').value);

        const sample = [sepalLength, sepalWidth, petalLength, petalWidth];
        const result = knn(sample, k);

        updatePredictionResult(result);
    });

    document.getElementById('train-btn').addEventListener('click', function() {
        const k = parseInt(document.getElementById('k-neighbors').value);
        const testSize = parseInt(document.getElementById('train-test-split').value) / 100;

        document.getElementById('loading').style.display = 'flex';
        document.getElementById('training-results').style.display = 'none';
        document.getElementById('hyperparameter-card').style.display = 'none';


        setTimeout(() => {
            try {
                // Train and evaluate
                const metrics = trainAndEvaluate(k, testSize);
                updateConfusionMatrix(metrics.confusionMatrix);
                updateMetrics(metrics);

                // Find optimal k
                const optimalK = findOptimalK();
                updateHyperparameterChart(optimalK.allResults);

                // Hide loading and show results
                document.getElementById('loading').style.display = 'none';
                document.getElementById('training-results').style.display = 'block';
                document.getElementById('hyperparameter-card').style.display = 'block';
            } catch (error) {
                console.error("Error during training:", error);
                document.getElementById('loading').style.display = 'none';
                alert("An error occurred during training. Please try again.");
            }
        }, 100);
    });


    document.getElementById('x-feature').addEventListener('change', updateScatterPlot);
    document.getElementById('y-feature').addEventListener('change', updateScatterPlot);


    document.getElementById('plot-decision-btn').addEventListener('click', plotDecisionBoundaries);


    document.getElementById('train-test-split').addEventListener('input', function() {
        this.nextElementSibling.textContent = `${this.value}%`;
    });

    document.getElementById('k-neighbors').addEventListener('input', function() {
        this.nextElementSibling.textContent = this.value;
    });


    document.getElementById('prediction-form').dispatchEvent(new Event('submit'));
});
