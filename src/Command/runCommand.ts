import { Argv } from 'yargs';
import {
  ethers,
  Contract,
  getDefaultProvider,
  EventFilter,
  Wallet,
} from 'ethers';
import { BigNumber } from 'ethers/utils';
import * as inquirer from 'inquirer';

import Command from './command';
import SessionManager from '../Session/sessionManager';

const ESmart = require('../../contracts/EtherlessSmart.json');

class ExecCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function ';

  async exec(args: any) : Promise<any> {
    try {
      let password = '';

      if (!SessionManager.isLogged()) {
        throw new Error('To execute this command you must be logged');
      }

      await inquirer
        .prompt([{
          type: 'password',
          message: 'Enter the password to decrypt your wallet: ',
          name: 'password',
        }])
        .then((answers) => {
          password = answers.password;
        });

      const wallet : Wallet = (await SessionManager.getWallet(password)).connect(getDefaultProvider('ropsten'));
      const contract : Contract = new ethers.Contract('0xF93aB9d297bc05C373eA788C83f506E812c36DFF', ESmart.abi,
        getDefaultProvider('ropsten')).connect(wallet);

      const functionName : string = args.function_name;
      const params : string = args.params.toString();

      console.log('Creating request to execute function..');
      const tx = await contract.runFunction(functionName, params, { value: ethers.utils.parseEther('0.001') });

      console.log(`Sending request, transaction hash: ${tx.hash}`);
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
