import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('Dendroica.db');


//json = all data to insert
//jsonArrayNames = keys to arrays from returned json that will be inserted in order
//tableName = table to insert into
//Function to insert multiple rows at a time.. hopefully saving on performance
var insertMultiple = function (json, jsonArrayNames, tableName, onFinishedCallback) {
    var parameters = [];
    var sqlQuestionMarks="";

    db.transaction(function(tx) {
        for (var i = 0; i < json[jsonArrayNames[0]].length; i++) {
            //Build question mark string for sql statement (?,?,?...) for number of params
            //Fill parameters for sql statement. Stop at length * 100 (100 inserts at a time)
            sqlQuestionMarks += ("(")
            jsonArrayNames.forEach((arrayName,index) => {
                sqlQuestionMarks += "?";
                if (index != jsonArrayNames.length - 1)
                    sqlQuestionMarks += ",";

                parameters.push(json[arrayName][i]);
            });
            sqlQuestionMarks += ")"

            // sending every 100 records to DB
            if (parameters.length == jsonArrayNames.length * 100) {
                tx.executeSql("INSERT  INTO " + tableName + " VALUES " + sqlQuestionMarks + ";", parameters);

                // reset the variables
                parameters= [];
                sqlQuestionMarks = "";
            } else   sqlQuestionMarks += ",";
        }
        // send the rest of it (for remainder params < 100 inserts)
        if (sqlQuestionMarks != "")  {
            tx.executeSql("INSERT INTO " + tableName + " VALUES " + sqlQuestionMarks.slice(0,-1)+ ";", parameters, () => {
                onFinishedCallback();
            });
        }
        else onFinishedCallback();
    });
}


var _insertRegion = function (id, projectID, name, callbacks) {
    var query = `INSERT INTO Regions (_id, project_id, name) VALUES (?,?,?)`;
    _sqlQuery(query, [id, projectID, name], callbacks);
};

var insertBirdDataset = function (birdID, birdName, scientificName, rangeDescription, songDescription, regionNames, imagePaths, imageCredits, mapPaths, mapCredits, spectroPaths, soundPaths, soundCredits, onFinishedCallback) {
    //Insert Bird into Birds
    _insertBird(birdID, birdName, scientificName, rangeDescription, songDescription, {success: function(tx,res) {
        var i, j, k, r;
        i = j = k = r = 0;

        //Find corresponding regionIDs and for each insert regionID/birdID into BirdRegions
        for (let index = 0;index < regionNames.length; index++) {
            _getRegionIDByName(regionNames[index], {success: function(tx,res) {
                var regionID = res.rows.item(0)._id;
                //Insert into BirdRegions
                _insertBirdRegion(regionID, birdID, {success: function(tx,res) {
                    r++;
                    if (r===regionNames.length && i===imagePaths.length && j===mapPaths.length && k===spectroPaths.length) {
                        onFinishedCallback();
                    }
                }});
                //Don't need to worry about async as BirdRegions table does not affect other tables
            }}, tx);
        }

        for (let index = 0; index < imagePaths.length; index++) {
                _insertBirdImage(birdID, imagePaths[index], imageCredits[index], {success: function(tx,res) {
                    i++;
                    if (r===regionNames.length && i===imagePaths.length && j===mapPaths.length && k===spectroPaths.length) {
                        onFinishedCallback();
                    }
                }}, tx);
        }

        for (let index = 0; index < mapPaths.length; index++) {
            _insertMapImage(birdID, mapPaths[index], mapCredits[index], {success: function(tx,res) {
                j++;
                if (r===regionNames.length && i===imagePaths.length && j===mapPaths.length && k===spectroPaths.length){
                    onFinishedCallback();
                }
            }}, tx);
        }

        for (let index = 0; index < spectroPaths.length; index++) {
            _insertVocalization(birdID, spectroPaths[index], soundPaths[index], soundCredits[index], {success: function(tx,res) {
                    k++;
                    if (r===regionNames.length && i===imagePaths.length && j===mapPaths.length && k===spectroPaths.length){
                    }
            }}, tx);
        }
    }});
}

//DatabaseModule.getBirdById(1, {success: (bird) =>{
//     console.log(bird);
//}});
var getBirdById = function (id, callbacks) {
    var query = `SELECT * from Birds where (_id=?)`;
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array[0];
        callbacks.success(result);
    }});
}
//Define id explicitly for birds to correspond to Dendroica's IDs
var _insertBird = function (id, name, scientificName, rangeDescription, songDescription, callbacks) {
    var query = `INSERT INTO Birds (_id, name, scientific_name, range_description, song_description) VALUES (?,?,?,?,?)`;
    _sqlQuery(query, [id,name,scientificName,rangeDescription,songDescription], callbacks);
};

