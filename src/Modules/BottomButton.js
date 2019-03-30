import React, { Component } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import { Button, Icon } from "react-native-elements"

export default class BottomButton extends Component {
  render() {
    return (
      <View
        style={{
          margin: 20,
          position: "absolute",
          bottom: 0,
          right: 0,
          borderRadius: 40,
          overflow: "hidden",
          elevation: 2
        }}
      >
        <Button
          buttonStyle={{
            backgroundColor: "rgb(81, 127, 164)",
            borderRadius: 40,
            width: 62,
            height: 62
          }}
          background={TouchableNativeFeedback.Ripple("ThemeAttrAndroid", true)}
          onPress={this.props.onPress}
          raised
          icon={
            <Icon
              name="plus"
              type="material-community"
              size={30}
              color="white"
            />
          }
        />
      </View>
    )
  }
}
