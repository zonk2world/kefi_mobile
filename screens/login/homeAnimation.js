/**
 * Created by Star on 5/30/2018.
 */
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    AsyncStorage,
    TouchableOpacity,
    Platform,
    UIManager,
    LayoutAnimation,
    Animated,
    StatusBar
} from 'react-native';
import {
    RkButton,
    RkText,
    RkAvoidKeyboard, RkStyleSheet
} from 'react-native-ui-kitten';
import {RkTheme} from 'react-native-ui-kitten';
import {scale,  scaleVertical} from '../../utils/scale';
import { Entypo ,MaterialIcons,MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';

class ImageLoader extends React.Component {
    state = {
        opacity: new Animated.Value(0),
    }

    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    }

    render() {
        return (
            <Animated.Image
                onLoad={this.onLoad}
                {...this.props}
                style={[
                    {
                        opacity: this.state.opacity,
                        transform: [
                            {
                                scale: this.state.opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.85, 1],
                                })
                            },
                        ],
                    },
                    this.props.style,
                ]}
            />
        );
    }
}
class FadeInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    }

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 2000,              // Make it take a while
            }
        ).start();                        // Starts the animation
    }

    render() {
        let { fadeAnim } = this.state;

        return (
            <Animated.View                 // Special animatable View
                style={{
                    ...this.props.style,
                    opacity: fadeAnim,         // Bind opacity to animated value
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}

const CustomLayoutLinear = {
    duration: 500,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.linear,
    },
    delete: {
        duration: 50,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
};

export class HomeAnimation extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        if (Platform.OS === "android") {
            UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {
            error: null,
            progress: 0,
            showButtons: false,
        }
    }
    componentWillMount() {
        let width = Dimensions.get('window').width;
        this.image = (<Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/Splashbackground.jpg')} />);
    }
    componentDidMount() {
        let thisRender = this;
        this.timer = setInterval(() => {
            if (this.state.progress == 1) {
                clearInterval(this.timer);
                AsyncStorage.getItem('token', (err, token) => {
                    if (token === null){
                        setTimeout(() => {
                            this.setState({showButtons: true});
                        }, 500);
                    }
                    else{
                            setTimeout(() => {
                                this.props.navigation.navigate('Articles1');
                            }, 500);
                    }
                });

            } else {
                let random =  0.239;
                let progress = this.state.progress + random;
                if (progress > 1) {
                    progress = 1;
                }
                LayoutAnimation.configureNext(CustomLayoutLinear);
                this.setState({progress});
            }
        }, 500);

    }

    render() {
        let whiteHeight = ( 1 - this.state.progress ) * scaleVertical(340);
        let bottomHeight = this.state.progress  * scaleVertical(340);

        let width = Dimensions.get('window').width;
        let renderIcon = () => {
                return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
        };
        RkTheme.setType('RkText', 'whiteColor', {
            text:{
                color:'white',
            },
            fontSize:16,
        });
        let renderButtons = () => {
            if(this.state.showButtons)
                return <View style={styles.content}>
                    <FadeInView style={styles.buttons}>
                        <RkButton rkType='stretch'
                                  style={styles.save} onPress={() => this.props.navigation.navigate('Login2')} >
                            Log In
                        </RkButton>
                    </FadeInView>
                    <FadeInView style={styles.buttons}>
                        <RkButton rkType='stretch'
                                  style={styles.save} onPress={() => this.props.navigation.navigate('SignUp')}>
                            Sign Up
                        </RkButton>
                    </FadeInView>
                    <View style={[styles.copyRight, {marginTop:scaleVertical(30)}]}>

                        <RkText rkType='whiteColor'>
                            <FontAwesome name="copyright"
                                         size={18}
                                         style={{color: '#ffffff'}}/> 2018 Kukla Productions
                        </RkText>
                    </View>
                </View>
        };

        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <StatusBar
                    translucent
                    backgroundColor="rgba(0, 0, 0, 0.20)"
                    animated
                />
                <View>
                    {this.image}
                </View>
                <View style={styles.upLayout}>
                    <View style={styles.header}>
                        <View style={{height: whiteHeight, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}} removeClippedSubviews={true}>

                        </View>
                        <ImageLoader style={styles.logoImage}
                                     source= {require('../../assets/images/Kefi_Designs/keffiLogo1x.png') }/>
                        <View style={{height: bottomHeight, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}} removeClippedSubviews={true}>
                            {renderButtons()}
                        </View>
                    </View>
                </View>
            </RkAvoidKeyboard>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: theme.colors.screen.base
    },
    upLayout: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: scaleVertical(16),
    },
    logoImage: {
        height: scaleVertical(200),
        marginTop: scaleVertical(80),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flex: 1,
        resizeMode: 'contain',
    },
    backgroundImg: {
        resizeMode: 'cover',
        height: scaleVertical(680),
    },
    image: {
        height: scaleVertical(200),
        resizeMode: 'contain'
    },
    header: {
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },
    content: {
        justifyContent: 'space-between',
        marginTop:scaleVertical(90),
    },
    save: {
        marginVertical: 5,
        height: scaleVertical(60),
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 45,
        width:scale(200),
    },
    buttons: {
        flexDirection: 'row',
        paddingTop: scaleVertical(15),
        justifyContent: 'space-around',
    },
    copyRight:{
        flexDirection: 'row',
        paddingTop: scaleVertical(15),
        justifyContent: 'center',
    },
}));