import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity,ScrollView, FlatList , Alert, Button, TextInput, Picker, StatusBar, ActivityIndicator} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import Constants from 'expo-constants';
import ActionSheet from 'react-native-actionsheet';
import DatabaseModule from '../DB/DatabaseModule';



const prefix='https://natureinstruct.org';


const continents = [
    'Cancel',
    'Canada',           // project_id 1, index here is 1
    'Mexico',           // project_id 2, index here is 2
    'U.S.A',            // project_id 3, index here is 3
    'South America',    // project_id 4, index here is 4
    'Central America',  // project_id 5, index here is 5
    'Caribbean',        // project_id 6, index here is 6
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
    }
    static navigationOptions = {
        header: null
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
        };
    /**
     * ------------------------------------------------------------------------------------------
     */

    /**
     * Bird Card List---------------------------------------------------------------------------
     */

    componentDidMount(){
        if(this.state.selected != 0){

            DatabaseModule.getDisplayInfo(
                this.state.selected,
                {
                    success: (result)=>{
                        console.log('testing CANADA: '+ result);
                    }
                    // success: (result)=>{
                    //     this.setState({
                    //         birds: result,
                    //         dataReady: true,
                    //     });
                    // }
                }
            );
            DatabaseModule.getDisplayInfo(
                2,
                {
                    success: (result)=>{
                        console.log('testing MEXICO: '+ result);
                    }
                    // success: (result)=>{
                    //     this.setState({
                    //         birds: result,
                    //         dataReady: true,
                    //     });
                    // }
                }
            );
                
        }
        /**
         * Whats needed in Explore Page is
         * Bird_id, Thumbnail image, Name, Scientific_name.
         * Object {
                "bird_id": 54,
                "filename": "/files/avian_images/AC-602-Mergus_merganser.jpg",
                "name": "Common Merganser",
                "scientific_name": "Mergus merganser",
            },
         */
        
    };

    // shouldComponentUpdate(nextProps, nextState){
    //     if(nextState.dataReady){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    showActionSheet = () => {
        this.ActionSheet.show();
    };

    updateSearch=(text)=>{
        this.setState({
            searchInput: text,
        });
    };
    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    };
    handlerClick=(id, name)=>{
        // Alert.alert("Click:\n" +id+": "+name);
        this.props.navigation.navigate('BirdInfo',
            //params
            {
                title: name,
                id: id,
                data: this.state.birds[id-1], // for debugging
            }
        );
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

    getBirdCards = () =>{
        // return this.state.birds.map((bird, index) =>{
        //     return (
        //         <View key={index}>
        //             <Text key={index}>bird_id {bird.bird_id}, name {bird.name}, latin {bird.scientific_name}, filename {bird.filename}</Text>
        //         </View>
        //     );
        // });

        return this.state.birds.map((bird) =>{
            return (
                <BirdCard 
                    key={bird.bird_id} 
                    birdName={bird.name} 
                    latin={bird.scientific_name}
                    imgUrl={prefix+bird.filename} 
                    onPress={()=>{this.handlerClick(bird.bird_id, bird.name)}} 
                    onLongPress={()=>{this.handlerLongClick(bird.bird_id, bird.name)}}
                    style={{marginBottom: 3}}
                />
            );
        });
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
        this.setState({selected: index, dataReady: false});
        // we should call out the new list.
        DatabaseModule.getDisplayInfo(
            index,
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
    render(){
        const topBarStyle = this.state.isTopBarHidden;
        return (
            <View style={{backgroundColor:"white",flex:1}}>
                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                {topBarStyle ? 
                    <TouchableOpacity onPress={()=> this.topShow()} style={{backgroundColor:"#DCDCDC", paddingHorizontal: 5}}>
                        <Icon size={22} type='material-community' name='menu-down' color='black'/>
                    </TouchableOpacity>
                :
                    (
                    
                    <View style={{paddingHorizontal: 5}}>
                        <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10}}>
                        <Text style={styles.header}>Explore |</Text>
                        <View style={{marginHorizontal: 10, justifyContent:"center", alignContent:"center", flexGrow:1}}>
                            <Text onPress={this.showActionSheet} style={{fontSize:22, fontWeight:'500', opacity:0.7, justifyContent:'center'}}>{continents[this.state.selected]}</Text>
                            <ActionSheet
                                ref={o => this.ActionSheet = o}
                                title={<Text style={{color: 'black',fontSize: 18, fontWeight:'500', letterSpacing:1}}>Select Region</Text>}
                                cancelButtonIndex={0}
                                destructiveButtonIndex={0}
                                options={continents}
                                onPress={(index) => { /* do something */ 
                                    console.log('actionsheet: '+index+ ' corresponds to :'+ continents[index]);
                                    index != 0? (this.state.selected != index? this.selectedNewContinent(index): {}) : {};
                                }}
                            />

                        </View>
                        {/* <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                            <TouchableOpacity>
                                <Icon 
                                    name='settings'
                                    color='orange'
                                />
                            </TouchableOpacity>
                        </View> */}
                    </View>
                        <SearchBar
                            placeholder="Search..."
                            onChangeText={this.updateSearch}
                            value={this.state.searchInput}
                            placeholderTextColor="#474747"
                            inputStyle={{fontSize: 14, color: '#474747'}} // style the TextInput
                            inputContainerStyle={{borderRadius:10, backgroundColor: '#E8E8E8'}}
                            containerStyle={{backgroundColor: 'white', borderTopColor: 'white', borderBottomColor: 'white', paddingLeft:0, paddingRight:0, paddingBottom:0, paddingTop:2}} // style of the container which contains the search bar.
                        />

                        <View>
                            <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {this.state.birds.length}</Text>
                        </View>
                    </View>)
                }
            {this.state.dataReady? 

                (
                    <FlatList 
                    style={{flex:1, paddingHorizontal: 5}}
                    data={this.state.birds}
                    initialNumToRender={10}
                    keyExtractor={item => `${item.bird_id}`}
                    renderItem={({item, index}) =>(
                        <BirdCard 
                            birdName={item.name} 
                            latin={item.scientific_name}
                            imgUrl={prefix+item.filename} 
                            onPress={()=>{this.handlerClick(item.bird_id, item.name)}} 
                            onLongPress={()=>{this.handlerLongClick(item.bird_id, item.name)}}
                            style={{marginBottom: 3}}
                        />
                    )}
                />
                )
            :
                (
                    <View style={{justifyContent: 'center', alignItems: "center", top: 50}}>
                        <Text>Be patient, birds are coming your way</Text>
                        <ActivityIndicator size="large" color="#0000ff"/>
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

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    statusBar:{
        height: Constants.statusBarHeight,
        width: '100%',
        // backgroundColor: 'black',
     },
     btn:{
         padding:15, 
         justifyContent: "center", 
         alignItems: "center", 
         backgroundColor:'orange'
    },
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
         color: "orange",
         fontSize: 20,
         justifyContent: "center", 
         alignSelf:"center"
        },
    FloatingButton:{

        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
    },
    
    FloatingButtonIcon: {
    
        resizeMode: 'contain',
        width: 50,
        height: 50,
    }
});
