import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import common from './common.style.js';
export default StyleSheet.create({
    statusBar:{
        height: Constants.statusBarHeight-10,
        // backgroundColor: 'black',
        width:'100%',
     },
     buttonsContainer:{
         flexDirection:'row',
         flex:1, 
         justifyContent:'center', 
         paddingVertical:15,
        },
     MainContainer:{
         flex: 1,
         backgroundColor:"white", 
         paddingBottom:10
        },
     switchContainer:{
         flexDirection:'row', 
         justifyContent:'space-between'
        },
     listsContainer:{
         marginBottom:25, 
         paddingHorizontal: 15
        },

     textInputContainer:{
         margin:15, 
         flexDirection:'row'
        },
     textInput:{     
        borderRadius: 0.5,
        borderColor: 'black',
        borderWidth: 0.2,
        backgroundColor:'#F5F5F5', 
        marginHorizontal: 15, 
        flexGrow:1, 
        paddingHorizontal:10
    },
     textInputTitle:{
         textAlignVertical: "center", 
         fontSize: 15, 
         fontWeight: '500', 
         opacity:0.7,
         marginHorizontal: 15,
        },
     sectionContainer:{
         margin: 15
        },
     sectionTitleText: {
         fontSize: 20, 
         fontWeight:'700', 
         opacity: 0.5, 
         marginBottom:10
        },
     btn:{
         alignSelf:"center",
         width:'70%',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 3,
        marginTop: 3,
        textAlignVertical: "center",
        textAlign:'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'purple',

     },
     header:{
         flexDirection: "row",
         justifyContent: "space-between", 
         paddingBottom: 10,
        },
     headerText:{
         
        paddingLeft: 15, 
        paddingRight: 15,
        fontWeight: "700",
        color: "purple",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
       },
});