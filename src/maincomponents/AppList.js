import { View, Text, StyleSheet, NativeModules, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'

const AppList = () => {

  const [allApps, setallApps] = useState(["...loading"]);
  const [appPreview, setappPreview] = useState([]);
  const [cliArray, setcliArray] = useState(["AppList"]);

  useEffect(() => {
    // const allapps = JSON.parse(NativeModules.InstalledApps.getApps)
    // console.log("All Packages", NativeModules.InstalledApps.getApps);
    loaderApps()
  }, []);

  const loaderApps = async () => {
    try{
      const appsResult = NativeModules.InstalledApps.getApps;

      setTimeout(() => {
        setcliArray(["Configuring Native Modules", ...cliArray])
      }, 500);
      setTimeout(() => {
        setcliArray(["Unpacking...", "Configuring Native Modules", ...cliArray])
      }, 1000);
      setTimeout(() => {
        setcliArray(["Loaded Successfuly!", "Unpacking...","Configuring Native Modules", ...cliArray])
      }, 1500);

      const arr = appsResult.replace(/\[, ]/g, "[]").split("[]")
      arr.shift()
      arr.pop()
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

    try{
      if(app.replace(/\"/g, "").split(",")[1] == "" || app.replace(/\"/g, "").split(",")[1] == undefined || app.replace(/\"/g, "").split(",")[1] == null){
        alert(`App Undetected: ${app.replace(/\"/g, "").split(",")[1]}`)
      }
      else{
        setcliArray([`${label} in preview`, ...cliArray])
        setappPreview([label, name, icon]);
      }
    }
    catch(err){
      alert("App Undetected!")
    }

    // NativeModules.InstalledApps.launchApplication(app.replace(/\"/g, "").split(",")[1]);
  }

  const openAppPress = () => {
    try{
      setTimeout(() => {
        setcliArray([`${appPreview[0]} initializing...`, ...cliArray])
      }, 500);
      setTimeout(() => {
        setcliArray([`${appPreview[0]} scanning...`,`${appPreview[0]} initializing...`, ...cliArray])
      }, 1000);
      setTimeout(() => {
        setcliArray([`${appPreview[0]} openning...`,`${appPreview[0]} scanning...`,`${appPreview[0]} initializing...`, ...cliArray])
      }, 1500);
      setTimeout(() => {
        setcliArray([`${appPreview[0]} running!`,`${appPreview[0]} Openning...`,`${appPreview[0]} scanning...`,`${appPreview[0]} initializing...`, ...cliArray])
      }, 2000);
      setTimeout(() => {
        NativeModules.InstalledApps.launchApplication(appPreview[1]);
      }, 2500);
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
      <ScrollView style={ApplistStyle.commandLineView}>
        {cliArray.map((cli,i) => {
          return(
            <Text key={i} style={ApplistStyle.commandLineText}>&gt; {cli}</Text>
          )
        })}
      </ScrollView>
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
        paddingLeft: 30
    },
    noteStyle:{
        color: "cyan",
        fontSize: 15,
        margin: 2,
        textAlign: "left"
    },
    scrollViewStyle:{
      padding: 10,
      paddingLeft: 30,
      paddingRight: 30
    },
    scrollStyle:{
      width: "100%",
    },
    absoluteView:{
      backgroundColor: "black",
      width: 200,
      height: 200,
      borderBottomLeftRadius: 200,
      alignItems: "center",
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderColor: "cyan",
      marginBottom: 5,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1,
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
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      width: "100%",
      height: "15%",
      maxHeight: "15%",
      padding: 10,
      paddingLeft: 40
    },
    commandLineText:{
      color: "lime",
      fontSize: 12
    },
    viewToggleApp:{
      backgroundColor: "black",
      width: "70%",
      maxWidth: "70%",
      marginTop: 40,
      marginLeft: 50,
      alignItems: "center",
      borderBottomStartRadius: 50
    },
    labelPreview:{
      color: "cyan"
    },
    labelPreviewDefault:{
      color: "cyan",
      marginTop: 30
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
    }
})

export default AppList