import React from 'react';
import {Image, View, Text} from 'react-native';
import {images} from '../constants/images';

const OnboardingLogo = ({imageStyle}) =>(
    <View style={{justifyContent: 'center', alignSelf:'center'}}>
        <View style={{marginBottom: 5}}>
            <Image style={imageStyle} source={images.logo} />
        </View>
        <Text size="xl">
            Dendroica App
        </Text>
    </View>
);

export default OnboardingLogo;