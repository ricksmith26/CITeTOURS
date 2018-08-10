import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { MapView, Speech } from 'expo';
import uAreHere from '../assets/uAreHere.png';
import pin from '../assets/pin.png';

export default class Map extends React.Component {
  constructor() {
    super();
    this.map = null;
  }
  state = {
    request: false
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
    console.log(this.state.request);
    const fit = this.props.marker.map(function(m) {
      return {
        latitude: m.coordinate.latitude,
        longitude: m.coordinate.longitude
      };
    });

    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0181
        }}
        showsCompass={true}
        mapType="satellite"
        ref={ref => {
          this.map = ref;
        }}
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
              edgePadding: { top: 30, right: 5, bottom: 5, left: 10 },
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
              key={marker.pageid}
              coordinate={coords}
              title={marker.title}
              description={`distance: ${marker.distance}m`}
            >
              <View style={styles.button}>
                <Image source={pin} />
                {this.state.request ? (
                  <Button
                    key={marker.pageid}
                    title={'Play '}
                    style={styles.button}
                    onPress={console.log(marker.title, 'button press')}
                  />
                ) : null}
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
          title={'You are here'}
          description={'You are here'}
        >
          <Image source={uAreHere} />
        </MapView.Marker>
      </MapView>
    );
  }
}

const styles = {
  button: {
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 7
  }
};
