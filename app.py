from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

current_player = None
player_mark = None
bot_mark = None
game_board = ['', '', '', '', '', '', '', '', '']
game_active = False

def start_game():
    global current_player, player_mark, bot_mark, game_active, game_board
    player_choice = random.choice(['X', 'O'])
    player_mark = player_choice
    bot_mark = 'X' if player_mark == 'O' else 'O'
    current_player = player_mark
    game_active = True
    game_board = ['', '', '', '', '', '', '', '', '']

@app.route('/')
def index():
    start_game()
    return render_template('index.html', player_mark=player_mark, bot_mark=bot_mark)

@app.route('/make_move', methods=['POST'])
def make_move():
    global current_player, game_active, game_board
    index = int(request.form['index'])
    if game_board[index] == '' and game_active:
        game_board[index] = current_player
        result = check_winner()
        toggle_player()
        if current_player == bot_mark and game_active:
            bot_move()
    return jsonify(result=result, board=game_board)

def bot_move():
    global game_active, game_board
    empty_cells = find_empty_cells()

    for index in empty_cells:
        temp_board = game_board.copy()
        temp_board[index] = bot_mark
        if is_winner(temp_board, bot_mark):
            make_bot_move(index)
            return

    for index in empty_cells:
        temp_board = game_board.copy()
        temp_board[index] = player_mark
        if is_winner(temp_board, player_mark):
            make_bot_move(index)
            return

    if 4 in empty_cells:
        make_bot_move(4)
        return

    random_index = random.choice(empty_cells)
    make_bot_move(random_index)

def make_bot_move(index):
    global current_player, game_active, game_board
    game_board[index] = bot_mark
    result = check_winner()
    toggle_player()
    return jsonify(result=result, board=game_board)

def toggle_player():
    global current_player
    current_player = 'O' if current_player == 'X' else 'X'

def check_winner():
    winning_combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    for combo in winning_combinations:
        a, b, c = combo
        if game_board[a] and game_board[a] == game_board[b] and game_board[a] == game_board[c]:
            return f"Player {current_player} wins!"
    if '' not in game_board:
        return "It's a draw!"
    return None

def find_empty_cells():
    return [index for index, cell in enumerate(game_board) if cell == '']

if __name__ == '__main__':
    app.run(debug=True)
