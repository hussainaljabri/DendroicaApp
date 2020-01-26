import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class BirdCard extends React.PureComponent {

    

    render() {

    
        return (
            <TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress} style={[styles.container, this.props.style]}>
                
                    
                    <Image
                    source={{uri: this.props.imgUrl}}
                    resizeMode="cover"
                    style={styles.img}
                />
                    <View style={{flexDirection:'column', justifyContent: "center"}}>
                        <Text style={styles.birdName}>{this.props.birdName}</Text>
                        <Text style={styles.latin}>{this.props.latin}</Text>
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
        borderWidth: 0.3,
        backgroundColor: '#F8F8F8',
    },
    img: {
        width: 130,
        height: 110,
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