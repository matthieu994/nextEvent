import React, { Component } from "react"
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator
} from "react-native"
import { DrawerItems, SafeAreaView, DrawerActions } from "react-navigation"
import firebase from "react-native-firebase"
import { Icon, Avatar } from "react-native-elements"
import { UserContext } from "../Provider"

export default class drawerScreen extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.absoluteIcon}>
              <Icon
                name="arrow-back"
                iconStyle={styles.customDrawerIcon}
                onPress={() =>
                  this.props.navigation.dispatch(DrawerActions.closeDrawer())
                }
                onLongPress={() => Alert.alert("wsh gros tu t'es cru ou")}
                color="#666666"
              />
            </View>
            <Text style={styles.text}>HEAAAADER</Text>
            <View style={styles.imageContainer}>
              <Avatar
                rounded
                size="large"
                // title={this.context.user.email.charAt(0)}
                containerStyle={{ marginBottom: 12 }}
                source={{
                  uri:
                    this.context.user.photoURL ||
                    this.context.defaultProfileImage
                }}
              />
              <Text>{this.context.user.email}</Text>
            </View>
          </View>
          <DrawerItems {...this.props} />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

drawerScreen.contextType = UserContext

const styles = StyleSheet.create({
  text: {
    display: "none"
  },
  absoluteIcon: {
    marginHorizontal: 10,
    position: "absolute",
    top: 12,
    left: 0
  },
  container: {
    paddingTop: 15,
    // flexDirection: "row",
    paddingBottom: 17,
    paddingLeft: 3,
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
  },
  imageContainer: {
    alignItems: "center"
  }
})
