import { Argv } from 'yargs';
import {
  ethers,
  Contract,
  getDefaultProvider,
  EventFilter,
} from 'ethers';
import { BigNumber } from 'ethers/utils';

import Command from './command';
import UserSession from '../Session/userSession';

const ESmart = require('../../contracts/EtherlessSmart.json');

class ExecCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function ';

  async exec(args: any) : Promise<any> {
    try {
      const contract : Contract = new ethers.Contract('0xF93aB9d297bc05C373eA788C83f506E812c36DFF', ESmart.abi,
        getDefaultProvider('ropsten')).connect(UserSession.getInstance().getWallet());

      const functionName : string = args.function_name;
      const params : string = args.params.toString();

      console.log('Creating request to execute function..');
      const tx = await contract.runFunction(functionName, params, { value: ethers.utils.parseEther('0.001') });

      console.log('Sending request...');
      const receipt = await tx.wait();

      console.log('Request done.');
      const requestId : BigNumber = contract.interface.parseLog(receipt.events[0]).values.id;

      console.log('Waiting for the result...');
      const eventFilter : EventFilter = contract.filters.response(null, requestId);
      return new Promise<string>((resolve, reject) => {
        contract.on(eventFilter, (result, id, event) => {
          resolve(JSON.parse(result).message);
          contract.removeAllListeners(eventFilter);
        });
      });
    } catch (error) {
      return new Promise((resolve, reject) => { reject(error); });
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function to execute',
      type: 'string',
    }).option('params', {
      describe: 'Array of params to use for the execution',
      type: 'array',
    });
  }
}

export default ExecCommand;
