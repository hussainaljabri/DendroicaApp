import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Options extends Component{

    state ={
        options:[],
    }


    render() {

        return (
            <View style={styles.container}>

                {/* {this.generateOptions()} */}
            </View>
        );


    }
}