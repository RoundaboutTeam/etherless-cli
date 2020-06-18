import { Argv } from 'yargs';

import Command from './Command';

class Init extends Command {
  command = 'init';

  description = 'Functionality showcase';

  async exec(args: any) : Promise<any> {
    return new Promise((resolve, reject) => {
        resolve('Welcome to ehterless-cli \nList of commands, use etherless <command name>: \n>login \n>logout \n>signup \n>whoami');
      });
  }

  builder(yargs : Argv) : any {
    return {};
  }
}

export default Init;
