import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Icon} from 'react-native-elements';
export default class ListCard extends Component {



    render() {

    
        return (
            <TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress} style={[styles.container, this.props.style]}>
                <View style={styles.container}>
                    <View style={{flexDirection:'column', justifyContent: "center"}}>
                        <Text style={styles.listName}>{this.props.birdName}</Text>
                    </View>
                    <Icon />
                </View>
            </TouchableOpacity>
        );


    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 1,
        borderColor: 'black',
        borderWidth: 0.1,
        backgroundColor: '#F8F8F8',
    },
    img: {
        width: 120,
        height: 100,
        // borderRadius: 2,
        // borderColor: "black",
        // borderWidth: 1,
    },
    birdName:{
        paddingHorizontal: 15,
        textAlignVertical: 'center',
        fontSize: 16,
    },
    latin:{
        textAlignVertical: 'center',
        paddingHorizontal: 15,
        fontStyle: 'italic',
        opacity: 0.8,
        
    }
});