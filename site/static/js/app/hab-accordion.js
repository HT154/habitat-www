/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

// Intended to create a series of instances of the hab-dropdown component based upon
// if the li has children.
/**
 *
 * Define the component metadata:
 * 1. Name of the HTML tag to be rendered
 * 2. The external style rules to be applied for the component
 */
class habAccordion {
    constructor() {
        this.toggle = false;
        this.dropdownParents = [];
        this.items = [{}];
    }
    componentWillLoad() {
        console.log('will load');
        this.items = Array.from(this.element.children).map((child) => {
            return {
                dropdown: child.children.length > 1 && !!Array.from(child.children).find((grandchild) => grandchild.tagName === 'UL'),
                item: child
            };
        });
        console.log(this.items);
    }
    toggleComponent() {
        this.toggle = !this.toggle;
        // When the user click emit the toggle state value
        // A event can emit any type of value
        this.onToggle.emit({
            visible: this.toggle
        });
    }
    /**
     * Create HTML representation of component DOM and return this
       for output to the browser DOM
     */
    render() {
        return h("h2", null, "thing");
        // return this.element;
        // return (
        //   <ul>
        //     {this.items.map(item => {
        //       if (item.dropdown) {
        //         return <hab-dropdown item={item.item}></hab-dropdown>
        //       } else {
        //         console.log('normal: ', item.item);
        //         return item.item.outerHTML;
        //       }
        //     })}
        //   </ul>
        // )
    }
    static get is() { return "hab-accordion"; }
    static get properties() { return { "element": { "elementRef": true }, "name": { "type": String, "attr": "name" }, "toggle": { "state": true } }; }
    static get events() { return [{ "name": "onToggle", "method": "onToggle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "hab-accordion h2 {\n  cursor: pointer;\n  position: relative;\n  padding: 0 0.35em;\n  font-size: 1.35em;\n  font-family: Verdana;\n}\n\nhab-accordion h2 span {\n  position: absolute;\n  right: 1em;\n  top: 0.75em;\n  font-size: 0.5em;\n}\n\nhab-accordion ul, hab-accordion hab-accordion {\n  list-style: none;\n  padding: 0;\n}\n\nhab-accordion ul li, hab-accordion hab-accordion li {\n  background: #e6e6e6;\n  border-bottom: 1px solid #c8c8c8;\n  padding: 0.5em 1em;\n}\n\nhab-accordion ul li h3, hab-accordion hab-accordion li h3 {\n  -webkit-margin-before: 0.3em;\n  -webkit-margin-after: 0.3em;\n  line-height: 1.2em;\n  font-family: Verdana;\n  font-size: 1rem;\n}\n\nhab-accordion ul li p, hab-accordion hab-accordion li p {\n  line-height: 1.2em;\n  margin: 0 0 1em 0;\n  font-family: Verdana;\n  font-size: 1rem;\n}\n\nhab-accordion .active {\n  display: block;\n}\n\nhab-accordion .inactive {\n  display: none;\n}"; }
}

export { habAccordion as HabAccordion };
