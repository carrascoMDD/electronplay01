// M2MFromDbRe.ts

import { BrowserWindow } from 'electron';

import { domainmodels } from 'mendixmodelsdk';

import {Icolumn, IDbRe, Itable} from '../sourcemeta/IDbRe';



export default class M2MFromDbRe {
/* *********************************************************
   Used to expedite trials with models smaller than the whole 120 entities and over 3000 attributes.
   If > 0 then it is the max # of entities to be created
*/
    private static readonly LIMITRUN = false;
    private static readonly FASTRUN  = false;
    private static readonly MAXENTITIES   = M2MFromDbRe.LIMITRUN ? ( M2MFromDbRe.FASTRUN ? 20 : 50) : 0;
    private static readonly MAXATTRIBUTES = M2MFromDbRe.LIMITRUN ? ( M2MFromDbRe.FASTRUN ? 6  : 10) : 16;

/* With all entities and attributes
started converting model (all etties and attrs)
16:05:39
start to open the diagram
16:06:24
actually see diagram
16:08:48
 */

    private static readonly DOCUMENTATIONFROMSOURCE = false;

    private static readonly XCURSOR_INITIAL = 20;
    private static readonly XCURSOR_SPACE = 170;
    private static readonly YCURSOR_INITIAL = 20;
    private static readonly YCURSOR_ENTITY = 20;
    private static readonly YCURSOR_ATTRIBUTE = 14;
    private static readonly YCURSOR_SPACE = 20;
    private static readonly YCURSOR_MAX = 800;



    static populateMendixFromDBRE( theDomainModel : domainmodels.DomainModel, theDBRE : IDbRe, theBrowserWindow: BrowserWindow) {

        console.info( "HI!");

        const someFKTablesAndColumns = new Map<string, string[]>();

        const someTables = M2MFromDbRe.chooseAFewTables( theDBRE, someFKTablesAndColumns);
        let aNumTables = someTables.length;

        let anXCursor = M2MFromDbRe.XCURSOR_INITIAL;
        let anYCursor = M2MFromDbRe.YCURSOR_INITIAL;

        for( let aTableIdx = 0; aTableIdx < aNumTables; aTableIdx++) {
            let aTable = someTables[ aTableIdx];
            anYCursor = M2MFromDbRe.createAndPopulateEntity( theDomainModel, aTable, someFKTablesAndColumns, anXCursor, anYCursor, theBrowserWindow);
            if( anYCursor > M2MFromDbRe.YCURSOR_MAX) {
                anXCursor = anXCursor + M2MFromDbRe.XCURSOR_SPACE;
                anYCursor = M2MFromDbRe.YCURSOR_INITIAL;
            }
            console.info( "Entity " + ( aTableIdx + 1) + " of " + aNumTables + "\n\n");
        }

        M2MFromDbRe.createAndPopulateAssociations( theDomainModel, someTables, someFKTablesAndColumns, theBrowserWindow);
    }


    private static chooseAFewTables( theDBRE : IDbRe, theFKTablesAndColumns : Map<string, string[]>) : Itable[] {

        const someTables = M2MFromDbRe.rankTables( theDBRE.table, theFKTablesAndColumns);

        if ( M2MFromDbRe.MAXENTITIES < 1) {
            return someTables;
        }

        if( theDBRE.table.length <= M2MFromDbRe.MAXENTITIES) {
            return someTables;
        }

        return someTables.slice( 0, M2MFromDbRe.MAXENTITIES);
    }


