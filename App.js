import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainCalender from './src/MainCalender'
import Agenda from './src/AgendaPage'
import AgendaPage from './src/AgendaPage'

const App = () => {
  return (
    <View>
    {/* <MainCalender/> */}
   <AgendaPage/>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})