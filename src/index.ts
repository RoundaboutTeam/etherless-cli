#!/usr/bin/env ts-node

import RunCommand from './Command/runCommand';
import DeleteCommand from './Command/deleteCommand';
import SignupCommand from './Command/signupCommand';
import LoginCommand from './Command/loginCommand';
import LogoutCommand from './Command/logoutCommand';
import ListCommand from './Command/listCommand';
import HistoryCommand from './Command/historyCommand';
import CommandManager from './Command/commandManager';

const commandTypes : Array<any> = [RunCommand, DeleteCommand, SignupCommand, LoginCommand,
  LogoutCommand, ListCommand, HistoryCommand];

commandTypes.forEach(
  (CommandType) => CommandManager.addCommand(new CommandType()),
);

CommandManager.init();
