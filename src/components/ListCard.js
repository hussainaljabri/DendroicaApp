import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Icon} from 'react-native-elements';
export default class ListCard extends PureComponent {



    render() {

    
        return (
            
            <View style={styles.container}>
                <Text style={styles.listName}>{this.props.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Icon size={22} onPress={this.props.onPressDelete} type='material-community' color='#ff7f7f' name='minus-circle'/>
                    <View style={styles.icon}/>
                    {/* <Icon size={22} onPress={()=> alert('Edit: '+this.props.name +', id:'+ this.props.id)} type='material-community' color='#808080' name='square-edit-outline'/>
                    <View style={styles.icon}/> */}
                    <Icon size={22} onPress={this.props.onPressDownload} type='material-community' color='#34C759' name='arrow-down-box'/>
                </View>
            </View>

        );


    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        justifyContent:'space-between',
        // borderRadius: 0.5,
        // borderColor: 'black',
        // borderWidth: 0.2,
        // borderBottomColor:'black',
        // borderBottomWidth:0.3,
        backgroundColor: '#F5F5F5',
        // flexGrow:1,
        borderRadius: 0.5,
        borderColor: 'black',
        borderWidth: 0.2,
    },
    icon: {
        marginHorizontal: 5,

    },
    latin:{
        textAlignVertical: 'center',
        paddingHorizontal: 15,
        fontStyle: 'italic',
        opacity: 0.8,
        
    }
});