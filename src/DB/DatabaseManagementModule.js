import Authentication from './Authentication';
import DatabaseModule from './DatabaseModule';

var versionUpdateInfo;
var versionData;
var regionIds;

var init = function(onFinishedCallback) {
    fetchAndSaveVersionData(() => {
        //versionUpdateInfo.dataVersionUpdate = true; //Uncomment me to force flush db
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
    if (lastModified) lastModifiedApiParam = '&ifModifiedSince=' + lastModified;

    //Might be a little unnescessary.
    //projectId param can be single project to import, list of projects to import, or null for all projects
    var projectIds;
    if (projectId)
        projectIds = Array.isArray(projectId) ?  projectId : [projectId];

    var importRegions = function(onFinishedCallback) {
        fetch('https://www.natureinstruct.org/api/projects?token=' + Authentication.getAuthToken() + lastModifiedApiParam)
            .then((response) => response.json())
            .then((responseJson) => {
                if (Object.entries(responseJson).length === 0) {
                    onFinishedCallback();
                    return;
                }
                DatabaseModule.insertMultiple(responseJson, ["masterRegionId","id","name"], "Regions", onFinishedCallback);
                if (!projectId) projectIds = responseJson.id;
                regionIds = responseJson.masterRegionId;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    var importBirdRegionsAndSubRegions = function(onFinishedCallback) {
        var projectsAdded = 0;

        projectIds.forEach((id) => {
            fetch('https://www.natureinstruct.org/api/speciesRegions?token=' + Authentication.getAuthToken() + '&projectId=' + id + lastModifiedApiParam)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (Object.entries(responseJson).length === 0) {
                        if (++projectsAdded === projectIds.length) {
                            onFinishedCallback();
                            return;
                        }
                    }
                    else {
                        DatabaseModule.updateInsertBirdRegionsAndBirdSubRegions(responseJson, regionIds, () => {
                            if (++projectsAdded === projectIds.length) {
                                onFinishedCallback();
                                return;
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    var importTableForProject = function(url, jsonNamesArray, tableName, onFinishedCallback) {
            var projectsAdded = 0;

            projectIds.forEach((id) => {
                fetch('https://www.natureinstruct.org/api/' + url + 'token=' + Authentication.getAuthToken() + '&projectId=' + id + lastModifiedApiParam)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (Object.entries(responseJson).length === 0) {
                            if (++projectsAdded === projectIds.length) {
                                console.log("-- no data to update in " + tableName);
                                onFinishedCallback();
                                return;
                            }
                        }
                        else {
                            DatabaseModule.insertMultiple(responseJson, jsonNamesArray, tableName, () => {
                                if (++projectsAdded === projectIds.length) {
                                    onFinishedCallback();
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
    }

    importRegions(() => {
        var i,j,k,l,m,n = false;
        console.log("importing from projectRegions?");
        importTableForProject("projectRegions?", ["id","parentRegionId","region","abbrev"], "SubRegions", ()=> {
            console.log("inserted all SubRegions");
            importTableForProject('species?', ["id","commonName","scientificName","mapDescription","songDescription"], "Birds", () => {
                console.log("inserted all Birds");
                importTableForProject('customLists?', ["id","name"], "Lists", () => {
                    console.log("inserted all Lists");
                    importTableForProject('customListSpecies?', ["customListId","speciesId"], "BirdLists", () => {
                        i = true; console.log("inserted all BirdLists");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesImages?', ["id","speciesId","url","source","displayOrder"], "BirdImages", () => {
                        k = true; console.log("inserted all SpeciesImages");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesMaps?', ["id","speciesId","url","source"], "MapImages", () => {
                        l = true; console.log("inserted all MapImages");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('speciesSounds?', ["id","speciesId","spectrogramUrl","url","source"], "Vocalizations", () => {
                        m = true; console.log("inserted all Vocalizations");
                        if (i && j && k && l && m && n) {
                            DatabaseModule.updateVersionData(versionData, onFinishedCallback);
                        }
                    });
                    importTableForProject('fileRegions?', ["regionId","fileId","displayOrder"], "FileSubRegions", () => {
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
    importApiData: importApiData
};
export default DatabaseManagementModule;