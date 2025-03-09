// Updated ESM syntax:
export const processCSV = (csvData) => {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have a header and at least one data row');
    }
  
    const header = lines[0].split(',');
    if (header.length !== 2 || header[0].trim() !== 'Name' || header[1].trim() !== 'Salary') {
      throw new Error('Invalid CSV header');
    }
  
    const users = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length !== 2) {
        throw new Error(`Invalid number of columns in row ${i + 1}`);
      }
      const name = parts[0].trim();
      const salary = parseFloat(parts[1].trim());
      if (isNaN(salary)) {
        throw new Error(`Salary is not a number in row ${i + 1}`);
      }
      if (salary < 0.0) continue;
      users.push({ name, salary });
    }
    return users;
  };
  