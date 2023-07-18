import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const MainCalender = () => {
    const [selectedStartDate, setSelectedStartDate] = useState(null);

    const onDateChange = (date) => {
        setSelectedStartDate(date);
    };

    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    return (
        <View style={styles.container}>
            <View>
                <CalendarPicker
                    scrollable={true}       
                    onDateChange={onDateChange}
                    showDayStragglers={true}

                />
            </View>


            {/* <View>
        <Text>SELECTED DATE: {startDate}</Text>
      </View> */}
            <View style={{ backgroundColor: '#fff', height: 300, width: 300, alignSelf: 'center' ,borderRadius:150 }}>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAF3F0',
    },
});

export default MainCalender;
