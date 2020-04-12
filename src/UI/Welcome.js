import React, {Component} from 'react';
import {Animated, View, ActivityIndicator } from 'react-native';
import { images } from '../constants/images';
import Authentication from "../DB/Authentication";
import DatabaseManagementModule from "../DB/DatabaseManagementModule";
import MediaHandler from "../DB/MediaHandler";
import InputBox from '../commons/InputBox'
import LoginButton from '../commons/LoginButton';
import OnboardingLogo from '../commons/OnboardingLogo';

class Welcome extends Component{
    state = {
        opacity: new Animated.Value(0),
        position: new Animated.Value(0),
        btnposition: new Animated.Value(0),
        username: '',
        password: '',
        isLoading: false,
    }

    componentDidMount(){
        Authentication.getNewToken({
            success:()=> this.props.navigation.navigate('Main'),
            error: ()=>{}
        });
         // to start both animations at same time
        Animated.parallel([this.positionAnim(), this.opacityAnim(), this.btnpositionAnim()]).start();
    }
    
    btnpositionAnim=()=>{
        Animated.timing(this.state.btnposition, {
            toValue: 1, //TO
            duration: 600,
            delay:400,
        }).start()
    }
    opacityAnim=()=>{
        Animated.timing(this.state.opacity, {
            toValue: 1, //TO
            duration: 700,
            delay: 500,
        }).start()
    }

    positionAnim=()=>{
        Animated.timing(this.state.position, {
            toValue: 1, //TO
            duration: 600,
            delay:400,
            useNativeDriver: true,
        }).start()
    }

    onLoginPress = () =>{
        const {username, password} = this.state;
        if(!(username==='') || !(password==='')){
            try{
                //turn on the Login ActivityIndicator
                this.setState({isLoading: true});
                //Authenticates user with hard coded credentials
                Authentication.userLogin(username, password, () => {
                    //Import API data for all projects
                    DatabaseManagementModule.importApiData([1,2,3,4,5,6], () => {
                        console.log("All Api data imported");
                        MediaHandler.init(() => { });
                        this.props.navigation.navigate('Main');
                    });
                });

                
            }catch (err){
                console.log('error: ', err);
            }
        }else{
            alert('Please fill empty fields');
        }
    }

    render(){
        const {opacity, position, btnposition, username, password, isLoading} = this.state;
        const logoTransition = position.interpolate({
            inputRange: [0, 1], // 0 to 1 
            outputRange: [200, 0], // at 0 => position 50, and at 1 => position 0
        });
        const btnTransition = btnposition.interpolate({
            inputRange: [0, 1], // 0 to 1 
            outputRange: [200, -100], 
        });
        return (
            <View style={{flex: 1, backgroundColor: images.logoBg}}>
                <Animated.View style={{flex:1, transform: [{
                    translateY: logoTransition,
                }]}}>
                    <View style={{flex: 1, alignSelf: "center", justifyContent: "center"}}>
                        <OnboardingLogo imageStyle={{height: 250 ,width:250}} />
                    </View>
                </Animated.View>

                <Animated.View style={{flex: 0.9, alignSelf:'center', justifyContent:'center', width: '100%', opacity, transform: [{
                    translateY: btnTransition,
                }]}}>
                   <InputBox type="user" onChange={(txt)=>this.setState({username: txt})} value={username}>Username....</InputBox>
                   <InputBox type="pass" onChange={(txt)=>this.setState({password: txt})} value={password}>password....</InputBox>
                   {isLoading? <ActivityIndicator size="large" color="orange"/>:<LoginButton onPress={this.onLoginPress}>Login</LoginButton>}
                </Animated.View>
            </View>
        )
    }
}

export default Welcome;