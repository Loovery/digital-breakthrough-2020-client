import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import config from '../config';
import api from '../services/api';
import PromptNameVideo from '../components/PromptNameVideo';
import to from 'await-to-js';
import {uuid} from '../utils/uuid';
import {connect} from 'react-redux';
import {IReducer} from '../store/reducer';
import {addVideo, initApp} from '../store/action';
import RNFS from 'react-native-fs';

interface Props {
  initApp: Function;
  addVideo: Function;
  userId: string;
}

interface State {
  recording: boolean;
  processing: boolean;
  remaining: number;
  isVisibleSaveDialog: boolean;
}

let textLoading = [
  'в ЦРУ',
  'в КГБ',
  'на PornHub',
  'на YouTube',
  'в TikTok',
  'на Yandex.Disk',
  'в Газпром-Медиа',
];

class Camera extends PureComponent<Props, State> {
  state: State;
  camera: RNCamera | null;
  intervalID: null | any;
  uri: any;
  codec: string | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      recording: false,
      processing: false,
      remaining: config.maxSecVideo,
      isVisibleSaveDialog: false,
    };

    this.camera = null;
    this.intervalID = null;
  }

  componentDidMount() {
    this.props.initApp();
  }

  get stopRecording() {
    return () => {
      this.intervalID && clearInterval(this.intervalID);
      this.camera && this.camera.stopRecording();
    };
  }

  get startRecording() {
    return async () => {
      if (!this.camera) {
        return;
      }

      this.setState({recording: true, remaining: 30});

      this.intervalID = setInterval(() => {
        const {remaining} = this.state;

        let newRemaining = remaining - 1;

        if (newRemaining <= 0) {
          newRemaining = config.maxSecVideo;
          this.stopRecording();
        }

        this.setState({remaining: newRemaining});
      }, 1000);

      const {uri, codec} = await this.camera.recordAsync();
      this.uri = uri;
      this.codec = codec ? codec.toString() : 'mp4';

      this.setState({
        recording: false,
        processing: true,
        isVisibleSaveDialog: true,
      });
    };
  }

  get uploadToServer() {
    return async (uri: any, codec: string, name: string) => {
      this.setState({isVisibleSaveDialog: false});

      const type = `video/${codec}`;
      const videoId = uuid();

      const {userId} = this.props;

      const [errorFile, base64file] = await to(
        RNFS.readFile(uri.substring(7), 'base64'),
      );

      if (errorFile) {
        console.log(errorFile);
        Alert.alert(
          'Упппсииии, что-то пошло не так. Мы конечно дико извиняемся, но попробуйте записать видео ещё раз, так как это видео мы нигде не сохранили',
        );
      }

      const data = {
        name,
        type,
        userId,
        videoId,
        base64: base64file,
      };

      const [error] = await to(api.upload(data));

      if (error) {
        Alert.alert(
          'Упппсииии, что-то пошло не так. Мы конечно дико извиняемся, но попробуйте записать видео ещё раз, так как это видео мы нигде не сохранили',
        );
      } else {
        Alert.alert('Видео загруженно на сервер. Ожидается модерация.');
        this.props.addVideo(videoId, name);
      }

      this.setState({processing: false, remaining: config.maxSecVideo});
    };
  }

  get secondsRemaining() {
    const {remaining} = this.state;

    return (
      <View style={styles.secondsRemaining}>
        <Text style={styles.secondsRemainingTitle}>{remaining}</Text>
      </View>
    );
  }

  render() {
    const {recording, processing, isVisibleSaveDialog} = this.state;

    let button = (
      <TouchableOpacity
        onPress={this.startRecording}
        style={styles.recordContainer}>
        <View style={styles.record} />
      </TouchableOpacity>
    );

    if (recording) {
      button = (
        <TouchableOpacity
          onPress={this.stopRecording}
          style={styles.stopContainer}>
          <View style={styles.stop} />
          <View style={styles.stop} />
        </TouchableOpacity>
      );
    }

    if (processing) {
      button = (
        <View style={styles.processing}>
          <ActivityIndicator animating size={32} />
          <Text style={styles.processingTitle}>
            Загружаю твой видосик{' '}
            {textLoading[Math.floor(Math.random() * 6) + 0]}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
        />

        {this.secondsRemaining}

        <View style={styles.controls}>{button}</View>

        <PromptNameVideo
          isVisible={isVisibleSaveDialog}
          onClose={() =>
            this.setState({processing: false, isVisibleSaveDialog: false})
          }
          onDelete={() =>
            this.setState({processing: false, isVisibleSaveDialog: false})
          }
          onSave={(name: string) => {
            if (!name.length) {
              Alert.alert('Имя не должно быть пустым полем');
              return false;
            }
            this.uploadToServer(this.uri, this.codec, name);
          }}
        />
      </View>
    );
  }
}

interface Styles {
  container: ViewStyle;
  preview: ViewStyle;
  controls: ViewStyle;
  recordContainer: ViewStyle;
  record: ViewStyle;
  stopContainer: ViewStyle;
  stop: ViewStyle;
  processing: ViewStyle;
  secondsRemaining: ViewStyle;
  secondsRemainingTitle: TextStyle;
  processingTitle: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: '100%',
    height: '100%',
  },
  preview: {
    flex: 1,
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  recordContainer: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'red',
    padding: 3,
  },
  record: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  stopContainer: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stop: {
    backgroundColor: 'gray',
    height: '100%',
    width: 20,
  },
  processing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingTitle: {
    color: '#fff',
  },
  secondsRemaining: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  secondsRemainingTitle: {
    color: '#fff',
  },
});

function mapStateToProps(state: IReducer) {
  const {userId} = state;

  return {
    userId,
  };
}

const mapDispatchToProps = {
  initApp,
  addVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Camera);
