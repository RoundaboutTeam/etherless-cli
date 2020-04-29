import { Argv } from 'yargs';
import Command from './command';
import UserSession from '../Session/userSession';

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'create a new account';

  async exec(args: any) : Promise<any> {
    console.log('Creating new account...');
    return new Promise<string>((resolve, reject) => {
      const userinfo = UserSession.signup();
      if (args.save === true) {
        console.log('And saving credentials in file');
      }
      console.log('Your address is: ' + userinfo.address);
      console.log('Your private key is: ' + userinfo.privateKey);
      console.log('Your mnemonic phrase is: ' + userinfo.mmenomic);
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
