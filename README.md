# Optical CMS API

## Overview

This project implements a headless content management API designed for government agencies. It provides endpoints to query user data and upload CSV files to update the database.

## Setup Instructions

1. **Clone the repository:**

   ```
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

```
cd optical
```

3. **Install dependencies:**

```
npm install
```

4. **Run the server:**

```
npm start
```

The server will run on http://localhost:3000

## Testing the API Endpoints

**Running Automated Tests**

This project uses Mocha, Supertest, and Chai for automated testing. To run all tests, simply execute:

```
npm test
```

This command will run all tests defined in the `test` folder, verifying that:

- The `/upload` endpoint correctly accepts or rejects CSV uploads.
- The `/users` endpoint correctly applies query parameters for filtering and sorting using min, max, offset, limit, and sort.

**GET /users**

- Description: Retrieves a list of users.
- Test: Open your browser and navigate to http://localhost:3000/users or use Postman.
- Optional Query Parameters:
- `min`: Minimum salary (default: 0.0)
- `max`: Maximum salary (default: 4000.0)
- `offset`: Starting index (default: 0)
- `limit`: Number of records to return
- `sort`: Either `NAME` or `SALARY`

**POST /upload**

- Description: Uploads CSV data to update the user database.

- Note: This endpoint accepts POST requests only.

- Testing via cURL(example):

```
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
-d $'file=Name, Salary\nJohn,2500.05\nMary,3000.00' \
http://localhost:3000/upload
```

**Additional Testing Details**
The tests verify:

- CSV Upload Validation:
  Invalid CSV files (e.g., non-numeric salary, extra columns) should be rejected with an appropriate error message. Valid CSV files will update the user database.

- User Filtering and slicing:
  The `/users` endpoint supports filtering by `min` and `max` salary, sorting (by `NAME` or `SALARY`), and slicing through offset and limit parameters.

Refer to the test file (`test/api.test.js`) for detailed test cases.
