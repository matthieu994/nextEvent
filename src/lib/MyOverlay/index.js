import { Button, Divider, Input, Overlay, Text } from "react-native-elements";
import React from "react";
import { AppState, StyleSheet, View } from "react-native";
import { colors } from '../'

export class MyOverlay extends React.Component {
  state = {
    text: '',
    text2: ''
  }

  componentDidMount(): void {
    AppState.addEventListener("change", () => this.props.remove())
  }

  render() {
    const children = (
      <>
        <Input
          inputStyle={{
            color: colors.inputStyle,
            display: this.props.inputHidden
          }}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={this.props.secureTextEntry}
          placeholder={this.props.inputPlaceholder}
          value={this.state.text}
          onChangeText={value => this.setState({ text: value })}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Input
          inputStyle={{
            color: colors.inputStyle,
            display: this.props.secondTextEntry ? 'flex' : 'none'
          }}
          inputContainerStyle={styles.inputContainer}
          secureTextEntry={this.props.secureTextEntry2}
          placeholder={this.props.inputPlaceholder2}
          value={this.state.text2}
          onChangeText={value => this.setState({ text2: value })}
          placeholderTextColor={colors.inputPlaceholder}
        />
        <Button
          onPress={() => {
            this.props.action({ text: this.state.text, text2: this.state.text2 }, message => {
              this.setState({ text: '' })
              this.props.dropdownAlert("error", message, "")
            })
            this.props.remove()
          }}
          title={this.props.buttonTitle}
          buttonStyle={styles.button}/>
      </>
    )

    const taille = this.props.secondTextEntry ? 250 : 180

    return (
      <Overlay
        isVisible={this.props.visible}
        onBackdropPress={() => {
          this.props.remove()
          this.setState({ text: "" })
        }}
        overlayStyle={styles.container}
        height={taille}
        children={children}
      />
    )
  }
}

export const types = {
  DELETEUSER: 'DELETEUSER',
  CHANGEPASSWORD: 'CHANGEPASSWORD',
  CHANGENAMES: 'CHANGENAMES'
}

export const basicOverlay = {
  action: () => {
  },
  inputPlaceholder: '',
  inputPlaceholder2: "",
  secureTextEntry: true,
  secureTextEntry2: true,
  secondTextEntry: false,
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
    marginBottom: 10,
    backgroundColor: colors.redButtonBackground
  }
})
