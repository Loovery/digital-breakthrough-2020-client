import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import theme from '../theme';
import TrustSVG from '../assets/trust.svg';
import NotTrustSVG from '../assets/not_trust.svg';
import ModerationSVG from '../assets/checking.svg';
import {SvgXml} from 'react-native-svg';
import {IReducer, IVideo} from '../store/reducer';
import {initApp} from '../store/action';
import {connect} from 'react-redux';

interface Props {
  userId: string;
  videoList: IVideo[];
}

const sizeIcon: number = 26;

class Library extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      videos: [],
    };
  }

  get renderItem() {
    return ({item}) => {
      let color = theme.trustColor;
      let icon = TrustSVG;
      let text = 'Пройдено';
      if (item.status === 'notTrust') {
        color = theme.notTrustColor;
        icon = NotTrustSVG;
        text = 'Отклонено';
      } else if (item.status === 'moderation') {
        color = theme.moderationColor;
        icon = ModerationSVG;
        text = 'Обрабатывается';
      }

      return (
        <View style={styles.item}>
          <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
          <View style={styles.status}>
            <SvgXml
              width={sizeIcon}
              height={sizeIcon}
              xml={(icon as SVGImageElement) as string}
              fill={color}
            />
            <Text style={{...styles.statusTitle, color}}>{text}</Text>
          </View>
        </View>
      );
    };
  }

  get listEmptyComponent() {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>У Вас нет видео</Text>
      </View>
    );
  }

  render() {
    const {videoList} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={videoList}
        renderItem={this.renderItem}
        ListEmptyComponent={this.listEmptyComponent}
        keyExtractor={(item) => item.id}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.mainBackgroundColor,
    paddingTop: 10,
  },
  item: {
    borderRadius: 2,
    marginHorizontal: 10,
    marginVertical: 2,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: theme.listItemBackgroundColor,
  },
  title: {
    fontSize: 18,
    color: theme.listItemColor,
    width: 250,
  },
  status: {
    alignItems: 'center',
    width: 100,
  },
  statusTitle: {
    fontSize: 10,
    color: '#fff',
  },
});

function mapStateToProps(state: IReducer) {
  const {userId, videoList} = state;

  return {
    userId,
    videoList,
  };
}

const mapDispatchToProps = {
  initApp,
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);
