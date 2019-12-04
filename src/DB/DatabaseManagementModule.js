import Authentication from './Authentication';
import DatabaseModule from './DatabaseModule';

var versionUpdateInfo;
var versionData;

var init = function(onFinishedCallback) {
    //DatabaseModule.destroyDB(() => {
        fetchAndSaveVersionData(() => {
            //If data version is updated flush entireDB. Flag will be true if DB not initialized
            if (versionUpdateInfo.dataVersionUpdate) { //Flush data
                DatabaseModule.destroyDB(() => {
                    DatabaseModule.initDB(() => {
                        onFinishedCallback();
                    });
                });
            }
            else onFinishedCallback();
        });

    //});
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
    //Add lastModified to api calls when ready
    var lastModified = versionUpdateInfo.dataVersionUpdate? null : versionUpdateInfo.lastUpdateTimeStamp;

    var projectIds;
    var regionIds;

    if (projectId) projectIds = [projectId];

    var importRegions = function(onFinishedCallback) {
        fetch('https://www.natureinstruct.org/api/projects?token=' + Authentication.getAuthToken())
            .then((response) => response.json())
            .then((responseJson) => {
                DatabaseModule.insertMultiple(responseJson, ["masterRegionId","id","name"], "Regions", onFinishedCallback);
                if (!projectId) projectIds = responseJson.id;
                regionIds = responseJson.masterRegionId;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    var importSubRegions = function(onFinishedCallback) {
        fetch('https://www.natureinstruct.org/api/regions?token=' + Authentication.getAuthToken() + '&projectId=1')
            .then((response) => response.json())
            .then((responseJson) => {
                DatabaseModule.insertMultiple(responseJson, ["id","parentRegionId","name","abbrev"], "SubRegions", onFinishedCallback);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    var importBirdRegionsAndSubRegions = function(onFinishedCallback) {
        for (var id in projectIds) {
            fetch('https://www.natureinstruct.org/api/speciesRegions?token=' + Authentication.getAuthToken() + '&projectId=1')
                .then((response) => response.json())
                .then((responseJson) => {
                    DatabaseModule.insertBirdRegionsAndBirdSubRegions(responseJson, regionIds, onFinishedCallback);
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
                fetch('https://www.natureinstruct.org/api/' + url + 'token=' + Authentication.getAuthToken() + '&projectId=' + projectIds[id])
                    .then((response) => response.json())
                    .then((responseJson) => {
                        var insertJson = responseJson;
                        if (responseJson !== null) {
                            if (responseJson.errorMsg) console.err(responseJson.errorMsg);
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
                                    DatabaseModule.insertMultiple(uniqueJson, jsonNamesArray, tableName, onFinishedCallback);
                                }
                            }
                            else {
                                DatabaseModule.insertMultiple(responseJson, jsonNamesArray, tableName, () => {
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
                                    DatabaseModule.insertMultiple(uniqueJson, jsonNamesArray, tableName, onFinishedCallback);
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
        console.log("inserted all Regions");
        importSubRegions(() => {
            console.log("inserted all SubRegions");
            importTableForProject('species?', ["id","commonName","scientificName","mapDescription","songDescription"], "Birds", true, () => {
                console.log("inserted all Birds");
                importTableForProject('customLists?', ["id","name"], "Lists", false, () => {
                    console.log("inserted all Lists");
                    importTableForProject('customListSpecies?', ["customListId","speciesId"], "BirdLists", false, () => {
                        i = true; console.log("inserted all BirdLists");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesImages?', ["id","speciesID","url","source","displayOrder"], "BirdImages", true, () => {
                        k = true; console.log("inserted all SpeciesImages");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesMaps?', ["id","speciesID","url","source"], "MapImages", true, () => {
                        l = true; console.log("inserted all MapImages");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesSounds?', ["id","speciesID","spectrogramUrl","url","source"], "Vocalizations", true, () => {
                        m = true; console.log("inserted all Vocalizations");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('fileRegions?', ["regionId","fileId","displayOrder"], "FileSubRegions", false, () => {
                        n = true; console.log("inserted all FileSubRegions");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });

                    importBirdRegionsAndSubRegions(() => {
                        j = true;
                        console.log("inserted all BirdRegions");
                        console.log("inserted all BirdSubRegions");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData({versionData}, onFinishedCallback);
                        }
                    });
//                    fetchTableForProject('speciesRegions?', ["regionId","speciesId","nonBreederInRegion","rareInRegion"], "BirdRegions", false, () => {
//                        console.log("inserted all BirdRegions");
//                        j = true;
//                        if (i && j && k && l && m) onFinishedCallback();
//                    });
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