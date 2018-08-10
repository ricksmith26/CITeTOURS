import React from 'react';
import { StyleSheet, Text, View, Image, Button, Slider } from 'react-native';
import { MapView } from 'expo';
import logo from './assets/logo.png';
import Map from './Components/Map';
import superagent from 'superagent';

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    error: null,
    request: false,
    distance: 1500,
    markers: [],
    latDel: 0,
    longDel: 0
  };

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }
  componentDidUpdate(_, prevState) {
    if (prevState.request !== this.state.request) {
      superagent
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${
            this.state.distance
          }&gscoord=${this.state.latitude}|${this.state.longitude}&format=json`
        )

        .end((error, response) => {
          if (error) {
            console.error(error);
          } else {
            this.setState({ landmarks: JSON.parse(response.text) });
            const landmarks = { ...this.state.landmarks.query };
            let del = 0;
            let latDel = 0;
            let longDel = 0;
            const markers = landmarks.geosearch.map(function(l) {
              const marker = {
                coordinate: {
                  latitude: l.lat,
                  longitude: l.lon
                },
                title: l.title,
                distance: l.dist,
                pageid: l.pageid
              };
              if (l.dist > del) {
                del = l.dist;
                latDel = l.lat;
                longDel = l.lon;
              }

              return marker;
            });

            this.setState({ markers, latDel, longDel });
          }
        });
    }
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  render() {
    if (this.state.markers.length === 0) {
      return (
        <View style={styles.container}>
          <Image source={logo} />
          <Text>Search radius: {this.state.distance}m</Text>
          <Text>{'\n'}</Text>
          <Slider
            style={{
              width: 300,
              height: 30,
              borderRadius: 50,
              backgroundColor: '#091834',
              color: '#091834'
            }}
            step={50}
            minimumValue={250}
            maximumValue={3000}
            width={200}
            value={1500}
            onValueChange={changedVal => {
              this.setState({ distance: changedVal });
            }}
            style={styles.slider}
          />
          <Text>{'\n'}</Text>
          <Text>{'\n'}</Text>
          <View style={styles.latLongWindow}>
            <Text>Your current location</Text>
            <Text>Latitude: {this.state.latitude}</Text>
            <Text>Longitude: {this.state.longitude}</Text>
          </View>
          <Text>{'\n'}</Text>
          <Text>{'\n'}</Text>
          <Button
            title={'Search nearby Locations'}
            onPress={() => {
              this.setState({ request: true });
            }}
          />
          <Text>{'\n'}</Text>
        </View>
      );
    } else {
      return (
        <Map
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          marker={this.state.markers}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6395F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  latLongWindow: {
    backgroundColor: '#DEE9FC',
    padding: 4,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#091834'
  }
});
