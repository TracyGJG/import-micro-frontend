import manifest from './manifest.json' with { type: 'json' };

let GlobalCount = 0;

for (let mfe in manifest) {
  ((target, manifest) => {
    const { type, url, attribs } = manifest[target];
    const domTarget = document.querySelector(`[data-mfe-target="${target}"]`);
    if (!domTarget) throw Error('MFE DOM target not found.');
    let mfeComp = import(url)
      .then(() => {
        mfeComp = document.createElement(type);
        manifest[target].mfe = mfeComp;

        for (let attr in attribs) {
          const mfeAttr = document.createAttribute(attr);
          mfeAttr.value = attribs[attr];
          mfeComp.attributes.setNamedItem(mfeAttr);
        }
      })
      .catch((err) => {
        mfeComp = document.createElement('DIV');
        mfeComp.className = 'error';
        mfeComp.textContent = `${target} cannot be loaded.`;
      })
      .finally(() => {
        domTarget.appendChild(mfeComp);
      });
  })(mfe, manifest);
}

window.addEventListener('messageToHost', (evt) => {
  GlobalCount++;

  for (let mfe in manifest) {
    const evt = new CustomEvent('messageFromHost', {
      detail: GlobalCount,
    });
    manifest[mfe].mfe.dispatchEvent(evt);
  }
});
