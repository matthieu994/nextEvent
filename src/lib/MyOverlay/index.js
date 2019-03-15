import {Button, Input, Overlay, Text} from "react-native-elements";
import React from "react";
import {StyleSheet} from "react-native";
import {colors} from '../'

export const MyOverlay = (props) => {
  const children = (
    <>
      <Text h4 style={styles.text}>{props.text}</Text>
      {props.options}
    </>
  )

  return (
    <Overlay
      isVisible={props.visible}
      onBackdropPress={props.remove}
      overlayStyle={styles.container}
      height={300}
      children={children}
    />
  )
}

export const deleteUser = (button) => {
  let password = ""
  return (
    <>
      <Input
        inputStyle={{color: colors.inputStyle}}
        inputContainerStyle={styles.inputContainer}
        secureTextEntry
        placeHolder="Mot de passe"
        ref={(r) => password = r}
      />
      <Button onPress={()=> {
        button.action(password)
        password = ""
      }} title="Supprimer mon compte" buttonStyle={styles.button}/>
    </>
  )
}

export const types = {
  DELETEUSER: 'DELETEUSER'
}

export const basicOverlay = {
  options: () => {},
  textOverlay: "",
  action: () => {}
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
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '60%',
    marginBottom: 10,
    backgroundColor: colors.redButtonBackground
  }
})
