import { Argv } from 'yargs';
import { table } from 'table';

import Command from './Command';

const chalk = require('chalk');

class InitCommand extends Command {
  command = 'init';

  description = 'Description:\n_\b  Guide to basic Etherless functionality';

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command returns an introduction to the product
   */
  async exec(args: any) : Promise<any> {
    // introduction to the product
    let data = table([
      [chalk.bgRed('Welcome to Etherless')],
      ['Perform any action following the sintax below : \netherless <command_name> [-flag] [params..] '],
    ], {
      columns: {
        0: {
          width: 50,
          alignment: 'center',
        },
      },
    });

    // some commands that can be useful to the user
    data += table([
      [chalk.bold('Command'), chalk.bold('Description')],
      ['signup \n\n\n\n\n\nsignup -save', 'Signup into Ethereum network, the following information will be provided:\n-Private Key, \n-Mnenonic Phrase, \n-Address\n\nSave credentials to file'],
      ['login <your_private_key> | -m <your_mnemonic_phrase>', 'Login into the ethereum network'],
      ['logout', 'Logout from ethereum network'],
      ['whoami', 'Return the address of your current session'],
    ], {
      columns: {
        0: {
          width: 30,
        },
        1: {
          width: 50,
        },
      },
    });

    return data;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return {};
  }
}

export default InitCommand;
