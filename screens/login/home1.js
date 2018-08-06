/**
 * Created by Star on 5/30/2018.
 */
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    AsyncStorage
} from 'react-native';
import {
    RkButton,
    RkText,
    RkAvoidKeyboard, RkStyleSheet
} from 'react-native-ui-kitten';
import {RkTheme} from 'react-native-ui-kitten';
import {scale, scaleVertical} from '../../utils/scale';
import { Entypo } from '@expo/vector-icons';

export class Home1 extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    render() {
        let width = Dimensions.get('window').width;
        let renderIcon = () => {
                return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
        };

        RkTheme.setType('RkText', 'whiteColor', {
            text:{
                color:'white',
            },
            fontSize:20,
        });

        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <View>
                    <Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/Splashbackground.png')}/>
                </View>
                <View style={styles.upLayout}>
                    <View style={styles.header}>
                        {renderIcon()}
                    </View>
                    <View style={styles.content}>
                        <View style={styles.buttons}>
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={() => this.props.navigation.navigate('Login2')} >
                                Log In
                            </RkButton>
                        </View>
                        <View style={styles.buttons}>
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={() => this.props.navigation.navigate('SignUp')}>
                                Sign Up
                            </RkButton>
                        </View>
                        <View style={[styles.buttons, {marginTop:scaleVertical(30)}]}>
                            <RkText rkType='whiteColor'>Copyright @ 2018</RkText>
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
        justifyContent:'center',
    },
    backgroundImg: {
        resizeMode: 'cover',
        height: scaleVertical(680),
    },
    image: {
        height: scaleVertical(200),
        marginTop: scaleVertical(150),
        resizeMode: 'contain'
    },
    header: {
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'space-between',
        marginTop:scaleVertical(60),
        marginBottom: scaleVertical(70),
    },
    save: {
        marginVertical: 5,
        height: scaleVertical(60),
        backgroundColor: 'transparent',
        color: 'white',
        border: 2,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 45,
        width:scale(200),
    },
    buttons: {
        flexDirection: 'row',
        paddingTop: scaleVertical(20),
        justifyContent: 'space-around',
    },
}));