    /* We prefer the tables involved in foreign keys because these allow to exercise creation of model associations.
     Return a list with ranked tables sorted alphabetically, followed by not ranked tables sorted alphabetically.
     Also collect the columns of each table which intervene in foreign keys whether as local or foreign columns
    */
    private static rankTables( theTables : Itable[], theFKTablesAndColumns : Map<string, string[]>) : Itable[] {

        if( !theTables.length) {
            return theTables;
        }


        // Index by name, for O ~ log N when lookup of an Itable with name == to an Itable.foreignKey.foreignTable
        let allTablesByName = new Map<string, Itable>();
        for( let aTable of theTables) {
            allTablesByName.set( aTable.name, aTable);
        }

        // Collect all tables with a foreignKey, and the tables refered by these Itable.foreignKey.foreignTable
        let someRankedTables = new Map<string, Itable>();
        for( let aTable of theTables) {
            if( !aTable.foreignKey || !aTable.foreignKey.length) {
                continue;
            }

            if( !( aTable.name in someRankedTables)) {
                someRankedTables.set( aTable.name, aTable);
            }

            for( let aForeignKey of aTable.foreignKey) {
                if( aForeignKey.foreignTable) {
                    let aReference = aForeignKey.reference;
                    if( aReference) {
                        if( aReference.local) {
                            M2MFromDbRe.rankTableColumnNamed( theFKTablesAndColumns, aTable.name, aReference.local);
                        }
                        if( aReference.foreign) {
                            M2MFromDbRe.rankTableColumnNamed( theFKTablesAndColumns, aForeignKey.foreignTable, aReference.foreign);
                        }
                    }
                    if( !( aForeignKey.foreignTable in someRankedTables)) {
                        const aForeignTable = allTablesByName.get( aForeignKey.foreignTable);
                        if( aForeignTable) {
                            someRankedTables.set( aForeignKey.foreignTable, aForeignTable);
                        }
                    }
                }
            }
        }

        // collect all ranked tables, then append the ones which were not ranked
        const someTables : Itable[] = [ ];

        // sort alphabetically ranked tables
        const someRankedNames : string[] = [ ];
        for( let aRankedName of someRankedTables.keys()) {
            someRankedNames.push( aRankedName);
        }
        const someSortedRankedNames = someRankedNames.sort();
        for( let aTableName of someSortedRankedNames) {
            let aTable = allTablesByName.get( aTableName);
            if( aTable) {
                someTables.push( aTable);
            }
        }

        // collect tables which were not ranked
        const otherTableNames : string[] = [ ];
        for( let aTable of theTables) {
            if( !someRankedTables.has( aTable.name)) {
                otherTableNames.push( aTable.name);
            }
        }

        // sort alphabetically tables which were not ranked
        const someOtherNames = otherTableNames.sort();
        for( let aTableName of someOtherNames) {
            let aTable = allTablesByName.get( aTableName);
            if( aTable) {
                someTables.push( aTable);
            }
        }

        return someTables;
    }


    private static rankTableColumnNamed( theFKTablesAndColumns : Map<string, string[]>, theTableName : string, theColumnName : string) {

        let someFKColumns = theFKTablesAndColumns.get( theTableName);
        if( !someFKColumns) {
            someFKColumns = [ ];
            theFKTablesAndColumns.set( theTableName, someFKColumns)
        }

        if( someFKColumns.indexOf( theColumnName) < 0) {
            someFKColumns.push( theColumnName);
        }
    }



    private static createAndPopulateEntity( theDomainModel : domainmodels.DomainModel, theTable: Itable, theFKTablesAndColumns : Map<string, string[]>,
                                      theXCursor: number, theYCursor: number, theBrowserWindow: BrowserWindow):number {

        console.info( "+ Entity " + theTable.name);
        theBrowserWindow.webContents.send('DbReToMendix_CREATEENTITY', theTable.name);

        const aNewEntity = domainmodels.Entity.createIn(theDomainModel);
        aNewEntity.name = theTable.name;
        aNewEntity.location = { x: theXCursor, y: theYCursor };
        if( M2MFromDbRe.DOCUMENTATIONFROMSOURCE) {
            aNewEntity.documentation = JSON.stringify( theTable, (theKey : string, theValue : any) => { return ( theKey == "column") ? undefined : theValue; }, 4);
        }

        const someColumns = M2MFromDbRe.chooseAFewAttributes( theTable, theFKTablesAndColumns);
        console.info( "  ... about to create " + someColumns.length + " attributes");
        for( let aColumn of someColumns) {

            M2MFromDbRe.createAndPopulateAttribute( theDomainModel, aNewEntity, aColumn, theBrowserWindow);
        }
        console.info( "  ok");
        console.info( "  + " + someColumns.length + " attributes");

        return theYCursor + M2MFromDbRe.YCURSOR_ENTITY + ( someColumns.length * M2MFromDbRe.YCURSOR_ATTRIBUTE)  + M2MFromDbRe.YCURSOR_SPACE;
    }


