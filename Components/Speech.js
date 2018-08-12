import React from 'react';
import {
  Text,
  Button,
  StyleSheet,
  View,
  ScrollView,
  Image
} from 'react-native';
import { Constants, Speech } from 'expo';
import Touchable from 'react-native-platform-touchable';
import logo from '../assets/logo.png';

if (!Constants.isDevice) {
  alert(
    'Hey, this will not work on the Appetize preview! Open it on your device'
  );
}

class AmountControlButton extends React.Component {
  render() {
    return (
      <Touchable
        onPress={this.props.disabled ? null : this.props.onPress}
        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
      >
        <Text
          style={{
            color: this.props.disabled ? '#ccc' : 'blue',
            fontWeight: 'bold',
            paddingHorizontal: 5,
            fontSize: 18
          }}
        >
          {this.props.title}
        </Text>
      </Touchable>
    );
  }
}

export default class TextToSpeechScreen extends React.Component {
  static navigationOptions = {
    title: 'Speech'
  };

  state = {
    selectedExample: {},
    inProgress: false,
    pitch: 1,
    rate: 0.75
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={logo} style={{ width: 150, height: 150 }} />
          <View style={styles.controlRow}>
            <Button
              disabled={this.state.inProgress}
              onPress={this._speak}
              title="Speak"
            />

            <Button
              disabled={!this.state.inProgress}
              onPress={this._stop}
              title="Stop"
            />
          </View>
          <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
        <View style={styles.instructions}>
          <Text>Tap a section below and press speak to start</Text>
        </View>
        <ScrollView>
          <View style={styles.examplesContainer}>
            {this.props.tour.map(this._renderExample)}
          </View>
        </ScrollView>
      </View>
    );
  }

  _speak = () => {
    const start = () => {
      this.setState({ inProgress: true });
    };
    const complete = () => {
      this.state.inProgress && this.setState({ inProgress: false });
    };

    Speech.speak(this.state.selectedExample.text, {
      language: this.state.selectedExample.language,
      pitch: 1,
      rate: 0.75,
      onStart: start,
      onDone: complete,
      onStopped: complete,
      onError: complete
    });
  };

  _stop = () => {
    Speech.stop();
  };

  _renderExample = (example, i) => {
    let { selectedExample } = this.state;
    let isSelected = selectedExample === example;

    return (
      <Touchable
        key={i}
        hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
        onPress={() => this._selectExample(example)}
      >
        <Text
          style={[styles.exampleText, isSelected && styles.selectedExampleText]}
        >
          {example.text} ({example.language})
        </Text>
      </Touchable>
    );
  };

  _selectExample = example => {
    this.setState({ selectedExample: example });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25
  },
  separator: {
    height: 1,
    backgroundColor: '#6395F2',
    marginTop: 0,
    marginBottom: 15
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#6395F2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6395F2'
  },
  exampleText: {
    fontSize: 15,
    color: '#ccc',
    marginVertical: 10
  },
  examplesContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#DEE9FC'
  },
  selectedExampleText: {
    color: 'black'
  },
  controlText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center'
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  instructions: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
