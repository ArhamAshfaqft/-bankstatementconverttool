import { extractTableFromPdf } from './src/lib/pdfParser.js';
import fs from 'fs';

// Mock File object that works for our util
class MockFile {
  constructor(path) {
    this.path = path;
  }
}

// Override fileToTypedArray locally to bypass FileReader 
import * as pdfParser from './src/lib/pdfParser.js';
pdfParser.fileToTypedArray = async function(file) {
  return new Uint8Array(fs.readFileSync(file.path));
}

async function run() {
  const result = await extractTableFromPdf(new MockFile('sample_bank_statement.pdf'));
  console.log("FINAL PARSED RESULT:");
  result.forEach(row => console.log(JSON.stringify(row)));
}

run().catch(console.error);
