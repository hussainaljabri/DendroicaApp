import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
// const win = Dimensions.get('window');

   

export default class Options extends Component{
    
    state ={
        optColors: [ // mapped by Index with optionList.
            'orange',
            'orange',
            'orange',
            'orange',
        ],
        selected: -1,
        stateReady: false,
        enableButton: false,
        enableSkip: false,
        enableHalfOptions: false,
        enableSound: false,
        options: [],
        ansIndex: null,
        helper:[
            false,// half
            false,// skip
            false,// sound 
        ],
    }


    // I am sending 2 props to be used by this, which are: answeredIndex, optionList.
    generateOptions = () =>{
        
        // Answer is at optionList[answeredIndex]
        // all options in the list have optionList[answeredIndex].name and .image and .sound
        
        // let _index = answeredIndex;

        // console.log('Options.js: index: '+ this.props.answeredIndex);
        // console.log('Options.js: answer bird name: '+ _options[_index].name);
        // console.log('Options.js STATE: index: '+ this.state.ansIndex);
        // console.log('Options.js STATE: optList: '+ this.state.optionsList);
        // console.log('Answer: '+ _answer);

            let _options = this.props.optionsList; 
            console.log("Options.js L55: _options: "+ Object.values(_options[0])  + ' ' + Object.values(_options[1]) + ' '+ Object.values(_options[2]) + ' '+ Object.values(_options[3]) );
            
            return this.optionsLayout(_options);
        
        

         
    }

    optionsLayout=(options)=>{
            // let _options = [];
            // let _answer = index;
            // _options.push(options[_answer]);
            // for(let i=0;; i++){
            //     _random = Math.floor(Math.random() * 3) + 0;
            //     if(_random != _answer){
            //         console.log('Options L50: _random: '+ _random);
            //         _options.push(options[_random]);
            //         break;
            //     }
            // }
            //     return (
            //         _options.map((opt, i) =>{
            //                 return (
            //                     <TouchableOpacity disabled={this.state.enableButton} style={[styles.btnStyle, {backgroundColor: this.state.optColors[i]}]} key={i} onPress={()=> this.eventHandler(i)}>
            //                         <Text key={i}> {opt.name} </Text>
            //                     </TouchableOpacity>
            //                 );
            //         })
            //     );
            

            return (
                options.map((opt, i) =>{
                    return (
                        <TouchableOpacity disabled={this.state.enableButton} style={[styles.btnStyle, {backgroundColor: this.state.optColors[i], display: this.getEnableDisplay(i)}]} key={i} onPress={()=> this.eventHandler(i)}>
                            <Text key={i}> {opt.name} </Text>
                        </TouchableOpacity>
                    );
                })
            );
        

    }
    getEnableDisplay=(btnIndex)=>{
        return "flex";
    }
// event handler: handles the clicking of an option as chosen answer. index is the selected option index in OptionsList.
    eventHandler=(index)=>{ 
        this.setState({
            enableButton: true,
        });
        let colors = this.state.optColors;
        if(index == this.props.answeredIndex){
            colors[index] = 'green';
            setTimeout(()=>{
                this.resetStates(index);
                this.props.callback(true);
            }, 1000);
            
        }else{
            colors[index] = 'red';
            setTimeout(()=>{
                this.resetStates(index);
                // this.props.callback(false);
            }, 500);
        }
        this.setState({
            optColors: colors,
        });

    }
    resetStates=(index)=>{
        let colors = this.state.optColors;
        colors[index] = 'orange';
        this.setState({
            optColors: colors,
            enableButton: false,
        });
    }

    render() {

        return (
            <View style={styles.container}>

                {this.generateOptions()}
            </View>
        );


    }


}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
      padding: 5,
    },
    helpersContainer:{
        paddingBottom: 10,
        paddingRight: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    box:{
        width: 100,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 15,
    },
    btnStyle:{
        margin: 2,
        width: "100%",
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    Question: {
      // marginBottom: 10,
      // borderWidth: 1,
      // borderRadius: 2,
      // borderColor: '#ddd',
      // borderBottomWidth: 0,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.8,
      // shadowRadius: 2,
      // elevation: 1,
      // marginLeft: 5,
      // marginRight: 5,
      // marginTop: 10,
      // flex: 3
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold'
  
    },
  });