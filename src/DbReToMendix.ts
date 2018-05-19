import { MendixSdkClient, OnlineWorkingCopy } from 'mendixplatformsdk';
import { domainmodels } from 'mendixmodelsdk';

import DBRE  from './sourcemeta/DbRe';
import M2MFromDbRe  from './metatomendix/M2MFromDbRe';
import Conversions from './utils/Conversions';

export default class DbReToMendix {


    private static readonly username = 'carrascoMendix@ModelDD.org';
    private static readonly apikey = '5a6a99f7-152e-48ff-9436-81ca15c35d7d'; // Key description "For MendixSdkTst01" created 20180506
    private static readonly baseProjectName = 'ACVappMendixSdkTst01-';
    private static readonly baseEntityName = 'ACVEntity_';
    private static readonly client = new MendixSdkClient(DbReToMendix.username, DbReToMendix.apikey);

/* After execution, visit https://sprintr.home.mendix.com/index.html */

    static async dbreToMendix() {
        const project = await DbReToMendix.client.platform().createNewApp(
            `${DbReToMendix.baseProjectName}${Conversions.fDateToTimestampWOsepsStr( new Date())}`);

        const workingCopy = await project.createWorkingCopy();

        const domainModel = await DbReToMendix.loadDomainModel(workingCopy);

        try {
            M2MFromDbRe.populateMendixFromDBRE( domainModel, DBRE);
        }
        catch (error) {
            console.error('Error during populating Mendix model:', error);
        }

        try {
            const revision = await workingCopy.commit();
            console.log(`Successfully committed revision: ${revision.num()}. Done.`)
        }
        catch (error) {
            console.error('Error during commit Mendix model:', error);
        }
    }


    private static loadDomainModel(workingCopy: OnlineWorkingCopy): Promise<domainmodels.DomainModel> {
        const dm = workingCopy.model().allDomainModels().filter(dm => dm.containerAsModule.name === 'MyFirstModule')[0];

        return new Promise((resolve, reject) => dm.load(resolve));
    }


}