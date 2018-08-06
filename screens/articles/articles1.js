import React from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  RkText,
  RkCard, RkStyleSheet, RkButton,
} from 'react-native-ui-kitten';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import * as firebase from "firebase";
import {withRkTheme} from 'react-native-ui-kitten';
import * as Screens from '../../screens';
import {scale,  scaleVertical} from '../../utils/scale';
import {UIConstants} from '../../config/appConstants';
import { Entypo } from '@expo/vector-icons';

let moment = require('moment');

export class Articles1 extends React.Component {
    static navigationOptions = {
        header: null
    };

  constructor(props) {
    super(props);

    this.renderItem = this._renderItem.bind(this);
    this.state={
        canLoadMoreContent: true,
        data: [],
        lastVisible: '',
        publishedDate:'',
        pickerVisible:false,
    }
      this.getArticles = this.getArticles.bind(this);
  }
    async getArticles() {
        let articledata = [];
        let lastVisible = '';
        let publishedDate = '';
            try {
                await   firebase.database().ref('articles/').orderByChild("publishedDate").limitToLast(8).on('value', (snapshot) => {
                   let customSnapshot = [];
                    snapshot.forEach(function(childSnapshot) {
                        customSnapshot.push(childSnapshot);
                    });
                    customSnapshot.reverse();
                    customSnapshot.forEach(function(childSnapshot) {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        publishedDate = childData.publishedDate;
                        lastVisible = childKey;
                        articledata = [...articledata , childData];
                        // ...
                    });
                    this.setState({
                        data: articledata,
                        lastVisible: lastVisible,
                        publishedDate: publishedDate
                    })
                });
            } catch (error) {
                 // console.log(error.toString());
            }
    }

    componentWillMount(){
        this.getArticles();
    }

  _keyExtractor(post, index) {
    return post.id;
  }

    _loadMoreContentAsync = async () => {
        let articledata = this.state.data;
        let lastVisible = this.state.lastVisible;
        let publishedDate = this.state.publishedDate;
        let canLoadMoreContent = true;
        try {
            await   firebase.database().ref('articles/').orderByChild("publishedDate").endAt(this.state.publishedDate).limitToLast(5).on('value', (snapshot) => {
                let customSnapshot = [];
                snapshot.forEach(function(childSnapshot) {
                    customSnapshot.push(childSnapshot);
                });
                customSnapshot.reverse();
                customSnapshot.shift();
                if(customSnapshot.length < 1){
                    canLoadMoreContent= false;
                }
                customSnapshot.forEach(function (childSnapshot) {
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    publishedDate = childData.publishedDate;
                    lastVisible = childKey;
                    articledata = [...articledata, childData];
                    // ...
                });
                this.setState({
                    data: articledata,
                    lastVisible: lastVisible,
                    canLoadMoreContent: canLoadMoreContent,
                    publishedDate: publishedDate
                })
            });
        } catch (error) {
            // console.log(error.toString());
        }

    }
  _renderItem(info) {
    return (
      <TouchableOpacity
        delayPressIn={70}
        activeOpacity={0.8}
        onPress={() => this.props.navigation.navigate('Article', {id: info.item.id, header: info.item.header, photo: info.item.photo, text: info.item.text, audioUrl: info.item.audioUrl,publishedDate:info.item.publishedDate})}>
          <RkCard rkType='backImg'>
            <View >
                <View style={{
                    shadowOpacity: 0.5,
                    shadowRadius: 9,
                    shadowOffset: { width: 0, height: 0 },
                    borderRadius: 15,
                    backgroundColor: '#d3d3d3',
                    elevation: 5,
                    flex: 1,
                }}>
                    <Image style={styles.imageBorder} rkCardImg source={{uri: info.item.photo }}/>
                </View>
            </View>
          <View style={styles.textRow}>
            <RkText rkType='header4' style={{fontSize: 16, fontWeight: '600',fontFamily:'SF-UI'}} >{(info.item.header).toUpperCase()}  {' ('}{info.item.mediaDuration}{')'}</RkText>
          </View>
        </RkCard>
      </TouchableOpacity>
    )
  }

  render() {
    let info = {};
    info.item = this.state.data[0];
    return (
        <View style={{ backgroundColor: '#fff',height:scaleVertical(680),flex:1}}>
            <View style={styles.menulayout}>
                <View style={styles.menucontainer}>
                    <View style={styles.menutitle} >

                    </View>
                    <View style={ styles.menuleft}>
                        <RkText style={{color:'#8b33ce',fontSize: 24, height: 29, fontWeight:'700',fontFamily:'SF-UI'}}>{'KEFI CASTS'}</RkText>
                    </View>
                    <View style={styles.menuright}>
                        <RkButton
                            rkType='clear'
                            style={styles.navmenu}
                            onPress={() => {
                                this.props.navigation.navigate('DrawerOpen')
                            }}>
                            <RkText rkType='awesome'>
                                <Entypo
                                    name="menu"
                                    size={36}
                                    style={{color: '#212121',backgroundColor: 'white'}}
                                />
                            </RkText>
                        </RkButton>
                    </View>
                </View>
                <View>
                    <RkText style={{color: '#666666', fontSize: 20,height:24,fontWeight:'600',fontFamily:'SF-UI'}}>All Categories</RkText>
                </View>
            </View>
            <View style={{marginTop: 30, backgroundColor:'white'}}>
                <FlatList style={[styles.backgroundImg, styles.root]} data={this.state.data}
                    renderScrollComponent={props => <InfiniteScrollView {...props} />}
                    renderItem={this.renderItem}
                    keyExtractor={this._keyExtractor}
                    canLoadMore={this.state.canLoadMoreContent}
                    onLoadMoreAsync={this._loadMoreContentAsync.bind(this)}/>
            </View>
        </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
    menulayout: {
        height: scaleVertical(94),
        padding: 20,
        paddingBottom: 0,
        justifyContent: 'space-between',
        marginTop: UIConstants.StatusbarHeight
    }  ,
    menucontainer: {
        flexDirection: 'column',
        height: scaleVertical(30),

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
        width: 40
    },
  root: {
      padding: 20,
      flexDirection: 'column',
      height: scaleVertical(540),
      backgroundColor: 'white'
  },
  textRow: {
      marginTop:15,
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: scale(320),
  },
  imageBorder: {
      borderColor: 'white',
      borderRadius: 10,
      height: scaleVertical(165)
  },
}));