class Group extends Clip {
    constructor(app, track, group){
        super(...arguments);
        this.group = [...group];
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