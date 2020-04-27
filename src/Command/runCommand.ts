import { Argv } from 'yargs';
import { ethers, Contract, Wallet, getDefaultProvider, EventFilter } from 'ethers';

import Command from './command';

const ESmart = require('../../contracts/EtherlessSmart.json');

class ExecCommand extends Command {
  command = 'run <function_name> [params..]';

  description = 'execute a function ';

  async exec(args: any) : Promise<any> {
    // if(UserSession.getInstance().isLogged) {
    const wallet : Wallet = new ethers.Wallet('0x326712c09375d35e396b0cd80bc7002f13cd227b70e1959686f28ca994a28635',
      getDefaultProvider('ropsten'));
    const contract : Contract = new ethers.Contract('0x2eB8B6049391BD385DDD59aA020e8BC85f9eF57e', ESmart.abi,
      getDefaultProvider('ropsten')).connect(wallet);

    const requestId : string = ethers.utils.bigNumberify(ethers.utils.randomBytes(4)).toString();
    const functionName : string = args.function_name;
    const params : string = args.params.toString();

    console.log('Creating request...');
    let tx = await contract.runFunction(functionName, params, requestId,
      { value: ethers.utils.parseEther('0.001') });
    await tx.wait();
    console.log('Request done.');

    // to add: filter for the request ud
    const eventFilter : EventFilter = contract.filters.response();
    console.log('Waiting for the result...');
    return new Promise<string>((resolve, reject) => {
      contract.on(eventFilter, (result, id, event) => {
        resolve(result);
        contract.removeAllListeners(eventFilter);
      });
    });
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