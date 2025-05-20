<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import { fn } from '@storybook/test';
	import { within } from '@testing-library/svelte';


  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Example/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      backgroundColor: { control: 'color' },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
      },
    },
    args: {
      onClick: fn(),
    },
    
    // For QA, perhaps you can use the `play` as away to conduct unit tests. Just don't import and use texts.
    // You can disable this by checking out svelte.config.ts and place `.storybook` in exclude, and remove it from the `include`
    play: async({ canvasElement }) =>{
      const canvas = within(canvasElement);
      const button = await canvas.findByRole('button');
    }
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Primary" args={{ primary: true, label: 'Button' }} />

<Story name="Secondary" args={{ label: 'Button' }} />

<Story name="Large" args={{ size: 'large', label: 'Button' }} />

<Story name="Small" args={{ size: 'small', label: 'Button' }} />
