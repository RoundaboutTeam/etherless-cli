import {Argv} from 'yargs';

abstract class Command {
  protected command : string;

  protected description : string;

  abstract builder(yargs : Argv) : any;

  /**
   * @abstract
   * @method exec
   * @param yargs: arguments nedded for the command
   */
  abstract exec(args : any) : void;

  /**
   * @method getCommand
   * @returns the command string
   */
  getCommand() : string {
    return this.command;
  }

  /**
   * @method getDescription
   * @returns the command's description
   */
  getDescription() : string {
    return this.description;
  }
}

export default Command;
