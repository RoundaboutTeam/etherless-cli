import JSFileParser from '../src/FileParser/JSFileParser';

const fs = require('fs');

const filePath : string = 'fileToBeParsed.js';
const funcName : string = 'foo';
const funcSignature : string = '(var1, var2, var2)';

describe('JSFileParser', () => {
  let fileParser = new JSFileParser();
  beforeAll(function () {
    const fileCode : string = `function ${funcName}${funcSignature} {}`;
    fs.writeFileSync(filePath, fileCode);
    fileParser = new JSFileParser();
    fileParser.parse(filePath);
  });

  afterAll(() => {
    fs.unlinkSync(filePath);
  });

  test('getting function signature', function () {
    expect(fileParser.getFunctionSignature(funcName)).toEqual(funcSignature);
  });

  test('checking function existence', function () {
    expect(fileParser.existsFunction(funcName)).toEqual(true);
  });
});
