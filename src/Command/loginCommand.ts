import { Argv } from 'yargs';
import Command from './command';
import UserSession from '../Session/userSession';

class LoginCommand extends Command {
  command = 'login <private_key>';

  description = 'login inside Ethereum network';

  async exec(args: any) : Promise<any> {
    UserSession.getInstance().loginWithPrivateKey(`${args.private_key}`);
    console.log(`Login inside Ethereum network with private key: ${args.private_key}`);
  }

  builder(yargs : Argv) : any {
    return yargs.positional('private_key', {
      describe: 'Private key of the address to log on',
      type: 'string',
    });
  }
}

export default LoginCommand;
