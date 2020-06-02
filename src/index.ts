#!/usr/bin/env ts-node-script

import SignupCommand from './Command/SignupCommand';
import LoginCommand from './Command/LoginCommand';
import LoginMNCommand from './Command/LoginMnemonicCommand';
import LogoutCommand from './Command/LogoutCommand';
import ListCommand from './Command/ListCommand';
import WhoAmICommand from './Command/WhoAmI';
import Init from './Command/Init';
import CommandManager from './Command/CommandManager';


const commandTypes : Array<any> = [SignupCommand, LoginCommand,
  LogoutCommand, ListCommand, WhoAmICommand, Init, LoginMNCommand];

commandTypes.forEach(
  (CommandType) => CommandManager.addCommand(new CommandType()),
);

CommandManager.init();
