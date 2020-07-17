import { Argv } from 'yargs';

import Command from './Command';

class WhoAmICommand extends Command {
  command = 'whoami';

  description = 'Description:\n_\b  Show the address of the current session';

  /**
   * @method exec
   * @param yargs: arguments nedded for the command
   * @description the command returns the address of the current user.
   *  If no user is logged, an error is thrown.
   */
  async exec(args: any) : Promise<string> {
    return `Current user address: ${this.session.getAddress()}`;
  }

  /**
   * Descriptor of the command
   * @param yargs: object used to define the command params
   */
  builder(yargs : Argv) : any {
    return {};
  }
}

export default WhoAmICommand;
