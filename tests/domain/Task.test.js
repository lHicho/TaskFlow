import { Task } from '../../src/domain/task.js';

describe('Task Class', () => {

    // 1. Constructor & Initialization Tests
    describe('Initialization', () => {
        test('should create a valid task with default status, uuid, and timestamp', () => {
            const task = new Task('Test Title', 'Test Description');

            expect(task.title).toBe('Test Title');
            expect(task.description).toBe('Test Description');
            expect(task.status).toBe('todo');
            
            // Check UUID format
            expect(typeof task.id).toBe('string');
            expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
            
            // Check createdAt is a valid Date
            expect(task.createdAt).toBeInstanceOf(Date);
        });

        test('should generate unique IDs for different tasks', () => {
            const task1 = new Task('Task 1', 'Desc 1');
            const task2 = new Task('Task 2', 'Desc 2');

            expect(task1.id).not.toBe(task2.id);
        });

        test('should throw an error if constructor receives invalid title or description', () => {
            expect(() => new Task('', 'Desc')).toThrow("Title must be a non-empty string.");
            expect(() => new Task('Title', '')).toThrow("Description must be a non-empty string.");
            expect(() => new Task(null, 'Desc')).toThrow("Title must be a non-empty string.");
        });
    });

    // 2. Setters & Validation Tests
    describe('Setters & Validation', () => {
        test('should update title and description with valid values', () => {
            const task = new Task('Old Title', 'Old Desc');

            task.title = 'New Title';
            task.description = 'New Desc';

            expect(task.title).toBe('New Title');
            expect(task.description).toBe('New Desc');
        });

        test('should throw error when updating title with invalid values', () => {
            const task = new Task('Title', 'Desc');

            expect(() => { task.title = ''; }).toThrow("Title must be a non-empty string.");
            expect(() => { task.title = '   '; }).toThrow("Title must be a non-empty string.");
            expect(() => { task.title = 123; }).toThrow("Title must be a non-empty string.");
            expect(() => { task.title = null; }).toThrow("Title must be a non-empty string.");
            
            // Ensure previous valid title remains unchanged
            expect(task.title).toBe('Title');
        });

        test('should throw error when updating description with invalid values', () => {
            const task = new Task('Title', 'Desc');

            expect(() => { task.description = ''; }).toThrow("Description must be a non-empty string.");
            expect(() => { task.description = '   '; }).toThrow("Description must be a non-empty string.");
            expect(() => { task.description = undefined; }).toThrow("Description must be a non-empty string.");

            // Ensure previous valid description remains unchanged
            expect(task.description).toBe('Desc');
        });
    });

    // 3. State Management Method Tests
    describe('State Management', () => {
        test('should correctly change status using state methods', () => {
            const task = new Task('Title', 'Desc');
            expect(task.status).toBe('todo');

            task.markInProgress();
            expect(task.status).toBe('in-progress');

            task.markComplete();
            expect(task.status).toBe('complete');

            task.markTodo();
            expect(task.status).toBe('todo');
        });
    });

    // 4. Read-Only Protection Tests
    describe('Read-Only Enforcement', () => {
        test('should prevent direct reassignment of getters', () => {
            const task = new Task('Title', 'Desc');

            // Trying to overwrite read-only properties should fail or throw in strict mode
            expect(() => {
                task.id = 'new-id';
            }).toThrow();

            expect(() => {
                task.createdAt = new Date();
            }).toThrow();

            expect(() => {
                task.status = 'complete';
            }).toThrow();
        });
    });

});