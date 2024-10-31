# React Widgets Monorepo

This is a monorepo containing multiple React widgets and a shared library. The project is managed using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) for easier dependency management and build processes across multiple packages.

## Workspace Structure

- **apps/damo_upload**: A React widget for uploading images to DAMopen.
- **apps/damo_wfa**: A React widget for managing approval process for images on DAMopen.
- **apps/shared**: A shared library containing helper functions, types, and reusable components.

## Setup

To set up the workspace and install dependencies, run the following command from the root location:

```bash
yarn install
```

## Development

Since drupal libraries track built files, to be able to run the application in develoment mode, you should build the application every time
a change is made. For this, a watcher is configured to build files accordingly. Please run the corresponding `watch` command as you need it:

Ex:

```bash
yarn build:watch:damo_upload
```

## Building the projects

To build all the workspaces at once, please run:

```bash
yarn build-all
```

## Linting

To run ESLint on all workspaces, please run:

```bash
yarn lint-all
```

## Formatting

To check if the code is properly formatted according to `prettier` across all workspaces:

```bash
yarn format:check-all
```

To automatically fix formatting issues for all workspaces:

```bash
yarn format:fix-all
```

## Vite configuration

Each react application is built using [Vite](https://vitejs.dev/). Each app has its own configuration file.

## Chakra UI
The project uses Chakra UI as a component library. Chakra UI is installed globally in the workspace and can be imported and used within any widget.


## Adding new widgets

To create a new widget using the automated script, run: 

```bash
yarn create-widget {your-new-react-widget-name}
```

This will setup a new widget with the correct configurations and dependencies. Make sure to adjust the following:

1. Add the `build-watch` command for the new widget to the root `package.json` file:

```json
"scripts": {
    "build:watch:{your-new-widget-name}": "yarn workspace apps/{your-new-widget-name} run build-watch",
},
```
2. Install widget-specific dependencies: If the widget needs additional dependencies, install them in the root `package.json` if they are
shared. Otherwise, install them within the widget's `package.json`.

3. Make sure to modify the `damo_theme.libraries.yml` file to add the paths to the built files for the new widget. 

Ex:

```yml
{your-new-widget-name}:
  css:
    theme:
      react_widgets/apps/{your-new-widget-name}/dist/assets/index.css: {}
  js:
    react_widgets/apps/{your-new-widget-name}/dist/assets/index.js: {}
```

and attach the library on the corresponding `twig` template

```twig
{{ attach_library('damo_theme/{your-new-widget-name}') }}
```

4. Remember to create an entry point for the react application to be embedded within the Drupal site.

Ex:

```tsx
// main.tsx
createRoot(document.getElementById('---ID of the widget entry point --- ')!).render(
  <StrictMode>
      <App /> 
  </StrictMode>
);
```

