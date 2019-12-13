import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('Dendroica.db');

const FIELDS = {
    "User": ["_id","dendroica_id","username","password","email","first_name","last_name","language","naming","sorting"],
    "VersionData": ["_id","apiVersion","dataVersion","lastUpdateTimeStamp"],
    "Birds": ["_id","name","scientific_name","range_description","song_description"],
    "Regions": ["_id","project_id","name"],
    "Lists": ["_id","name"],
    "BirdImages": ["_id","bird_id","filename","credits","displayOrder"],
    "MapImages": ["_id","bird_id","filename","credits"],
    "Vocalizations": ["_id","bird_id","filename","mp3Filename","credits"],
    "SubRegions": ["_id","region_id","name","abbrev"],
    "FileSubRegions": ["subregion_id","file_id","displayOrder"],
    "BirdSubRegions": ["subregion_id","bird_id","non_breeder","rare"],
    "BirdRegions": ["region_id","bird_id","non_breeder","rare"],
    "BirdLists": ["list_id","bird_id",""]
}


//  Inserts username or updates if exists
var updateUser = function (dendroicaId, username, password, email, firstName, lastName, language, naming, sorting, callbacks) {
    var countQuery  = `SELECT COUNT(*) from User`;
    var updateQuery = `UPDATE User
                       SET _id=?,email=?,first_name=?,last_name=?,language=?,naming=?,sorting=?
                       WHERE _id=1`;
    var insertQuery = `INSERT into User
                       VALUES (?,?,?,?,?,?,?,?,?,?)`;

    _sqlQuery(countQuery, [], { success: (tx,res) => {
        if (res.rows._array[0]["COUNT(*)"] === 0) { //Insert
            _sqlQuery(insertQuery,
                [1,dendroicaId, username, password, email, firstName, lastName, language, naming, sorting],
                callbacks);
        }

        if (res.rows._array[0]["COUNT(*)"] === 1) { //Update
            _sqlQuery(updateQuery,
                [dendroicaId, email, firstName, lastName, language, naming, sorting],
                callbacks);
        }
    }});
}

var getCredentials = function(onFinishedCallback) {
    var query = `SELECT username,password from User`;
    _sqlQuery(query, [], { success: (tx,res) => {
        onFinishedCallback(res.rows._array[0]);
    }});
}

var getVersionData = function(onFinishedCallback) {
    var query = `SELECT * from VersionData`;
    _sqlQuery(query, [], { success: (tx,res) => {
        onFinishedCallback(res.rows._array[0]);
    }, error: (error) => {
        onFinishedCallback(null); //This query might get called before DB initialization
    }});
}

var updateVersionData = function(versionDataToUpdate, onFinishedCallback) {
    var countQuery  = "SELECT COUNT(*) from VersionData";
    var insertQuery = "INSERT INTO VersionData VALUES (?,?,?,?)";
    var updateQuery = "UPDATE VersionData SET apiVersion=?, dataVersion=?, lastUpdateTimeStamp=? where _id=1";
    var updateParams= [versionDataToUpdate.apiVersion, versionDataToUpdate.dataVersion, versionDataToUpdate.serverTimeStamp];

    _sqlQuery(countQuery, [], {success: (tx,res) => {
        if (res.rows._array[0]["COUNT(*)"] === 1) {
            _sqlQuery(updateQuery, updateParams, { success: (tx,res) => {
                onFinishedCallback();
            }});
        }
        if (res.rows._array[0]["COUNT(*)"] === 0) {
            var params = [1,versionDataToUpdate.apiVersion, versionDataToUpdate.dataVersion, versionDataToUpdate.serverTimeStamp];
            _sqlQuery(insertQuery, params, {success: (tx,res) => {
                onFinishedCallback();
            }});
        }
    }});
}

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

var upsertMultiple = function (json, jsonArrayNames, tableName, onFinishedCallback) {
    var countQuery = "SELECT COUNT(*) from " + tableName + " WHERE _id=";
    var insertQuery = "INSERT INTO " + tableName + " VALUES (";
    var updateQuery = "UPDATE " + tableName + " SET ";

    FIELDS[tableName].forEach(field => {
        insertQuery += "?,";
        if (field !== "_id") updateQuery += field + "=?,";
    })
    insertQuery = insertQuery.slice(0,-1) + ")";
    updateQuery = updateQuery.slice(0,-1) + " WHERE _id=";

    var idArray = json[jsonArrayNames[0]];
    db.transaction((tx) => {
        var i,index,innerIndex;
        for (var i = 0, index = 0, innerIndex = 0; i < idArray.length; i++) {
            var params = [];
            var updateQueryWithId = updateQuery + idArray[i];
            _sqlQuery(countQuery + idArray[i], [], {success: (tx,res) => {
                var isInsertQuery = false;
                var query = "";
                var params = [];

                if (res.rows._array[0]["COUNT(*)"] === 0) isInsertQuery = true;

                if (isInsertQuery) query = insertQuery;
                else query = updateQuery + idArray[index];

                //build params array
                jsonArrayNames.forEach(arrayName => {
                    if (! (arrayName === "id" && !isInsertQuery)) //Don't push id for update query
                    params.push(json[arrayName][index]);
                })

                _sqlQuery(query, params, {success: (tx,res) => {
                    if (++innerIndex === idArray.length) onFinishedCallback();
                }},tx);

                index ++;
            }}, tx);
        }
    });
}

