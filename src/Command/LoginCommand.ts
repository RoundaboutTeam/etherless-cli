import { Argv } from 'yargs';
import { Wallet } from 'ethers';

import * as Inquirer from 'inquirer';
import Command from './Command';

class LoginCommand extends Command {
  command = 'login [m] <value..>';

  description = 'Description:\n_\b  Login inside Ethereum network';

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command deletes the function indicated by the user,
   * if an error occurs, a corresponding exception will be thrown
   */
  async exec(args: any) : Promise<string> {
    // request the password to encrypt the wallet
    const password : string = await Inquirer
      .prompt([{
        type: 'password',
        message: 'Enter the password to encrypt your wallet: ',
        name: 'password',
      }]).then((answer : any) => answer.password);

    // check if the user want to access using mnemonic or private key
    const value : string = args.value.join(' ');
    const wallet : Wallet = args.m
      ? this.session.loginWithMnemonicPhrase(value, password)
      : this.session.loginWithPrivateKey(value, password);

    return `Login successfully done within the Ethereum network with address ${wallet.address}`;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return yargs.positional('value', {
      describe: 'Value to access the wallet, it can be a private key or mnemonic phrase',
    }).option('m', {
      describe: 'If true value must be a mnemonic phrase',
      type: 'boolean',
    });
  }
}

export default LoginCommand;
