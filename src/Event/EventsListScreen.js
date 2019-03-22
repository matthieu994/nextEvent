import React, {Component} from "react"
import {View, Text} from "react-native"
import firebase from 'react-native-firebase'
import {DrawerActions} from "react-navigation"
import {Button, Icon} from "react-native-elements"
import {colors} from '../lib'

export default class EventsListScreen extends Component {
  static navigationOptions = () => ({
    title: "Mes événements"
  })

  state = {
    t: {}
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          onPress={() =>
            this.props.navigation.navigate('PaymentList')
          }
          title="Voir ma liste de dépense"
        />
        <Button
          onPress={() => {
            let obj = {
              name: 'Ski 2019',
              from: 'Jean',
              to: ['Jean', 'Bob', 'Alice', 'John'],
              amount: 120,
              date: '2019-03-19',
              comment: "Journée au ski lourd xptdr"
            }


            //this.props.navigation.dispatch(DrawerActions.toggleDrawer())
            const vr = () => { firebase
              .firestore()
              .collection("events")
              .doc("6gkAVRHVAD5kYKotT0PU")
              .collection("payments")
              .get()
              .then((docs) => {
                let obj = {}
                docs.forEach(doc => {
                  obj[doc.id] = doc.data()
                })
                console.log(obj.tre)
                this.setState({t: obj.tre})
              })}

            firebase
              .firestore()
              .collection("events")
              .doc("6gkAVRHVAD5kYKotT0PU")
              .collection("payments")
              .doc("tre")
              .set(obj)
              .then(vr())
          }}
          title="Voir mes amis"
        />

        <Text>
          {this.state.t.name}
        </Text>
        <Text>
          {this.state.t.amount}
        </Text>
        <Text>
          {this.state.t["from"]}
        </Text>
        <Text>
          {this.state.t.comment}
        </Text>
      </View>
    )
  }
}
