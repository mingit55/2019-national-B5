class Clip {
    constructor(app, track){
        this.app = app;
        this.viewer = app.viewer;
        this.track = track;
        this.group = [];
        this.startTime = 0;
        this.duration = this.track.duration;
        this.$canvas = document.createElement("canvas");
        this.$canvas.id = "canvas" + (new Date().getTime());
        this.$canvas.width = this.app.$videoArea.offsetWidth;
        this.$canvas.height = this.app.$videoArea.offsetHeight;
        this.ctx = this.$canvas.getContext("2d");
        this.ctx.fillStyle = this.ctx.strokeStyle = this.app.color;
        this.ctx.lineWidth = this.app.lineWidth;
        this.ctx.font = `${this.app.fontSize}px "나눔 스퀘어", sans-serif`;

        this.$line = this.app.toHTMLFormat(`<div class="line clip-line">
                                                <div class="left"></div>
                                                <div class="center"></div>
                                                <div class="right"></div>
                                            </div>`);
        this.$line.addEventListener("click", () => this.active = ! this.active)
    }

    get active(){
        return this.$line.classList.contains("active");
    }

    set active(value){
        if(value){
            this.$line.classList.add("active")
            document.querySelector("#clip-start").innerText = this.app.toTimeFormat(this.startTime);
            document.querySelector("#clip-duration").innerText = this.app.toTimeFormat(this.duration);
        } else {
            this.$line.classList.remove("active");
        }
    }

    getXY(e){
        let {pageX, pageY} = e;
        let {offsetLeft, offsetTop} = this.app.$videoArea;

        let X = pageX - offsetLeft < 0 ? 0 : pageX - offsetLeft > this.app.$videoArea.offsetWidth ? this.app.$videoArea.offsetWidth :  pageX - offsetLeft;
        let Y = pageY - offsetTop < 0 ? 0 : pageY - offsetTop > this.app.$videoArea.offsetHeight ? this.app.$videoArea.offsetHeight :  pageY - offsetTop;

        return [X, Y];
    }
}