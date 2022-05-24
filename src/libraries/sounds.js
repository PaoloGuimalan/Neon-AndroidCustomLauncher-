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