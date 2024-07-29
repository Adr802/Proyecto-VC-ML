from flask import Flask, jsonify, request
from pypmml import Model
from flask_cors import CORS
from collections import Counter

app = Flask(__name__)

CORS(app)
rf_model = None
svm_model = None
ann_model = None

@app.route("/")
def root():
    return loadModels()

@app.route("/predict", methods=['POST'])
def predictMove():
    loadModels()
    move = request.get_json()
    try:
        rf_predictions = rf_model.predict(move)
        rf_predictions_list = list(rf_predictions)  
        svm_predictions = svm_model.predict(move)
        svm_predictions_list = list(svm_predictions)  
        ann_predictions = ann_model.predict(move)
        ann_predictions_list = list(ann_predictions)  
        
        all_predictions = [rf_predictions_list[0], svm_predictions_list[0], ann_predictions_list[0]]
        prediction_counts = Counter(all_predictions)
        majority_prediction = prediction_counts.most_common(1)[0][0]

        return jsonify(majority_prediction)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def loadModels():
    global rf_model, svm_model, ann_model  
    msg = []
    try:
        rf_model = Model.load('models/rf_model.pmml')
        msg.append("Model Random Forest loaded successfully!")
    except Exception as e:
        return f"Error loading Random Forest model: {e}"
    
    try:
        svm_model = Model.load('models/svm_model.pmml')
        msg.append("Model SVM loaded successfully!")
    except Exception as e:
        return f"Error loading SVM model: {e}"
    
    try:
        ann_model = Model.load('models/ann_model.pmml')
        msg.append("Model ANN loaded successfully!")
    except Exception as e:
        return f"Error loading ANN model: {e}"
    
    return "\n".join(msg)

if __name__ == '__main__':
    app.run(debug=True)
