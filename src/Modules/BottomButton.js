import React, { Component } from "react"
import { View, TouchableNativeFeedback } from "react-native"
import { Button, Icon } from "react-native-elements"

export default class BottomButton extends Component {
  render() {
    return (
      <View
        style={[
          {
            flex: 1,
            width: "100%",
            position: "absolute",
            bottom: 0,
            padding: 10,
            alignItems: "flex-end"
          },
          this.props.style
        ]}
      >
        <View
          style={[
            {
              borderRadius: 50,
              overflow: "hidden",
              elevation: 2,
              width: this.props.width || 60,
              height: this.props.width || 60
            }
          ]}
        >
          <Button
            buttonStyle={{
              backgroundColor: "rgb(81, 127, 164)",
              borderRadius: 50,
              width: this.props.width || 60,
              height: this.props.width || 60
            }}
            background={TouchableNativeFeedback.Ripple(
              "ThemeAttrAndroid",
              true
            )}
            onPress={this.props.onPress}
            title={this.props.title}
            raised
            icon={
              <Icon
                name={this.props.name || "plus"}
                type={this.props.type || "material-community"}
                size={this.props.size || 30}
                color="white"
              />
            }
          />
        </View>
      </View>
    )
  }
}
