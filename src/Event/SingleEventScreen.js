import React, { Component } from "react"
import { StyleSheet, View, BackHandler } from "react-native"
import firebase from "react-native-firebase"
import { Button, Icon, Text, ListItem, Divider } from "react-native-elements"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { colors, bottomContainer } from "../lib"
import { UserContext } from "../Provider/UserProvider"
import BottomButton from "../Modules/BottomButton"
import { sortObject, sortArray } from "../lib/functions/tools"

export default class SingleEventScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Événement"
    }
  }

  state = {
    event: null,
    payments: []
  }

  componentDidMount() {
    let event = this.context.events.find(
      e => e.id === this.context.currentEvent
    )
    this.setState({
      event
    })

    this.setListener()

    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.goBack()
      return true
    })
  }

  componentWillReceiveProps() {
    this.setListener()
  }

  setListener() {
    if (!this.listener) {
      this.listener = firebase
        .firestore()
        .collection("events")
        .doc(this.context.currentEvent)
        .collection("payments")
        .onSnapshot(snapshot => {
          let payments = this.state.payments
          snapshot.docChanges.forEach(s => {
            payments.push({ id: s.doc.id, properties: s.doc.data() })
          })
          this.setState({ payments: sortArray(payments, "date") })
        })
    } else {
      this.listener()
      this.listener = null
      return this.setListener()
    }
    this.getSpentList()
  }

  getSpentList() {
    firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .get()
      .then(docs => {
        let payments = {}
        docs.forEach(doc => {
          payments[doc.id] = doc.data()
        })
        this.setState({ payments: sortObject(payments, "date") })
      })
  }

  componentWillUnmount() {
    this.listener()
    this.backHandler.remove()
  }

  goBack = async eventId => {
    if (eventId)
      this.props.navigation.navigate("EventsList", { delete: eventId })
    else this.props.navigation.navigate("EventsList")
  }

  isOwner() {
    return this.state.event.properties.owner === this.context.user.email
  }

  deleteEvent() {
    const eventId = this.context.currentEvent

    firebase
      .firestore()
      .collection("events")
      .doc(eventId)
      .delete()
      .then(() => {
        this.context.userRef
          .collection("events")
          .doc(eventId)
          .delete()

        this.state.event.properties.users.forEach(friend => {
          firebase
            .firestore()
            .collection("users")
            .doc(friend)
            .collection("events")
            .doc(eventId)
            .delete()
        })

        this.goBack(eventId)
      })
  }

  render() {
    if (!this.state.event) return null

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Chart event={this.state.event} payments={this.state.payments} />
        {this.isOwner() && (
          <View style={[bottomContainer]}>
            <Button
              buttonStyle={{ backgroundColor: colors.redButtonBackground }}
              icon={
                <Icon
                  name="delete"
                  type="material-community"
                  size={18}
                  color="white"
                  containerStyle={{ marginRight: 5 }}
                />
              }
              onPress={() => this.deleteEvent()}
              title="Supprimer cet événement"
            />
          </View>
        )}
        <BottomButton
          onPress={() => this.props.navigation.navigate("CreatePayment")}
        />
      </View>
    )
  }
}

SingleEventScreen.contextType = UserContext

class Chart extends Component {
  renderUsersBalance() {
    return (
      this.props.event.properties.users &&
      this.props.event.properties.users.map(user => (
        <UserBalance key={user} email={user} payments={this.props.payments} />
      ))
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderUsersBalance()}
      </ScrollView>
    )
  }
}

class UserBalance extends Component {
  state = {
    balance: 0
  }

  componentDidMount() {
    if (this.props.email === this.context.user.email)
      this.user = this.context.user
    else this.user = this.context.friends[this.props.email]
  }

  componentWillReceiveProps(props) {
    if (props.payments) this.getBalance()
  }

  getBalance() {
    // Liste des dépenses
    const paymentsTo = this.props.payments.filter(payment =>
      payment.properties.to.find(user => user.email === this.props.email)
    )
    // Liste des dépenses que l'user a payé
    const paymentsFrom = this.props.payments.filter(
      payment => payment.properties.from === this.props.email
    )

    let balance = 0
    paymentsTo.forEach(payment => {
      if (payment.properties.from !== this.props.email) {
        balance -= parseFloat(
          payment.properties.to.find(e => e.email === this.props.email).owe,
          10
        )
      }
    })
    paymentsFrom.forEach(payment => {
      payment.properties.to.forEach(p => {
        if (p.email !== this.props.email) {
          balance += parseFloat(p.owe, 10)
        }
      })
    })
    this.setState({ balance })
  }

  getBalanceValue() {
    return this.state.balance.toFixed(2)
  }

  getBalanceStyle() {
    if (this.state.balance === 0) return styles.nullBalance
    return this.state.balance > 0
      ? styles.positiveBalance
      : styles.negativeBalance
  }

  displayName() {
    return `${this.user.displayName} ${this.user.familyName}`
  }

  render() {
    if (!this.user) return null
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <View style={styles.balanceContainer}>
          <View style={styles.name}>
            <Text>{this.displayName()}</Text>
          </View>
          <View style={[styles.balance, this.getBalanceStyle()]}>
            <Text style={{ color: "#f7f7f7" }}>{this.getBalanceValue()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

UserBalance.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
  balanceContainer: {
    padding: 4,
    margin: 2
  },
  name: {
    alignItems: "center"
  },
  balance: {
    borderRadius: 5,
    padding: 5,
    marginTop: 1,
    elevation: 2,
    minWidth: 100,
    alignItems: "center"
  },
  positiveBalance: {
    backgroundColor: colors.greenButtonBackground
  },
  nullBalance: {
    backgroundColor: "#777777"
  },
  negativeBalance: {
    backgroundColor: colors.redButtonBackground
  }
})

const spentList = [
  {
    name: "Ski 2019",
    from: "nograe117@gmail.com",
    to: ["nograe117@gmail.com", "t@h.fr", "test@mail.com"],
    amount: 120,
    date: new Date(),
    extra: "Journée au ski lourd xptdr"
  },
  {
    name: "Voyage à Bab El Oued",
    from: "test@mail.com",
    to: ["test@mail.com", "nograe117@gmail.com"],
    amount: 420,
    date: new Date(),
    extra: "C'est ben le fun"
  },
  {
    name: "Le week-end des vrais",
    from: "test@mail.com",
    to: ["nograe117@gmail.com", "t@h.fr"],
    amount: 1520,
    date: new Date(),
    extra: "C'était ben le fun ce WE avec les pélo"
  },
  {
    name: "Mojito",
    from: "test@mail.com",
    to: ["test@mail.com", "t@h.fr"],
    amount: 120,
    date: new Date(),
    extra: "C'était ben le fun ce WE avec les pélo"
  }
]
