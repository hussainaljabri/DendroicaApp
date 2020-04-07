import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Icon} from 'react-native-elements';
import DatabaseModule from '../DB/DatabaseModule';
import Slider from '../components/Slider';
import styles from '../styles/Quiz.style';

const prefix='https://natureinstruct.org';

const totalOptions = 4;

export default class Quiz extends Component{
    state ={
        data: [],
        seenBirds: [],
        dataReady: false,
        quizNumber: 1,
        score:0,
        topBtnStatus:[true, false],
        activeSlide: 0,
        optionslist: [],
        optionsReady: false,
        answerIndex: null,
        isAnswered: false,
        answerImages: [],
        answerImagesReady: false,
        isPressed: false,
        selectedIndex: undefined,
        total: undefined,
    }
    static navigationOptions = {
        header: null
    }

    componentWillMount(){
        let tempData = this.props.navigation.getParam('data', []);
        this.setState({
            data: tempData,
            dataReady: true,
            total: tempData.length,
        });

        this._generateOptions(tempData);
    }

    _shuffleArray=(array)=>{
        let i = array.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    _generateOptions=(data)=>{
        //first loop is to get a Unique answer.
        let RandomAnswerIndex;
        let temp =[];
        for(let i=0;;i++){
            RandomAnswerIndex = this._genRandom(data.length,0);
            let result = this.state.seenBirds.find(item =>{return (item.bird_id === data[RandomAnswerIndex].bird_id)})
            if(result == undefined){
                temp.push(data[RandomAnswerIndex]);
                // call for its images.
                DatabaseModule.getImageUrlsByBirdId(data[RandomAnswerIndex].bird_id,{
                    success:(result)=>{
                        let images = [];
                        result.map((item, index)=>{
                            //images

                            images.push(prefix+item.image_filename);

                        });

                        this.setState({
                            answerImages: result,
                            answerImagesReady: true,
                        });
                    }
                });
                break;
            }
        }
        // now we have valid un-seen bird.
        // we need to generate options including this found bird. so totalOptions-1
        
        for(let j=0;;j++){
            let rand = this._genRandom(data.length, 0);
            let alreadyChosenResult = temp.find(item=>{return (item === data[rand])});
            let isAnswerResult = (data[RandomAnswerIndex].bird_id === data[rand].bird_id);

            if(!isAnswerResult && alreadyChosenResult == undefined){
                temp.push(data[rand]);
            }
            if(temp.length == totalOptions ){
                break;
            }
        }
        
        // shuffle the array.
        temp = this._shuffleArray(temp);
        // find answer new index in optionlist
        let newAnswerIndex = temp.indexOf(data[RandomAnswerIndex]);
        this.setState({
            optionslist: temp,
            optionsReady: true,
            answerIndex: newAnswerIndex,
        });


    }

    _genRandom=(max, min)=>{
        return Math.floor(Math.random()*max)+min;
    }
    toggleTopBtn=(index)=>{
        if(index == 0){
            this.setState({
                topBtnStatus: [true, false],
            });
        }else if(index == 1){
            this.setState({
                topBtnStatus: [false, true],
            });
        }else{

        }
    }
    _renderItem =({item, index})=>{
        return (
               <TouchableOpacity key={'TH'+index} onPress={this._handleModalButton} style={styles.slideInnerContainer} activeOpacity={1}>
                <View key={'VW'+index} style={styles.imageContainer}>
                    <Image key={'IM'+index} style={styles.image} source={{uri: prefix+item.image_filename}} />
                </View>
                </TouchableOpacity>
            );
    }
    getCarousel=()=>{
        if(this.state.dataReady && this.state.answerImagesReady){
            var chosenBird = this.state.answerImages; // if we got vocalization working then here make them {images: , voice: }
            
            return (
                <Slider 
                    data={chosenBird}
                    renderItem={this._renderItem}
                />
                
            );
        }
    }

    /**
     * @TODO Validation
     */

    nextHandler=(lastQuest)=>{
        if(this.state.isPressed){
            if(!(lastQuest)){
                let tempData = this.state.data; //seenBirds;
                let seenBird = this.state.seenBirds;
                let bird = this.state.optionslist[this.state.answerIndex];
                seenBird.push(bird);
                // data - that awnsered one.
                // increment question#
                // increment Score if chosen correct. if selectedIndex == answerIndex, answer selected.
                // re-populate the screen with new bird.
                // re-generate options
                this._generateOptions(tempData); 
                this.setState({
                    answerImagesReady: false,
                    activeSlide: 0,
                    data: tempData,
                    seenBirds: seenBird,
                    isPressed: false,
                    score: this.state.answerIndex == this.state.selectedIndex? this.state.score+1: (this.state.score == 0? 0:this.state.score-1),
                    quizNumber: this.state.quizNumber+1,
                });
            }else{
                this.props.navigation.goBack();
            }
            
        }else{
            Alert.alert('Select an answer');
        }
    }


    formQuiz=()=>{
        if(this.state.dataReady){
            if(this.state.topBtnStatus[0] && !this.state.topBtnStatus[1]){
                return(
                    <View>
                        {this.state.answerImagesReady?
                        (this.getCarousel())
                        :
                        (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="red"/>
                            <Text>Loading</Text>
                        </View>
                        )}
                        <Text style={styles.questionText}>What is the name of this bird?</Text>
                        
                        <ScrollView style={styles.optionsScroll}>
                            {this.state.optionslist.map((item, index)=>{
                                return(
                                <TouchableOpacity disabled={this.state.isPressed} onPress={()=> this.setState({isPressed: true, selectedIndex: index})} style={styles.optionsButton} key={'btn-'+index}>
                                    {this.state.isPressed && (<Icon name={this.state.answerIndex == index? 'check':'times'} type='font-awesome'  color={this.state.answerIndex == index? 'green': 'red'}/>)}
                                    <Text key={'txt-'+index} style={[styles.optionsButtonText,{color: this.state.isPressed? (this.state.answerIndex==index?'green':(this.state.selectedIndex==index?'red':'black')) :'black'}]}>{item.name}</Text>
                                </TouchableOpacity>);
                            })}
                        </ScrollView>
                    </View>
                );
            }else if(!this.state.topBtnStatus[0] && this.state.topBtnStatus[1]){
                return (
                    <View>
                        <Text>This is a Sound Quiz</Text>
                    </View>
                );
            }

                
            
        }
        
    }
    render() {

        return (
            <View style={styles.container}>
                {/** Custom Header Starts */}
                <View style={styles.statusBar}/>
                <View>
                    <View style={styles.header}>

                        <TouchableOpacity style={styles.goBackBtn} onPress={()=> this.props.navigation.goBack()}>
                            <Icon 
                                name='chevron-left'
                                type='font-awesome'
                                color='red'
                                size={20}
                            />
                        </TouchableOpacity>

                        <Text style={styles.headerText}>Quiz |</Text>
                        <Text style={styles.headerTitle}>Question # {this.state.quizNumber} / {this.state.total} </Text>
                    </View>
                    <View style={styles.belowHeaderContainer}>
                        <Text style={styles.scoretxt}>Species: {this.state.data.length}</Text>
                        <Text style={styles.scoretxt}>Score: {this.state.score} </Text>
                    </View>
                </View>
                {/** Custom Header Ends */}
                <View style={styles.topTextContainer}>
                    <Text style={{opacity: 0.8}}>Modes: </Text>
                    <TouchableOpacity style={this.state.topBtnStatus[0]==true? styles.topBtnActive:styles.topBtnInactive} onPress={()=> this.toggleTopBtn(0)}>
                        <Icon 
                            name='image'
                            type='font-awesome'
                            color= {this.state.topBtnStatus[0]==true? 'red': 'gray'}
                            size={20}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={this.state.topBtnStatus[1]==true? styles.topBtnActive:styles.topBtnInactive} onPress={()=> this.toggleTopBtn(1)}>
                        <Icon 
                            name='music'
                            type='font-awesome'
                            color= {this.state.topBtnStatus[1]==true? 'red': 'gray'}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>

                {this.formQuiz()}

                <TouchableOpacity disabled={!this.state.isPressed} style={[styles.nextBtn, {borderColor: this.state.isPressed? 'red': 'grey'}]} onPress={()=> this.nextHandler(this.state.total==this.state.quizNumber) }>
        <Text style={[styles.nextBtnText, {color: this.state.isPressed? 'red': 'grey'}]}>{this.state.total==this.state.quizNumber? "Finish": "Next Qustion"}</Text>
                </TouchableOpacity>

            </View>
        );


    }
    
}
