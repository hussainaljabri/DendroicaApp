import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
/**
 * 
 * @param songDescription -> Song Description passed from parent.
 * @param songName -> Bird/Audio song name or title.
 * @param selected -> is to findout whether this is clicked or not.
 * @param onPress -> onPress action to be executed in parent.
 * @param buttonExtraStyle -> extra styling for the button.
 */
const AudioCard = ({songDescription, songName, selected, onPress, buttonExtraStyle}) =>(
    <TouchableOpacity onPress={onPress} style={[styles.container, buttonExtraStyle]}>
        {selected?
        (<LinearGradient
            colors={['rgba(0,155,0,0.5)', 'transparent']}
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
            

            <Ionicons name = 'ios-play-circle' size = {35} color = '#1b1b1b' />
            <View style={{flexDirection:'column', justifyContent: "center"}}>
                <Text style={styles.songName}>{songName}</Text>
                <Text style={styles.songDescription}>{songDescription}</Text>
            </View>
        
    </TouchableOpacity>
);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.3,
        backgroundColor: '#F8F8F8',
    },
    img: {
        width: 130,
        height: 110,
        borderRadius: 5,
        // borderColor: "black",
        // borderWidth: 1,
    },
    songName:{
        paddingHorizontal: 10,
        textAlignVertical: 'center',
        
        fontSize: 16,
    },
    songDescription:{
        textAlignVertical: 'center',
        paddingHorizontal: 15,
        fontStyle: 'italic',
        opacity: 0.8,
        
    }
});

export default AudioCard;