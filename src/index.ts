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
import InfoCommand from './Command/InfoCommand';

import EthereumUsesSession from './Session/EthereumUserSession';
import EthereumContract from './EtherlessContract/EthereumContract';
import ListCommand from './Command/ListCommand';
import WhoAmICommand from './Command/WhoamiCommand';
import RunCommand from './Command/RunCommand';
import SearchCommand from './Command/SearchCommand';

const ESmart = require('../contracts/EtherlessSmart.json');

const provider = getDefaultProvider('ropsten');

const ethSession : EthereumUsesSession = new EthereumUsesSession(provider);
const ethContract : EthereumContract = new EthereumContract(
  '0x5f95F9FC6345C8f6CC94D154e3C6212722660146',
  ESmart.abi,
  provider,
);

const commands : Array<Command> = [
  new LoginCommand(ethSession),
  new SignupCommand(ethSession),
  new LogoutCommand(ethSession),
  new WhoAmICommand(ethSession),
  new InfoCommand(ethContract, ethSession),
  new ListCommand(ethContract, ethSession),
  new RunCommand(ethSession, ethContract),
  new SearchCommand(ethSession, ethContract),
];

commands.forEach(
  (command) => CommandManager.addCommand(command),
);

CommandManager.init();
