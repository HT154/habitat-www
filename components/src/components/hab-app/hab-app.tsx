import { Component } from '@stencil/core';


@Component({
  tag: 'hab-app',
  styleUrl: 'hab-app.scss'
})
export class App {

  render() {
    return (
      <div>
        <header>
          <h1>Stencil Components</h1>
        </header>
        <hab-test></hab-test>
      </div>
    );
  }
}
