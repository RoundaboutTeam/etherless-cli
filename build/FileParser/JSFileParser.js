"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const Parser = require('acorn');
class JSFileParser {
    /**
     * Parse a javascript source file
     * @param path: path of the file to parse
     */
    parse(path) {
        if (!fs.existsSync(path)) {
            throw new Error('File doesn\'t exists');
        }
        const splittedPath = path.split('.');
        if (splittedPath[splittedPath.length - 1] !== 'js') {
            throw new Error('The source file must be a Javascript file!');
        }
        this.parsedFile = Parser.parse(fs.readFileSync(path).toString());
    }
    /**
     * Check if a function exists
     * @param funcName: function name
     */
    existsFunction(funcName) {
        if (typeof this.parsedFile === 'undefined') {
            throw new Error('No file loaded');
        }
        return this.findFuncNode(funcName) !== undefined;
    }
    /**
     * Obtain the signature of a considered function
     * @param funcName: name of the function
     */
    getFunctionSignature(funcName) {
        if (typeof this.parsedFile === 'undefined') {
            throw new Error('No file loaded');
        }
        if (!this.existsFunction(funcName)) {
            throw new Error(`No function ${funcName} found in file`);
        }
        const funcNode = this.findFuncNode(funcName);
        const funcParams = this.funcSignatureFromNode(funcNode);
        return `(${funcParams})`;
    }
    /**
     * Find the node in acorn structure that represent the considered function
     * @param funcName: function to consider
     */
    findFuncNode(funcName) {
        return this.parsedFile.body.find((x) => x.id && x.id.name === funcName);
    }
    /**
     * get the function signature from node
     * @param funcNode: node obtained using acorn library that represent the function
     */
    funcSignatureFromNode(funcNode) {
        return funcNode.params.map((param) => param.name).join(', ');
    }
}
exports.default = JSFileParser;
