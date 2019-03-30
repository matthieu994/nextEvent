import React, { Component } from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native"
import { ListItem } from "react-native-elements"
import { Header } from "react-navigation"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"

/* TEMPLATE DATABASE-> DEPENSE
  spentList : [
    {
      name : str,
      from : str, // email
      to : [], // email
      amount : int,
      currency : str, //GLOBAL EVENT VARIABLE//
      date : date,
      extra : str
    },
    {
      name : str,
      from : str,
      to : [],
      amount : int,
      currency : str,
      date : date,
      extra : str
    }
  ]
*/

export default class PaymentListScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    // console.warn("screenProps: ", screenProps)
    return { tabBarLabel: "Liste des dépenses" }
  }

  constructor() {
    super()
    this.state = {
      spentList: [
        {
          name: "Ski 2019",
          from: "Jean",
          to: ["Jean", "Bob", "Alice", "John"],
          amount: 120,
          date: "02 mars 2019",
          extra: "Journée au ski lourd xptdr"
        },
        {
          name: "Voyage à Bab El Oued",
          from: "Alice",
          to: ["Alice", "Jean"],
          amount: 420,
          date: "01 avril 2018",
          extra: "C'est ben le fun"
        },
        {
          name: "Le week-end des vrais",
          from: "Alice",
          to: [
            "Alice",
            "Bob",
            "Philippe",
            "John",
            "Gerard",
            "Rallye",
            "JeSaisPlus"
          ],
          amount: 1520,
          date: "28 avril 2019",
          extra: "C'était ben le fun ce WE avec les pélo"
        }
      ]
    }
  }

  componentDidMount() {
    this.getSpentList()
  }

  getSpentList() {
    // console.warn(this.props.navigation.state.params)
    // let { event, id } = this.props.navigation.state.params
    // if (!id) return

    firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .get()
      .then(payment => {
        payment.forEach(doc => {
          // TOUTES LES DÉPENSES SONT ICI
        })
      })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>EventList Page</Text>
        <View style={[styles.contents, styles.info]}>
          {this.state.spentList.map((item, i) => (
            <ListItem
              key={i}
              title={this.state.spentList[i].name}
              onPress={() =>
                this.props.navigation.navigate("ModifyPayment", {
                  list: this.state.spentList[i]
                })
              }
            />
          ))}
        </View>
        <View />
        <View style={styles.button} />
      </ScrollView>
    )
  }
}

PaymentListScreen.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    //backgroundColor : 'red',
    display: "flex",
    height: Dimensions.get("window").height - Header.HEIGHT - 24 // extra 24 unit (notif bar)
  }
})
