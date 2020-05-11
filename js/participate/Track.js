class Track {
    constructor(app, url){
        this.app = app;
        this.viewer = app.viewer;
        this.url = url;
        this.clipList = [];
        this.pickList = [];

        this.$lineBox = this.app.toHTMLFormat(`
            <div class="d-flex flex-column py-3">
                <div class="line movie-line"></div>
            </div>
        `);

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
        this.app.$clipArea.append(this.$lineBox);
    }

    alldel(){

    }

    pickdel(){
        this.clipList = this.clipList.filter(clip => !clip.active);
    }

    pushClip(clip){
        this.clipList.push(clip);
        this.$lineBox.prepend(clip.$line);
    }
}