const WebComponentSytlesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  `);
  return StyleSheet;
};

const WebComponentTemplate = (attrProp) => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <iframe src="${attrProp}" frameborder="0"></iframe>
  `;
  return template.content.cloneNode(true);
};

class WebComponent extends HTMLElement {
  static ObservedAttributes = ['url'];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentSytlesheet()];
  }

  get attrProp() {
    return this.getAttribute('url');
  }

  set attrProp(value) {
    this.setAttribute('url', value);
  }

  // get eventProp() {
  //   return this.#internalClickEvent;
  // }

  // set eventProp(fn) {
  //   this.#internalClickEvent = fn;
  // }

  static get observedAttributes() {
    return this.ObservedAttributes;
  }

  // handleEvent(evt) {
  //   const attrValues = ["Tick", "Tack", "Toe"];
  //   if ("Toggle" === evt.target.textContent) {
  //     this.attrProp =
  //       attrValues[
  //         (1 +
  //           attrValues.findIndex((attrValue) => attrValue === this.attrProp)) %
  //           attrValues.length
  //       ];
  //   }
  // }

  // attributeChangedCallback(name, oldVal, newVal) {
  //   if (WebComponent.ObservedAttributes.includes(name)) {
  //     if (name === "prop") {
  //       this.#attr.textContent = newVal;
  //     }
  //   }
  // }

  connectedCallback() {
    this.shadowRoot.appendChild(WebComponentTemplate(this.attrProp));
  }

  disconnectedCallback() {}
}

customElements.define('remote-app', WebComponent);
