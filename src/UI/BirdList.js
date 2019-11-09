import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";
import BirdCard from '../components/BirdCard';
const Birds = [
    {id: 1, name: 'Golden Eagle', image: require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), sound:"../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3"},
    {id: 2, name: 'American Golden-Plover', image:require('../../assets/Birdimages/MP-1669-Pluvialis_dominica.jpg'), sound:""},
    {id: 3, name: 'Common Ringed Plover', image:require('../../assets/Birdimages/76165-Charadrius_hiaticula_AOU_7_52.jpg'), sound:""},
    {id: 4, name: 'Semipalmated Plover', image:require('../../assets/Birdimages/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg'), sound:""},
    {id: 5, name: 'Spotted Sandpiper', image:require('../../assets/Birdimages/72902-Actitis_macularius_AOU_7_52.jpg'), sound:""},
    {id: 6, name: 'Surfbird', image:require('../../assets/Birdimages/RH-1442-Aphriza_virgata.jpg'), sound:""},
    {id: 7, name: 'Black-throated Green Warbler', image:require('../../assets/Birdimages/CMF-9382-Dendroica_virens.jpg'), sound:""},
    {id: 8, name: 'Gray-crowned Rosy-Finch', image:require('../../assets/Birdimages/LM-9260-Leucosticte_tephrocotis.jpg'), sound:""},
    {id: 9, name: 'Merlin', image:require('../../assets/Birdimages/TB2-119938-Falco_columbarius_AOU_7_52.jpg'), sound:""},
    {id: 10, name: 'Eurasian Collared-Dove', image:require('../../assets/Birdimages/87129-Streptopelia_decaocto_AOU_7_52.jpg'), sound:""},
    {id: 11, name: 'Rufous Hummingbird', image:require('../../assets/Birdimages/TB2-14343-Selasphorus_rufus.jpg'), sound:""},
    {id: 12, name: 'Western Tanager', image:require('../../assets/Birdimages/LM-9392-Piranga_ludoviciana.jpg'), sound:""},
    //From USA LIST
    {id: 13, name: 'Belted Kingfisher', image:require('../../assets/Birdimages/usa/76042-Megaceryle_alcyon_AOU_7_52.jpg'), sound:""},
    {id: 14, name: 'King Rail', image:require('../../assets/Birdimages/usa/85699-Rallus_elegans_AOU_7_52.jpg'), sound:""},
    {id: 15, name: 'Atlantic Puffin', image:require('../../assets/Birdimages/usa/JR-2122-Fratercula_arctica.jpg'), sound:""},
    {id: 16, name: 'Acorn Woodpecker', image:require('../../assets/Birdimages/usa/KB3-120281-Melanerpes_formicivorus_AOU_7_52.jpg'), sound:""},
    {id: 17, name: "Chuck-will's-widow", image:require('../../assets/Birdimages/usa/TB-7827-Caprimulgus_carolinensis.jpg'), sound:""},
    {id: 18, name: 'Loggerhead Shrike', image:require('../../assets/Birdimages/usa/81029-Lanius_ludovicianus_AOU_7_52.jpg'), sound:""},
]; // stored locally for testing purposes.

export default class BirdList extends Component {
    getBirdCards = () =>{
        return Birds.map((bird) =>{
            return (
                <BirdCard 
                key={bird.id} 
                birdName={bird.name} 
                imgUrl={bird.image} 
                onPress={()=>{this.handlerClick(bird.id, bird.name)}} 
                onLongPress={()=>{this.handlerLongClick(bird.id, bird.name)}}
                
                />
            );
        });
    }
    render(){
        return (
            <ScrollView>
                {this.getBirdCards()}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    }
});
