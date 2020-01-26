import React, { Component } from "react";
import {Modal, StyleSheet, View, Text, Image, ScrollView, Platform , Dimensions, TouchableHighlight, StatusBar, ActivityIndicator} from "react-native";
import {Icon} from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from 'expo-constants';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';
import DatabaseModule from '../DB/DatabaseModule';

const prefix='https://natureinstruct.org';
const NotFoundImage = [require('../../assets/image-not-found.jpg'), require('../../assets/image-not-found.jpg'), require('../../assets/image-not-found.jpg')]
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const IS_IOS = Platform.OS === 'ios';
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 10;
const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};
const entryBorderRadius = 8;
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

    }

    static navigationOptions = ({navigation})=> ({
        headerTitle:()=> (<View style={{flexDirection:'column', }}>
            <Text style={{
                                fontWeight: "700",
                                color: "#34C759",
                                fontSize: 20,
                                justifyContent: "space-between", 
                                alignSelf:"center"}}
                          >{navigation.state.params.title}</Text>
    <Text style={{letterSpacing: 1.5, fontSize:10, justifyContent: "center", fontStyle:'italic'}}>{navigation.state.params.latin}</Text>
        </View>),
        headerTintColor: "#34C759",
        
    })
   componentDidMount(){
    let id = this.props.navigation.state.params.id
    console.log('birdinfo: id :'+ id);

    DatabaseModule.getImagesUrlByBirdId(
        id,
        { //{"_id":78886,"bird_id":257,"filename":"/files/avian_images/78886-Empidonax_virescens_AOU_7_52.jpg","credits":"Kelly Colgan Azar","displayOrder":1}
            success: (result)=>{
                // console.log(JSON.stringify(result));
                let images = [];
                let imageCredit = [];
                result.map((item, index)=>{
                    //images
                    images.push(prefix+item.image_filename);
                    //image credit
                    imageCredit.push(item.image_credits);


                });
                console.log(JSON.stringify(imageCredit));
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

    
   }
   testing =()=>{
       return (<Text>We got something!</Text>);
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
                        style={{margin:0}}
                        backdropColor='transparent'
                        visible={this.state.isModelVisible}
                        transparent={false}
                        animationType={"slide"}
                        onRequestClose={() => console.log('Modal has been closed')}>
                        
                        
                        <ImageViewer saveToLocalByLongPress={false} index={this.state.activeSlide} imageUrls={img} />
                        <View style={styles.modalContainer}>
                            <TouchableHighlight
                                style={{padding:15, backgroundColor: 'gray'}}
                                onPress={() => this.ShowModalFunction(!this.state.isModelVisible)}
                                >
                                <Text style={{textAlign:"center", fontWeight:'500'}}>Go Back!</Text>
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
                        style={{margin:0}}
                        backdropColor='transparent'
                        visible={this.state.isModelVisible}
                        transparent={false}
                        animationType={"slide"}
                        onRequestClose={() => console.log('Modal has been closed')}>
    
                        
                        <ImageViewer saveToLocalByLongPress={false} index={this.state.activeMapSlide} imageUrls={img} />    
                        <View style={styles.modalContainer}>
                            <TouchableHighlight
                                style={{padding:15, backgroundColor: 'gray'}}
                                onPress={() => this.ShowModalFunction(!this.state.isModelVisible)}
                                >
                                <Text style={{textAlign:"center", fontWeight:'500'}}>Go Back!</Text>
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
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.images}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={this.state.activeSlide}
                    hasParallaxImages={true}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    scrollEnabled={ this.state.scrollable }
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                />
                <Pagination 
                    dotsLength={this.state.images.length}
                    activeDotIndex={this.state.activeSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'#34C759'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                />
                <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                    <Icon 
                        name='copyright'
                        type={'font-awesome'}
                        color='#34C759'
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
        return (<ScrollView>
                            

                     {/* TODO: VOCALIZATIONS CODE GOES HERE */}
                     <View>
                    <Carousel
                        ref={(cb) => { this._carouselMap = cb; }}
                        data={NotFoundImage}
                        renderItem={({item,index})=>{
                            return (
                                <TouchableOpacity key={'TH'+index} onPress={this._handleModalButton} style={styles.slideInnerContainer} activeOpacity={1}>
                                 <View key={'VW'+index} style={styles.imageContainer}>
                                     <Image key={'IM'+index} style={styles.image} source={item} />
                                 </View>
                                 </TouchableOpacity>)
                        }}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={this.state.activeMapSlide}
                        hasParallaxImages={true}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        onSnapToItem={(index) => this.setState({ activeMapSlide: index }) }
                    />
                    <Pagination 
                        dotsLength={NotFoundImage.length}
                        activeDotIndex={this.state.activeMapSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'#34C759'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider2Ref}
                        tappableDots={!!this._slider2Ref}
                    />
                </View>
                <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                    <Icon 
                        name='music'
                        type={'font-awesome'}
                        color='#34C759'
                    />
                    <Text style={styles.title}> Vocalizations</Text>
                </View> 
        </ScrollView>)
    }

    getMapPage=()=>{
        return (<ScrollView>
                {this.getImageModal('map')}
                {this.state.mapImages.length != 0?
                    (<View>
                        <Carousel
                        ref={(cb) => { this._carouselMap = cb; }}
                        data={this.state.mapImages}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={this.state.activeMapSlide}
                        hasParallaxImages={true}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        onSnapToItem={(index) => this.setState({ activeMapSlide: index }) }
                    />
                    <Pagination 
                        dotsLength={this.state.mapImages.length}
                        activeDotIndex={this.state.activeMapSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'#34C759'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider2Ref}
                        tappableDots={!!this._slider2Ref}
                    />
                    </View>)
                :
                (<View>
                    <Carousel
                        ref={(cb) => { this._carouselMap = cb; }}
                        data={NotFoundImage}
                        renderItem={({item,index})=>{
                            return (
                                <TouchableOpacity key={'TH'+index} onPress={this._handleModalButton} style={styles.slideInnerContainer} activeOpacity={1}>
                                 <View key={'VW'+index} style={styles.imageContainer}>
                                     <Image key={'IM'+index} style={styles.image} source={item} />
                                 </View>
                                 </TouchableOpacity>)
                        }}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={this.state.activeMapSlide}
                        hasParallaxImages={true}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        onSnapToItem={(index) => this.setState({ activeMapSlide: index }) }
                    />
                    <Pagination 
                        dotsLength={NotFoundImage.length}
                        activeDotIndex={this.state.activeMapSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'#34C759'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider2Ref}
                        tappableDots={!!this._slider2Ref}
                    />
                </View>)
                
                }
                <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                    <Icon 
                        name='map'
                        type={'font-awesome'}
                        color='#34C759'
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
        let activity = (<View style={{justifyContent: 'center', alignItems: "center", top: 50}}>
                    <ActivityIndicator size="large" color="#34C759"/>
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
        return (
            <View style={{ paddingHorizontal: 5}}>
                <StatusBar barStyle="dark-content" backgroundColor="black" />
                <View style={{ justifyContent:'center', flexDirection:'row', paddingHorizontal: 15}}>
                    <TouchableOpacity style={{marginBottom: 5, borderBottomStartRadius: 15, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: this.state.page == 0? '#34C759':'#DCDCDC'}} onPress={()=> this.infoBtnHandler()}>
                        <Text style={{opacity:this.state.page==0? 1:0.4,fontWeight:'700',color: this.state.page==0? 'white': 'black'}}>Information</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginBottom: 5, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: this.state.page == 1? '#34C759':'#DCDCDC'}} onPress={()=> this.vocalBtnHandler()}>
                        <Text style={{opacity:this.state.page==1? 1:0.4,fontWeight:'700',color: this.state.page==1? 'white': 'black'}}>Vocalizations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginBottom: 5, borderBottomEndRadius:15, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: this.state.page == 2? '#34C759':'#DCDCDC'}} onPress={()=> this.mapBtnHandler()}>
                        <Text style={{opacity:this.state.page==2? 1:0.4, fontWeight:'700', color: this.state.page==2? 'white': 'black'}}>Location</Text>
                    </TouchableOpacity>
                </View>
                
                {this.state.imageReady && this.state.infoReady? 
                    (this.getLayout())
                    // (console.log(this.state.data.name))
                   
                        : 
                    (<View style={{justifyContent: 'center', alignItems: "center", top: 50}}>
                    <ActivityIndicator size="large" color="#34C759"/>
                    <Text>Loading bird information...</Text>
                    
                </View>)}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    statusBar:{
        height: Constants.statusBarHeight,
        backgroundColor: 'black',
        width: '100%',
     },
    header:{
         
        paddingLeft: 15, 
        paddingRight: 15,
        fontWeight: "700",
        color: "#34C759",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
       },
       safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
        paddingVertical: 30
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
       slider: {
        flexGrow: 0,
        marginTop: 5, // 15
        overflow: 'visible' // for custom animations
    },    
    sliderContentContainer: {
        paddingVertical: 0, // for custom animation
        height: slideHeight,
    },
    paginationContainer: {
        paddingTop: 5,
        paddingBottom: 20,
        marginHorizontal: 10,
        
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 7,
        // marginHorizontal: 4
    },
       slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 5 //18 needed for shadow
        
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {

        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },  
    modalContainer: {

        justifyContent: 'center',

      },

});