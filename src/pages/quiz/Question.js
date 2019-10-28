import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
const win = Dimensions.get('window');



export default class Question extends Component{

    state={
        birdInfo: [],
    }
    componentDidMount(){
        this.setState({
            birdInfo: this.props.bird,
        });
    }


    typeHandler=(options, ansIndex)=>{
        let _type = this.props.type;
        console.log('ansIndex: '+ ansIndex);
        if(_type === 'image'){
            return (
                options.map((opt, index)=>{
                    if(index == ansIndex){
                        return (<Image key={index} source={opt.image} style={styles.image}/>);
                    }                    
                })
            );
        }else if(_type === 'sound'){
            return (
                <Text>This suppose to be Sound</Text>
            );
        }else{
            console.log("Question.js: typeHandler couldn't specify question type. found: " + _type);
        }
    }
    typeHandler=()=>{
        let _type = this.props.type;
        if(_type === 'image'){
            return (
                    <Image source={this.props.bird.image} style={styles.image}/>
            );
        }else if(_type === 'sound'){
            return (
                <Text>This suppose to be Sound</Text>
            );
        }else{
            console.log("Question.js: typeHandler couldn't specify question type. found: " + _type);
        }
    }


    render(){


        return (
            <View style={styles.container}>
                {this.typeHandler()}
            </View>
        );

    }



}


const styles = StyleSheet.create({
    
    container:{
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    image:{
        resizeMode: "contain",
        flex: 1,
        alignSelf: "center",
        height: 250,


    },
});