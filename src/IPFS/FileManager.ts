export default interface FileManager {
  save(path: string) : Promise<string>;
  get(CID : string) : Promise<Buffer>;
}
