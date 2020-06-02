
import { Argv } from 'yargs';
import * as inquirer from 'inquirer';

import Command from './Command';

class LoginMNCommand extends Command {
  //Dont forget quotes: "+menmonic+"
  command = 'loginm <mnemonic>';

  description = 'login inside Ethereum network';

  async exec(args: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([{
          type: 'password',
          message: 'Enter mnemonic phrase to encrypt your wallet: ',
          name: 'password',
        }])
        .then((answers) => {
          try {
            this.ethManager.loginWithMnemonicPhrase(args.mnemonic, answers.password);
            resolve('Login successfully done within the Ethereum network');
          } catch (e) {
            reject(e);
          }
        });
    });
  }

  builder(yargs : Argv) : any {
    return yargs.positional('mnemonic', {
      describe: 'Mnemonic phrase of the address to log on',
      type: 'string',
    });
  }
}

export default LoginMNCommand;
