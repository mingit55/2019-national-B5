class Viewer {
    constructor(app){
        this.app = app;
        this.currentTrack = null;
        this.activeClip = null;
        this.trackList = [];

        this.$currentTime = app.$timeArea.querySelector("#video-current");
        this.$clipBox = app.$videoArea.querySelector(".clip-box");

        this.loadEvent();
        this.render();
    }
    
    loadEvent(){
        this.app.$videoArea.addEventListener("mousedown", e => {
            if(e.which === 1 && this.currentTrack) {
                if(this.app.currentTool && this.app.currentTool === "pick"){
                    this.activeClip = this.currentTrack.getSelection(e);
                }
                else if(!this.activeClip && ["line", "rect", "text"].includes(this.app.currentTool)) {
                    this.activeClip = this.app.toolList[this.app.currentTool]();
                    this.currentTrack.pushClip(this.activeClip);
                    this.activeClip.mouseDown && this.activeClip.mouseDown(e);
                }
            }
        });

        window.addEventListener("mousemove", e => {
            if(e.which === 1 && this.currentTrack && this.activeClip){
                if(this.app.currentTool && this.app.currentTool === "pick"){
                    this.currentTrack.moveSelection(e);
                }
                else if(["line", "rect", "text"].includes(this.app.currentTool)) {
                    this.activeClip.mouseMove && this.activeClip.mouseMove(e);
                }
            }
        });

        window.addEventListener("mouseup", e => {
            if(e.which === 1 && this.currentTrack && this.activeClip){
                if(this.app.currentTool && this.app.currentTool === "pick"){
                    this.clear();
                }
                else if(["line", "rect", "text"].includes(this.app.currentTool)) {
                    this.activeClip.mouseUp && this.activeClip.mouseUp(e);
                }
            }
        });
    }

    render(){
        if(this.currentTrack){
            const {currentTime} = this.currentTrack.$video;
            this.currentTrack.setCursorPosition(currentTime);
            this.$currentTime.innerText = this.app.toTimeFormat(currentTime);
            this.$clipBox.innerHTML = "";

            this.currentTrack.clipList.forEach(clip => {
                if(clip.startTime <= currentTime && currentTime <= clip.startTime + clip.duration){
                    clip.redraw();
                    if(!document.querySelector("#" + clip.$canvas.id)){
                        this.$clipBox.append(clip.$canvas);
                    }
                }
                else {
                    clip.$canvas.remove();
                }
            });
        }

        requestAnimationFrame(() => this.render());
    }


    hasTrack(videoURL){
        return this.trackList.find(track => track.url == videoURL);
    }

    loadTrack(track){
        if(this.currentTrack) {
            this.currentTrack.$video.remove();
        }

        this.currentTrack = track;
        this.currentTrack.clipList = [];
        this.currentTrack.loadClipLine();
        this.currentTrack.$video.currentTime = 0;
        this.app.$videoArea.prepend(this.currentTrack.$video);
    }

    play(){
        this.currentTrack.$video.play();
    }
    
    pause(){
        this.currentTrack.$video.pause();
    }

    clear(){
        this.activeClip = null;
    }
}