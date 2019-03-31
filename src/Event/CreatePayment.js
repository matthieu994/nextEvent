import React, { Component } from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  Picker,
  BackHandler,
  DatePickerAndroid,
  TimePickerAndroid,
  Keyboard
} from "react-native"
import {
  Button,
  Input,
  Divider,
  CheckBox,
  ListItem,
  Text
} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import { Header } from "react-navigation"
import moment from "moment"
import "moment/locale/fr"
import { colors } from "../lib"
import { UserContext } from "../Provider/UserProvider"
import { TouchableOpacity } from "react-native-gesture-handler"
import firebase from "react-native-firebase"
import { pick } from "../lib/functions/tools"

export default class CreatePayment extends Component {
  static navigationOptions = {
    title: "Modifier dépense",
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      event: {},
      currentSelect: [],
      selection: [],
      spent: {},
      amount: "",
      name: "",
      date: new Date()
    }
  }

  componentDidMount() {
    const event = this.context.events.find(
      e => e.id === this.context.currentEvent
    )

    this.setState({ event }, () => {
      let selection = []
      this.state.event.properties.users.forEach(item => {
        const user =
          item === this.context.user.email
            ? this.context.user
            : this.context.friends[item]

        selection.push({
          email: item,
          name: user.displayName,
          owe: 0,
          checked: false
        })
      })
      this.setState({ selection })
    })

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("PaymentList")
      return true
    })
  }

  divideSpent() {
    let owe = 0
    const length = this.state.selection.filter(e => e.checked).length

    if (this.state.amount && length)
      owe = (this.state.amount / length).toFixed(2)

    let selection = this.state.selection
    selection.map((item, i) => {
      if (selection[i].checked) selection[i].owe = owe
      else selection[i].owe = 0
    })
    this.setState({ selection })
  }

  checkItem(item) {
    let selection = this.state.selection
    const index = selection.findIndex(e => e.email === item.email)

    selection[index].checked = !selection[index].checked
    this.setState({ selection })
    this.divideSpent()
  }

  async datePicker() {
    DatePickerAndroid.open({
      date: new Date()
    }).then(({ action, year, month, day }) => {
      if (action !== DatePickerAndroid.dismissedAction) {
        this.timePicker(year, month, day)
      } else {
        this.setState({ date: new Date() })
      }
    })
  }

  async timePicker(year, month, day) {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        is24Hour: true
      })
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ date: new Date(year, month, day, hour, minute) })
      } else {
        this.setState({ date: new Date() })
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message)
    }
  }

  getDate() {
    moment.locale("fr")
    return moment(this.state.date).format("dddd D MMMM YYYY à HH:mm")
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  setAmount(amount) {
    amount = parseFloat(amount)
    if (!Number.isInteger(amount) && amount !== "") amount = ""
    this.setState({ amount }, () => this.divideSpent())
  }

  createPayment() {
    let payment = {}
    payment.date = this.state.date
    if (this.state.name) payment.name = this.state.name
    else
      return this.context.dropdownAlert(
        "error",
        "Erreur",
        "Le nom de la dépense ne peut pas être vide."
      )
    if (this.state.amount) payment.amount = this.state.amount
    else
      return this.context.dropdownAlert(
        "error",
        "Erreur",
        "Le montant de la dépense ne peut pas être vide."
      )

    let selection = this.state.selection
      .filter(e => e.checked)
      .map(row => pick(row, ["email", "owe"]))
    if (selection.length > 0) payment.to = selection
    else
      return this.context.dropdownAlert(
        "error",
        "Erreur",
        "Aucun participant n'a été sélectionné."
      )

    if (this.state.currentSelect.length > 0)
      payment.from = this.state.currentSelect
    else payment.from = this.state.selection[0].email

    payment.to = firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .add(payment)
      .then(() => {
        this.props.navigation.navigate("PaymentList")
      })
  }

  render() {
    if (!this.state.event.properties) return null

    return (
      <ScrollView style={styles.container}>
        <Text />
        <View style={[styles.contents, styles.info]}>
          <View style={{}}>
            <Input
              label="Nom"
              placeholder="Nom de la dépense"
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
              inputContainerStyle={[styles.inputs]}
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.inputStyle
              }}
            />
          </View>
          <View style={{ marginTop: 20, flexDirection: "row" }}>
            <View
              style={{
                alignItems: "flex-start",
                width: "50%",
                marginRight: 10
              }}
            >
              <Input
                keyboardType="numeric"
                value={this.state.amount.toString() || ""}
                label="Montant"
                placeholder="Montant à partager"
                inputContainerStyle={[styles.inputs]}
                onChangeText={value => this.setAmount(value)}
              />
            </View>
            <View
              style={{
                flex: 1,
                width: "50%",
                alignItems: "flex-end",
                justifyContent: "flex-end"
              }}
            >
              <TouchableOpacity onPress={() => this.datePicker()}>
                <Text style={[styles.date]}>{this.getDate()}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text>Payé par</Text>
            <Picker
              selectedValue={this.state.currentSelect}
              style={{ backgroundColor: "rgb(210, 225, 230)", height: 50 }}
              onValueChange={item => this.setState({ currentSelect: item })}
            >
              {this.state.event.properties.users.map((item, i) => {
                const user =
                  item === this.context.user.email
                    ? this.context.user
                    : this.context.friends[item]
                return (
                  <Picker.Item key={i} label={user.displayName} value={item} />
                )
              })}
            </Picker>
          </View>
        </View>

        <Divider style={{ backgroundColor: "#b3bfc9", height: 30 }} />
        <View style={[styles.contents, styles.member]}>
          {this.state.selection.map((item, i) => (
            <ListItem
              key={i}
              title={
                <CheckBox
                  title={item.name}
                  size={15}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={item.checked}
                  onPress={() => this.checkItem(item)}
                  containerStyle={{
                    marginLeft: 0,
                    backgroundColor: "rgb(210, 225, 230)"
                  }}
                />
              }
              rightElement={<Text>{item.owe}</Text>}
              containerStyle={{
                padding: 0,
                backgroundColor: "rgb(232, 243, 250)",
                marginBottom: 10
              }}
              //contentContainerStyle={{backgroundColor : 'green'}}
              //rightContentContainerStyle={{ backgroundColor : 'grey'}}
            />
          ))}
        </View>

        <Divider style={{ backgroundColor: "#b3bfc9", height: 30 }} />
        <View style={[styles.contents, styles.extra]}>
          <Text>Commentaires</Text>
          <Text>{this.state.spent.extra}</Text>
        </View>
        <View style={styles.button}>
          <Button title="Créer dépense" onPress={() => this.createPayment()} />
        </View>
      </ScrollView>
    )
  }
}

CreatePayment.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(232, 243, 250)",
    display: "flex"
    //height : (Dimensions.get('window').height - Header.HEIGHT - 24) // extra 24 unit (notif bar)
  },
  contents: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: "rgb(232, 243, 250)"
  },
  inputs: {
    height: 40,
    marginLeft: -10
  },
  date: {
    textAlign: "center",
    alignSelf: "flex-end",
    fontSize: 20
  },
  info: {},
  member: {},
  extra: {}
})
