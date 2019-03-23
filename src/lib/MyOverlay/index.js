import {Button, Input, Overlay, Text} from "react-native-elements";
import React from "react";
import {StyleSheet} from "react-native";
import {colors} from '../'

export class MyOverlay extends React.Component {
  state = {
    text: ''
  }

  render() {
    const children = (
      <>
        <Text style={styles.text}>{this.props.text}</Text>
        <Input
          inputStyle={{ color: colors.inputStyle, display: this.props.inputHidden }}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={this.props.secureTextEntry}
          placeHolder={this.props.inputPlaceholder}
          value={this.state.text}
          onChangeText={value => this.setState({ text: value })}
        />
        <Button
          onPress={() => {
            this.props.action(this.state.text, message => {
              this.setState({ text: '' })
              this.props.remove()
              this.props.dropdownAlert("error", message, "")
            })
          }}
          title={this.props.buttonTitle}
          buttonStyle={styles.button}/>
      </>
    )

    return (
      <Overlay
        isVisible={this.props.visible}
        onBackdropPress={() => {
          this.props.remove()
          this.setState({text: ""})
        }}
        overlayStyle={styles.container}
        height={300}
        children={children}
      />
    )
  }
}

export const types = {
  DELETEUSER: 'DELETEUSER'
}

export const basicOverlay = {
  textOverlay: "",
  action: () => {},
  inputPlaceholder: '',
  secureTextEntry: false,
  buttonTitle: "",
  inputHidden: "flex"
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 5,
    marginVertical: 20,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: colors.inputBackground
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  button: {
    width: '60%',
    marginBottom: 10,
    backgroundColor: colors.redButtonBackground
  },
  text: {
    padding: 5,
    position: 'absolute',
    top: 0
  }
})
