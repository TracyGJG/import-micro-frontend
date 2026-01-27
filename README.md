# Import Micro-Frontend (MFE) Sampler

This project employs a combination of Web Components and dynamic ESM imports to implement a MFE architecture.

## Background

Employing a micro-frontend architecure is an increasingly popular way to manage large frontend code base. They enable distinct features to be isolated and decoupled from the primary code base. This improves the Developer Experience (DX) by:

* Providing the team with greater autonomy over the development of features and the choice of technology.
* Enabling the team to control the release cadence of new features, without impacting other teams.
* Reducing the scope of the code base to just that delivering the business function for which the team is responsible.
* Enabling the team to specialise and concentrate on the delivery of the business function end-to-end, isolating the test burden.

There are no standard technologies to support this architecture but there are a range of tools and techniques, as follows:

* __Module Federation__ is probably the most popular as it works in conjunction with JavaScript frameworks like React and Angular through tools like Webpack.
* __Meta Frameworks__ such as [Single-SPA](https://single-spa.js.org/) introduce additional tools that are agnostic of JS framework but still require configuration.
* __Standards-based__ techniques include tools such as [Zoid](https://krakenjs.com/zoid/) and [Web Fragments](https://web-fragments.dev/) augment standardised technologies such as those list in the next group.
* __Web Standards__ include [HTML iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe), [the web components API](https://www.webcomponents.org/introduction), and [ECMAScript Model (ESM) dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Pretty much all MFE techniques require a manifest of some sort to map components to be presented with the URL where they can be obtained. The manifest is usually loaded client-side at runtime and used to load and inject the MFEs into the host page.

## How this project works

We have a manifest file, in JSON format, that details the configuration of each MFE (component), where they are to be injected and where they are to be obtained.

`JSON-SERVER` is used to host 3 lots of static content on different ports. One for the host application (3001), another for the remote application (3002) and the last for the components (3003.)

The host page loads and processes the manifest by loading each component dynamically (in the browser) and injects the component, with its sepecific configuration (attributes) into the document (DOM). In the case of the `remote-app` component, the configuration includes the URL where the remote application can be found. In the case when the remote server off-line or the application fails to load for another reason, an error panel will be shown in its place. 

## Inter-MFE communication

Strictly speaking MFEs are expected to be full autonomous and should not engage in communication between themselves as this necessitates a level of coupling.

However, in this approach a simple Publish-and-Subscribe (PubSub) model is provided, at the host page level, that enables communication in a decoupled manner. The host page expects to communicate with its Web Components through [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent), one of which is responsible for loading a remote application into an iframe. The REMOTE-APP component act as a communications proxy with the remote application iframe using the [postmessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) mechanism.   