var _insertList = function (name, callbacks) {
    var query = `INSERT INTO Lists (_id, name) VALUES (?,?)`;
    _sqlQuery(query, [name], callbacks);
};

var _insertBirdImage = function (id, birdID, path, credits, displayOrder, callbacks) {
    var query = `INSERT INTO BirdImages (_id, bird_id, filename, credits, display_order) VALUES (?,?,?,?,?)`;
    _sqlQuery(query, [id, birdID, path, credits, displayOrder], callbacks);
};

var _insertMapImage = function (birdID, path, credits, callbacks) {
    var query = `INSERT INTO MapImages (bird_id, filename, credits) VALUES (?,?,?)`;
    _sqlQuery(query, [birdID, path, credits], callbacks);
};

var _insertVocalization = function (birdID, spectroPath, mp3Path, credits, callbacks) {
    var query = `INSERT INTO Vocalizations (bird_id, filename, mp3_filename, credits) VALUES (?,?,?,?)`;
    _sqlQuery(query, [birdID,spectroPath,mp3Path,credits], callbacks);
};

var _insertBirdRegion = function (regionID, birdID, nonBreeder, rare, callbacks) {
    var query = `INSERT INTO BirdRegions (region_id, bird_id, non_breeder, rare) VALUES (?,?,?,?)`;
    _sqlQuery(query, [regionID, birdID, nonBreeder, rare], callbacks);
};

var _insertBirdList = function (listID, birdID, callbacks) {
    var query = `INSERT INTO BirdLists (list_id, bird_id) VALUES (?,?)`;
    _sqlQuery(query, [listID, birdID], callbacks)
};

var _getRegionIDByName = function (name, callbacks) {
    var query = `SELECT _id from Regions where (name = ?)`;
    _sqlQuery(query, [name], callbacks);
}

//param query    --> sqlite query
//param params   --> if values in query are represented as '?' they will be filled in in order by the params array.
//                   this is the only way queries can be "built". If no params pass empty array.
//param callbacks--> json object {success: successFunction(tx,res); error: errorFunction(tx)}
//                   either callback may be passed optionally as well as their parameters. Function is async though so will usually need success
//param tx       --> use if this invocation is a callback intended to use the same connection
var _sqlQuery = function (query, params, callbacks, tx) {
    var success = (!callbacks || !callbacks.success) ? function(tx,res) { return res; } : callbacks.success;
    var error = (!callbacks || !callbacks.error) ? function(err) {
        console.log("----Error With Query----\n" + query);
        console.log("Params - ");
        if (params.length !== 0) {
            for (var i = 0; i < params.length; i++)
                console.log(params[i]);
        } else console.log("None");
    } : callbacks.error;

    if (tx) {
        tx.executeSql(query, params, success, error);
        return;
    }

    db.transaction(function(tx) {
        tx.executeSql(
            query,
            params,
            success,
            error
        );
    });
}

var printDatabase = function() {
    var birdsQuery =    `SELECT * from Birds`;
    var regionsQuery =  `SELECT * from Regions`;
    var birdsRegionsQuery = `SELECT * from BirdRegions`;
    var vocalizationsQuery = `SELECT * from Vocalizations`;
    var mapImagesQuery = `SELECT * from MapImages`;
    var birdImagesQuery =`SELECT * from BirdImages`;
    var listsQuery = `SELECT * from Lists`;
    var birdListsQuery = `SELECT * from BirdLists`;

     _printTable =(tableName, table)=>{
        console.log(`----------------------------------------------------------------- ${tableName} START------------------------------------------------------------------------------`);
        console.log(table);
        console.log(`----------------------------------------------------------------- ${tableName} END---------------------------------------------------------------------------------`);
     }

    _sqlQuery(birdsQuery,[], {success: (tx, res) => {
        var birdsTable = res.rows._array;
        _printTable("Birds", birdsTable);

        _sqlQuery(regionsQuery,[], {success: (tx, res) => {
            var regionsTable = res.rows._array;
            _printTable("Regions", regionsTable);

            _sqlQuery(birdsRegionsQuery,[], {success: (tx, res) => {
                var birdsRegionsTable = res.rows._array;
                _printTable("BirdRegions", birdsRegionsTable);

                _sqlQuery(vocalizationsQuery,[], {success: (tx, res) => {
                    var vocalizationsTable = res.rows._array;
                    _printTable("Vocalizations", vocalizationsTable);

                    _sqlQuery(mapImagesQuery,[], {success: (tx, res) => {
                        var mapImagesTable = res.rows._array;
                        _printTable("MapImages", mapImagesTable);

                        _sqlQuery(birdImagesQuery,[], {success: (tx, res) => {
                            var birdsImagesTable = res.rows._array;
                            _printTable("BirdImages", birdsImagesTable);

                            _sqlQuery(listsQuery,[], {success: (tx, res) => {
                                var listsTable = res.rows._array;
                                _printTable("Lists", listsTable);

                                _sqlQuery(birdListsQuery,[], {success: (tx, res) => {
                                    var birdsListsTable = res.rows._array;
                                    _printTable("BirdLists", birdsListsTable);

                                }}, tx);
                            }}, tx);
                        }}, tx);
                    }}, tx);
                }}, tx);
            }}, tx);
        }}, tx);
    }}, null);
}
//For testing
var destroyDB = function(onFinishedCallback) {
    _sqlQuery(`DROP TABLE if exists BirdRegions`, [], { success: function(tx, res) {
        _sqlQuery(`DROP TABLE if exists BirdLists`, [], { success: function(tx, res) {
            _sqlQuery(`DROP TABLE if exists Lists`, [], { success: function(tx, res) {
                _sqlQuery(`DROP TABLE if exists BirdImages`, [], { success: function(tx, res) {
                    _sqlQuery(`DROP TABLE if exists MapImages`, [], { success: function(tx, res) {
                        _sqlQuery(`DROP TABLE if exists Vocalizations`, [], { success: function(tx, res) {
                            _sqlQuery(`DROP TABLE if exists Regions`, [], { success: function(tx, res) {
                                _sqlQuery(`DROP TABLE if exists Birds`, [], { success: function(tx, res) {
                                    console.log("...Dropped all Database Tables...");
                                    onFinishedCallback(tx);
                                }}, tx);
                            }}, tx);
                        }}, tx);
                    }}, tx);
                }}, tx);
            }}, tx);
        }}, tx);
    }}, null);
};

