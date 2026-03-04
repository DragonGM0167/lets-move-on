import { LetsMoveOn } from "./lets-move-on.js";
import { LetsMoveOnUI } from "./lets-move-on-ui.js";

// Create a badge under the "Token Control" section of the Foundry UI.
Hooks.on("getSceneControlButtons", (controls) => {
    const actorId = game.user.character?._id;
    let icon = "fas fa-comments";
    let social = false;
    let toggleIt = false;
    if (actorId != null && actorId != undefined) {
        const request = LetsMoveOn.getByActorId(actorId);
        if (request != null && request != undefined) {
            if (request.isSociable) {
                social = true;
            }
            toggleIt = true;
        }
    }

    if (parseFloat(game.version) < 13.0) {
        const tokens = controls.find((c) => c.name === "token");
        if (tokens) {
            tokens.tools.push({
                name: LetsMoveOn.ID,
                title: "Sociable",
                icon: icon,
                visible: true,
                onChange: () => LetsMoveOnUI.activate(),
                toggle: toggleIt,
                active: social,
                button: true
            });
        }
    }
    else {
        const tokenControls = controls["tokens"];
        if (!tokenControls) {
            return;
        }
        if (tokenControls.tools[LetsMoveOn.ID]) {
            return;
        }
        tokenControls.tools[LetsMoveOn.ID] = {
            name: LetsMoveOn.ID,
            title: "Sociable",
            icon: icon,
            visible: true,
            onChange: () => LetsMoveOnUI.activate(),
            toggle: toggleIt,
            active: social,
            button: true
        };
    }
});
