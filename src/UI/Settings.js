import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, TextInput, Switch, StatusBar, Alert} from "react-native";
import Constants from 'expo-constants';
import ListCard from '../components/ListCard';
import DatabaseModule from '../DB/DatabaseModule';
import MediaHandler from '../DB/MediaHandler';
import styles from '../styles/Settings.style';

export default class Settings extends Component {
    state = {
        rateSelect: true,
        migrationSelect: true,
        selected: 1,
        lists: [],
        listsReady: false,
    }
    static navigationOptions = {
        header: null   
    }

    componentWillMount(){
        DatabaseModule.getLists({
            success: (result)=>{
                // console.log('Lists: '+JSON.stringify(result)); 
//Lists: [{"_id":25088,"name":"Test List","isDownloaded":"false"},{"_id":25089,"name":"test","isDownloaded":"false"}]

                this.setState({
                    listsReady: true,
                    lists: result,
                });
                // console.log('Loaded Lists: '+ JSON.stringify(this.state.lists));
            }
        });
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
    listDeletionHandler=(id, name)=>{
        Alert.alert(
            `Removing ${name}`,
            `Do you want to proceed to remove "${name}" list? `,
            [
                {
                    text: 'Cancel',
                    onPress: ()=> console.log('cancel pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm', 
                    onPress: ()=>{MediaHandler.purgeCustomList(id)},
                }
            ],
            {cancelable: true}
        );
    }
    listDownloadHandler=(id, name)=>{
        Alert.alert(
            `Downloading ${name}`,
            `Do you want to proceed to download "${name}" list? `,
            [
                {
                    text: 'Cancel',
                    onPress: ()=> console.log('cancel pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm', 
                    onPress: ()=>{MediaHandler.downloadCustomList(id);},
                }
            ],
            {cancelable: true}
        );
    }
    getListCard = ()=>{
        if(this.state.listsReady){
            return this.state.lists.map((item, index)=>{
                return (<ListCard key={index} isDownloaded={item.isDownloaded} onPressDownload={()=> this.listDownloadHandler(item._id, item.name)} onPressDelete={()=>this.listDeletionHandler(item._id, item.name)} name={item.name} id={index}/>)
            });
        }
    };
    render(){
        return (
            <ScrollView style={styles.MainContainer}>
                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.headerText}>Settings |</Text>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitleText}>Region Lists Filter</Text>

                    <View style={styles.sectionContainer}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.textInputTitle}>Show Rare</Text>
                            <Switch 
                                style={{flexGrow:1}}
                                value={this.state.rateSelect}
                                onValueChange={(value) => this.toggleRate(value)}
                            />
                        </View>
                    </View>

                    <View style={styles.sectionContainer}>
                        <View style={styles.switchContainer}>
                            <Text style={styles.textInputTitle}>Show Migratory Birds</Text>
                            <Switch 
                                style={{flexGrow:1}}
                                value={this.state.migrationSelect}
                                onValueChange={(value) => this.toggleMigration(value)}
                            />
                        </View>
                    </View>
                    
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitleText}>More Options</Text>
                    
                    <View style={styles.textInputContainer}>
                        <Text style={styles.textInputTitle}>Sound download limit</Text>
                        <TextInput 
                            underlineColorAndroid='transparent' 
                            style={styles.textInput}
                            placeholder={'Value'}
                            keyboardType={'numeric'} 
                            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                    </View>
                   
                    <View style={styles.textInputContainer}>
                        <Text style={styles.textInputTitle}>Image download limit</Text>
                        <TextInput 
                            underlineColorAndroid='transparent' 
                            style={styles.textInput} 
                            placeholder={'Value'} 
                            keyboardType={'numeric'} 
                            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                   </View>
                    
                    
                    <View styles={styles.buttonsContainer}>

                            <View style={{flexWrap:'wrap'}}>
                                <TouchableOpacity style={styles.btn}>
                                    <Text style={{fontWeight:"600", color: "purple"}}>Delete All Downloaded Content</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{flexWrap:'wrap'}}>
                                <TouchableOpacity style={styles.btn}>
                                    <Text style={{fontWeight:"600", color: "purple"}}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
                    <View style={styles.textInputContainer}>
                        <Text style={styles.sectionTitleText}>Downloaded Lists</Text>
                    </View>
                    <ScrollView style={styles.listsContainer}>
                        {this.getListCard()}
                    </ScrollView>
            </ScrollView>
        );
    }

}
