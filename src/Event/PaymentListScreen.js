import React, { Component } from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback
} from "react-native"
import { ListItem, Text, Icon } from "react-native-elements"
import { Header } from "react-navigation"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"
import BottomButton from "../Modules/BottomButton"
import { colors } from "../lib"
import {
  sortObject,
  sortArray,
  listenerFunction,
  displayName,
  displayDate
} from "../lib/functions/tools"
import {
  TouchableOpacity,
  TouchableHighlight
} from "react-native-gesture-handler"

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
            const payments = listenerFunction(snapshot, this.state.payments)
            this.setState({ payments })
          })
      })
  }

  componentWillUnmount() {
    this.listener()
  }

  getSpentList() {
    if (this.state.payments.length < 1)
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

  deletePayment(id) {
    firebase
      .firestore()
      .collection("events")
      .doc(this.context.currentEvent)
      .collection("payments")
      .doc(id)
      .delete()
  }

  renderPayments() {
    return this.state.payments.map((item, i) => {
      const user = this.context.events.find(
        e => e.id === this.context.currentEvent
      ).properties.users[item.properties.from]
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          key={i}
          onPress={() => this.props.navigation.navigate("ModifyPayment", item)}
        >
          <View style={styles.paymentContainer}>
            <ListItem
              containerStyle={styles.payment}
              title={item.properties.name}
              rightTitle={item.properties.amount + "€"}
              rightContentContainerStyle={{
                flex: 1,
                margin: 0
              }}
              rightTitleStyle={{ textAlign: "right" }}
              rightIcon={
                item.properties.from === this.context.user.email && (
                  <Icon
                    type="material-community"
                    name="delete"
                    iconStyle={{ color: colors.redButtonBackground }}
                    containerStyle={{ margin: 0 }}
                    onPress={() => this.deletePayment(item.id)}
                  />
                )
              }
              subtitle={`${displayName(user)}, le ${displayDate(
                item.properties.date,
                "DD/MM"
              )}`}
              subtitleStyle={{
                fontStyle: "italic",
                fontSize: 12,
                flex: 1,
                textAlign: "left"
              }}
              leftAvatar={{
                rounded: true,
                size: 35,
                source: {
                  uri: user.photoURL || this.context.defaultProfileURL
                }
              }}
            />
          </View>
        </TouchableOpacity>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.list}>
            {this.state.payments.length < 1 && (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text>Aucune dépense</Text>
              </View>
            )}
            {this.renderPayments()}
          </View>
        </ScrollView>
        <BottomButton
          width={60}
          style={{ alignItems: "center" }}
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
    margin: 0,
    padding: 1,
    marginHorizontal: 4
  },
  paymentContainer: {
    marginTop: 5,
    paddingLeft: 8,
    paddingRight: 3,
    paddingBottom: 8,
    paddingTop: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "black"
  }
})
