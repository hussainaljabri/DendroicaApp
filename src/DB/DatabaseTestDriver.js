import DatabaseModule from './DatabaseModule';
const data =
[
	{
		"birdID": 67,
		"birdName": "Bald Eagle",
		"scientificName": "Haliaeetus leucocephalus",
		"rangeDescription": "Canada - Resident year-round: 228,651 square km; Breeding only: 5,724,840 square km; Wintering only: 64,369 square km\nMexico - Resident year-round: 782 square km; Wintering only: 516,127 square km\nU.S.A. - Resident year-round: 990,957 square km; Breeding only: 1,700,744 square km; Wintering only: 4,690,048 square km",
		"songDescription": "Largely silent. Hollow whinny and a variety of chirps.",
		"regionNames": ["Canada", "USA", "Mexico"],
	    "imagePaths": ["67_0.jpg", "67_1.jpg", "67_2.jpg", "67_3.jpg"],
		"imageCredits": ["Isaac Sanchez; 2012 Jan 7; USA, Florida; Naples; Adult;","Ann Cook; Adult;","Dave Govoni (Va bene!) (http://www.flickr.com/photos/dgovoni/6818957717/); USA; Adult;","Rick Leche; Adult;"],
		"mapPaths": ["67_americas.png", "67_central.png", "67_north.png"],
		"mapCredits": [
			"Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
			"Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
			"Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp"
			],
		"spectoPaths": ["67_0.png", "67_1.png", "67_2.png"],
		"soundPaths": ["a","b","c"],
		"soundCredits": ["d","e","f"]
	}
]
var init = function() {
    DatabaseModule.destroyDB(function() {
        DatabaseModule.initDB(function() {
            insertRegions(function() {
                insertBirdDataJSON(function() {});


            });
        });
    });
}

var insertRegions = function(onFinishedCallback) {
    DatabaseModule.insertRegion("Canada", {success: function(tx,res) {
        DatabaseModule.insertRegion("USA", {success: function(tx,res) {
            DatabaseModule.insertRegion("Mexico", {success: function(tx,res) {
                DatabaseModule.insertRegion("Caribbean", {success: function(tx,res) {
                    DatabaseModule.insertRegion("Central America", {success: function(tx,res) {
                        DatabaseModule.insertRegion("South America", {success: function(tx,res) {
                            onFinishedCallback();
                        }},tx);
                    }},tx);
                }},tx);
            }},tx);
        }},tx);
    }},null);
}

//var insertBird = function (id, name, scientificName, rangeDescription, songDescription, callbacks) {
var insertBirdDataJSON = function(onFinishedCallback) {
    for (var bird_id in data) {
        var d = data[bird_id];
        DatabaseModule.insertBirdDataset(
        d.birdID,
        d.birdName,
        d.scientificName,
        d.rangeDescription,
        d.songDescription,
        d.regionNames,
        d.imagePaths,
        d.imageCredits,
        d.mapPaths,
        d.mapCredits,
        d.spectoPaths,
        d.soundPaths,
        d.soundCredits
        );
    }
}


const DatabaseTestDriver = {
    init: init
};

export default DatabaseTestDriver;