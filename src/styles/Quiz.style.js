import { StyleSheet, Platform, Dimensions} from 'react-native';
import common from './common.style.js';
import Constants from 'expo-constants';
import theme from '../constants/theme';

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
    container: {
        backgroundColor: "white",
        marginLeft: 5,
        marginRight: 5,
        flex: 1
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: "center"
    },
    questionText: {
        fontWeight: '600',
        paddingHorizontal: 5,
    },
    optionsButton: {
        flexDirection: 'row',
        padding: 10
    },
    optionsButtonText: {
        marginHorizontal: 15
    },
    header: {
        flexDirection: "row",
        padding: 10
    },
    goBackBtn: {
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    belowHeaderContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nextBtnText: {
        justifyContent: "center",
        textAlign: "center"
    },
    statusBar: {
        height: Constants.statusBarHeight-10,
    },
    optionsScroll: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    nextBtn: {
        marginHorizontal: wp(30),
        marginVertical: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    topBtn: {
        marginHorizontal: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    topBtnInactive: {
        marginHorizontal: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    headerText: {
        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: "700",
        color: "red",
        fontSize: 20,
        justifyContent: "center",
        alignSelf: "center"
    },
    headerTitle: {
        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: "700",
        fontSize: 20,
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
        color: 'black',
        opacity: 0.6
    },
    topTextContainer: {
        alignItems: "center",
        // justifyContent: "space-evenly",
        padding: 10,
        flexDirection: 'row',

    },
    scoretxt: {
        fontWeight: "700",
    },
    helpersContainer: {
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    box: {
        width: 100,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 15,
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
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 7,
        marginHorizontal: 4
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 5 //18 needed for shadow

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
});