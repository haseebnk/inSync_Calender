import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
} from 'react-native';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import LinearGradient from 'react-native-linear-gradient';

const screenHeight = Dimensions.get('window').height;
const viewHeight = 200;

const AgendaPage = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [dayOffset, setDayOffset] = useState(0);
  const [fadeInAnimation] = useState(new Animated.Value(0));
  const [rotationAnimation] = useState(new Animated.Value(0));
  const [swipeDirection, setSwipeDirection] = useState(null);
  const calendarRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (event, gestureState) => {
      rotationAnimation.setValue(0);
      fadeInAnimation.setValue(0);
      if (gestureState.dx > 0) {
        setSwipeDirection('right');
        setDayOffset(prevOffset => prevOffset - 1);
      } else if (gestureState.dx < 0) {
        setSwipeDirection('left');
        setDayOffset(prevOffset => prevOffset + 1);
      }
    },
  });

  const updateSelectedDate = () => {
    const newDate = moment(currentDate)
      .add(dayOffset, 'days')
      .format('YYYY-MM-DD');
    setSelectedDate(newDate);
  };

  React.useEffect(() => {
    rotate();
    updateSelectedDate();
  }, [dayOffset]);

  const fadeIn = () => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const rotate = () => {
    Animated.timing(rotationAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      fadeIn();
    });
  };

  const interpolatedRotateAnimation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      swipeDirection === 'left' ? '0deg' : '360deg',
      swipeDirection === 'left' ? '360deg' : '0deg',
    ],
  });

  return (
    <View style={styles.container}>
      <CalendarStrip
        ref={calendarRef}
        calendarAnimation={{type: 'parallel', duration: 30}}
        daySelectionAnimation={{
          type: 'border',
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: 'white',
        }}
        style={styles.calendarStrip}
        scrollable={true}
        calendarHeaderStyle={{color: 'white'}}
        dateNumberStyle={{color: 'white'}}
        dateNameStyle={{color: 'white'}}
        highlightDateNumberStyle={{color: 'yellow'}}
        highlightDateNameStyle={{color: 'yellow'}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        iconContainer={{flex: 0.1}}
        selectedDate={selectedDate}
      />
      <View style={styles.centerView}>
        <Animated.View
          style={[{transform: [{rotate: interpolatedRotateAnimation}]}]}
          {...panResponder.panHandlers}>
          <LinearGradient
            colors={['grey', '#d4c966']}
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.swiper}>
            <View style={styles.swiperChild}></View>
          </LinearGradient>
        </Animated.View>
        <Animated.Text style={styles.text}>
          {selectedDate.toString()}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  calendarStrip: {
    height: 170,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'black',
  },
  centerView: {
    width: '100%',
    position: 'absolute',
    top: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    flex: 1,
    height: screenHeight - 150,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    position: 'absolute',
    top: screenHeight / 2 - viewHeight / 2,
  },
  swiper: {
    width: 300,
    height: 300,
    backgroundColor: '#7743CE',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  swiperChild: {
    width: 280,
    height: 280,
    backgroundColor: 'black',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default React.memo(AgendaPage);
