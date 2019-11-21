import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform, TextInput, Switch} from "react-native";
import Constants from 'expo-constants';
import ActionSheet from 'react-native-actionsheet';
import {Icon} from 'react-native-elements';
const lists =[
    'Cancel',
    'List1',
    'List2',
    'List3',
    'List4',
    'List5',
];
export default class Settings extends Component {
    state = {
        rateSelect: true,
        migrationSelect: true,
        selected: 1,
    }
    toggleRate = (value) => {
        this.setState({rateSelect: value})
        console.log('toggleRate is: ' + value)
    }
    toggleMigration = (value) => {
    this.setState({migrationSelect: value})
    console.log('toggleMigration is: ' + value)
    }
    showActionSheet = () => {
        this.ActionSheet.show();
    };
    render(){
        return (
            <View style={{backgroundColor:"white", marginLeft: 5, marginRight: 5, paddingTop: 10, paddingBottom:10}}>
                <View style={styles.statusBar}/>
                <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10,}}>
                    <Text style={styles.header}>Settings |</Text>
                    <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='save'
                                type='font-awesome'
                                color='purple'
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{margin: 15}}>
                    <Text style={{fontSize: 20, fontWeight:'700', opacity: 0.5, marginBottom:10}}>Region Lists Filter</Text>

                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:'50%', fontSize: 15, fontWeight: '500'}}>Show Rare</Text>
                            <Switch 
                                style={{width:'50%'}}
                                value={this.state.rateSelect}
                                onValueChange={(value) => this.toggleRate(value)}
                            />
                        </View>
                    </View>

                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:'50%', fontSize: 15, fontWeight: '500'}}>Show Migratory Birds</Text>
                            <Switch 
                                style={{width:'50%'}}
                                value={this.state.migrationSelect}
                                onValueChange={(value) => this.toggleMigration(value)}
                            />
                        </View>
                    </View>
                    
                </View>

                <View style={{margin: 15}}>
                    <Text style={{fontSize: 20, fontWeight:'700', opacity: 0.5, marginBottom:10}}>More Options</Text>
                    
                    <View style={{margin:15, flexDirection:'row'}}>
                        <Text style={{ textAlignVertical: "center", fontSize: 15, fontWeight: '500', opacity:0.7,marginHorizontal: 15, }}>Sound download limit</Text>
                        <TextInput underlineColorAndroid='transparent' style={{borderRadius:5, backgroundColor:'#F5F5F5', marginHorizontal: 15, flexGrow:1, paddingHorizontal:10}} placeholder={'Value'} keyboardType={'numeric'} returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                    </View>
                   
                    <View style={{margin:15, flexDirection:'row'}}>
                        <Text style={{ textAlignVertical: "center", fontSize: 15, fontWeight: '500', opacity:0.7,marginHorizontal: 15, }}>Image download limit</Text>
                        <TextInput underlineColorAndroid='transparent' style={{borderRadius:5, backgroundColor:'#F5F5F5', marginHorizontal: 15, flexGrow:1, paddingHorizontal:10}} placeholder={'Value'} keyboardType={'numeric'} returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                   </View>
                    
                    

                    <View style={{flexDirection:'row', margin:15,}}>
                        <Text style={{width:'60%', textAlignVertical: "center", fontSize: 15, fontWeight: '500'}}>Downloaded Lists</Text>
                        <View style={{width: '40%'}}>
                        <Text onPress={this.showActionSheet} style={{fontSize:22, fontWeight:'500', opacity:0.7, justifyContent:'center'}}>{lists[this.state.selected]}</Text>
                            <ActionSheet
                                ref={o => this.ActionSheet = o}
                                title={<Text style={{fontSize: 18, fontWeight:'500', letterSpacing:1}}>Select a List</Text>}
                                cancelButtonIndex={0}
                                destructiveButtonIndex={0}
                                options={lists}
                                onPress={(index) => { /* do something */ 
                                    console.log('actionsheet: '+index+ ' corresponds to :'+ lists[index]);
                                    index != 0? this.setState({selected: index}) : {};
                                }}
                            />
                        </View>
                    </View>


                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    statusBar:{
        height: Constants.statusBarHeight,
     },
     header:{
         
        paddingLeft: 15, 
        paddingRight: 15,
        fontWeight: "700",
        color: "purple",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
       },
});