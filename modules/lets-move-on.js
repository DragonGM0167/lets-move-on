export class LetsMoveOn {
    static ID = "lets-move-on";
    static FLAGS = {
        LETS_MOVE_ON: 'lets-move-on'
    }

    // Private methods
    static #update(request, requestData) {
        if (request == null || request == undefined) {
            return;
        }
        const updatedRequest = {
            actorId: request.actorId,
            userId: request.userId,
            trackerId: request.trackerId,
            isSociable: requestData.isSociable,
        };
        const modifiedRequest = {
            [request.actorId]: updatedRequest
        }
        game.users.get(request.userId)?.setFlag(LetsMoveOn.ID, LetsMoveOn.FLAGS.LETS_MOVE_ON, modifiedRequest);
        return updatedRequest;
    }

    static #delete(request) {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to delete social requests.");
            return;
        }
        if (request == null || request == undefined) {
            return;
        }
        const requests = {
            [`-=${request.actorId}`]: null
        }
        game.users.get(tracker.userId)?.setFlag(LetsMoveOn.ID, LetsMoveOn.FLAGS.LETS_MOVE_ON, requests);
    }

    // Public Methods
    // Get social request for all users
    static getAllRequests() {
        const allRequests = game.users.reduce((accumulator, user) => {
            const userRequests = this.getRequestForUser(user.id);
            return {
                ...accumulator,
                ...userRequests
            }
        }, {});
        return allRequests;
    }

    // Social request for a given actor
    static getByActorId(actorId) {
        return this.getAllRequests()[actorId];
    }

    // Social request for a given user
    static getRequestForUser(userId) {
        return game.users.get(userId)?.getFlag(LetsMoveOn.ID, LetsMoveOn.FLAGS.LETS_MOVE_ON);
    }

    // Create a social request for a user and actor
    static create(userId, actorId) {
        // Build the social request
        const newRequest = {
            actorId,
            userId,
            requestId: foundry.utils.randomID(16),
            isSociable: false
        }
        // Add the new request
        const socialRequests = {
            [actorId]: newRequest
        }
        game.users.get(userId)?.setFlag(LetsMoveOn.ID, LetsMoveOn.FLAGS.LETS_MOVE_ON, socialRequests);
        return newRequest;
    }

    // Toggle the social request
    static toggleSociable(actorId) {
        if (actorId == null || actorId == undefined) {
            return;
        }
        let request = this.getByActorId(actorId);
        if (request == null || request == undefined) {
            request = this.create(user._id, actorId);
        }
        return this.#update(request, { isSociable: request.isSociable ^= true })
    }

    // Delete social request by actor
    static deleteByActorId(actorId) {
        this.#delete(this.getByActorId(actorId));
    }

    // Delete social requests by user
    static deleteAllByUserId(userId) {
        const requestsToBeDeleted = this.getRequestForUser(userId);
        for (let key in requestsToBeDeleted) {
            this.#delete(requestsToBeDeleted[key]);
        }
    }

    // Delete all ophaned social requests
    static removeOrphans() {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to delete social requests.");
            return;
        }
        const allRequests = this.getAllRequests();
        const userIds = [];
        const actorIds = [];
        const users = game.users._source;
        const actors = game.actors._source;

        for (let index = 0; index < users.length; index++) {
            userIds.push(users[index]._id);
        }
        for (let index = 0; index < actors.length; index++) {
            actorIds.push(actors[index]._id);
        }
        for (let key in allRequests) {
            const request = allRequests[key];
            // If the social request has a orphaned user id, delete all the social requests for the orphaned user id
            if (!userIds.includes(request.userId)) {
                this.deleteAllByUserId(request.userId);
            }
        }
        for (let key in allRequests) {
            const request = allRequests[key];
            // If the social request has a orphaned actor id, delete the social request for the orphaned actor id
            if (!actorIds.includes(request.actorId)) {
                this.deleteByActorId(request.actorId);
            }
        }
    }

    // DEBUGGING Methods
    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }
}