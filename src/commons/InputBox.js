import React from 'react';
import {View, TextInput} from 'react-native';

const InputBox = ({children, onChange, value, type}) =>(
    <View 
    style={{
        marginBottom: 5,
        flexDirection: 'row',
        backgroundColor: `darkgray`,
        marginHorizontal: '10%',
        justifyContent:"center",
        alignItems: 'center',
        padding: 15,
        borderRadius: 5
    }}>
        <View style={{width:'100%'}}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', color:"whitesmoke", borderWidth: 1, paddingHorizontal: 5}}
                onChangeText={text => onChange(text)}
                value={value}
                placeholder={children}
                placeholderTextColor='whitesmoke'
                underlineColorAndroid="transparent"
                secureTextEntry={type==='pass'? true: false}
            />
        </View>       
    </View>
);

export default InputBox;