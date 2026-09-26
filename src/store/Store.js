import { Board } from "../domain/Board.js";
import { StorageAdapter } from "../storage/StorageAdapter.js";
import { Project } from "../domain/Project.js";
import { Task } from "../domain/task.js";


export class Store {
    #board;
    #subscribers;
    #storageAdapter;
    #storageKey;

    constructor(board = new Board("Default Board"), storageAdapter = null, storageKey = "taskflow_pro_State") {
        this.board = board;
        this.#subscribers = new Set();
        this.storageAdapter = storageAdapter;
        this.#storageKey = storageKey;

        let loadedBoard = null;
        if (this.#storageAdapter) {
            const rawState = this.#storageAdapter.load(this.#storageKey);
            if (rawState) {
                loadedBoard = Board.fromJSON(rawState);
            }
        }

        const activeBoard = loadedBoard || board;
        if (activeBoard instanceof Board === false) {
            throw new Error("Passed argument must be a Board object.");
        }
        this.#board = activeBoard;

        if (this.#storageAdapter) {
            this.subscribe(() => this.#persistState());
        }
    }

    get board() { return this.#board };
    get subscribers() { return [...this.#subscribers] }

    set board(boardObj) {
        if (boardObj instanceof Board === false) { throw new Error("Passed argument must be a Board object.");}
        this.#board = boardObj;
    }
    set storageAdapter(strgAdapter) {
        if (strgAdapter instanceof StorageAdapter === false) { throw new Error("Passed argument must be a StorageAdapter object.");}
        this.#storageAdapter = strgAdapter;
    }

    subscribe(callback) {
        if (typeof callback != 'function') { throw new Error("Passed argument must be a function."); }
        this.#subscribers.add(callback);
        return () => this.unsubscribe(callback);
    }
    unsubscribe(callback) {
        this.#subscribers.delete(callback)
    }
    #notify() {
        for (const subscriber of this.#subscribers) {
            try {
                subscriber(this.board);
            } catch (err) {
                console.error("Sunbscriber execution failed: ", err);
            }
        }
    }
    #persistState() {
        if (this.#storageAdapter) {
            this.#storageAdapter.save(this.#storageKey, this.#board);
        }
    }

    addProject(project) {
        this.#board.addProject(project);
        this.#notify();
    }
    addProjects(projects) {
        this.#board.addProjects(projects);
        this.#notify();
    }
    removeProject(id) {
        this.#board.removeProject(id);
        this.#notify();
    }
    clearProjects() {
        this.#board.clearProjects();
        this.#notify();
    }
    getProjectById(id) {
        return this.#board.getProjectById(id)
    }
    getAllProjects() {
        return this.#board.getAllProjects();
    }
    addTaskToProject(id, task) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        project.addTask(task);
        this.#notify();
    }
    addTasksToProject(id, tasks) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        project.addTasks(tasks);
        this.#notify();
    }
    removeTaskFromProject(id, taskId) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        project.removeTask(taskId);
        this.#notify();
    }
    clearTasksFromProject(id) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        project.clearTasks();
        this.#notify();
    }
    getTaskByIdFromProject(id, taskId) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        return project.getTaskById(taskId);
    }
    getAllTasksFromProject(id) {
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        return project.getAllTasks();
    }
    getTasksByStatusFromProject(id, status){
        const project = this.#board.getProjectById(id);
        if (!project) throw new Error(`Project with ID of: "${id}" not found.`);
        return project.getTasksByStatus(status);
    }
}