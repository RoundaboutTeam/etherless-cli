import { Argv } from 'yargs';
import Command from './Command';

class LogoutCommand extends Command {
  command = 'logout';

  description = 'logout from Ethereum network';

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command deletes all information about the current user. If no user
   * is logged, it throw a corrisponding error
   */
  async exec(args: any) : Promise<string> {
    this.session.logout();
    return 'Logout from Ethereum network successfully done';
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return {};
  }
}

export default LogoutCommand;
