import manifest from './manifest.json' with { type: 'json' };

let GlobalCounts = { alpha: 0, beta: 0, gamma: 0 };

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

window.addEventListener('messageToHost', ({ detail: { topic, payload } }) => {
  if (topic === 'Reset') {
    GlobalCounts = { alpha: 0, beta: 0, gamma: 0 };

    for (let mfe in manifest) {
      manifest[mfe].topics.forEach((_topic) => {
        const evt = new CustomEvent('messageFromHost', {
          detail: {
            topic: _topic,
            payload: GlobalCounts[_topic.toLowerCase()],
          },
        });
        manifest[mfe].mfe.dispatchEvent(evt);
      });
    }
  } else {
    GlobalCounts[topic.toLowerCase()]++;

    for (let mfe in manifest) {
      if (manifest[mfe].topics.includes(topic)) {
        const evt = new CustomEvent('messageFromHost', {
          detail: { topic, payload: GlobalCounts[topic.toLowerCase()] },
        });
        manifest[mfe].mfe.dispatchEvent(evt);
      }
    }
  }
});
