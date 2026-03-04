import { LetsMoveOn } from "./lets-move-on.js";

export class LetsMoveOnUtils {
    static buildData() {
        LetsMoveOn.removeOrphans();
        return {
            sideButtons: this.#buildButtons(this.buildCharacterDataArray())
        };
    }

    static adjust() {}

    static buildCharacterDataArray() {
        const currentUser = game.user;
        const allUsers = game.users._source;
        let characterData = [];
        /* Iterate ovar all the users and build an object that will be used
           to color the cells and build out the side buttons of the UI.
        */  
        for (let index = 0; index < allUsers.length; index++) {
            const actorId = allUsers[index].character;
            let isSociable = false;
            if (currentUser.isGM && 
                (actorId != null && actorId != undefined)) {
                const request = this.#getRequest(allUsers[index]._id, actorId);
                if (request != undefined) {
                    isSociable = request.isSociable;
                }
                let name = game.actors.get(actorId)?.name;
                if (name != null && name != undefined) {
                    if (name.indexOf(" ") > 0) {
                        name = name.substr(0, name.indexOf(" "));
                    }
                    characterData.push(
                        {
                            actorId: allUsers[index].character,
                            actorName: name,
                            userId: allUsers[index]._id,
                            playerColor: allUsers[index].color,
                            isSociable: isSociable
                        }
                    )
                }
            }
        }
        return characterData;
    }

    static #buildButtons(characterDataArray) {
        let sideButtons = "";
        const numberofCharacters = characterDataArray.length;
        let rowPattern = "";
        for (let index = 0; index < numberofCharacters; index++) {
            rowPattern += " 2em 4px";
        }
        rowPattern += " 2em";
        if (numberofCharacters > 0) {
            for (let index = 0; index < numberofCharacters; index++) {
                const playerColor = characterDataArray[index].playerColor;
                sideButtons += `<div style="display: grid;grid-template-columns: 80% 20%;grid-template-rows: 2em">`;
                sideButtons += `<div><button style="background-color: ${playerColor};color: ${this.#contrastColor(playerColor, true)};`
                sideButtons += ` text-align: center;" data-action="${characterDataArray[index].actorId}">${characterDataArray[index].actorName}</button></div><div>`;
                sideButtons += `<input type="checkbox" id="${characterDataArray[index].actorId}"`;
                if (characterDataArray[index].isSociable) {
                    sideButtons += ` checked>`;
                }
                sideButtons += "</div></div></div>\n";
            }
        }
        return sideButtons;
    }

    static #getRequest(userId, actorId) {
        if (actorId == null || actorId == undefined) {
            return;
        }
        let request = LetsMoveOn.getByActorId(actorId);
        if (request == null || request == undefined) {
            return LetsMoveOn.create(userId, actorId);
        }
        return request;
    }

    static #contrastColor(colorHex, highContrast) {
        if (colorHex.indexOf('#') === 0) {
            colorHex = colorHex.slice(1);
        }
        // convert 3-digit colorHex to 6-digits.
        if (colorHex.length === 3) {
            colorHex = colorHex[0] + colorHex[0] + colorHex[1] + colorHex[1] + colorHex[2] + colorHex[2];
        }
        if (colorHex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        let red = parseInt(colorHex.slice(0, 2), 16);
        let green = parseInt(colorHex.slice(2, 4), 16);
        let blue = parseInt(colorHex.slice(4, 6), 16);
        if (highContrast) {
            return (red * 0.299 + green * 0.587 + blue * 0.114) > 186 ? '#000000' : '#FFFFFF';
        }
        // invert color components
        red = (255 - red).toString(16);
        green = (255 - green).toString(16);
        blue = (255 - blue).toString(16);
        // pad each with zeros and return
        return "#" + red.padStart(2, '0') + green.padStart(2, '0') + blue.padStart(2, '0');
    }
}