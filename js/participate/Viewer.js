class Viewer {
    constructor(app){
        this.app = app;
        this.currentTrack = null;
        this.trackList = [];

        this.$video = app.$videoArea.querySelector("video");
        this.$video.volume = 0.5;

        this.$clipBox = app.$videoArea.querySelector(".clip-box");

        this.loadEvent();
        this.render();
    }
    
    loadEvent(){
        this.$video.addEventListener("loadedmetadata", e => {
            let $duration = this.app.$timeArea.querySelector("#video-duration");
            $duration.innerText = this.app.toTimeFormat(this.$video.duration);
        });

        window.addEventListener("mousedown", e => {
            if(e.which === 1 && this.currentTrack) {
                if(this.app.currentTool && this.app.currentTool === "pick"){

                }
                else if(["line", "rect", "text"].includes(this.app.currentTool)) {
                    let clip = this.app.toolList[this.app.currentTool]();
                    this.currentTrack.clipList.push(clip);
                    clip.mouseDown && clip.mouseDown(e);
                }
            }
        });
    }

    render(){
        requestAnimationFrame(() => this.render());
    }


    hasTrack(videoURL){
        return this.trackList.find(track => track.url == videoURL);
    }

    loadTrack(track){
        this.currentTrack = track;
        this.currentTrack.clipList = [];
        this.currentTrack.loadClipLine();
        this.$video.src = this.currentTrack.url;
        this.$video.currentTime = 0;
    }

    play(){
        this.$video.play();
    }
    
    pause(){
        this.$video.pause();
    }
}