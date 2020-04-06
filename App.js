import React from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import DatabaseManagementModule from "./src/DB/DatabaseManagementModule";



//Initialize DB -> Will check if there if db is instantiated.
//Destroys and rebuilds tables if no db or dataVersionUpdate
DatabaseManagementModule.init(() => {

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
 * Stack navigator for Settings
 * It was set like this to allow expansion
 * or later upgrades to multi-page settings layout.
 */
const SettingsNavigator = createStackNavigator({
  Settings: {
    getScreen: ()=> require('./src/UI/Settings').default,
  },
});


  
// });
const BottomNav = createMaterialBottomTabNavigator(
    {
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
      Settings: {  screen: SettingsNavigator,
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