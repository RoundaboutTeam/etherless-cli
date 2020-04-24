#!/usr/bin/env node

import RunCommand from './Command/runCommand';
import DeleteCommand from './Command/deleteCommand';
import SignupCommand from './Command/signupCommand';
import CommandManager from './Command/commandManager';

CommandManager.addCommand(new RunCommand());
CommandManager.addCommand(new DeleteCommand());
CommandManager.addCommand(new SignupCommand());
CommandManager.init();
