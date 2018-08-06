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
import {NavigationActions} from 'react-navigation';
import * as firebase from "firebase";
import {DatePicker} from '../../components/picker/datePicker';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { registerForPushNotificationsAsync } from '../../register';
import Moment from "moment/moment";

let moment = require('moment');
export class Walkthrough2 extends React.Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            cardNumber: '',
            nameOnCard: '',
            cardCode: '',
            reminderYear: {key: 1, value: 'Am'},
            reminderMonth: 7,
            reminderDay: 30,
            pickerVisible: false,
            btnTitle:'Set Time',
            setTime:'',
            isStart:false,
            index: 0,
        }
        this._navigateAction = this._navigate.bind(this);
        this.hidePicker = this.hidePicker.bind(this);
        this._handleDatePicked = this._handleDatePicked.bind(this);
    }
    _navigate() {
        this.props.navigation.navigate('Articles1');
    }

    changeIndex(index) {
        this.setState({index})
    }

    handlePickedDate(date) {

        this.setState({reminderDay: date.day, reminderMonth: date.month, reminderYear: date.year});
        this.hidePicker();
        if(date.day < 10){
            date.day = '0'+date.day;
        }
        if(date.month < 10){
            date.month = '0'+date.month;
        }
        let   yearValue = date.year.value;

        let rTime = date.month +': '+ date.day+ ' '+ yearValue ;
        this.setState({
            isStart:true,
            setTime:rTime,
            btnTitle:'Start App',
        })
        
        AsyncStorage.getItem('user_id', (err, userId) => {
            firebase.database().ref('/reminderTime/'+userId).set({
                rTime:rTime,
                ViewedTour: true,
                userId: userId
            });
        });

    }
    _handleDatePicked = (date) => {
        this.hidePicker();

        let setTime = Moment(date).format('h:mm a');
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const timestamp =  hour * 60 + minute;
        this.setState({
            setTime: setTime,
            isStart:true,
            btnTitle:'Start App',
        });

        registerForPushNotificationsAsync();
        AsyncStorage.getItem('user_id', (err, userId) => {
            firebase.database().ref('/reminderTime/'+ userId).set({
                rTime: timestamp,
                ViewedTour: true,
                userId: userId,
            })
        });

    };

    hidePicker() {
        this.setState({pickerVisible: false});
    }

    render() {
        let width = Dimensions.get('window').width;
        let renderIcon = () => {
                return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
        };

        RkTheme.setType('RkText', 'whiteColor', {
            text:{
                color:'white'
            }
        });

        return (
            <RkAvoidKeyboard
                style={styles.screen}
                onStartShouldSetResponder={ (e) => true}
                onResponderRelease={ (e) => Keyboard.dismiss()}>
                <View>
                    <Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/bgDelivery.png')}/>
                </View>
                 <View style={styles.upLayout}>
                     <View style={styles.header}>
                         {/*{renderIcon()}*/}
                     </View>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <RkText style={styles.driveTitle}>Kefigram Delivery</RkText>
                            <RkText style={styles.driveDesc}>Set a reminder and receive a nudge when a new post is available.</RkText>
                        </View>
                        <View style={styles.buttons}>
                            <RkButton rkType='stretch'
                                      style={styles.save} onPress={() => this.state.isStart? this._navigate() : this.setState({pickerVisible: true})}>
                                {this.state.btnTitle} {<FontAwesome style={{color:'white'}}
                                                                   name="long-arrow-right"
                                                                   size={25}
                            />}
                            </RkButton>
                        </View>
                        <View style={{marginTop:0}}>
                            <View style={styles.textRow}>
                                <RkButton rkType='clear' onPress={() => this._navigate()}>
                                    <RkText rkType='header6 whiteColor'> Skip for now </RkText>
                                </RkButton>
                            </View>
                        </View>
                        <View style={[styles.expireDateBlock]}>
                            <DateTimePicker
                                isVisible={this.state.pickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this.hidePicker}
                                mode="time"
                                is24Hour={true}
                            />
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
        height: scaleVertical(680),
    },
    backgroundImg: {
        resizeMode: 'cover',
        height: scaleVertical(680),
    },
    image: {
        height: scaleVertical(200),
        resizeMode: 'contain'
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
    header: {
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: scale(295),
    },
    content: {
        justifyContent: 'flex-end',
        marginBottom: scaleVertical(60),
        alignItems: 'center',
        height:scaleVertical(620),
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
        justifyContent: 'center',
    },
    expireDateBlock: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
}));