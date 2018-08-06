import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Keyboard,
    StyleSheet,
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
import * as firebase from "firebase";
import { Entypo, Feather ,MaterialCommunityIcons,MaterialIcons,Ionicons,FontAwesome} from '@expo/vector-icons';

import { Util, Permissions, Notifications, Constants } from 'expo'
import { registerForPushNotificationsAsync } from '../../register'
import { sendPushNotification } from '../../send'
import {UIConstants} from '../../config/appConstants';

export class LoginV2 extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            pass: null,
            confirmpass: null,
            name: null,
            error: null
        }
        this.login = this.login.bind(this);
    }
    componentWillMount() {
        let width = Dimensions.get('window').width;
        this.image = (<Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/Splashbackground.jpg')} />);
    }
    async login() {
        let email = this.state.email;
        let pass = this.state.pass;
        try {
            await firebase.auth()
                .signInWithEmailAndPassword(email, pass).then((user) => {

                });
            // await registerForPushNotificationsAsync();
            //
            await sendPushNotification();

            let userID = await firebase.auth().currentUser.uid;
            await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
                AsyncStorage.setItem('token', idToken);
                AsyncStorage.setItem('user_id', userID);
            }).catch(function(error) {
                // Handle error
            });


            await firebase.database().ref('/reminderTime/'+userID).on('value', (snapshot) => {
                if (snapshot.hasChild('ViewedTour')) {
                    let view = snapshot.val();
                    if (view.ViewedTour == true) {
                        this.props.navigation.navigate('Articles1');
                    }else {
                        this.props.navigation.navigate('promo1');
                    }
                }
                else {
                    this.props.navigation.navigate('promo1');
                }
            });


        } catch (error) {
            this.setState({
                error: 'Your email address or password is incorrect. Please try again.'
            })
        }

    }
    render() {
        let width = Dimensions.get('window').width;
        let renderIcon = () => {
                return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
        };
        RkTheme.setType('RkTextInput', 'frame', {
            input: {
                backgroundColor: 'transparent',
                marginLeft: 0,
                marginHorizontal: 0,
                borderRadius: 5
            },
            backgroundColor: 'transparent',
            borderRadius: 0,
            container: {
                paddingHorizontal: 20
            }
        });
        RkTheme.setType('RkText', 'whiteColor', {
            color:'white',
            fontSize:16,
        });
        RkTheme.setType('RkTextInput', 'blackColor', {
            backgroundColor: 'transparent',
            marginLeft: 0,
            marginHorizontal: 0,
            borderRadius: 5,
            color:'white',
            placeholderTextColor: 'white',
            height: scaleVertical(35)
        });
        RkTheme.setType('RkButton', 'stretch', {
                color:'white',
        });

        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <View>
                    {this.image}
                </View>
                <View style={styles.menulayout}>
                    <View style={styles.menucontainer}>
                        <View style={styles.menutitle} >
                        </View>
                        <View style={ styles.menuleft}>
                            <RkButton
                                rkType='clear'
                                style={styles.navmenu}
                                onPress={() => {
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

                        </View>
                    </View>
                </View>
                <View style={styles.upLayout}>
                    <View style={styles.header}>
                        {renderIcon()}
                    </View>
                    <View style={styles.content}>
                        <View style={{justifyContent:'center'}}>
                            <RkText rkType='danger'>{this.state.error} </RkText>
                            <RkTextInput rkType='blackColor' placeholder='Email' label={<Entypo name="user" style={{color:'white'}}  />} value={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
                            <RkTextInput rkType='blackColor' placeholder='Password' label={<Entypo name="lock" style={{color:'white'}} />}   secureTextEntry={true}  value={this.state.pass} onChangeText={(text) => this.setState({pass:text})}/>
                        </View>
                        <View style={styles.buttons}>
                            {/*<GradientButton style={styles.save} rkType='large' text='LOGIN' onPress={this.login}/>*/}
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={this.login} label={<Feather name="arrow-right"  />} >
                                Log In
                            </RkButton>
                        </View>
                        {/*<View style={styles.buttons}>*/}
                            {/*<RkButton style={styles.button} rkType='social'>*/}
                                {/*<RkText rkType='awesome hero'>{FontAwesome.twitter}</RkText>*/}
                            {/*</RkButton>*/}
                            {/*<RkButton style={styles.button} rkType='social'>*/}
                                {/*<RkText rkType='awesome hero'>{FontAwesome.google}</RkText>*/}
                            {/*</RkButton>*/}
                            {/*<RkButton style={styles.button} rkType='social'>*/}
                                {/*<RkText rkType='awesome hero'>{FontAwesome.facebook}</RkText>*/}
                            {/*</RkButton>*/}
                        {/*</View>*/}
                        <View style={[styles.copyRight, {marginTop:scaleVertical(0),marginBottom: scaleVertical(10)}]}>

                            <RkText rkType='whiteColor'>
                                <FontAwesome name="copyright"
                                             size={18}
                                             style={{color: '#ffffff'}}/> 2018 Kukla Productions
                            </RkText>
                        </View>
                    </View>
                </View>
            </RkAvoidKeyboard>
        )
    }
}

let styles = RkStyleSheet.create(theme => ({
    menulayout: {
        padding: 15,
        paddingTop: UIConstants.StatusbarHeight,
        height: 60,
        position: 'absolute',
        top: UIConstants.StatusbarHeight,
        zIndex: 2222,
        width: scale(120),
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
        // backgroundColor: '#000'
    },
    image: {
        height: scaleVertical(200),
        marginTop: scaleVertical(100),
        resizeMode: 'contain'
    },
    header: {
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'space-between',
    },
    save: {
        marginVertical: 20,
        height:scaleVertical(60),
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 45,
        width:scale(200),
    },
    buttons: {
        flexDirection: 'row',
        marginBottom: scaleVertical(12),
        marginHorizontal: 12,
        justifyContent: 'space-around',
    },
    copyRight:{
        flexDirection: 'row',
        marginBottom: scaleVertical(15),
        justifyContent: 'center',
    },
}));