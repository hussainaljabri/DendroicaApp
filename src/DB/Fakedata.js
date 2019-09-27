import React, { Component } from "react";
import {SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Button, TextInput} from "react-native";



const Birds = [
    {id: 1, name: 'Golden Eagle', image: 'GC-912-Aquila_chrysaetos.jpg'},
    {id: 2, name: 'American Golden-Plover', image:'MP-1669-Pluvialis_dominica.jpg'},
    {id: 3, name: 'Common Ringed Plover', image:'76165-Charadrius_hiaticula_AOU_7_52.jpg'},
    {id: 4, name: 'Semipalmated Plover', image:'MP-1697-Charadrius_semipalmatus_AOU_7_52.jpg'},
    {id: 5, name: 'Spotted Sandpiper', image:'72902-Actitis_macularius_AOU_7_52.jpg'},
    {id: 6, name: 'Surfbird', image:'RH-1442-Aphriza_virgata.jpg'},
    {id: 7, name: 'Black-throated Green Warbler', image:'CMF-9382-Dendroica_virens.jpg'},
    {id: 8, name: 'Gray-crowned Rosy-Finch', image:'LM-9260-Leucosticte_tephrocotis.jpg'},
    {id: 9, name: 'Merlin', image:'TB2-119938-Falco_columbarius_AOU_7_52.jpg'},
    {id: 10, name: 'Eurasian Collared-Dove', image:'87129-Streptopelia_decaocto_AOU_7_52.jpg'},
    {id: 11, name: 'Rufous Hummingbird', image:'TB2-14343-Selasphorus_rufus.jpg'},
    {id: 12, name: 'Western Tanager', image:'LM-9392-Piranga_ludoviciana.jpg'},

]