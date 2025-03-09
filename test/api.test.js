import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/index.js';

// Define __filename and __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV data files from the testData folder
const validCsv = fs.readFileSync(path.join(__dirname, 'testData', 'valid.csv'), 'utf8');
const invalidCsv1 = fs.readFileSync(path.join(__dirname, 'testData', 'invalid1.csv'), 'utf8');
const invalidCsv2 = fs.readFileSync(path.join(__dirname, 'testData', 'invalid2.csv'), 'utf8');

describe('POST /upload CSV File Uploads', function() {
  it('should reject invalid CSV (invalid1.csv) with non-numeric salary', async function() {
    const res = await request(app)
      .post('/upload')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ file: invalidCsv1 });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('should reject invalid CSV (invalid2.csv) with extra column', async function() {
    const res = await request(app)
      .post('/upload')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ file: invalidCsv2 });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('should accept valid CSV (valid.csv) and update the database', async function() {
    const res = await request(app)
      .post('/upload')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ file: validCsv });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('success', 1);
  });
});

describe('GET /users Endpoint', function() {
  // Ensure valid CSV upload before running GET /users tests
  before(async function() {
    await request(app)
      .post('/upload')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ file: validCsv });
  });

  it('should return updated users matching default salary range (0 - 4000)', async function() {
    const res = await request(app)
      .get('/users')
      .expect(200);
    const names = res.body.results.map(u => u.name);
    expect(names).to.include('John');
  });

  // Test for min and max salary filtering
  it('should return only users with salary between provided min and max', async function() {
    const min = 2100;
    const max = 3000;
    const res = await request(app)
      .get(`/users?min=${min}&max=${max}`)
      .expect(200);
    res.body.results.forEach(user => {
      expect(user.salary).to.be.at.least(min);
      expect(user.salary).to.be.at.most(max);
    });
  });

  // Test for sorting by NAME in ascending order
  it('should sort users by name in ascending order', async function() {
    const res = await request(app)
      .get('/users?sort=NAME')
      .expect(200);
    const names = res.body.results.map(user => user.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).to.deep.equal(sortedNames);
  });

  // Test for sorting by SALARY in ascending order
  it('should sort users by salary in ascending order', async function() {
    const res = await request(app)
      .get('/users?sort=SALARY')
      .expect(200);
    const salaries = res.body.results.map(user => user.salary);
    const sortedSalaries = [...salaries].sort((a, b) => a - b);
    expect(salaries).to.deep.equal(sortedSalaries);
  });

  // Test for illegal sort parameter
  it('should return an error for an illegal sort parameter', async function() {
    const res = await request(app)
      .get('/users?sort=invalidParam')
      .expect(400);
    expect(res.body).to.have.property('error');
  });

  // Test for offset and limit
  it('should return a limited number of users based on offset and limit', async function() {
    // Get full list of users first
    const fullRes = await request(app)
      .get('/users')
      .expect(200);
    const allUsers = fullRes.body.results;
    if (allUsers.length < 3) {
      console.log('Not enough users to test offset and limit');
      return;
    }
    const offset = 1;
    const limit = 2;
    const res = await request(app)
      .get(`/users?offset=${offset}&limit=${limit}`)
      .expect(200);
    expect(res.body.results).to.deep.equal(allUsers.slice(offset, offset + limit));
  });
});
