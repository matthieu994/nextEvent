import React, { Component } from "react"
import firebase from "react-native-firebase"
import { View } from "react-native"
import { Icon } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"

export const BottomBarHeader = {
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: {
      elevation: 5,
      backgroundColor: "rgb(39, 137, 173)"
    },
    headerTitleStyle: {
      color: "white"
    },
    title: navigation.getParam("eventName", "Événement"),
    headerLeft: (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("Main")}
        style={{ padding: 10 }}
      >
        <Icon name="arrow-back" color="rgb(240, 240, 240)" />
      </TouchableOpacity>
    ),
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("AddFriend")}
          style={{ paddingVertical: 10, paddingHorizontal: 8 }}
        >
          <Icon
            name="account-plus"
            size={32}
            type="material-community"
            color="rgb(240, 240, 240)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("CreatePayment")}
          style={{ paddingVertical: 10, paddingHorizontal: 8 }}
        >
          <Icon
            name="cash"
            size={32}
            type="material-community"
            color="rgb(240, 240, 240)"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("EditEvent")}
          style={{ padding: 8, marginTop: 2 }}
        >
          <Icon
            name="pencil"
            size={32}
            type="material-community"
            color="rgb(240, 240, 240)"
          />
        </TouchableOpacity>
      </View>
    )
  })
}
