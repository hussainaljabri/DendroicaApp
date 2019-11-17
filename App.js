import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import BirdList from './src/UI/BirdList';
import MyList from './src/UI/MyList';
import Settings from './src/UI/Settings';
import BirdInfo from './src/UI/BirdInfo';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

export default class App extends Component {

  render(){
    return (<BottomContainer/>);

  }

}
/**
 * @TODO: TAB BAR For BirdInfo
 */



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
  // Quiz: {
  //   screen: 
  // }
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


const BottomNav = createMaterialBottomTabNavigator(
    {
      Explore: { screen: BirdListToBirdInfoNavigator,
        navigationOptions:{
          tabBarLabel: <Text style={{fontWeight: '800',}}>Explore</Text>,
          tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="telescope" size={20} color={tintColor} />,
          tabBarColor: '#474747',
                } },
      MyList: { screen: MyListToBirdInfoNavigator,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>My Birds</Text>,
                  tabBarIcon: ({tintColor})=> <FontAwesome5 name="dove" size={20} color={tintColor} />,
                  tabBarColor: '#474747',
                } },
      Settings: { screen: Settings,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Settings</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="settings-outline" size={20} color={tintColor} />,
                  tabBarColor: '#474747',

                } },

    },
    {
      initialRouteName: 'Explore',
      activeColor: '#ff8080',
      inactiveColor: '#d9d9d9',
      barStyle: { backgroundColor: '#694fad', },
      shifting: true,
      keyboardHidesNavigationBar: true,
      labeled: true,
    }
  );

  const BottomContainer = createAppContainer(BottomNav);