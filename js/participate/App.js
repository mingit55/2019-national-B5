class App {
    constructor(){
        this.toolList = {
            "line" : () => new Line(this, this.viewer.currentTrack),
            "rect": () => new Rect(this, this.viewer.currentTrack),
            "text": () => new Text(this, this.viewer.currentTrack)
        }

        this.loadDOM();
        this.loadClass();
        this.loadEvent();
    }

    get currentTool(){
        let selected = document.querySelector(".btn-tool.active");
        return selected && selected.dataset.tool;
    }

    loadDOM(){
        this.$videoArea = document.querySelector("#video-area");
        this.$timeArea = document.querySelector("#time-area");
        this.$clipArea = document.querySelector("#clip-area");
        this.$movieArea = document.querySelector("#movie-area");
    }

    loadClass(){
        this.viewer = new Viewer(this);
    }

    loadEvent(){
        // 영화 커버 이미지를 클릭했을 때
        this.$movieArea.querySelectorAll("img").forEach((img, idx) => {
            img.addEventListener("click", e => {
                let url = `/videos/movie${idx + 1}.mp4`;
                let track = this.viewer.hasTrack(url)
                if(track) this.viewer.loadTrack(track);
                else {
                    track = new Track(this, url);
                    this.viewer.trackList.push(track);
                    this.viewer.loadTrack(track);
                }
            });
        });

        // 각 기능 버튼을 클릭했을 때
        document.querySelectorAll(".btn-tool").forEach((btn, idx, arr) => {
            btn.addEventListener("click", e => {
                if(this.isMovieLoaded()){
                    let selected = document.querySelector(".btn-tool.active");
                    if(selected){
                        selected.classList.remove("active");
                    } 
                    if(!selected || selected.dataset.tool !== btn.dataset.tool) {
                        btn.classList.add("active");
                    }
                }
            });
        });

        // 그 외 버튼들을 클릭했을 때 
        document.querySelector("#btn-play")
            .addEventListener("click", e => this.isMovieLoaded() && this.viewer.play());
        
        document.querySelector("#btn-pause")
            .addEventListener("click", e => this.isMovieLoaded() && this.viewer.pause());
        
        document.querySelector("#btn-alldel")
            .addEventListener("click", e => this.isMovieLoaded() && this.viewer.currentTrack.alldel());
            
        document.querySelector("#btn-pickdel")
            .addEventListener("click", e => this.isMovieLoaded() && this.viewer.currentTrack.pickdel());

        document.querySelector("#btn-download")
            .addEventListener("click", e => this.isMovieLoaded() && this.download());
    }

    download(){

    }

    isMovieLoaded(){
        if(!this.viewer.$video.duration){
            alert("먼저 영상을 선택해 주세요!");
            return false;
        }

        return true;
    }

    toTimeFormat(sec){
        let hour = parseInt(sec / 3600);
        let min = parseInt(sec / 60) % 60;
        sec = parseInt(sec % 60);
        
        if(hour < 10) hour = "0" + hour;
        if(min < 10) min = "0" + min;
        if(sec < 10) sec = "0" + sec;

        return [hour, min, sec].join(":");
    }

    toHTMLFormat(stringHTML){
        let elem = document.createElement("div");
        elem.innerHTML = stringHTML;
        return elem.firstElementChild;
    }
}   

window.addEventListener("load", () => {
    const editor = new App();
});