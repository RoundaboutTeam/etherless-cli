import DeployInfo from './DeployInfo';

export default interface FileManager {
  save(data : DeployInfo) : Promise<string>;
  get(CID : string) : Promise<DeployInfo>;
}
