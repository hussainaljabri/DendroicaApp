import React, { Component } from "react";
import {Modal, StyleSheet, View, Text, Image, ScrollView, Platform , Dimensions, TouchableHighlight, StatusBar, ActivityIndicator} from "react-native";
import {Icon} from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from 'expo-constants';
import ImageViewer from 'react-native-image-zoom-viewer';
import NetInfo from '@react-native-community/netinfo';
import DatabaseModule from '../DB/DatabaseModule';
import MediaHandler from '../DB/MediaHandler';
import Slider from '../components/Slider';
import styles from '../styles/BirdInfo.style';
import VocalizationsTab from "../components/VocalizationsTab";
const prefix='https://natureinstruct.org';


export default class BirdInfo extends Component {
    state={
        id: null,
        name: '',
        info: undefined,
        infoReady: false,
        activeSlide: 0,
        activeMapSlide: 0,
        scrollable: true,
        isModelVisible: false,
        images: [],
        imageCredit: [],
        imageReady: false,
        mapImages: [],
        mapCredit: [],
        mapImagesReady: false,
        page: 0,
    }

    static navigationOptions = ({navigation})=> ({
        headerTitle:()=> (
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleBirdName}>{navigation.state.params.title}</Text>
            <Text style={styles.headerTitleBirdLatin}>{navigation.state.params.latin}</Text>
        </View>),
        headerTintColor: "#34C759", // COLOR
        
    })
    componentWillMount(){
    //Only get connection info once when component is loaded. No need to rerender when connection changes
    NetInfo.fetch().then(connectionState => {
        let id = this.props.navigation.state.params.id
        console.log('birdinfo: id :'+ id);

        DatabaseModule.getImageUrlsByBirdId(
            id,
            { //{"_id":78886,"bird_id":257,"filename":"/files/avian_images/78886-Empidonax_virescens_AOU_7_52.jpg","credits":"Kelly Colgan Azar","displayOrder":1}
                success: (result)=>{
                    let images = [];
                    let imageCredit = [];
                    result.map((item, index)=>{
                        //if offline - only show downloaded images
                        if (connectionState.isConnected == true || item.isDownloaded == "true") {
                            images.push(MediaHandler.getMediaFile(item.bird_id, item.image_filename, connectionState.isConnected));
                            imageCredit.push(item.image_credits);
                        }
                    });
                    // console.log(JSON.stringify(imageCredit));
                    this.setState({
                        page: 0,
                        images: images,
                        imageCredit: imageCredit,
                        imageReady: true,
                    });
                    // call for info
                    DatabaseModule.getBirdById(id,{
                        success: (result)=>{
                            //{"_id":257,"name":"Acadian Flycatcher","scientific_name":"Empidonax virescens","range_description":"CANADA - Breeding only: 9,784 square km\nCARIBBEAN - Migration only: 119,391 square km\nCENTRAL AMERICA - Wintering only: 104,297 square km; Migration only: 405,573 square km\nMEXICO - Migration only: 433,743 square km\nSOUTH AMERICA - Wintering only: 555,165 square km\nUSA - Breeding only: 2,451,982 square km; Migration only: 168,294 square km","song_description":"Song is an emphatic \"peet-seet\", \"peet-suh\", with
                            //  accent on second syllable. Call is a sharp \"peet\"."}
                            // console.log(JSON.stringify(result));
                            this.setState({
                                info: result,
                                infoReady: true,
                            });
                            DatabaseModule.getMapsUrlByBirdId(id, {
                                //@FIXME. Render maps component differently if !connectionState.isConnected
                                success: (result)=>{
                                    let mapImages = [];
                                    let mapCredit = [];
                                    result.map((item, index)=>{
                                        //images
                                        mapImages.push(prefix+item.map_filename);
                                        //image credit
                                        mapCredit.push(item.map_credits);
                                    });
                                    this.setState({
                                        mapImages: mapImages,
                                        mapCredit: mapCredit,
                                        mapImagesReady: true,
                                    });
                                }
                            });
                        }
                    });

                }
            }
        );
    });

    
   }



   ShowModalFunction(visible) {
    console.log('ShowModalFunction from: '+this.state.isModelVisible+' to: '+!this.state.isModelVisible);
    this.setState({ isModelVisible: visible });
    };
    _handleModalButton=()=>{
       console.log('ToggleModelVisible from: '+this.state.isModelVisible+' to: '+!this.state.isModelVisible);
       this.setState({ isModelVisible: !this.state.isModelVisible});
    }
   getImageModal=(page)=>{
        if(page==='info'){
            const img = this.state.images.map((item, index)=>{
                return ({
                    url: item
                });
            });
            return (
                    <Modal
                        style={styles.modalOuterContainer}
                        backdropColor='transparent'
                        visible={this.state.isModelVisible}
                        transparent={false}
                        animationType={"slide"}
                        onRequestClose={() => this._handleModalButton()}
                        swipeToClose={true} 
                        backdropPressToClose={true}>
                        
                        
                        <ImageViewer saveToLocalByLongPress={false} index={this.state.activeSlide} imageUrls={img} />
                        <View style={styles.modalContainer}>
                            <TouchableHighlight
                                style={styles.ImageViewerGoBackBtn}
                                onPress={() => this.ShowModalFunction(!this.state.isModelVisible)}
                                >
                                <Text style={styles.ImageViewerGoBackText}>Go Back!</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>
    
            );
    
        }else if(page==='map'){
            const img = this.state.mapImages.map((item, index)=>{
                return ({url: item}); 
            });
            return (
                    <Modal
                        style={styles.modalOuterContainer}
                        backdropColor='transparent'
                        visible={this.state.isModelVisible}
                        transparent={false}
                        animationType={"slide"}
                        onRequestClose={() => console.log('Modal has been closed')}>
    
                        
                        <ImageViewer saveToLocalByLongPress={false} index={this.state.activeMapSlide} imageUrls={img} />    
                        <View style={styles.modalContainer}>
                            <TouchableHighlight
                                style={styles.ImageViewerGoBackBtn}
                                onPress={() => this.ShowModalFunction(!this.state.isModelVisible)}
                                >
                                <Text style={styles.ImageViewerGoBackText}>Go Back!</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>
    
            );
    
        }
        
   }

   _renderItem =({item, index})=>{
    // console.log(item);
    const even = (index + 1) % 2 === 0;
    // console.log(even);
    return (
           <TouchableOpacity key={'TH'+index} onPress={this._handleModalButton} style={styles.slideInnerContainer} activeOpacity={1}>
            <View key={'VW'+index} style={styles.imageContainer}>
                <Image key={'IM'+index} style={styles.image} source={{uri: item}} />
            </View>
        </TouchableOpacity>


    );}

    _handlePageZoom({ type, scale }) {
        if (scale !== 1) {
          this.setState({ scrollable: false });
        } else if (scale === 1) {
          this.setState({ scrollable: true });
        }
      }

      _handleDoubleClick() {
        this.setState({ scrollable: !this.state.scrollable });
      }

    getInfoPage=()=>{
        return (
            <ScrollView >
                {this.getImageModal('info')}
                <Slider 
                    data={this.state.images}
                    onPress={this._handleModalButton}
                />
                <View style={styles.sectionHeaderContainer}>
                    <Icon 
                        name='copyright'
                        type={'font-awesome'}
                        color='#34C759' // COLOR
                    />
                    <Text style={styles.title}> Photo Information</Text>
                </View>

                <View style={styles.textContainer}>

                    <View>
                        <Text>Photo Credit: {this.state.imageReady? (this.state.imageCredit[this.state.activeSlide]?this.state.imageCredit[this.state.activeSlide]:'Not Found'):'Loading..'}</Text>
                        {/* <Text>Source: {this.state.imageCredit[this.state.activeSlide].source}</Text>
                        <Text>Date: {this.state.imageCredit[this.state.activeSlide].date}</Text>
                        <Text>Region: {this.state.imageCredit[this.state.activeSlide].region}</Text>
                        <Text>Bird Maturity: {this.state.imageCredit[this.state.activeSlide].maturity}</Text> */}
                    </View>

                </View>
            </ScrollView>
        )
    }
    getVocalPage=()=>{
        let temp =[
            {
                name:'1',
                description: 'bla bla bla',
            },
            {
                name:'2',
                description: 'Hla hla hla',
            }
            ,
            {
                name:'3',
                description: 'Hla hla hla',
            }
            ,
            {
                name:'4',
                description: 'Hla hla hla',
            }
            ,
            {
                name:'5',
                description: 'Hla hla hla',
            }
        ]
        return (
        <VocalizationsTab
            audioList={temp}
            sectionHeaderContainer={styles.sectionHeaderContainer}
        />)
    }

    getMapPage=()=>{
        return (
        <ScrollView>
                {this.getImageModal('map')}
                
                <Slider 
                    data={this.state.mapImages}
                    onPress={this._handleModalButton}
                />
                <View style={styles.sectionHeaderContainer}>
                    <Icon 
                        name='map'
                        type={'font-awesome'}
                        color='#34C759' // COLOR
                    />
                    <Text style={styles.title}> Location</Text>

                </View>
                    {this.state.info? // for debugging
                        (<View style={styles.textContainer}>
                            <Text>Map photo credit: {this.state.mapImagesReady? this.state.mapCredit[this.state.activeMapSlide]:'Not Found'}</Text>
                            <Text style={styles.textContainer}>Range Description for {this.state.info.name}</Text>
                            <Text style={styles.textContainer}>{this.state.info.range_description}</Text>
                        </View>)
                    :
                        <Text style={styles.textContainer}>Info not found for this Bird.</Text>
                    }
        </ScrollView>)
    }


    /**
     * Gets the layout of the current page.
     * done this way to separate the layout from styling and button handlers
     * for future expansions.
     */
    getLayout=()=>{
        let activity = (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#34C759"/> {/* COLOR */}
                    <Text>Loading ....</Text>
                </View>);
        switch(this.state.page){
            case 0:
                if(this.state.infoReady){
                    return this.getInfoPage();
                }else{
                    return activity;
                }
            case 1:
                return this.getVocalPage();
            case 2:
                if(this.state.mapImagesReady){
                    return this.getMapPage();
                }else{
                    return activity;
                }
            default:
                return activity;
        }                  
    }

    /**
     * Button Handlers, for 2 reasons:
     * - getLayout knows which tab is current
     * - button styles know which tab is current
     */
    infoBtnHandler=()=>{
        this.setState({
            page: 0,
        });
    }
    vocalBtnHandler=()=>{
        this.setState({
            page: 1,
        });
    }
    mapBtnHandler=()=>{
        this.setState({
            page: 2,
        });
    }
    render() {
        const {page} = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="black" /> 
                <View style={{ justifyContent:'center', flexDirection:'row', paddingHorizontal: 15}}>
                    <TouchableOpacity style={[styles.TabButtonLeft ,{backgroundColor: page == 0? '#34C759':'#DCDCDC'}]} onPress={()=> this.infoBtnHandler()}>
                        <Text style={[styles.TabText, {opacity:page==0? 1:0.4, color: page==0? 'white': 'black'}]}>Information</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.TabButtonMiddle ,{backgroundColor: page == 1? '#34C759':'#DCDCDC'}]} onPress={()=> this.vocalBtnHandler()}>
                        <Text style={[styles.TabText, {opacity:page==1? 1:0.4, color: page==1? 'white': 'black'}]}>Vocalizations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.TabButtonRight ,{backgroundColor: page == 2? '#34C759':'#DCDCDC'}]} onPress={()=> this.mapBtnHandler()}>
                        <Text style={[styles.TabText ,{opacity:page==2? 1:0.4, color: page==2? 'white': 'black'}]}>Location</Text>
                    </TouchableOpacity>
                </View>
                
                {this.state.imageReady && this.state.infoReady? 
                    (this.getLayout())
                    // (console.log(this.state.data.name))
                   
                        : 
                    
                    (
                    <View style={{justifyContent: 'center', alignItems: "center", top: 50}}>
                        <ActivityIndicator size="large" color="#34C759"/>
                        <Text>Loading bird information...</Text>
                    </View>)}
            </View>
        );
    }
}

