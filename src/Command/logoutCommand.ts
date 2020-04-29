import { Argv } from 'yargs';
import Command from './command';
import UserSession from '../Session/userSession';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  async exec(args: any) : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      UserSession.getInstance().logout();
      console.log('Logout from Ethereum network');
    });
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default LogoutCommand;
