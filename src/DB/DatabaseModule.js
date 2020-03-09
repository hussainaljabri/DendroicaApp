import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('Dendroica.db');

const FIELDS = {
    "User": ["_id","dendroica_id","username","password","email","first_name","last_name","language","naming","sorting"],
    "VersionData": ["_id","apiVersion","dataVersion","lastUpdateTimeStamp"],
    "Birds": ["_id","name","scientific_name","range_description","song_description"],
    "Regions": ["_id","project_id","name"],
    "Lists": ["_id","name","isDownloaded"],
    "BirdImages": ["_id","bird_id","filename","credits","displayOrder","isDownloaded"],
    "MapImages": ["_id","bird_id","filename","credits","isDownloaded"],
    "Vocalizations": ["_id","bird_id","filename","mp3_filename","credits","isDownloaded"],
    "SubRegions": ["_id","region_id","name","abbrev"],
    "FileSubRegions": ["subregion_id","file_id","displayOrder"],
    "BirdSubRegions": ["subregion_id","bird_id","non_breeder","rare"],
    "BirdRegions": ["region_id","bird_id","non_breeder","rare"],
    "BirdLists": ["list_id","bird_id"]
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

    //For mapImages, vocalizations, and  birdImages need to add default isDownloaded param to false
    if (tableName == "BirdImages" || tableName == "MapImages" || tableName == "Vocalizations" || tableName == "Lists") {
        //Make shallow copy or isDownloaded appended for each project iterated through (jsonArrayNames param is reused)
        jsonArrayNames = jsonArrayNames.slice();
        jsonArrayNames.push("isDownloaded");
        json["isDownloaded"] = Array(json[jsonArrayNames[0]].length).fill("false");
    }

    db.transaction(function(tx) {
        for (var i = 0; i < json[jsonArrayNames[0]].length; i++) {
            //Build question mark string for sql statement (?,?,?...) for number of params
            //Fill parameters for sql statement. Stop at length * 100 (100 inserts at a time)
            sqlQuestionMarks += ("(");
            jsonArrayNames.forEach((arrayName,index) => {
                sqlQuestionMarks += "?";
                if (index != jsonArrayNames.length - 1)
                    sqlQuestionMarks += ",";

                parameters.push(json[arrayName][i]);
            });
            sqlQuestionMarks += ")"

            // sending every 100 records to DB
            if (parameters.length == jsonArrayNames.length * 100) {
                tx.executeSql("INSERT OR REPLACE INTO " + tableName + " VALUES " + sqlQuestionMarks + ";", parameters);

                // reset the variables
                parameters= [];
                sqlQuestionMarks = "";
            } else   sqlQuestionMarks += ",";
        }
        // send the rest of it (for remainder params < 100 inserts)
        if (sqlQuestionMarks != "")  {
            tx.executeSql("INSERT OR REPLACE INTO " + tableName + " VALUES " + sqlQuestionMarks.slice(0,-1)+ ";", parameters, () => {
                onFinishedCallback();
            });
        }
        else  {
            onFinishedCallback();
        }
    });
}

