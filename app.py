from flask import Flask, request, render_template
import json
import utils
import os

app = Flask(__name__)


def success_response(body, code=200):
    return json.dumps(body), code


def failure_response(message, code=404):
    return json.dumps({"error": message}), code


wordle = utils.Wordle()


@app.route("/")  # base route
def index():
    return render_template("index.html")


# return selected wordle word
@app.route("/state/", methods=["GET"])
def get_init():
    return success_response({"solution": wordle.curr_word}, 200)


# check if a guess is valid
@app.route("/check/", methods=["POST"])
def guess():
    body = json.loads(request.data)
    guess = body["guess"]
    works = wordle.check_works(guess)

    return success_response({"works": works}, 200)


# return array representing guess state
@app.route("/guess/", methods=["POST"])
def guess():
    body = json.loads(request.data)
    guess = body["guess"]
    status = wordle.guess(guess)

    return success_response(status, 200)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
