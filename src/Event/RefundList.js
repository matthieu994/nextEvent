import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import { Text, Overlay, Input, Button } from "react-native-elements"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { UserContext } from "../Provider/UserProvider"

export default class RefundList extends Component {
  state = {
    users: {},
    overlay: false,
    currentRefund: {
      from: null,
      to: null
    }
  }

  setUsers(props) {
    let users = {}
    Object.keys(props.event.properties.users).forEach(user => {
      let realUser = props.event.properties.users[user]
      users[user] = {
        name: realUser.displayName,
        familyName: realUser.familyName,
        refunds: {}
      }
    })

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

    this.setState({ users })
  }

  componentWillReceiveProps(props) {
    this.setUsers(props)
  }

  renderList() {
    // console.warn(users)
    let users = this.state.users

    return Object.keys(users).map(userID => {
      let user = users[userID]
      return Object.keys(users[userID].refunds).map(refundID => {
        let to = users[refundID]
        let sum = users[userID].refunds[refundID]
        if (sum > 0)
          return (
            <TouchableOpacity
              activeOpacity={0.65}
              key={userID + refundID}
              onPress={() => this.openRefund(userID, refundID)}
            >
              <View style={styles.refundContainer}>
                <Text style={styles.name}>
                  {user.name + " " + user.familyName}
                </Text>
                <Text>{" doit " + sum + "$" + " à "}</Text>
                <Text style={styles.name}>{to.name + " " + to.familyName}</Text>
              </View>
            </TouchableOpacity>
          )
      })
    })
  }

  openRefund(from, to) {
    const currentRefund = { from, to }
    this.setState({ overlay: true, currentRefund })
  }

  renderRefund() {
    if (!this.state.overlay) return <View />

    const from = this.state.users[this.state.currentRefund.from]
    const to = this.state.users[this.state.currentRefund.to]
    const sum = from.refunds[this.state.currentRefund.to]

    return (
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.name}>{from.name + " " + from.familyName}</Text>
          <Text>{" rembourse: "}</Text>
        </View>
        <Input
          keyboardType="number-pad"
          placeholder={`${sum}`}
          defaultValue={`${sum}`}
          inputContainerStyle={{ width: 100 }}
        />
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <Text>{" à "}</Text>
          <Text style={styles.name}>{to.name + " " + to.familyName}</Text>
        </View>
        <Button title="Rembourser" />
      </View>
    )
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Overlay
          width="auto"
          height="auto"
          isVisible={this.state.overlay}
          overlayStyle={{ alignItems: "center" }}
          onBackdropPress={() => this.setState({ overlay: false })}
        >
          {this.renderRefund()}
        </Overlay>
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