    private static chooseAFewAttributes( theTable: Itable, theFKTablesAndColumns : Map<string, string[]>) : Icolumn[] {

        const someColumns = M2MFromDbRe.rankAttributes( theTable.name, theTable.column, theFKTablesAndColumns);

        if ( M2MFromDbRe.MAXATTRIBUTES < 1) {
            return someColumns;
        }

        if( theTable.column.length <= M2MFromDbRe.MAXATTRIBUTES) {
            return someColumns;
        }

        return someColumns.slice( 0, M2MFromDbRe.MAXATTRIBUTES);
    }

    /* Prefer columns which have been ranked because being involved in a foreign key, whether as local or foreign column,
     or columns with name starting with "ID" (possibly named ID_BYDBRE by rule in method createAndPopulateAttribute because ID is reserved by Mendix model SDK).
     Sort alphabetically the ranked or ID columns and after these append the non ranked or ID columns also sorted alphabetically among themselves.
     */
    private static rankAttributes( theTableName : string, theColumns : Icolumn[], theFKTablesAndColumns : Map<string, string[]>) : Icolumn[] {

        if( !theColumns.length) {
            return theColumns;
        }

        const someRankedNames : string[] = [ ];

        // Always include the columns which have been ranked because of being involved in a foreign key as local or foreign column
        const someFKColumns = theFKTablesAndColumns.get( theTableName);
        if( someFKColumns) {
            Array.prototype.push.apply(someRankedNames, someFKColumns);
        }

        const allColumnsByName = new Map<string, Icolumn>();

        // Index the columns by name for faster log N retrieval by name later on.
        // Include the columns with name starting by ID and have not been ranked because of being involved in a foreign key as local or foreign column
        for( let aColumn of theColumns) {

            allColumnsByName.set( aColumn.name, aColumn);

            if( someRankedNames.indexOf( aColumn.name) >= 0) {
                continue;
            }

            if( aColumn.name.startsWith( "ID")) {
                if( someRankedNames.indexOf( aColumn.name) >= 0) {
                    continue;
                }
                someRankedNames.push( aColumn.name);
            }
        }

        // Collect resulting columns
        const someColumns : Icolumn[] = [ ];

        // Ranked and ID columns sorted among themselves
        const someSortedRankedNames = someRankedNames.sort();
        for( let aColumnName of someSortedRankedNames) {
            let aColumn = allColumnsByName.get( aColumnName);
            if( aColumn) {
                someColumns.push( aColumn);
            }
        }


        // Collect Non-Ranked  non ID columns
        const otherNames : string[] = [ ];
        for( let aColumn of theColumns) {
            if( someRankedNames.indexOf( aColumn.name) >= 0) {
                continue;
            }
            otherNames.push( aColumn.name);
        }

        // Non Ranked non ID columns sorted among themselves
        const otherSortedNames = otherNames.sort();
        for( let aColumnName of otherSortedNames) {
            let aColumn = allColumnsByName.get( aColumnName);
            if( aColumn) {
                someColumns.push( aColumn);
            }
        }

        return someColumns;
    }



    private static createAndPopulateAttribute( theDomainModel : domainmodels.DomainModel, theEntity: domainmodels.Entity, theColumn: Icolumn, theBrowserWindow: BrowserWindow) {

        let anAttributeName = theColumn.name;
        if( anAttributeName.toUpperCase() == "ID") {
            anAttributeName = "ID_BYDBRE";
        }
        console.info( "   + Attribute " + anAttributeName);
        theBrowserWindow.webContents.send('DbReToMendix_CREATEATTRIBUTE', anAttributeName);

        const aNewAttribute = domainmodels.Attribute.createIn(theEntity);

        aNewAttribute.name = anAttributeName;
        if( M2MFromDbRe.DOCUMENTATIONFROMSOURCE) {
            aNewAttribute.documentation = JSON.stringify( theColumn, null, 4);
        }

        switch( theColumn.type) {

            case "3,NUMBER":
                if( theColumn.size && ( theColumn.size == 1)) {
                    domainmodels.BooleanAttributeType.createIn( aNewAttribute);
                }
                else {
                    domainmodels.IntegerAttributeType.createIn( aNewAttribute);
                }
                if( theColumn.size) {
                    if( theColumn.size == 1) {
                        domainmodels.BooleanAttributeType.createIn( aNewAttribute);
                    }
                    else {
                        if( theColumn.size >= 10) {
                            domainmodels.LongAttributeType.createIn( aNewAttribute);
                        }
                        else {
                            domainmodels.IntegerAttributeType.createIn( aNewAttribute);
                        }
                    }
                }
                else {
                    domainmodels.IntegerAttributeType.createIn( aNewAttribute);
                }
                break;

            case "12,VARCHAR2":
                let aStringAttributeType = domainmodels.StringAttributeType.createIn( aNewAttribute);
                if ( theColumn.size) {
                    aStringAttributeType.length = theColumn.size;
                }
                break;

            case "91,DATE":
                domainmodels.DateTimeAttributeType.createIn( aNewAttribute);
                break;

            case "93,DATE": /* timestamp */
                domainmodels.DateTimeAttributeType.createIn( aNewAttribute);
                break;

            case "2004,CLOB":
                let aClobAttributeType = domainmodels.StringAttributeType.createIn( aNewAttribute);
                if ( theColumn.size) {
                    aClobAttributeType.length = theColumn.size;
                }
                break;

            default:
                domainmodels.StringAttributeType.createIn( aNewAttribute);
        }
    }



