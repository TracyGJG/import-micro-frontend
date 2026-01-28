const WebComponentStylesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  `);
  return StyleSheet;
};

const WebComponentTemplate = (title) => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <section>
      <h2>MFE Component: ${title}</h2>
      <button action="incCount">Inc Count</button>
      <div id="count"></div>
    </section>
  `;
  const newInstance = template.content.cloneNode(true);
  newInstance.querySelector('[action]').addEventListener('click', incCount);
  return newInstance;

  function incCount() {
    const evt = new CustomEvent('messageToHost', {
      detail: 'From component (incCount)',
    });
    globalThis.dispatchEvent(evt);
  }
};

class WebComponent extends HTMLElement {
  static ObservedAttributes = ['title'];

  constructor() {
    super();
    this.count = null;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentStylesheet()];

    this.addEventListener('messageFromHost', (evt) => {
      if (this.count) {
        this.count.textContent = evt.detail;
      }
    });
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(title) {
    this.setAttribute('title', value);
  }

  connectedCallback() {
    this.shadowRoot.appendChild(WebComponentTemplate(this.title));
    this.count = this.shadowRoot.querySelector('#count');
  }

  disconnectedCallback() {
    this.count = null;
  }
}

customElements.define('mfe-comp', WebComponent);
