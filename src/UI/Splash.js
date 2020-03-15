import React, {Component} from 'react';
import {View} from 'react-native';
import OnboardingLogo from '../commons/OnboardingLogo';

class Splash extends Component{
    state = {}

    checkAuth=()=>{
        // this.props.navigation.navigate('Main');
        setTimeout(()=>{
            this.props.navigation.navigate('Auth');
        }, 100)
    }
    componentDidMount(){
        this.checkAuth()
    }
    render(){
        return (
            <View style={{flex: 1, alignSelf: "center", justifyContent: "center"}}>
                <OnboardingLogo imageStyle={{height:250,width:250}}/>
            </View>
        )
    }
}

export default Splash;