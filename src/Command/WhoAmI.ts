import { Argv } from 'yargs';

import Command from './Command';
import * as inquirer from 'inquirer';

class WhoAmICommand extends Command {
  command = 'whoami';

  description = 'show current wallet address';

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
              this.ethManager.getAddress(answers.password).then((result) => resolve('Your address is '+result));
            } catch (e) {
              reject(e);
            }
          });
      });
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default WhoAmICommand;
