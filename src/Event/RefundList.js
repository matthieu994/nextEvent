import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { ScrollView } from "react-native-gesture-handler"
import { UserContext } from "../Provider/UserProvider"

export default class RefundList extends Component {
  state = {
    users: {}
  }

  componentWillReceiveProps(nextProps,nextContext) {
    // console.warn(props.event.properties.users)
    let users = {}
    Object.keys(nextProps.event.properties.users).forEach(user => {
      let realUser = nextProps.event.properties.users[user]
      users[user] = {
        name: realUser.displayName,
        familyName: realUser.familyName,
        refunds: {}
      }
    })
    this.setState({ users })
  }

  renderList() {
    let users = this.state.users
    this.props.payments.forEach(payment => {
      payment.properties.to.forEach(to => {
        if (payment.properties.from !== to.email) {
          if (!users[to.email].refunds[payment.properties.from])
            users[to.email].refunds[payment.properties.from] = 0
          users[to.email].refunds[payment.properties.from] += parseFloat(to.owe)
        }
      })
    })

    Object.keys(users).forEach(userID => {
      Object.keys(users[userID].refunds).forEach(refundID => {
        let sum = users[userID].refunds[refundID]

        if (users[refundID].refunds[userID] > 0) {
          let diff = sum - users[refundID].refunds[userID]
          if (diff >= 0) {
            users[userID].refunds[refundID] = diff
            users[refundID].refunds[userID] = 0
          }
          if (diff < 0) {
            users[userID].refunds[refundID] = 0
            users[refundID].refunds[userID] = -diff
          }
        }
      })
    })

    // console.warn(users)

    return Object.keys(users).map(userID => {
      let user = users[userID]
      return Object.keys(users[userID].refunds).map(refundID => {
        let to = users[refundID]
        let sum = users[userID].refunds[refundID]
        if (sum > 0)
          return (
            <View style={styles.refundContainer} key={userID + refundID}>
              <Text style={styles.name}>
                {user.name + " " + user.familyName}
              </Text>
              <Text>{" doit " + sum + "$" + " à "}</Text>
              <Text style={styles.name}>{to.name + " " + to.familyName}</Text>
            </View>
          )
      })
    })
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.renderList()}
      </ScrollView>
    )
  }
}

RefundList.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center"
  },
  refundContainer: {
    width: "90%",
    justifyContent: "center",
    padding: 10,
    marginVertical: 3,
    borderWidth: 0.75,
    borderColor: "grey",
    borderRadius: 5,
    flexDirection: "row"
  },
  name: {
    fontWeight: "bold"
  }
})
