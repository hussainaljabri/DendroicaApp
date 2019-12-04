import * as FileSystem from 'expo-file-system';
import DatabaseModule from './DatabaseModule';


downloadHandler = async (arrayUri)=>{
  var temp = [];
  for(let i=0; i<arrayUri.length; i++){
    let id = arrayUri[i].id
    try{
      let result = await FileSystem.downloadAsync(
        arrayUri[i].uri,
        FileSystem.documentDirectory + `img/${arrayUri[i].id}.jpg`);
        console.log(`i:${i}, id:${id} Downloaded: `+ arrayUri[i].uri);

        const fileInfo = await FileSystem.getInfoAsync(result.uri);

        if(fileInfo.exists){
          console.log('fileInfo Found?: '+ fileInfo.exists);
          console.log('result.uri: '+ result.uri);
          temp.push({id: id, uri: result.uri});
        }

    }catch(err){
      console.log('Error: '+ err);
    }
  }
  return temp;
//  this.setState({
//    dataReady: true,
//  });
}

function saveMediaPaths(ids, onFinishedCallback) {
    //return new Promise((resolve, reject) => {
        //If offline get file path

        //If online get URI
        var temp = [];
        var count = 0;


         for (var i = 0; i < ids.length; i++) {
             DatabaseModule.getBirdImagePreviewUri(ids[i], {success: (result) => {
                 if (!result || !result.path) {
                     console.log("no filename returning");
                     i ++;
                     if (++count == ids.length) {
                          console.log("calling resolve");
                          onFinishedCallback(temp);
                      }
                     return;
                 }
                 var uri = 'https://www.natureinstruct.org//' + result.path;
                 temp.push({id: result.id, uri: uri});
                 if (++count == ids.length) {
                     console.log("calling resolve");
                     onFinishedCallback(temp);
                 }
             }});
         }
    //});


}

const MediaHandler = {
    saveMediaPaths: saveMediaPaths,
    downloadHandler: downloadHandler
}
export default(MediaHandler);