import { Argv } from 'yargs';
import { getDefaultProvider } from 'ethers';
import * as inquirer from 'inquirer';
import Command from './Command';
import EtherlessManager from '../Manager/EtherlessManager';
import BriefFunction from '../EtherlessContract/BriefFunction';

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  async exec(args: any) : Promise<string> {
    const em : EtherlessManager = new EtherlessManager(getDefaultProvider('ropsten'));
    const resDesc : string = args.m ? 'Displaying all functions owned by current user\n'
      : 'Displaying all functions inside Etherless platform\n';

    // if (args.m) {
    // console.log('Displaying all functions owned by current user inside Etherless platform');
    // } else {
    const list : Array<BriefFunction> = await em.listAllFunctions();
    return resDesc + list.map((item : BriefFunction) => `${item.name} ${item.price}`).join('\n');
    // }
  }

  builder(yargs : Argv) : any {
    return yargs.option('m', {
      describe: 'Display only functions owns by the current user',
      type: 'boolean',
      default: false,
    });
  }
}

export default ListCommand;
