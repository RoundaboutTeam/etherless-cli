import { Argv } from 'yargs';
import Command from './command';
import SessionManager from '../Session/sessionManager';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  async exec(args: any) : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      try {
        SessionManager.logout();
        resolve('Logout from Ethereum network done successfully');
      } catch (error) {
        reject(error);
      }
    });
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default LogoutCommand;
