import Command from './Command';

const yargs = require('yargs');

class CommandManager {
  /**
   * @param command: to be added to managed commands
   */
  static addCommand(command : Command) : void {
    yargs.command(
      command.getCommand(),
      command.getDescription(),
      command.builder,
      (args : any) => {
        command.exec(args)
          .then((result : string) => console.log(`${result}`))
          .catch((error : any) => {
            const message : string = error.reason ? error.reason : error.message;
            console.log(`Something went wrong! \nError: ${message}`);
          });
      },
    );
  }

  /**
   * @description: finish initalization of yargs, after this the CLI is ready
   *               to manage all added commands
   */
  static init() : void {
    const commands = yargs.getCommandInstance().getCommands();
    const argv = yargs.argv;
    if (!argv._[0] || commands.indexOf(argv._[0]) === -1) {
      console.log('Non-existing or no command specified');
    }
  }
}

export default CommandManager;
