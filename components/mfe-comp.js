import { WebComponentStylesheet, WebComponentTemplate } from './dyn-comp.js';

class WebComponent extends HTMLElement {
  static ObservedAttributes = ['title', 'btn1', 'btn2'];

  constructor() {
    super();
    this.counts = null;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentStylesheet()];

    this.addEventListener('messageFromHost', (evt) => {
      const { topic, payload } = evt.detail;
      if (this.counts) {
        const count = this.counts.find(
          (element) => element.dataset.count === topic,
        );
        count.textContent = payload;
      }
    });
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(title) {
    this.setAttribute('title', value);
  }

  get btn1() {
    return this.getAttribute('btn1');
  }

  set btn1(btn1) {
    this.setAttribute('btn1', value);
  }

  get btn2() {
    return this.getAttribute('btn2');
  }

  set btn2(btn2) {
    this.setAttribute('btn2', value);
  }

  connectedCallback() {
    this.shadowRoot.appendChild(
      WebComponentTemplate(this.title, this.btn1, this.btn2),
    );
    this.counts = [...this.shadowRoot.querySelectorAll('[data-count]')];
  }

  disconnectedCallback() {
    this.counts = null;
  }
}

customElements.define('mfe-comp', WebComponent);
