import { LetsMoveOn } from "./lets-move-on.js";
import { LetsMoveOnUI } from "./lets-move-on-ui.js";

// Create a badge under the "Token Control" section of the Foundry UI.
Hooks.on("getSceneControlButtons", (controls) => {
    if (parseFloat(game.version) < 13.0) {
        const tokens = controls.find((c) => c.name === "token");
        if (tokens) {
            tokens.tools.push({
                name: LetsMoveOn.ID,
                title: "Sociable",
                icon: "far fa-comments",
                visible: true,
                onClick: () => LetsMoveOnUI.activate(),
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
            icon: "far fa-comments",
            visible: true,
            onClick: () => LetsMoveOnUI.activate(),
            button: true
        };
    }
});
