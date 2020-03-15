import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

var BirdListTheme = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },
    statusBar: {
        height: Constants.statusBarHeight,
        width: '100%',
    },
    btn: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'orange'
    },
    disabledBtn: {
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#b0b0b0'
    },
    select: {
        width: "100%",
        color: "black",
        fontWeight: "700",
        backgroundColor: "white",
    },
    FlatList: {
        flex: 1,
        paddingHorizontal: 5
    },
    BirdCard: {
        marginBottom: 3
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
    SelectionActionContainer: {
        paddingTop: 3,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    SelectionCountText: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf: "center"
    },
    SpeciesCountText: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingBottom: 5,
        paddingTop: 10,
        textAlign: "right"
    },
    headerContainer: {
        paddingHorizontal: 5
    },
    innerHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    actionSheetOptions: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 1
    },

    headerText: {

        paddingLeft: 15,
        paddingRight: 15,
        fontWeight: "700",
        color: "orange",
        fontSize: 20,
        justifyContent: "center",
        alignSelf: "center"
    },
    actionSheetContainer: {
        marginHorizontal: 10,
        justifyContent: "center",
        alignContent: "center",
        flexGrow: 1
    },
    continentsText: {
        fontSize: 22,
        fontWeight: '500',
        opacity: 0.7,
        justifyContent: 'center'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: "center",
        top: 50
    },
    expandButton: {
        backgroundColor: "#DCDCDC",
        paddingHorizontal: 5
    },

    FloatingButton: {

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


var MyListTheme = {}

var BirdInfoTheme = {}

var SettingsTheme = {}

var QuizTheme = {}


var colors = {

}




const theme={
    BirdListTheme: BirdListTheme,
    MyListTheme: MyListTheme,
    BirdInfoTheme: BirdInfoTheme,
    SettingsTheme: SettingsTheme,
    QuizTheme: QuizTheme,
};

export default theme;