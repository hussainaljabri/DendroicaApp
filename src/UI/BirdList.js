import React, { Component } from "react";
import {KeyboardAvoidingView, Modal, StyleSheet, View, Text, Image, TouchableOpacity,ScrollView, FlatList , Alert, Button, TextInput, Platform, StatusBar, ActivityIndicator} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import Constants from 'expo-constants';
import ActionSheet from 'react-native-actionsheet';
import DatabaseModule from '../DB/DatabaseModule';
import MediaHandler from '../DB/MediaHandler';
import SaveAlert from '../components/SaveAlert';
const prefix='https://natureinstruct.org';
import NetInfo from '@react-native-community/netinfo';
import styles from '../styles/BirdList.style.js';




const continents = [
    'Cancel',
    'Canada',           // project_id 1, index here is 1
    'Mexico',           // project_id 2, index here is 2
    'U.S.A',            // project_id 3, index here is 3
    'South America',    // project_id 4, index here is 4
    'Central America',  // project_id 5, index here is 5
    'Caribbean',        // project_id 6, index here is 6
  ];
const regions = [
    '',
    1,
    43,
    49,
    207,
    209,
    208,
];

export default class BirdList extends Component {
    state ={
        regionInput: 'test',
        selected: 1,
        searchInput: '',
        birds: [],
        dataReady: false, // id, info, uri.
        scrolltotop: false,
        isTopBarHidden: false,
        barclicked: false,

        selectionMode: false,
        birdSelected: new Map(),
        selectionCount: 0,

        displayAlert: false, // saveTo alert
        saveAlertLoading: false, // to show activity indicator when saving birds

        connected: false,
        searchedBirds: [], 
    }



    static navigationOptions = {
        header: null
    }
      