//  ["regionId","speciesId","nonBreederInRegion","rareInRegion"]
//  region_id integer REFERENCES Regions(_id), bird_id integer REFERENCES Birds(_id), non_breeder boolean, rare boolean
//  Function to create both BirdRegions table and SubRegions table as they are populated from the same json
var updateInsertBirdRegionsAndBirdSubRegions = function (json, regionIds, onFinishedCallback) {
    var numDatasets = json.regionId.length;
    var numUpdated = 0;
    var tableName = "";
    db.transaction(function(tx) {
        for (var i = 0; i < numDatasets; i++) {
            if (regionIds.indexOf(json.regionId[i]) == -1) tableName = "BirdSubRegions";
            else tableName = "BirdRegions";

            _sqlQuery("SELECT COUNT(*) from " + tableName, [], {success: (tx,res) => {
                if (res.rows._array[0]["COUNT(*)"] === 0) {
                    _sqlQuery("INSERT INTO " + tableName + " VALUES (?,?,?,?)",
                        [json.regionId[i], json.speciesId[i], json.nonBreederInRegion[i], json.rareInRegion[i]], {success: (tx,res) => {
                            if (++numUpdated == numDatasets) onFinishedCallback();
                    }},tx);
                }

                else {
                    var idName = ""
                    if (tableName === "BirdSubRegions") idName = "subregion_id";
                    else idName = "region_id";
                    _sqlQuery("UPDATE " + tableName + " SET non_breeder=?,rare=? WHERE " + idName + "=?, bird_id=?",
                        [json.nonBreederInRegion[i], json.rareInRegion[i], json.regionId[i], json.speciesId[i]], {success: (tx,res) => {
                            if (++numUpdated == numDatasets) onFinishedCallback();
                    }}, tx);
                }
            }},tx);
        }
    });
};

var _insertRegion = function (id, projectID, name, callbacks) {
    var query = `INSERT INTO Regions (_id, project_id, name) VALUES (?,?,?)`;
    _sqlQuery(query, [id, projectID, name], callbacks);
};

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

var printTable = function(tableName, numRowsOrId, isIdConstraint, onFinishedCallback) {
    var constraint = "";

    if (numRowsOrId) {
        if (!isIdConstraint || isIdConstraint === false) constraint = " LIMIT " + numRowsOrId;
        else constraint = " WHERE _id=" + numRowsOrId;
    }

    _sqlQuery("SELECT COUNT(*) from " + tableName, [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
        _sqlQuery("SELECT * from " + tableName + constraint, [], {success: (tx, res) => {
            console.log(`----------------------------------- ${tableName} START ------------------------------------------------`);
            res.rows._array.forEach(entry => {
                console.log(JSON.stringify(entry, null, 2));
            })
            console.log("Number of Rows: " + count);
            console.log(`----------------------------------- ${tableName} END---------------------------------------------------`);
        }});
    }});
}

