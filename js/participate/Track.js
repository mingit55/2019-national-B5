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

    loadClipLine(){
        this.app.$clipArea.innerHTML = "";
        this.app.$clipArea.append(this.template);
    }

    alldel(){

    }

    pickdel(){

    }
}