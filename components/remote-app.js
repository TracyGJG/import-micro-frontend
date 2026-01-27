const WebComponentStylesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  .error {
  border: 2px solid #f00;
  background-color: #f003;
  text-align: center;
  inset: 0;
  position: absolute;
}
  `);
  return StyleSheet;
};

const WebComponentTemplate = (srcUrl) => {
  const template = document.createElement('template');
  template.innerHTML = `<iframe src="${srcUrl}" frameborder="0"></iframe>`;
  return template.content.cloneNode(true);
};

const WebComponentErrorTemplate = (error) => {
  const template = document.createElement('template');
  template.innerHTML = `<div class="error">Error: ${error}</div>`;
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
    this.shadowRoot.adoptedStyleSheets = [WebComponentStylesheet()];
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
    fetch(this.srcUrl)
      .then((data) => {
        if (data.ok) {
          this.shadowRoot.appendChild(WebComponentTemplate(this.srcUrl));
          this.iframe = this.shadowRoot.querySelector('iframe');
        } else {
          this.shadowRoot.appendChild(
            WebComponentErrorTemplate(
              `Problem loading remote application from "${this.srcUrl}".`,
            ),
          );
        }
      })
      .catch((err) => {
        this.shadowRoot.appendChild(
          WebComponentErrorTemplate(
            `Unable to load remote application from "${this.srcUrl}".`,
          ),
        );
      });
  }

  disconnectedCallback() {
    this.iframe = null;
  }
}

customElements.define('remote-app', WebComponent);
