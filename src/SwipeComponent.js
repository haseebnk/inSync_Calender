import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
const SwipeComponent = ({
  setSelectedDate,
  setDayOffset,
  dayOffset,
  setModalVisible,
  selectedDate,
  events,
}) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const [eventTask, setEventTask] = useState(1);
  const updateSelectedDate = useCallback(
    offset => {
      setSelectedDate(
        moment(currentDate).add(offset, 'days').format('YYYY-MM-DD'),
      );
    },
    [currentDate],
  );
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (event, gestureState) => {
      const SWIPE_THRESHOLD = 50;
      if (gestureState.dx > SWIPE_THRESHOLD) {
        fadeInAnimation.setValue(0);
        // Right swipe
        setDayOffset(prevOffset => prevOffset - 1);
        if (eventTask > 1) {
          setEventTask(prevEvent => prevEvent - 1);
        }
        fadeIn();
        updateSelectedDate(dayOffset - 1);
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        fadeInAnimation.setValue(0);
        // Left swipe
        setDayOffset(prevOffset => prevOffset + 1);
        setEventTask(prevEvent => prevEvent + 1);
        fadeIn();
        updateSelectedDate(dayOffset + 1);
      }
    },
  });
  React.useEffect(() => {
    fadeIn();
  }, []);
  const fadeIn = useCallback(() => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnimation]);
  return (
    <Animated.View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.swiper}>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => setModalVisible(true)}>
          <Animated.Text style={[styles.text, {opacity: fadeInAnimation}]}>
            {events[selectedDate] ? events[selectedDate] : 'Add Event'}
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SwipeComponent;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiper: {
    width: 300,
    height: 300,
    backgroundColor: '#00AAAF',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperChild: {
    width: 270,
    height: 270,
    backgroundColor: 'white',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  textContainer: {
    // position: 'absolute',
    width: '60%',
    zIndex: 1000,
  },
});
