const WebComponentSytlesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  `);
  return StyleSheet;
};

const WebComponentTemplate = (srcUrl) => {
  const template = document.createElement('template');
  template.innerHTML = `<iframe src="${srcUrl}" frameborder="0"></iframe>`;
  return template.content.cloneNode(true);
};

globalThis.addEventListener('message', ({ data }) => {
  const evt = new CustomEvent('messageToHost', {
    detail: data,
  });
  globalThis.dispatchEvent(evt);
});

class WebComponent extends HTMLElement {
  static ObservedAttributes = ['url'];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentSytlesheet()];
    this.iframe = null;

    this.addEventListener('messageFromHost', (evt) => {
      this.iframe.contentWindow.postMessage(evt.detail, '*');
    });
  }

  get srcUrl() {
    return this.getAttribute('url');
  }

  set srcUrl(value) {
    this.setAttribute('url', value);
  }

  static get observedAttributes() {
    return this.ObservedAttributes;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(WebComponentTemplate(this.srcUrl));
    this.iframe = this.shadowRoot.querySelector('iframe');
  }

  disconnectedCallback() {
    this.iframe = null;
  }
}

customElements.define('remote-app', WebComponent);
