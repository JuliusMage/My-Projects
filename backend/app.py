from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "PatentScope Navigator Backend"

@app.route('/api/search')
def search():
    # This will be replaced with actual patent search logic
    mock_patents = [
        {"id": "WO2023000001", "title": "Mock Patent 1", "abstract": "This is a mock patent abstract."},
        {"id": "WO2023000002", "title": "Mock Patent 2", "abstract": "This is another mock patent abstract."},
    ]
    return jsonify(mock_patents)

if __name__ == '__main__':
    app.run(debug=True)
