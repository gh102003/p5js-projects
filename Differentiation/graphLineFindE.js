class GraphLineFindE extends GraphLine {

    constructor() {
        super((x, {a}) => pow(a, x));

        this.params = {a: 2};

        this.div = createDiv();
        this.div.addClass("line-options options");
        this.div.parent(select("#controls"));
        this.div.hide();

        let instructions = createP(`<i>${katex.renderToString(`e`)}</i> is the value where all derivatives of ${katex.renderToString(`e^{x}`)} are equal`);
        instructions.parent(this.div);
        
        this.slider = createSlider(0.1, 5, 2, 0.1);
        this.slider.parent(this.div);
        this.slider.input(() => {
            let value = this.slider.value();
            this.params.a = value;
            this.derivative = new Derivative(this);
            
            // Update label
            katex.render(String.raw `a = ${value}`, this.label.elt);
        });

        this.label = createSpan();
        katex.render(String.raw `a = 2`, this.label.elt);
        this.label.parent(this.div);
    }

    draw() {
        super.draw();
    }
}