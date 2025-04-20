from flask import Flask, request
import json
import utils

app = Flask(__name__)


def success_response(body, code=200):
    return json.dumps(body), code


def failure_response(message, code=404):
    return json.dumps({"error": message}), code


wordle = utils.Wordle()


@app.route("/api/guess/", methods=["POST"])
def guess():
    body = json.loads(request.data)
    guess = body["guess"]
    status = wordle.guess(guess)

    if status == 400:
        return failure_response("No Moves Remaining", 400)
    if status == 404:
        return failure_response("Word Not Found", 404)

    return success_response(wordle.return_board(), 200)
