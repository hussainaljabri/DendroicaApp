import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import BirdList from './src/UI/BirdList';
import MyList from './src/UI/MyList';
import Settings from './src/UI/Settings';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer } from "react-navigation";
import DatabaseTestDriver from "./src/DB/DatabaseTestDriver";
DatabaseTestDriver.init();

export default class App extends Component {

  render(){
    return (<BottomContainer/>);

  }

}

const BottomNav = createMaterialBottomTabNavigator(
    {
      MyList: { screen: MyList,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>My Birds</Text>,
                  tabBarIcon: ({tintColor})=> <FontAwesome5 name="dove" size={20} color={tintColor} />,
                  tabBarColor: '#474747',
                } },
      Explore: { screen: BirdList,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Explore</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="telescope" size={20} color={tintColor} />,
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