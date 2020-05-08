class Line extends Clip {
    constructor(){
        super(...arguments);

        this.history = [];
    }

    mouseDown(e){
        let [X, Y] = this.getXY(e);
        this.history.push([X, Y]);
    }

    mouseMove(e){
        let [X, Y] = this.getXY(e);
        this.history.push([X, Y]);
    }

    mouseUp(e){
        let [X, Y] = this.getXY(e);
        this.history.push([X, Y]);
        this.viewer.clear();
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

        this.ctx.beginPath();
        this.history.forEach(([X, Y]) => {
            this.ctx.lineTo(X, Y);
        });
        this.ctx.stroke();
    }
}