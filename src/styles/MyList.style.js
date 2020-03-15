import { StyleSheet } from 'react-native';
import common from './common.style.js';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    statusBar: {
        height: Constants.statusBarHeight,
        width: '100%',
        // backgroundColor: 'black',
    },
    btn: {
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
    quizEnabledText: {
        fontWeight: "600",
        color: "red"
    },
    quizDisabledText: {
        fontWeight: "600",
        color: "grey"
    },
    disabledBtn: {
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
        backgroundColor: "white",
    },
    BirdCard: {
        marginBottom: 3
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    ActionSheetContainer: {
        marginHorizontal: 10,
        justifyContent: "center",
        alignContent: "center",
        flexGrow: 1
    },
    actionSheetText: {
        fontSize: 22,
        fontWeight: '500',
        opacity: 0.7,
        justifyContent: 'center'
    },
    actionSheetTitle: {
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 1
    },
    DownloadButton: {
        marginRight: 10,
        marginTop: 5
    },
    belowHeader: {
        paddingHorizontal: 5
    },
    SearchTextInput: {
        fontSize: 14,
        color: '#474747'
    },
    SearchTextInputContainer: {
        borderRadius: 10,
        backgroundColor: '#E8E8E8'
    },
    SearchBarContainer: {
        backgroundColor: 'white',
        borderTopColor: 'white',
        borderBottomColor: 'white',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 2
    },
    SpeciesCountText: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 5,
        paddingTop: 10,
        textAlign: "right"
    },
    FlatList: {
        flex: 1,
        paddingHorizontal: 5
    },
    goToTopBtn: {
        backgroundColor: '#E8E8E8',
        padding: 10,
        justifyContent: "center",
        alignContent: 'center'
    },
    goToTopText: {
        fontWeight: '500',
        color: 'red',
        textAlign: "center"
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: "center",
        top: 50
    },
    ListNotSelectedText: {
        fontWeight: '500',
        top: 50,
        textAlign: "center"
    },
    header: {

        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: "700",
        color: "red",
        fontSize: 20,
        justifyContent: "center",
        alignSelf: "center"
    },
});