
import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";
import Config from '../DB/Config';
import Constants from 'expo-constants';






const ListMaxLength = 12;
const settings = Config.Settings['quiz']; // settings config.
const OptionsLength = settings.optionLength; 

export default class Settings extends Component {

    render(){
        return (
            <View style={styles.container}>
                <Text>SETTINGS</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    }
});