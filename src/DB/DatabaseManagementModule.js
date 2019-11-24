import DatabaseModule from './DatabaseModule';

var init = function() {
    DatabaseModule.destroyDB(() => {
        DatabaseModule.initDB(() => {
            insertAPIData(() => {
                DatabaseModule.printDatabase();
            });
        });
    });
}

var insertAPIData = function(onFinishedCallback) {
    var projectIds;

    var fetchRegions = function(onFinishedCallback) {
        fetch('https://www.natureinstruct.org/api/projects?token=tod2lCvzSh9sh6Q')
            .then((response) => response.json())
            .then((responseJson) => {
                DatabaseModule.insertMultiple(responseJson, ["masterRegionId","id","name"], "Regions", onFinishedCallback);
                projectIds = responseJson.id;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    var fetchTableForEachProject = function(url, jsonNamesArray, tableName, duplicateIds, onFinishedCallback) {
            var projectsAdded = 0;
            var uniqueJson = {};
            if (duplicateIds) {
                for (var i = 0; i < jsonNamesArray.length; i++) {
                    uniqueJson[jsonNamesArray[i]] = [];
                }
            }
            for (var id in projectIds) {
                fetch('https://www.natureinstruct.org/api/' + url + 'token=tod2lCvzSh9sh6Q&projectId=' + projectIds[id])
                    .then((response) => response.json())
                    .then((responseJson) => {
                        var insertJson = responseJson;
                        if (responseJson !== null) {
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

    fetchRegions(() => {
        var i,j,k,l,m = false;
        console.log("inserted all Regions");
        fetchTableForEachProject('species?', ["id","commonName","scientificName","mapDescription","songDescription"], "Birds", true, () => {
            console.log("inserted all Birds");
            fetchTableForEachProject('customLists?', ["id","name"], "Lists", false, () => {
                console.log("inserted all Lists");
                fetchTableForEachProject('customListSpecies?', ["customListId","speciesId"], "BirdLists", false, () => {
                    console.log("inserted all BirdLists");
                    i = true;
                    if (i && j && k && l && m) onFinishedCallback();
                });
                fetchTableForEachProject('speciesRegions?', ["regionId","speciesId","nonBreederInRegion","rareInRegion"], "BirdRegions", false, () => {
                    console.log("inserted all BirdRegions");
                    j = true;
                    if (i && j && k && l && m) onFinishedCallback();
                });
                fetchTableForEachProject('speciesImages?', ["id","speciesId","url","source","displayOrder"], "BirdImages", true, () => {
                    console.log("inserted all SpeciesImages");
                    k = true;
                    if (i && j && k && l && m) onFinishedCallback();
                });
                fetchTableForEachProject('speciesMaps?', ["id","speciesId","url","source"], "MapImages", true, () => {
                    console.log("inserted all MapImages")
                    l = true;
                    if (i && j && k && l && m) onFinishedCallback();
                });
                fetchTableForEachProject('speciesSounds?', ["id","speciesId","spectrogramUrl","url","source"], "Vocalizations", true, () => {
                    console.log("inserted all Vocalizations");
                    m = true;
                    if (i && j && k && l && m) onFinishedCallback();
                });
            });
        });
    });
}

const DatabaseManagementModule = {
    init: init
};
export default DatabaseManagementModule;