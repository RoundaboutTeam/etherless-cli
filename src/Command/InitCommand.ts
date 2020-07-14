import { Argv } from 'yargs';

import Command from './Command';

const Table = require('cli-table3');

class InitCommand extends Command {
  command = 'init';

  description = 'Functionality showcase';

  async exec(args: any) : Promise<any> {
    const intro = new Table({chars:{'mid': ' ', 'left-mid': '|', 'mid-mid': ' ', 'right-mid': '|'}});
    intro.push(
      ['Welcome to Etherless'],
      ['Perform any action following the sintax below :'],
      ['etherless <command_name> [-flag] [params..]']
    );

    const table = new Table({
      head:['Command','Description']}
    );
    table.push(
      ['signup \n\n\n\n\nsignup -save','Signup into ethereum network, the following information will be provided:\n-Private Key, \n-Mnenonic Phrase, \n-Address\n\nSave credentials to file'],
      ['login <your_private_key> | -m <your_mnemonic_phrase>','Login into the ethereum network'],
      ['logout','Logout from ethereum network'],
      ['whoami','Return the address of your current session']
    );

    return intro.toString()+'\n'+table.toString();
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default InitCommand;
