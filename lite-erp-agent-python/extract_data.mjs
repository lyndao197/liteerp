import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file
const mockStorePath = path.join(__dirname, '../lite-erp-ui/src/utils/mockStore.js');
let content = fs.readFileSync(mockStorePath, 'utf-8');

// The file starts with `const INITIAL_DATA = {` and ends the object before `const STORE_KEY`.
const startIndex = content.indexOf('const INITIAL_DATA = {');
const endIndex = content.indexOf('const STORE_KEY =');

if (startIndex !== -1 && endIndex !== -1) {
    let dataStr = content.substring(startIndex, endIndex);
    // Replace `const INITIAL_DATA = ` with nothing to get just the object
    dataStr = dataStr.replace('const INITIAL_DATA = ', '').trim();
    // Remove the trailing semicolon
    if (dataStr.endsWith(';')) {
        dataStr = dataStr.slice(0, -1);
    }
    
    // Evaluate the string into a JS object (safe because it's our own code)
    const dataObj = eval('(' + dataStr + ')');
    
    // Write to JSON
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(dataObj, null, 2));
    console.log('Successfully extracted data.json');
} else {
    console.error('Failed to parse mockStore.js');
}
