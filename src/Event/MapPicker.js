import React, { Component } from "react"
import { StyleSheet, View } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps"
import { Icon, Text, Button } from "react-native-elements"
import firebase from "react-native-firebase"

export default class MapPicker extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerMode: "none",
      header: null
    }
  }

  state = {
    selectCoordinates: null,
    events: []
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
        )
          .then(() => {
            this.setState({ events })
          })
      })
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
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000
      }
    )
  }

  setLocation(e) {
    this.setState({ selectCoordinates: e.nativeEvent.coordinate })
  }

  goBack() {
    const coords =
      this.state.selectCoordinates && this.state.selectCoordinates.latitude
        ? this.state.selectCoordinates
        : this.coords
    this.props.navigation.state.params.setCoords(coords)
    if (!this.props.navigation.state.params.route)
      this.props.navigation.goBack()
    else
      this.props.navigation.state.params.route()
  }

  renderMarkers() {
    if (this.state.events.length < 1) return

    return Object.keys(this.state.events)
      .map(id => {
        const event = this.state.events[id]
        if (!event.coords) return null
        return (
          <Marker
            key={id}
            title={event.name}
            description={event.description}
            coordinate={{
              latitude: event.coords._latitude,
              longitude: event.coords._longitude
            }}
          />
        )
      })
  }

  render() {
    return (
      <View style={styles.container}>
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
          onPress={e => this.setLocation(e)}
          customMapStyle={mapConfig}
          showsCompass
          showsMyLocationButton
          showsUserLocation
          loadingEnabled
          toolbarEnabled
        >
          {this.state.selectCoordinates && (
            <Marker coordinate={this.state.selectCoordinates}>
              <View>
                <Text>
                  {this.props.navigation.state.params.name || "Événement"}
                </Text>
                <Icon
                  type="material-community"
                  size={30}
                  name="account-group"
                />
              </View>
            </Marker>
          )}
          {this.renderMarkers()}
        </MapView>
        <View style={styles.floatingButtonContainer}>
          <Button
            title="Définir la localisation"
            buttonStyle={styles.floatingButton}
            onPress={() => this.goBack()}
          />
        </View>
      </View>
    )
  }
}

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
