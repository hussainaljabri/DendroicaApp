import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from 'expo-constants';

export default class BirdInfo extends Component {
    state={
        id: null,
        name: '',
        data: [],
    }
    static navigationOptions = ({navigation})=> ({
        headerTitle:()=> (<Text style={{
                                fontWeight: "700",
                                color: "#ff8080",
                                fontSize: 20,
                                justifyContent: "center", 
                                alignSelf:"center"}}
                         >{navigation.state.params.title}</Text>),
        headerTintColor: "#ff8080",
        
    })
   

    render() {

    
        return (
            <View style={{backgroundColor:"white", marginLeft: 5, marginRight: 5,}}>
                <View style={styles.statusBar}/>

            </View>
        );


    }


}


const styles = StyleSheet.create({
    statusBar:{
        height: Constants.statusBarHeight,
     },
    header:{
         
        paddingLeft: 15, 
        paddingRight: 15,
        fontWeight: "700",
        color: "#ff8080",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
       },
});