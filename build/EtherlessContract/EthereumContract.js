"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/utils");
class EthereumContract {
    constructor(contract) {
        this.contract = contract;
    }
    /**
     * Get a list of all functions available inside the platform
     */
    getAllFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getFuncList()).functionArray;
        });
    }
    /**
     * Get a list of all functions owned by a user
     * @param address: address of the user to consider
     */
    getMyFunctions(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getOwnedList(utils_1.getAddress(address))).functionArray;
        });
    }
    /**
     * Returns all details about a function
     * @param name: name of the function
     */
    getFunctionInfo(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getInfo(name));
        });
    }
    /**
     * Connect a wallet to a contract instance
     * @param wallet: wallet to connect
     */
    connect(wallet) {
        this.contract = this.contract.connect(wallet);
    }
    /**
     * Get all events related to a filter
     * @param filter: filter to use to retrieve events
     */
    getEvents(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            filter.fromBlock = 0;
            filter.toBlock = 'latest';
            return this.contract.provider.getLogs(filter);
        });
    }
    /**
     * Parse a list of log
     * @param logs: array of logs
     */
    parseLogs(logs) {
        return logs.map((log) => this.contract.interface.parseLog(log));
    }
    /**
     * Get details about past run request of a user
     * @param address: address of the considered user
     */
    getExecHistory(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const pastRequest = yield this.getEvents(this.contract.filters.runRequest(null, null, address, null));
            const parsedOk = this.parseLogs(yield this.getEvents(this.contract.filters.resultOk()));
            const parsedError = this.parseLogs(yield this.getEvents(this.contract.filters.resultError()));
            Array.prototype.push.apply(parsedOk, parsedError);
            return Promise.all(pastRequest.map(((request) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { timestamp } = yield this.contract.provider.getBlock(request.blockHash);
                const parsedRequest = this.contract.interface.parseLog(request);
                const result = (_a = parsedOk.find((item) => item.values.id.eq(parsedRequest.values.id))) === null || _a === void 0 ? void 0 : _a.values;
                let requestResult;
                try {
                    requestResult = JSON.parse(result.result).message;
                }
                catch (error) {
                    requestResult = '--Error trying to find the result--';
                }
                return {
                    id: parsedRequest.values.id,
                    date: new Date(timestamp * 1000).toLocaleString(),
                    name: parsedRequest.values.funcname,
                    params: parsedRequest.values.param,
                    result: requestResult,
                };
            }))));
        });
    }
    /**
     * Check if a function is available on the platform
     * @param name: name of the function
     */
    existsFunction(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listInfo = yield this.getFunctionInfo(name);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    /**
     * Send a run request to the smart contract
     * @param name: name of the function to execute
     * @param params: params to pass to the function
     * @returns the request ID
     */
    sendRunRequest(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let listInfo;
            try {
                listInfo = yield this.getFunctionInfo(name);
            }
            catch (error) {
                throw new Error("The function you're looking for does not exist!");
            }
            // NUMBER OF PARAMETERS
            if (listInfo.signature.split(',').length !== params.split(',').length) {
                throw new Error('The number of parameters is not correct!');
            }
            console.log('Creating request to execute function..');
            const tx = yield this.contract.runFunction(name, params, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    /**
     * Check if two string are case-insensitive equals
     * @param s1: first string
     * @param s2: second string
     */
    caseInsensitiveEquality(s1, s2) {
        return s1.toUpperCase() === s2.toUpperCase();
    }
    /**
     * Send a delete request to the smart contract
     * @param name: name of the function to delete
     * @returns the request ID
     */
    sendDeleteRequest(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let listInfo;
            try {
                listInfo = yield this.getFunctionInfo(name);
            }
            catch (error) {
                throw new Error("The function you're looking for does not exist!");
            }
            if (!this.caseInsensitiveEquality(yield this.contract.signer.getAddress(), listInfo.developer)) {
                throw new Error('You are not the owner of the function!');
            }
            console.log('Creating request to delete function..');
            const tx = yield this.contract.deleteFunction(name, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    /**
     * Send a code update request to the smart contract
     * @param name: name of the function to update
     * @param signature: new signature of the function
     * @param cid: id of the IPFS resource
     * @returns the request ID
     */
    sendCodeUpdateRequest(name, signature, cid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating request to edit function..');
            const tx = yield this.contract.editFunction(name, signature, cid, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    /**
     * Update the description of a function
     * @param name: function name
     * @param newDesc: new description
     */
    updateDesc(name, newDesc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newDesc.length > 150) {
                throw new Error('The new description must be at most 150 characters long');
            }
            const tx = yield this.contract.editFunctionDescr(name, newDesc, { value: utils_1.bigNumberify('10') });
            yield tx.wait();
        });
    }
    /**
     * Send a deployment request to the smart contract
     * @param name: name of the function to update
     * @param desc: description of the function
     * @param signature: new signature of the function
     * @param cid: id of the IPFS resource
     * @returns the request ID
     */
    sendDeployRequest(name, signature, desc, cid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating request to deploy function..');
            const tx = yield this.contract.deployFunction(name, signature, desc, cid, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    /**
     * Listen to the server response of a request
     * @param requestId: id of the considered request
     */
    listenResponse(requestId) {
        console.log('Waiting for the response...');
        const successFilter = this.contract.filters.resultOk(null, requestId);
        const errorFilter = this.contract.filters.resultError(null, requestId);
        return new Promise((resolve, reject) => {
            // ascolto per eventi di successo
            this.contract.on(successFilter, (result, id, event) => {
                resolve(result);
                this.contract.removeAllListeners(successFilter);
                this.contract.removeAllListeners(errorFilter);
            });
            // asolto per eventi di errore
            this.contract.on(errorFilter, (result, id, event) => {
                reject(JSON.parse(result));
                this.contract.removeAllListeners(successFilter);
                this.contract.removeAllListeners(errorFilter);
            });
        });
    }
}
exports.default = EthereumContract;
