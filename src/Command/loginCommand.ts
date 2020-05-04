import { Argv } from 'yargs';
import * as inquirer from 'inquirer';

import Command from './command';
import SessionManager from '../Session/sessionManager';

// import UserSession from '../Session/userSession';

class LoginPKCommand extends Command {
  command = 'login <private_key>';

  description = 'login inside Ethereum network';

  async exec(args: any) : Promise<any> {
    try {
      let password = '';

      await inquirer
        .prompt([{
          type: 'password',
          message: 'Enter a password to encrypt your wallet: ',
          name: 'password',
        }])
        .then((answers) => {
          password = answers.password;
        });
      SessionManager.loginWithPrivateKey(args.private_key, password);
      return new Promise<string>((resolve, reject) => {
        resolve('Login successfully done within the Ethereum network');
      });
    } catch (error) {
      return new Promise((resolve, reject) => { reject(error); });
    }
  }

  builder(yargs : Argv) : any {
    return yargs.positional('private_key', {
      describe: 'Private key of the address to log on',
      type: 'string',
    });
  }
}

export default LoginPKCommand;
