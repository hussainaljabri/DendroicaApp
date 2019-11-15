import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput, Picker} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import Constants from 'expo-constants';

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
    state ={
        regionInput: 'test',
        language: '',
        searchInput: '',
        birds: [],
    }
    /**
     * Region Handler---------------------------------------------------------------------------
     */

     // 1) get Regions List from Settings config/db.

     // 2) map the Regions and return a Selection view.

     // 3) Selection state handler, to update the state which corresponds to user input.
        selectHandler = (input) =>{
            this.setState({
                regionInput: input,
                
            });
        }
    /**
     * ------------------------------------------------------------------------------------------
     */

    /**
     * Bird Card List---------------------------------------------------------------------------
     */

    componentDidMount(){
        this.setState({
            birds: Birds,
        });
    }

    updateSearch=(text)=>{
        this.setState({
            searchInput: text,
        });
    }
    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    }
    handlerClick=(id, name)=>{
        Alert.alert("Click:\n" +id+": "+name);
    }
    getBirdCards = () =>{
        return Birds.map((bird) =>{
            return (
                <BirdCard 
                key={bird.id} 
                birdName={bird.name} 
                imgUrl={bird.image} 
                onPress={()=>{this.handlerClick(bird.id, bird.name)}} 
                onLongPress={()=>{this.handlerLongClick(bird.id, bird.name)}}
                style={{marginBottom: 3}}
                />
            );
        });
    }
    /**
     * ------------------------------------------------------------------------------------------
     */
    render(){
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"white", marginLeft: 5, marginRight: 5,}}>
                <View style={styles.statusBar}/>
                <View style={{flexDirection: "row",}}>
                    <Text style={styles.header}>Explore |</Text>
                    <View style={{justifyContent:"center", flexGrow:1}}>
                        <Picker
                            selectedValue={this.state.language}
                            style={styles.select}
                            itemStyle={{ backgroundColor: "grey", color: "blue", fontSize:17, fontWeight:"700" }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({language: itemValue})
                            }>
                            <Picker.Item label="Canada" value="CA" />
                            <Picker.Item label="U.S.A" value="USA" />
                            <Picker.Item label="Mexico" value="MEX" />
                            <Picker.Item label="Caribbean" value="CAR" />
                            <Picker.Item label="Central America" value="CTA" />
                            <Picker.Item label="South America" value="STA" />
                        </Picker>
                    </View>
                    <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='settings'
                                color='#ff8080'
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <SearchBar
                    placeholder="Search..."
                    onChangeText={this.updateSearch}
                    value={this.state.searchInput}
                    placeholderTextColor="white"
                    inputStyle={{fontSize: 14, color: 'white'}} // style the TextInput
                    inputContainerStyle={{borderRadius:10, backgroundColor: '#474747'}}
                    containerStyle={{backgroundColor: 'white', borderTopColor: 'orange', borderBottomColor: 'white', paddingLeft:0, paddingRight:0, paddingBottom:0, paddingTop:2}} // style of the container which contains the search bar.
                />

                <View>
                    <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {this.state.birds.length}</Text>
                </View>
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
    },
    statusBar:{
        height: Constants.statusBarHeight,
     },
     btn:{padding:15, justifyContent: "center", alignItems: "center", backgroundColor:'orange'},
     select: {
        width:"100%",
        color: "black",
        fontWeight: "700",
        backgroundColor:"white",
     },
     header:{
         
         paddingLeft: 15, 
         paddingRight: 15,
         fontWeight: "700",
         color: "#ff8080",
         fontSize: 20,
         justifyContent: "center", 
         alignSelf:"center"
        },
});
