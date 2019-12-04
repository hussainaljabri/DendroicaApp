import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import * as FileSystem from 'expo-file-system';
import MediaHandler from './src/DB/MediaHandler';
import DatabaseModule from './src/DB/DatabaseModule';
import DatabaseManagementModule from './src/DB/DatabaseManagementModule';
import Authentication from './src/DB/Authentication';

var allBirdIds;
var currentIndex = 1; //birdId 0 in database but not a real bird. Is a test in dendroica. Should ask Paul to remove

DatabaseModule.getAllBirdIdsInRegion(1, {success: (ids) => {
    allBirdIds = ids;
}});
//
loadFifteen = async () => {
    var birdIdsToLoad = [];
    for (var i = 0; i < 50; i++)
        birdIdsToLoad.push(allBirdIds[i + currentIndex]);
    console.log("bird ids to load = " + birdIdsToLoad);
    return new Promise((resolve, reject) => {
        MediaHandler.saveMediaPaths(birdIdsToLoad, (imageData) => {
            console.log("image data from mediahandler = " + imageData);
            resolve(imageData);
        });
    });
}

export default class App extends React.Component {

state ={
  dataReady: false,
  data: [],
  uri: null,
  base64: null,
  checkEnabled: false,
  refresh: false,
}

//async componentDidMount(){
//
//  checkAndCreateFolder(FileSystem.documentDirectory+'img/');
//
//}

newGetImages=()=>{
  if(this.state.dataReady){
    console.log(this.state);
    return this.state.data.map((item, i)=>{
      console.log(`i:${i}, id${item.id} IMG: `+ item.uri);
      return (
        <View key={'view'+i} style={{justifyContent: "center", alignItems: "center",}}>
          <Text key={'txt'+i} style={{fontWeight:'800', fontSize:14, textAlign: "center"}}>{item.id} {'\n'} and url: {item.uri}</Text>
          <Image key={'img'+i} source={{uri: item.uri}} style={{height: 220, width: 320}} />
        </View>
      )
    });
  }
}

getHandler = async()=>{
  await loadFifteen().then((imageData) => {
    console.log("setting state data");
    console.log("data = " + imageData);
    this.setState({
        data: imageData,
        dataReady: true,
    })
  })
}

  render(){
    return (
      <View style={styles.container}>
        <View style={{marginTop: 30,}}/>
        <View style={{flexDirection:"row", justifyContent: "space-between"}}>
          <TouchableOpacity
            style ={styles.submitButton}
            onPress= {() => this.getHandler()}
          >
                    <Text>Get!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style ={styles.submitButton}
            onPress= {() => this.checkHandler()}
          >
                    <Text>Check</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style ={styles.submitButton}
          >
                    <Text>RemoveAll</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style ={{backgroundColor: 'grey', flex: 1}}>
          <View style={{justifyContent: 'space-evenly', alignItems: 'flex-start'}}>
          </View>
          {this.newGetImages()}
        </ScrollView>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#16a085',
    padding: 10,
    margin: 15,
    height: 40,
 },
});