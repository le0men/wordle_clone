var height = 6; //number of guesses
var width = 5; //length of word

var row = 0; // guess row (0-5 i.e. 6)
var col = 0; //current letter of guess row (0-4 i.e 5)

var gameOver = false;
var word = "";

var successText = {
    0: "Genius!",
    1: "Magnificent!",
    3: "Impressive!",
    4: "Splendid",
    5: "Great",
    6: "Phew"
}

window.onload = async () => {
    await init();
    makeBoard();
}

const init = async () => {
    try {
        let response = await fetch('/state');
        let wordObject = await response.json();
        word = wordObject['solution'];
        console.log(word);


    } catch (error) {
        console.error(error);
        return;
    }

}


const makeBoard = () => {
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);

        }

    }

    // make the keyboard 
    let keyboardArray = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ]

    for (let i = 0; i < keyboardArray.length; i++) {
        let currRow = keyboardArray[i];
        let keyboardRow = document.createElement("div");

        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("span");

            let key = currRow[j]
            keyTile.innerText = key;
            if (key == "ENTER") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "ENTER") {
                keyTile.classList.add("enter-key");
                keyTile.classList.add("key-button");
            } else {
                keyTile.classList.add("key-button");
            }
            keyboardRow.appendChild(keyTile);

        }

        document.body.appendChild(keyboardRow);

    }

}

function animatePop(tile) {
    tile.classList.remove('animation-pop'); // reset if already animating
    void tile.offsetWidth; // force reflow
    tile.classList.add('animation-pop');
}

document.addEventListener('keyup', (e) => {
    processInput(e);
})

function processKey() {
    let e = { "code": this.id };
    processInput(e);
}

async function processInput(e) {
    if (gameOver) return;

    // alert(e.code); debugging


    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + "-" + col.toString());
            if (currTile.innerText == "") {
                animatePop(currTile)
                currTile.innerText = e.code[3];
                col += 1;

            }
        }
    }

    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currTile = document.getElementById(row.toString() + "-" + col.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        if (col == width) {
            let check = await checkWord();
            if (check) {
                updateWord();
            } else {
                openPopup("Invalid Input: Word not Found");
            }
        } else {
            openPopup("Invalid Input: Enter 5 Letters");;
        }
    }
}

async function checkWord() {
    let wordArray = [];
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        wordArray.push(letter);
    }

    let data = { guess: wordArray.join('') };

    try {
        let response = await fetch('/check/', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        let result = await response.json();
        console.log(result);

        let check = result['works'];

        return check;

    } catch (error) {
        console.error("Error encountered: ", error);
        return;
    }

}


async function updateWord() {
    // get status array from backend
    let wordArray = [];
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        wordArray.push(letter);
    }

    let data = { guess: wordArray.join('') };
    let array = null

    try {
        let response = await fetch('/guess/', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        let result = await response.json();
        console.log(result);

        array = result['status'];

    } catch (error) {
        console.error("Error encountered: ", error);
    }

    let correct = 0;

    //check only correct ones
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        //stagger animation flip
        setTimeout(() => {
            // if letter is correct as given by the passed array
            if (array[c] === 2) {
                currTile.classList.remove('animation-pop');
                currTile.classList.add("correct", "animation-flip");

                //Also light up the keyboard
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.remove("present"); // in case it was present and we found it correct later.
                keyTile.classList.add("correct");
                correct += 1;
            }

            if (correct == width) {
                gameOver = true;
                openPopup(successText[row])
            }

        }, c * 300) // 300ms delay

    }

    // loop again for present/absent
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;

        setTimeout(() => {
            if (!currTile.classList.contains("correct")) { // so present css doesnt override an already marked tile

                // if the letter is present but wrong position
                if (array[c] === 1) {
                    currTile.classList.remove('animation-pop');
                    currTile.classList.add("present", "animation-flip");
                    let keyTile = document.getElementById("Key" + letter);

                    if (!keyTile.classList.contains("correct")) {
                        keyTile.classList.add("present");
                    }
                }

                else {
                    currTile.classList.remove('animation-pop');
                    currTile.classList.add("absent", "animation-flip");
                    let keyTile = document.getElementById("Key" + letter);
                    if (!keyTile.classList.contains("correct") && !keyTile.classList.contains("present")) {
                        keyTile.classList.add("absent");
                    }
                }
            }

        }, c * 300)
    }
    // move row to next row and reset col
    col = 0;
    row += 1;

    //check if game is lost
    if (!gameOver && row == height) {
        gameOver = true;
        openPopup("The word was: " + word.toUpperCase());
    }
}

// Open the popup
function openPopup(message) {
    document.getElementById('popupContent').innerHTML = `<p>${message}</p>`;
    document.getElementById('popupOverlay').classList.add('active');
}

// Close the popup
function closePopup() {
    document.getElementById('popupOverlay').classList.remove('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('popupClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            overlay.classList.remove('active');
        });
    }
});

