import JSFileParser from '../src/FileParser/JSFileParser';
import FileParser from '../src/FileParser/FileParser';

const fs = require('fs');

const fileContent : string = 'function foo(var1, var2, var3) {}';
const funcName : string = 'foo';
const funcSignature : string = '(var1, var2, var3)';

let fileParser : FileParser;

beforeEach(() => {
  fileParser = new JSFileParser();
});

test('parsing not existing file', () => {
  fs.existsSync = jest.fn().mockImplementationOnce(
    (filePath) => false,
  );

  expect(() => fileParser.parse('mockPath')).toThrowError();
});


/*test('parsing existing file', () => {
  fs.existsSync = jest.fn().mockImplementationOnce(
    (filePath) => true,
  );

  fs.readFileSync = jest.fn().mockImplementationOnce(
    (filePath) => fileContent,
  );

  expect(() => fileParser.parse('mockPath')).not.toThrowError();
});*/

test('get function signature on not loaded file', () => {
  expect(() => fileParser.getFunctionSignature('mockFuncName')).toThrowError();
});

/*
test('request function signature of not existing function', () => {
  fs.existsSync = jest.fn().mockImplementationOnce(
    (filePath) => true,
  );

  fs.readFileSync = jest.fn().mockImplementationOnce(
    (filePath) => fileContent,
  );

  fileParser.parse('randomFilePath');
  expect(() => fileParser.getFunctionSignature('randomFuncName')).toThrowError();
});

test('get function signature of existing function', () => {
  fs.existsSync = jest.fn().mockImplementationOnce(
    (filePath) => true,
  );

  fs.readFileSync = jest.fn().mockImplementationOnce(
    (filePath) => fileContent,
  );

  fileParser.parse('randomFilePath');
  expect(fileParser.getFunctionSignature(funcName)).toEqual(funcSignature);
});

test('check presence of function', () => {
  fs.existsSync = jest.fn().mockImplementationOnce(
    (filePath) => true,
  );

  fs.readFileSync = jest.fn().mockImplementationOnce(
    (filePath) => fileContent,
  );

  fileParser.parse('randomFilePath');
  expect(fileParser.existsFunction(funcName)).toBeTruthy();
});

test('check presence of function on not loaded file', () => {
  expect(() => fileParser.existsFunction('randomFuncName')).toThrowError();
});
*/
