export const STATUS = Object.freeze({
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    DONE: "done",
    COMPLETE: "complete",
});

export const PRIORITY = Object.freeze({
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
});

export class Task {
    #status = STATUS.TODO;
    #id;
    #createdAt;
    #title;
    #description;
    #priority = PRIORITY.MEDIUM;
    #dueDate = null;
    #updatedAt;

    constructor(title = "", description = "", priority = PRIORITY.MEDIUM, dueDate = null) {
        this.#id = crypto.randomUUID();
        this.#createdAt = new Date();
        this.#updatedAt = new Date();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    get status() { return this.#status; }
    get id() { return this.#id; }
    get createdAt() { return this.#createdAt; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get priority() { return this.#priority; }
    get dueDate() { return this.#dueDate; }
    get updatedAt() { return this.#updatedAt; }

    set title(newTitle) {
        if (typeof newTitle !== "string" || newTitle.trim() === "") { throw new Error("Title must be a non-empty string."); }
        this.#title = newTitle.trim();
        this.#updatedAt = new Date();
    }
    set description(newDescription) {
        if (typeof newDescription !== "string" || newDescription.trim() === "") { throw new Error("Description must be a non-empty string."); }
        this.#description = newDescription.trim();
        this.#updatedAt = new Date();
    }
    set priority(newPriority) {
        if (typeof newPriority !== "string" || newPriority.trim() === "") { throw new Error("Priority must be a non-empty string."); }

        const normalizedPriority = newPriority.trim().toLowerCase();
        const validPriorities = Object.values(PRIORITY);

        if (!validPriorities.includes(normalizedPriority)) {
            throw new Error("Priority must be one of: low, medium, high.");
        }

        this.#priority = normalizedPriority;
        this.#updatedAt = new Date();
    }
    set dueDate(newDueDate) {
        if (newDueDate === null || newDueDate === undefined || newDueDate === "") {
            this.#dueDate = null;
            this.#updatedAt = new Date();
            return;
        }

        let dateObj;

        if (typeof newDueDate === "string") {
            if (newDueDate.trim() === "") {
                this.#dueDate = null;
                this.#updatedAt = new Date();
                return;
            }
            dateObj = new Date(newDueDate);
        } else if (newDueDate instanceof Date) {
            dateObj = newDueDate;
        }

        if (!dateObj || isNaN(dateObj.getTime())) { throw new Error("Due date must be a valid date."); }
        this.#dueDate = dateObj;
        this.#updatedAt = new Date();
    }

    markDone() {
        this.#status = STATUS.DONE;
        this.#updatedAt = new Date();
    }
    markComplete() {
        this.#status = STATUS.COMPLETE;
        this.#updatedAt = new Date();
    }
    markInProgress() {
        this.#status = STATUS.IN_PROGRESS;
        this.#updatedAt = new Date();
    }
    markTodo() {
        this.#status = STATUS.TODO;
        this.#updatedAt = new Date();
    }

    static fromJSON(data) {
        if (!data) return null;

        const task = new Task(
            data.title,
            data.description,
            data.priority,
            data.dueDate ? new Date(data.dueDate) : null
        )

        if (data.id) task.id = data.id;
        if (data.status) task.status = data.status;
        if (data.createdAt) task.createdAt = new Date(data.createdAt);
        if (data.updatedAt) task.updatedAt = new Date(data.updatedAt);

        return task;
    }
}

