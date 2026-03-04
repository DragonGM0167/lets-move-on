import { LetsMoveOn } from "./lets-move-on.js";
import { LetsMoveOnUtils } from "./lets-move-on-utils.js";

export class LetsMoveOnUI extends FormApplication {
    static instance = null;

    static activate() {
        if (game.user.isGM) {
            if (!this.instance) {
                this.instance = new LetsMoveOnUI();
            }
            if (!this.instance.rendered) {
                this.instance.render(true);
            }
            else {
                this.instance.bringToTop();
            }
        }
    }

    static async refresh() {
        this.instance?.render();
    }

    static get defaultOptions() {
        const windowHeight = (game.users._source.length - 1) * 50;
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            height: windowHeight,
            width: 50,
            resizable: false,
            editable: true,
            id: "lets-move-on",
            template: `./modules/${LetsMoveOn.ID}/templates/${LetsMoveOn.ID}.hbs`,
            title: "lets-move-on.title",
            userId: game.userId,
            closeOnSubmit: false,
            submitOnChange: false
        });
    }

    // We don't need any data from the options (parameter) so just call the utility to build out the cell data
    // that is sent to the handlebars form
    getData(options) {
        const sociable_data = LetsMoveOnUtils.buildData();
        return { sociable_data };
    }

    _updateObject(event, formData) {
        setTimeout(() => this.render(), 0);
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        const characterDataArray = LetsMoveOnUtils.buildCharacterDataArray();
        for (let index = 0; index < characterDataArray.length; index++) {
            html.find(`button[data-action="${characterDataArray[index].actorId}"]`).click(function(event) {
                LetsMoveOn.toggleSociable(characterDataArray[index].actorId);
            });
        }
    }    
}