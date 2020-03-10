import React from 'react';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from "react-native";
import Dialog from "react-native-dialog";
import { render } from 'react-dom';

import MediaHandler from '../DB/MediaHandler';

export default class DownloadButton extends React.Component {
    state = {
        dialogVisible: false
    };
    
    showDialog = () => {
        this.setState({ dialogVisible: true });
    };
    
    handleCancel = () => {
        this.setState({ dialogVisible: false });
    };
    
    handleDownload = () => {
        this.setState({ dialogVisible: false });

        MediaHandler.downloadCustomList(this.props.selectedList._id);
        this.props.selectedList.isDownloaded = "true";
    };

    handleIconPress = () => {
        if (this.props.selectedList.isDownloaded == "false") this.showDialog();
    }

    render() {
        if (this.props.listIsSelected == -1) return (<View></View>);

        var iconType = 'download';
        if (this.props.selectedList.isDownloaded == "true") {
            iconType = 'check';
        }
        
        return(
            <View>
                <Icon     
                    size={28}
                    name={iconType}
                    type='font-awesome'
                    color='#48b548'
                    onPress={this.handleIconPress} 
                />
                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Download this custom list?</Dialog.Title>                        
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Download" onPress={this.handleDownload} />
                </Dialog.Container>
            </View>
        );
    }
};