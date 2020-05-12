class Group extends Clip {
    constructor(app, track, group){
        super(...arguments);
        this.group = [...group];

        this.startTime = this.group.reduce((p, c) => Math.min(p, c.startTime), this.track.duration);
        this.duration = this.group.reduce((p, c) => Math.max(p, c.startTime + c.duration), 0) - this.startTime;

        let layoutW = this.app.$clipArea.offsetWidth;
        this.$bar.style.left = layoutW * this.startTime / this.track.duration + "px";
        this.$bar.style.width = layoutW * this.duration / this.track.duration + "px";
    }

    selectDown(x, y){
        this.temp = [x, y];

        return this.group.some(clip => clip.selectDown(x - clip.x, y - clip.y));
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

        this.group.forEach(clip => {
            clip.active = this.active;
            clip.redraw();
            this.ctx.drawImage(clip.$canvas, clip.x, clip.y, this.$canvas.width, this.$canvas.height);
        });
    }
}