import React, { Component } from "react"
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Picker,
  Dimensions,
  BackHandler
} from "react-native"
import {
  Button,
  Input,
  Divider,
  CheckBox,
  ListItem
} from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import { Header } from "react-navigation"
import { colors } from "../lib"

export default class ModifyPayment extends Component {
  static navigationOptions = {
    title: "Modifier dépense",
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      currentSelect: this.props.navigation.state.params.list.from,
      selection: [],
      spent: this.props.navigation.state.params.list
    }

    this.state.spent.to.map((item, i) =>
      this.state.selection.push({
        name: this.state.spent.to[i],
        owe: this.state.spent.amount / this.state.spent.to.length,
        checked: true
      })
    )
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("PaymentList")
      return true
    })
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  shareAmount = () => {
    let count = 0
    this.state.selection.forEach(item => {
      count = item.checked ? count + 1 : count
    })

    const share = this.state.amount / count

    const tmp = this.state.selection

    this.state.selection.forEach((item, i) => {
      tmp[i].owe = item.checked ? share : 0
    })

    this.setState({ selection: tmp })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text />
        <View style={[styles.contents, styles.info]}>
          <View style={{}}>
            <Input
              label="Nom"
              placeholder="Nom de la dépense"
              defaultValue={this.state.spent.name}
              inputContainerStyle={[styles.inputs]}
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.inputStyle
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Montant"
              placeholder="Le montant à partager"
              defaultValue={this.state.spent.amount.toString()}
              inputContainerStyle={[styles.inputs]}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Input
              label="Date"
              placeholder="La date"
              defaultValue={this.state.spent.date}
              inputContainerStyle={[styles.inputs]}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text>Payé par</Text>
            <Picker
              selectedValue={this.state.currentSelect}
              style={{ backgroundColor: "rgb(210, 225, 230)", height: 50 }}
              onValueChange={value => this.setState({ currentSelect: value })}
            >
              {this.state.selection.map((item, i) => (
                <Picker.Item key={i} label={item.name} value={item.name} />
              ))}
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
                  onPress={() => (
                    (tmp = this.state.selection),
                    (tmp[i].checked = !item.checked),
                    (tmp[i].owe = 0),
                    this.setState({ selection: tmp }),
                    this.shareAmount()
                  )}
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
          <Button
            title="Next"
            //onPress={() => this.props.navigation.navigate('EventList')}
          />
        </View>
      </ScrollView>
    )
  }
}
/*

*/

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
  info: {},
  member: {},
  extra: {}
})
