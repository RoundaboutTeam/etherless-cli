export default interface FileParser {
  existsFunction(name: string) : boolean;
  getFunctionSignature(name: string) : string;
}
