import React, { Component } from "react"
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  ScrollView,
  RefreshControl,
  Text
} from "react-native"
import firebase from "react-native-firebase"
import { Button, Icon, SearchBar, Overlay, Card } from "react-native-elements"
import { isEmail } from "validator"
import * as Animation from "react-native-animatable"
import { UserContext } from "../Provider/UserProvider"

export default class FriendsListScreen extends Component {
  static navigationOptions = {
    title: "Mes amis"
  }

  state = {
    search: "",
    searchVisible: true,
    searchResults: null
  }

  updateSearch(input) {
    this.setState({ search: input })

    if (isEmail(input)) return this.searchUser(input)

    // if (this.timeout) clearTimeout(this.timeout)
    // if (input.length >= 3)
    //   this.timeout = setTimeout(() => {
    //     this.searchUser(input)
    //   }, 1500)
    return null
  }

  searchUser(input) {
    firebase
      .functions()
      .httpsCallable("searchUser")({ email: input })
      .then(res => {
        this.setState({ searchResults: res.data })
      })
      .catch(error => console.log(error))
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
          <Animation.View
            style={styles.top}
            animation={this.state.searchVisible ? "slideInDown" : "slideOutUp"}
          >
            <SearchBar
              platform="android"
              containerStyle={styles.searchBar}
              placeholder="Cherchez un utilisateur..."
              onChangeText={input => this.updateSearch(input)}
              value={this.state.search}
            />
          </Animation.View>
          {this.state.searchResults && (
            <Overlay
              isVisible={this.state.searchResults != null}
              windowBackgroundColor="rgba(255, 255, 255, 0.5)"
              onBackdropPress={() => this.setState({ searchResults: null })}
              width="70%"
              height="auto"
            >
              <Card
                title={`${this.state.searchResults.displayName} ${
                  this.state.searchResults.familyName
                }`}
                image={{
                  uri: this.state.searchResults.photoURL || this.context.defaultProfileURL
                }}
              >
                <Button
                  backgroundColor="#03A9F4"
                  buttonStyle={{
                    borderRadius: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 0
                  }}
                  title={"Inviter " + this.state.searchResults.displayName}
                />
              </Card>
            </Overlay>
          )}
          <View style={styles.bottom}>
            <Button
              buttonStyle={styles.plusButton}
              background={TouchableNativeFeedback.Ripple(
                "ThemeAttrAndroid",
                true
              )}
              onPress={() =>
                this.setState({ searchVisible: !this.state.searchVisible })
              }
              raised
              icon={
                <Icon
                  name="plus"
                  type="material-community"
                  size={15}
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

const styles = StyleSheet.create({
  top: {
    width: "100%",
    padding: 10
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
    right: 0
  },
  plusButton: {
    borderRadius: 100,
    width: 50,
    height: 50
  }
})
