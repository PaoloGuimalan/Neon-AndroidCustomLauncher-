import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated, TextInput, NativeModules, PermissionsAndroid, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { 
  getBatteryLevel, 
  getBaseOs, getAndroidId, 
  getSystemVersion, 
  getBrand, 
  getDevice, 
  getFreeDiskStorage, 
  getBatteryLevelSync,
  getIpAddress,
  isLocationEnabled
} from 'react-native-device-info';

import geolocation from 'react-native-geolocation-service'
import Icon from 'react-native-vector-icons/Ionicons'
import { openAppList } from '../libraries/sounds';

export default function Home({navigation}) {

  const [logoScale, setlogoScale] = useState(false);
  const [countClick, setcountClick] = useState(0);
  const [logoColor, setlogoColor] = useState(true);

  const [scaleCount, setscaleCount] = useState(new Animated.Value(0));

  const [batteryLevel, setbatteryLevel] = useState(0);
  const [currentDate, setcurrentDate] = useState("");
  const [currentTime, setcurrentTime] = useState("");
  const [androidID, setandroidID] = useState("");
  const [baseOSVar, setbaseOSVar] = useState("");
  const [systemBrand, setsystemBrand] = useState("");
  const [freedisk, setfreedisk] = useState("");
  const [ipadd, setipadd] = useState("");
  const [locationStatus, setlocationStatus] = useState("");
  const [coordinates, setcoordinates] = useState("");

  useEffect(() => {
    setTimeout(() => {
        Animated.timing(scaleCount, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
        }).start();
    }, 500);
  }, [])

  useEffect(() => {
    getBatteryLevel().then((battery) => {
      setbatteryLevel(battery)
    });
    setInterval(() => {
      getBatteryLevel().then((battery) => {
        setbatteryLevel(battery)
      });
    }, 60000);
    getAndroidId().then((andID) => {
      setandroidID(andID)
    })
    getBaseOs().then((baseOS) => {
      setbaseOSVar(baseOS)
    })
    getDevice().then((br) => {
      setsystemBrand(br);
    })
    getFreeDiskStorage().then((disk) => {
      setfreedisk(disk)
    })
    getIpAddress().then((ip) => {
      setipadd(ip);
    })
    isLocationEnabled().then((lcs) => {
      setlocationStatus(lcs);
    })
    setLocation();
  }, [])

  const setLocation = () => {
    geolocation.getCurrentPosition((position) => {
      // console.log(position)
      setcoordinates(position.coords)
      // setInterval(() => {
      //   setcoordinates(position.coords)
      // }, 1500)
    }, (error) => {
      locationPremission()
    })
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function() {
      // console.log("hello");
      // navigation.popToTop()
      return true;
    });
  }, [])

  const locationPremission = async () => {
    try{
      const permitlocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Enable Location",
          'message': "Click Allow / Yes to enable."
        }
      )
      if(permitlocation == PermissionsAndroid.PERMISSIONS.GRANTED){
        setLocation()
      }
      else{
        alert("Location Denied!");
      }
    }
    catch(err){
      alert(err);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      initializeData()
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [])

  const initializeData = () => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const seconds = new Date().getSeconds();

    setcurrentDate(`${month} / ${date} / ${year}`);
    setcurrentTime(`${hours} : ${minutes} : ${seconds}`);
  }

  const animatedLogo = () => {
    openAppList()
    if(logoColor == true){
        Animated.timing(scaleCount, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
        }).start();
        setTimeout(() => {
            navigation.navigate("AppList");
            // navigation.popToTop();
            revertLogo();
        }, 500);
    }
  }

  const revertLogo = () => {
    Animated.timing(scaleCount, {
        toValue: 1,
        duration: 600,
        delay: 1000,
        useNativeDriver: true
    }).start();
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      color: 'cyan',
      fontSize: 20
    },
    textSmall:{
      color: 'cyan',
      fontSize: 10
    },
    viewLogo:{
      borderWidth: 3,
      borderColor: logoColor? "cyan" : "grey",
      width: 150,
      height: 150,
      borderRadius: 150,
      alignItems: "center",
      justifyContent: "center",
      scaleX: scaleCount,
      scaleY: scaleCount
    },
    textLogo:{
      color: logoColor? "cyan" : "grey",
      fontSize: 25
    },
    textInputStyle:{
        borderColor: "grey",
        borderWidth: 1,
        margin: 20,
        width: 150,
        color: "white",
        textAlign: "center",
        borderRadius: 10
    },
    detailsStyle:{
      backgroundColor: "black",
      width: "100%",
      height: "auto",
      maxHeight: 150,
      padding: 10,
      flex: 1,
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "center"
    },
    middleView:{
      backgroundColor: "black",
      height: "auto",
      width: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    },
    bottomView:{
      backgroundColor: "transparent",
      width: "100%",
      height: "auto",
      padding: 10,
      flex: 1,
      maxHeight: 150,
      flexDirection: "row"
    },
    topLabel:{
      backgroundColor: "black",
      margin: 5,
      width: "100%",
      maxWidth: 150,
      padding: 5,
      textAlign: "center",
      borderRadius: 10,
      fontSize: 12,
      borderWidth: 1,
      borderColor: "cyan",
      color: "cyan",
    },
    viewDetailsTop:{
      width: "50%",
      height: "100%",
      backgroundColor: "black",
      justifyContent: "center"
    },
    sideViewDetailsTop:{
      backgroundColor: "black",
      width: "50%",
      height: "100%",
      justifyContent: "center",
      alignItems: "flex-end"
    },
    batteryLabel:{
      width: 50,
      height: 50,
      backgroundColor: "black",
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "cyan",
      color: "cyan",
      textAlign: "center",
      textAlignVertical: "center"
    },
    viewBottomUno:{
      backgroundColor: "transparent",
      justifyContent: "center",
      width: "60%",
      alignItems: "center",
      justifyContent: "flex-end"
    },
    viewBottomDos:{
      backgroundColor: "transparent",
      justifyContent: "center",
      width: "40%",
      alignItems: "center"
    },
    bottomLabelText:{
      backgroundColor: "black",
      margin: 5,
      width: "100%",
      padding: 5,
      textAlign: "center",
      borderRadius: 10,
      fontSize: 12,
      borderWidth: 1,
      borderColor: "cyan",
      color: "cyan",
    },
    dateView:{
      backgroundColor: "black",
      width: "90%",
      height: "100%",
      marginBottom: "0%",
      textAlign: "center",
      textAlignVertical: "center",
      borderRadius: 10,
      borderRadius: 10,
      fontSize: 12,
      borderWidth: 1,
      borderColor: "cyan",
      color: "cyan",
      justifyContent: "center",
      alignItems: "center"
    },
    textDate:{
      color: "cyan",
      fontSize: 13
    },
    textTime:{
      color: "cyan",
      fontSize: 10
    },
    viewHomeApps:{
      backgroundColor: "black",
      width: "100%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    iconHomeApps:{
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: "cyan",
      backgroundColor: "black",
      color: "cyan",
      borderRadius: 10,
      textAlign: "center",
      textAlignVertical: "center",
      margin: 1
    }
  });

  const homeAppsOpenner = (appName) => {
    NativeModules.InstalledApps.launchApplication(appName);
  }

  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />
      <View style={styles.detailsStyle}>
        <View style={styles.viewDetailsTop}>
          <Text style={styles.topLabel}>{systemBrand}</Text>
          <Text style={styles.topLabel}>{ipadd? ipadd : "..."}</Text>
          <Text style={styles.topLabel}>Disk Space: {(freedisk / 1024 / 1024 / 1024).toFixed(2)} GB</Text>
        </View>
        <View style={styles.sideViewDetailsTop}>
          <Text style={styles.batteryLabel}>{Math.round(batteryLevel * 100)}%</Text>
        </View>
      </View>
      <View style={styles.middleView}>
        <TouchableOpacity onPress={animatedLogo}>
          <Animated.View style={styles.viewLogo}>
              <Text style={styles.textLogo}>Neon</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomView}>
        <View style={styles.viewBottomUno}>
          <View style={styles.viewHomeApps}>
            <Text style={styles.iconHomeApps} onPress={() => {homeAppsOpenner("com.android.settings")}}><Icon name='settings-outline' size={20} /></Text>
            <Text style={styles.iconHomeApps} onPress={() => {homeAppsOpenner("com.coloros.filemanager")}}><Icon name='folder-outline' size={20} /></Text>
            <Text style={styles.iconHomeApps} onPress={() => {homeAppsOpenner("com.android.mms")}}><Icon name='chatbox-outline' size={20} /></Text>
            <Text style={styles.iconHomeApps} onPress={() => {homeAppsOpenner("com.android.contacts")}}><Icon name='call-outline' size={20} /></Text>
          </View>
          <Text style={styles.bottomLabelText}>{locationStatus? "Location Enabled" : "Location Disabled"}</Text>
          <Text style={styles.bottomLabelText}>{coordinates? `Lat: ${coordinates.latitude} | Lng: ${coordinates.longitude}` : "Unable to Scan Location"}</Text>
        </View>
        <View style={styles.viewBottomDos}>
          <View style={styles.dateView}>
            <Text style={styles.textDate}>{currentDate}</Text>
            <Text style={styles.textTime}>{currentTime}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
