import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput, Picker} from "react-native";
import Constants from 'expo-constants';
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import ActionSheet from 'react-native-actionsheet';



const lists =[
    'Cancel',
    'List1',
    'List2',
    'List3',
    'List4',
    'List5',
];
export default class MyList extends Component {
    state ={
        selected: 1,
        searchInput: '',
        birds: Birds,
    }
    static navigationOptions = {
        header: null
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    };
    updateSearch=(text)=>{
        this.setState({
            searchInput: text,
        });
    }
    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    }
    handlerClick=(id, name)=>{
        // Alert.alert("Click:\n" +id+": "+name);
        this.props.navigation.navigate('BirdInfo',
            //params
            {
                title: name,
                id: id,
                data: this.state.birds[id-1], // for debugging
            }
        );
    };
    getBirdCards = () =>{
        return Birds.map((bird) =>{
            return (
                <BirdCard 
                key={bird.id} 
                birdName={bird.name} 
                latin={'Latin Name'}
                imgUrl={bird.image[0]} 
                onPress={()=>{this.handlerClick(bird.id, bird.name)}} 
                onLongPress={()=>{this.handlerLongClick(bird.id, bird.name)}}
                style={{marginBottom: 3}}
                />
            );
        });
    }
    goToTop = () => {
        if(this.scrollView != null){
            this.scrollView.scrollTo({x: 0, y: 0, animated: true});
        }
     }

    quizBtnHandler = () =>{
        
        this.props.navigation.navigate('Quiz',
        //params
        {
            data: this.state.birds,
        }
    );
    }
    render(){
        return (
            <View style={{flex: 1, backgroundColor:"white", marginLeft: 5, marginRight: 5,}}>
                <View style={styles.statusBar}/>
                <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10}}>
                    <Text style={styles.header}>MyLists |</Text>
                    <View style={{marginHorizontal: 10, justifyContent:"center", alignContent:"center", flexGrow:1}}>
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
                    {/* <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='playlist-edit'
                                type='material-community'
                                color='red'
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
                <SearchBar
                    placeholder="Search..."
                    onChangeText={this.updateSearch}
                    value={this.state.searchInput}
                    placeholderTextColor="#474747"
                    inputStyle={{fontSize: 14, color: '#474747'}} // style the TextInput
                    inputContainerStyle={{borderRadius:10, backgroundColor: '#E8E8E8'}}
                    containerStyle={{backgroundColor: 'white', borderTopColor: 'white', borderBottomColor: 'white', paddingLeft:0, paddingRight:0, paddingBottom:0, paddingTop:2}} // style of the container which contains the search bar.
                />
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <TouchableOpacity onPress={()=> this.quizBtnHandler()} style={styles.btn}>
                        <Text style={{fontWeight:"600", color: "red"}}>Quiz</Text>
                    </TouchableOpacity>
                    <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {Birds.length}</Text>
                </View>
                <ScrollView ref={(ref)=> this.scrollView = ref} style={{flex:1}} showsVerticalScrollIndicator={false} >
                        {this.getBirdCards()}
                        
                    <TouchableOpacity style={{backgroundColor:'#E8E8E8', padding:10, justifyContent:"center", alignContent:'center'}} onPress={()=>this.goToTop()}>
                        <Text style={{fontWeight: '500',color:'red', textAlign:"center"}}>Go To Top</Text>
                    </TouchableOpacity>
                </ScrollView>
                

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
     btn:{
         paddingLeft: 25,
         paddingRight: 25,
         paddingTop: 2,
         paddingBottom: 2,
         marginBottom: 3,
         marginTop: 3,
         justifyContent: "center",
         textAlignVertical: "center",
         borderRadius: 5,
         borderWidth: 0.5,
         borderColor: 'red',

     },
     select: {
        width: "100%",
        color: "black",
        fontWeight: "700",
        backgroundColor:"white",
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
});



const Birds = [
    {
      id: 1,
      name: 'Golden Eagle',
      latin: 'Aquila chrysaetos',
      details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
      image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
      },
    {id: 2, name: 'American Golden-Plover',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
           image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 3, name: 'Common Ringed Plover',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
           image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 4, name: 'Semipalmated Plover',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
         image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 5, name: 'Spotted Sandpiper',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 6, name: 'Surfbird',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
         image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 7, name: 'Black-throated Green Warbler', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
           image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 8, name: 'Gray-crowned Rosy-Finch',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 9, name: 'Merlin',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 10, name: 'Eurasian Collared-Dove',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 11, name: 'Rufous Hummingbird',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 12, name: 'Western Tanager',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
           image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    //From USA LIST
},
    {id: 13, name: 'Belted Kingfisher',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 14, name: 'King Rail',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 15, name: 'Atlantic Puffin',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 16, name: 'Acorn Woodpecker',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 17, name: "Chuck-will's-widow",details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
    {id: 18, name: 'Loggerhead Shrike',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
          image: [
                require('../../assets/Birdimages/GC-912-Aquila_chrysaetos.jpg'), 
                require('../../assets/Birdimages/MG-9841-Aquila_chrysaetos_AOU_7_52.jpg'),
                require('../../assets/Birdimages/GP-914-Aquila_chrysaetos.jpg')
             ], 
      imageCredit: [{
              name: 'Gordon Court',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
                          },
                          {
              name: 'Manuel Grosselet',
              source: 'http://www.tierradeaves.com/',
              date: '2008 Jun 15',
              region: 'Mexico, Aguascalientes',
              maturity: 'Adult',
            },
                          {
              name: 'George Peck',
              source: 'Not Found',
              date: 'Not Found',
              region: 'Not Found',
              maturity: 'Adult',
            },
            ],
      sound: [
                '../../assets/Birdsounds/JN-909-Aquila_chrysaetos.mp3',
                '../../assets/Birdsounds/KJC-910-Aquila_chrysaetos.mp3',
            ],
      maps:{

            region: ['Americas', 'North', 'Central' ],
            image: [
                    require('../../assets/Birdimages/aqui_chry_13_whem.png'),
                    require('../../assets/Birdimages/aqui_chry_13_north.png'),
                    require('../../assets/Birdimages/aqui_chry_13_central.png'),
                    ],
            description: "Summary of the extent of the breeding, wintering, migration and year-round range of this species in the Western Hemisphere, including Canada, U.S.A. and Mexico:\n\n\nCanada - Resident year-round: 1,831,466 square km; Breeding only: 4,350,946 square km; Wintering only: 1,181,903 square km\n\nMexico - Resident year-round: 596,111 square km; Wintering only: 84,459 square km\n\nU.S.A. - Resident year-round: 3,668,357 square km; Breeding only: 1,177,580 square km; Wintering only: 2,700,775 square km",

        },
    },
];