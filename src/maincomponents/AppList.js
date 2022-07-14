import { View, Text, StyleSheet, NativeModules, ScrollView, Image, BackHandler, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { appPressSound, backPress, processCommand } from '../libraries/sounds'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ImgBg from '../res/imgs/bggradient.jpg'
import ImgHex from '../res/imgs/bghex.png'
import { SET_APPLIST } from '../redux/type/type';
import IconSLI from 'react-native-vector-icons/SimpleLineIcons'

const AppList = ({navigation}) => {

  const [allApps, setallApps] = useState(["...loading"]);
  const [appPreview, setappPreview] = useState([]);
  const [cliArray, setcliArray] = useState(["AppList"]);

  const weatherdata = useSelector(state => state.weatherdata);
  const astrodata = useSelector(state => state.astrodata);
  const dispatch = useDispatch();

  const applist = useSelector(state => state.applist);

  useEffect(() => {
    // const allapps = JSON.parse(NativeModules.InstalledApps.getApps)
    // console.log("All Packages", NativeModules.InstalledApps.getApps);
    loaderApps()
    // console.log(astrodata)
  }, []);

  const loaderApps = async () => {
    try{
      const appsResult = NativeModules.InstalledApps.getApps;

      setTimeout(() => {
        setcliArray(["Configuring Native Modules", ...cliArray])
        processCommand()
      }, 500);
      setTimeout(() => {
        setcliArray(["Unpacking...", "Configuring Native Modules", ...cliArray])
        processCommand()
      }, 1000);
      setTimeout(() => {
        setcliArray(["Loaded Successfully!", "Unpacking...","Configuring Native Modules", ...cliArray])
        processCommand()
      }, 1500);

      const arr = appsResult.replace(/\[, ]/g, "[]").split("[]")
      arr.shift()
      arr.pop()
      arr.sort()
      arr.reverse()
      dispatch({type: SET_APPLIST, applist: arr})
      // setallApps(arr);
      // console.log(arr)
      // console.log(appsResult.replace(/\[, ]/g, "[]").split("[]")[1].replace(/\"/g, "").split(","))
    }
    catch(err){
      // alert(err)
      setcliArray(["Unable to Load Modules", ...cliArray])
    }
  }

  const openApp = (app) => {
    const label = app.replace(/\"/g, "").split(",")[0];
    const name = app.replace(/\"/g, "").split(",")[1];
    const icon = app.replace(/\"/g, "").split(",")[2];

    // console.log([label, name, icon])
    appPressSound()

    try{
      if(app.replace(/\"/g, "").split(",")[1] == "" || app.replace(/\"/g, "").split(",")[1] == undefined || app.replace(/\"/g, "").split(",")[1] == null){
        alert(`App Undetected: ${app.replace(/\"/g, "").split(",")[1]}`)
      }
      else{
        setcliArray([`${label} in preview`, ...cliArray])
        processCommand()
        setappPreview([label, name, icon]);
      }
    }
    catch(err){
      alert("App Undetected!")
    }

    // NativeModules.InstalledApps.launchApplication(app.replace(/\"/g, "").split(",")[1]);
  }

  const openAppPress = () => {
    appPressSound()
    try{
      setTimeout(() => {
        setcliArray([`${appPreview[0]} initializing...`, ...cliArray])
        processCommand()
      }, 500);
      setTimeout(() => {
        var percentage = 0;
        var precInd = "▧";
        var precDec = "▢";
        var interval = setInterval(() => {
          if(percentage < 11){
            setcliArray([`processing [${precInd.repeat(percentage)}${precDec.repeat(10 - percentage)}]`,`${appPreview[0]} initializing...`, ...cliArray])
            percentage = percentage + 1
          }
          else{
            clearInterval(interval);
            setcliArray([`Launching \"${appPreview[0]}\"`,`processing [Done!]`,`${appPreview[0]} initializing...`, ...cliArray])
            processCommand()
            setTimeout(() => {
              NativeModules.InstalledApps.launchApplication(appPreview[1]);
            }, 500);
          }
        }, 10)
        processCommand()
      }, 1000);
      // setTimeout(() => {
      //   NativeModules.InstalledApps.launchApplication(appPreview[1]);
      // }, 2500);
    }
    catch(err){
      setcliArray([`Application failed to load!`, ...cliArray])
    }
  }

  return (
    <View style={ApplistStyle.viewStyle}>
      <ImageBackground source={ImgHex} style={{width: "100%", height: "100%", opacity: 0.9}}>
      <Text style={ApplistStyle.textStyle}>AppList</Text>
      <View style={ApplistStyle.absoluteView}>
        {appPreview == undefined || appPreview.length == 0? (
          <View style={ApplistStyle.viewToggleApp}>
            <Text style={ApplistStyle.iconPreviewDefault}><Icon name='warning-outline' size={30} /></Text>
            <Text style={ApplistStyle.labelPreviewDefault}>Select an App</Text>
          </View>
        ) : (
          <View style={ApplistStyle.viewToggleApp}>
            <Image style={ApplistStyle.imageSizing} resizeMode={'contain'} source={{uri: "data:image/png;base64," + appPreview[2]}} />
            <Text style={ApplistStyle.labelPreview} numberOfLines={15} ellipsizeMode='tail' >{appPreview[0]}</Text>
            <Text style={ApplistStyle.labelPreviewButton} onPress={() => {openAppPress()}}>Open App</Text>
          </View>
        )}
      </View>
      <ScrollView style={ApplistStyle.scrollStyle} contentContainerStyle={ApplistStyle.scrollViewStyle}>
        {applist.map((app, i) => {
          return(
            <TouchableOpacity key={i} onPress={() => {openApp(app)}}>
              <View style={ApplistStyle.viewApp}>
                {/* <Image style={ApplistStyle.imageSizing} resizeMode={'contain'} source={{uri: "data:image/png;base64," + app.replace(/\"/g, "").split(",")[2]}} /> */}
                <Text style={ApplistStyle.noteStyle} numberOfLines={1}>{app.replace(/\"/g, "").split(",")[0]}</Text>
              </View>
            </TouchableOpacity>
            // <TouchableOpacity key={i} onPress={() => {openApp(app)}}>
            //   <View style={ApplistStyle.hexagon}>
            //     <View style={ApplistStyle.hexagonInner} />
            //     <View style={ApplistStyle.hexagonBefore}>
            //       <Image style={ApplistStyle.imageSizing} resizeMode={'contain'} source={{uri: "data:image/png;base64," + app.replace(/\"/g, "").split(",")[2]}} />
            //     </View>
            //     <View style={ApplistStyle.hexagonAfter} />
            //   </View>
            // </TouchableOpacity>
          )
        })}
      </ScrollView>
      <ScrollView style={ApplistStyle.commandLineView} contentContainerStyle={ApplistStyle.absoluteCli}>
        {cliArray.map((cli,i) => {
          return(
            <Text key={i} style={ApplistStyle.commandLineText}>&gt; {cli}</Text>
          )
        })}
      </ScrollView>
      <View style={ApplistStyle.viewWeather}>
        {Object.keys(weatherdata).length == 0? (
          <Text style={ApplistStyle.textWeather}>No Weather Update</Text>
        ) : (
          <View style={ApplistStyle.weatherViewResult}>
            <Image source={{uri: `https:${weatherdata.current.condition.icon}`}} style={ApplistStyle.iconWeather} />
            <View>
              <Text style={ApplistStyle.textWeather}>{weatherdata.location.name}, {weatherdata.location.country}</Text>
              <Text style={ApplistStyle.textWeather}>{weatherdata.current.condition.text}</Text>
              <Text style={ApplistStyle.textWeather}>{weatherdata.current.temp_c}&#8451;, {weatherdata.current.temp_f}&#8457;</Text>
            </View>
          </View>
        )}
      </View>
      <View style={ApplistStyle.viewAstronomy}>
      {Object.keys(astrodata).length == 0? (
          <Text style={ApplistStyle.textAstronomy}>No Astronomical Update</Text>
        ) : (
          <View style={ApplistStyle.weatherViewResult}>
            <Text style={ApplistStyle.iconAstronomy}><Icon name='moon-outline' size={25} /></Text>
            <View>
              <Text style={ApplistStyle.textAstronomy}>{astrodata.astronomy.astro.moon_phase}</Text>
              <Text style={ApplistStyle.textAstronomy}>Illumination: {astrodata.astronomy.astro.moon_illumination}</Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity style={ApplistStyle.viewDevTools}>
        <View  style={ApplistStyle.viewDevUnder}>
          <Text style={{color: "lime"}}>Developer Tools</Text>
          <IconSLI name='arrow-right' color='lime' size={15} />
        </View>
      </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

const ApplistStyle = StyleSheet.create({
    viewStyle:{
        backgroundColor: "transparent",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle:{
        color: "lime",
        fontSize: 20,
        marginTop: 10,
        backgroundColor: "transparent",
        width: "100%",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 25
    },
    noteStyle:{
        color: "lime",
        fontSize: 15,
        margin: 2,
        textAlign: "center",
        width: "50%",
        borderColor: "lime",
        borderWidth: 1,
        backgroundColor: "black",
        opacity: 1,
        height: 30,
        textAlignVertical: "center",
        borderRadius: 10
    },
    scrollViewStyle:{
      padding: 10,
      paddingLeft: 15,
      paddingRight: 30
    },
    scrollStyle:{
      width: "100%",
      backgroundColor: "transparent"
    },
    absoluteView:{
      backgroundColor: "black",
      width: "45%",
      height: 150,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "lime",
      marginBottom: 5,
      position: "absolute",
      justifyContent: "center",
      right: 0,
      top: 40,
      zIndex: 1,
      opacity: 0.7
    },
    textLabelabsolute:{
      color: "lime"
    },
    viewApp:{
      borderWidth: 0,
      borderColor: "lime",
      marginBottom: 2
    },
    imageSizing:{
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 40
    },
    commandLineView:{
      borderColor: "lime",
      borderWidth: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      width: "45%",
      height: "50%",
      maxHeight: 300,
      minHeight: 300,
      padding: 10,
      paddingLeft: 10,
      position: "absolute",
      right: 0,
      top: 195,
      backgroundColor: "black",
      zIndex: 2,
      opacity: 0.7
    },
    absoluteCli:{
      // position: "absolute"
    },
    commandLineText:{
      color: "lime",
      fontSize: 11
    },
    viewToggleApp:{
      backgroundColor: "transparent",
      width: "90%",
      maxWidth: "90%",
      marginTop: 0,
      marginLeft: 0,
      alignItems: "center",
      borderRadius: 10,
      opacity: 1
    },
    labelPreview:{
      color: "lime",
    },
    labelPreviewDefault:{
      color: "lime",
      marginTop: 0
    },
    iconPreviewDefault:{
      color: "lime",
      marginTop: 0
    },
    labelPreviewButton:{
      color: "black",
      backgroundColor: "lime",
      marginTop: 5,
      borderWidth: 1,
      borderColor: "lime",
      padding: 2,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 5
    },
    viewWeather:{
      borderColor: "lime",
      borderWidth: 1,
      position: "absolute",
      right: 0,
      zIndex: 2,
      width: "45%",
      top: 500,
      borderRadius: 10,
      minHeight: 80,
      opacity: 0.7,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    textWeather:{
      color: "lime",
      fontSize: 12
    },
    viewAstronomy:{
      borderColor: "lime",
      borderWidth: 1,
      position: "absolute",
      right: 0,
      zIndex: 2,
      width: "45%",
      top: 585,
      borderRadius: 10,
      minHeight: 80,
      opacity: 0.7,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    viewDevTools:{
      borderColor: "lime",
      borderWidth: 1,
      position: "absolute",
      right: 0,
      zIndex: 2,
      width: "45%",
      top: 670,
      borderRadius: 10,
      minHeight: 40,
      opacity: 0.7,
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "black",
      flexDirection: "row"
    },
    viewDevUnder:{
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center"
    },
    textAstronomy:{
      color: "lime",
      fontSize: 12
    },
    weatherViewResult:{
      backgroundColor: "transparent",
      width: "100%",
      height: "100%",
      borderRadius: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    iconWeather:{
      width: 40,
      height: 40
    },
    iconAstronomy:{
      color: "lime",
      margin: 10,
      marginLeft: -5
    },
    hexagon: {
      width: 80,
      height: 30,
      marginBottom: 55
    },
    hexagonInner: {
      width: 70,
      height: 30,
      backgroundColor: "transparent",
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderColor: "rgba(0, 255, 255, .5)"
    },
    hexagonAfter: {
      position: "absolute",
      bottom: -25,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderLeftWidth: 35,
      borderLeftColor: "transparent",
      borderRightWidth: 35,
      borderRightColor: "rgba(0, 255, 255, .5)",
      borderTopWidth: 25,
      borderTopColor: "transparent",
      paddingTop: 20,
      borderRadius: 100
    },
    hexagonBefore: {
      position: "absolute",
      top: -25,
      left: 0,
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderLeftWidth: 35,
      borderLeftColor: "rgba(0, 255, 255, .5)",
      borderRightWidth: 35,
      borderRightColor: "transparent",
      borderBottomWidth: 25,
      borderBottomColor: "transparent",
      alignItems: 'center',
      paddingTop: 20,
      borderRadius: 100
    }
})

export default AppList