import { BigNumber } from 'ethers/utils';
import Function from './Function';
import BriefFunction from './BriefFunction';
import HistoryItem from './HistoryItem';

export default interface EthContract {
  getAllFunctions() : Promise<Array<BriefFunction>>;
  getFunctionInfo(name : string) : Promise<Function>;
  getFunctionCost(name : string) : Promise<number>;
  getExecHistory() : Promise<Array<HistoryItem>>
  updateFunctionDesc(name: string, newDesc : string) : Promise<boolean>;

  sendRunRequest(name : string, params: string) : Promise<BigNumber>;
  sendDeleteRequest(name: string) : Promise<BigNumber>;
  sendCodeUpdateRequest(name: string, filePath: string) : Promise<BigNumber>;
  sendDeployRequest(name: string, filePath: string, desc : string) : Promise<BigNumber>;

  listenRunResponse(requestId : BigNumber) : Promise<string>;
  listenDeleteResponse(requestId : BigNumber) : Promise<string>;
  listenCodeUpdateResponse(requestId : BigNumber) : Promise<string>;
  listenDeployResponse(requestId : BigNumber) : Promise<string>;
}
