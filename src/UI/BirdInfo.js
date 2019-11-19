import React, { Component } from "react";
import { StyleSheet, View, Text, Image, ScrollView, Platform , Dimensions, ActivityIndicator} from "react-native";
import {Icon} from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import Constants from 'expo-constants';
import Carousel, { Pagination } from 'react-native-snap-carousel';

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
        data: undefined,
        dataReady: false,
        activeSlide: 0,
    }
    static navigationOptions = ({navigation})=> ({
        headerTitle:()=> (<Text style={{
                                fontWeight: "700",
                                color: "orange",
                                fontSize: 20,
                                justifyContent: "center", 
                                alignSelf:"center"}}
                          >{navigation.state.params.title}</Text>),
        headerTintColor: "orange",
        
    })
   componentDidMount(){
       this.setState({
           data: this.props.navigation.getParam('data', []),
           dataReady: true,
       });

   }
   //@TODO
   getVocalization=()=>{
        
   }
   //@TODO
   getLocations=()=>{

   }

   _renderItem ({item, index}) {
    console.log(item);
    const even = (index + 1) % 2 === 0;
    console.log(even);
    return (
      <TouchableOpacity style={styles.slideInnerContainer} activeOpacity={1} onPress={()=> alert('attempt to enlarge image')}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={item} />
          </View>





      </TouchableOpacity>
    );}

    render() {
        return (
            <View style={{backgroundColor:"white", marginLeft: 5, marginRight: 5,}}>

                {this.state.dataReady? 
                    (
                        <ScrollView >
                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={this.state.data.image}
                                renderItem={this._renderItem}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}


                                firstItem={this.state.activeSlide}
                                hasParallaxImages={true}
                                containerCustomStyle={styles.slider}
                                contentContainerCustomStyle={styles.sliderContentContainer}
                                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                            />
                            <Pagination 
                                dotsLength={this.state.data.image.length}
                                activeDotIndex={this.state.activeSlide}
                                containerStyle={styles.paginationContainer}
                                dotColor={'orange'}
                                dotStyle={styles.paginationDot}
                                inactiveDotColor={colors.black}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                                carouselRef={this._slider1Ref}
                                tappableDots={!!this._slider1Ref}
                            />
                            <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                                <Icon 
                                    name='info-circle'
                                    type={'font-awesome'}
                                    color='orange'
                                />
                                <Text style={styles.title}> Information</Text>
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.subtitle}>{this.state.data.details}</Text>
                            </View>

                            <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                                <Icon 
                                    name='music'
                                    type={'font-awesome'}
                                    color='orange'
                                />
                                <Text style={styles.title}> Vocalizations</Text>
                            </View>

                                {this.getVocalization()}

                            <View style={{flexDirection:'row', paddingHorizontal: 15,}}>
                                <Icon 
                                    name='map'
                                    type={'font-awesome'}
                                    color='orange'
                                />
                                <Text style={styles.title}> Location</Text>
                            </View>
                                {this.getLocations()}

                        </ScrollView>
                    )
                    
                    : 
                    
                    (<Text>Loading...</Text>)}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    statusBar:{
        height: Constants.statusBarHeight,
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
        paddingTop: 0,
        paddingBottom: 8,
    },
    paginationDot: {
        width: 12,
        height: 12,
        borderRadius: 7,
        marginHorizontal: 8
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
    }
});