#!/usr/bin/env ts-node-script

import SignupCommand from './Command/SignupCommand';
import LoginCommand from './Command/LoginCommand';
import LogoutCommand from './Command/LogoutCommand';
import ListCommand from './Command/ListCommand';
import InfoCommand from './Command/InfoCommand';
import CommandManager from './Command/CommandManager';

const commandTypes : Array<any> = [SignupCommand, LoginCommand,
  LogoutCommand, ListCommand, InfoCommand];

commandTypes.forEach(
  (CommandType) => CommandManager.addCommand(new CommandType()),
);

CommandManager.init();
