import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";


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