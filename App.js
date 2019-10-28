import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createAppContainer } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import BirdList from './src/pages/BirdList';
import MyList from './src/pages/MyList';
import Settings from './src/pages/Settings';
import { FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import QuizScreen from './src/pages/quiz/QuizScreen';
import QuizMenu from './src/pages/quiz/QuizMenu';


export default class App extends Component {

  render(){
    return (<BottomContainer/>);

  }

}
/**
*	Quiz Navigator.
*/
const QuizNavigator = createStackNavigator({
  QuizMenu:{ // parent used as Key in Stack Navigator, to navigate() to.
    screen: QuizMenu, // setting QuizMenu Component as screen to the parent
    navigationOptions: () => ({
      title: `QuizMenu`
    }), 
  },
  Quiz: {screen: QuizScreen}

});




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
      QuizNavigator: { screen: QuizNavigator,
        navigationOptions:{
          tabBarLabel: <Text style={{fontWeight: '800',}}>Quiz</Text>,
          tabBarIcon: ({tintColor})=><MaterialCommunityIcons name="help-circle-outline" size={20} color={tintColor} />,
          tabBarColor: '#3399ff',

        }},

    },
    {
      initialRouteName: 'QuizNavigator',
      activeColor: 'white',
      inactiveColor: '#d9d9d9',
      barStyle: { backgroundColor: '#694fad', },
      shifting: true,
      keyboardHidesNavigationBar: true,
      labeled: true,
    }
  );

  // const AppContainer = createAppContainer(AppNavigator);
  const BottomContainer = createAppContainer(BottomNav);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
  title: {
    fontWeight: "700",
    letterSpacing: 4,
    fontSize: 20,
  },
  subtitle:{
    marginTop: 40,

  },
  backgroundImage:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
    height:'100%'
  },

});
