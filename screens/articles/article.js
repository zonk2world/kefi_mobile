import React from 'react';
import {
    ScrollView,
    Image,
    View,
    Text,
    Button,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Platform,
    AsyncStorage
} from 'react-native';
import {
    RkCard,
    RkText,
    RkButton,
    RkTheme,
    RkStyleSheet
} from 'react-native-ui-kitten';
import { Audio } from 'expo';
import { Share } from 'react-native';
import {  SimpleLineIcons ,Ionicons} from '@expo/vector-icons';
import {UIConstants} from '../../config/appConstants';
import {scale,  scaleVertical} from '../../utils/scale';
import HTMLView from 'react-native-htmlview';

let moment = require('moment');

class PlaylistItem {
    constructor(name,  image) {
        this.name = name;
        this.image = image;
    }
}

const PLAYLIST = [
    new PlaylistItem(
        'Comfort Fit - “Sorry”',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
    new PlaylistItem(
        'Mildred Bailey – “All Of Me”',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
    new PlaylistItem(
        'Podington Bear - “Rubber Robot”',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
];

const BACKGROUND_COLOR = '#FFFFFF';
const LOADING_STRING = 'Loading...';

export class Article extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.index = 0;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;
        this.playbackInstance = null;
        this.state = {
            visible: false,
            playbackInstanceName: LOADING_STRING,
            playbackInstancePosition: null,
            playbackInstanceDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isBuffering: false,
            isLoading: true,
            fontLoaded: false,
            volume: 1.0,
            rate: 1.0,
            portrait: null,
        }
        let {params} = this.props.navigation.state;
        this.data = params ? params : '';
        // this.data.photo = params.photo;
        // this.data.text = params.text;
        // this.data.header = params.header;
        // this.data = data.getArticle(id);

        this.onOpen = this.onOpen.bind(this);
    }

    componentDidMount() {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
        this._loadNewPlaybackInstance(false);
    }

    async _loadNewPlaybackInstance(playing) {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance.setOnPlaybackStatusUpdate(null);
            this.playbackInstance = null;
        }

        const source = { uri: this.data.audioUrl };
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            volume: this.state.volume,
        };

        const { sound, status } = await Audio.Sound.create(
            source,
            initialStatus,
            this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;

        this._updateScreenForLoading(false);
    }

    _updateScreenForLoading(isLoading) {
        if (isLoading) {
            this.setState({
                isPlaying: false,
                playbackInstanceName: LOADING_STRING,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true,
            });
        } else {
            this.setState({
                playbackInstanceName: PLAYLIST[this.index].name,
                portrait: PLAYLIST[this.index].image,
                isLoading: false,
            });
        }
    }

    _onPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                volume: status.volume,
            });
            if (status.didJustFinish) {
                // this._advanceIndex(true);
                // this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {

            }
        }
    };

    _onPlayPausePressed = () => {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            } else {
                this.playbackInstance.playAsync();
            }
        }
    };

    _onStopPressed = () => {
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    onCancel() {
        this.setState({visible:false});
    }
    onOpen() {
        Share.share({
            message: 'Check out kefilife360.com and download your daily dose of Kefi!',
            url: 'kikivale.com',
            title: 'Wow, did you see that?'
        }, {
            // Android only:
            dialogTitle: 'Check out kefilife360.com and download your daily dose of Kefi!',
            // iOS only:
            excludedActivityTypes: [
                'Check out kefilife360.com and download your daily dose of Kefi!'
            ]
        })
    }

    render() {
        RkTheme.setType('RkText', 'whiteColor', {
            text:{
                color:'white'
            },
            width:scale(320)
        });

        let htmlText = '<p>'+this.data.text+'</p>'
        return (
            <View style={styles.root}>
                <RkCard rkType='article'>
                    <Image rkCardImg style={{height: scaleVertical(342)}} source={{uri: this.data.photo }}/>
                    <View rkCardImgOverlay rkCardContent style={styles.textRow}>
                        <View style={styles.menulayout}>
                            <View style={styles.menucontainer}>
                                <View style={styles.menutitle} >
                                </View>
                                <View style={ styles.menuleft}>
                                    <RkButton
                                        rkType='clear'
                                        style={styles.navmenu}
                                        onPress={() => {
                                            this._onStopPressed();
                                            this.props.navigation.goBack()
                                        }}>
                                        <Ionicons
                                            name="ios-arrow-back"
                                            size={28}
                                            style={{color: 'white', paddingRight: 10}}
                                        />
                                        <RkText rkType='awesome hero' style={{color: 'white',fontSize:20,fontWeight:'400', fontFamily:'SF-UI'}}>
                                            Back
                                        </RkText>
                                    </RkButton>
                                </View>
                                <View style={styles.menuright}>
                                    <TouchableOpacity onPress={() => {this.onOpen()}}>
                                        <SimpleLineIcons
                                            name="share-alt"
                                            size={28}
                                            style={{color: 'white'}}
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'center'}}>
                                <RkText style={styles.title} rkType='header4 whiteColor'>{this.data.header}</RkText>
                            </View>
                            <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row', justifyContent:'flex-end'}}>
                                <TouchableOpacity
                                    underlayColor={BACKGROUND_COLOR}
                                    onPress={this._onPlayPausePressed}
                                    disabled={this.state.isLoading}
                                >
                                    <View style={{backgroundColor:'transparent',alignItems:'flex-end'}}>
                                        {this.state.isPlaying ? (
                                            <Image source={require('../../assets/images/Kefi_Designs/btnPause1.png')} />
                                            ) : (
                                                <Image source={require('../../assets/images/Kefi_Designs/btnPlay1.png')} />
                                            )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </RkCard>
                <ScrollView style={{height: scaleVertical(340)}}>
                <View style={{padding:20}}>
                    <RkText rkType='primary3 bigLine' style={{fontSize:15, fontFamily:'SF-UI',fontWeight:'600', color:'#666666',marginBottom: 20}}>{moment(this.data.publishedDate).format('MMM DD, Y')}</RkText>
                    <HTMLView
                        value={htmlText}
                        stylesheet={htmlStyle}
                    />
                </View>
                </ScrollView>
            </View>
        )
    }
}

let htmlStyle = StyleSheet.create({
    p:{
        fontSize:18,
        fontFamily:'SF-UI',
        fontWeight:'400',
        color:'#666666',
        lineHeight: 28
    }
});
let styles = RkStyleSheet.create(theme => ({
    menulayout: {
        padding: 15,
        paddingTop: UIConstants.StatusbarHeight,
        height: 60,
    }  ,
    menucontainer: {
        flexDirection: 'row',
        height: UIConstants.AppbarHeight,

    },
    menuleft: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    menuright: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    menutitle: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navmenu: {
        width: 120,
        justifyContent: 'flex-start'
    },
    root: {
        backgroundColor: theme.colors.screen.base,
        padding: 0,
    },
    title: {
        marginBottom: 5,
        fontSize: 26,
        fontFamily: 'SF-UI',
        fontWeight: '700',
        color: '#ffffff',
        width:scale(260),
    },
    textRow: {
        backgroundColor:'transparent',
        flex:1,
        justifyContent: 'space-between',
        height: scaleVertical(342),
        paddingBottom:20
    },
}));
