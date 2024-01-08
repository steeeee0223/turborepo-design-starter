import type { PlopTypes } from '@turbo/gen';

const PATH = {
  ui: './packages/ui/src/components',
  story: './apps/storybook/src/stories',
};

function isEmptyString(value?: string | null): boolean {
  return !value || value.trim() === '';
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // create a generator
  plop.setGenerator('next-app', {
    description: 'Creates a Nextjs app',
    // gather information from the user
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the app?',
        validate: value => {
          if (!value) {
            return `App name is required`;
          }
          // cannot have spaces
          if (value.includes(' ')) {
            return `App name cannot have spaces`;
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'port',
        message: 'Which port are you using?',
        validate: (value: string) => {
          if (isEmptyString(value)) return `Port number is required`;
          return true;
        },
      },
    ],
    // perform actions based on the prompts
    actions: [
      {
        type: 'addMany',
        templateFiles: `templates/nextjs/`,
        destination: `./apps/{{name}}`,
        base: `templates/nextjs`,
        abortOnFail: true,
      },
    ],
  });
  plop.setGenerator('component', {
    description: 'UI Component',
    prompts: [
      {
        type: 'input',
        name: 'dest',
        message: '📁 Destination:',
        default: 'ui',
        validate: value =>
          isEmptyString(value) ? `Destination is required` : true,
      },
      {
        type: 'input',
        name: 'name',
        message: '🧩 Component Name:',
        default: 'button',
        validate: value =>
          isEmptyString(value) ? `Component name is required` : true,
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: `${PATH.ui}/{{dashCase dest}}/{{dashCase name}}`,
        templateFiles: 'templates/component/',
        base: 'templates/component',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${PATH.story}/{{dashCase dest}}/{{dashCase name}}.stories.tsx`,
        templateFile: 'templates/stories/index.stories.tsx.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${PATH.ui}/{{dashCase dest}}/index.ts`,
        skipIfExists: true,
      },
      // {
      //   type: 'append',
      //   path: `${PATH.ui}/index.ts`,
      //   template: 'export * from "./{{dashCase dest}}";',
      // },
      {
        type: 'append',
        path: `${PATH.ui}/{{dashCase dest}}/index.ts`,
        template: 'export * from "./{{dashCase name}}";',
      },
    ],
  });
}
