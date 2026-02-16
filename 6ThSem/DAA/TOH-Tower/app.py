from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def tower_of_hanoi(n, source, target, auxiliary, moves):
    if n == 1:
        moves.append((source, target))
        return
    tower_of_hanoi(n-1, source, auxiliary, target, moves)
    moves.append((source, target))
    tower_of_hanoi(n-1, auxiliary, target, source, moves)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/solve', methods=['POST'])
def solve():
    n = int(request.json['disks'])
    moves = []
    tower_of_hanoi(n, "A", "C", "B", moves)
    return jsonify({"moves": moves})

if __name__ == '__main__':
    app.run(debug=True)
