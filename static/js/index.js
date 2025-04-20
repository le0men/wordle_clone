var height = 6; //number of guesses
var width = 5; //length of word

var row = 0; // guess row (0-5 i.e. 6)
var col = 0; //current letter of guess row (0-4 i.e 5)

var gameOver = false;

var word = "";

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



