import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Icon} from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
export default class ListCard extends PureComponent {

    render() {
        return (
            
            <View style={styles.container}>
                <Text style={styles.listName}>{this.props.name}</Text>
                    {this.props.isDownloaded === "true"?
                        (<View style={{flexDirection:'row'}}>
                            <Icon size={22} onPress={this.props.onPressDelete} type='material-community' color='#ff7f7f' name='minus-circle'/>
                            <View style={{marginHorizontal: 5}}/>
                            <FontAwesome5 name = 'check' size = {22} color = 'green' />
                        </View>)
                        
                    :
                        (<View style={{flexDirection:'row'}}>
                            <Icon size={22} onPress={this.props.onPressDownload} type='material-community' color='#34C759' name='arrow-down-box'/>
                        </View>)
                    }
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
        backgroundColor: '#F5F5F5',
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