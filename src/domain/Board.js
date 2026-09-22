import { Project } from "./Project.js";
import { Task } from "./Task.js";

export class Board {

    #id;
    #createdAt;
    #title;
    #description;
    #projects = [];
    #updatedAt;

    constructor(title = "", description = "", dueDate = null) {
        this.#id = crypto.randomUUID();
        this.#createdAt = new Date();
        this.title = title;
        this.description = description;
    }

    get id() { return this.#id; }
    get createdAt() { return this.#createdAt; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get updatedAt() { return this.#updatedAt; }
    get projects() { return [...this.#projects] }

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

    addProject(project) {
        if (project instanceof Project === false) { throw new Error("Sent project must be a Project object"); }
        this.#projects.push(project);
        this.#updatedAt = new Date();
    }

    addProjects(projectArr) {
        if (!Array.isArray(projectArr)) { throw new Error("Invalid input: input must be an Array"); }
        for (let i = 0; i < projectArr.length; i++) {
            this.addProject(projectArr[i]);
        }
        this.#updatedAt = new Date();
    }
    removeProject(id) {
        const initialLength = this.#projects.length;
        this.#projects = this.#projects.filter(project => project.id !== id);
        if (this.#projects.length !== initialLength) {
            this.#updatedAt = new Date();
        }
    }
    clearProjects() {
        this.#projects = [];
        this.#updatedAt = new Date();
    }
    getProjectById(id) {
        return this.#projects.find((project) => project.id === id) || null;
    }
    getAllProjects() {
        return [...this.#projects];
    }
}
