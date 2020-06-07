import { expect, assert } from 'chai';
import {
  describe,
  it,
  before,
  after,
} from 'mocha';

import JSFileParser from '../src/FileParser/JSFileParser';

const fs = require('fs');

const filePath : string = 'fileToBeParsed.js';
const funcName : string = 'foo';
const funcSignature : string = '(var1, var2, var2)';

describe('JSFileParser', () => {
  before(function () {
    const fileCode : string = `function ${funcName}${funcSignature} {}`;
    fs.writeFileSync(filePath, fileCode);
    this.fileParser = new JSFileParser();
    this.fileParser.parse(filePath);
  });

  after(() => {
    fs.unlinkSync(filePath);
  });

  it('getting function signature', function () {
    expect(this.fileParser.getFunctionSignature(funcName)).to.be.equal(funcSignature);
  });

  it('checking function existence', function () {
    expect(this.fileParser.existsFunction(funcName)).to.be.equal(true);
  });
});
