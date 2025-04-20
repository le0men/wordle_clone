import pandas as pd
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

guesses_bank = pd.read_csv(os.path.join(base_dir, "data/valid_guesses.csv"))
valid_bank = pd.read_csv(os.path.join(base_dir, "data/valid_solutions.csv"))


class Wordle:
    def __init__(self):
        self.curr_move = 0
        self.won = "active"

        self.board_coloring = [["absent" for _ in range(5)] for _ in range(6)]
        self.board_guesses = [["" for _ in range(5)] for _ in range(6)]
        self.curr_word = valid_bank.sample().values[0][0]

    def guess(self, guess):
        guess = guess.lower()
        if self.curr_move >= 6:
            return 400
        if (
            guess not in guesses_bank["word"].values
            and guess not in valid_bank["word"].values
        ):
            return 404

        char_lst = list(self.curr_word)
        for i in range(5):
            # correct selection
            if guess[i] == self.curr_word[i]:
                self.board_coloring[self.curr_move][i] = "correct"
                char_lst.remove(self.curr_word[i])

            # in char list
            elif guess[i] in char_lst:
                self.board_coloring[self.curr_move][i] = "present"
                char_lst.remove(self.curr_word[i])

            self.board_guesses[self.curr_move][i] = guess[i]

        self.curr_move += 1
        if guess == self.curr_word:
            self.won = "won"
        if self.curr_move == 6:
            self.won = "lost"
        return 200

    def return_board(self):
        return {
            "won": self.won,
            "color": self.board_coloring,
            "solution": self.curr_word,
            "guesses": self.board_guesses,
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
