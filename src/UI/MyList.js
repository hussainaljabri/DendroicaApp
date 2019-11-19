import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput, Picker} from "react-native";
import Constants from 'expo-constants';
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
const Birds = [
    {id: 4, name: 'Semipalmated Plover', image:require('../../assets/Birdimages/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg'), sound:""},
    {id: 5, name: 'Spotted Sandpiper', image:require('../../assets/Birdimages/72902-Actitis_macularius_AOU_7_52.jpg'), sound:""},
    {id: 6, name: 'Surfbird', image:require('../../assets/Birdimages/RH-1442-Aphriza_virgata.jpg'), sound:""},
    {id: 7, name: 'Black-throated Green Warbler', image:require('../../assets/Birdimages/CMF-9382-Dendroica_virens.jpg'), sound:""},
    {id: 8, name: 'Gray-crowned Rosy-Finch', image:require('../../assets/Birdimages/LM-9260-Leucosticte_tephrocotis.jpg'), sound:""},
    {id: 9, name: 'Merlin', image:require('../../assets/Birdimages/TB2-119938-Falco_columbarius_AOU_7_52.jpg'), sound:""},
    {id: 10, name: 'Eurasian Collared-Dove', image:require('../../assets/Birdimages/87129-Streptopelia_decaocto_AOU_7_52.jpg'), sound:""},
    {id: 11, name: 'Rufous Hummingbird', image:require('../../assets/Birdimages/TB2-14343-Selasphorus_rufus.jpg'), sound:""},
    {id: 12, name: 'Western Tanager', image:require('../../assets/Birdimages/LM-9392-Piranga_ludoviciana.jpg'), sound:""},
]; // stored locally for testing purposes.

export default class MyList extends Component {
    state ={
        regionInput: 'test',
        selected: '',
        searchInput: '',
    }
    static navigationOptions = {
        header: null
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

    render(){
        return (
            <View style={{flex: 1, backgroundColor:"white", marginLeft: 5, marginRight: 5,}}>
                <View style={styles.statusBar}/>
                <View style={{flexDirection: "row",justifyContent: "space-between"}}>
                    <Text style={styles.header}>MyLists |</Text>
                    <View style={{justifyContent:"center", flexGrow:1}}>
                        <Picker
                            selectedValue={this.state.selected}
                            style={styles.select}
                            itemStyle={{justifyContent:"center", backgroundColor: "grey", color: "blue", fontSize:17, fontWeight:"700" }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({selected: itemValue})
                        }>
                            <Picker.Item label="List1" value="lst1" />
                            <Picker.Item label="List2" value="lst2" />
                            <Picker.Item label="List3" value="lst3" />
                            <Picker.Item label="List4" value="lst4" />
                        </Picker>
                    </View>
                    <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='playlist-edit'
                                type='material-community'
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
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={{fontWeight:"600", color: "white"}}>Quiz</Text>
                    </TouchableOpacity>
                    <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {Birds.length}</Text>
                </View>
                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} >
                        {this.getBirdCards()}
                </ScrollView>
                

            </View>
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
     btn:{
         paddingLeft: 25,
         paddingRight: 25,
         paddingTop: 2,
         paddingBottom: 2,
         marginBottom: 3,
         marginTop: 3,
         justifyContent: "center",
         textAlignVertical: "center",
         backgroundColor: "#ff8080",
         borderRadius: 5,
     },
     select: {
        width: "100%",
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