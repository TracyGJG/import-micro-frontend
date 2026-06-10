const WebComponentStylesheet = () => {
  const StyleSheet = new CSSStyleSheet();
  StyleSheet.replaceSync(/*css*/ `
    div {
      margin: 1em;
      display: grid;
      grid-template-columns: 2fr 2fr 1fr;
      gap: 1em;
    }
  `);
  return StyleSheet;
};

const WebComponentTemplate = (title, btn1, btn2) => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <section>
      <h2>MFE Component: ${title}</h2>
      <div>
        <button data-action="${btn1}">Inc ${btn1}</button>
        ${btn1}: <span data-count="${btn1}"></span>
      </div>
      <div>
        <button data-action="${btn2}">Inc ${btn2}</button>
        ${btn2}: <span data-count="${btn2}"></span>
      </div>
      <div>
        <button data-action="Reset">Reset all</button>
      </div>
    </section>
  `;
  const newInstance = template.content.cloneNode(true);
  newInstance
    .querySelectorAll('[data-action]')
    .forEach((element) =>
      element.addEventListener('click', () => incCount(element.dataset.action)),
    );
  return newInstance;

  function incCount(topic) {
    const evt = new CustomEvent('messageToHost', {
      detail: { topic, payload: 'From component (incCount)' },
    });
    globalThis.dispatchEvent(evt);
  }
};

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
