class Rect extends Clip {
    constructor(){
        super(...arguments);

        this.completed = false;
        this.temp = [0, 0];
        this.data = { x: 0, y: 0, w: 0, h: 0 };
    }

    selectDown(x, y){
        return this.data.x <= x && x <= this.data.x + this.data.w
                && this.data.y <= y && y <= this.data.y + this.data.h;
    }

    mouseDown(e){
        let [X, Y] = this.getXY(e);
        this.data.x = X;
        this.data.y = Y;
        this.temp = [X, Y];
    }

    mouseMove(e){
        let [fx, fy] = this.temp;
        let [X, Y] = this.getXY(e);
        let {x, y} = this.data;

        let w = X - fx;
        let h = Y - fy;

        if(w < 0){
            x = X;
            w = fx - X;
        }

        if(h < 0){
            y = Y;
            h = fy - Y;
        }

        this.data = {x, y, w, h};
    }

    mouseUp(){
        this.completed = true;
        this.viewer.clear();
    }

    redraw(){
        let {x, y, w, h} = this.data;
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

        if(!this.completed) this.ctx.strokeRect(x, y, w, h);
        else this.ctx.fillRect(x, y, w, h);

        
        if(this.active){
            this.ctx.save();
            this.ctx.strokeStyle = "#C92039";
            this.ctx.strokeRect(x, y, w, h);
            this.ctx.restore();
        }
    }
}