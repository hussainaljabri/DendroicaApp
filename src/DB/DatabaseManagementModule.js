import Authentication from './Authentication';
import DatabaseModule from './DatabaseModule';

var init = function(onFinishedCallback) {
    DatabaseModule.destroyDB(() => {
        DatabaseModule.initDB(() => {
            onFinishedCallback();
        });
    });
}

//  var projectId corresponds to the project to be downloaded. projectId = null will download all projects
var importAPIData = function(projectId, onFinishedCallback) {
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
                                for (var i = 0; i < responseJson.id.length; i++) {
                                    if (uniqueJson.id.indexOf(responseJson.id[i]) == -1) {
                                        for (var j = 0; j < jsonNamesArray.length; j++) {
                                            uniqueJson[jsonNamesArray[j]].push(responseJson[jsonNamesArray[j]][i]);
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
                        console.log("inserted all BirdLists");
                        i = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
                    });
                    importTableForProject('speciesImages?', ["id","speciesId","url","source","displayOrder"], "BirdImages", true, () => {
                        console.log("inserted all SpeciesImages");
                        k = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
                    });
                    importTableForProject('speciesMaps?', ["id","speciesId","url","source"], "MapImages", true, () => {
                        console.log("inserted all MapImages")
                        l = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
                    });
                    importTableForProject('speciesSounds?', ["id","speciesId","spectrogramUrl","url","source"], "Vocalizations", true, () => {
                        console.log("inserted all Vocalizations");
                        m = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
                    });
                    importTableForProject('fileRegions?', ["regionId","fileId","displayOrder"], "FileSubRegions", false, () => {
                        console.log("inserted all FileSubRegions");
                        n = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
                    });

                    importBirdRegionsAndSubRegions(() => {
                        console.log("inserted all BirdRegions");
                        console.log("inserted all BirdSubRegions");
                        j = true;
                        if (i && j && k && l && m && n) onFinishedCallback();
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
    importAPIData
};
export default DatabaseManagementModule;