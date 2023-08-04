import React, {useRef, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from 'react-native-calendars';

const leftArrowIcon = {
  uri: 'https://w7.pngwing.com/pngs/65/272/png-transparent-chevron-chevron-left-left-user-interface-icon-thumbnail.png',
};
const rightArrowIcon = {
  uri: 'https://w7.pngwing.com/pngs/65/272/png-transparent-chevron-chevron-left-left-user-interface-icon-thumbnail.png',
};

// Dummy data for agenda items
const ITEMS = [
  {
    title: '2023-08-01',
    data: [{title: 'Item 1', description: 'Description for Item 1'}],
  },
  {
    title: '2023-08-02',
    data: [{title: 'Item 2', description: 'Description for Item 2'}],
  },
  {
    title: '2023-08-03',
    data: [{title: 'Item 3', description: 'Description for Item 3'}],
  },
  // Add more items as needed
];

const markedDates = {};
ITEMS.forEach(item => {
  markedDates[item.title] = {marked: true};
});

const NativeCalendar = props => {
  const {weekView} = props;
  const theme = useRef({});
  const todayBtnTheme = useRef({
    todayButtonTextColor: 'blue',
  });

  const renderItem = useCallback(({item}) => {
    return (
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    );
  }, []);

  return (
    <CalendarProvider
      date={ITEMS[0]?.title}
      theme={todayBtnTheme.current}
      // Set minDate and maxDate to cover a range of years
      minDate={'1987-01-01'}
      maxDate={'2059-12-31'}>
      <View>
        <ExpandableCalendar
          theme={theme.current}
          firstDay={1}
          markedDates={markedDates}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
        />
        <AgendaList
          sections={ITEMS}
          renderItem={renderItem}
          sectionStyle={styles.section}
        />
      </View>
    </CalendarProvider>
  );
};

export default NativeCalendar;

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'lightgrey',
    color: 'grey',
    textTransform: 'capitalize',
  },
});
