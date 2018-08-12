import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Slider,
  SafeAreaView
} from 'react-native';
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
    markers: []
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
        timeout: 60000,
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
              return marker;
            });

            this.setState({ markers });
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
          <View>
            <Slider
              style={{
                width: 300,
                height: 30,
                borderRadius: 50,
                minimumTrackTintColor: '#091834'
              }}
              style={{ width: 300 }}
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
          </View>
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
