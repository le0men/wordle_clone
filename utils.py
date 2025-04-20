import pandas as pd
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

guesses_bank = pd.read_csv(os.path.join(base_dir, "data/valid_guesses.csv"))
valid_bank = pd.read_csv(os.path.join(base_dir, "data/valid_solutions.csv"))


class Wordle:
    def __init__(self):
        self.curr_word = valid_bank.sample().values[0][0]

    def check_works(self, guess):
        guess = guess.lower()
        if (
            guess not in guesses_bank["word"].values
            and guess not in valid_bank["word"].values
        ):
            return False
        return True

    def guess(self, guess):
        guess = guess.lower()

        char_lst = list(self.curr_word)
        status = []
        for i in range(5):
            # correct selection
            if guess[i] == self.curr_word[i]:
                status.append(2)
                char_lst.remove(self.curr_word[i])

            # in char list
            elif guess[i] in char_lst:
                status.append(1)
                char_lst.remove(self.curr_word[i])

            else:
                status.append(0)

        return {"status": status}