//  ["regionId","speciesId","nonBreederInRegion","rareInRegion"]
//  region_id integer REFERENCES Regions(_id), bird_id integer REFERENCES Birds(_id), non_breeder boolean, rare boolean
//  Function to insert into both BirdRegions table and SubRegions table as they are populated from the same json
var updateInsertBirdRegionsAndBirdSubRegions = function (json, regionIds, onFinishedCallback) {
    var numDatasets = json.regionId.length;
    var numUpdated = 0;
    var tableName = "";

    db.transaction(function(tx) {
        var index = 0;
        for (var i = 0; i < numDatasets; i++) {
            var tableIdName;

            if (!regionIds.includes(json.regionId[i])) {
                tableName = "BirdSubRegions";
                tableIdName = "subregion_id";
            }
            else {
                tableName = "BirdRegions";
                tableIdName = "region_id";
            }

            var callbackTableName = regionIds.includes(json.regionId[index]) ? "BirdRegions" : "BirdSubRegions";
            _sqlQuery("INSERT OR REPLACE INTO " + callbackTableName + " VALUES (?,?,?,?)",
                [json.regionId[index], json.speciesId[index], json.nonBreederInRegion[index], json.rareInRegion[index]], {success: (tx,res) => {
                    if (++numUpdated == numDatasets) onFinishedCallback();
            }},tx);
            index++;
        }
    });
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
//(_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text, displayOrder integer)
var getImageUrlsByBirdId = function (id, callbacks){
    // var query = `SELECT filename, credits from BirdImages where (bird_id=?) order by displayOrder`;
    var query = "SELECT BirdImages.bird_id as bird_id, BirdImages.filename as image_filename, BirdImages.credits as image_credits, isDownloaded, displayOrder from Birds ";
    query += "INNER JOIN BirdImages on Birds._id = BirdImages.bird_id ";
    query += "where BirdImages.bird_id=? ORDER BY displayOrder";
    // query += "INNER JOIN MapImages on BirdImages.bird_id = MapImages.bird_id ";
    // query += "INNER JOIN Vocalizations on MapImages.bird_id = Vocalizations.bird_id ";
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}
var getMapsUrlByBirdId = function (id, callbacks){
    var query = "SELECT MapImages.bird_id as bird_id, MapImages.filename as map_filename, MapImages.credits as map_credits from Birds ";
    query += "INNER JOIN MapImages on Birds._id = MapImages.bird_id ";
    query += "where MapImages.bird_id=?";

    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}

var getUriData = function (callbacks) {
    var imagesQuery =   "SELECT bird_id, filename, isDownloaded FROM BirdImages where isDownloaded=? Order By displayOrder";
    var vocalQuery  =   "SELECT bird_id, filename, mp3_filename, isDownloaded FROM Vocalizations where isDownloaded=?";

    _sqlQuery(imagesQuery, ["true"], {success:(tx,imgres) => {
        _sqlQuery(vocalQuery, ["true"], {success:(tx,vocalres) => {
            callbacks.success({
                    "imageData":   imgres.rows._array,
                    "vocalData":   vocalres.rows._array
            });
        
        }},tx);
    }});
}

//Returns the url for the number of images requested for each species in the custom list
var getImageUrlsForCustomList = function (list_id, numRequested, callbacks) {
    if (!numRequested) numRequested = "ALL";

    var query = "SELECT filename from BirdImages where bird_id=? LIMIT ?";
    var numBirdsDone = 0;
    var result = [];
    getBirdIdsFromListId(list_id, {success: (res) => {
        res.forEach(row => {
            _sqlQuery(query, [row.bird_id,numRequested], {success: (tx,res) => {
                result = result.concat(res.rows._array);
                if (++numBirdsDone == numRequested) callbacks.success(result);
            }});
        })
    }});
}

//Returns the urls for the number of vocalizations requested (mp3 AND spectrogram)
//For each species in the custom list
var getVocalizationUrlsForCustomList = function (list_id, numRequested, callbacks) {
    if (!numRequested) numRequested = "ALL";

    var query = "SELECT filename, mp3_filename from Vocalizations where bird_id=? LIMIT ?";
    var numBirdsDone = 0;
    var result = [];
    getBirdIdsFromListId(list_id, {success: (res) => {
        res.forEach(row => {
            _sqlQuery(query, [row.bird_id,numRequested], {success: (tx,res) => {
                result = result.concat(res.rows._array);
                if (++numBirdsDone == numRequested) callbacks.success(result);
            }});
        })
    }})
}

//BirdImages
var setImageMediaDownloaded = function (filename, isDownloaded, callbacks) {
    if (isDownloaded == true) isDownloaded == "true";
    if (isDownloaded == false) isDownloaded == "false";
    var query = "UPDATE BirdImages SET isDownloaded=? where filename=?";

    _sqlQuery(query, [isDownloaded,filename], {success: (tx,res) => {
        if (callbacks.success) callbacks.success();
    }})
}

//MP3 and Spectrograms
var setVocalizationsDownloaded = function (filename, isMP3, isDownloaded, callbacks) {
    if (isDownloaded == true) isDownloaded == "true";
    if (isDownloaded == false) isDownloaded == "false";
    var filefield = isMP3? "mp3_filename" : "filename";
    var query = "UPDATE Vocalizations SET isDownloaded=? where " + filefield + "=?";

    _sqlQuery(query, [isDownloaded,filename], {success: (tx, res) => {
        callbacks.success();
    }});
}

var setCustomListDownloaded = function (list_id, isDownloaded, callbacks) {
    if (isDownloaded == true) isDownloaded == "true";
    if (isDownloaded == false) isDownloaded == "false";

    var query = "UPDATE Lists SET isDownloaded=? where _id=?";

    _sqlQuery(query, [isDownloaded,list_id], {success: (tx,res) => {
        callbacks.success();
    }});
}


var getThumbnailUrlByBirdId = function (id, callbacks){
    var query = `SELECT filename from BirdImages where (bird_id=?) and (displayOrder=1)`;
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array[0];
        callbacks.success(result);
    }});
}

var getCustomListBirdIds = function (list_id, callbacks) {
    var query = "SELECT bird_id from BirdLists where list_id=?";

    _sqlQuery(query, [list_id], {success: (tx,res) => {
        callbacks.success(res.rows._array);
    }});
}

/**
 * Creates a custom list
 * @param listName  -> Name of custom list
 * @return          -> ID of new list
 */
