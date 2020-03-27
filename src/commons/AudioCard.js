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
 * @param containerStyle -> containerStyle
 */
const AudioCard = ({songDescription, songName, selected, onPress, buttonExtraStyle, containerStyle}) =>(
    <View style={containerStyle}>
        <TouchableOpacity onPress={onPress} style={[styles.container,buttonExtraStyle]}>
            {selected?
            (<LinearGradient
                colors={['rgba(0,155,0,0.5)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 35,
                }}
                />)
            :
            null
            }
            <Text style={styles.songName}>{songName}</Text>  
        </TouchableOpacity>
    </View>
);
const styles = StyleSheet.create({
    container: {
        width:'100%',
        height: '100%',
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'black',
        borderWidth: 1.3,
    },
    songName:{
        textAlignVertical: 'center',

        fontSize: 16,
    },
    songDescription:{
        textAlignVertical: 'center',
        fontStyle: 'italic',
        opacity: 0.8,
        
    }
});

export default AudioCard;