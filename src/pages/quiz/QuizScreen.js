import React, {Component} from 'react';
import { View, Text, ActivityIndicator,ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Options from './Options';
import Question from './Question';

   
const Birds = [ // TEMPporary.
    {id: 1, name: 'Golden Eagle', image: require('../../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), sound:""},
    {id: 2, name: 'American Golden-Plover', image:require('../../../assets/Birdimages/MP-1669-Pluvialis_dominica.jpg'), sound:""},
    {id: 3, name: 'Common Ringed Plover', image:require('../../../assets/Birdimages/76165-Charadrius_hiaticula_AOU_7_52.jpg'), sound:""},
    {id: 4, name: 'Semipalmated Plover', image:require('../../../assets/Birdimages/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg'), sound:""},
    {id: 5, name: 'Spotted Sandpiper', image:require('../../../assets/Birdimages/72902-Actitis_macularius_AOU_7_52.jpg'), sound:""},
    {id: 6, name: 'Surfbird', image:require('../../../assets/Birdimages/RH-1442-Aphriza_virgata.jpg'), sound:""},
    {id: 7, name: 'Black-throated Green Warbler', image:require('../../../assets/Birdimages/CMF-9382-Dendroica_virens.jpg'), sound:""},
    {id: 8, name: 'Gray-crowned Rosy-Finch', image:require('../../../assets/Birdimages/LM-9260-Leucosticte_tephrocotis.jpg'), sound:""},
    {id: 9, name: 'Merlin', image:require('../../../assets/Birdimages/TB2-119938-Falco_columbarius_AOU_7_52.jpg'), sound:""},
    {id: 10, name: 'Eurasian Collared-Dove', image:require('../../../assets/Birdimages/87129-Streptopelia_decaocto_AOU_7_52.jpg'), sound:""},
    {id: 11, name: 'Rufous Hummingbird', image:require('../../../assets/Birdimages/TB2-14343-Selasphorus_rufus.jpg'), sound:""},
    {id: 12, name: 'Western Tanager', image:require('../../../assets/Birdimages/LM-9392-Piranga_ludoviciana.jpg'), sound:""},
    
    {id: 13, name: 'Belted Kingfisher', image:require('../../../assets/Birdimages/usa/76042-Megaceryle_alcyon_AOU_7_52.jpg'), sound:""},
    {id: 14, name: 'King Rail', image:require('../../../assets/Birdimages/usa/85699-Rallus_elegans_AOU_7_52.jpg'), sound:""},
    {id: 15, name: 'Atlantic Puffin', image:require('../../../assets/Birdimages/usa/JR-2122-Fratercula_arctica.jpg'), sound:""},
    {id: 16, name: 'Acorn Woodpecker', image:require('../../../assets/Birdimages/usa/KB3-120281-Melanerpes_formicivorus_AOU_7_52.jpg'), sound:""},
    {id: 17, name: "Chuck-will's-widow", image:require('../../../assets/Birdimages/usa/TB-7827-Caprimulgus_carolinensis.jpg'), sound:""},
    {id: 18, name: 'Loggerhead Shrike', image:require('../../../assets/Birdimages/usa/81029-Lanius_ludovicianus_AOU_7_52.jpg'), sound:""},

]
const ListMaxLength = 18;
const OptionsLength = 4;

   /**
     * Quiz Screen Components.
     */
export default class QuizScreen extends Component{
    state = {
        dataReady: false, // Controls Main Quiz Content, if false? show ActivityIndicator, if true? show Quiz Content (Question, Options)
        counter: 0, // total Quiz count.
        score: 0, // total Solved Quiz count.
        optionsList: [],
        quizNumber: 1,
        wrong: 0,
        helperToggle: false,
        isAnswered: false,
    }

    static navigationOptions= ({navigation})=>{
        return {
            title: 'Quiz',
            headerStyle:{
                backgroundColor: '#f4511e',
            },
            headerTitleStyle:{
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1,
            },
            headerRight: (<View></View>),
            headerLeft: (<View></View>)
        }
    };
    




    componentDidMount(){

        const {navigation} = this.props;
        let quizSettings = navigation.getParam('settings', '-1'); // where -1 is the default value if there's no Props found to prompt error and navigate back.
        console.log('quiz settings: '+quizSettings); 

    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextState.isAnswered != this.state.isAnswered){
            nextState.isAnswered = false;
            return true;
        }else{
            
            return false;
        }
        
    }


    pickOptions=()=>{
        let tempBirds = [];
        for(let i=0;; i++){
            let randomNum = Math.floor(Math.random() * ListMaxLength) + 1
            let result = tempBirds.find(item => {return (item.id === randomNum)});
            // console.log('Condition: '+ result == undefined);
            if(result == undefined){
                // nothing in there similar
                // so we add it to birds, and 
                let newbird = Birds.find(item => item.id === randomNum);
                tempBirds.push(newbird);
                console.log('Added: ' + Object.values(newbird));
            }
            // console.log('TempBirds length: ' + tempBirds.length);
            if(tempBirds.length == OptionsLength){
                console.log("QuizScreen.js L105: " + ' '+ Object.values(tempBirds[0])  + ' ' + Object.values(tempBirds[1]) + ' '+ Object.values(tempBirds[2]) + ' '+ Object.values(tempBirds[3]) );
                break;
            }


        }

        return tempBirds;
    }

    validateResult = (result) =>{
        if(result){
            // true => right ans.
            console.log('Correct ANS');
            this.setState({
                score: this.state.score+1,
                quizNumber: this.state.quizNumber+1,
                isAnswered: true,
                wrong: 0,
            });
            
        }
        else{
            // false => wrong ans.
            console.log('WRONG ANS');
            this.setState({
                wrong: this.state.wrong+1,
            });
            console.log("wrong: "+ this.state.wrong);
            
            
        }
    }
/**
 * Helpers Buttons Handler Functions --------------------------------------------------
 */
    halfHandler=()=>{

    }
    skipHandler=()=>{

    }
    soundHandler=()=>{

    }

    getHelpers=()=>{
        return (
            <View style={styles.helpersContainer}>
            <TouchableOpacity  onPress={()=> this.halfHandler()} style={[styles.box, {justifyContent: "center",}]}>
                <Text style={{textAlign: "center", color: 'white' }}>50%</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=> this.skipHandler()} style={[styles.box, {justifyContent: "center",}]}>
                <Text style={{textAlign: "center", color: 'white' }}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=> this.soundHandler()} style={[styles.box, {justifyContent: "center",}]}>
                <Text style={{textAlign: "center", color: 'white' }}>Sound</Text>
            </TouchableOpacity>
            </View>
        );
    }

    formQuiz=()=>{
        
        let selectedBirds = this.pickOptions();
        let randomAns = Math.floor(Math.random() * selectedBirds.length)+ 0;
        console.log('QuizScreen.js L172: Selected Answer: Option ' + (randomAns+1));
        return (
            <View>
                <Question type="image" bird={selectedBirds[randomAns]}/>
                {this.getHelpers()}
                <Options
                    optionsList={selectedBirds}
                    answeredIndex = {randomAns}
                    type = 'image'
                    callback = {(result) => this.validateResult(result)}
                />
            </View>
        );

    }
    render() {

        return (
            <ScrollView style={styles.container}>
                <View style={styles.topTextContainer}>
                    <Text style={styles.scoretxt}>Question #{this.state.quizNumber} </Text>
                    <Text style={styles.scoretxt}>Score: {this.state.score} </Text>
                    
                </View>
                {this.formQuiz()}
            </ScrollView>
        );


    }


}



const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    topTextContainer:{
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        flexDirection: 'row',
        
    },
    scoretxt:{
        fontWeight: "700",
    },
    helpersContainer:{
        paddingTop: 10,
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
});