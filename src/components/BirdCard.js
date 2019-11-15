import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class BirdCard extends Component {



    render() {

    
        return (
            <TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress} style={[styles.container, this.props.style]}>
                <View style={styles.container}>
                    
                    <Image
                    source={this.props.imgUrl}
                    resizeMode="cover"
                    style={styles.img}
                />
                <Text style={styles.birdName}>{this.props.birdName}</Text>
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
        
    },
    img: {
        width: 120,
        height: 100,
        // borderRadius: 2,
        // borderColor: "black",
        // borderWidth: 1,
    },
    birdName:{
        padding: 15,
        textAlignVertical: 'center',
    },
});