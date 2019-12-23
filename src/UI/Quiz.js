import React, {Component} from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert} from 'react-native';
import Constants from 'expo-constants';
import {Icon} from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';




const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}
const IS_IOS = Platform.OS === 'ios';
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 10;
const colors = {
    black: '#1a1917',
    green: 'green',
    red: 'red',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};
const entryBorderRadius = 8;
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
        isPressed: false,
        selectedIndex: undefined,
        total: undefined,
    }
    static navigationOptions = {
        header: null
    }

    componentDidMount(){
        let tempData = this.props.navigation.getParam('data', []);
        this.setState({
            data: tempData,
            dataReady: true,
            total: tempData.length,
        });
        console.log('data: '+ tempData[1].name + ' imageUrl:'+ tempData[1].image[0]);

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
            let result = this.state.seenBirds.find(item =>{return (item.id === data[RandomAnswerIndex].id)})
            if(result == undefined){
                temp.push(data[RandomAnswerIndex]);
                break;
            }
        }
        // now we have valid un-seen bird.
        // we need to generate options including this found bird. so totalOptions-1
        
        for(let j=0;;j++){
            let rand = this._genRandom(data.length, 0);
            let alreadyChosenResult = temp.find(item=>{return (item === data[rand])});
            let isAnswerResult = (data[RandomAnswerIndex].id === data[rand].id);

            if(!isAnswerResult && alreadyChosenResult == undefined){
                temp.push(data[rand]);
                console.log('Added index: '+ rand + " value: "+ data[rand].name);
            }
            if(temp.length == totalOptions ){
                break;
            }
        }
        
        // shuffle the array.
        temp = this._shuffleArray(temp);
        console.log('temp length:------- ['+temp.length+']');
        // find answer new index in optionlist
        let newAnswerIndex = temp.indexOf(data[RandomAnswerIndex]);
        console.log('Answer index: '+ newAnswerIndex + ' value: '+ temp[newAnswerIndex].name);
        this.setState({
            optionslist: temp,
            optionsReady: true,
            answerIndex: newAnswerIndex,
        });
        console.log('optlist: '+ temp + ' answerIndex: '+ newAnswerIndex);

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
            console.log('toggleTopBtn');
        }
    }
    _renderItem =({item, index})=>{
        // console.log(item);
        const even = (index + 1) % 2 === 0;
        // console.log(even);
        return (
               <TouchableOpacity key={'TH'+index} onPress={this._handleModalButton} style={styles.slideInnerContainer} activeOpacity={1}>
                <View key={'VW'+index} style={styles.imageContainer}>
                    <Image key={'IM'+index} style={styles.image} source={item} />
                </View>
                </TouchableOpacity>
    
    
            );
    }
    getCarousel=()=>{
        if(this.state.dataReady){
            var chosenBird = this.state.optionslist[this.state.answerIndex];
            console.log('chosen bird: ' + chosenBird.name);
            return (
                <View>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={chosenBird.image}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={this.state.activeSlide}
                        hasParallaxImages={true}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        scrollEnabled={ this.state.scrollable }
                        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                    />
                    <Pagination 
                        dotsLength={chosenBird.image.length}
                        activeDotIndex={this.state.activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'black'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider1Ref}
                        tappableDots={!!this._slider1Ref}
                    />
            </View>
            );
        }
    }

    /**
     * @TODO Validation and Next Question button handler.
     */
    nextHandler=(lastQuest)=>{
        console.log('selectedIndex: '+ this.state.selectedIndex);
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
                    data: tempData,
                    seenBirds: seenBird,
                    isPressed: false,
                    score: this.state.answerIndex == this.state.selectedIndex? this.state.score+1: this.state.score-1,
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
            console.log('Render Quiz');
            if(this.state.topBtnStatus[0] && !this.state.topBtnStatus[1]){
                return(
                    <View>
                        {this.getCarousel()}
                        <Text style={{fontWeight:'600', paddingHorizontal: 5,}}>What is the name of this bird?</Text>
                        
                        <ScrollView style={styles.optionsScroll}>
                            {this.state.optionslist.map((item, index)=>{
                                return(
                                <TouchableOpacity disabled={this.state.isPressed} onPress={()=> this.setState({isPressed: true, selectedIndex: index})} style={{flexDirection:'row' ,padding: 10}} key={'btn-'+index}>
                                    {this.state.isPressed && (<Icon name={this.state.answerIndex == index? 'check':'times'} type='font-awesome'  color={this.state.answerIndex == index? 'green': 'red'}/>)}
                                    <Text key={'txt-'+index} style={{marginHorizontal:15, color: this.state.isPressed? (this.state.answerIndex==index?'green':(this.state.selectedIndex==index?'red':'black')) :'black'}}>{item.name}</Text>
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
                    <View style={{flexDirection: "row", padding: 10}}>

                        <TouchableOpacity style={{paddingHorizontal: 10, justifyContent: "center"}} onPress={()=> this.props.navigation.goBack()}>
                            <Icon 
                                name='chevron-left'
                                type='font-awesome'
                                color='red'
                                size={20}
                            />
                        </TouchableOpacity>

                        <Text style={styles.header}>Quiz |</Text>
                        <Text style={[styles.header, {textAlign:"center", color: 'black', opacity: 0.6}]}>Question # {this.state.quizNumber} / {this.state.total} </Text>
                    </View>
                    <View style={{padding:10, flexDirection: 'row', justifyContent:'space-between'}}>
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
        <Text style={{color: this.state.isPressed? 'red': 'grey', justifyContent:"center", textAlign: "center"}}>{this.state.total==this.state.quizNumber? "Finish :)": "Next Qustion"}</Text>
                </TouchableOpacity>

            </View>
        );


    }
    
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:"white", 
        marginLeft: 5, 
        marginRight: 5,
        flex:1
    },
    statusBar:{
        height: Constants.statusBarHeight,
    },
    optionsScroll:{
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    nextBtn:{
        marginHorizontal: wp(30),
        marginVertical: 10,
        paddingVertical:5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    topBtn:{
        marginHorizontal: 5,
        paddingVertical:5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'red',
    },
    topBtnInactive:{
        marginHorizontal: 5,
        paddingVertical:5,
        paddingHorizontal: 10,
        alignContent: "center",
        justifyContent: "center",
        textAlignVertical: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    header:{
        
        paddingLeft: 15, 
        paddingRight: 15,
        fontWeight: "700",
        color: "red",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
    },
    topTextContainer:{
        alignItems: "center",
        // justifyContent: "space-evenly",
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
    slider: {
        flexGrow: 0,
        marginTop: 5, // 15
        overflow: 'visible' // for custom animations
    },    
    sliderContentContainer: {
        paddingVertical: 0, // for custom animation
        height: slideHeight,
    },
    paginationContainer: {
        paddingTop: 5,
        paddingBottom: 20,
    },
    paginationDot: {
        width: 6,
        height: 6,
        borderRadius: 7,
        marginHorizontal: 4
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 5 //18 needed for shadow
        
    },
    imageContainer: {
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
});