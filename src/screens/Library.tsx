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
      let color = '#41d750';
      let icon = TrustSVG;
      if (item.status === 'notTrust') {
        color = '#d74141';
        icon = NotTrustSVG;
      } else if (item.status === 'moderation') {
        color = '#d7a041';
        icon = ModerationSVG;
      }

      return (
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <SvgXml
            width={sizeIcon}
            height={sizeIcon}
            xml={(icon as SVGImageElement) as string}
            fill={color}
          />
        </View>
      );
    };
  }

  get listEmptyComponent() {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>Пока вы не сняли не одного видео</Text>
      </View>
    )
  }

  render() {
    const {videoList} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={videoList}
        renderItem={this.renderItem}
        ListEmptyComponent={this.listEmptyComponent}
        keyExtractor={(item) => item.name}
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
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.listItemBackgroundColor,
  },
  title: {
    fontSize: 18,
    color: theme.listItemColor,
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
