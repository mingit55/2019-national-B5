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

    get color(){
        return document.querySelector("#s_color").value;
    }

    get lineWidth(){
        return document.querySelector("#s_lineWidth").value;
    }

    get fontSize(){
        return document.querySelector("#s_fontSize").value;
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

        // 병합
        document.querySelector("#btn-merge")
            .addEventListener("click", e => this.isMovieLoaded() && this.merge());
    }

    download(){
        let $clipList = this.viewer.currentTrack.clipList.reduce((p, c) => p + `<img src="${c.toDataURL()}" alt="clip-item" data-start="${c.startTime}" data-duration="${c.duration}" />`, "");
        let htmlFormat = `<style>
                            #viewer {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                background-color: #000;
                            }

                            #viewer video,
                            #viewer #clip-list,
                            #viewer #clip-list img {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                pointer-events: none;
                            }

                            #btn-control {
                                 opacity: 0;
                                 transition: 0.3s;
                                 position: absolute;
                                 left: 50%;
                                 top: 50%;
                                 transform: translate(-50%, -50%);
                                 padding: 5px 10px;
                                 border-radius: 10px;
                                 border: none;
                                 background-color: #fff;
                                 color: #555;
                                 font-size: 15px;
                                 z-index: 10;
                            }

                            #viewer:hover #btn-control { opacity: 1; }
                        </style>
                        <div id="viewer">
                            <video id="movie-video" src="${this.viewer.currentTrack.$video.src}"></video>
                            <div id="clip-list">
                                ${$clipList}
                            </div>
                            <button id="btn-control">재생</button>
                        </div>
                    
                        <script>
                            window.addEventListener("load", () => {
                                let clipList = document.querySelectorAll("#clip-list > img");
                                let video = document.querySelector("#movie-video");
                    
                                function render(){
                                    clipList.forEach(clip => {
                                        let startTime = parseInt(clip.dataset.start);
                                        let duration = parseInt(clip.dataset.duration);
                    
                                        if(startTime <= video.currentTime && video.currentTime <= startTime + duration){
                                            clip.style.visibility = "visible";
                                        } else {
                                            clip.style.visibility = "hidden";
                                        }
                                    });
                    
                                    requestAnimationFrame(render);
                                }   
                                
                                render();

                                let controlBtn = document.querySelector("#btn-control");
                                controlBtn.addEventListener("click", e => {
                                    if(controlBtn.innerText.trim() === "재생"){
                                        video.play();
                                        controlBtn.innerText = "정지";
                                    } else {
                                        video.pause();
                                        controlBtn.innerText = "재생";
                                    }
                                });
                            });
                        </script>`;
        let data = new Blob([htmlFormat], {type: "text/html"});
        let url = URL.createObjectURL(data);

        let now = new Date(),
            y = `${now.getFullYear()}`.substr(-2),
            m = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1,
            d = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();

        let $a = document.createElement("a");
        $a.href = url;
        $a.download = `movie-${y + m + d}.html`;
        $a.click();
        $a.remove();
    }

    merge(){
        let [checkList, nonCheckList] = this.viewer.currentTrack.clipList.reduce((p, c) => {
            c.active = false;
            c.$checkbox.checked ? p[0].push(c) : p[1].push(c)
            return p;
        }, [[], []]);
        
        
        let clip = new Group(this, this.viewer.currentTrack, checkList);
        this.viewer.currentTrack.clipList = [...nonCheckList, clip];

        this.viewer.update();
    }

    isMovieLoaded(){
        if(!this.viewer.currentTrack){
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