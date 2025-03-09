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

describe('GET /users after CSV upload', function() {
  it('should return updated users matching default salary range (0 - 4000)', async function() {
    // perform the valid upload
    await request(app)
      .post('/upload')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ file: validCsv });
    // get the users
    const res = await request(app)
      .get('/users')
      .expect(200);
    const names = res.body.results.map(u => u.name);
    expect(names).to.include('John');
  });
});
