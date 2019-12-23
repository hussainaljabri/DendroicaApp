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