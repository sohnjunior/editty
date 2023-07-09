# 🎨 editty

**Lightweight sketch app with vanilla typescript**

Simple web app inspired by FigJam.  
With PWA, It can be installed and used offline.

Developed with typescript and native web APIs such as web component, canvas, indexedDB, cache & storage API.

After drawing, uploading and editing images, you can save and manage the results as files.

## 🏃 Getting Started

### 1️⃣ Clone repository

```bash
$ git clone https://github.com/sohnjunior/editty.git
$ cd editty
```

### 2️⃣ Install dependencies

```bash
$ yarn install
```

### 3️⃣ Run local dev server

```bash
$ yarn dev
```

## 🧪 Test

Perform component unit testing with Jest & Jest DOM.

```bash
$ yarn test
```

Use Storybook together for component-driven development in an isolated environment.

```bash
$ yarn storybook
```

Also, perform component visual testing with Chromatic.

## 🔀 CI & CD

Manage CI/CD with GitHub workflow and Vercel.  
When the milestones assigned to each version are completed, a release note is auto created with workflow and convert current commit HEAD to production mode.
