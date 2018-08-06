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
    RkTextInput,
    RkAvoidKeyboard, RkStyleSheet
} from 'react-native-ui-kitten';
import {RkTheme} from 'react-native-ui-kitten';
import {scale,  scaleVertical} from '../../utils/scale';
import { FontAwesome,Entypo } from '@expo/vector-icons';

export class Promo1 extends React.Component {
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
        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <View>
                    <Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/bgDrive.jpg')} />
                </View>
                <View style={styles.upLayout}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <RkText style={styles.driveTitle}>Drive Your life</RkText>
                            <RkText style={styles.driveDesc}>Listen to your favorite life coach and hop into the driver seat.</RkText>
                        </View>
                        <View style={styles.buttons}>
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={() => this.props.navigation.navigate('promo2')}>
                                Next {<FontAwesome style={{color:'white'}}
                                            name="long-arrow-right"
                                            size={25}
                                        />}
                            </RkButton>
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
        backgroundColor: theme.colors.screen.base,
    },
    upLayout: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: scaleVertical(16),
        height: scaleVertical(680),
    },
    driveTitle: {
      fontSize: 36,
      fontFamily: 'SF-UI',
      fontWeight: '700',
      color: '#ffffff',
      textAlign: 'center',
    },
    driveDesc: {
        fontSize: 34,
        fontFamily: 'SF-UI',
        fontWeight: '100',
        color: '#ffffff',
        textAlign: 'center',
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
        justifyContent: 'center',
        width: scale(286),
    },
    content: {
        justifyContent: 'flex-end',
        marginBottom: scaleVertical(60),
        alignItems: 'center',
        height:scaleVertical(650)
    },
    save: {
        marginVertical: 10,
        height:scaleVertical(60),
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 45,
        width:scale(200),
    },
    buttons: {
        flexDirection: 'row',
        marginBottom: scaleVertical(20),
        paddingTop: scaleVertical(30),
        justifyContent: 'space-around',
    },
}));