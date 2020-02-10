import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';

import DatabaseModule from './DatabaseModule';

const MediaDirectory = FileSystem.documentDirectory + "media";
const prefix = 'https://natureinstruct.org';

//All data that has isDownloaded=true
var mediaData;
//"imageData":
//"mapData":
//"vocalData":

var init = (onFinishedCallback) => {
    makeMediaDirectory();
    DatabaseModule.getUriData({success: (res) => {
        mediaData = res;
        onFinishedCallback();
    }});
}

async function makeMediaDirectory() {
    try {
        try {
              await FileSystem.makeDirectoryAsync(MediaDirectory,{
                intermediates: true
              })
            } catch(error) {
                console.log(error);
            }
        console.log("created Media Folder");
    } catch(error) {
        alert(error)
    }
}

//Returns the URL to the API or the URI into the File System
var getMediaFile = (partialPath) =>{
    if (!mediaData) return prefix+partialPath;

    var filename = partialPath.split("/").pop();
    var dbName = "/files/avian_images/" + filename;

    for (var i = 0; i < mediaData.imageData.length; i++) {
        if (mediaData.imageData[i].filename === dbName) {
            //Can't store actual true in db. Compare must be as string
            if (mediaData.imageData[i].isDownloaded === "true") {
                return MediaDirectory + filename;
            }
        }
    }

    return prefix+partialPath;
}

var tempGetMediaFile = () => {
    return MediaDirectory + 'GB2-128916-Vanellus_chilensis_AOU_7_52.jpg';
}

var downloadList = (list_id) => {
    DatabaseModule.getImageUrlsForCustomList(list_id, {success: (image_urls) => {
        for (var i = 0; i < image_urls.length; i++) {
            downloadFile(prefix + image_urls[i].filename);
        }
        DatabaseModule.getUriData({success: (data) => {
            mediaData = data;
            console.log("List Downloaded!");
        }});
    }})
}

var downloadFile = async function(url) {
    var filename = url.split("/").pop();
    var dbName = "/files/avian_images/" + filename;

    FileSystem.downloadAsync(
        url,
        MediaDirectory + filename
    )
    .then(({ uri }) => {
        for (var i = 0; i < mediaData.imageData; i++) {
            if (mediaData.imageData[i].filename === dbName) {
                mediaData.imageData[i].isDownloaded = "true";
            }
        }
        DatabaseModule.setImageMediaDownloaded(dbName, "BirdImages", "true", {success: () => {
        }});
    })
    .catch(error => {
        console.error(error);
    });
}

const MediaHandler = {
    init: init,
    makeMediaDirectory: makeMediaDirectory,
    downloadFile: downloadFile,
    downloadList: downloadList,
    getMediaFile: getMediaFile
};
export default MediaHandler;