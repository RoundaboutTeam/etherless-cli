import { Argv } from 'yargs';
import { getDefaultProvider } from 'ethers';
import Command from './Command';
import Function from '../EtherlessContract/Function';

class InfoCommand extends Command {
  command = 'info <function_name>';

  description = 'info of a specific function inside Etherless platform';

  async exec(args: any) : Promise<string> {
    try {
      const listInfo : Function = await em.getFunctionInfo(args.function_name);
      let info: string = `Informations about '${listInfo.name}' function:\n`;
      info += `  - Owner: ${listInfo.owner}\n`;
      info += `  - Signature: ${listInfo.signature}\n`;
      info += `  - Price: ${listInfo.price}\n`;
      info += `  - Description: ${listInfo.description}`;

      return info;
    } catch (error) {
      return error.reason;
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('function_name', {
      describe: 'Name of the function you want to view informations',
      type: 'string',
    });
  }
}

export default InfoCommand;
