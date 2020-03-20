


import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableHighlight, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Icon} from 'react-native-elements';
import AudioCard from "../commons/AudioCard";
import AudioPlayer from "../components/AudioPlayer";

export default class VocalizationsTab extends PureComponent {

    state={
        audioSelected: 0, /* so i could compare index to this state. */
    }
    audioCardOnPress = (id)=>{
        console.log('Clicked AudioIndex: ', id);
    }

    getAudioCards = () =>{
        return this.props.audioList.map((item, index)=>{
                return (
                    <AudioCard
                        key={index}
                        songName={item.name}
                        songDescription={item.description}
                        selected={!!(index === this.state.audioSelected)}
                        onPress={()=> this.audioCardOnPress(index)}
                        buttonExtraStyle={{padding: 15}}
                    />
                );
            }
        );
    }
    render() {
        const {sectionHeaderContainer} = this.props;
    
        return (
            
            <ScrollView>
                <AudioPlayer/>
                <View style={sectionHeaderContainer}>
                    <Icon 
                        name='music'
                        type={'font-awesome'}
                        color='#34C759' // COLOR
                    />
                    <Text style={styles.title}> Vocalizations</Text>
                    {/* List of the audio to be played. */}
                </View> 

                <View style={{paddingHorizontal: 15, marginTop: 15}}>
                {this.getAudioCards()}
                </View>
                
            </ScrollView>

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
