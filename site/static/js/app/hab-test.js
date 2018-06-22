/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class AppProfile {
    render() {
        console.log('render triggered');
        return (h("div", null,
            h("p", null, "Hey, look at me I'm a web component! OMG!")));
    }
    static get is() { return "hab-test"; }
    static get style() { return "hab-test {\n  color: #000;\n}"; }
}

export { AppProfile as HabTest };
