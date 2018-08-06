import React from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  StyleSheet
} from 'react-native';
import {
  RkStyleSheet,
  RkText,
  RkTheme,
} from 'react-native-ui-kitten';
import * as firebase from "firebase";
import {scale,  scaleVertical} from '../../utils/scale';
import {  WebBrowser } from 'expo';

export class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this._navigateAction = this._navigate.bind(this);
      this.state = {
          tagList: [],
          entiryList: [],
      }
      this.getTags = this.getTags.bind(this);
      this._handlePressButtonAsync = this._handlePressButtonAsync.bind(this);
  }
    componentWillMount(){
      this.getTags();
    }
    async getTags() {
        try {
           await   firebase.database().ref('tagTable/').on('value', (snapshot) => {
                this.setState({tagList: snapshot.val()});
            });
            await   firebase.database().ref('storeLink/').on('value', (snapshot) => {
                this.setState({entiryList: snapshot.val()});
            });

        } catch (error) {

        }

    }
  _navigate(route) {
      this.props.navigation.navigate(route);
  }

  _renderIcon() {
      return <Image style={styles.icon} source={require('../../assets/images/smallLogo.png')}/>;
  }
    _handlePressButtonAsync = async (arg) => {
        let result = await WebBrowser.openBrowserAsync(arg);
        this.setState({ result });
    };

  render() {
      let tagList = this.state.tagList;
      let entiryList = this.state.entiryList;
      let width = Dimensions.get('window').width;

      RkTheme.setType('RkText', 'whiteColor', {
          text:{
              color:'white',
              fontWeight: '300'
          }
      });
          let articleList = Object.entries(tagList).map( tag => {
              return (
                  <TouchableOpacity
                      style={styles.container}
                      key={tag[0]}
                      activeOpacity={1}
                      onPress={() => this.props.navigation.navigate('ArticlesTag', {category: tag[1],tagId:tag[0]})}>
                    <View style={styles.content}>
                      <View style={styles.content}>
                        <RkText rkType='whiteColor' style={{fontWeight:'300', fontSize: 28, fontFamily: 'SF-UI'}}>{tag[1]}</RkText>
                      </View>
                    </View>
                  </TouchableOpacity>
              )
          });
          let entiryListView = Object.entries(entiryList).map( entiry => {
              let htmlConent = "<a href='"+entiry[1].propertyUrl+"'>"+entiry[1].propertyName+"</a>";
              return (
                  <TouchableOpacity
                      style={styles.container}
                      key={entiry[1].propertyName}
                      activeOpacity={1}
                      onPress={() => this._handlePressButtonAsync(entiry[1].propertyUrl)}>
                      <View style={styles.content}>
                          <View style={styles.content}>
                              <RkText rkType='whiteColor' style={{fontWeight:'300', fontSize: 28, fontFamily: 'SF-UI',backgroundColor:'transparent'}}>{entiry[1].propertyName}</RkText>
                          </View>
                      </View>
                  </TouchableOpacity>
              )
          });

    return (
      <View style={styles.root}>

        <ScrollView
          showsVerticalScrollIndicator={false}>
            <View>
                <Image style={styles.backgroundImg} source={require('../../assets/images/Kefi_Designs/bg.png')}/>
            </View>

            <View style={styles.upLayout}>
                <View style={styles.submenuLogowrapper}>
                    <Image style={styles.subMenuLogo} source={require('../../assets/images/Kefi_Designs/keffiLogo1x.png')}/>
                </View>
                <View style={{justifyContent:'space-between', height: scaleVertical(470)}}>
                    <View>
                        <TouchableOpacity
                            style={styles.container}
                            underlayColor={RkTheme.current.colors.button.underlay}
                            activeOpacity={1}
                            onPress={() =>  this.props.navigation.navigate('Articles1')}>
                            <View style={styles.content}>
                                <View style={styles.content}>
                                    <RkText rkType='whiteColor'style={{fontWeight:'700',fontSize: 28, fontFamily:'SF-UI'}}>ALL</RkText>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {articleList}{entiryListView}
                    </View>
                    <View style={{alignItems:'flex-end',}}>
                        <TouchableOpacity style={styles.menuSetting} onPress={() => this.props.navigation.navigate('Settings')}>
                            <Image source={require('../../assets/images/Kefi_Designs/setting-icon-white.png')} style={ {'height':50, 'width':50}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
      </View>
    )
  }
}
let htmlStyle = StyleSheet.create({
    a:{
        fontSize:28,
        fontFamily:'SF-UI',
        fontWeight:'300',
        color:'#fff',
    }
});
let styles = RkStyleSheet.create(theme => ({
    upLayout: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: scaleVertical(16),
    },
    submenuLogowrapper: {
      height: scaleVertical(130),
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    container: {
      height: 45,
      paddingHorizontal: 10,
      justifyContent: 'flex-start',
    },
    subMenuLogo: {
       height: scaleVertical(100),
       resizeMode: 'contain'
    },
  root: {
      paddingTop: 0,
      backgroundColor: theme.colors.screen.base,
      flex:1,
      position: 'absolute',
      zIndex: 2,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
  },
  content: {
      flex: 1,
      height:60,
      alignItems: 'center',
      justifyContent:'center',
  },
  backgroundImg: {
      flex:1,
      resizeMode:'cover',
      height: scaleVertical(680),
      alignSelf: 'flex-start',
  },
  menuSetting:{
      width:50,
      height:50,
      justifyContent:'center',
  },
  icon: {
      marginRight: 13,
      alignItems: 'center',
  }
}));