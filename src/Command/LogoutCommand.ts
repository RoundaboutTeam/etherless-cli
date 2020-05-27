import { Argv } from 'yargs';
import Command from './Command';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  async exec(args: any) : Promise<any> {
    return new Promise<string>((resolve, reject) => {
      try {
        this.ethManager.logout();
        resolve('Logout from Ethereum network successfully done');
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