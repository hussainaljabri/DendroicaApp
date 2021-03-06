import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView} from "react-native";
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
                            songName={index+1}
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
        const {sectionHeaderContainer, connected, bird_id, hasUserLeft, audioList} = this.props;
    
        return (
            
            <ScrollView style={{flex: 1}}>
                <AudioPlayer
                    audioPlaylist={audioList}
                    connected={connected}
                    bird_id={bird_id}
                    audioSelected={this.state.audioSelected}
                    container={{
                        backgroundColor:'#e5e5e5e5'
                    }}
                    stopPlaying={hasUserLeft}
                />
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
