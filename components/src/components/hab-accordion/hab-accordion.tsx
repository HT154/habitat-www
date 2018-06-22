// Intended to create a series of instances of the hab-dropdown component based upon
// if the li has children.

/**
 * Import the following modules:
 *
 * 1. Component - Provide/declare component metadata
 * 2. Event - Manage component events
 * 3. EventEmitter - Allow events to be broadcast within the component
 * 4. Prop - Allows public properties to be used inside the component logic
 * 5. State - Manage component state (I.e.respond to changes)
 *
 */
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Prop,
  State
} from '@stencil/core';

/**
 *
 * Define the component metadata:
 * 1. Name of the HTML tag to be rendered
 * 2. The external style rules to be applied for the component
 */
@Component({
  tag: 'hab-accordion',
  styleUrl: 'hab-accordion.scss'
})
export class habAccordion {

  @Element() element: HTMLElement;
  @Prop() name: string;
  @State() toggle: boolean = false;
  @Event() onToggle: EventEmitter;

  public dropdownParents: Array <Element> = [];
  public items: Array < any > = [{}];

  componentWillLoad() {
    console.log('will load');

    this.items = Array.from(this.element.children).map((child) => {
      return {
        dropdown: child.children.length > 1 && !!Array.from(child.children).find((grandchild) => grandchild.tagName === 'UL'),
        item: child
      }
    })

    console.log(this.items);
  }

  toggleComponent(): void {
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
    return <h2>thing</h2>;
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
}