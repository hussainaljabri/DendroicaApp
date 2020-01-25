import Authentication from './Authentication';
import DatabaseModule from './DatabaseModule';

var versionUpdateInfo;
var versionData;
var regionIds;

var firstImport = true;


var init = function(onFinishedCallback) {
    fetchAndSaveVersionData(() => {
        // versionUpdateInfo.dataVersionUpdate = true; //Uncomment me to force flush db
        //If data version is updated flush entireDB. Flag will be true if DB not initialized
        if (versionUpdateInfo.dataVersionUpdate) { //Flush data
            console.log("data version update = " + versionUpdateInfo.dataVersionUpdate);
            console.log("Create and Fill all tables. Database doesn't exist or dataversion update");
            DatabaseModule.destroyDB(() => {
                DatabaseModule.initDB(() => {
                    onFinishedCallback();
                });
            });
        }
        else onFinishedCallback();
    });
}

var fetchAndSaveVersionData = function(onFinishedCallback) {
    fetch('https://www.natureinstruct.org/api/info')
        .then((response) => response.json())
        .then((responseJson) => {
            DatabaseModule.getVersionData((savedVersionData) => {
                versionUpdateInfo = {
                     "apiVersionUpdate": false,
                     "dataVersionUpdate": false,
                     "lastUpdateTimeStamp": (savedVersionData) ? savedVersionData.lastUpdateTimeStamp: null,
                };

                if (!savedVersionData || savedVersionData.apiVersion != responseJson.apiVersion)
                    versionUpdateInfo.apiVersionUpdate = true;
                if (!savedVersionData || savedVersionData.dataVersion != responseJson.dataVersion)
                    versionUpdateInfo.dataVersionUpdate = true;

                versionData = responseJson;
                onFinishedCallback();
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

//  var projectId corresponds to the project to be downloaded. projectId = null will download all projects
var importApiData = function(projectId, onFinishedCallback) {
    //if we are not reinitializing the entire database use the ifModifiedSince parameter in API calls
    //also use the upsert function in db rather than insert
    var lastModified = versionUpdateInfo.dataVersionUpdate? null : versionUpdateInfo.lastUpdateTimeStamp;
    var lastModifiedApiParam = "";
    var updateInsertFunction = DatabaseModule.insertMultiple;
    if (lastModified || !firstImport) {
        lastModifiedApiParam = '&ifModifiedSince=' + lastModified;
        updateInsertFunction = DatabaseModule.upsertMultiple;
    }


    var projectIds;

    if (projectId) projectIds = [projectId];

    var importRegions = function(onFinishedCallback) {
        if (!firstImport) {
            onFinishedCallback();
            return;
        }
        fetch('https://www.natureinstruct.org/api/projects?token=' + Authentication.getAuthToken() + lastModifiedApiParam)
            .then((response) => response.json())
            .then((responseJson) => {
                if (Object.entries(responseJson).length === 0) {
                    onFinishedCallback();
                    return;
                }
                updateInsertFunction(responseJson, ["masterRegionId","id","name"], "Regions", onFinishedCallback);
                if (!projectId) projectIds = responseJson.id;
                regionIds = responseJson.masterRegionId;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    var importBirdRegionsAndSubRegions = function(onFinishedCallback) {
        for (var id in projectIds) {
            fetch('https://www.natureinstruct.org/api/speciesRegions?token=' + Authentication.getAuthToken() + '&projectId=' + projectIds[id] + lastModifiedApiParam)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (Object.entries(responseJson).length === 0) {
                        console.log("no data to update");
                        onFinishedCallback();
                        return;
                    }
                    DatabaseModule.updateInsertBirdRegionsAndBirdSubRegions(responseJson, regionIds, onFinishedCallback);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    var importTableForProject = function(url, jsonNamesArray, tableName, duplicateIds, onFinishedCallback) {
            var projectsAdded = 0;
            var uniqueJson = {};
            if (duplicateIds) {
                for (var i = 0; i < jsonNamesArray.length; i++) {
                    uniqueJson[jsonNamesArray[i]] = [];
                }
            }
            for (var id in projectIds) {
                fetch('https://www.natureinstruct.org/api/' + url + 'token=' + Authentication.getAuthToken() + '&projectId=' + projectIds[id] + lastModifiedApiParam)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (Object.entries(responseJson).length === 0) {
                            console.log("-- no data to update in " + tableName);
                            onFinishedCallback();
                            return;
                        }

                        var insertJson = responseJson;
                        if (responseJson !== null) {
                            if (duplicateIds) {
                                //If there is a potential for duplicate IDs (such as across projects) create new array parsing out any duplicates
                                for (var i = 0; i < responseJson.id.length; i++) {
                                    if (uniqueJson.id.indexOf(responseJson.id[i]) == -1) {
                                        for (var j = 0; j < jsonNamesArray.length; j++) {
                                            //If statement for debugging mostly. If a field name gets changed in api errors will occur
                                            if (!responseJson[jsonNamesArray[j]]) {
                                                console.error("json name " + jsonNamesArray[j] + " does not exist in table " + tableName);
                                                return;
                                            }
                                            if (!responseJson[jsonNamesArray[j]][i]) {
                                                uniqueJson[jsonNamesArray[j]].push(null);
                                            }
                                            else {
                                                uniqueJson[jsonNamesArray[j]].push(responseJson[jsonNamesArray[j]][i]);
                                            }
                                        }
                                    }
                                }
                                projectsAdded ++;
                                if (projectsAdded == projectIds.length) {
                                    updateInsertFunction(uniqueJson, jsonNamesArray, tableName, onFinishedCallback);
                                }
                            }
                            else {
                                updateInsertFunction(responseJson, jsonNamesArray, tableName, () => {
                                    projectsAdded ++;
                                    if (projectsAdded == projectIds.length)
                                        onFinishedCallback();
                                });
                            }
                        }
                        else {
                            projectsAdded ++;
                            if (projectsAdded == projectIds.length) {
                                if (duplicateIds) {
                                    updateInsertFunction(uniqueJson, jsonNamesArray, tableName, onFinishedCallback);
                                }
                                else
                                    onFinishedCallback();
                            }
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
    }

    importRegions(() => {
        var i,j,k,l,m,n = false;
        console.log("importing from projectRegions?");
        importTableForProject("projectRegions?", ["id","parentRegionId","region","abbrev"], "SubRegions", false, ()=> {
            console.log("inserted all SubRegions");
            importTableForProject('species?', ["id","commonName","scientificName","mapDescription","songDescription"], "Birds", true, () => {
                console.log("inserted all Birds");
                importTableForProject('customLists?', ["id","name"], "Lists", false, () => {
                    console.log("inserted all Lists");
                    importTableForProject('customListSpecies?', ["customListId","speciesId"], "BirdLists", false, () => {
                        i = true; console.log("inserted all BirdLists");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesImages?', ["id","speciesId","url","source","displayOrder"], "BirdImages", true, () => {
                        k = true; console.log("inserted all SpeciesImages");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesMaps?', ["id","speciesId","url","source"], "MapImages", true, () => {
                        l = true; console.log("inserted all MapImages");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesSounds?', ["id","speciesId","spectrogramUrl","url","source"], "Vocalizations", true, () => {
                        m = true; console.log("inserted all Vocalizations");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('fileRegions?', ["regionId","fileId","displayOrder"], "FileSubRegions", false, () => {
                        n = true; console.log("inserted all FileSubRegions");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });

                    importBirdRegionsAndSubRegions(() => {
                        j = true;
                        console.log("inserted all BirdRegions");
                        console.log("inserted all BirdSubRegions");
                        if (i && j && k && l && m && n) {
                            firstImport = false;
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                });
            });
        });
    });
}

const DatabaseManagementModule = {
    init: init,
    importApiData
};
export default DatabaseManagementModule;