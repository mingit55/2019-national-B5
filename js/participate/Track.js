class Track {
    constructor(app, url){
        this.app = app;
        this.viewer = app.viewer;
        this.url = url;
        this.clipList = [];
        this.pickList = [];

        this.template = this.app.toHTMLFormat(`
            <div class="d-flex flex-column py-3">
                <div class="line movie-line"></div>
            </div>
        `);

    }

    getSelection(e){
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

    loadClipLine(){
        this.app.$clipArea.innerHTML = "";
        this.app.$clipArea.append(this.template);
    }

    alldel(){

    }

    pickdel(){
        this.clipList = this.clipList.filter(clip => !clip.active);
    }
}