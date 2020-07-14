"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = __importStar(require("inquirer"));
const Command_1 = __importDefault(require("./Command"));
const fs = require('fs');
const path = require('path');
class DeployCommand extends Command_1.default {
    constructor(fileParser, fileManager, contract, session) {
        super(session);
        this.command = 'deploy <function_name> <path> <description>';
        this.description = 'deploy a function';
        this.contract = contract;
        this.fileParser = fileParser;
        this.fileManager = fileManager;
    }
    exec(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = yield inquirer
                .prompt([{
                    type: 'password',
                    message: 'Enter the password to decrypt your wallet: ',
                    name: 'password',
                }]).then((answer) => answer.password);
            const wallet = yield this.session.restoreWallet(password);
            this.contract.connect(wallet);
            if (yield this.contract.existsFunction(args.function_name)) {
                throw new Error('The name of the function is already used!');
            }
            if (args.function_name.length > 30) {
                throw new Error('The name must be at most 30 characters long!');
            }
            if (args.description.length > 150) {
                throw new Error('The description must be at most 150 characters long!');
            }
            const isDir = fs.lstatSync(args.path).isDirectory();
            const sourcePath = isDir ? path.normalize(`${args.path}${path.sep}index.js`) : args.path;
            this.fileParser.parse(sourcePath);
            const signature = this.fileParser.getFunctionSignature(args.function_name);
            const sourceCode = fs.readFileSync(sourcePath).toString();
            const packageJSON = isDir
                ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package.json`)).toString()
                : '';
            const packageJSONLock = isDir
                ? fs.readFileSync(path.normalize(`${args.path}${path.sep}package-lock.json`)).toString()
                : '';
            const deploymentInfo = {
                dep: isDir,
                sourceCode,
                package: packageJSON,
                package_lock: packageJSONLock,
            };
            console.log('Uploading file in IPFS');
            const CID = yield this.fileManager.save(deploymentInfo);
            console.log(`File uploaded, cid: ${CID}`);
            const requestId = yield this.contract.sendDeployRequest(args.function_name, signature, args.description, CID);
            const result = yield this.contract.listenResponse(requestId);
            return JSON.parse(result).message;
        });
    }
    builder(yargs) {
        return yargs.positional('function_name', {
            describe: 'Name of the function to deploy',
            type: 'string',
        }).positional('path', {
            describe: 'relative path of the source file',
            type: 'string',
        }).positional('description', {
            describe: 'Description of the function to deploy',
            type: 'string',
        });
    }
}
exports.default = DeployCommand;
