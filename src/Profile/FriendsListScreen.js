import React, { Component } from "react"
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  ScrollView,
  RefreshControl,
  Keyboard
} from "react-native"
import firebase from "react-native-firebase"
import {
  Button,
  Icon,
  SearchBar,
  Overlay,
  Image,
  Text,
  Card,
  ListItem
} from "react-native-elements"
import { isEmail } from "validator"
import * as Animation from "react-native-animatable"
import { UserContext } from "../Provider/UserProvider"
import { changeFriendStatus } from "./functions"

export default class FriendsListScreen extends Component {
  static navigationOptions = {
    title: "Mes amis"
  }

  state = {
    search: "",
    searchVisible: null,
    searchResults: null,
    displayResultsModal: false,
    animationRunning: false
  }

  updateSearch = input => {
    if (isEmail(input)) this.searchUser(input)
  }

  searchUser(input) {
    firebase
      .functions()
      .httpsCallable("searchUser")({ email: input })
      .then(res => {
        if (res.data) {
          Keyboard.dismiss()
          res.data.email = input
          this.setState({
            searchResults: res.data,
            displayResultsModal: true
          })
        }
      })
      .catch(error => console.log(error))
  }

  toggleSearchBar() {
    if (this.state.searchVisible == null) this.setState({ searchVisible: true })
    else this.setState({ searchVisible: !this.state.searchVisible })
  }

  startAnimation = () => {
    this.setState({ animationRunning: true })
  }

  endAnimation = () => {
    this.setState({
      // searchResults: null,
      // displayResultsModal: false,
      animationRunning: false
    })
  }

  _onRefresh = () => {
    this.setState({ refreshing: true })
    // fetchData().then(() => {
    //   this.setState({ refreshing: false })
    // })
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View
          style={{
            flex: 1,
            alignItems: "center"
          }}
        >
          <MySearchBar
            searchVisible={this.state.searchVisible}
            updateSearch={this.updateSearch}
            startAnimation={this.startAnimation}
            endAnimation={this.endAnimation}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 10,
              flexWrap: "wrap"
            }}
          >
            {this.state.displayResultsModal && (
              <FriendModal
                friend={this.state.searchResults}
                defaultProfileURL={this.context.defaultProfileURL}
              />
            )}
            <FriendsList
              friends={this.context.user.friends}
              defaultProfileURL={this.context.defaultProfileURL}
            />
          </View>
          <View style={styles.bottom}>
            <Button
              buttonStyle={styles.plusButton}
              background={TouchableNativeFeedback.Ripple(
                "ThemeAttrAndroid",
                true
              )}
              onPress={() => this.toggleSearchBar()}
              raised
              disabled={this.state.animationRunning}
              disabledStyle={{ backgroundColor: "rgb(81, 127, 164)" }}
              icon={
                <Icon
                  name="magnify"
                  type="material-community"
                  size={30}
                  color="white"
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

FriendsListScreen.contextType = UserContext

class FriendsList extends Component {
  render() {
    if (!this.props.friends) return null
    return (
      <View style={{ width: "100%" }}>
        {Object.keys(this.props.friends).map((friend, index) => {
          return (
            <ListItem
              key={index}
              containerStyle={{
                padding: 10,
                width: "100%",
                backgroundColor: "rgb(220, 230, 240)"
              }}
              leftAvatar={{
                containerStyle: { width: 50, height: 50 },
                source: {
                  uri: friend.photoURL || this.props.defaultProfileURL
                }
              }}
              title={`${friend.displayName} ${friend.familyName}`}
            />
          )
        })}
      </View>
    )
  }
}

class FriendModal extends Component {
  render() {
    return (
      <View style={{ width: "100%" }}>
        <ListItem
          containerStyle={{
            padding: 10,
            width: "100%",
            backgroundColor: "rgb(220, 230, 240)"
          }}
          leftAvatar={{
            containerStyle: { width: 50, height: 50 },
            source: {
              uri: this.props.friend.photoURL || this.props.defaultProfileURL
            }
          }}
          rightElement={
            <Button
              title="Ajouter"
              onPress={() =>
                changeFriendStatus(
                  this.context.user.email,
                  this.props.friend.email,
                  "SENT",
                  this.context.setFriend
                )
              }
            />
          }
          title={
            this.props.friend.displayName + " " + this.props.friend.familyName
          }
        />
      </View>
    )
  }
}

FriendModal.contextType = UserContext

class MySearchBar extends Component {
  state = {
    searchBarAnimationEnd: false,
    search: ""
  }

  onChangeText(input) {
    this.setState({ search: input })
    this.props.updateSearch(input)
  }

  endAnimation() {
    !this.props.searchVisible &&
      this.setState({
        searchBarAnimationEnd: true,
        search: ""
      })
    this.props.endAnimation()
  }

  startAnimation() {
    this.setState({ searchBarAnimationEnd: false })
    this.props.startAnimation()
  }

  render() {
    return (
      <Animation.View
        style={[
          styles.top,
          this.state.searchBarAnimationEnd || this.props.searchVisible === null
            ? { display: "none" }
            : null
        ]}
        animation={this.props.searchVisible ? "slideInDown" : "slideOutUp"}
        onAnimationBegin={() => this.startAnimation()}
        onAnimationEnd={() => this.endAnimation()}
        useNativeDriver
      >
        <SearchBar
          platform="android"
          containerStyle={styles.searchBar}
          placeholder="Cherchez un utilisateur..."
          onChangeText={input => this.onChangeText(input)}
          value={this.state.search}
        />
      </Animation.View>
    )
  }
}

const styles = StyleSheet.create({
  top: {
    width: "100%",
    padding: 15,
    paddingBottom: 0
  },
  searchBar: {
    backgroundColor: "rgb(220, 235, 245)",
    borderRadius: 22,
    elevation: 2
  },
  bottom: {
    margin: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 40,
    overflow: "hidden",
    elevation: 2
  },
  plusButton: {
    backgroundColor: "rgb(81, 127, 164)",
    borderRadius: 40,
    width: 62,
    height: 62
  }
})