import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Platform, Alert, Button, TextInput} from "react-native";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { images } from "../constants/images";
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
const NotFoundImage = [require('../../assets/image-not-found.jpg'), require('../../assets/image-not-found.jpg'), require('../../assets/image-not-found.jpg')]
/**
 * this.props.data
 * this.props.onPress
 */
export default class Slider extends React.PureComponent {
    state={
        activeMapSlide: 0,
    }
    
    _renderItem =({item, index})=>{
        // console.log(item);
        const even = (index + 1) % 2 === 0;
        // console.log(even);
        return (
            <TouchableOpacity key={'TH'+index} onPress={this.props.onPress} style={styles.slideInnerContainer} activeOpacity={1}>
                <View key={'VW'+index} style={styles.imageContainer}>
                    {this.props.connected || this.props.downloaded? <Image key={'IM'+index} style={styles.image} source={{uri: item}} />
                    : <Image key={'IM'+index} style={styles.image} source={item} />}
                </View>
            </TouchableOpacity>
    
    
    );}


    render() {
        const {connected, downloaded} = this.props;
        return (
            <View>
                <Carousel
                    ref={(cb) => { this._carouselMap = cb; }}
                    data={this.props.connected || this.props.downloaded? this.props.data: images.notfound}
                    renderItem={this.props.renderItem? this.props.renderItem: this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={this.state.activeMapSlide}
                    hasParallaxImages={true}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    onSnapToItem={(index) => this.setState({ activeMapSlide: index }) }
                />
                {(connected || downloaded) &&
                <Pagination 
                    dotsLength={this.props.data.length}
                    activeDotIndex={this.state.activeMapSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'#34C759'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={colors.black}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    carouselRef={this._sliderRef}
                    tappableDots={!!this._sliderRef}
                />}
            </View>
        );


    }


}


const styles = StyleSheet.create({
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
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 5 //18 needed for shadow
        
    },
});