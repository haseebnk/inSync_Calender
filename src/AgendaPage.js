import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';

const AgendaPage = () => {
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const setSelectedDateS = () => {
  
    if (selectedDate) {
      const nextDay = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD');
      console.log('Next Day:', nextDay);
      setSelectedDate(nextDay);
      calendarRef.current.setSelectedDate(moment(nextDay));
    }
  };

  const dateCheck = (date) => {
    const currentDate = moment(date).format('YYYY-MM-DD');
    console.log('Selected Date:', currentDate);
    setSelectedDate(currentDate);
  };

  return (
    <View style={{ backgroundColor: '#FAF3F0' }}>
      <CalendarStrip
        ref={calendarRef}
        calendarAnimation={{ type: 'parallel', duration: 30 }}
        daySelectionAnimation={{
          type: 'border',
          duration: 200,
          borderWidth: 1,
          borderHighlightColor: 'white',
        }}
        scrollToOnSetSelectedDate={false}
        scrollable={false}
        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
        calendarHeaderStyle={{ color: 'white' }}
        calendarColor={'#7743CE'}
        dateNumberStyle={{ color: 'white' }}
        dateNameStyle={{ color: 'white' }}
        highlightDateNumberStyle={{ color: 'yellow' }}
        highlightDateNameStyle={{ color: 'yellow' }}
        disabledDateNameStyle={{ color: 'grey' }}
        disabledDateNumberStyle={{ color: 'grey' }}
        onDateSelected={dateCheck}
        iconContainer={{ flex: 0.1 }}
      />
      <TouchableOpacity onPress={()=> setSelectedDateS()}>
        <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop: 100,
            backgroundColor: '#EFE1D1',
            height: 300,
            width: 300,
            alignSelf: 'center',
            borderRadius: 150,
          }}
        >
            <Text style={{fontSize:34, fontWeight:'bold'}}>{selectedDate}</Text>
        </View>
      </TouchableOpacity>
   
    </View>
  );
};

export default AgendaPage;
