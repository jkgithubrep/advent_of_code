def initialize(rows):
    boards = []
    boards_marked = []
    # One extra row and col to store the number of marked numbers
    zeros = [0, 0, 0, 0, 0, 0]
    for index, row in enumerate(rows):
        rowFmt = list(map(int, row.split()))
        if not (index % 5):
            boards.append([rowFmt])
            boards_marked.append([zeros.copy(), zeros.copy()])
        else:
            boards[index // 5].append(rowFmt)
            boards_marked[index // 5].append(zeros.copy())
    return (boards, boards_marked)

def update(number, boards, boards_marked, winners):
    for board_index, board in enumerate(boards):
        if boards_marked[board_index][0][0]:
            continue
        for row_index, row in enumerate(board):
            for col_index, val in enumerate(row):
                if val == number:
                    boards_marked[board_index][row_index + 1][col_index + 1] = 1
                    boards_marked[board_index][0][col_index + 1] += 1
                    boards_marked[board_index][row_index + 1][0] += 1
                    if boards_marked[board_index][0][col_index + 1] == 5 or boards_marked[board_index][row_index + 1][0] == 5:
                        boards_marked[board_index][0][0] = number + 1
                        winners.append(board_index)

def simulate_game(random_order, boards, boards_marked):
    winners = []
    for number in random_order:
        update(number, boards, boards_marked, winners)
    last_winner_index = winners[-1]
    return (boards_marked[last_winner_index][0][0] - 1, last_winner_index)

def sum_all_unmarked(board, board_marked):
    result = 0
    for row_index, row in enumerate(board):
        for col_index, val in enumerate(row):
            if not board_marked[row_index + 1][col_index + 1]:
                result += val
    return result

with open('input.txt', 'r') as f:
    lines = f.read().splitlines()
    random_order = list(map(int, lines[0].split(',')))
    boards_rows = list(filter(None, lines[1:]))
    (boards, boards_marked) = initialize(boards_rows)
    (number, last_winner_index) = simulate_game(random_order, boards, boards_marked)
    sum = sum_all_unmarked(boards[last_winner_index], boards_marked[last_winner_index])
    print('result:', number * sum)
