import { View, Text, StyleSheet, NativeModules, ScrollView, Image, BackHandler, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { appPressSound, backPress, processCommand } from '../libraries/sounds'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ApiTester from '../subcomponents/DevTools/ApiTester';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createNativeStackNavigator()

const DevTools = ({navigation}) => {
  return (
    <View style={styles.mainView}>
      <Text style={{color: "cyan", fontSize: 20, fontWeight: "bold", width: "100%", marginLeft: 30}}>Developer Tools</Text>
      <View style={{flex: 0, flexDirection: 'row', backgroundColor: "transparent", padding: 10, width: "100%", borderColor: "cyan", borderBottomWidth: 2}}>
        <TouchableOpacity onPress={() => { navigation.navigate("ApiTester") }}>
            <Text style={{margin: 2, color: "cyan", borderWidth: 1, borderColor: "cyan", width: 100, height: 30, textAlign: "center", textAlignVertical: "center", borderRadius: 5}}>API Tester</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{backgroundColor: 'black', flexGrow: 1, width: "100%"}}>
        <Tab.Navigator>
            <Tab.Screen name='ApiTester' component={ApiTester} options={{headerShown: false, gestureEnabled: true, animation: "fade"}} />
        </Tab.Navigator>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    mainView:{
        backgroundColor: "black",
        flex: 1,
        alignItems: "center",
        paddingTop: 20
    }
})

export default DevTools