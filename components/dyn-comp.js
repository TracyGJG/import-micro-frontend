export const WebComponentStylesheet = () => {
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

export const WebComponentTemplate = (title, btn1, btn2) => {
  const template = document.createElement('template');
  template.innerHTML = /*html*/ `
    <section>
      <h2>${title}</h2>
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
      detail: { topic },
    });
    globalThis.dispatchEvent(evt);
  }
};
