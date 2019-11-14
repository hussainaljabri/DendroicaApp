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
		"soundPaths": ["67_0.mp3","67_1.mp3","67_2.mp3"],
		"soundCredits": ["Lang  Elliott; 1988 May 19; USA, Kentucky; Adult; Primary Sound; Alarm call;"," Borror Laboratory of Bioacoustics; 1989 Jul 6; USA, Michigan; Adult; Primary Sound;","John  Neville; (Bird Songs of Canada's West Coast); Canada, British Columbia; Wallace; Flock/Group; Primary Sound;"]
	},
	{
	    "birdID": 2248,
	    "birdName": "Chilean Flamingo",
	    "scientificName": "Phoenicopterus chilensis",
	    "rangeDescription": "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico: South America - Resident year-round: 2,939,206 square km; Wintering only: 401,630 square km",
        "songDescription": "No description available in english",
        "regionNames": ["South America"],
        "imagePaths": ["2248_0.jpg", "2248_1.jpg", "2248_2.jpg"],
        "imageCredits": ["katewrightson (http://www.flickr.com/photos/katewrightson/5562353789/); USA; Adult;","Aztlek (http://www.flickr.com/photos/aztlek/5938199359/); Chile; Adult;","Cláudio Timm (http://www.flickr.com/photos/cdtimm/5705178799/); Adult;"],
        "mapPaths": ["2248_americas.png", "2248_south.png"],
        "mapCredits": [
            "Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
            "Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
        ],
        "spectoPaths": [],
        "soundPaths": [],
        "soundCredits": []
	},
    {
        "birdID": 418,
        "birdName": "Field Sparrow",
        "scientificName": "Spizella pusilla",
        "rangeDescription": "Canada - Resident year-round: Canada - Resident year-round: 12,412 square km; Breeding only: 149,708 square km\nMexico - Wintering only: 161,983 square km\nU.S.A. - Resident year-round: 2,425,107 square km; Breeding only: 1,406,775 square km; Wintering only: 586,303 square km",
        "songDescription": "Song is a rising series of ever shorter whistles. Similar in rhythm to a ping pong ball dropped on a table.",
        "regionNames": ["USA"],
        "imagePaths": ["418_0.jpg", "418_1.jpg", "418_2.jpg", "418_3.jpg"],
        "imageCredits": ["Isaac Sanchez; 2012 May 14; USA, Oklahoma; Edmond; Adult;","Chuck Carlson; 2005 May 18; USA, Montana; North McCone County; Adult;","John Reaume; Adult;", "John Reaume; Adult;"],
        "mapPaths": ["418_americas.png", "418_central.png", "418_north.png"],
        "mapCredits": [
            "Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
            "Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp",
            "Range Map: Andrew Couturier Source: Ridgely et al, 2007. Digital Distribution Maps of the Birds of the Western Hemisphere,version 3.0. NatureServe, Arlington, Virginia, USA. www.natureserve.org/getData/birdMaps.jsp"
        ],
        "spectoPaths": ["418_0.png", "418_1.png", "418_2.png", "418_3.png"],
        "soundPaths": ["418_0.mp3", "418_1.mp3", "418_2.mp3", "418_3.mp3"],
        "soundCredits": ["Macaulay Library (Macaulay Library, Cornell); Adult; Primary Sound;","Monty Brigham (Bird Sounds of Canada); 1987 Jun 1; Canada, Ontario; Marlborough Forest - Richmond; Adult; Primary Sound;","Monty Brigham (Bird Sounds of Canada); 1991 May 19; Canada, Ontario; Bob's Lake - Tichborne; Adult; Primary Sound;","Monty Brigham (Nature Sounds of Ontario); 1987 Jul 1; Canada, Ontario; Richmond; Adult; Primary Sound;", ]
  }
]
var init = function() {
    DatabaseModule.destroyDB(function() {
        DatabaseModule.initDB(function() {
            insertRegions(function() {
                insertBirdDataJSON(function() {
                    DatabaseModule.printDatabase();
                });
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
        console.log("calling insert BirdDataset " + bird_id);
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
        d.soundCredits,
        onFinishedCallback,
        );
    }
}


const DatabaseTestDriver = {
    init: init
};

export default DatabaseTestDriver;