import { Argv } from 'yargs';
import * as fs from 'fs';

import Command from './command';
import SessionManager, { UserInfo } from '../Session/sessionManager';

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'create a new account';

  async exec(args: any) : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      console.log('Creating a new account');
      const userinfo : UserInfo = SessionManager.signup();
      if (args.save === true) {
        console.log('And saving credentials in file');

        fs.writeFile('./credential.txt', `Address: ${userinfo.address} \nPrivate Key: ${userinfo.privateKey} \nMnemonic phrase: ${userinfo.mnemonic}`, (err) => {
          if (err) {
            reject(err);
          }
        });
      }
      resolve(`Address: ${userinfo.address} \nPrivate Key: ${userinfo.privateKey} \nMnemonic phrase: ${userinfo.mnemonic}`);
    });
  }

  builder(yargs : Argv) : any {
    return yargs.option('save', {
      describe: 'Decide if save credentials in file',
      type: 'boolean',
      default: false,
    });
  }
}

export default SignupCommand;