    /* Create Associations from foreign keys in the reverse engineeded model.
     The tables with columns which are involved in a Foreign Key as local or foreign column have been collected in a previous step into theFKTablesAndColumns
    */
    private static createAndPopulateAssociations( theDomainModel : domainmodels.DomainModel, theTables: Itable[], theFKTablesAndColumns : Map<string, string[]>, theBrowserWindow: BrowserWindow) {

        // map tables by name for faster log N access below
        const allTablesByName = new Map<string, Itable>();
        for( let aTable of theTables) {
            allTablesByName.set( aTable.name, aTable);
        }

        // Impose a deterministic order of processing tables by table name
        const someTableNames : string[] = [ ];
        for( let aTableName of theFKTablesAndColumns.keys()) {
            someTableNames.push( aTableName);
        }
        const someSortedTableNames = someTableNames.sort();
        for( let aTableName of someSortedTableNames) {
            const aTable = allTablesByName.get( aTableName);
            if( !aTable) {
                continue;
            }

            if( !aTable.foreignKey || !aTable.foreignKey.length) {
                continue;
            }

            // Impose a deterministic order of processing foreign keys by foreign table name
            const someForeignKeysSorted = aTable.foreignKey.sort( ( theFK1, theFK2) => { return theFK1.foreignTable.localeCompare( theFK2.foreignTable);});

            // iterate over foreign keys. Each is candidate to produce an association
            for( let aForeignKey of someForeignKeysSorted) {

                const aLocalColumn = M2MFromDbRe.columnByName( aTable.column, aForeignKey.reference.local);
                if( !aLocalColumn) {
                    continue;
                }

                const aForeignTable = allTablesByName.get( aForeignKey.foreignTable);
                if( !aForeignTable) {
                    continue;
                }

                const aForeignColumn = M2MFromDbRe.columnByName( aForeignTable.column, aForeignKey.reference.foreign);
                if( !aForeignColumn) {
                    continue;
                }

                const someEntities = theDomainModel.entities.filter( theEntity => theEntity.name == aTable.name);
                if( !someEntities || !someEntities.length) {
                    continue;
                }
                const anEntity = someEntities[ 0];

                const someForeignEntities = theDomainModel.entities.filter( theEntity => theEntity.name == aForeignTable.name);
                if( !someForeignEntities || !someForeignEntities.length) {
                    continue;
                }
                const aForeignEntity = someForeignEntities[ 0];


                console.info( "   + Association " + aForeignKey.name);
                theBrowserWindow.webContents.send('DbReToMendix_CREATEASSOCIATION', aForeignKey.name);

                // https://apidocs.mendix.com/modelsdk/latest/classes/domainmodels.association.html
                const aNewAssociation = domainmodels.Association.createIn(theDomainModel);
                aNewAssociation.name = aForeignKey.name;
                aNewAssociation.parent = aForeignEntity;
                aNewAssociation.parentConnection = aForeignEntity.location;
                aNewAssociation.child = anEntity;
                aNewAssociation.childConnection = anEntity.location;
                aNewAssociation.type = domainmodels.AssociationType.ReferenceSet;
                aNewAssociation.owner = domainmodels.AssociationOwner.Default;
            }
        }
    }


    private static columnByName( theColumns : Icolumn[], theName : string): Icolumn | undefined {
        for( let aColumn of theColumns) {
            if( aColumn.name == theName) {
                return aColumn;
            }
        }
        return undefined;
    }

}