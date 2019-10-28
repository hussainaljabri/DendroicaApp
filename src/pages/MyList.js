
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";
const prefix = 'https://www.natureinstruct.org';
export default class MyList extends Component {
    /**
     * State: Contains All the varibales needed in this Component
     */
    state ={
        arr: null,
        dataReady: false,
        userInput: '',
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
 
 
     render() {
 
     
         return (
           <ScrollView style={{marginTop: 15,}}>
             <TextInput style = {styles.input}
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
                 
                 {this.printOut()}
             
             
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
 
 
 
 
     });