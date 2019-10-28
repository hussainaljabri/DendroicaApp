import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('Dendroica.db');

//Define id explicitly for birds to correspond to Dendroica's IDs
var insertBird = function (id, name, scientificName, description, rangeDescription, songDescription, callbacks) {
    var query = `INSERT INTO Birds (_id, name, scientific_name, description, range_description, song_description) VALUES (?,?,?,?,?,?)`;
    _sqlQuery(query, [id,name,scientificName,description,rangeDescription,songDescription], callbacks);
};

var insertRegion = function (name, callbacks) {
    var query = `INSERT INTO Regions (name) VALUES (?)`;
    _sqlQuery(query, [name], callbacks);
};

var insertList = function (name, callbacks) {
    var query = `INSERT INTO Lists (_id, name) VALUES (?,?)`;
    _sqlQuery(query, [name], callbacks);
};

var insertBirdImage = function (birdID, path, credits, callbacks) {
    var query = `INSERT INTO BirdImages (bird_id, filename, credits) VALUES (?,?,?)`;
    _sqlQuery(query, [birdID, path, credits], callbacks);
};

var insertMapImage = function (birdID, path, credits, callbacks) {
    var query = `INSERT INTO MapImages (bird_id, filename, credits) VALUES (?,?,?)`;
    _sqlQuery(query, [birdID, path, credits], callbacks);
};

var insertVocalization = function (birdID, spectoPath, mp3Path, credits, callbacks) {
    var query = `INSERT INTO Vocalizations (bird_id, filename, mp3_filename, credits) VALUES (?,?,?,?)`;
    _sqlQuery(query, [birdID,spectoPath,mp3Path,credits], callbacks);
};

var insertBirdRegion = function (regionID, birdID) {
    var query = `INSERT INTO BirdRegions (region_id, bird_id) VALUES (?,?)`;
    _sqlQuery(query, [regionID, birdID], callbacks);
};

var insertBirdList = function (listID, birdID) {
    var query = `INSERT INTO BirdLists (list_id, bird_id) VALUES (?,?)`;
    _sqlQuery(query, [listID, birdID], callbacks)
};

//For Debugging
var printBirds = function () {
    var query = `SELECT * FROM Birds`;
    _sqlQuery(query, [], {success:
        function(tx, res) {
            console.log("Returned success from SQL Query");
            var rows = res.rows._array;
            console.log("Rows.length = " + rows.length);
            //Empty Array
            if (rows.length == 0) {
                console.log("Table Empty");
                return;
            }
            //2D Array
            if (rows.length == 1) {
                for (var row = 0; row < rows.length; row++)
                    console.log(rows[row]);
            }
            //3D Array
            for (var row = 0; row < rows.length; row++) {
                for (var i = 0; i < rows[row].length; i++) {
                    console.log(rows[row][i]);
                }
            }
        }
    });
}

//param query = sqlite query
//param params = if values in query are represented as '?' they will be filled in in order by the params array.
//  this is the only way queries can be "built". If no params pass empty array.
//callbacks = json object {success: successFunction(tx,res); error: errorFunction(tx)}
//  either callback may be passed optionally as well as their parameters. Function is async though so will usually need success
var _sqlQuery = function (query, params, callbacks) {
    var success = (!callbacks.success) ? function(tx,res) { return res; } : callbacks.success;
    var error = (!callbacks.error) ? function(err) { console.log("----Error With Query----\n" + query); return; } : callbacks.error;

    db.transaction(function(tx) {
        tx.executeSql(
            query,
            params,
            success,
            error
        );
    });
}

var initDB = function() {
    db.transaction(function(tx) {
      tx.executeSql(
         'PRAGMA foreign_keys=ON', [],
         function(tx) { console.log("fk enabled"); createTables(); },
         function(err) { console.log(err); return; }
      );
    });

    var createTables = function() {
        var query;
        //Create Birds Table
        query = `CREATE TABLE if not exists Birds (_id integer primary key not null unique, name text unique, scientific_name text unique, description text, range_description text, song_description text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created Birds Table");
        }});

        //Create Regions Table
        query = `CREATE TABLE if not exists Regions (_id integer primary key not null unique, name text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created Regions Table");
        }});
        //Create Lists Table
        query = `CREATE TABLE if not exists Lists (_id integer primary key not null unique, name text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created Lists Table");
        }});
        //BirdImages Table
        query = `CREATE TABLE if not exists BirdImages (_id integer primary key not null unique, bird_id REFERENCES Birds(_id), filename text not null unique, credits text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created BirdImages Table");
            insertBirdImage(1, 2, "file","Robyn");
        }});
        //MapImages Table
        query = `CREATE TABLE if not exists MapImages (_id integer primary key not null unique, bird_id REFERENCES Birds(_id), filename text not null unique, credits text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created MapImages Table");
        }});
        //Vocalizations Table
        query = `CREATE TABLE if not exists Vocalizations (_id integer primary key not null unique, bird_id REFERENCES Birds(_id), filename text not null unique, mp3_filename text not null unique, credits text)`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created Vocalizations Table");
        }});
        //BirdRegions Table
        query = `CREATE TABLE if not exists BirdRegions (region_id REFERENCES Regions(_id), bird_id REFERENCES Birds(_id),
        CONSTRAINT birds_regions_pk primary key (region_id, bird_id))`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created BirdRegions Table");
        }});
        //BirdLists Table
        query = `CREATE TABLE if not exists BirdLists (list_id REFERENCES Lists(_id), bird_id REFERENCES Birds(_id),
        CONSTRAINT birds_lists_pk primary key (list_id, bird_id))`;
        _sqlQuery(query, [], {success: function(tx,res) {
            console.log("--> Created BirdsLists Tables");
        }});
    }
}

const DatabaseModule = {
    //Retrieve Bird Information//
    //printHello: printHello,
    initDB: initDB,
    insertBird : insertBird,
    insertRegion: insertRegion,
    insertList: insertList,
    insertBirdImage: insertBirdImage,
    insertMapImage: insertMapImage,
    insertVocalization: insertVocalization,
    insertBirdRegion: insertBirdRegion,
    insertBirdList: insertBirdList
    //getPhoto: getPhoto
    //createTable: createTable
    //Retrieve Quiz Information//
};
export default DatabaseModule;