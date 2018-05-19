"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const DbRe_1 = require("./sourcemeta/DbRe");
const M2MFromDbRe_1 = require("./metatomendix/M2MFromDbRe");
const Conversions_1 = require("./utils/Conversions");
class DbReToMendix {
    /* After execution, visit https://sprintr.home.mendix.com/index.html */
    static dbreToMendix() {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield DbReToMendix.client.platform().createNewApp(`${DbReToMendix.baseProjectName}${Conversions_1.default.fDateToTimestampWOsepsStr(new Date())}`);
            const workingCopy = yield project.createWorkingCopy();
            const domainModel = yield DbReToMendix.loadDomainModel(workingCopy);
            try {
                M2MFromDbRe_1.default.populateMendixFromDBRE(domainModel, DbRe_1.default);
            }
            catch (error) {
                console.error('Error during populating Mendix model:', error);
            }
            try {
                const revision = yield workingCopy.commit();
                console.log(`Successfully committed revision: ${revision.num()}. Done.`);
            }
            catch (error) {
                console.error('Error during commit Mendix model:', error);
            }
        });
    }
    static loadDomainModel(workingCopy) {
        const dm = workingCopy.model().allDomainModels().filter(dm => dm.containerAsModule.name === 'MyFirstModule')[0];
        return new Promise((resolve, reject) => dm.load(resolve));
    }
}
DbReToMendix.username = 'carrascoMendix@ModelDD.org';
DbReToMendix.apikey = '883ea2d1-12da-45d8-9474-9f7a8363771f'; // Key description "For MendixSdkTst01" created 20180506
DbReToMendix.baseProjectName = 'ACVappMendixSdkTst01-';
DbReToMendix.baseEntityName = 'ACVEntity_';
DbReToMendix.client = new mendixplatformsdk_1.MendixSdkClient(DbReToMendix.username, DbReToMendix.apikey);
exports.default = DbReToMendix;
//# sourceMappingURL=DbReToMendix.js.map