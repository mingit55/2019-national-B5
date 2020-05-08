class Clip {
    constructor(app, track){
        this.app = app;
        this.track = track;
        this.group = [];

        this.$line = this.app.toHTMLFormat(`<div class="line clip-line">
                            <div class="left"></div>
                            <div class="center"></div>
                            <div class="right"></div>
                        </div>`);
    }
}