var createCustomList = function (listName, callbacks) {
    var query = 'INSERT INTO Lists (name,isDownloaded) VALUES (?,?)';

    _sqlQuery(query, [listName,"false"], {success: (tx,res) => {
        callbacks.success(res.insertId);
    }});
}

/**
 * Deletes a custom list
 * @param listId    -> Id of list to be deleted
 */
var deleteCustomList = function (listId, callbacks) {
    //First Remove all references from BirdLists
    var query = 'DELETE FROM BirdLists where list_id=?';
    _sqlQuery(query, [listId], {success: (tx,res) => {
        var query = 'DELETE FROM Lists where _id = ?';
        _sqlQuery(query, [listId], {success: (tx, res) => {
            callbacks.success();
        }});
    }});
}

/**
 * Adds Birds to a Custom List
 * @param listId    -> ID of list
 * @param birdsIds  -> Array of birdIds
 */
var addBirdsToCustomList = function (listId, birdIds, callbacks) {
    var query = 'INSERT INTO BirdLists VALUES (?,?)';

    var index = 0;
    for (var i = 0; i < birdIds.length; i++) {
        _sqlQuery(query, [listId, birdIds[i]], {success: (tx,res) => {
            if (++index == birdIds.length) callbacks.success();
        }, error: (tx) => {
            console.log("Error - Inserting Bird into Custom List (already exists in list)");
            if (++index == birdIds.length) callbacks.success();
        }})
    }
}

/**
 * Removes Birds from Custom List
 * @param listId    -> ID of list
 * @param birdIds   -> Array of birdIds OR single bird ID
 */
var removeBirdsFromCustomList = function (listId, birdIds, callbacks) {
    if (!Array.isArray(birdIds)) birdIds = [birdIds];
    var query = "DELETE FROM BirdLists where list_id=? and bird_id=?";

    var index = 0;
    for (var i = 0; i < birdIds.length; i++) {
        _sqlQuery(query, [listId, birdIds[i]], {success: (tx,res) => {
            if (++index == birdIds.length) callbacks.success();
        }});
    }
}

//Should be called from Media Handler. Helper function as there is a lot of DB logic
var purgeCustomListDB = function(list_id, purgeFunction, callbacks) {
    //Select all Birds from list that do not belong to a different downloaded list
    var query = "SELECT bird_id from BirdLists WHERE list_id=? AND NOT EXISTS (" +
                "SELECT bird_id from BirdLists INNER JOIN Lists ON BirdLists.list_id=Lists._id WHERE Lists.isDownloaded=? AND NOT BirdLists.list_id=?)";

    _sqlQuery(query,[list_id,"true",list_id], {success: (tx,res) => {
        res.rows._array.forEach(item => {
            query = "SELECT BirdImages.filename, Vocalizations.filename as spectro_file, Vocalizations.mp3_filename from Birds INNER JOIN " +
                    "BirdImages on Birds._id = BirdImages.bird_id INNER JOIN " +
                    "Vocalizations on BirdImages.bird_id = Vocalizations.bird_id WHERE birds._id=? AND BirdImages.isDownloaded=? AND Vocalizations.isDownloaded=?";
            _sqlQuery(query, [item.bird_id,"true","true"], {success: (tx,res) => {
                res.rows._array.forEach(urlTuple => {
                    purgeFunction(urlTuple.filename);
                    purgeFunction(urlTuple.mp3_filename);
                    purgeFunction(urlTuple.spectro_file);
                    setImageMediaDownloaded(urlTuple.filename, false);
                    setVocalizationsDownloaded(urlTuple.mp3_filename, true, false);
                    setVocalizationsDownloaded(urlTuple.spectro_file, false, false);
                });
            },tx});
        });
    }}); 
}

/**
 * BirdRegions (region_id integer REFERENCES Regions(_id), bird_id integer REFERENCES Birds(_id), non_breeder boolean, rare boolean,
                                                    CONSTRAINT birds_regions_pk primary key (region_id, bird_id))
 */
var getBirdsIdByRegionId = function (id, callbacks){
    var query = `SELECT bird_id from BirdRegions where (region_id=?)`;
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}

/**
 * Regions (_id integer primary key not null unique, project_id integer not null unique, name text)`
 */

