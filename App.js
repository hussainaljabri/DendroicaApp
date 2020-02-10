import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import BirdList from './src/UI/BirdList';
import MyList from './src/UI/MyList';
import Settings from './src/UI/Settings';
import BirdInfo from './src/UI/BirdInfo';
import Quiz from './src/UI/Quiz';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer } from "react-navigation";
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
        //Import API data for 1 = Canada
        DatabaseManagementModule.importApiData(1, () => {
            //Import API data for 2 = Mexico
            DatabaseManagementModule.importApiData(2, () => {
                console.log("All Api data imported");
                MediaHandler.init(() => {

                });
            });
        });
    });
});

export default class App extends Component {

  render(){
    return (<BottomContainer/>);

  }

}


/**
 * Stack navigator for BirdCard onPress in either MyList.
 * To move to BirdInfo after clicking BirdCard.
 */
const MyListToBirdInfoNavigator = createStackNavigator({
  MyList: {
    screen: MyList,
  },
  BirdInfo: {
    screen: BirdInfo,
  },
  Quiz: {
    screen: Quiz,
  }
},);
/**
 * Stack navigator for BirdCard onPress in either BirdList.
 * To move to BirdInfo after clicking BirdCard.
 */
const BirdListToBirdInfoNavigator = createStackNavigator({
  BirdList: {
    screen: BirdList,
  },
  BirdInfo: {
    screen: BirdInfo,
  },
});

/**
 * Stack Navigator for Welcome page.
 */
// const WelcomePageNavigator = createStackNavigator({
  
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
      Settings: { screen: Settings,
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

  const BottomContainer = createAppContainer(BottomNav);