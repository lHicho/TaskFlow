import { Project } from '../../src/domain/Project.js';
import { Task } from '..../src/domain/Task.js';

describe('Project Class', () => {
  let project;
  let mockTask;

  beforeEach(() => {
    project = new Project('Initial Title', 'Initial Description');
    mockTask = new Task('Test Task', 'Task Description');
  });

  describe('Constructor & Core Instantiation', () => {
    test('should create a Project with valid default and assigned values', () => {
      expect(project.id).toBeDefined();
      expect(typeof project.id).toBe('string');
      expect(project.title).toBe('Initial Title');
      expect(project.description).toBe('Initial Description');
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
      expect(project.dueDate).toBeNull();
      expect(project.tasks).toEqual([]);
    });

    test('should assign due date correctly if passed in constructor', () => {
      const p = new Project('Title', 'Desc', '2026-12-31');
      expect(p.dueDate).toBeInstanceOf(Date);
      expect(p.dueDate.getFullYear()).toBe(2026);
    });
  });

  describe('Getters & Setters Validation', () => {
    test('should update title and refresh updatedAt timestamp', () => {
      const initialUpdatedAt = project.updatedAt;
      project.title = '  Updated Title  ';
      expect(project.title).toBe('Updated Title');
      expect(project.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });

    test('should throw error when setting title to an empty or non-string value', () => {
      expect(() => { project.title = ''; }).toThrow('Title must be a non-empty string.');
      expect(() => { project.title = '   '; }).toThrow('Title must be a non-empty string.');
      expect(() => { project.title = 123; }).toThrow('Title must be a non-empty string.');
    });

    test('should update description or fall back to default when empty', () => {
      project.description = '  New Description  ';
      expect(project.description).toBe('New Description');

      project.description = '   ';
      expect(project.description).toBe('No Description');
    });

    test('should throw error when setting non-string description', () => {
      expect(() => { project.description = null; }).toThrow('Description must be a string.');
      expect(() => { project.description = 456; }).toThrow('Description must be a string.');
    });
  });

  describe('Due Date Setter & Edge Cases', () => {
    test('should set valid Date object from valid string or Date instance', () => {
      project.dueDate = '2026-10-15';
      expect(project.dueDate).toBeInstanceOf(Date);

      const dateObj = new Date('2026-11-20');
      project.dueDate = dateObj;
      expect(project.dueDate).toEqual(dateObj);
    });

    test('should clear due date when set to null, undefined, or empty string', () => {
      project.dueDate = '2026-10-15';
      project.dueDate = null;
      expect(project.dueDate).toBeNull();

      project.dueDate = '2026-10-15';
      project.dueDate = '';
      expect(project.dueDate).toBeNull();

      project.dueDate = '2026-10-15';
      project.dueDate = undefined;
      expect(project.dueDate).toBeNull();
    });

    test('should throw error for invalid date inputs', () => {
      expect(() => { project.dueDate = 'invalid-date-string'; }).toThrow(/Invalid date string/);
      expect(() => { project.dueDate = new Date('invalid'); }).toThrow(/Invalid Date object/);
      expect(() => { project.dueDate = 123456789; }).toThrow('Due date must be a string, Date object, or null.');
    });
  });

  describe('Task Operations & Immutability', () => {
    test('should add a valid Task instance', () => {
      project.addTask(mockTask);
      expect(project.tasks.length).toBe(1);
      expect(project.getTaskById(mockTask.id)).toBe(mockTask);
    });

    test('should throw error when adding invalid task object', () => {
      expect(() => { project.addTask({}); }).toThrow('Task must be an instance of Task.');
      expect(() => { project.addTask('not-a-task'); }).toThrow('Task must be an instance of Task.');
    });

    test('should add multiple tasks via addTasks', () => {
      const task2 = new Task('Task 2', 'Desc 2');
      project.addTasks([mockTask, task2]);
      expect(project.tasks.length).toBe(2);
    });

    test('should throw error if addTasks is not passed an array', () => {
      expect(() => { project.addTasks(mockTask); }).toThrow('Invalid input: input must be an array.');
    });

    test('should remove a task by ID', () => {
      project.addTask(mockTask);
      expect(project.tasks.length).toBe(1);

      project.removeTask(mockTask.id);
      expect(project.tasks.length).toBe(0);
      expect(project.getTaskById(mockTask.id)).toBeNull();
    });

    test('should clear all tasks', () => {
      const task2 = new Task('Task 2', 'Desc 2');
      project.addTasks([mockTask, task2]);
      expect(project.tasks.length).toBe(2);

      project.clearTasks();
      expect(project.tasks.length).toBe(0);
    });

    test('should enforce getter immutability (copies, not direct references)', () => {
      project.addTask(mockTask);
      const tasksCopy = project.tasks;
      tasksCopy.push('external-garbage');

      expect(project.tasks.length).toBe(1);
      expect(project.getAllTasks().length).toBe(1);
    });
  });

  describe('Dynamic Progress Getter', () => {
    test('should return 0 progress when project has no tasks', () => {
      expect(project.progress).toBe(0);
    });

    test('should accurately calculate percentage based on completed tasks', () => {
      const t1 = new Task('T1', 'D1');
      const t2 = new Task('T2', 'D2');
      
      project.addTasks([t1, t2]);
      expect(project.progress).toBe(0);

      // Simulate completion on task 1
      t1.status = 'done';
      expect(project.progress).toBe(50);

      t2.status = 'complete';
      expect(project.progress).toBe(100);
    });
  });
});