var printDatabase = function(onFinishedCallback) {
    var count = 0;

     _printTable = (tableName, table, count) => {
        console.log(`----------------------------------- ${tableName} START ------------------------------------------------`);
        console.log(table);
        console.log("Number of Rows: " + count);
        console.log(`----------------------------------- ${tableName} END---------------------------------------------------`);
     }

    _sqlQuery('SELECT COUNT(*) from User', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
    _sqlQuery('SELECT * from User', [], {success: (tx, res) => {
        _printTable("User", res.rows._array, count);

         _sqlQuery('SELECT COUNT(*) from VersionData', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
         _sqlQuery('SELECT * from VersionData', [], {success: (tx, res) => {
            _printTable("VersionData", res.rows._array, count);

            _sqlQuery('SELECT COUNT(*) from Birds', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
            _sqlQuery('SELECT * from Birds', [], {success: (tx, res) => {
                _printTable("Birds", res.rows._array, count);

                _sqlQuery('SELECT COUNT(*) from Regions', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                _sqlQuery('SELECT * from Regions', [], {success: (tx, res) => {
                    _printTable("Regions", res.rows._array, count);

                    _sqlQuery('SELECT COUNT(*) from BirdRegions', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                    _sqlQuery('SELECT * from BirdRegions', [], {success: (tx, res) => {
                        _printTable("BirdRegions", res.rows._array, count);

                        _sqlQuery('SELECT COUNT(*) from Vocalizations', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                        _sqlQuery('SELECT * from Vocalizations', [], {success: (tx, res) => {
                            _printTable("Vocalizations", res.rows._array, count);

                            _sqlQuery('SELECT COUNT(*) from MapImages', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                            _sqlQuery('SELECT * from MapImages', [], {success: (tx, res) => {
                                _printTable("MapImages", res.rows._array, count);

                                _sqlQuery('SELECT COUNT(*) from BirdImages', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                _sqlQuery('SELECT * from BirdImages', [], {success: (tx, res) => {
                                    _printTable("BirdImages", res.rows._array, count);

                                    _sqlQuery('SELECT COUNT(*) from Lists', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                    _sqlQuery('SELECT * from Lists', [], {success: (tx, res) => {
                                        _printTable("Lists", res.rows._array, count);

                                        _sqlQuery('SELECT COUNT(*) from BirdLists', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                        _sqlQuery('SELECT * from BirdLists', [], {success: (tx, res) => {
                                            _printTable("BirdLists", res.rows._array, count);

                                            _sqlQuery('SELECT COUNT(*) from SubRegions', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                            _sqlQuery('SELECT * from SubRegions', [], {success: (tx, res) => {
                                                _printTable("SubRegions", res.rows._array, count);

                                                _sqlQuery('SELECT COUNT(*) from BirdSubRegions', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                                _sqlQuery('SELECT * from BirdSubRegions', [], {success: (tx, res) => {
                                                    _printTable("BirdSubRegions", res.rows._array, count);

                                                    _sqlQuery('SELECT COUNT(*) from FileSubRegions', [], { success: (tx,res) => { count = res.rows._array[0]["COUNT(*)"];
                                                    _sqlQuery('SELECT * from FileSubRegions', [], {success: (tx, res) => {
                                                        _printTable("FileSubRegions", res.rows._array, count);
                                                        if (onFinishedCallback) onFinishedCallback();
                                                    }},tx); }},tx);
                                                }},tx); }},tx);
                                            }},tx); }},tx);
                                        }},tx); }},tx);
                                    }},tx); }},tx);
                                }},tx); }},tx);
                            }},tx); }},tx);
                        }},tx); }},tx);
                    }},tx); }},tx);
                }},tx); }},tx);
            }},tx); }},tx);
        }},tx); }},tx);
    }},tx); }},null);
}

//Drops all tables in Database - For testing
var destroyDB = function(onFinishedCallback) {
    _sqlQuery(`DROP TABLE if exists User`, [], { success: (tx,res) => {
        _sqlQuery(`DROP TABLE if exists VersionData`, [], {success: (tx,res) => {
            _sqlQuery(`DROP TABLE if exists BirdRegions`, [], { success: (tx, res) => {
                _sqlQuery(`DROP TABLE if exists BirdLists`, [], { success: (tx, res) => {
                    _sqlQuery(`DROP TABLE if exists Lists`, [], { success: (tx, res) => {
                        _sqlQuery(`DROP TABLE if exists BirdImages`, [], { success: (tx, res) => {
                            _sqlQuery(`DROP TABLE if exists MapImages`, [], { success: (tx, res) => {
                                _sqlQuery(`DROP TABLE if exists Vocalizations`, [], { success: (tx, res) => {
                                    _sqlQuery(`DROP TABLE if exists FileSubRegions`, [], { success: (tx, res) => {
                                        _sqlQuery(`DROP TABLE if exists BirdSubRegions`, [], { success: (tx, res) => {
                                             _sqlQuery(`DROP TABLE if exists SubRegions`, [], { success: (tx, res) => {
                                               _sqlQuery(`DROP TABLE if exists Regions`, [], { success: (tx, res) => {
                                                    _sqlQuery(`DROP TABLE if exists Birds`, [], { success: (tx, res) => {
                                                        console.log("...Dropped all Database Tables...");
                                                        onFinishedCallback(tx);
                                                    }}, tx);
                                                }}, tx);
                                            }}, tx);
                                        }}, tx);
                                    }}, tx);
                                }}, tx);
                            }}, tx);
                        }}, tx);
                    }}, tx);
                }}, tx);
            }}, tx);
        }}, tx);
    }}, null)
};

