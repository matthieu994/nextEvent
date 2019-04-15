import React, { Component } from "react"
import { StyleSheet, View } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps"
import { Icon, Text, Button, Overlay } from "react-native-elements"
import firebase from "react-native-firebase"
import { UserContext } from "../Provider/UserProvider"
import { colors } from "../lib"

export default class EventsMap extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerMode: "none",
      header: null
    }
  }

  state = {
    events: [],
    overlay: null
  }

  getEvents() {
    firebase
      .firestore()
      .collection("events")
      .get()
      .then(snapshot => {
        let events = {}
        // snapshot.forEach(doc => {
        //   events[doc.id] = {}
        // })
        Promise.all(
          snapshot.docs.map(doc => {
            return firebase
              .firestore()
              .collection("events")
              .doc(doc.id)
              .get()
              .then(event => {
                events[doc.id] = event.data()
              })
          })
        ).then(() => {
          this.setState({ events })
        })
      })
  }

  joinEvent(id) {
    this.setState({ overlay: null })
    this.context.userRef
      .collection("events")
      .doc(id)
      .set()
      .then(() => {
        firebase
          .firestore()
          .collection("events")
          .doc(id)
          .update({
            users: firebase.firestore.FieldValue.arrayUnion(
              this.context.user.email
            )
          })
        this.props.navigation.state.params.refreshEvents()
        this.context.setCurrentEvent(id)
        this.props.navigation.goBack()
      })
  }

  leaveEvent(id) {
    this.context.userRef
      .collection("events")
      .doc(id)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("events")
          .doc(id)
          .update({
            users: firebase.firestore.FieldValue.arrayRemove(
              this.context.user.email
            )
          })
        this.props.navigation.state.params.refreshEvents()
        this.getEvents()
        this.setState({ overlay: null })
      })
  }

  renderEvent(id) {
    if (!id) return <View />
    let event = this.state.events[id]
    let button = (
      <Button
        buttonStyle={{ margin: 5 }}
        title="Rejoindre l'événement"
        onPress={() => this.joinEvent(id)}
      />
    )

    if (this.context.events.find(event => event.id === id)) {
      button = (
        <Button
          buttonStyle={{
            margin: 5,
            backgroundColor: colors.redButtonBackground
          }}
          title="Quitter l'événement"
          onPress={() => this.leaveEvent(id)}
        />
      )
    }

    return (
      <View style={{ alignItems: "center" }}>
        <Text h2>{event.name}</Text>
        <Text h4 style={{ marginVertical: 8 }}>
          {event.description}
        </Text>
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontStyle: "italic", margin: 5 }}>
            Participants:
          </Text>
          {event.users.map(user => (
            <Text key={user}>{user}</Text>
          ))}
        </View>
        {button}
      </View>
    )
  }

  componentDidMount() {
    this.getEvents()
    navigator.geolocation.getCurrentPosition(
      position => {
        this.coords = position.coords
        this._map.animateToRegion({
          latitude: this.coords.latitude,
          longitude: this.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121
        })
      },
      error => console.warn(error),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
    )
  }

  renderMarkers() {
    if (this.state.events.length < 1) return

    return Object.keys(this.state.events).map(id => {
      const event = this.state.events[id]
      if (!event.coords) return null
      return (
        <Marker
          key={id}
          coordinate={{
            latitude: event.coords._latitude,
            longitude: event.coords._longitude
          }}
        >
          <Callout
            style={{ flex: 1 }}
            onPress={() => this.setState({ overlay: id })}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {event.name}
            </Text>
            <Text>{event.description}</Text>
          </Callout>
        </Marker>
      )
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Overlay
          width="auto"
          height="auto"
          isVisible={this.state.overlay != null}
          overlayStyle={{ alignItems: "center" }}
          onBackdropPress={() => this.setState({ overlay: null })}
        >
          {this.renderEvent(this.state.overlay)}
        </Overlay>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 45.5087,
            longitude: -73.554,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
          ref={component => (this._map = component)}
          customMapStyle={mapConfig}
          showsCompass
          showsMyLocationButton
          showsUserLocation
          loadingEnabled
          toolbarEnabled
        >
          {this.renderMarkers()}
        </MapView>
        <View style={styles.floatingButtonContainer}>
          <Button
            title="Retour"
            buttonStyle={styles.floatingButton}
            onPress={() => this.props.navigation.goBack()}
          />
        </View>
      </View>
    )
  }
}

EventsMap.contextType = UserContext

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 10
  },
  floatingButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(78, 172, 178, 0.9)"
  }
})

const mapConfig = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd"
      }
    ]
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735"
      }
    ]
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6"
      }
    ]
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90"
      }
    ]
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c"
      }
    ]
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530"
      }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6"
      }
    ]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967"
      }
    ]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62"
      }
    ]
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58"
      }
    ]
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555"
      }
    ]
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63"
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae"
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77"
      }
    ]
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd"
      }
    ]
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2"
      }
    ]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d"
      }
    ]
  }
]
