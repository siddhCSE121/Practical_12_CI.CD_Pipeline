/**
 * Practical 12 - Step 5 Demonstration Sample:
 * 
 * To demonstrate a DELIBERATELY BROKEN TEST causing a Red X failure on GitHub Actions:
 * 1. Change an assertion expectation to an invalid value (e.g. expect status 500 instead of 200).
 * 2. Push to GitHub: GitHub Actions runs `npm test`, detects the failure, and halts with a Red X.
 * 3. Correct the assertion back to status 200, commit and push: The pipeline turns GREEN.
 */

/*
// --- BROKEN VERSION (Causes Red X failure) ---
test('GET /tasks returns 200 [BROKEN FOR DEMO]', async () => {
    const res = await request(app).get('/tasks');
    // Deliberate failure: expecting 500 when actual response is 200
    expect(res.statusCode).toBe(500); 
    // FAIL: Expected: 500, Received: 200
});

// --- FIXED VERSION (Causes Green Checkmark) ---
test('GET /tasks returns 200 [FIXED]', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200); 
    // PASS: Expected: 200, Received: 200
});
*/
