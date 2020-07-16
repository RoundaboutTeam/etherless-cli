import { Argv } from 'yargs';
import { Wallet } from 'ethers';

import Command from './Command';

const fs = require('fs');

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'Description:\n_\b  Create a new account';

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command creates a new ethereum wallet and return a string
   *  with all its information. If the save flag is indicated, the wallet credentials
   *  will be saved in a file.
   */
  async exec(args: any) : Promise<any> {
    const wallet : Wallet = this.session.signup();

    // check if the user request to save the credentials
    if (args.save) {
      fs.writeFileSync('./credentials.txt', `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`);
    }

    // return wallet credentials
    return `Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.option('save', {
      describe: 'Decide if save credentials in file',
      type: 'boolean',
      default: false,
    });
  }
}

export default SignupCommand;
