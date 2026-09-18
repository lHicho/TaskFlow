export class Task {

    #status = "todo";
    #id;
    #createdAt;
    #title;
    #description;

    constructor(title, description) {
        this.#id = crypto.randomUUID();
        this.#createdAt = new Date();
        this.title = title;
        this.description = description;

    }

    get status() { return this.#status; }
    get id() { return this.#id; }
    get createdAt() { return this.#createdAt; }
    get title() { return this.#title; }
    get description() { return this.#description; }

    set title(newTitle) {
        if (typeof newTitle !== "string" || newTitle.trim() === "") { throw new Error("Title must be a non-empty string."); }
        this.#title = newTitle;
    }
    set description(newDescription) {
        if (typeof newDescription !== "string" || newDescription.trim() === "") { throw new Error("Description must be a non-empty string."); }
        this.#description = newDescription;
    }

    markComplete() {
        this.#status = "complete";
    }
    markInProgress() {
        this.#status = "in-progress";
    }
    markTodo() {
        this.#status = "todo";
    }
}