import React, {useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const Carousels = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselItems] = useState([
    {
      title: 'Item 1',
      text: 'Text 1',
    },
    {
      title: 'Item 2',
      text: 'Text 2',
    },
    {
      title: 'Item 3',
      text: 'Text 3',
    },
    {
      title: 'Item 4',
      text: 'Text 4',
    },
    {
      title: 'Item 5',
      text: 'Text 5',
    },
  ]);
  const renderItem = ({item, index}) => (
    <View
      style={{
        backgroundColor: 'floralwhite',
        borderRadius: 5,
        height: 250,
        padding: 50,
        marginLeft: 25,
        marginRight: 25,
      }}>
      <Text style={{fontSize: 30}}>{item.title}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'yellow'
      }}>
      <Carousel
        layout="default"
        data={carouselItems}
        sliderWidth={300}
        itemWidth={300}
        renderItem={renderItem}
        onSnapToItem={index => setActiveIndex(index)}
      />
    </View>
  );
};

export default Carousels;
