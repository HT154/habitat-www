import { render } from '@stencil/core/testing';
import { App } from './hab-app';

describe('hab-app', () => {
  it('should build', () => {
    expect(new App()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [
          App
        ],
        html: '<hab-app></hab-app>'
      });
    });
  });
});
