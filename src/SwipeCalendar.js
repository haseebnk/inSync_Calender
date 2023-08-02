import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
  Modal,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import {TextInput} from 'react-native-paper';

const screenHeight = Dimensions.get('window').height;

const SwipeCalendar = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [dayOffset, setDayOffset] = useState(0);
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const rotationAnimation = useRef(new Animated.Value(0)).current;
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState('');
  const [eventTask, setEventTask] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const handleAddEvent = () => {
    setEvents(eventName);
    setModalVisible(false);
  };
  const updateSelectedDate = useCallback(
    offset => {
      setSelectedDate(
        moment(currentDate).add(offset, 'days').format('YYYY-MM-DD'),
      );
    },
    [currentDate],
  );
  React.useEffect(() => {
    rotate();
    fadeIn();
    updateSelectedDate(0);
  }, []);
  const fadeIn = useCallback(() => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnimation]);

  const rotate = useCallback(() => {
    Animated.timing(rotationAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [rotationAnimation]);

  const interpolatedRotateAnimation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (event, gestureState) => {
      rotationAnimation.setValue(0);
      fadeInAnimation.setValue(0);
      const SWIPE_THRESHOLD = 50;
      if (gestureState.dx > SWIPE_THRESHOLD) {
        // Right swipe
        setDayOffset(prevOffset => prevOffset - 1);
        if (eventTask > 1) {
          setEventTask(prevEvent => prevEvent - 1);
        }
        rotate();
        fadeIn();
        updateSelectedDate(dayOffset - 1);
      } else if (gestureState.dx < -SWIPE_THRESHOLD) {
        // Left swipe
        setDayOffset(prevOffset => prevOffset + 1);
        setEventTask(prevEvent => prevEvent + 1);
        rotate();
        fadeIn();
        updateSelectedDate(dayOffset + 1);
      }
    },
  });

  const onDateSelected = useCallback(
    date => {
      setSelectedDate(date.format('YYYY-MM-DD'));
    },
    [modalVisible],
  );
  const markedDatesFunc = date => {
    const dayOffset = 4 - date.date();

    const nextFourDates = Array.from({length: 7}, (_, i) => {
      return moment(date)
        .add(dayOffset + i, 'days')
        .format('YYYY-MM-DD');
    });

    if (nextFourDates.includes(date.format('YYYY-MM-DD'))) {
      return {
        dots: [
          {
            color: 'yellow',
          },
        ],
      };
    }

    return {};
  };
  const SwipeComponent = () => (
    <Animated.View
      style={[{transform: [{rotate: interpolatedRotateAnimation}]}]}
      {...panResponder.panHandlers}>
      <View style={styles.swiper}>
        <View style={styles.swiperChild}></View>
      </View>
    </Animated.View>
  );
  return (
    <View style={styles.container}>
      <CalendarStrip
        calendarAnimation={{type: 'parallel', duration: 30}}
        daySelectionAnimation={{
          type: 'border',
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: 'white',
        }}
        markedDates={markedDatesFunc}
        style={styles.calendarStrip}
        scrollable={true}
        calendarHeaderStyle={{color: 'white'}}
        dateNumberStyle={{color: 'grey'}}
        dateNameStyle={{color: 'grey'}}
        highlightDateNumberStyle={{color: 'yellow'}}
        highlightDateNameStyle={{color: 'yellow'}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        iconContainer={{flex: 0.1}}
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
        iconRightStyle={{transform: [{rotate: '180deg'}]}} // Rotate the right icon image to 30 degrees
        iconLeft={{
          uri: 'https://w7.pngwing.com/pngs/65/272/png-transparent-chevron-chevron-left-left-user-interface-icon-thumbnail.png',
        }}
        iconRight={{
          uri: 'https://w7.pngwing.com/pngs/65/272/png-transparent-chevron-chevron-left-left-user-interface-icon-thumbnail.png',
        }}
      />
      <View style={styles.centerView}>
        <SwipeComponent />
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => setModalVisible(!modalVisible)}>
          <Animated.Text style={[styles.text, {opacity: fadeInAnimation}]}>
            {selectedDate.toString()}
            {events}
          </Animated.Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Add Event:</Text>
            <TextInput
              style={styles.input}
              value={eventName}
              onChangeText={e => setEventName(e)}
              placeholder="Enter event name"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  textContainer: {
    position: 'absolute',
    width: '60%',
  },
  swiper: {
    width: 300,
    height: 300,
    backgroundColor: 'yellow',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  swiperChild: {
    width: 270,
    height: 270,
    backgroundColor: 'black',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    marginBottom: 20,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'gray',
    fontSize: 18,
  },
});

export default React.memo(SwipeCalendar);
