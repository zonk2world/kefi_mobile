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
    RkAvoidKeyboard,
    RkStyleSheet
} from 'react-native-ui-kitten';
import {RkTheme} from 'react-native-ui-kitten';
import {scale,  scaleVertical} from '../../utils/scale';
import { Entypo } from '@expo/vector-icons';

export class SetReminderTime extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }
    componentWillMount() {
        let width = Dimensions.get('window').width;
        this.backImg = (<Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/bgDelivery.jpg')} />);
    }
    render() {
        let width = Dimensions.get('window').width;
        let renderIcon = () => {
            if (RkTheme.current.name === 'light')
                return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
            return <Image style={styles.image} source={require('../../assets/images/logoDark.png')}/>
        };

        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <View>
                    {this.backImg}
                </View>
                <View style={styles.upLayout}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Image source={require('../../assets/images/Kefi_Designs/kefigram-delivery-se.png')}/>
                        </View>
                        <View style={styles.buttons}>
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={() => this.props.navigation.navigate('walkthrough2')}>
                                Set Time ->
                            </RkButton>
                        </View>
                        <View style={styles.footer}>
                            <View style={styles.textRow}>
                                <RkButton rkType='clear' onPress={() => this.props.navigation.navigate('WalkthroughMenu')}>
                                    <RkText rkType='header6 whiteColor'> Skip for now </RkText>
                                </RkButton>
                            </View>
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
        backgroundColor: theme.colors.screen.base,
        height:scaleVertical(680)
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
    backgroundImg: {
        resizeMode: 'cover',
        height: scaleVertical(680),
    },
    image: {
        height: scaleVertical(200),
        resizeMode: 'contain'
    },
    header: {
        marginTop: 350,
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'space-between',
        marginBottom: 70,
    },
    save: {
        marginVertical: 10,
        height:70,
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
        marginBottom: scaleVertical(20),
        paddingTop: 30,
        justifyContent: 'space-around',
    },
}));