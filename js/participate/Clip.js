class Clip {
    constructor(app, track){
        this.app = app;
        this.viewer = app.viewer;
        this.track = track;
        this.startTime = 0;
        this.duration = this.track.duration;

        this.x = 0;
        this.y = 0;

        this.$canvas = document.createElement("canvas");
        this.$canvas.id = "canvas" + (new Date().getTime());
        this.$canvas.width = this.app.$videoArea.offsetWidth;
        this.$canvas.height = this.app.$videoArea.offsetHeight;
        this.ctx = this.$canvas.getContext("2d");
        this.ctx.fillStyle = this.ctx.strokeStyle = this.app.color;
        this.ctx.lineWidth = this.app.lineWidth;
        this.ctx.font = `${this.app.fontSize}px "나눔 스퀘어", sans-serif`;

        this.$startTime = this.app.$timeArea.querySelector("#clip-start");
        this.$duration = this.app.$timeArea.querySelector("#clip-duration");

        this.$line = this.app.toHTMLFormat(`<div class="line clip-line" draggable="true">
                                                <input type='checkbox'/>
                                                <div class="bar">
                                                    <div class="left"></div>
                                                    <div class="center"></div>
                                                    <div class="right"></div>
                                                </div>
                                            </div>`);
        this.$bar = this.$line.querySelector(".bar");
        this.$checkbox = this.$line.querySelector("input");
        this.$line.addEventListener("click", () => {
            this.track.clipList.forEach(clip => clip.active = false);
            this.active = true;
        });
        this.loadResizeEvent();
        this.loadDragEvent();
    }

    get active(){
        return this.$line.classList.contains("active");
    }

    set active(value){
        if(value){
            this.$line.classList.add("active")
            this.$startTime.innerText = this.app.toTimeFormat(this.startTime);
            this.$duration.innerText = this.app.toTimeFormat(this.duration);
        } else {
            this.$line.classList.remove("active");
        }
    }

    selectMove(x, y){
        const [downX, downY] = this.temp;

        let toX = ( x - downX);
        let toY = ( y - downY);

        this.x = toX;
        this.y = toY;

        this.$canvas.style.left = toX + "px";
        this.$canvas.style.top = toY + "px";
    }

    getXY(e){
        let {pageX, pageY} = e;
        let {offsetLeft, offsetTop} = this.app.$videoArea;

        let X = pageX - offsetLeft < 0 ? 0 : pageX - offsetLeft > this.app.$videoArea.offsetWidth ? this.app.$videoArea.offsetWidth :  pageX - offsetLeft;
        let Y = pageY - offsetTop < 0 ? 0 : pageY - offsetTop > this.app.$videoArea.offsetHeight ? this.app.$videoArea.offsetHeight :  pageY - offsetTop;

        return [X, Y];
    }

    getLineX(e){
        let width = this.app.$clipArea.offsetWidth;
        let left = this.app.$clipArea.offsetLeft

        let X = e.pageX - left;
        X = X < 0 ? 0 : X > width ? width : X;

        return X;
    }

    loadResizeEvent(){
        let down = false;
        let downX = null;
        let before = [];
        this.$line.querySelector(".left").addEventListener("mousedown", e => {
            down = "left";
            downX = this.getLineX(e);
            before = [this.$bar.offsetLeft, this.$bar.offsetWidth];
        });
        this.$line.querySelector(".center").addEventListener("mousedown", e => {
            down = "center";
            downX = this.getLineX(e);
            before = [this.$bar.offsetLeft, this.$bar.offsetWidth];
        });
        this.$line.querySelector(".right").addEventListener("mousedown", e => {
            down = "right";
            downX = this.getLineX(e);
            before = [this.$bar.offsetLeft, this.$bar.offsetWidth];
        });

        window.addEventListener("mousemove", e => {
            if(down !== false && e.which === 1){
                let minW = 30;
                let layoutW = this.app.$clipArea.offsetWidth;

                let X = this.getLineX(e);
                let [beforeX, beforeW] = before;
                let left = this.$bar.offsetLeft;
                let width = this.$bar.offsetWidth;

                if(down === "left") {
                    left = X >= beforeX + beforeW - minW ? beforeX + beforeW - minW : X;
                    width = beforeW + (beforeX - X);
                }
                else if(down === "center"){
                    left = X + (beforeX - downX);
                }
                else if(down === "right"){
                    width = X - beforeX;
                }
                

                width = width < minW ? minW : width;
                left = left < 0 ? 0 : left > layoutW - width ? layoutW - width : left;
                
                this.$bar.style.left = left + "px";
                this.$bar.style.width = width + "px";

                this.startTime = this.track.duration * left / layoutW;
                this.duration = this.track.duration * width / layoutW;

                this.$startTime.innerText = this.app.toTimeFormat(this.startTime);
                this.$duration.innerText = this.app.toTimeFormat(this.duration);
            }
        });

        window.addEventListener("mouseup", e => {
            down = false;
            downX = null;
            before = [];
        });
    }

    loadDragEvent(){
        this.track.dragTarget = null;
        this.track.dropTarget = null;
        this.$line.addEventListener("dragstart", e => {
            // e.preventDefault();
            this.track.dragTarget = this;
        });

        this.$line.addEventListener("dragover", e => e.preventDefault());

        this.$line.addEventListener("drop", e => {
            if(this.track.dragTarget !== null){
                this.track.dropTarget = this;

                let dragIdx = this.track.clipList.findIndex(clip => clip == this.track.dragTarget);
                let dropIdx = this.track.clipList.findIndex(clip => clip == this.track.dropTarget);

                this.track.clipList[dragIdx] = this.track.dropTarget;
                this.track.clipList[dropIdx] = this.track.dragTarget;

                this.track.dragTarget = this.track.dropTarget = null;
                this.viewer.update();
            }
        });
        
    }

    toDataURL(){
        let temp = this.active;
        this.active = false;
        this.redraw();
        let url = this.$canvas.toDataURL("image/png");
        this.active = temp;

        return url;
    }
}