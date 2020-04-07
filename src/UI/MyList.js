import React, { Component } from "react";
import {View, Text,TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar} from "react-native";
import styles from '../styles/MyList.style';
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
        optionsText: ['Cancel'], // to navigate and display the correct text when a Block is chosen.
        optionsBlocks:[], // holds options blocks used when ActionSheet opens. <Text> blocks.
        connected: true, // assumes its connected to internet first.
    }
    static navigationOptions = {
        header: null
        
    }
    componentDidMount(){
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {// This hook returns `true` if the screen is focused, `false` otherwise
          // The screen is focused
          // Call any action
          this.refreshLists();
        });
    }
    componentWillUnmount(){
        this.focusListener.remove();
        this.unsubscribe();
    }
    componentWillMount(){
        this.unsubscribe = NetInfo.addEventListener(c => {
            this.setState((state)=>{
                // do some refreshing here.
                this.refreshLists();
                // if the current list is not downloaded, re-initialize the page and show pull out of the list. to force a change.
                if(this.state.selectedList.isDownloaded === "false"){
                        return {
                            selected: -1,
                            selectedReady: false,
                            searchInput: '',
                            selectedList: {},
                            birds: [],
                            birdsReady: false,
                            lists: ['Cancel'],
                            listsReady: false,
                            optionsText: ['Cancel'], // to navigate and display the correct text when a Block is chosen.
                            optionsBlocks:[], // holds options blocks used when ActionSheet opens. <Text> blocks.
                            connected: c.isConnected,
                        }
                }
                return {
                    connected: c.isConnected
                };
            });
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
    handlerClick=(id, name, scientific_name)=>{
        this.props.navigation.navigate('BirdInfo',
            //params
            {
                title: name,
                latin: scientific_name,
                id: id,
                downloaded: this.state.selectedList.isDownloaded,
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
                    onPress={()=>{this.handlerClick(bird.bird_id, bird.name, bird.scientific_name)}} 
                    style={styles.BirdCard}
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

    refreshLists=()=>{
        DatabaseModule.getLists({
            success: (result)=>{
                let temp = ['Cancel'];
                temp.push(result);
                let opt_temp = ['Cancel'];
                result.map((item, index)=>{
                    opt_temp.push(item.name);
                });
                this.setState({
                    lists: temp,
                    optionsText: opt_temp,
                    optionsBlocks: this.getOptionsArray(temp),
                });
            }
        });
        
    }
    /**
     * This method will attach 'downloaded' to lists that are downloaded in the phone.
     * So it will only show 'downloaded' when the action sheet is opened.
     * returns a string[] Attached with <Text> array.
     */
    getOptionsArray=(lists)=>{
        let temp = ["Cancel"];
        lists[1].map((item, index)=>{
            if(item.isDownloaded === "true"){
                temp.push(
                    <Text key={index} style={{width:'100%', textAlign:'center', textAlignVertical:'center', fontWeight: "600", flex:1}}>
                        {item.name}
                        <Text style={{
                                    color:'green',
                                    paddingLeft:30,
                                    paddingRight:30,
                                }}>  [Downloaded]</Text>
                    </Text>
                );   
            }else{
                temp.push(
                    <Text key={index} style={{width:'100%',textAlign:'center', textAlignVertical:'center', fontWeight: "600", flex:1, backgroundColor: this.state.connected? null: 'lightgray'}}>
                        {item.name}
                    </Text>
                );
            }
            
        });
        return temp;
    }

    optionsOnPress = index =>{
        this.state.selectedList = this.state.lists[1][index-1];
        if(index != 0){
            if(this.state.lists[1][index-1].isDownloaded === "false" && !this.state.connected){
                // it is not downloaded and offline mode, so display alert.
                alert('Please, connect to internet to view this List.');
            }else if(this.state.lists[1][index-1].isDownloaded === "true" && !this.state.connected){
                // it is downloaded and offline mode, so fine allow it.
                if(this.state.selected != index){    
                    this.selectedNewList(index);
                }
            }else{
                // it is connected to internet, allow clicking on options normally.
                if(this.state.selected != index){    
                    this.selectedNewList(index);
                }
            }
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>MyLists |</Text>
                    <View style={styles.ActionSheetContainer}>
                        <Text onPress={this.showActionSheet} style={styles.actionSheetText}>{this.state.selectedReady?
                            (this.state.optionsText[this.state.selected])
                         :
                            ("Select a List")}
                         </Text>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={<Text style={styles.actionSheetTitle}>Select a List</Text>}
                            cancelButtonIndex={0}
                            destructiveButtonIndex={0}
                            options={this.state.optionsBlocks}
                            onPress={(index)=> this.optionsOnPress(index)}
                        />
                    </View>
                    <View style={styles.DownloadButton}>
                        <DownloadButton listIsSelected={this.state.selected} selectedList={this.state.selectedList}></DownloadButton>
                    </View>
                </View>
                <View style={styles.belowHeader}>
                    <SearchBar
                        placeholder="Search..."
                        onChangeText={this.updateSearch}
                        value={this.state.searchInput}
                        placeholderTextColor="#474747"
                        inputStyle={styles.SearchTextInput} // style the TextInput
                        inputContainerStyle={styles.SearchTextInputContainer}
                        containerStyle={styles.SearchBarContainer} // style of the container which contains the search bar.
                    />
                    <View style={styles.belowSearchBar}>
                        <TouchableOpacity onPress={()=> this.quizBtnHandler()} disabled={(!this.state.selectedReady || (this.state.birds.length<4))} style={(!this.state.selectedReady || (this.state.birds.length<4))? styles.disabledBtn: styles.btn}>
                            <Text style={(!this.state.selectedReady || (this.state.birds.length<4))? styles.quizDisabledText : styles.quizEnabledText}>Quiz</Text>
                        </TouchableOpacity>
                        <Text style={styles.SpeciesCountText}>Species: {this.state.birds.length}</Text>
                    </View>
                </View>


                {this.state.selectedReady?

                    this.state.birdsReady?
                        (
                            <ScrollView ref={(ref)=> this.scrollView = ref} style={styles.FlatList} showsVerticalScrollIndicator={false} >
                            {this.getBirdCards()}
                                    
                                <TouchableOpacity style={styles.goToTopBtn} onPress={()=>this.goToTop()}>
                                    <Text style={styles.goToTopText}>Go To Top</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )
                    : // else
                        (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="orange"/>
                            <Text>Birds are coming your way</Text>
                        </View>
                        )
            : //else
                    (<Text style={styles.ListNotSelectedText}>
                        Please, Select a List.
                    </Text>)
                }
            </View>
        );
    }

}



