import { Argv } from 'yargs';
import Command from './command';

class SignupCommand extends Command {
  command = 'signup [save]';

  description = 'create a new account';

  async exec(args: any) : Promise<any> {
    console.log('Creating new account...');
    if (args.save === true) {
      console.log('And saving credentials in file');
    }
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
