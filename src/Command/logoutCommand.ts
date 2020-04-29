import { Argv } from 'yargs';
import Command from './command';
import UserSession from '../Session/userSession';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  async exec(args: any) : Promise<any> {
    try {
      UserSession.getInstance().logout();
      console.log('Logout from Ethereum network');
    } catch (error) {
      console.log(error);
    }
  }

  builder(yargs : Argv) : any {
    return null;
  }
}

export default LogoutCommand;
