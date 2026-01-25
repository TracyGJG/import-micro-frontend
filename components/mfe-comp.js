const WebComponentSytlesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
  `);
  return StyleSheet;
};

const WebComponentTemplate = (attrProp) => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <div>MFE Component
    </div>
  `;
  return template.content.cloneNode(true);
};

class WebComponent extends HTMLElement {
  static ObservedAttributes = ['prop'];

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [WebComponentSytlesheet()];
    this.shadowRoot.appendChild(WebComponentTemplate(this.attrProp));
  }

  // get attrProp() {
  //   return this.getAttribute("prop");
  // }

  // set attrProp(value) {
  //   this.setAttribute("prop", value);
  // }

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

  // connectedCallback() {
  //   this.#buttons[0].addEventListener("click", (evt) => {
  //     alert(`Button One, ${!!this.#internalClickEvent}`);
  //     this.#internalClickEvent && this.#internalClickEvent(evt);
  //   });
  // }

  disconnectedCallback() {}
}

customElements.define('mfe-comp', WebComponent);