var getRegionsIdAndNames = function (callbacks){
    var query = `SELECT * from Regions`;
    _sqlQuery(query, [], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}

var getDisplayInfo = function(id, callbacks){ // id is region_id
    // var query = `SELECT Birds._id as bird_id, name, scientific_name, filename  from Birds INNER JOIN BirdImages on Birds._id = BirdImages.bird_id where BirdImages.displayOrder=1 INNER JOIN BirdRegions on BirdImages.bird_id = BirdRegions.bird_id`;
    // var query = "SELECT BirdImages.bird_id as bird_id, name, scientific_name, filename from Birds ";
    // query += "INNER JOIN BirdImages on Birds._id = BirdImages.bird_id ";
    // query += "INNER JOIN BirdRegions on BirdImages.bird_id = BirdRegions.bird_id ";
    // query += "where displayOrder=1 and BirdRegions.region_id=?";
    var query = "SELECT BirdImages.bird_id as bird_id, name, scientific_name, filename, MIN(displayOrder), displayOrder from Birds ";
    query += "INNER JOIN BirdImages on Birds._id = BirdImages.bird_id ";
    query += "INNER JOIN BirdRegions on BirdImages.bird_id = BirdRegions.bird_id ";
    query += "where displayOrder=1 and BirdRegions.region_id=? GROUP BY BirdRegions.bird_id ORDER BY name";
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array;
        for (var i = 0; i < result.length; i++) {
            result[i].url = 'https://natureinstruct.org' + result[i].filename;
        }
        callbacks.success(result);
    }});
}

var getLists = function(callbacks){
    var query =`SELECT * from Lists`;

    _sqlQuery(query, [], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}
var getBirdIdsFromListId = function(list_id, callbacks){
    var query =`SELECT DISTINCT bird_id from BirdLists where list_id=?`;

    _sqlQuery(query, [list_id], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
}
var getListDisplayInfo = function(id, callbacks){ 
    var query = "SELECT BirdImages.bird_id as bird_id, name, scientific_name, filename, MIN(displayOrder), displayOrder from Birds ";
    query += "INNER JOIN BirdImages on Birds._id = BirdImages.bird_id ";
    query += "INNER JOIN BirdLists on BirdImages.bird_id = BirdLists.bird_id ";
    query += "where displayOrder=1 and BirdLists.List_id=? GROUP BY BirdLists.bird_id ORDER BY name";
    _sqlQuery(query, [id], {success:(tx,res) => {
        var result = res.rows._array;
        callbacks.success(result);
    }});
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


//FIXME Can't use ID constraint if table has composite keys
//Warning Function might freeze up the app if numRowsOrId not specified (will try to print the whole table)
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

//@FIXME all booleans need to be replaced. Currently are represented as strings and cause errors in SQL queries
//Can not hard code them into queries and throw errors if replaced with null or actual true/false
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
                        query = `CREATE TABLE if not exists Lists (_id integer primary key not null unique, name text, isDownloaded boolean)`;
                        _sqlQuery(query, [], {success: (tx,res) => {
                            console.log("--> Created Lists Table");
                            //BirdImages Table
                            query = `CREATE TABLE if not exists BirdImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text, displayOrder integer, isDownloaded boolean)`;
                            _sqlQuery(query, [], {success: (tx,res) => {
                                console.log("--> Created BirdImages Table");
                                //MapImages Table
                                query = `CREATE TABLE if not exists MapImages (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text not null unique, credits text, isDownloaded boolean)`;
                                _sqlQuery(query, [], {success: (tx,res) => {
                                    console.log("--> Created MapImages Table");
                                    //Vocalizations Table
                                    query = `CREATE TABLE if not exists Vocalizations (_id integer primary key not null unique, bird_id integer REFERENCES Birds(_id), filename text unique, mp3_filename text not null unique, credits text, isDownloaded boolean)`;
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
                                                            console.log("--> Created BirdLists Table");
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
    updateInsertBirdRegionsAndBirdSubRegions: updateInsertBirdRegionsAndBirdSubRegions,
    printDatabase: printDatabase,
    printTable: printTable,

    getImageUrlsByBirdId: getImageUrlsByBirdId,
    getThumbnailUrlByBirdId:getThumbnailUrlByBirdId,
    getBirdsIdByRegionId: getBirdsIdByRegionId,
    getRegionsIdAndNames: getRegionsIdAndNames,
    getDisplayInfo: getDisplayInfo,

    getLists: getLists,
    getCustomListBirdIds: getCustomListBirdIds,
    getImageUrlsForCustomList: getImageUrlsForCustomList,
    getVocalizationUrlsForCustomList: getVocalizationUrlsForCustomList,
    getBirdIdsFromListId: getBirdIdsFromListId, // i dont need this anymore.
    getListDisplayInfo: getListDisplayInfo,
    getMapsUrlByBirdId: getMapsUrlByBirdId,
    getUriData: getUriData,

    setImageMediaDownloaded: setImageMediaDownloaded,
    setVocalizationsDownloaded: setVocalizationsDownloaded,
    setCustomListDownloaded: setCustomListDownloaded,

    createCustomList: createCustomList,
    deleteCustomList: deleteCustomList,
    addBirdsToCustomList: addBirdsToCustomList,
    removeBirdsFromCustomList: removeBirdsFromCustomList,
    purgeCustomListDB: purgeCustomListDB
};
export default DatabaseModule;