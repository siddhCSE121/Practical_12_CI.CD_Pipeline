# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://img.shields.io/badge/CI%20Pipeline-passing-2ea44f?style=flat&logo=githubactions)](https://github.com)
[![Jest Tests](https://img.shields.io/badge/tests-5%20passed-success)](https://jestjs.io)

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Department**: CSE - CSPIT, CHARUSAT  
**Semester**: 5th  

---

## 📌 Objective
To automate testing and validation of the application using a **Continuous Integration (CI) pipeline** configured via **GitHub Actions** (`.github/workflows/ci.yml`) and automated **Jest & Supertest** suites.

---

## 🏗️ Architecture & Pipeline Flow

```text
git push origin main
       │
       ▼
GitHub Actions Trigger (push / pull_request on main branch)
       │
       ▼
Job 1: lint (Syntax & Code Validation)
       ├── Checkout code (actions/checkout@v4)
       ├── Setup Node.js 18 (actions/setup-node@v4)
       └── npm run lint (node -c checks)
       │
       ▼
Job 2: build-and-test (Step 3)
       ├── Checkout code
       ├── Setup Node.js 18
       ├── npm install (Dependency install step)
       ├── npm test (Automated Jest test execution)
       └── Report Pass / Fail Status
       │
       ▼
Result: Green checkmark (PASS) or Red X (FAIL) visible in GitHub Actions Tab
```

---

## 🧪 Automated Test Suite (`tests/tasks.test.js`)

We implemented 5 automated unit and integration tests using **Jest** and **Supertest**:

1. **`GET /tasks`**: Asserts HTTP `200 OK` and non-empty tasks array *(Step 2 from syllabus)*.
2. **`POST /tasks`**: Asserts HTTP `201 Created` with valid body and ID *(Supplementary Problem)*.
3. **`GET /health`**: Asserts HTTP `200 OK` and status `'UP'`.
4. **`POST /tasks` validation**: Asserts HTTP `400 Bad Request` when `title` is missing.
5. **`GET /tasks/:id`**: Asserts HTTP `404 Not Found` for invalid task ID.

### Local Test Execution Evidence
```text
> jest --detectOpenHandles --forceExit

PASS tests/tasks.test.js
  Task Management API Automated CI Tests
    ✓ GET /tasks returns status 200 and array of tasks (237 ms)
    ✓ POST /tasks creates a new task and returns status 201 (288 ms)
    ✓ GET /health returns status 200 and UP status (16 ms)
    ✓ POST /tasks with missing title returns status 400 (17 ms)
    ✓ GET /tasks/:id returns status 404 for unknown task ID (18 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        12.184 s
Ran all test suites.
```

---

## 🔴 Failed Pipeline vs. 🟢 Fixed Pipeline Demonstration

### 1. Step 5: Deliberate Failure (Red X in GitHub Actions)
To simulate a failing build, change the assertion in `tests/tasks.test.js` to expect status `500` instead of `200`:
```javascript
test('GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(500); // <-- DELIBERATE ERROR: Actual is 200
});
```

**Result in GitHub Actions Log**:
```text
FAIL tests/tasks.test.js
  ● Task Management API Automated CI Tests › GET /tasks returns 200

    expect(received).toBe(expected) // Object.is equality

    Expected: 500
    Received: 200

      at Object.toBe (tests/tasks.test.js:10:32)

Error: Process completed with exit code 1.
Status: Red ❌ (Failed build alert received)
```

### 2. Step 6: Fix the Test (Green Checkmark in GitHub Actions)
Correct the expected assertion back to `200`:
```javascript
test('GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200); // <-- FIXED
});
```

**Result in GitHub Actions Log**:
```text
PASS tests/tasks.test.js
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Status: Green ✔️ (All steps passed, workflow green)
```

---

## 🧠 Key Viva Questions & Theory Analysis

### Q1: What is the difference between Continuous Integration (CI) and Continuous Deployment (CD), and which one does this practical actually demonstrate?
> **Answer**:  
> - **Continuous Integration (CI)**: The automated practice where developers regularly merge code changes into a central repository, triggering automated builds, linters, and tests to verify code correctness. This practical demonstrates **Continuous Integration (CI)**.  
> - **Continuous Deployment (CD)**: The automated process that automatically packages and deploys successfully integrated code directly into production or staging infrastructure without manual intervention.

### Q2: Why does running tests automatically on every push catch problems earlier than testing manually before a release?
> **Answer**:  
> Manual pre-release testing batches weeks of changes together, making regression root-cause analysis difficult and expensive. With automated CI on every push:  
> 1. Bugs are caught immediately within minutes of being written.  
> 2. The offending commit and code diff are isolated to a single author and PR.  
> 3. Broken code is prevented from merging into the `main` branch.

### Q3: What would happen to the pipeline if the test file path were incorrect — would the workflow fail at the same step as a genuine test failure?
> **Answer**:  
> If the test file path is incorrect or matches zero test files:  
> - By default, Jest exits with code 1 (`No tests found related to files matching...`), causing the `npm test` step to fail.  
> - However, the **failure reason** in the logs indicates a configuration/configuration error rather than an assertion failure (`Expected vs Received`).  
> - If Jest is configured with `--passWithNoTests`, the step would falsely pass, highlighting why proper CI pipeline assertion verification is essential.

---

## 🚀 Steps to Run

Follow these commands in your terminal to run, test, and verify Practical 12 locally and on GitHub Actions:

### 1. Navigate to Practical Directory
```bash
cd prac12
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Jest Test Suite Locally
```bash
npm test
```
* Runs all 5 Jest test cases covering `GET /tasks`, `POST /tasks`, schema validation, and health checks.
* Output confirms:
  ```text
  PASS tests/tasks.test.js
  Test Suites: 1 passed, 1 total
  Tests:       5 passed, 5 total
  ```

### 4. Start the Application Server
```bash
npm start
```
* Starts the backend on `http://localhost:5000`.

### 5. Trigger CI Pipeline via Git Commit
```bash
git add .
git commit -m "feat(prac12): configure GitHub Actions CI pipeline and automated Jest suite"
git push origin main
```
* Pushing to GitHub triggers the `.github/workflows/ci.yml` pipeline under the **Actions** tab.

---

## 📸 Step-by-Step Guide for Each Lab Report Screenshot

Follow these exact steps to generate and capture all required screenshots for your Practical 12 lab submission report:

---

### Screenshot 1: Local Automated Test Suite Execution (`npm test`)
* **Objective / Lab Step**: Demonstrate that the Jest & Supertest automated test suite executes locally and all 5 tests pass.
* **Exact Steps to Perform**:
  1. Open your terminal in the `prac12` directory:
     ```powershell
     cd d:\REACT-AWDF\prac12
     ```
  2. Run the automated test suite:
     ```powershell
     npm test
     ```
  3. Wait for Jest to finish running.
* **What to Capture**:
  - The terminal window showing:
    - Green `PASS tests/tasks.test.js`
    - All 5 green checkmarks (`GET /tasks`, `POST /tasks`, `GET /health`, `POST /tasks with missing title returns status 400`, `GET /tasks/:id returns status 404`)
    - Summary line: `Test Suites: 1 passed, 1 total`, `Tests: 5 passed, 5 total`.

---

### Screenshot 2: Application Running Locally in Web Browser (`npm start`)
* **Objective / Lab Step**: Demonstrate that the Express server and frontend task manager operate interactively.
* **Exact Steps to Perform**:
  1. In your terminal, start the server:
     ```powershell
     npm start
     ```
     *(Note: If port 5000 is occupied by Docker from Practical 11, either run `docker compose -f ../prac11/docker-compose.yml down` or set `PORT=5001` in `prac12/.env`).*
  2. Open your web browser and navigate to:
     ```text
     http://localhost:5000
     ```
     *(or `http://localhost:5001` if using port 5001)*
  3. Type a task title (e.g., `Verify GitHub Actions Pipeline`) into the input box and click **Add Task**.
* **What to Capture**:
  - Full browser window showing the **"Practical 12: CI/CD Pipeline with GitHub Actions"** header, the task input form, and the list of active tasks with **Delete** buttons.

---

### Screenshot 3: GitHub Actions Workflow Manifest (`.github/workflows/ci.yml`)
* **Objective / Lab Step**: Document the Continuous Integration workflow definition (Step 3 in syllabus).
* **Exact Steps to Perform**:
  1. Open VS Code.
  2. In the file explorer, navigate to and click:
     `prac12/.github/workflows/ci.yml`
  3. Make sure line numbers (1–48) and the following sections are visible on screen:
     - `name: CI Pipeline`
     - `on: [push, pull_request]`
     - `jobs: lint` (`npm run lint`)
     - `jobs: build-and-test` (`npm install`, `npm test`)
* **What to Capture**:
  - VS Code editor tab showing the clean YAML code with syntax highlighting and line numbers.

---

### Screenshot 4: Successful GitHub Actions Pipeline Run (Green ✔ in Actions Tab)
* **Objective / Lab Step**: Step 4 from syllabus — Demonstrate that pushing code to GitHub automatically triggers the CI workflow and finishes with a green checkmark.
* **Exact Steps to Perform**:
  1. Stage, commit, and push your code to your GitHub repository:
     ```powershell
     git add .
     git commit -m "feat(prac12): configure GitHub Actions CI pipeline and automated Jest suite"
     git push origin main
     ```
  2. Open your web browser and navigate to your GitHub repository:
     `https://github.com/<your-username>/<your-repo-name>`
  3. Click on the **Actions** tab in the top navigation bar.
  4. Locate the latest workflow run named **"CI Pipeline"** with commit message `feat(prac12)...`.
* **What to Capture**:
  - The GitHub Actions dashboard showing:
    - Green checkmark icon `✔`
    - Workflow title **"CI Pipeline"**
    - Commit message, branch name (`main`), and total execution time.

---

### Screenshot 5: Detailed Job Breakdown & Terminal Logs in GitHub Actions
* **Objective / Lab Step**: Prove that both jobs (`lint` and `build-and-test`) ran inside GitHub-hosted Ubuntu runners and all steps succeeded.
* **Exact Steps to Perform**:
  1. On the GitHub **Actions** tab, click on the green successful run from **Screenshot 4**.
  2. You will see the job graph showing **`lint`** and **`build-and-test`**.
  3. In the left sidebar, click on **`build-and-test`**.
  4. Click on the dropdown step named **`Run automated tests (Step 3)`** to expand the live console logs.
* **What to Capture**:
  - The expanded log output in GitHub Actions displaying:
    - Green checkmarks next to every step (`Set up Node.js 18`, `Install dependencies`, `Run automated tests`)
    - The terminal log inside the runner showing:
      ```text
      PASS tests/tasks.test.js
      Test Suites: 1 passed, 1 total
      Tests: 5 passed, 5 total
      ```

---

### Screenshot 6: Deliberate CI Failure Simulation (Red ❌ - Step 5 in Syllabus)
* **Objective / Lab Step**: Step 5 from syllabus — Intentionally cause a test failure, push the code, and show that GitHub Actions catches the bug and marks the build RED ❌.
* **Exact Steps to Perform**:
  1. In VS Code, open `tests/tasks.test.js`.
  2. Locate line 12 inside the `GET /tasks` test:
     ```javascript
     // Change this line:
     expect(res.statusCode).toBe(200);

     // To an intentional incorrect expectation:
     expect(res.statusCode).toBe(500);
     ```
  3. Save the file.
  4. Commit and push the deliberate broken test:
     ```powershell
     git add tests/tasks.test.js
     git commit -m "test: simulate deliberate CI pipeline failure (Step 5)"
     git push origin main
     ```
  5. Go to your GitHub repository &rarr; **Actions** tab in your browser.
  6. Wait ~30–45 seconds for the workflow to run and fail.
  7. Click on the failed run and open the **`build-and-test`** job logs.
  8. Click to expand the failed **`Run automated tests (Step 3)`** step.
* **What to Capture**:
  - The GitHub Actions view showing:
    - Red `❌` failure icon on `build-and-test`
    - The error log clearly indicating:
      ```text
      FAIL tests/tasks.test.js
      Expected: 500
      Received: 200
      Error: Process completed with exit code 1.
      ```

---

### Screenshot 7: Fixing the Pipeline (Restored Green ✔ - Step 6 in Syllabus)
* **Objective / Lab Step**: Step 6 from syllabus — Fix the broken test, push the update, and show the pipeline turning back to GREEN.
* **Exact Steps to Perform**:
  1. In VS Code, open `tests/tasks.test.js`.
  2. Revert line 12 back to the correct assertion:
     ```javascript
     expect(res.statusCode).toBe(200);
     ```
  3. Save the file.
  4. Stage, commit, and push the fix:
     ```powershell
     git add tests/tasks.test.js
     git commit -m "fix: resolve simulated test assertion to restore green pipeline (Step 6)"
     git push origin main
     ```
  5. Return to the GitHub repository &rarr; **Actions** tab.
  6. Wait for the workflow to complete.
* **What to Capture**:
  - The GitHub **Actions** workflow history list showing:
    - The top run showing **Green ✔** (`fix: resolve simulated test assertion...`)
    - Immediately below it, the previous **Red ❌** run (`test: simulate deliberate CI pipeline failure...`)
  - *This side-by-side progression provides the perfect visual proof of automated CI failure detection and resolution.*


