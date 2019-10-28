import React, {Component} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QuizScreen from './QuizScreen';






   /**
     * Quiz Screen Components.
     */
export default class QuizMenu extends Component{
    state = {
        quizSettings: {
            chosenList: null,
            chosenLanguage: null,
            repeatAllowed: true,

        },
        listNames: [],
        listLanguages: [],

    }

    handlePress=(k)=>{
        this.nextRoute.passProps.settings = k;
        this.props.navigation.navigate('Quiz',{
            settings: k,
        })
    }
    nextRoute = {
        component: QuizScreen,
        title: 'Quiz',
        passProps: { settings: this.state.quizSettings }
    };

    test=()=>{
        console.log("hi");
        
    }

    render() {

        return (
            <LinearGradient
            colors={['#3BBED7', '#30DACC', '#2EECCA']}
            start={[0.1, 0.1]}
            // end={[1, 1]}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                paddingTop: 35,
                height:'100%',
            }}
            >
            <View style={styles.container}>
            

                <TouchableOpacity
                    style={styles.btn}
                    onPress={()=> this.handlePress('2')}
                >
                    <Text style={styles.btnTitle}>Start Quiz ></Text>
                </TouchableOpacity>

            </View>
            </LinearGradient>

        );


    }


}



const styles = StyleSheet.create({
    
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    btn:{
        margin: 2,
        width: "70%",
        backgroundColor: 'orange', //rgba(123, 120, 100, 1)
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    btnTitle:{
        fontWeight: "700",
        letterSpacing: 4,
    },
                                        
  });
  