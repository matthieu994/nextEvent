import {Button, Input, Overlay, Text} from "react-native-elements";
import React from "react";
import {StyleSheet} from "react-native";


export const MyOverlay = (props) => {
  let button = props.button
  const children = (
    <>
      <Text style={{top: 10}}>{props.text}</Text>
      {props.options()}
      <Button onPress={button.action} title={button.title} buttonStyle={styles.button}/>
    </>
  )

  return (
    <Overlay
      isVisible={props.visible}
      onBackdropPress={props.remove}
      children={children}
      containerStyle={styles.container}
      height={300}
    />
  )
}

export const deleteUser = () => {
  return (
    <>
      <Input
        inputStyle={{color: "#2E6171"}}
        inputContainerStyle={styles.inputContainer}
        secureTextEntry
        placeHolder="Mot de passe"
      />
    </>
  )
}

export const types = {
  DELETEUSER: 'DELETEUSER'
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 5,
    marginVertical: 20,
    borderRadius: 10,
    borderBottomWidth: 0,
    backgroundColor: "rgb(210, 225, 230)"
  },
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  button: {
    width: '90%',
    marginBottom: 10
  }
})
