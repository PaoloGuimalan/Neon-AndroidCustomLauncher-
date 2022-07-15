import { View, Text, StyleSheet, NativeModules, ScrollView, Image, BackHandler, TouchableOpacity, ImageBackground, ToastAndroid, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const ApiTester = () => {

  const [httptype, sethttptype] = useState("GET");
  const [urlinput, seturlinput] = useState("...");
  const [responseArray, setresponseArray] = useState(["API Tester Initialized", "GET Method in Default"]);

  const makeRequest = () => {
    setresponseArray([...responseArray, "Waiting response..."])
    if(httptype == "GET"){
      Axios.get(urlinput).then((response) => {
        setresponseArray([...responseArray, "Waiting response...", "Response received!", JSON.stringify(response.data, null, 4)])
      }).catch((err) => {
        setresponseArray([...responseArray, "Waiting response...", err.message])
      })
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: "black", alignItems: 'center', paddingTop: 15}}>
      <Text style={{color: "cyan", fontSize: 17, fontWeight: "bold", marginBottom: 15}}>API Tester</Text>
      <View style={{flexDirection: "row", width: "90%"}}>
        <TouchableOpacity onPress={() => { sethttptype("GET"); setresponseArray([...responseArray, "GET Method in use"]) }}>
          <Text style={{borderColor: "cyan", borderWidth: 1, color: "cyan", width: 70, marginBottom: 20, height: 30, borderRadius: 5, textAlign: "center", textAlignVertical: "center", margin: 2}}>GET</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { sethttptype("POST"); setresponseArray([...responseArray, "POST Method in use"]) }}>
          <Text style={{borderColor: "cyan", borderWidth: 1, color: "cyan", width: 70, marginBottom: 20, height: 30, borderRadius: 5, textAlign: "center", textAlignVertical: "center", margin: 2}}>POST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { sethttptype("PUT"); setresponseArray([...responseArray, "PUT Method in use"]) }}>
          <Text style={{borderColor: "cyan", borderWidth: 1, color: "cyan", width: 70, marginBottom: 20, height: 30, borderRadius: 5, textAlign: "center", textAlignVertical: "center", margin: 2}}>PUT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { sethttptype("DELETE"); setresponseArray([...responseArray, "DELETE Method in use"]) }}>
          <Text style={{borderColor: "cyan", borderWidth: 1, color: "cyan", width: 70, marginBottom: 20, height: 30, borderRadius: 5, textAlign: "center", textAlignVertical: "center", margin: 2}}>DELETE</Text>
        </TouchableOpacity>
      </View>
      <View style={{marginBottom: 20, width: "90%"}}>
        <Text style={{color: "cyan"}}>Current Type: {httptype}</Text>
        <Text style={{color: "cyan"}}>URL: {urlinput}</Text>
      </View>
      <TextInput onChangeText={(e) => { seturlinput(e) }} placeholder='Link' style={{width: "90%", color: "cyan", borderWidth: 1, borderColor: "cyan", height: 40, textAlign: "center", borderRadius: 5, marginBottom: 10}} placeholderTextColor="cyan" />
      <View style={{flexDirection: 'row', width: "90%", justifyContent: "space-evenly"}}>
        <TouchableOpacity onPress={() => { makeRequest() }}>
          <Text style={{color: "black", backgroundColor: "cyan", width: 100, height: 30, marginBottom: 20, marginTop: 5, textAlign: "center", textAlignVertical: "center", borderRadius: 5}}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setresponseArray(["Terminal Cleared"]) }}>
          <Text style={{color: "black", backgroundColor: "cyan", width: 100, height: 30, marginBottom: 20, marginTop: 5, textAlign: "center", textAlignVertical: "center", borderRadius: 5}}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: "90%", height: 300, color: "cyan", borderWidth: 1, borderColor: "cyan", textAlign: "center", borderRadius: 5}}>
        <ScrollView style={{paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 30}}>
          {responseArray.map((res, i) => {
            return(
              <Text selectable={true} style={{color: "lime", marginBottom: 10}} key={i}>{res}</Text>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default ApiTester