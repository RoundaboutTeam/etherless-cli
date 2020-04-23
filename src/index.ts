#!/usr/bin/env node

import SayCommand from './Command/sayCommand';
import CommandManager from './Command/commandManager';

CommandManager.addCommand(new SayCommand());
CommandManager.init();
