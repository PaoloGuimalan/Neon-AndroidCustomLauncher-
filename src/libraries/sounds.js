const Sound = require("react-native-sound");
Sound.setCategory('Playback');

export const openAppList = () => {
    var click = new Sound('openapplist.mp3', Sound.MAIN_BUNDLE, (error) => {
        if(error){
            alert(error.message)
            return; 
        }
        else{
            click.play((success) => {
                if(success){
                    click.release()
                }
                else{
                    alert("error!");
                }
            });
        }
    })

    // alert(click.getDuration())
}

export const processCommand = () => {
    var processAudio = new Sound("commandline_process.mp3", Sound.MAIN_BUNDLE, (error) => {
        if(error){
            alert(error.message);
            return;
        }
        else{
            processAudio.play((success) => {
                if(success){
                    processAudio.release();
                }
                else{
                    alert("error!");
                }
            })
        }
    })
}

export const backPress = () => {
    var pressBack = new Sound("back_press.mp3", Sound.MAIN_BUNDLE, (error) => {
        if(error){
            alert(error.message);
            return;
        }
        else{
            pressBack.play((success) => {
                if(success){
                    pressBack.release();
                }
                else{
                    alert("error!");
                }
            })
        }
    })
}

export const appPressSound = () => {
    var appPressVar = new Sound("apppress.mp3", Sound.MAIN_BUNDLE, (error) => {
        if(error){
            alert(error.message);
            return;
        }
        else{
            appPressVar.play((success) => {
                if(success){
                    appPressVar.release();
                }
                else{
                    alert("error!");
                }
            })
        }
    })
}