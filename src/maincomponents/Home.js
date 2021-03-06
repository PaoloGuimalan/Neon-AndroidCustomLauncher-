import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated, TextInput, NativeModules, PermissionsAndroid, BackHandler, ImageBackground } from 'react-native';
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
import { appPressSound, openAppList } from '../libraries/sounds';
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import { SET_ASTRO, SET_WEATHER } from '../redux/type/type';
import NetInfo from '@react-native-community/netinfo'
import * as Animatable from 'react-native-animatable'
import ImgBg from '../res/imgs/bggradient.jpg'
import ImgHex from '../res/imgs/bgstars.jpg'

export default function Home({navigation}) {

  const dispatch = useDispatch();

  const [logoScale, setlogoScale] = useState(false);
  const [countClick, setcountClick] = useState(0);
  const [logoColor, setlogoColor] = useState(true);

  const [scaleCount, setscaleCount] = useState(new Animated.Value(0));

  const [batteryLevel, setbatteryLevel] = useState(0);
  const [currentDate, setcurrentDate] = useState("");
  const [currentTime, setcurrentTime] = useState("");
  const [currentDateforURL, setcurrentDateforURL] = useState("");
  const [androidID, setandroidID] = useState("");
  const [baseOSVar, setbaseOSVar] = useState("");
  const [systemBrand, setsystemBrand] = useState("");
  const [freedisk, setfreedisk] = useState("");
  const [ipadd, setipadd] = useState("");
  const [locationStatus, setlocationStatus] = useState("");
  const [coordinates, setcoordinates] = useState("");
  const [connectionDetails, setconnectionDetails] = useState({isConnected: false, type: "none"});

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
        // if(Math.round(battery * 100) < 31){
        //   if(logoColor){
        //     setlogoColor(false)
        //   }
        // }
        // else{
        //   if(logoColor == false){
        //     setlogoColor(true)
        //   }
        // }
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

  const weatherCatcher = () => {
    Axios.get('http://api.weatherapi.com/v1/current.json?key=494c0f6d4c3f4b4b81b74942211108&q=Philippines&aqi=yes').then((response) => {
      // alert("Hello");
      dispatch({type: SET_WEATHER, weatherdata: response.data})
    }).catch((err) => {
      dispatch({type: SET_WEATHER, weatherdata: {}})
    })
  }

  const astroCatcher = () => {
    if(currentDateforURL != ""){
      Axios.get(`http://api.weatherapi.com/v1/astronomy.json?key=494c0f6d4c3f4b4b81b74942211108&q=Philippines&dt=${currentDateforURL}`).then((response) => {
      // alert("Hello");
      dispatch({type: SET_ASTRO, astrodata: response.data})
    }).catch((err) => {
      // alert("Cannot Load Weather");
      dispatch({type: SET_ASTRO, astrodata: {}})
    })
    }
    else{
      dispatch({type: SET_ASTRO, astrodata: {}})
    }
  }

  useEffect(() => {
    // console.log("Changed!");
    weatherCatcher();
    astroCatcher()
  }, [currentDate, currentDateforURL])

  useEffect(() => {
    weatherCatcher();
    astroCatcher()
  }, [])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      //dispatch
      if(connectionDetails.isConnected != state.isConnected){
        setconnectionDetails({isConnected: state.isConnected, type: state.type})
        if(state.isConnected == true){
          weatherCatcher();
          astroCatcher()
        }
        // console.log(state.type);
      }
    });
    unsubscribe()
  })

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

    setcurrentDateforURL(`${year}-${month}-${date}`)
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
      backgroundColor: 'transparent',
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
      borderWidth: 2,
      borderColor: logoColor? "cyan" : "red",
      width: 150,
      height: 150,
      borderRadius: 150,
      alignItems: "center",
      justifyContent: "center",
      scaleX: scaleCount,
      scaleY: scaleCount,
      borderStyle: "solid",
      backgroundColor: "black",
      opacity: 0.9
    },
    textLogo:{
      color: logoColor? "cyan" : "red",
      fontSize: 25,
      opacity: 0.9
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
      backgroundColor: "transparent",
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
      backgroundColor: "transparent",
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
      backgroundColor: "transparent",
      justifyContent: "center"
    },
    sideViewDetailsTop:{
      backgroundColor: "transparent",
      width: "50%",
      height: "100%",
      justifyContent: "center",
      alignItems: "flex-end"
    },
    batteryLabel:{
      marginTop: 20,
      width: 35,
      height: 15,
      backgroundColor: "black",
      borderRadius: 3,
      borderWidth: 1,
      borderColor: "cyan",
      color: "cyan",
      textAlign: "center",
      textAlignVertical: "center",
      fontSize: 10
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
      backgroundColor: "transparent",
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
    },
    miniBarStatus:{
      borderWidth: 1,
      borderColor: "cyan",
      height: "10%",
      width: 50,
      marginTop: 20,
      marginBottom: 15,
      borderRadius: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black"
    },
    connectionStatus:{
      color: "cyan"
    },
    viewLogoInside:{
      borderWidth: 25,
      borderColor: logoColor? "cyan" : "red",
      width: 140,
      height: 140,
      borderRadius: 137,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
      backgroundColor: "transparent",
      opacity: 1
    }
  });

  const homeAppsOpenner = (appName) => {
    appPressSound()
    NativeModules.InstalledApps.launchApplication(appName);
  }

  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />
      <ImageBackground style={{width: "100%", height: "100%", opacity: 1, backgroundColor: "black"}} blurRadius={0}>
      <View style={styles.detailsStyle}>
        <View style={styles.viewDetailsTop}>
          <Text style={styles.topLabel}>{systemBrand}</Text>
          <Text style={styles.topLabel}>{ipadd? ipadd : "..."}</Text>
          <Text style={styles.topLabel}>Disk Space: {(freedisk / 1024 / 1024 / 1024).toFixed(2)} GB</Text>
        </View>
        <View style={styles.sideViewDetailsTop}>
          <View style={styles.miniBarStatus}>
            <Text style={styles.connectionStatus}>{connectionDetails.type != "none"? connectionDetails.type == "wifi"? (
              <Icon name='wifi-sharp' size={20} />
            ) : (
              <Icon name='cellular-sharp' size={20} />
            ) : <Icon name='globe-outline' size={20} />}</Text>
            <Text style={styles.batteryLabel}>{Math.round(batteryLevel * 100)}%</Text>
          </View>
          {/* <Text style={styles.batteryLabel}>{Math.round(batteryLevel * 100)}%</Text>
          <Text style={styles.batteryLabel}>{Math.round(batteryLevel * 100)}%</Text> */}
        </View>
      </View>
      <View style={styles.middleView}>
        <View style={{borderWidth: 5, borderColor: "cyan", width: 225, height: 225, borderRadius: 225, justifyContent: "center", alignItems: "center"}}>
        <View style={{borderWidth: 1, borderColor: "cyan", width: 200, height: 200, borderRadius: 200, justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity onPress={animatedLogo}>
            <Animated.View style={styles.viewLogo}>
                <Animatable.View animation="rotate" duration={10000} easing="linear" iterationCount="infinite" style={styles.viewLogoInside}>
                  <Animatable.Text animation="rotate" direction="reverse" duration={10000} easing="linear" iterationCount="infinite" style={styles.textLogo}>Neon</Animatable.Text>
                </Animatable.View>
            </Animated.View>
          </TouchableOpacity>
        </View>
        </View>
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
      </ImageBackground>
    </View>
  )
}
