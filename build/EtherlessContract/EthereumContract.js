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
const ethers_1 = require("ethers");
const utils_1 = require("ethers/utils");
class EthereumContract {
    constructor(contract) {
        this.contract = contract;
    }
    getAllFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getFuncList()).functionArray;
        });
    }
    getMyFunctions(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getOwnedList(ethers_1.ethers.utils.getAddress(address))).functionArray;
        });
    }
    /** TODO */
    getSearchedFunction(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((response, reject) => { });
        });
    }
    getFunctionInfo(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield this.contract.getInfo(name));
        });
    }
    /** TODO */
    getExecHistory(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => { });
        });
    }
    sendRunRequest(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating request to execute function..');
            const tx = yield this.contract.runFunction(name, params, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    sendDeleteRequest(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating request to delete function..');
            const tx = yield this.contract.deleteFunction(name, { value: utils_1.bigNumberify('10') });
            console.log(`Sending request, transaction hash: ${tx.hash}`);
            const receipt = yield tx.wait();
            console.log('Request done.');
            const requestId = this.contract.interface.parseLog(receipt.events[0]).values.id;
            return requestId;
        });
    }
    /** TODO */
    sendCodeUpdateRequest(name, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => { });
        });
    }
    /** TODO */
    updateDesc(name, newDesc) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => { });
        });
    }
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
                reject(result);
                this.contract.removeAllListeners(successFilter);
                this.contract.removeAllListeners(errorFilter);
            });
        });
    }
}
exports.default = EthereumContract;
