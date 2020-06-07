import { Argv } from 'yargs';
import { getDefaultProvider } from 'ethers';
import Command from './Command';
import EtherlessManager from '../Manager/EtherlessManager';
import BriefFunction from '../EtherlessContract/BriefFunction';

class ListCommand extends Command {
  command = 'list [m]';

  description = 'list functions inside Etherless platform';

  async exec(args: any) : Promise<string> {
    try {
      const em : EtherlessManager = new EtherlessManager(getDefaultProvider('ropsten'));
      let resDesc : string = args.m ? 'Displaying all functions owned by current user\n'
        : 'Displaying all functions inside Etherless platform\n';

      if (args.m) {
        if (!em.userLogged()) return 'You must be logged!';

        const list : Array<BriefFunction> = await em.listMyFunctions();

        if (list.length === 0) {
          resDesc += 'There are no functions owned by the user inside Etherless platform!';
        } else {
          resDesc += list.map((item : BriefFunction) => `${item.name} ${item.price}`).join('\n');
        }
      } else {
        const list : Array<BriefFunction> = await em.listAllFunctions();

        if (list.length === 0) {
          resDesc += 'There are no functions inside Etherless platform!';
        } else {
          resDesc += list.map((item : BriefFunction) => ` -Name: ${item.name}, price: ${item.price}`).join('\n');
        }
      }

      return resDesc;
    } catch (error) {
      return error.reason;
    }
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
