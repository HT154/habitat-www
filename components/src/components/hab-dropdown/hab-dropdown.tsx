// Intended to hold the toggle state and trigger display of child components in an accordion.]

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
  tag: 'hab-dropdown',
  styleUrl: 'hab-dropdown.scss'
})
export class habDropdown {

  @Prop() item: any;
  @Element() element: HTMLElement;
  @Prop() name: string;
  @State() toggle: boolean = false;
  @Event() onToggle: EventEmitter;

  public childItems: Array <Element> = [];

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
    return (
      <li>DROPDOWN</li>
    )
  }
}


  // render() {
  //   return (
  //     <div>
  //       <h2 onClick={()=> this. toggleComponent()}>{this.name} {this.toggle ?
  //         <span>&#9650;</span> :
  //         <span>&#9660;</span>}</h2>
  //         <ul class={ this.toggle ? 'active' : 'inactive' }>
  //          {this.items.map(item =>
  //           <li>
  //             <h3>{item.heading}</h3>
  //             <p>{item.description}</p>
  //           </li>)}
  //         </ul>
  //     </div>
  //   )
  // }
