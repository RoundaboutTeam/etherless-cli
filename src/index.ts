#!/usr/bin/env ts-node-script

/*

  import LogoutCommand from './Command/LogoutCommand';
  import ListCommand from './Command/ListCommand';
  import InfoCommand from './Command/InfoCommand';
  import WhoAmICommand from './Command/WhoAmI';
  import Init from './Command/Init';

  import RunCommand from './Command/RunCommand';

  const commandTypes : Array<any> = [SignupCommand, LoginCommand,
    LogoutCommand, ListCommand, InfoCommand,
    WhoAmICommand, Init, LoginMNCommand];
*/


import { getDefaultProvider } from 'ethers';

import Command from './Command/Command';
import CommandManager from './Command/CommandManager';

import SignupCommand from './Command/SignupCommand';
import LoginCommand from './Command/LoginCommand';
import LogoutCommand from './Command/LogoutCommand';

import EthereumUsesSession from './Session/EthereumUserSession';

const ethSession : EthereumUsesSession = new EthereumUsesSession(getDefaultProvider('ropsten'));
const commands : Array<Command> = [
  new LoginCommand(ethSession),
  new SignupCommand(ethSession),
  new LogoutCommand(ethSession),
];

commands.forEach(
  (command) => CommandManager.addCommand(command),
);

CommandManager.init();
