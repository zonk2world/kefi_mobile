import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  AsyncStorage
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkChoice
} from 'react-native-ui-kitten';
import {scale, scaleVertical} from '../../utils/scale';
import * as firebase from "firebase";
import { Entypo , MaterialCommunityIcons,MaterialIcons,Ionicons,EvilIcons} from '@expo/vector-icons';
import {UIConstants} from '../../config/appConstants';
let moment = require('moment');

export class SignUp extends React.Component {
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
        error: null,
        agreeTerms: false,
        modalVisible: false,
        legaltext: '',
      }
      this.signup = this.signup.bind(this);
      this.getLegal = this.getLegal.bind(this);
  }
    async getLegal() {
        try {
            await   firebase.database().ref('docs/').on('value', (snapshot) => {
               let resultObj = snapshot.val();
               let resultLegal = resultObj.Text;
                this.setState({
                    legaltext: resultLegal
                })
            });
        } catch (error) {
            // console.log(error.toString());
        }
    }

    componentWillMount(){
        this.getLegal();
        let width = Dimensions.get('window').width;
        this.image = (<Image style={[styles.backgroundImg, {width}]} source={require('../../assets/images/Kefi_Designs/Splashbackground.jpg')} />);
    }

  async signup() {
    let  email = this.state.email;
    let userName = this.state.name;
    let pass = this.state.pass;
    let confirmPass = this.state.confirmpass;
    let signDate = new Date();
    let strDate = moment(signDate).format('YYYY-MM-DD HH:mm:ss')
    let agreeState = this.state.agreeTerms;
    if(!agreeState){
        this.setState({
            error: 'You should agree terms and conditions'
        });
        return;
    }
    if((pass != confirmPass) || (pass == null)){
        this.setState({
            error: 'Your password incorrect'
        });
        return;
    }
    try {
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);
        let userID = await firebase.auth().currentUser.uid;
        await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            AsyncStorage.setItem('token', idToken);
            AsyncStorage.setItem('user_id', userID);
        }).catch(function(error) {
            // Handle error
        });
        await firebase.database().ref('/users/'+userID).set({userName:userName ,userEmail: email,agreedToLegal:agreeState,agreeDate:strDate});
        await firebase.database().ref('/reminderTime/'+ userID).set({
            rTime: '',
            ViewedTour: false,
            userId: userID,
        })
        this.props.navigation.navigate('promo1')
    } catch (error) {
        this.setState({
            error: 'Email already exist'
        })
    }
  }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

  render() {
      let width = Dimensions.get('window').width;
      RkTheme.setType('RkTextInput', 'frame', {
          input: {
              backgroundColor: 'transparent',
              marginLeft: 0,
              marginHorizontal: 0,
              borderRadius: 5
          },
          color: 'white',
          backgroundColor: 'transparent',
          borderRadius: 0,
          height: scaleVertical(35),
          placeholderTextColor: 'white',
          labelColor: 'white',
      });
      RkTheme.setType('RkText', 'whiteColor', {
          text:{
              color:'white'
          }
      });
      RkTheme.setType('RkChoice', 'redCheckMarkSelected', {
          backgroundColor: 'transparent',
          inner: {
              tintColor: 'white',
              margin: 0,
              width: 20,
              height: 20,
              backgroundColor: 'transparent'
          },
          marginRight: 15,
      });
      RkTheme.setType('RkChoice', 'redCheckMark', {
          backgroundColor: 'transparent',
          inner: {
              tintColor: null,
              margin: 0,
              width: 20,
              height: 20,
              backgroundColor: 'transparent'
          },
          marginRight: 15,
      });

    let renderIcon = () => {
      if (RkTheme.current.name === 'light')
        return <Image style={styles.image} source={require('../../assets/images/largeLogo.png')}/>;
      return <Image style={styles.image} source={require('../../assets/images/logoDark.png')}/>
    };

    return (
      <View>
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
              <View style={{marginTop:scaleVertical(30)}}>
                  <RkText rkType='h2 whiteColor' style={{textAlign:'center'}}>Sign Up</RkText>
                  <RkTextInput rkType='frame' placeholder='Name' label={<Entypo name="user" style={{paddingRight:10}}/>}  value={this.state.name} onChangeText={(text) => this.setState({name:text})}/>
                  <RkTextInput rkType='frame' placeholder='Email' label={<MaterialCommunityIcons name="email-outline" style={{paddingRight:10}} />} name='email' value={this.state.email} onChangeText={(text) => this.setState({email:text})}/>
                  <RkTextInput rkType='frame' placeholder='Password' label={<Entypo name="lock" style={{paddingRight:10}}/>}  name='pass' secureTextEntry={true} value={this.state.pass} onChangeText={(text) => this.setState({pass:    text})}/>
                  <RkTextInput rkType='frame' placeholder='Confirm Password' label={<Entypo name="lock" style={{paddingRight:10}}/>}  secureTextEntry={true} value={this.state.confirmpass} onChangeText={(text) => this.setState({confirmpass:text})}/>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                      <RkChoice  rkType='redCheckMark' selected={this.state.agreeTerms} onChange={(args) => this.setState({agreeTerms:args})}/>
                      <TouchableOpacity onPress={() => {
                          this.setModalVisible(true);
                      }}>
                          <Text style={{color: 'white',}}>I agree to the Terms & Conditions and Privacy Policy</Text>
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.buttons}>
                  <RkButton rkType='stretch'
                            style={styles.save} onPress={this.signup} >
                    SIGN UP
                  </RkButton>
            </View>
            <View style={styles.footer}>
                <RkText style={{color:'red',textAlign:'center'}}>{this.state.error}</RkText>
              <TouchableOpacity style={styles.textRow}  onPress={() => this.props.navigation.navigate('Login2')}>
                <RkText rkType='primary3 whiteColor'>Already have an account?</RkText>
                <RkText rkType='header6 whiteColor'> Sign in now </RkText>
              </TouchableOpacity>
            </View>
              <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                      this.close()
                  }}
              >
                  <View style={{ flex: 1,
                      flexDirection: 'column',
                      backgroundColor: 'white',padding: 30}}>
                      <View style={{flexDirection: 'column',}}>
                          <TouchableOpacity
                              onPress={() => {
                                  this.setModalVisible(!this.state.modalVisible);
                              }}>
                              <EvilIcons
                                  name="close"
                                  size={34}
                                  style={{color: '#000', paddingRight: 10,textAlign:'right'}}
                              />
                          </TouchableOpacity>
                      </View>
                      <View style={{paddingTop:50}}>
                          <Text>{this.state.legaltext}</Text>
                      </View>
                  </View>
              </Modal>

          </View>
        </View>
      </View>
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
        justifyContent: 'space-around',
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
        marginTop: scaleVertical(10),
        height:scaleVertical(160),
        resizeMode:'contain'
    },
    header: {
        paddingBottom: scaleVertical(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'space-between'
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
        justifyContent: 'space-around',
    },
    footer:{
        justifyContent:'flex-end'
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
}));