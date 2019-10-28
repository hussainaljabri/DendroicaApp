import * as FileSystem from 'expo-file-system';


/**
 * Initilize File Storage
 * It checks if Path given exists or not
 * if it doesn't exist, it'll create an empty folder.
 * @param {string} folder_path 
 */
export const initDirectory = async folder_path =>{
    const folder_info = await FileSystem.getInfoAsync(folder_path);
    if(!Boolean(folder_info.exists)){
      // create folder!
      try{
        await FileSystem.makeDirectoryAsync(folder_path,{
          intermediates: true
        })
        console.log("Created File at: " + folder_path);
        return true; // Folder Creation success
      }catch(error){
        // Folder creation error
        const new_folder_info = await FileSystem.getInfoAsync(folder_path);
        const debug = `checkAndCreateFolder: ${
          error.message
        } old: ${JSON.stringify(folder_info)} new: ${JSON.stringify(new_folder_info)}`;
        console.log(debug);
        return false; // error occured
      }
    }
    return true; // Directory already exist
}

/**
 * Initilize File Storage
 * It checks if Path given exists or not
 * if it doesn't exist, it'll create an empty folder.
 * @param {Storage File path} folder_path 
 */
export const storeFile = async folder_path =>{


}

export const getFileContents = async (folder_path, callback) =>{
    const fileInfo = await FileSystem.getInfoAsync(folder_path);
    if(fileInfo.exists){
      const folder_info = await FileSystem.readDirectoryAsync(folder_path);
      console.log("FolderInfo: "+folder_info);
    //   this.setState({
    //     checkContents: folder_info,
    //     checkEnabled: true,
    //   })
      return folder_info;
    }else{
      return []; // empty.
    }
}

export const removeDirectory = async (folder_path, callback) =>{
    const fileInfo = await FileSystem.getInfoAsync(folder_path);
    if(fileInfo.exists){
      let content = this.state.checkContents;
      for(let i=0; i<content.length;i++){
  
        try{
          await FileSystem.deleteAsync(folder_path+content[i]);
            
        }catch(err){
          console.log('removeAll ERROR: '+ err);
        }
  
      }
      // reset States. using Callback function.
    //   this.setState({
    //     dataReady: false,
    //     checkEnabled: false,
    //     data: [],
    //     checkContents: [],
    //   });      
     }
}


/**
 * --------------- Download Handler ----------------------
 */

downloadHandler = async (arrayUri)=>{
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
            // let temp = this.state.data;
            // temp.push({id: id, uri: result.uri, });
            // this.setState({
            //   data: temp,
            // });
          }
    
      }catch(err){
        // maybe Retry downloading?
        // console.log('Error: '+ err);
        return false;
      }
    }
    return true; // file downloaded
    // this.setState({
    //   dataReady: true,
    // });
  }
/**
 * --------------- Download Handler ENDS ----------------------
 */