const request = require('supertest');
const app = require('../app');

describe('Task Management API Automated CI Tests', () => {
    beforeEach(() => {
        app.resetTasks();
    });

    // Test 1: Step 2 from Practical 12 Syllabus
    test('GET /tasks returns status 200 and array of tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    // Test 2: Supplementary Problem (Second automated test covering POST endpoint)
    test('POST /tasks creates a new task and returns status 201', async () => {
        const newTaskData = {
            title: 'Verify GitHub Actions CI test pass',
            completed: false
        };

        const res = await request(app)
            .post('/tasks')
            .send(newTaskData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newTaskData.title);
        expect(res.body.completed).toBe(false);
    });

    // Test 3: Server health check
    test('GET /health returns status 200 and UP status', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('UP');
    });

    // Test 4: Validation error handling
    test('POST /tasks with missing title returns status 400', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({ completed: true });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Title is required');
    });

    // Test 5: Not found handling
    test('GET /tasks/:id returns status 404 for unknown task ID', async () => {
        const res = await request(app).get('/tasks/9999');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
