import * as FileSystem from 'expo-file-system';
import DatabaseModule from './DatabaseModule';

const MediaDirectory = FileSystem.documentDirectory;
const prefix = 'https://natureinstruct.org';

//All data that has isDownloaded=true
var mediaData; //{imageData, vocalData}

var init = (onFinishedCallback) => {
    DatabaseModule.getUriData({success: (res) => {
        mediaData = res;
        onFinishedCallback();
    }});
}

//Transforms file name in DB to Dendroica URL
var _toUrl = (s) => {
    return prefix+s;
}
//Transforms URL to file name in DB
var _toDbName = (s) => {
    return s.replace(prefix,'');
}
//Transforms file name in DB to FileSystem URI
var _toFsPath = (s) => {
    return MediaDirectory + s.split("/").pop();
}

//Returns the URL to the API or the URI into the File System
var getMediaFile = (bird_id, dbFileName, onlineStatus) => {
    //Fetch from URL if app is online or
    //Media data not yet loaded from back end - can't fetch from FS yet
    if (!mediaData || onlineStatus) return _toUrl(dbFileName);

    for (var i = 0; i < mediaData.imageData.length; i++) {
        if (bird_id == mediaData.imageData[i].bird_id && mediaData.imageData[i].filename == dbFileName) {
            _toFsPath(dbFileName)
        }
    }

    return _toUrl(dbFileName);
}

//@FIXME downloads attempted even if media downloaded. no error but maybe a performance cost
var downloadCustomList = (list_id, onFinishedCallback) => {
    //FIXME Get from user preferences?
    var numRequested = 3;

    //@FIXME.. a lot of params
    var numImgDownloaded = 0;
    var numSpctgDownloaded = 0;
    var numMp3Downloaded = 0;
    var fileTypesDone = 0;

    DatabaseModule.getImageUrlsForCustomList(list_id, numRequested, {success: (image_urls) => {
        for (var i = 0; i < image_urls.length; i++) {
            
            _downloadFile("img", image_urls[i].filename, () => {
                if (++numImgDownloaded == image_urls.length) {
                    if (++fileTypesDone == 3) _getUriData();
                }
            });
        }
    }})
    DatabaseModule.getVocalizationUrlsForCustomList(list_id, numRequested, {success: (vocal_urls) => {
        for (var i = 0; i < vocal_urls.length; i++) {
            
            _downloadFile("spct", vocal_urls[i].filename, () => {
                if (++numSpctgDownloaded == vocal_urls.length) {
                    if (++fileTypesDone == 3) _getUriData();
                }
            });
            
            _downloadFile("mp3", vocal_urls[i].mp3_filename, () => {
                if (++numMp3Downloaded == vocal_urls.length) {
                    if (++fileTypesDone == 3) _getUriData();               
                }
            });
        }
    }})
    _getUriData = () => {
        DatabaseModule.getUriData({success: (data) => {
            mediaData = data;
        }});
        DatabaseModule.setCustomListDownloaded(list_id, "true", {success: () => { 
            console.log("Custom List Downloaded!")
            if (onFinishedCallback) onFinishedCallback(); 
        }});
    }
}

var _downloadFile = (type, dbFileName, onFinishedCallback)  => {
    FileSystem.downloadAsync(
        _toUrl(dbFileName),
        _toFsPath(dbFileName)
    )
    .then(({ uri }) => {
        if (type == "img") {
            DatabaseModule.setImageMediaDownloaded(dbFileName, "true", {success: () => {
                onFinishedCallback();
            }});
        }
        else {
            DatabaseModule.setVocalizationsDownloaded(dbFileName, type === "mp3", "true", {success: () => {
                onFinishedCallback();
            }});
        }
    })
    .catch(error => {
        console.error(error);
    });
}

var purgeCustomList = (list_id) => {
    DatabaseModule.purgeCustomListDB(list_id, _purgeFile);

    var _purgeFile = (dbFileName, onFinishedCallback) => {
        FileSystem.deleteAsync(_toFsPath(dbFileName));
        onFinishedCallback();
    }
}

const MediaHandler = {
    init: init,
    downloadCustomList: downloadCustomList,
    purgeCustomList: purgeCustomList,
    getMediaFile: getMediaFile
};
export default MediaHandler;