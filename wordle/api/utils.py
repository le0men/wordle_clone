import pandas as pd
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

guesses_bank = pd.read_csv(os.path.join(base_dir, "data/valid_guesses.csv"))
valid_bank = pd.read_csv(os.path.join(base_dir, "data/valid_solutions.csv"))


class Wordle:
    def __init__(self):
        self.curr_move = 0
        self.past_words = []
        self.won = 0

        # -1 for black/grey, 0 for yellow, 1 for green
        self.board_coloring = [[-1 for _ in range(5)] for _ in range(6)]
        self.curr_word = valid_bank.sample().values[0][0]

    def guess(self, guess):
        if self.curr_move >= 6:
            return 400
        if (
            guess not in guesses_bank["word"].values
            and guess not in valid_bank["word"].values
        ):
            return 404

        self.past_words.append(guess)

        char_lst = list(self.curr_word)
        for i in range(5):
            if guess[i] == self.curr_word[i]:
                self.board_coloring[self.curr_move][i] = 1
                char_lst.remove(self.curr_word[i])
            elif guess[i] in char_lst:
                self.board_coloring[self.curr_move][i] = 0
                char_lst.remove(self.curr_word[i])

        self.curr_move += 1
        if guess == self.curr_word:
            self.won = 1
        return 200

    def return_board(self):
        return {
            "won": self.won,
            "0": self.board_coloring[0],
            "1": self.board_coloring[1],
            "2": self.board_coloring[2],
            "3": self.board_coloring[3],
            "4": self.board_coloring[4],
            "5": self.board_coloring[5],
        }


# testing code
# def main():
#     wordle = Wordle()
#     print(guesses_bank["word"].values)
#     print(wordle.curr_word)
#     print(wordle.guess("aahed"))
#     print(wordle.board_coloring)
#     print(wordle.guess("field"))
#     print(wordle.board_coloring)


# if __name__ == "__main__":
#     main()