var initDB = function(onFinishedCallback) {
    db.transaction(function(tx) {
      tx.executeSql(
         'PRAGMA foreign_keys=ON', [],
         function(tx) { console.log("foreign keys enabled"); createTables(onFinishedCallback); },
         function(err) { console.log(err); return; }
      );
    });

    var createTables = function() {
        var query;
        //Create Birds Table
        query = `CREATE TABLE if not exists Birds (_id integer primary key not null unique, name text, scientific_name text, range_description text, song_description text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created Birds Table");
            //Create Regions Table
            query = `CREATE TABLE if not exists Regions (_id integer primary key not null unique, project_id integer not null unique, name text)`;
            _sqlQuery(query, [], {success: function(tx,res) {
                console.log("--> Created Regions Table");
                //Create Lists Table
                query = `CREATE TABLE if not exists Lists (_id integer primary key not null unique, name text)`;
                _sqlQuery(query, [], {success: function(tx,res) {
                    console.log("--> Created Lists Table");
                    //BirdImages Table
                    query = `CREATE TABLE if not exists BirdImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text, displayOrder integer)`;
                    _sqlQuery(query, [], {success: function(tx,res) {
                        console.log("--> Created BirdImages Table");
                        //MapImages Table
                        query = `CREATE TABLE if not exists MapImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text)`;
                        _sqlQuery(query, [], {success: function(tx,res) {
                            console.log("--> Created MapImages Table");
                            //Vocalizations Table
                            query = `CREATE TABLE if not exists Vocalizations (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text unique, mp3_filename text not null unique, credits text)`;
                            _sqlQuery(query, [], {success: function(tx,res) {
                                console.log("--> Created Vocalizations Table");
                                //BirdRegions Table
                                query = `CREATE TABLE if not exists BirdRegions (region_id integer REFERENCES Regions(_id), bird_id integer REFERENCES Birds(_id), non_breeder integer, rare integer,
                                CONSTRAINT birds_regions_pk primary key (region_id, bird_id))`;
                                _sqlQuery(query, [], {success: function(tx,res) {
                                    console.log("--> Created BirdRegions Table");
                                    //BirdLists Table
                                    query = `CREATE TABLE if not exists BirdLists (list_id integer REFERENCES Lists(_id), bird_id integer REFERENCES Birds(_id),
                                    CONSTRAINT birds_lists_pk primary key (list_id, bird_id))`;
                                    _sqlQuery(query, [], {success: function(tx,res) {
                                        console.log("--> Created BirdsLists Tables");
                                        onFinishedCallback(tx);
                                    }},tx);
                                }},tx);
                            }},tx);
                        }},tx);
                    }},tx);
                }},tx);
            }},tx);
        }},null);
    }
}

const DatabaseModule = {
    initDB: initDB,
    destroyDB: destroyDB,
    getBirdById: getBirdById,
    insertMultiple: insertMultiple,
    insertBirdDataset: insertBirdDataset,
    printDatabase: printDatabase
};
export default DatabaseModule;