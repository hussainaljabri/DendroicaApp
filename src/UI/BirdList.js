import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput, Picker, Animated} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import BirdCard from '../components/BirdCard';
import Constants from 'expo-constants';
import ActionSheet from 'react-native-actionsheet';

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
     image:[require('../../assets/Birdimages/MP-1669-Pluvialis_dominica.jpg')], sound:""},
    {id: 3, name: 'Common Ringed Plover',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
     image:[require('../../assets/Birdimages/76165-Charadrius_hiaticula_AOU_7_52.jpg')], sound:""},
    {id: 4, name: 'Semipalmated Plover',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg')], sound:""},
    {id: 5, name: 'Spotted Sandpiper',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/72902-Actitis_macularius_AOU_7_52.jpg')], sound:""},
    {id: 6, name: 'Surfbird',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/RH-1442-Aphriza_virgata.jpg')], sound:""},
    {id: 7, name: 'Black-throated Green Warbler', details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
     image:[require('../../assets/Birdimages/CMF-9382-Dendroica_virens.jpg')], sound:""},
    {id: 8, name: 'Gray-crowned Rosy-Finch',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/LM-9260-Leucosticte_tephrocotis.jpg')], sound:""},
    {id: 9, name: 'Merlin',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/TB2-119938-Falco_columbarius_AOU_7_52.jpg')], sound:""},
    {id: 10, name: 'Eurasian Collared-Dove',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/87129-Streptopelia_decaocto_AOU_7_52.jpg')], sound:""},
    {id: 11, name: 'Rufous Hummingbird',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/TB2-14343-Selasphorus_rufus.jpg')], sound:""},
    {id: 12, name: 'Western Tanager',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
     image:[require('../../assets/Birdimages/LM-9392-Piranga_ludoviciana.jpg')], sound:""},
    //From USA LIST
    {id: 13, name: 'Belted Kingfisher',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/76042-Megaceryle_alcyon_AOU_7_52.jpg')], sound:""},
    {id: 14, name: 'King Rail',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/85699-Rallus_elegans_AOU_7_52.jpg')], sound:""},
    {id: 15, name: 'Atlantic Puffin',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/JR-2122-Fratercula_arctica.jpg')], sound:""},
    {id: 16, name: 'Acorn Woodpecker',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/KB3-120281-Melanerpes_formicivorus_AOU_7_52.jpg')], sound:""},
    {id: 17, name: "Chuck-will's-widow",details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/TB-7827-Caprimulgus_carolinensis.jpg')], sound:""},
    {id: 18, name: 'Loggerhead Shrike',details:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum laoreet dignissim. Aliquam luctus, risus rutrum pellentesque gravida, turpis nisi ullamcorper odio, et maximus ipsum justo id erat. Donec semper, nunc quis hendrerit sagittis, mi nisi porta metus, in varius justo odio nec arcu. Sed luctus erat nisl, ac consectetur orci mattis ac. Mauris blandit sit amet ipsum vitae lacinia. Aliquam quis magna imperdiet leo feugiat lacinia vitae vel dolor. Ut laoreet tellus vel nunc suscipit tempor.',
    image:[require('../../assets/Birdimages/usa/81029-Lanius_ludovicianus_AOU_7_52.jpg')], sound:""},
]; // stored locally for testing purposes.

const continents = [
    'Cancel',
    'Canada', 
    'U.S.A', 
    'Mexico',
    'Caribbean', 
    'Central America',
    'South America',
  ];

export default class BirdList extends Component {
    state ={
        regionInput: 'test',
        selected: 1,
        searchInput: '',
        birds: [],
        scrolltotop: false,
        isTopBarHidden: false,
        barclicked: false,
    }
    static navigationOptions = {
        header: null
    }
      
    /**
     * Region Handler---------------------------------------------------------------------------
     */

     // 1) get Regions List from Settings config/db.

     // 2) map the Regions and return a Selection view.

     // 3) Selection state handler, to update the state which corresponds to user input.
        selectHandler = (input) =>{
            this.setState({
                regionInput: input,
                
            });
        };
    /**
     * ------------------------------------------------------------------------------------------
     */

    /**
     * Bird Card List---------------------------------------------------------------------------
     */

    componentDidMount(){
        this.setState({
            birds: Birds,
        });
        
    };

    showActionSheet = () => {
        this.ActionSheet.show();
    };

    updateSearch=(text)=>{
        this.setState({
            searchInput: text,
        });
    };
    handlerLongClick=(id, name)=>{
        Alert.alert("LongPress: \n" +id+": "+name);
    };
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
    handlerScrolltotop=()=>{
        if(this.state.scrolltotop){
            this.setState({isTopBarHidden: false, barclicked: false});
        }else{
            this.setState({isTopBarHidden: true, barclicked: false});
        }
    };
    handleScroll=()=>{
        this.setState({isTopBarHidden: !this.state.isTopBarHidden});
    };
    topShow = () =>{
        this.setState({isTopBarHidden: false});
    }
    topHide = () =>{
        this.setState({isTopBarHidden: true});
    }

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
    /**
     * ------------------------------------------------------------------------------------------
     */
    render(){
        const topBarStyle = this.state.isTopBarHidden;
        return (
            <View style={{backgroundColor:"white", marginLeft: 5, marginRight: 5,flex:1}}>
                <TouchableOpacity style={styles.statusBar} onPress={()=> alert('hey!')}></TouchableOpacity>
                <View style={{flexDirection: "row",justifyContent: "space-between", padding: 10}}>
                    <Text style={styles.header}>Explore |</Text>
                    <View style={{marginHorizontal: 10, justifyContent:"center", alignContent:"center", flexGrow:1}}>
                        <Text onPress={this.showActionSheet} style={{fontSize:22, fontWeight:'500', opacity:0.7, justifyContent:'center'}}>{continents[this.state.selected]}</Text>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={<Text style={{fontSize: 18, fontWeight:'500', letterSpacing:1}}>Select Region</Text>}
                            cancelButtonIndex={0}
                            destructiveButtonIndex={0}
                            options={continents}
                            onPress={(index) => { /* do something */ 
                                console.log('actionsheet: '+index+ ' corresponds to :'+ continents[index]);
                                index != 0? this.setState({selected: index}) : {};
                            }}
                        />

                    </View>
                    {/* <View style={{justifyContent:"center", marginRight: 5, marginLeft: 5, paddingRight:5, paddingLeft: 5}}>
                        <TouchableOpacity>
                            <Icon 
                                name='settings'
                                color='orange'
                            />
                        </TouchableOpacity>
                    </View> */}
                </View>
                
                {topBarStyle ? 
                    <TouchableOpacity onPress={()=> this.topShow()} style={{backgroundColor:"#DCDCDC"}}>
                        <Icon size={22} type='material-community' name='menu-down' color='black'/>
                    </TouchableOpacity>
                :
                    (<View>
                        <SearchBar
                            placeholder="Search..."
                            onChangeText={this.updateSearch}
                            value={this.state.searchInput}
                            placeholderTextColor="#474747"
                            inputStyle={{fontSize: 14, color: '#474747'}} // style the TextInput
                            inputContainerStyle={{borderRadius:10, backgroundColor: '#E8E8E8'}}
                            containerStyle={{backgroundColor: 'white', borderTopColor: 'white', borderBottomColor: 'white', paddingLeft:0, paddingRight:0, paddingBottom:0, paddingTop:2}} // style of the container which contains the search bar.
                        />

                        <View>
                            <Text style={{paddingLeft:25,paddingRight:25, paddingBottom:5, paddingTop:10, textAlign:"right"}}>Species: {this.state.birds.length}</Text>
                        </View>
                    </View>)
                }

                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} onMomentumScrollBegin={this.topHide} >
                    {this.getBirdCards()}
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
         padding:15, 
         justifyContent: "center", 
         alignItems: "center", 
         backgroundColor:'orange'
    },
     select: {
        width:"100%",
        color: "black",
        fontWeight: "700",
        backgroundColor:"white",
     },
     header:{
         
         paddingLeft: 15, 
         paddingRight: 15,
         fontWeight: "700",
         color: "orange",
         fontSize: 20,
         justifyContent: "center", 
         alignSelf:"center"
        },
});
