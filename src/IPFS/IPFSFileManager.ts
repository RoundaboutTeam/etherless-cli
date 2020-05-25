import FileManager from './FileManager';
import { rejects } from 'assert';

const IpfsClient = require('ipfs-http-client');
const fs = require('fs');

class IPFSFileManager implements FileManager {
  private ipfs : any;

  constructor() {
    this.ipfs = new IpfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
  }

  public async save(path: string) : Promise<string> {
    const file = fs.readFileSync(path);
    const results = [];
    for await (const result of this.ipfs.add({path: path, content: file})) {
      results.push(result);
    }

    return results[0].cid;
  }

  public async get(cid : string) : Promise<Buffer> {
    const chunks = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }
}

export default IPFSFileManager;
