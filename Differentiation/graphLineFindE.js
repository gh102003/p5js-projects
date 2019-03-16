class GraphLineFindE extends GraphLine {

    constructor() {
        super((x, {a}) => pow(a, x));

        this.params = {a: 2};

        this.div = createDiv();
        this.div.addClass("line-options options");
        this.div.parent(select("#page"));
        this.div.hide();

        let instructions = createP("<i>e</i> is the value where all derivatives of e^x are equal");
        instructions.parent(this.div);
        
        
        this.slider = createSlider(0.1, 5, 2, 0.1);
        this.slider.parent(this.div);
        this.slider.input(() => {
            let value = this.slider.value();
            this.params.a = value;
            this.label.html("a = " + value);
            this.derivative = new Derivative(this);
        });

        this.label = createSpan("a = 2");
        this.label.parent(this.div);
    }

    draw() {
        super.draw();
    }
}