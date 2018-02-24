import { Component } from '@stencil/core';

@Component({
  tag: 'hab-test',
  styleUrl: 'hab-test.scss'
})
export class AppProfile {

  render() {
    return (
      <div>
        <p>Hey, look at me I'm a web component! Yay!</p>
      </div>
    );
  }
}
