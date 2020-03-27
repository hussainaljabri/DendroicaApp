import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import MediaHandler from '../DB/MediaHandler';

export default class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    currentIndex: 0,
    volume: 1.0,
    isBuffering: false,
    isLooping: false
  }
  async componentDidMount() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true
      })
      
      this.loadAudio()
    } catch (e) {
      console.log(e)
    }
  }

  async loadAudio() {
    const {currentIndex, isPlaying, isLooping, volume} = this.state;
    const {bird_id, audioPlaylist, connected} = this.props;
    console.log('testing: ',MediaHandler.getMediaFile(bird_id, audioPlaylist[currentIndex].mp3_filename, connected));
    try {
      const playbackInstance = new Audio.Sound()
      const source = {
        uri: MediaHandler.getMediaFile(bird_id, audioPlaylist[currentIndex].mp3_filename, connected)
      }
      const status = {
        shouldPlay : isPlaying, isLooping,
        volume
      }

      playbackInstance.setOnPlaybackStatusUpdate(this.setOnPlaybackStatusUpdate)
      await playbackInstance.loadAsync(source, status, false)
      this.setState({playbackInstance})
    } catch (e) {
      console.log(e)
    }
  }

  onPlaybackStatusUpdate = status => {
    this.setState({
      isBuffering: status.isBuffering
    })
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

    this.setState({
      isPlaying: !isPlaying
    })
  }

  handleRepeat = async () => {
    const { isLooping, playbackInstance } = this.state
    isLooping ? await playbackInstance.setIsLoopingAsync(false) : await playbackInstance.setIsLoopingAsync(true)
    this.setState({
      isLooping: !isLooping
    })
  }

  handlePreviousTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      currentIndex == 0 ? (currentIndex = this.props.audioPlaylist.length - 1) : (currentIndex -= 1)
      this.setState({
        currentIndex
      })
      this.loadAudio()
    }
  }

  handleNextTrack = async () => {
    let { playbackInstance, currentIndex } = this.state
    if (playbackInstance) {
      await playbackInstance.unloadAsync()
      currentIndex < this.props.audioPlaylist.length - 1 ? (currentIndex += 1) : (currentIndex = 0)
      this.setState({
        currentIndex
      })
      this.loadAudio()
    }
  }

  renderFileInfo () {
    const { playbackInstance, currentIndex } = this.state
    return playbackInstance ? (
      <View style = {styles.trackInfo}>
        <Text>{this.props.audioPlaylist[currentIndex].filename}</Text>
        <Image style = {styles.albumCover} source = {{uri: this.props.audioPlaylist[currentIndex].filename}} resizeMode = "contain" />

        <Text style = {[styles.trackInfoText, styles.largeText]}>
          
        </Text>

        <Text style = {[styles.trackInfoText, styles.smallText]}>
          {this.props.audioPlaylist[currentIndex].description}
        </Text>

        <Text style = {[styles.trackInfoText, styles.smallText]}>

        </Text>
      </View>
    ) : null
  }

  render() {
    return (
      <View style={styles.container}>
          {this.renderFileInfo()}
        <View style = {styles.controls}>
          <TouchableOpacity style = {styles.control} onPress = {this.handlePreviousTrack}>
            <Ionicons name = 'ios-skip-backward' size = {48} color = '#1b1b1b' />
          </TouchableOpacity>
          <TouchableOpacity style = {styles.control} onPress = {this.handlePlayPause}>
            {this.state.isPlaying ? (
              <Ionicons name = 'ios-pause' size = {48} color = '#1b1b1b' />
            ) : (
              <Ionicons name = 'ios-play-circle' size = {48} color = '#1b1b1b' />
            )}
          </TouchableOpacity>
          <TouchableOpacity style = {styles.control} onPress = {this.handleNextTrack}>
            <Ionicons name = 'ios-skip-forward' size = {48} color = '#1b1b1b' />
          </TouchableOpacity>
        </View>
        <View style = {styles.subControls}>
          <TouchableOpacity onPress = {this.handleRepeat}>
            {this.state.isLooping ? (
              <Ionicons name = 'ios-repeat' size = {48} color = '#ffb1b1' />
            ):(
              <Ionicons name = 'ios-repeat' size = {48} color = '#1b1b1b' />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 35
  },
  albumCover: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  trackInfo: {
    backgroundColor: '#fff',
    flex: 1
  },
  trackInfoText: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: '#c0c0c0'
  },
  largeText: {
    fontSize: 22
  },
  smallText: {
    fontSize: 16
  },
  controls: {
    flexDirection: 'row',
    flex: 1
  },
  subControls: {
    flex: 1
  },
  control: {
    margin: 20
  }
});
