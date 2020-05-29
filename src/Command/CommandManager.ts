import * as yargs from 'yargs';

import Command from './Command';

class CommandManager {
  /**
   * @param command: to be added to managed commands
   */
  static addCommand(command : Command) : void {
    yargs.command(
      command.getCommand(),
      command.getDescription(),
      command.builder,
      (args) => {
        command.exec(args)
          .then((result : string) => console.log(`${result}`))
          .catch((error : Error) => console.log(`Something went wrong: ${error.name} \nMessage: ${error.message}`));
      },
    );
  }

  /**
   * @description: finish initalization of yargs, after this the CLI is ready
   *               to manage all added commands
   */
  static init() : void {
    yargs.parse();
  }
}

export default CommandManager;
