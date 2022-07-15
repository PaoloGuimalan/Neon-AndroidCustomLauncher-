import { View, Text, StyleSheet, NativeModules, ScrollView, Image, BackHandler, TouchableOpacity, ImageBackground, ToastAndroid, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const ApiTester = () => {
  return (
    <View style={{flex: 1, backgroundColor: "black", alignItems: 'center', paddingTop: 15}}>
      <Text style={{color: "cyan", fontSize: 17, fontWeight: "bold", marginBottom: 15}}>API Tester</Text>
      <TextInput placeholder='Link' style={{width: "90%", color: "cyan", borderWidth: 1, borderColor: "cyan", height: 40, textAlign: "center", borderRadius: 5, marginBottom: 10}} placeholderTextColor="cyan" />
      <View style={{width: "90%", height: 300, color: "cyan", borderWidth: 1, borderColor: "cyan", textAlign: "center", borderRadius: 5}}>
        
      </View>
    </View>
  )
}

export default ApiTester