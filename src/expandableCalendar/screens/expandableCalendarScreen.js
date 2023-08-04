import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';
import SwipeComponent from '../../SwipeComponent';
export const themeColor = '#00AAAF';
export const lightThemeColor = '#f2f7f7';

export function getTheme() {
  const disabledColor = 'grey';

  return {
    arrowColor: 'black',
    arrowStyle: {padding: 0},
    expandableKnobColor: themeColor,
    monthTextColor: 'black',
    textMonthFontSize: 16,
    textMonthFontFamily: 'HelveticaNeue',
    textMonthFontWeight: 'bold',
    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: 'normal',
    dayTextColor: themeColor,
    todayTextColor: '#af0078',
    textDayFontSize: 18,
    textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: '500',
    textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: 'white',
    textDisabledColor: disabledColor,
    dotColor: themeColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: {marginTop: -2},
  };
}
const ExpandableCalendarScreen = props => {
  const {weekView} = props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });
  const currentDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [agendaItems, setAgendaItems] = useState([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  function getMarkedDates() {
    const marked = {};
    agendaItems?.forEach(item => {
      if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
        marked[item.title] = {marked: true};
      } else {
        marked[item.title] = {disabled: true};
      }
    });
    return marked;
  }
  const handleAddEvent = () => {
    if (eventName) {
      const updatedEvents = {...events};
      updatedEvents[selectedDate] = eventName; // Update the event name for the selected date
      setEvents(updatedEvents);
      console.log(updatedEvents);
    }
    setModalVisible(false);
  };
  return (
    <>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={() => {
          return;
        }}
        showTodayButton={false}
        theme={todayBtnTheme.current}>
        {weekView ? (
          <WeekCalendar firstDay={1} markedDates={marked.current} />
        ) : (
          <ExpandableCalendar
            calendarStyle={styles.calendar}
            theme={theme.current}
            markedDates={marked.current}
            leftArrowImageSource={null}
            rightArrowImageSource={null}
            animateScroll={true}
          />
        )}
        <View style={{flex: 1, justifyContent: 'center'}}>
          <SwipeComponent
            setSelectedDate={setSelectedDate}
            setDayOffset={setDayOffset}
            dayOffset={dayOffset}
            setModalVisible={setModalVisible}
            selectedDate={selectedDate}
            events={events}
          />
        </View>
      </CalendarProvider>
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
    </>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: 'lightgrey',
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
  },
  itemHourText: {
    color: 'black',
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
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
    color: '#00AAAF',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#00AAAF',
    marginBottom: 20,
    paddingLeft: 10,
    color: 'white',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#00AAAF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
  },
  addButtonText: {
    textAlign: 'center',
    color: 'white',
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
    color: 'white',
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
});
