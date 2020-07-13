import FileManager from './FileManager';
import DeployInfo from './DeployInfo';

class IPFSFileManager implements FileManager {
  private ipfs : any;

  constructor(ipfsObj : any) {
    this.ipfs = ipfsObj;
  }

  /**
  * @returns The IPFS CID related to the uploaded JSON
  * @param buffer The buffer you want to save to IPFS
  */
  public async save(deployInfo : DeployInfo) : Promise<string> {
    return new Promise((resolve, reject) => {
      this.ipfs.addJSON(deployInfo)
        .then(resolve)
        .catch((error : Error) => {
          reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
        });
    });
  }

  /**
  * @returns The JSON object corresponding to the given CID
  * @param {*} hash The IPFS CID has you want to get the JSON
  */
  public async get(cid : string) : Promise<DeployInfo> {
    return new Promise((resolve, reject) => {
      this.ipfs.catJSON(cid)
        .then((result : DeployInfo) => resolve(result))
        .catch((error : Error) => {
          reject(new Error(`It seems that there are some problems with IPFS, error: ${error}`));
        });
    });
  }
}


export default IPFSFileManager;
