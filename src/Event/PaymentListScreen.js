import React, { Component } from "react"
import { StyleSheet, View, ScrollView, Dimensions } from "react-native"
import { ListItem, Text } from "react-native-elements"
import { Header } from "react-navigation"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"
import BottomButton from "../Modules/BottomButton"
import { sortObject, sortArray } from "../lib/functions/tools"

/* TEMPLATE DATABASE-> DEPENSE
  spentList : [
    {
      name : str,
      date : date,
      from : str, // email
      to : [], // email
      amount : int,
      currency : str, //GLOBAL EVENT VARIABLE//
      payback: bool // Remboursement
      extra : str
    }
  ]
*/

export default class PaymentListScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    // console.warn("screenProps: ", screenProps)
    return { tabBarLabel: "Liste des dépenses" }
  }

  state = {
    payments: []
  }

  componentDidMount() {
    this.getSpentList()

    this.listener = firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .onSnapshot(() => {
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
      })
  }

  componentWillUnmount() {
    this.listener()
  }

  getSpentList() {
    firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .get()
      .then(payment => {
        let payments = {}
        payment.forEach(doc => {
          payments[doc.id] = doc.data()
        })
        this.setState({ payments: sortObject(payments, "date") })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.list}>
            {this.state.payments.length < 1 && <Text>Aucune dépense</Text>}
            {this.state.payments.map((item, i) => (
              <ListItem
                containerStyle={styles.payment}
                key={i}
                title={item.properties.name}
                onPress={() =>
                  this.props.navigation.navigate("ModifyPayment", {
                    list: item
                  })
                }
              />
            ))}
          </View>
        </ScrollView>
        <BottomButton
          onPress={() => this.props.navigation.navigate("CreatePayment")}
        />
      </View>
    )
  }
}

PaymentListScreen.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1
  },
  list: {
    flex: 1
  },
  payment: {
    borderWidth: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: "black"
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
