class Track {
    constructor(app, url){
        this.app = app;
        this.viewer = app.viewer;
        this.url = url;
        this.clipList = [];
        this.pickList = [];

        this.$video = document.createElement("video");
        this.$video.src = url;
        this.$video.onloadedmetadata = () => {
            this.currentTime = 0;
            this.duration = this.$video.duration;

            let $duration = this.app.$timeArea.querySelector("#video-duration");
            $duration.innerText = this.app.toTimeFormat(this.$video.duration);
        };

        this.$lineBox = this.app.toHTMLFormat(`
            <div class="d-flex flex-column py-3">
                <div class="line movie-line"></div>
                <div id="cursor"></div>
            </div>
        `);
        this.$cursor = this.$lineBox.querySelector("#cursor");

        this.loadCursorEvent();
    }

    getSelection(e){
        this.app.$timeArea.querySelector("#clip-start").innerText = this.app.toTimeFormat(0);
        this.app.$timeArea.querySelector("#clip-duration").innerText = this.app.toTimeFormat(0);

        let selected = null;        
        this.clipList.forEach(clip => {
            let left = clip.$canvas.offsetLeft;
            let top = clip.$canvas.offsetTop;

            let [X, Y] = clip.getXY(e);

            let x = X - left;
            let y = Y - top;

            if(!selected && clip.selectDown(x, y)){
                clip.active = true;
                selected = clip;
            }
            else {
                clip.active = false;
            }
        });

        return selected;
    }

    moveSelection(e){
        const {pageX, pageY} = e;
        const {offsetLeft, offsetTop, offsetWidth, offsetHeight} = this.app.$videoArea;

        let X = pageX - offsetLeft;
        X = X < 0 ? 0 : X > offsetWidth ? offsetWidth : X;
        
        let Y = pageY - offsetTop;
        Y = Y < 0 ? 0 : Y > offsetHeight ? offsetHeight : Y;

        let pickList = this.clipList.filter(clip => clip.active);
        pickList.forEach(clip => clip.selectMove(X, Y));
    }

    loadClipLine(){
        this.app.$clipArea.innerHTML = "";
        this.$lineBox.querySelectorAll(".clip-line").forEach(elem => elem.remove());
        this.app.$clipArea.append(this.$lineBox);
    }

    alldel(){
        this.clipList.forEach(clip => {
            clip.$canvas.remove();
            clip.$line.remove();
        });
        this.clipList = [];
    }

    pickdel(){
        let nonActives = [];
        this.clipList.forEach(clip => {
            if(clip.active){
                clip.$canvas.remove();
                clip.$line.remove();
            } else {
                nonActives.push(clip);
            }
        });
        
        this.clipList = nonActives;
    }

    pushClip(clip){
        this.clipList.push(clip);
        this.$lineBox.prepend(clip.$line);
    }

    loadCursorEvent(){
        let clicked = false;

        this.$cursor.addEventListener("mousedown", e => clicked = e.which === 1);
        window.addEventListener("mousemove", e => {
            if(clicked){    
                let {offsetWidth, offsetLeft} = this.app.$clipArea;
                let X = e.pageX - offsetLeft;
                X = X < 0 ? 0 : X > offsetWidth ? offsetWidth : X;
                
                this.$cursor.style.left = X + "px";
                this.$video.currentTime = this.$video.duration * X / offsetWidth;
            }
        });
        window.addEventListener("mouseup", e => clicked = false);
    }

    setCursorPosition(sec){
        let {offsetWidth} = this.app.$clipArea;       
        this.$cursor.style.left = offsetWidth * sec / this.duration  + "px";
    }
}