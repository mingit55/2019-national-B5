class Line extends Clip {
    constructor(){
        super(...arguments);

        this.history = [];
    }

    selectDown(x, y){
        this.temp = [x, y];
        
        let colorData = this.ctx.getImageData(x, y, 1, 1).data;
        return colorData[3] !== 0;
    }

    selectMove(x, y){
        const [downX, downY] = this.temp;

        let toX = ( x - downX);
        let toY = ( y - downY);

        this.$canvas.style.left = toX + "px";
        this.$canvas.style.top = toY + "px";
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


        if(this.active){
            this.ctx.beginPath();
            this.ctx.save();
            this.ctx.strokeStyle = "#C92039";
            this.ctx.lineWidth = this.ctx.lineWidth * 2;
            this.history.forEach(([X, Y]) => {
                this.ctx.lineTo(X, Y);
            });
            this.ctx.stroke();    
            this.ctx.restore();
        }


        this.ctx.beginPath();
        this.history.forEach(([X, Y]) => {
            this.ctx.lineTo(X, Y);
        });
        this.ctx.stroke();
    }
}