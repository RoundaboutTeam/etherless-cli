import { Argv } from 'yargs';
import * as inquirer from 'inquirer';

import Command from './Command';

class LoginPKCommand extends Command {
  command = 'login <private_key>';

  description = 'login inside Ethereum network';

  async exec(args: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([{
          type: 'password',
          message: 'Enter a password to encrypt your wallet: ',
          name: 'password',
        }])
        .then((answers) => {
          try {
            this.ethManager.loginWithPrivateKey(args.private_key, answers.password);
            resolve('Login successfully done within the Ethereum network');
          } catch (e) {
            reject(e);
          }
        });
    });
  }

  builder(yargs : Argv) : any {
    return yargs.positional('private_key', {
      describe: 'Private key of the address to log on',
      type: 'string',
    });
  }
}

export default LoginPKCommand;
