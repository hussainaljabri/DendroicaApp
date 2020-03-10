import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput, ActivityIndicator, StatusBar, Platform} from "react-native";
import Constants from 'expo-constants';
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import ActionSheet from 'react-native-actionsheet';
import DatabaseModule from '../DB/DatabaseModule';
import DownloadButton from '../components/DownloadButton';
import MediaHandler from '../DB/MediaHandler';
import NetInfo from '@react-native-community/netinfo';

export default class MyList extends Component {
    state ={
        selected: -1,
        selectedReady: false,
        searchInput: '',
        selectedList: {},
        birds: [],
        birdsReady: false,
        lists: ['Cancel'],
        listsReady: false,
        options: ['Cancel'],
        connected: false
    }
    static navigationOptions = {
        header: null
    }

    componentDidMount(){
        DatabaseModule.getLists({
            success: (result)=>{
                // console.log('Lists: '+JSON.stringify(result));
                let temp = this.state.lists;
                temp.push(result);
                let opt_temp = this.state.options;
                result.map((item, index)=>{
                    opt_temp.push(item.name);
                });
                this.setState({
                    lists: temp,
                    options: opt_temp,
                });
                // console.log('Loaded Lists: '+ JSON.stringify(this.state.lists));
            }
        });
        
        const unsubscribe = NetInfo.addEventListener(c => {
            this.setState({connected: c.isConnected});
            MediaHandler.connectionStateChange(c.isConnected, this.state.birds, (birdProps) => {
                if(birdProps) this.state.birds = birdProps;
            });
        });
    }


    showActionSheet = () => {
        this.ActionSheet.show();
    };
    updateSearch=(text)=>{
        this.setState({
            searchInput: text,
        });
    }
    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    }
    handlerClick=(id, name, scientific_name)=>{
        // I need id, name, scientific_name, filename, 
        // Alert.alert("Click:\n" +id+": "+name);
        this.props.navigation.navigate('BirdInfo',
            //params
            {
                title: name,
                latin: scientific_name,
                id: id,
            }
        );

    };

    getBirdCards = () =>{
        return this.state.birds.map((bird) =>{
            return (
                <BirdCard 
                    key={bird.bird_id} 
                    birdName={bird.name} 
                    latin={bird.scientific_name}
                    imgUrl={MediaHandler.getMediaFile(bird.bird_id, bird.filename,this.state.connected)}
                    //imgUrl={prefix+bird.filename}
                    onPress={()=>{this.handlerClick(bird.bird_id, bird.name, bird.scientific_name)}} 
                    // onLongPress={()=>{this.handlerLongClick(bird.bird_id, bird.name, bird.scientific_name)}}
                    style={{marginBottom: 3}}
                />
            );
        });
    }
    goToTop = () => {
        if(this.scrollView != null){
            this.scrollView.scrollTo({x: 0, y: 0, animated: true});
        }
     }

    quizBtnHandler = () =>{
        
        this.props.navigation.navigate('Quiz',
        //params
        {
            data: this.state.birds,
        }
    );
    }
    selectedNewList=(index)=>{
        this.setState({birds:[], selected: index, dataReady: false, selectedReady: true});

        // we should call out the new list.
        DatabaseModule.getListDisplayInfo(
            this.state.lists[1][index-1]._id, // ["Cancel",[{"_id":25088,"name":"Test List"},{"_id":25089,"name":"Select a List"},{"_id":25090,"name":"testing1"},{"_id":25091,"name":"testing2"}]]
            {
                success: (result)=>{
                    this.setState({
                        birds: result,
                        birdsReady: true,
                    });
                }
            }
        );
        
    }



    render(){
        return (
            <View style={{flex: 1, backgroundColor:"white"}}>
                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10}}>
                    <Text style={styles.header}>MyLists |</Text>
                    <View style={{marginHorizontal: 10, justifyContent:"center", alignContent:"center", flexGrow:1}}>
                        <Text onPress={this.showActionSheet} style={{fontSize:22, fontWeight:'500', opacity:0.7, justifyContent:'center'}}>{this.state.selectedReady? (this.state.options[this.state.selected]):("Select a List")}</Text>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={<Text style={{fontSize: 18, fontWeight:'500', letterSpacing:1}}>Select a List</Text>}
                            cancelButtonIndex={0}
                            destructiveButtonIndex={0}
                            options={this.state.options}
                            onPress={(index) => {
                                this.state.selectedList = this.state.lists[1][index-1];
                                console.log('actionsheet: '+index+ ' corresponds to :'+ this.state.lists[index]);
                                index != 0? (this.state.selected != index? this.selectedNewList(index): {}) : {};
                            }}
                        />
                    </View>
                    <View style={{marginRight:10, marginTop:5}}>
                        <DownloadButton listIsSelected={this.state.selected} selectedList={this.state.selectedList}></DownloadButton>
                    </View>
                    {/* <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='playlist-edit'
                                type='material-community'
                                color='red'
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
                <View style={{paddingHorizontal: 5}}>
                    <SearchBar
                        placeholder="Search..."
                        onChangeText={this.updateSearch}
                        value={this.state.searchInput}
                        placeholderTextColor="#474747"
                        inputStyle={{fontSize: 14, color: '#474747'}} // style the TextInput
                        inputContainerStyle={{borderRadius:10, backgroundColor: '#E8E8E8'}}
                        containerStyle={{backgroundColor: 'white', borderTopColor: 'white', borderBottomColor: 'white', paddingLeft:0, paddingRight:0, paddingBottom:0, paddingTop:2}} // style of the container which contains the search bar.
                    />
                    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                        <TouchableOpacity onPress={()=> this.quizBtnHandler()} disabled={(!this.state.selectedReady || (this.state.birds.length<4))} style={(!this.state.selectedReady || (this.state.birds.length<4))? styles.disabledBtn: styles.btn}>
                <Text style={(!this.state.selectedReady || (this.state.birds.length<4))? {fontWeight:"600", color: "grey"}:{fontWeight:"600", color: "red"}}>Quiz</Text>
                        </TouchableOpacity>
                        <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {this.state.birds.length}</Text>
                    </View>
                </View>


                {this.state.selectedReady?

                    this.state.birdsReady?
                    (
                        <ScrollView ref={(ref)=> this.scrollView = ref} style={{flex:1, paddingHorizontal: 5}} showsVerticalScrollIndicator={false} >
                        {this.getBirdCards()}
                                
                            <TouchableOpacity style={{backgroundColor:'#E8E8E8', padding:10, justifyContent:"center", alignContent:'center'}} onPress={()=>this.goToTop()}>
                                <Text style={{fontWeight: '500',color:'red', textAlign:"center"}}>Go To Top</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )
                    :
                    (
                    <View style={{justifyContent: 'center', alignItems: "center", top: 50}}>
                        <ActivityIndicator size="large" color="orange"/>
                        <Text>Birds are coming your way</Text>
                    </View>
                    )
            :
                    (<Text style={{fontWeight:'500', top:50, textAlign: "center"}}>
                        Please, Select a List.
                    </Text>)
                }
                

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
         paddingLeft: 25,
         paddingRight: 25,
         paddingTop: 2,
         paddingBottom: 2,
         marginBottom: 3,
         marginTop: 3,
         justifyContent: "center",
         textAlignVertical: "center",
         borderRadius: 5,
         borderWidth: 0.5,
         borderColor: 'red',

     },
     disabledBtn:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 2,
        paddingBottom: 2,
        marginBottom: 3,
        marginTop: 3,
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'grey',
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
         color: "red",
         fontSize: 20,
         justifyContent: "center", 
         alignSelf:"center"
        },
});



