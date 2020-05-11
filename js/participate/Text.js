class Text extends Clip {
    constructor(){
        super(...arguments);

        this.data = {x: 0, y: 0, text: ""};
        this.completed = false;
        this.$input = document.createElement("input");
        this.$input.style.font = this.ctx.font;
        this.$input.style.color = this.ctx.fillStyle;
        this.$input.classList.value = "position-absolute bg-none border-none";

        this.$input.addEventListener("blur", () => this.complete());
        this.$input.addEventListener("input", () => {
            if(this.$input.scrollWidth > this.$input.offsetWidth){
                this.$input.style.width = this.$input.scrollWidth + "px";
            }
        });
    }

    selectDown(x, y){
        this.temp = [x, y];

        let mstxt = this.ctx.measureText(this.data.text);
        let width = mstxt.width;
        let height = parseInt(this.ctx.font);

        return this.data.x <= x && x <= this.data.x + width
            && this.data.y - height <= y && y <= this.data.y;
    }

    selectMove(x, y){
        const [downX, downY] = this.temp;

        let toX = ( x - downX);
        let toY = ( y - downY);

        this.$canvas.style.left = toX + "px";
        this.$canvas.style.top = toY + "px";
    }

    mouseDown(e){
        const [X, Y] = this.getXY(e);
        this.app.$videoArea.append(this.$input);
        this.$input.style.left = X + "px";
        this.$input.style.top = Y + "px";
        this.data.x = X;
        this.data.y = Y + this.$input.offsetHeight;
    }

    mouseUp(){
        if(!this.completed) {
            this.$input.focus();
        }
    }

    complete(){
        this.$input.remove();
        if(this.$input.value.trim() == ""){
            this.active = true;
            this.track.pickdel();
        }
        else {
            this.data.text = this.$input.value;
            this.completed = true;
            this.viewer.clear();
        }
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

        if(this.active){
            let mstxt = this.ctx.measureText(this.data.text);
            let width = mstxt.width;
            let height = parseInt(this.ctx.font);

            this.ctx.save();
            this.ctx.strokeStyle = "#C92039";
            this.ctx.strokeRect(this.data.x, this.data.y - height, width, height);
            this.ctx.restore();
        }

        if(this.completed){
            const {text, x, y} = this.data;
            this.ctx.fillText(text, x, y);
        }
    }
}