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
        this.data.text = this.$input.value;
        this.completed = true;
        this.viewer.clear();
    }

    redraw(){
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);

        if(this.completed){
            const {text, x, y} = this.data;
            this.ctx.fillText(text, x, y);
        }
    }
}