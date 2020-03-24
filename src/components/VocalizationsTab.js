


import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, Dimensions, ScrollView, Alert, Button, TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {Icon} from 'react-native-elements';
import AudioCard from "../commons/AudioCard";
import AudioPlayer from "../components/AudioPlayer";

export default class VocalizationsTab extends PureComponent {

    state={
        audioSelected: 0, /* so i could compare index to this state. */
    }
    audioCardOnPress = (id)=>{
        this.setState({
            audioSelected: id,
        });
    }

    getAudioCards = () =>{
        return this.props.audioList.map((item, index)=>{
                return (
                    <View key={`V-${index}`} style={styles.AudioCardContainer}>
                        <AudioCard
                            key={index}
                            songName={item.name}
                            songDescription={item.description}
                            selected={!!(index === this.state.audioSelected)}
                            onPress={()=> this.audioCardOnPress(index)}
                            containerStyle={styles.AudioCardContainer}
                        />
                    </View>
                );
            }
        );
    }
    render() {
        const {sectionHeaderContainer} = this.props;
    
        return (
            
            <ScrollView style={{flex: 1}}>
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
                <View style={{padding: 2, flex:1, flexDirection:'row', flexWrap:'wrap', marginTop: 15}}>
                    {this.getAudioCards()}
                </View>
            </ScrollView>

        );


    }
    

}


const styles = StyleSheet.create({
    AudioCardContainer:{
        margin: 2,
        width: Dimensions.get('window').width/4 -10,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'black',
        borderWidth: 0.3,
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
