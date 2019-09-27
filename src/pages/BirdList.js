import React, { Component } from "react";
import {SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";
import BirdCard from '../components/BirdCard';
import { SearchBar } from 'react-native-elements';
import Constants from 'expo-constants';

const prefix = 'https://www.natureinstruct.org';


const Birds = [
    {id: 1, name: 'Golden Eagle', image: require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg')},
    {id: 2, name: 'American Golden-Plover', image:require('../../assets/Birdimages/MP-1669-Pluvialis_dominica.jpg')},
    {id: 3, name: 'Common Ringed Plover', image:require('../../assets/Birdimages/76165-Charadrius_hiaticula_AOU_7_52.jpg')},
    {id: 4, name: 'Semipalmated Plover', image:require('../../assets/Birdimages/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg')},
    {id: 5, name: 'Spotted Sandpiper', image:require('../../assets/Birdimages/72902-Actitis_macularius_AOU_7_52.jpg')},
    {id: 6, name: 'Surfbird', image:require('../../assets/Birdimages/RH-1442-Aphriza_virgata.jpg')},
    {id: 7, name: 'Black-throated Green Warbler', image:require('../../assets/Birdimages/CMF-9382-Dendroica_virens.jpg')},
    {id: 8, name: 'Gray-crowned Rosy-Finch', image:require('../../assets/Birdimages/LM-9260-Leucosticte_tephrocotis.jpg')},
    {id: 9, name: 'Merlin', image:require('../../assets/Birdimages/TB2-119938-Falco_columbarius_AOU_7_52.jpg')},
    {id: 10, name: 'Eurasian Collared-Dove', image:require('../../assets/Birdimages/87129-Streptopelia_decaocto_AOU_7_52.jpg')},
    {id: 11, name: 'Rufous Hummingbird', image:require('../../assets/Birdimages/TB2-14343-Selasphorus_rufus.jpg')},
    {id: 12, name: 'Western Tanager', image:require('../../assets/Birdimages/LM-9392-Piranga_ludoviciana.jpg')},

]



export default class BirdList extends Component {
    
    /**
     * State: Contains All the varibales needed in this Component
     */
    state ={
       arr: null,
       dataReady: false,
       userInput: '',
       searchInput: '',
    };

    /**
     * Parser Module: specifically made to pull img's src links from #slides parent
     * @param {string} id passed to Url to find specific bird by its id
     */
    async loadImageDendroica(id){
        const Url = `https://www.natureinstruct.org/srv/json.php/get_species/${id}`;
        const response = await fetch(Url); // Gets the HTML.
        const htmlString = await response.text(); // Making it into String.
        const cheerio = require("cheerio"); // Cheerio Library initialization requirement. Please Refer to this link for more info (https://github.com/cheeriojs/cheerio)
        const parsedHTML = cheerio.load(htmlString); // pass in the HTML document to cheerio.load(), to be able to select classes/tags
        return parsedHTML('#slides div img').map((_,img)=>({   // since parsedHTML contains an array of classes and tags with their contents. We can easily select using CSS Selectors as shown.
               imageVar: parsedHTML(img).attr('src'),  // It is now returning a JSON format { imageVar: 'string1'},{imageVar: 'string2'}.. etc
        }));

    }
    
    /**
     * Load State is used to update the states, and calls parser to get the reguested data and store it in the arr.
     * @param {string} id 
     */
    async loadState(id){  
        this.setState({
            dataReady: true,
            arr: await this.loadImageDendroica(id),

        });
        console.log("State Updated");

    }
    /**
     * Gets the arr length, only when data is ready.
     */
    getLength = () =>{ 
        if(this.state.dataReady == true){
            return <Text>Array Length: {this.state.arr.length}</Text>
        }
    }

    /**
     * Transfers each component in arr, to new variable to be then used in constructing a render-able view.
     * 
     */
    printOut=()=>{ // works
        let urls = [];
        if(this.state.dataReady == true){
            /**
             * This for loop below, is a workaround to an issue i had where i can't access the values of this.state.arr directly because they're assigned with keys 0,1,2,...n.
             * So i figured i should transfer the links associated with each key to urls array, and then use .map() on that temp variable.
             */
            for(let i=0; i<this.state.arr.length ; i++){
                urls.push(
                    Object.values(this.state.arr[i]), 
                )
            }

         }

        return urls.map((item, i)=>{

             return (
                /**
                 * Can be any other View structure, or component.
                 */
                <View key={'View-'+i}>
                    <Text key={'Text-'+i}>{prefix +item}</Text>
                    <Image key={'Img-'+i} style={{width: 250, height: 250}} resizeMode='cover' source={{uri: prefix + item }} />
                </View>
             )
        });
    }


    /**
     * Works as Action Listener, to Submit button.
     */
    requestData=(text)=>{
        this.loadState(text);
    }
    /**
     * Works as Input Listener, to constantly update userInput variable in state.
     */
    handleUserInput=(text)=>{
        this.setState({userInput: text});
    }

    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    }
    handlerClick=(id, name)=>{
        Alert.alert("Click:\n" +id+": "+name);
    }

    getBirdCards = () =>{
        return Birds.map((bird) =>{
            return (
                <BirdCard 
                key={bird.id} 
                birdName={bird.name} 
                imgUrl={bird.image} 
                onPress={()=>{this.handlerClick(bird.id, bird.name)}} 
                onLongPress={()=>{this.handlerLongClick(bird.id, bird.name)}}
                
                />
            );
        });
    }

    updateSearch = (inputText) =>{
        this.setState({
            searchInput: inputText,
        });
    }
    render() {

    
        return (

          <ScrollView>
              <View style={styles.statusBar}/>
            {/* <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "  Bird Id"
                placeholderTextColor = "#16a085"
                autoCapitalize="none"
                onChangeText = {this.handleUserInput} />
            <TouchableOpacity style ={styles.submitButton}
                onPress= {
                    () => this.requestData(this.state.userInput)
                }>
                <Text>Submit</Text>
            </TouchableOpacity>

                {this.getLength()}
                
                {this.printOut()} */}
            <SearchBar
                placeholder="Find my bird..."
                onChangeText={this.updateSearch}
                value={this.state.searchInput}
                placeholderTextColor="grey"
                inputStyle={{fontSize: 14, color: 'white'}} // style the TextInput
                containerStyle={{backgroundColor: 'white', borderTopColor: 'white', borderBottomColor: 'white',}} // style of the container which contains the search bar.
            />
            {this.getBirdCards()}

            <Text>{this.state.searchInput}</Text>
          </ScrollView>
        );
      }
  


}

/**
 * Styles goes here.
 */
const styles = StyleSheet.create({

    scrollContainer:{
      flex: 1,
    },
    image: {
        width: 250,
        height: 250,
      },
      input: {
        margin: 15,
        height: 40,
        borderColor: '#16a085',
        borderWidth: 1
     },
     submitButton: {
        backgroundColor: '#16a085',
        padding: 10,
        margin: 15,
        height: 40,
     },
     statusBar:{
        height: Constants.statusBarHeight,
     },




    });