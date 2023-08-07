import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarStrip from './CalendarPackage/CalendarStrip';

const screenHeight = Dimensions.get('window').height;

const SwipeCalendar = () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [dayOffset, setDayOffset] = useState(0);
  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});
  const [eventTask, setEventTask] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventChanges, setEventChanges] = useState(0);
  const handleAddEvent = () => {
    if (eventName) {
      const updatedEvents = {...events};
      updatedEvents[selectedDate] = eventName;
      setEvents(updatedEvents);
      setEventChanges(eventChanges + 1);
    }
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (event, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (event, gestureState) => {
      const SWIPE_THRESHOLD = 50;
      if (gestureState.dx > SWIPE_THRESHOLD) {
        fadeInAnimation.setValue(0);
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

  const onDateSelected = useCallback(
    date => {
      setSelectedDate(date.format('YYYY-MM-DD'));
      const event = events[date.format('YYYY-MM-DD')] || null;
      setEventName(event);
    },
    [modalVisible, events],
  );
  const markedDatesFunc = date => {
    const dayOfMonth = date.date();
    const isNextSixDays = dayOfMonth >= 4 && dayOfMonth <= 9;
    const hasEvent = events[date.format('YYYY-MM-DD')] !== undefined;

    if (isNextSixDays) {
      return {
        dots: [
          {
            color: 'yellow',
          },
          {
            color: hasEvent ? 'red' : 'transparent',
          },
        ],
        events: events[date.format('YYYY-MM-DD')] || null,
      };
    } else {
      return {
        dots: hasEvent
          ? [
              {
                color: 'red',
              },
            ]
          : [],
        events: events[date.format('YYYY-MM-DD')] || null,
      };
    }
  };
  const SwipeComponent = () => (
    <Animated.View
      {...panResponder.panHandlers}>
      <View style={styles.swiper}>
        <View style={styles.swiperChild}></View>
      </View>
    </Animated.View>
  );
  const openModal = () => {
    setEventName(events[selectedDate] || '');
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <CalendarStrip
        useNativeDriver={true}
        key={eventChanges}
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
        iconLeft={null}
        iconRight={null}
      />
      <View style={styles.centerView}>
        <SwipeComponent />
        <TouchableOpacity style={styles.textContainer} onPress={openModal}>
          <Animated.Text style={[styles.text, {opacity: fadeInAnimation}]}>
            {events[selectedDate] ? events[selectedDate] : 'Add Event'}
          </Animated.Text>
        </TouchableOpacity>
        <View style={styles.containerBelow}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View style={[styles.dot, styles.redDot]} />
            <Text style={styles.textIndicator}>Event</Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <View style={[styles.dot, styles.yellowDot]} />
            <Text style={styles.textIndicator}>Cycle</Text>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.label}>
              {events[selectedDate] ? 'Edit' : 'Add'} Event:
            </Text>
            <TextInput
              style={styles.input}
              value={eventName}
              onChangeText={e => setEventName(e)}
              placeholder="Enter event name"
            />
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddEvent}>
                <Text style={styles.addButtonText}>
                  {events[selectedDate] ? 'Edit' : 'Add'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEventName('');
                  setModalVisible(false);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    zIndex: 1000,
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
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
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
    color: 'black',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
  },
  addButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
  containerBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '50%',
    position: 'absolute',
    bottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  yellowDot: {
    backgroundColor: 'yellow',
  },
  redDot: {
    backgroundColor: 'red',
  },
  textIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default React.memo(SwipeCalendar);
