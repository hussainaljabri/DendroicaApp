import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DatabaseManagementModule from "./src/DB/DatabaseManagementModule";
import DatabaseModule from "./src/DB/DatabaseModule";
import Authentication from "./src/DB/Authentication";
import MediaHandler from "./src/DB/MediaHandler";
// import TestingPage from './src/UI/TestingPage';

const username = "tmobile";
const password = "appH@ppy";

//Initialize DB -> Will check if there if db is instantiated.
//Destroys and rebuilds tables if no db or dataVersionUpdate
DatabaseManagementModule.init(() => {
    //Authenticates user with hard coded credentials
    Authentication.userLogin(username, password, () => {
        //Import API data for all projects
        DatabaseManagementModule.importApiData([1,2,3,4,5,6], () => {
            console.log("All Api data imported");
            MediaHandler.init(() => { });
        });
    });
});

/**
 * Stack navigator for BirdCard onPress in either MyList.
 * To move to BirdInfo after clicking BirdCard.
 */
const MyListToBirdInfoNavigator = createStackNavigator({
  MyList: {
    getScreen: ()=> require('./src/UI/MyList').default,
  },
  BirdInfo: {
    getScreen: ()=> require('./src/UI/BirdInfo').default,
  },
  Quiz: {
    getScreen: ()=> require('./src/UI/Quiz').default,
  }
},);
/**
 * Stack navigator for BirdCard onPress in either BirdList.
 * To move to BirdInfo after clicking BirdCard.
 */
const BirdListToBirdInfoNavigator = createStackNavigator({
  BirdList: {
    getScreen: ()=> require('./src/UI/BirdList').default,
  },
  BirdInfo: {
    getScreen: ()=> require('./src/UI/BirdInfo').default,
  },
});

/**
 * Stack Navigator for Welcome page.
 */
// const AuthNavigator = createStackNavigator(
//   {
//       Login:{
//           getScreen: ()=> require('./src/UI/Welcome').default,
//       },
//   },{
//       navigationOptions:{
//           header: null,
//           headerMode: 'none'
//       }
//   }
// );
  
// });
const BottomNav = createMaterialBottomTabNavigator(
    {
      // TestingPage: {
      //     screen: TestingPage,
      //     navigationOptions:{
      //       tabBarLabel: <Text style={{fontWeight: '800',}}>TestingPage</Text>,
      //       tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="telescope" size={20} color={tintColor} />,
      //       tabBarColor: 'orange',
      //       activeColor: 'orange',
      //       // barStyle: { backgroundColor: 'yellow' },
      //     }
      // },
      Explore: { screen: BirdListToBirdInfoNavigator,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Explore</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="telescope" size={20} color={tintColor} />,
                  tabBarColor: 'orange',
                  activeColor: 'orange',
                  // barStyle: { backgroundColor: 'yellow' },
                } },
      MyList: { screen: MyListToBirdInfoNavigator,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>My Lists</Text>,
                  tabBarIcon: ({tintColor})=> <FontAwesome5 name="dove" size={20} color={tintColor} />,
                  tabBarColor: 'red',
                  activeColor: 'red',
                  // barStyle: { backgroundColor: '#67baf6' },
                } },
      Settings: {  getScreen: ()=> require('./src/UI/Settings').default,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Settings</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="settings-outline" size={20} color={tintColor} />,
                  tabBarColor: 'purple',
                  activeColor: 'purple',
                  // barStyle: { backgroundColor: 'blue' },
                } },

    },
    {
      initialRouteName: 'Explore',
      activeColor: 'orange',
      inactiveColor: 'black',
      barStyle: { backgroundColor: '#F5F5F5', },
      shifting: false,
      keyboardHidesNavigationBar: true,
      labeled: true,
    }
  );


/**
 * using Switch Navigator eliminates the stacking of pages when going from
 * Splash to LoginPage to MainApp pages.
 *  */ 

  const AppNavigator = createSwitchNavigator(
    {
        Splash:{
            getScreen: ()=> require('./src/UI/Splash').default,
        },
        Auth: {
          getScreen: ()=> require('./src/UI/Welcome').default,
        },
        Main: BottomNav,
    },
    {
        initialRouteName: 'Splash',
    }
  );

export default createAppContainer(AppNavigator);