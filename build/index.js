#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const configstore_1 = __importDefault(require("configstore"));
const CommandManager_1 = __importDefault(require("./Command/CommandManager"));
const SignupCommand_1 = __importDefault(require("./Command/SignupCommand"));
const LoginCommand_1 = __importDefault(require("./Command/LoginCommand"));
const LogoutCommand_1 = __importDefault(require("./Command/LogoutCommand"));
const InfoCommand_1 = __importDefault(require("./Command/InfoCommand"));
const ListCommand_1 = __importDefault(require("./Command/ListCommand"));
const WhoamiCommand_1 = __importDefault(require("./Command/WhoamiCommand"));
const RunCommand_1 = __importDefault(require("./Command/RunCommand"));
const SearchCommand_1 = __importDefault(require("./Command/SearchCommand"));
const DeleteCommand_1 = __importDefault(require("./Command/DeleteCommand"));
const DeployCommand_1 = __importDefault(require("./Command/DeployCommand"));
const EthereumUserSession_1 = __importDefault(require("./Session/EthereumUserSession"));
const EthereumContract_1 = __importDefault(require("./EtherlessContract/EthereumContract"));
const IPFSFileManager_1 = __importDefault(require("./IPFS/IPFSFileManager"));
const JSFileParser_1 = __importDefault(require("./FileParser/JSFileParser"));
const IPFS = require('ipfs-mini');
const ESmart = require('../contracts/EtherlessSmart.json');
const pkg = require('../package.json');
const provider = ethers_1.getDefaultProvider('ropsten');
const ethSession = new EthereumUserSession_1.default(new configstore_1.default(pkg.name), provider);
const ethContract = new EthereumContract_1.default('0x7eAF55b6E2126f7931aeC056C7839716b804c767', ESmart.abi, provider);
const ipfsFileManager = new IPFSFileManager_1.default(new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }));
const jsFileParser = new JSFileParser_1.default();
const commands = [
    new LoginCommand_1.default(ethSession),
    new SignupCommand_1.default(ethSession),
    new LogoutCommand_1.default(ethSession),
    new WhoamiCommand_1.default(ethSession),
    new InfoCommand_1.default(ethContract, ethSession),
    new ListCommand_1.default(ethContract, ethSession),
    new RunCommand_1.default(ethContract, ethSession),
    new SearchCommand_1.default(ethContract, ethSession),
    new DeleteCommand_1.default(ethContract, ethSession),
    new DeployCommand_1.default(jsFileParser, ipfsFileManager, ethContract, ethSession),
];
commands.forEach((command) => CommandManager_1.default.addCommand(command));
CommandManager_1.default.init();
