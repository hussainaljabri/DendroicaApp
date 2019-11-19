import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Picker, Switch} from "react-native";
import Constants from 'expo-constants';

export default class Settings extends Component {
    state = {
        rateSelect: true,
        migrationSelect: true,
    }
    toggleRate = (value) => {
        this.setState({rateSelect: value})
        console.log('toggleRate is: ' + value)
    }
    toggleMigration = (value) => {
    this.setState({migrationSelect: value})
    console.log('toggleMigration is: ' + value)
    }
    render(){
        return (
            <View style={{backgroundColor:"white", marginLeft: 5, marginRight: 5, paddingTop: 10, paddingBottom:10}}>
                <View style={styles.statusBar}/>
                <View style={{flexDirection: "row",justifyContent: "space-between", marginBottom: 10,}}>
                    <Text style={styles.header}>Settings |</Text>
                </View>

                <View style={{margin: 15}}>
                    <Text style={{fontSize: 20, fontWeight:'700', opacity: 0.5, marginBottom:10}}>Region Lists Filter</Text>

                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:'50%', fontSize: 15, fontWeight: '500'}}>Show Rate</Text>
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
                    <View style={{flexDirection:'row', margin:15,}}>
                        <Text style={{width:'60%', textAlignVertical: "center", fontSize: 15, fontWeight: '500'}}>Downloaded Lists</Text>
                        <View style={{width: '40%'}}>
                            <Picker itemStyle={{width:'100%'}} >
                                <Picker.Item label="Select" value="0" />
                                <Picker.Item label="List1" value="1" />
                                <Picker.Item label="List2" value="2" />
                                <Picker.Item label="List3" value="3" />
                            </Picker>
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
        color: "#ff8080",
        fontSize: 20,
        justifyContent: "center", 
        alignSelf:"center"
       },
});