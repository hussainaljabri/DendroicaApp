import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform, TextInput, ActivityIndicator, Dimensions, Modal} from 'react-native';
import {Select, Option} from "react-native-chooser";
import DatabaseModule from "../DB/DatabaseModule";

var {height, width} = Dimensions.get('window');

const allowedLength = 20;
export default class SaveAlert extends Component{
    state ={
        tab: 1, /* tab 1-> existing lists, tab 2-> new list */
        textInputValue: '', // holds the text input in 'Create New List'
        value: "Select a List",  // this is for chooser (Select/Option)
        customLists: [], // holds current lists from DB.
        customListsReady: false, // controls rendering of the choser(Select/Option)
        selectedListId: null, // holds the selected list from the choser.
    }
    componentDidMount(){
        DatabaseModule.getLists({
            success: (result)=>{
                this.setState({
                    customLists: result,
                    customListsReady: true,
                })
                
            }
        });
    }

    onSelect(value, label) {
        console.log(' selected: '+ value._id);
        this.setState({value : value.name, selectedListId: value._id});
      }
    passData = () =>{
        /* Validate data before passing */
        if(this.state.tab == 1){
            this.props.confirm(this.state.selectedListId);
        }else{
            // create list, and send back its id.
            DatabaseModule.createCustomList(
                this.state.textInputValue,
                {
                    success: (id)=>{
                        console.log('Added: '+ this.state.textInputValue + " id: "+ id);
                        this.props.confirm(id);
                    }
                }
            );
        }
    }

    getListsOptions=()=>{
        if(this.state.customListsReady){
                return (
                    <Select
                    animationType="fade"
                    onSelect = {this.onSelect.bind(this)}
                    defaultText  = {this.state.value}
                    style = {styles.select}
                    textStyle = {{}}
                    transparent={true}
                    backdropStyle  = {{backgroundColor : "#00000088"}}
                    optionListStyle = {{backgroundColor : "#F5FCFF", height: '20%'}}
                >
                    
                    {this.state.customLists.map((item, index)=>{
                        return <Option style={{borderBottomWidth: 1, borderBottomColor: 'black'}} children key={index} value={item}>{item.name}</Option> 
                    })}
                </Select>
                );
        }else{
            (
                <Text>
                    You don't have any list, Create new one.
                </Text>
            )
        }
    }
    render(){
        return (
            <Modal 
            visible={this.props.displayAlert} 
            onRequestClose={this.props.cancel}
            transparent={true} 
            animationType={"fade"} >  
                <View style={styles.mainOuterComponent}>
                    <View style={styles.mainContainer}>
                        <View style={styles.topPart}>
                            <Text style={styles.alertTitleTextStyle}>
                                Add selected birds to..
                            </Text>
                        </View>

                        <View style={styles.middlePart}>
                            <View style={{flexDirection:'row', justifyContent: "center"}}>
                                {/* Existing List*/}
                                <TouchableOpacity style={[{borderBottomStartRadius: 10,backgroundColor: this.state.tab==1? 'green': '#b0b0b0'}, styles.tabButton]} onPress={()=> this.setState({tab: 1})}>
                                    <Text style={styles.alertMessageTextStyle}>
                                        Existing List
                                    </Text>
                                </TouchableOpacity>
                                {/* New List */}
                                <TouchableOpacity style={[{borderBottomEndRadius: 10,backgroundColor: this.state.tab==2? 'green': '#b0b0b0'}, styles.tabButton]} onPress={()=> this.setState({tab: 2})}>
                                    <Text style={styles.alertMessageTextStyle}>
                                        New List
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                            {this.state.tab == 1? 
                            /* Get Existing Lists Selection */
                                (<View style={{paddingHorizontal: '20%', paddingVertical: 15,}}>
                                    {this.getListsOptions()}
                                </View>)
                            :
                            /* OR Get New List Name TextInput */
                                (<View style={{paddingHorizontal: '20%', paddingVertical: 15}}>
                                    <TextInput
                                        placeholder="Enter new list name.."
                                        style={styles.textInput}
                                        onChangeText={text => this.setState({textInputValue: text})}
                                        value={this.state.textInputValue}
                                        editable
                                        maxLength={allowedLength}
                                    />    
                                </View>)
                            }

                            {this.props.loading && (
                               <View>
                                   <ActivityIndicator size="large" color="orange"/>
                                    <Text>Adding birds to {this.state.value}</Text>
                               </View>
                            )}
                        </View>

                        <View style={styles.bottomPart}>

                                <TouchableOpacity onPress={() => this.passData()} style={styles.alertMessageButtonStyle}>
                                    <Text style={styles.alertMessageTextStyle}> Confirm </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.props.cancel} style={styles.alertMessageButtonStyle}>
                                    <Text style={styles.alertMessageTextStyle}> Cancel </Text>
                                </TouchableOpacity>
                            
                        </View>
                    </View>
                </View>
            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    textInput:{
        marginTop:15,
        height: 40, 
        paddingHorizontal: 5,
        borderColor: 'gray', 
        borderWidth: 1, 
        justifyContent: "center",
    },
    select:{
        marginTop:15,
        height: 40,
        width: '100%', 
        justifyContent: "center",
        paddingHorizontal: 5,
        borderWidth : 1,
        borderColor : "green",
    }, 
    tabButton:{
        paddingVertical: 10,
        paddingHorizontal: 25,
    },
    alertMessageTextStyle: {
        fontSize: 14,
        fontWeight: "bold",
        color: '#FFFFFF',
    },
    alertMessageButtonStyle: {
        paddingHorizontal: 6,
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: '#80BFFF',
        justifyContent: 'center',
    },
    mainOuterComponent: {
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088',
    },
    alertTitleTextStyle:{
        flex: 1,
        textAlign: "center",
        color: 'black',
        fontSize: 18,
        fontWeight: "bold",
        padding: 2,
        marginHorizontal: 2
    },
    mainContainer:{
        flexDirection: 'column',
        height: '35%',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 3,
        padding: 4,
    },
    topPart:{
        flex: 0.5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingHorizontal: 2,
        paddingVertical: 4,
    },
    middlePart:{
        flex: 1,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingHorizontal: 4,
        paddingBottom: 4,
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 2,
    },
    bottomPart:{
        flex: 0.5,
        width: '100%',
        flexDirection: 'row',
        padding: 4,
        justifyContent: 'space-evenly',
    }
});

