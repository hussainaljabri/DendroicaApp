import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import BirdList from './src/UI/BirdList';
import MyList from './src/UI/MyList';
import Settings from './src/UI/Settings';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import {Text} from 'react-native';
import {createAppContainer } from "react-navigation";
import DatabaseManagementModule from "./src/DB/DatabaseManagementModule";
DatabaseManagementModule.init();

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
                  tabBarColor: '#cc99ff',
                } },
      Explore: { screen: BirdList,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Explore</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="telescope" size={20} color={tintColor} />,
                  tabBarColor: '#00cc99',
                } },
      Settings: { screen: Settings,
                navigationOptions:{
                  tabBarLabel: <Text style={{fontWeight: '800',}}>Settings</Text>,
                  tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="settings-outline" size={20} color={tintColor} />,
                  tabBarColor: '#3399ff',

                } },

    },
    {
      initialRouteName: 'MyList',
      activeColor: 'white',
      inactiveColor: '#d9d9d9',
      barStyle: { backgroundColor: '#694fad', },
      shifting: true,
      keyboardHidesNavigationBar: true,
      labeled: true,
    }
  );

  const BottomContainer = createAppContainer(BottomNav);