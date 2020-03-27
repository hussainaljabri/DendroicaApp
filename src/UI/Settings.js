import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform, TextInput, Switch, StatusBar, Alert} from "react-native";
import Constants from 'expo-constants';
import ListCard from '../components/ListCard';
import DatabaseModule from '../DB/DatabaseModule';
import MediaHandler from '../DB/MediaHandler';

export default class Settings extends Component {
    state = {
        rateSelect: true,
        migrationSelect: true,
        selected: 1,
        lists: [],
        listsReady: false,
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
            <ScrollView style={{flex: 1,backgroundColor:"white", paddingBottom:10}}>
                <View style={styles.statusBar}/>
                <StatusBar barStyle="dark-content" />
                <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10,}}>
                    <Text style={styles.header}>Settings |</Text>
                    <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        {/* <TouchableOpacity>
                            <Icon 
                                name='save'
                                type='font-awesome'
                                color='purple'
                            />
                        </TouchableOpacity> */}
                    </View>
                </View>

                <View style={{margin: 15}}>
                    <Text style={{fontSize: 20, fontWeight:'700', opacity: 0.5, marginBottom:10}}>Region Lists Filter</Text>

                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Text style={{fontSize: 15, fontWeight: '500',opacity:0.7,marginHorizontal: 15,}}>Show Rare</Text>
                            <Switch 
                                style={{flexGrow:1}}
                                value={this.state.rateSelect}
                                onValueChange={(value) => this.toggleRate(value)}
                            />
                        </View>
                    </View>

                    <View style={{margin:15}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontSize: 15, fontWeight: '500',opacity:0.7,marginHorizontal: 15,}}>Show Migratory Birds</Text>
                            <Switch 
                                style={{flexGrow:1}}
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
                        <TextInput 
                            underlineColorAndroid='transparent' 
                            style={{
                                borderRadius: 0.5,
                                borderColor: 'black',
                                borderWidth: 0.2,
                                backgroundColor:'#F5F5F5', 
                                marginHorizontal: 15, 
                                flexGrow:1, 
                                paddingHorizontal:10}}
                            placeholder={'Value'}
                            keyboardType={'numeric'} 
                            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                    </View>
                   
                    <View style={{margin:15, flexDirection:'row'}}>
                        <Text style={{ textAlignVertical: "center", fontSize: 15, fontWeight: '500', opacity:0.7,marginHorizontal: 15, }}>Image download limit</Text>
                        <TextInput 
                            underlineColorAndroid='transparent' 
                            style={{     
                            borderRadius: 0.5,
                            borderColor: 'black',
                            borderWidth: 0.2,
                            backgroundColor:'#F5F5F5', 
                            marginHorizontal: 15, 
                            flexGrow:1, 
                            paddingHorizontal:10}} 
                            placeholder={'Value'} 
                            keyboardType={'numeric'} 
                            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'} />
                   </View>
                    
                    
                    <View styles={{flexDirection:'row',flex:1, justifyContent:'center', paddingVertical:15,}}>

                            <View style={{flexWrap:'wrap'}}>
                                <TouchableOpacity style={[styles.btn, {}]}>
                                    <Text style={{fontWeight:"600", color: "purple"}}>Delete All Downloaded Content</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{flexWrap:'wrap'}}>
                                <TouchableOpacity style={[styles.btn, {}]}>
                                    <Text style={{fontWeight:"600", color: "purple"}}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                    </View>

                    <View style={{flexDirection:'row', margin:15,}}>
                        <Text style={{marginHorizontal:15, textAlignVertical: "center", fontSize: 15, fontWeight: '500', opacity:0.7}}>Downloaded Lists</Text>
                    </View>
                    <ScrollView style={{marginHorizontal:15}}>
                        {this.getListCard()}
                    </ScrollView>

                </View>

            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    statusBar:{
        height: Constants.statusBarHeight,
        // backgroundColor: 'black',
        width:'100%',
     },
     btn:{
         alignSelf:"center",
         width:'70%',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 3,
        marginTop: 3,
        textAlignVertical: "center",
        textAlign:'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'purple',

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