    componentWillMount(){
    //Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(c => {
            this.setState({connected: c.isConnected});
            MediaHandler.connectionStateChange(c.isConnected, this.state.birds, (birdProps) => {
                if(birdProps) this.state.birds = [...birdProps];
            });
        });


        if(this.state.selected != 0){

            DatabaseModule.getDisplayInfo(
                this.state.selected,
                {
                    // success: (result)=>{
                    //     console.log('testing CANADA: '+ result);
                    // }
                    success: (result)=>{
                        this.setState({
                            birds: result,
                            dataReady: true,
                        });
                    }
                }
            );
                
        }
        
    };

    showActionSheet = () => {
        if(this.state.selectionMode){
            this.handlerLongClick();
        }
        this.ActionSheet.show();
    };

    searchHandler=(text)=>{
        // Search algo.
        const newData = this.state.birds.filter(bird =>{
            const birdData = `${bird.name.toUpperCase()} ${bird.name.split(' ')[0].toUpperCase()} ${bird.scientific_name.toUpperCase()} ${bird.scientific_name.split(' ')[0].toUpperCase()} ${bird.scientific_name.split(' ')[1].toUpperCase()}`;
            const textData = text.toUpperCase();
            /**
             * indexOf to compare both the text and return true if the text is found inside birdData.
             * If true is returned, then "filter" will keep that data otherwise ignores it.
             * Having a -1 there is to make sure the returned index is above -1 to return true. indexOf will return -1 if not found.
             * Array.prototype.indexOf():
             * The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
             */
            return birdData.indexOf(textData) > -1;
        });
        this.setState({
            searchInput: text,
            searchedBirds: newData,
        });
    };
    
    handlerClick=(id, name, scientific_name)=>{ 
        // Alert.alert("Click:\n" +id+": "+name);
        if(!this.state.selectionMode){
            this.props.navigation.navigate('BirdInfo',
                //params
                {
                    title: name,
                    latin: scientific_name,
                    id: id,
                }
            );
        }else{
            this.setState((state) => {
                //create new Map object, maintaining state immutability
                const selected = new Map(state.birdSelected);
                let count  = 1;
                //remove key if selected, add key if not selected
                this.state.birdSelected.has(id) ? selected.delete(id, !selected.get(id)) : selected.set(id, !selected.get(id));
                this.state.birdSelected.has(id) ? count = -1: count= 1;
                // console.log(selected);
                return {birdSelected: selected, selectionCount: state.selectionCount+count};
            });
            console.log(this.state.birdSelected);

        }

    };
    handlerScrolltotop=()=>{
        if(this.state.scrolltotop){
            this.setState({isTopBarHidden: false, barclicked: false});
        }else{
            this.setState({isTopBarHidden: true, barclicked: false});
        }
    };
    handleScroll=()=>{
        this.setState({isTopBarHidden: !this.state.isTopBarHidden});
    };
    topShow = () =>{
        this.setState({isTopBarHidden: false});
    }
    topHide = () =>{
        this.setState({isTopBarHidden: true});
    }

    /**
     * ------------------------------------------------------------------------------------------
     */
    goToTop = () => {
        if(this.scrollView != null){
            this.scrollView.scrollTo({x: 0, y: 0, animated: true});
        }
     }
    selectedNewContinent=(index)=>{
        this.setState({birds:[], selected: index, dataReady: false});
        // we should call out the new list.
        DatabaseModule.getDisplayInfo(
            regions[index],
            {
                success: (result)=>{
                    this.setState({
                        birds: result,
                        dataReady: true,
                    });
                }
            }
        );

    }
    handlerLongClick=()=>{
        console.log("Toggle Selection Mode");
        this.setState({
            selectionMode: !this.state.selectionMode,
            birdSelected: new Map(),
            selectionCount: 0,
            displayAlert: false
        });
    };
    getFlatList=()=>{
        return (
        <FlatList 
            style={styles.FlatList}
            data={this.state.searchInput? this.state.searchedBirds: this.state.birds}
            initialNumToRender={10}
            keyExtractor={item => `${item.bird_id}`}
            renderItem={({item, index}) =>(
                <BirdCard 
                    birdName={item.name} 
                    latin={item.scientific_name}
                    imgUrl={item.url}
                    selected={!!this.state.birdSelected.get(item.key)}
                    onPress={()=>{this.handlerClick(item.bird_id, item.name, item.scientific_name)}} 
                    onLongPress={()=>{this.handlerLongClick()}}
                    style={styles.BirdCard}
                    selected={!!this.state.birdSelected.get(item.bird_id)}
                />
            )}
            extraData={this.state}
        />);
    }
    getSpeciesOrSelection=()=>{
        if(this.state.selectionMode){
            return (
                <View>
                    <SearchBar
                    placeholder="Search..."
                    onChangeText={this.searchHandler}
                    value={this.state.searchInput}
                    placeholderTextColor="#474747"
                    inputStyle={styles.SearchTextInput} // style the TextInput
                    inputContainerStyle={styles.SearchTextInputContainer}
                    containerStyle={styles.SearchBarContainer} // style of the container which contains the search bar.
                    />
                    <View style={styles.SelectionActionContainer}>
                        <TouchableOpacity disabled={this.state.selectionCount>0? false:true} style={this.state.selectionCount>0? styles.btn:styles.disabledBtn} onPress={() => {this.setState({displayAlert: true})}}>
                            <Text>
                                Save To
                            </Text>
                        </TouchableOpacity>
                            <Text style={styles.SelectionCountText}>{this.state.selectionCount}</Text>
                        <TouchableOpacity style={styles.btn} onPress={()=> this.handlerLongClick()}>
                            <Text>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View>
                        <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Birds Selected: {this.state.birdSelected.length}</Text>
                    </View> */}
               </View>
            );

        }else{
            return(
               <View>
                    <SearchBar
                    placeholder="Search..."
                    onChangeText={this.searchHandler}
                    value={this.state.searchInput}
                    placeholderTextColor="#474747"
                    inputStyle={styles.SearchTextInput} // style the TextInput
                    inputContainerStyle={styles.SearchTextInputContainer}
                    containerStyle={styles.SearchBarContainer} // style of the container which contains the search bar.
                    />

                    <View>
                        <Text style={styles.SpeciesCountText}>Species: {this.state.birds.length}</Text>
                    </View>
               </View>
            );
        }
    }
    saveToCallback=(listid)=>{
           // we have list id now, lets add birds to it.
           let temp = [];
           this.state.birdSelected.forEach((value, key)=>{
                temp.push(key);
           });
           DatabaseModule.addBirdsToCustomList(listid, temp, {success: () => {
                this.handlerLongClick();
                console.log('Added:'+temp);
           }});
    }
    render(){
        const topBarStyle = this.state.isTopBarHidden;
        return (
            <View style={styles.container}>
                {/* SaveTo alert */}
                {this.state.displayAlert && (<SaveAlert 
                    displayAlert={this.state.displayAlert} 
                    confirm={(res)=> this.saveToCallback(res)}
                    cancel={()=> this.setState({displayAlert: !this.state.displayAlert})}
                    loading={!!this.state.saveAlertLoading}
                />)}
                

                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                {topBarStyle ? 
                    <TouchableOpacity onPress={()=> this.topShow()} style={styles.expandButton}>
                        <Icon size={22} type='material-community' name='menu-down' color='black'/>
                    </TouchableOpacity>
                :
                    (
                    
                    <View style={styles.headerContainer}>
                        <View style={styles.innerHeaderContainer}>
                            <Text style={styles.headerText}>Explore |</Text>
                                <View style={styles.actionSheetContainer}>
                                    <Text onPress={this.showActionSheet} style={styles.actionSheetText}>{continents[this.state.selected]}</Text>
                                    <ActionSheet
                                        ref={o => this.ActionSheet = o}
                                        title={<Text style={styles.actionSheetTitle}>Select Region</Text>}
                                        cancelButtonIndex={0}
                                        destructiveButtonIndex={0}
                                        options={continents}
                                        onPress={(index) => { /* do something */ 
                                            console.log('actionsheet: '+index+ ' corresponds to :'+ continents[index]);
                                            index != 0? (this.state.selected != index? this.selectedNewContinent(index): {}) : {};
                                        }}
                                    />

                                </View>
                        </View>
                        
                        {this.getSpeciesOrSelection()}
                            
                    </View>)
                    
                }
            {this.state.dataReady? 

                (
                    this.getFlatList()
                )
            :
                (
                    <View style={styles.loadingContainer}>
                        {/* <Image source={require("../../assets/loading.gif")} style={{width:300,height:150, resizeMode:'center'}} /> */}
                        <ActivityIndicator size="large" color="orange"/>
                        <Text>Birds are coming your way</Text>
                    </View>
                )
            }
                

                {/* <ScrollView  ref={(ref)=> this.scrollView = ref} style={{flex:1, paddingHorizontal: 5}} scrollsToTop={true} showsVerticalScrollIndicator={true} onMomentumScrollBegin={this.topHide} >
                    {this.getBirdCards()}


                    
                    <TouchableOpacity style={{backgroundColor:'#E8E8E8', padding:10, justifyContent:"center", alignContent:'center'}} onPress={()=>this.goToTop()}>
                        <Text style={{fontWeight: '500',color:'orange', textAlign:"center"}}>Go To Top</Text>
                    </TouchableOpacity>
                    
                </ScrollView > */}
               
            </View>
        );
    }

}

