import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
export default class BirdCard extends React.PureComponent {

    

    render() {

    
        return (
            <TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress} style={[styles.container, this.props.style]}>
                {this.props.selected?
                (<LinearGradient
                    colors={['rgba(255, 180, 66, 0.3)', 'transparent']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 35,
                        borderRadius: 10,
                    }}
                    />)
                :
                null
                }
                    
                    <Image
                    source={{uri: this.props.imgUrl}}
                    resizeMode="cover"
                    style={styles.img}
                />
                    <View style={{flexDirection:'column', justifyContent: "center"}}>
                        <Text style={styles.birdName}>{this.props.birdName}</Text>
                        <Text style={styles.latin}>{this.props.latin}</Text>
                    </View>
                {this.props.selected?
                (<View style={{
                    justifyContent: "center",
                    alignContent:'center',
                }}>
                    <FontAwesome5 name = 'check' size = {25} color = 'green' />
                </View>)
                :
                null}
            </TouchableOpacity>
        );


    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.3,
        backgroundColor: '#F8F8F8',
    },
    img: {
        width: 130,
        height: 110,
        // borderRadius: 5,
        // borderColor: "black",
        // borderWidth: 1,
    },
    birdName:{
        paddingHorizontal: 10,
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