import React, { Component } from "react"
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native"
import { DrawerItems, SafeAreaView, DrawerActions } from "react-navigation"
import { Icon } from "react-native-elements"

export default class drawerScreen extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView>
          <View style={styles.backButtonRow}>
            <Icon
              name="arrow-back"
              iconStyle={styles.customDrawerIcon}
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.closeDrawer())
              }
              onLongPress={() => Alert.alert("wsh gros tu t'es cru ou")}
              color="#666666"
            />
            <Text style={{ color: "#666666" }}>HEAAAADER</Text>
          </View>
          <DrawerItems {...this.props} />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  customDrawerTouch: {
    paddingLeft: 13,
    paddingTop: 15
  },
  customDrawerIcon: { marginHorizontal: 10 },
  backButtonRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 17,
    paddingLeft: 3,
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1
  }
})
