import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Animated,
  TouchableOpacity
} from 'react-native';
import { MapView, Speech, Marker } from 'expo';
import uAreHere from '../assets/uAreHere.png';
import pin from '../assets/pin.png';
import TextToSpeechScreen from './Speech';
import superagent from 'superagent';

export default class Map extends React.Component {
  constructor() {
    super();
    this.map = null;
  }
  state = {
    request: false,
    pageid: 0,
    tour: {},
    title: ''
  };

  componentDidMount() {
    const fit = this.props.marker.map(function(m) {
      return {
        latitude: m.coordinate.latitude,
        longitude: m.coordinate.longitude
      };
    });
    this.map.fitToCoordinates(fit, {
      edgePadding: { top: 1, right: 1, bottom: 1, left: 1 },
      animated: true
    });
  }

  render() {
    console.log(this.state.pageid, '<<<<<<<<<<<,,,');
    const fit = this.props.marker.map(function(m) {
      return {
        latitude: m.coordinate.latitude,
        longitude: m.coordinate.longitude
      };
    });
    if (!this.state.request) {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0181
          }}
          pitchEnabled={true}
          showsCompass={true}
          mapType="satellite"
          ref={ref => {
            this.map = ref;
          }}
          showsBuildings={true}
          onMapReady={() =>
            this.map.fitToCoordinates(
              [
                {
                  latitude: this.props.latitude,
                  longitude: this.props.longitude
                },
                ...fit
              ],
              {
                edgePadding: { top: 150, right: 5, bottom: 5, left: 10 },
                animated: true
              }
            )
          }
        >
          {this.props.marker.map(marker => {
            const coords = {
              latitude: marker.coordinate.latitude,
              longitude: marker.coordinate.longitude
            };
            return (
              <MapView.Marker
                style={styles.map}
                key={marker.pageid}
                coordinate={coords}
                description={`distance: ${marker.distance}m`}
                longPressDelay={1000}
                onLongPress={() => {
                  console.log('hit');
                }}
                onPress={() => {
                  this.map.fitToCoordinates(
                    [
                      {
                        latitude: this.props.latitude,
                        longitude: this.props.longitude
                      },
                      coords
                    ],
                    {
                      edgePadding: {
                        top: 150,
                        right: 5,
                        bottom: 5,
                        left: 10
                      },
                      animated: true
                    }
                  );
                  this.setState({ pageid: marker.pageid, title: marker.title });
                }}
              >
                <View style={styles.pin}>
                  <Text>{marker.title}</Text>
                  <Text style={styles.meters}>{marker.distance}m</Text>
                </View>

                <View style={styles.button}>
                  <Image source={pin} />
                </View>
              </MapView.Marker>
            );
          })}
          <MapView.Marker
            key={'You are here'}
            coordinate={{
              latitude: this.props.latitude,
              longitude: this.props.longitude
            }}
            onPress={() => {
              superagent
                .get(
                  `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${
                    this.state.pageid
                  }rvsection=0action=raw`
                )

                .end((error, response) => {
                  if (error) {
                    console.error(error);
                  } else {
                    const reg = new RegExp('/[0-9]/');
                    const t = JSON.parse(response.text);
                    const m = t.query.pages;
                    const tour = m[this.state.pageid].extract
                      .replace(
                        /<b>|<\/p>|<\/b>|<h2>|<\/h2>|<p>|<span id=|<\/[a-z]+>|<[a-z]+>|<p class="mw-empty-elt">/g,
                        ''
                      )
                      .replace(/"References">References\s\D+\s?\d?/gi, '');
                    this.setState({
                      tour: { language: 'en', text: tour }
                    });
                    this.setState({ request: true });
                  }
                });
            }}
          >
            <View style={styles.uAreHere}>
              <Text style={styles.text}>You are here</Text>
            </View>
            <Image source={uAreHere} />
          </MapView.Marker>
        </MapView>
      );
    } else {
      return (
        <TextToSpeechScreen tour={this.state.tour} title={this.state.title} />
      );
    }
  }
}

const styles = {
  button: {
    zIndex: 99
  },
  pin: {
    backgroundColor: '#DEE9FC',
    padding: 4,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#091834'
  },
  meters: {
    fontSize: 10
  },
  uAreHere: {
    backgroundColor: '#6395F2',
    padding: 4,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DEE9FC'
  },
  text: {
    color: '#DEE9FC'
  }
};
