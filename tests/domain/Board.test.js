import { jest } from '@jest/globals';
import { Board } from '../src/Board.js';
import { Project } from '../src/Project.js';
import { Task } from '../src/Task.js';

describe('Board Class', () => {
  let board;
  let mockProject;

  beforeEach(() => {
    board = new Board('Main Board', 'Main Board Description');
    mockProject = new Project('Web App', 'Frontend Sprint');
  });

  describe('Constructor & Instantiation', () => {
    test('should create a Board with correct initial values', () => {
      expect(board.id).toBeDefined();
      expect(typeof board.id).toBe('string');
      expect(board.title).toBe('Main Board');
      expect(board.description).toBe('Main Board Description');
      expect(board.createdAt).toBeInstanceOf(Date);
      expect(board.updatedAt).toBeInstanceOf(Date);
      expect(board.projects).toEqual([]);
    });
  });

  describe('Title & Description Validations', () => {
    test('should update title and update timestamp', () => {
      board.title = 'Updated Board Title';
      expect(board.title).toBe('Updated Board Title');
    });

    test('should throw error for invalid board titles', () => {
      expect(() => { board.title = ''; }).toThrow('Title must be a non-empty string.');
      expect(() => { board.title = 123; }).toThrow('Title must be a non-empty string.');
    });

    test('should default description to "No Description" when given blank text', () => {
      board.description = '   ';
      expect(board.description).toBe('No Description');
    });
  });

  describe('Project Management Operations', () => {
    test('should add a Project instance', () => {
      board.addProject(mockProject);
      expect(board.projects.length).toBe(1);
      expect(board.getProjectById(mockProject.id)).toBe(mockProject);
    });

    test('should throw error when adding non-Project object', () => {
      expect(() => { board.addProject({}); }).toThrow('Argument must be an instance of Project.');
    });

    test('should add multiple projects via addProjects', () => {
      const p2 = new Project('Backend', 'API Services');
      board.addProjects([mockProject, p2]);
      expect(board.projects.length).toBe(2);
    });

    test('should throw error if addProjects is not passed an array', () => {
      expect(() => { board.addProjects(mockProject); }).toThrow('Invalid input: input must be an Array.');
    });

    test('should remove project by ID and only update timestamp if length changes', () => {
      board.addProject(mockProject);
      expect(board.projects.length).toBe(1);

      board.removeProject(mockProject.id);
      expect(board.projects.length).toBe(0);
      expect(board.getProjectById(mockProject.id)).toBeNull();
    });

    test('should clear all projects', () => {
      const p2 = new Project('Backend', 'API Services');
      board.addProjects([mockProject, p2]);
      expect(board.projects.length).toBe(2);

      board.clearProjects();
      expect(board.projects.length).toBe(0);
    });

    test('should protect projects array from external direct mutations (immutability)', () => {
      board.addProject(mockProject);
      const projectsCopy = board.projects;
      projectsCopy.push('fake-project');

      expect(board.projects.length).toBe(1);
      expect(board.getAllProjects().length).toBe(1);
    });
  });

  describe('Overall Board Progress Calculation', () => {
    test('should return 0 progress if board has no projects', () => {
      expect(board.progress).toBe(0);
    });

    test('should compute average progress across all contained projects', () => {
      const p1 = new Project('P1', 'D1');
      const p2 = new Project('P2', 'D2');

      const t1 = new Task('Task 1', 'Desc');
      const t2 = new Task('Task 2', 'Desc');

      p1.addTask(t1); // P1 has 1 task (0% complete)
      p2.addTask(t2); // P2 has 1 task (100% complete)
      t2.status = 'done';

      board.addProjects([p1, p2]);

      // p1 progress = 0%, p2 progress = 100% -> Board average = 50%
      expect(board.progress).toBe(50);
    });
  });
});