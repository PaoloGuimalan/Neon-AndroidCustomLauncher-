import { View, Text, StyleSheet, NativeModules, ScrollView, Image, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { appPressSound, backPress, processCommand } from '../libraries/sounds'
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const AppList = ({navigation}) => {

  const [allApps, setallApps] = useState(["...loading"]);
  const [appPreview, setappPreview] = useState([]);
  const [cliArray, setcliArray] = useState(["AppList"]);

  const weatherdata = useSelector(state => state.weatherdata);
  const astrodata = useSelector(state => state.astrodata);
  const dispatch = useDispatch();

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
      setallApps(arr);
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
        }, 500)
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
        {allApps.map((app, i) => {
          return(
            <View key={i} style={ApplistStyle.viewApp}>
              {/* <Image style={ApplistStyle.imageSizing} resizeMode={'contain'} source={{uri: "data:image/png;base64," + app.replace(/\"/g, "").split(",")[2]}} /> */}
              <Text style={ApplistStyle.noteStyle} onPress={() => {openApp(app)}} >{app.replace(/\"/g, "").split(",")[0]}</Text>
            </View>
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
    </View>
  )
}

const ApplistStyle = StyleSheet.create({
    viewStyle:{
        backgroundColor: "black",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textStyle:{
        color: "cyan",
        fontSize: 20,
        marginTop: 10,
        backgroundColor: "black",
        width: "100%",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 25
    },
    noteStyle:{
        color: "cyan",
        fontSize: 15,
        margin: 2,
        textAlign: "left",
        width: "50%",
        borderBottomColor: "cyan",
        borderBottomWidth: 0.5
    },
    scrollViewStyle:{
      padding: 10,
      paddingLeft: 15,
      paddingRight: 30
    },
    scrollStyle:{
      width: "100%",
    },
    absoluteView:{
      backgroundColor: "black",
      width: "45%",
      height: 150,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "cyan",
      marginBottom: 5,
      position: "absolute",
      justifyContent: "center",
      right: 0,
      top: 40,
      zIndex: 1,
      opacity: 0.7
    },
    textLabelabsolute:{
      color: "cyan"
    },
    viewApp:{
      borderWidth: 0,
      borderColor: "cyan",
      marginBottom: 2,
    },
    imageSizing:{
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 40
    },
    commandLineView:{
      borderColor: "cyan",
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
      color: "cyan",
    },
    labelPreviewDefault:{
      color: "cyan",
      marginTop: 0
    },
    iconPreviewDefault:{
      color: "cyan",
      marginTop: 0
    },
    labelPreviewButton:{
      color: "black",
      backgroundColor: "cyan",
      marginTop: 5,
      borderWidth: 1,
      borderColor: "cyan",
      padding: 2,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 5
    },
    viewWeather:{
      borderColor: "cyan",
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
      alignItems: "center"
    },
    textWeather:{
      color: "cyan",
      fontSize: 12
    },
    viewAstronomy:{
      borderColor: "cyan",
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
      alignItems: "center"
    },
    textAstronomy:{
      color: "cyan",
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
      color: "cyan",
      margin: 10,
      marginLeft: -5
    }
})

export default AppList