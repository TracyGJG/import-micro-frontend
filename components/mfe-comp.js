const WebComponentSytlesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  `);
  return StyleSheet;
};

const WebComponentTemplate = () => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <section>
      <h2>MFE Component</h2>
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
  constructor() {
    super();
    this.count = null;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentSytlesheet()];

    this.addEventListener('messageFromHost', (evt) => {
      if (this.count) {
        this.count.textContent = evt.detail;
      }
    });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(WebComponentTemplate());
    this.count = this.shadowRoot.querySelector('#count');
  }

  disconnectedCallback() {
    this.count = null;
  }
}

customElements.define('mfe-comp', WebComponent);
