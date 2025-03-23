###---- This is a test file to test the flask server ----###
###---- Not part of the project ----###

from flask import Flask, request, jsonify
import json

app = Flask(__name__)


def data_processing(data):
    return data.get("args")


@app.route("/get-name", methods=["POST"])
def get_name():
    data = request.get_json()
    agrs = data_processing(data)
    print(json.dumps(agrs, indent=4))

    response = {
        "customer_name": "Dead Man",
        "flag": "false",
    }

    return jsonify(response)


@app.route("/set-details", methods=["POST"])
def set_name():
    data = request.get_json()
    agrs = data_processing(data)
    print(json.dumps(agrs, indent=4))

    response = {
        "flag": "true",
    }

    return jsonify(response)


@app.route("/")
def index():
    return "Hello World"


if __name__ == "__main__":
    app.run(debug=True)
