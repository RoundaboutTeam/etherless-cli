import { Argv } from 'yargs';

import Command from './Command';
import UserInfo from '../Session/UserInfo';
import { Wallet } from 'ethers';

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'create a new account';

  async exec(args: any) : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      console.log('Creating a new account');
      if (args.save === true) {
        console.log('And saving credentials in file');
      }
      try{
        const wallet : Wallet = this.ethManager.signup(args.save);
        resolve(`Address: ${wallet.address} \nPrivate Key: ${wallet.privateKey} \nMnemonic phrase: ${wallet.mnemonic}`);
      }catch(e){
        reject(e);
      }
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
