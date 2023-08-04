import {View, Dimensions} from 'react-native';
// import SwipeCalendar from './src/SwipeCalendar';
import NativeCalendar from './src/NativeCalendar';
import ExpandableCalendarScreen from './src/expandableCalendar/screens/expandableCalendarScreen';
import SwipeComponent from './src/SwipeComponent';
const screenHeight = Dimensions.get('window').height;
const App = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: screenHeight,
        alignItems: 'center',
      }}>
      {/* <NativeCalendar /> */}
      {/* <View style={{height: 150}}> */}
        <ExpandableCalendarScreen />
      {/* </View>
      <View style={{flex: 1, justifyContent:'center'}}>
        <SwipeComponent />
      </View> */}
    </View>
  );
};

export default App;
