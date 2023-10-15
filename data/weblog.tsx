const Papa = require('papaparse');
import { readFile } from 'fs';

let csv;

readFile('./weblog.csv', (err, data) => {
  if (err) throw err;
  csv = data;
  console.log(csv);
});

export default csv;
