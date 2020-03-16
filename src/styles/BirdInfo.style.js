import { StyleSheet, Dimensions, Platform } from 'react-native';
import common from './common.style.js';
import theme from '../constants/theme';
import Constants from 'expo-constants';

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
const entryBorderRadius = 8;

export default StyleSheet.create({
    statusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'black',
        width: '100%',
    },

    headerTitleContainer: {
        flexDirection: 'column',
    },
    headerTitleBirdName: {
        fontWeight: "700",
        color: "#34C759",
        fontSize: 20,
        justifyContent: "space-between",
        alignSelf: "center"
    },
    headerTitleBirdLatin: {
        letterSpacing: 1.5,
        fontSize: 10,
        justifyContent: "center",
        fontStyle: 'italic'
    },
    modalOuterContainer: {
        margin: 0
    },
    ImageViewerGoBackBtn: {
        padding: 15,
        backgroundColor: 'gray'
    },
    ImageViewerGoBackText: {
        textAlign: "center",
        fontWeight: '500'
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: "center",
        top: 50
    },
    TabText: {
        fontWeight: '700'
    },
    TabButtonRight: {
        borderBottomEndRadius: 15,
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    TabButtonMiddle: {
        borderBottomLeftRadius: 0,
        borderBottomEndRadius: 0,
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    TabButtonLeft: {
        marginBottom: 5,
        borderBottomStartRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    header: {
        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: "700",
        color: "#34C759",
        fontSize: 20,
        justifyContent: "center",
        alignSelf: "center"
    },
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.black
    },
    container: {
        paddingHorizontal: 5
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
        backgroundColor: theme.colors.black
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
        color: theme.colors.black
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
        shadowColor: theme.colors.black,
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 10
        },
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
        backgroundColor: theme.colors.black
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
        backgroundColor: theme.colors.black
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
        backgroundColor: theme.colors.black
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
        color: theme.colors.gray,
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