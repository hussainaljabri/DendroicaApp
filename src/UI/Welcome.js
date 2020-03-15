import React, {Component} from 'react';
import OnboardingLogo from '../commons/OnboardingLogo';
import {TextInput, TouchableOpacity, Alert, Animated, Image, View, Text, ActivityIndicator } from 'react-native';
import { images } from '../constants/images';
import Authentication from "../DB/Authentication";
import DatabaseManagementModule from "../DB/DatabaseManagementModule";
import MediaHandler from "../DB/MediaHandler";


const LoginButton = ({children, onPress}) =>(
    <TouchableOpacity onPress={onPress}>
        <View 
        style={{
            marginBottom: 5,
            flexDirection: 'row',
            backgroundColor: `darkgray`,
            marginHorizontal: '10%',
            justifyContent:"center",
            alignItems: 'center',
            padding: 15,
            borderRadius: 5
        }}>
{/* <Image style={{height:20,width:20}} source={images.gmail} /> */}
            {/* <View style={{marginRight: 5}} >
                <View style={{ height: 32, width: 32, backgroundColor: 'white', radius: 5, justifyContent: 'center' ,position: 'relative'}}>
                    
                    <Text>Logo</Text>
                </View>
            </View> */}
            
            <View>
                <Text style={{fontSize: 12, color: 'white', fontWeight: '600', letterSpacing:2}}>
                    {children}
                </Text>
            </View>
            
        </View>
    </TouchableOpacity>
);

const InputBox = ({children, onChange, value, type}) =>(
    <View 
    style={{
        marginBottom: 5,
        flexDirection: 'row',
        backgroundColor: `darkgray`,
        marginHorizontal: '10%',
        justifyContent:"center",
        alignItems: 'center',
        padding: 15,
        borderRadius: 5
    }}>
        <View style={{width:'100%'}}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', color:"whitesmoke", borderWidth: 1, paddingHorizontal: 5}}
                onChangeText={text => onChange(text)}
                value={value}
                placeholder={children}
                placeholderTextColor='whitesmoke'
                underlineColorAndroid="transparent"
                secureTextEntry={type==='pass'? true: false}
            />
        </View>
        {/* <View>
            <Text style={{fontSize: 12, color: 'white', fontWeight: '600', letterSpacing:2}}>
                {children}
            </Text>
        </View> */}
        
    </View>
);


class Welcome extends Component{
    state = {
        opacity: new Animated.Value(0),
        position: new Animated.Value(0),
        btnposition: new Animated.Value(0),
        username: '',
        password: '',
        isLoading: false,
    }

    componentWillMount(){
        Authentication.getNewToken({
            success:()=> this.props.navigation.navigate('Main')
        });
    }

    componentDidMount(){
        Animated.parallel([this.positionAnim(), this.opacityAnim(), this.btnpositionAnim()]).start(); // to start both animations at same time
        // this.opacityAnim();
        // this.positionAnim();
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
        console.log('username: ', username, ' password', password);
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