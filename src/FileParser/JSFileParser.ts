import FileParser from './FileParser';

const fs = require('fs');
const { Parser } = require('acorn');

class JSFileParser implements FileParser {
  private parsedFile : any;

  constructor(path : string) {
    if (!this.fileExists(path)) {
      throw new Error('File doesn\'t exists');
    }

    this.parsedFile = Parser.parse(fs.readFileSync(path).toString());
  }

  public existsFunction(funcName: string) : boolean {
    return this.findFuncNode(funcName) !== undefined;
  }

  public getFunctionSignature(funcName: string) : string {
    if (!this.existsFunction(funcName)) {
      throw new Error(`No function ${funcName} found in file`);
    }

    const funcNode : any = this.findFuncNode(funcName);
    const funcParams : string = this.funcSignatureFromNode(funcNode);
    return `(${funcParams})`;
  }

  private fileExists(path: string) : boolean {
    return fs.existsSync(path);
  }

  private findFuncNode(funcName: string) : any {
    return this.parsedFile.body.find((x : any) => x.id.name === funcName);
  }

  private funcSignatureFromNode(funcNode: any) : string {
    return funcNode.params.map((param : any) => param.name).join(', ');
  }
}

export default JSFileParser;