var initDB = function(onFinishedCallback) {
    db.transaction(function(tx) {
      tx.executeSql('PRAGMA foreign_keys=ON', [], (tx) => { createTables(onFinishedCallback); } );
    });

    var createTables = function() {
        var query;
        //User Table
        query = `CREATE TABLE if not exists User (_id integer primary key not null unique, dendroica_id integer not null unique, username text, password text, email text, first_name text, last_name text,
        language text, naming text, sorting text)`
        _sqlQuery(query, [], {success: (tx,res) => {
            console.log("--> Created User Table");
            //Create Version Data Table
            query = `CREATE TABLE if not exists VersionData (_id integer primary key not null unique, apiVersion, dataVersion, lastUpdateTimeStamp integer)`;
            _sqlQuery(query, [], {success: (tx,res) => {
                console.log("--> Created VersionData Table");
                //Create Birds Table
                query = `CREATE TABLE if not exists Birds (_id integer primary key not null unique, name text, scientific_name text, range_description text, song_description text)`;
                _sqlQuery(query, [], {success: (tx,res) => {
                    console.log("--> Created Birds Table");
                    //Create Regions Table
                    query = `CREATE TABLE if not exists Regions (_id integer primary key not null unique, project_id integer not null unique, name text)`;
                    _sqlQuery(query, [], {success: (tx,res) => {
                        console.log("--> Created Regions Table");
                        //Create Lists Table
                        query = `CREATE TABLE if not exists Lists (_id integer primary key not null unique, name text)`;
                        _sqlQuery(query, [], {success: (tx,res) => {
                            console.log("--> Created Lists Table");
                            //BirdImages Table
                            query = `CREATE TABLE if not exists BirdImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text, displayOrder integer)`;
                            _sqlQuery(query, [], {success: (tx,res) => {
                                console.log("--> Created BirdImages Table");
                                //MapImages Table
                                query = `CREATE TABLE if not exists MapImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text)`;
                                _sqlQuery(query, [], {success: (tx,res) => {
                                    console.log("--> Created MapImages Table");
                                    //Vocalizations Table
                                    query = `CREATE TABLE if not exists Vocalizations (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text unique, mp3_filename text not null unique, credits text)`;
                                    _sqlQuery(query, [], {success: (tx,res) => {
                                        console.log("--> Created Vocalizations Table");
                                         //SubRegions Table
                                        query = `CREATE TABLE if not exists SubRegions (_id integer primary key not null unique, region_id integer REFERENCES Regions(_id), name text, abbrev text)`;
                                        _sqlQuery(query, [], {success: (tx,res) => {
                                            console.log("--> Created SubRegions Table");
                                            //FileSubRegions Table
                                            query = `CREATE TABLE if not exists FileSubRegions (subregion_id integer REFERENCES SubRegions(_id), file_id integer not null, display_order integer not null,
                                            CONSTRAINT files_subregions_pk primary key (subregion_id, file_id))`;
                                            _sqlQuery(query, [], {success: (tx,res) => {
                                                console.log("--> Created FileSubRegions Table");
                                                //BirdSubRegions Table
                                                query = `CREATE TABLE if not exists BirdSubRegions (subregion_id integer REFERENCES SubRegions(_id), bird_id integer REFERENCES Birds(_id), non_breeder boolean, rare boolean,
                                                CONSTRAINT birds_subregions_pk primary key (subregion_id, bird_id))`;
                                                _sqlQuery(query, [], {success: (tx,res) => {
                                                    console.log("--> Created BirdSubRegions Table");
                                                    //BirdRegions Table
                                                    query = `CREATE TABLE if not exists BirdRegions (region_id integer REFERENCES Regions(_id), bird_id integer REFERENCES Birds(_id), non_breeder boolean, rare boolean,
                                                    CONSTRAINT birds_regions_pk primary key (region_id, bird_id))`;
                                                    _sqlQuery(query, [], {success: (tx,res) => {
                                                        console.log("--> Created BirdRegions Table");
                                                        //BirdLists Table
                                                        query = `CREATE TABLE if not exists BirdLists (list_id integer REFERENCES Lists(_id), bird_id integer REFERENCES Birds(_id),
                                                        CONSTRAINT birds_lists_pk primary key (list_id, bird_id))`;
                                                        _sqlQuery(query, [], {success: (tx,res) => {
                                                            console.log("--> Created BirdsLists Table");
                                                            onFinishedCallback(tx);
                                                        }},tx);
                                                    }},tx);
                                                }},tx);
                                            }},tx);
                                        }},tx);
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
    updateUser: updateUser,
    getCredentials: getCredentials,
    getVersionData: getVersionData,
    updateVersionData: updateVersionData,
    getBirdById: getBirdById,
    insertMultiple: insertMultiple,
    upsertMultiple: upsertMultiple,
    updateInsertBirdRegionsAndBirdSubRegions: updateInsertBirdRegionsAndBirdSubRegions,
    printDatabase: printDatabase,
    printTable: printTable
};
export default DatabaseModule;