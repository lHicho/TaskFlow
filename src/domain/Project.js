import { Task } from "./Task.js";

export class Project {

    #id;
    #createdAt;
    #title;
    #description;
    #tasks = [];
    #dueDate;
    #updatedAt;

    constructor(title = "", description = "", dueDate = null) {
        this.#id = crypto.randomUUID();
        this.#createdAt = new Date();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
    }

    get id() { return this.#id; }
    get createdAt() { return this.#createdAt; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get dueDate() { return this.#dueDate; }
    get updatedAt() { return this.#updatedAt; }
    get tasks() { return [...this.#tasks] }

    set title(newTitle) {
        if (typeof newTitle !== "string" || newTitle.trim() === "") { throw new Error("Title must be a non-empty string."); }
        this.#title = newTitle.trim();
        this.#updatedAt = new Date();
    }
    set description(newDescription) {
        if (typeof newDescription !== "string") { throw new Error("Description must be a non-empty string."); }
        if (newDescription.trim() === "") { this.#description = "No Description"; return; }
        this.#description = newDescription.trim();
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

    addTask(task) {
        if (task instanceof Task === false) { throw new Error("Task must be a Task object"); }
        this.#tasks.push(task);
        this.#updatedAt = new Date();
    }

    addTasks(taskArr) {
        if (!Array.isArray(taskArr)) { throw new Error("Invalid input: input must be an Array"); }
        for (let i = 0; i < taskArr.length; i++) {
            this.addTask(taskArr[i]);
        }
        this.#updatedAt = new Date();
    }

    removeTask(id) {
        const initialLength = this.#tasks.length;
        this.#tasks = this.#tasks.filter(task => task.id !== id);
        if (this.#tasks.length !== initialLength) {
            this.#updatedAt = new Date();
        }
    }
    clearTasks() {
        this.#tasks = [];
        this.#updatedAt = new Date();
    }
    getTaskById(id) {
        return this.#tasks.find((task) => task.id === id) || null;
    }
    getAllTasks() {
        return [...this.#tasks];
    }
    getTasksByStatus(status) {
        let arr = [];
        for (let i = 0; i < this.#tasks.length; i++) {
            if (this.#tasks[i].status === status) { arr.push(this.#tasks[i]) }
        }
        return arr;
    }

}