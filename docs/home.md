# Documentation

This folder will serve as our main way to save general topics not specific to a folder.

When documenting,

  1. If the discussion is component or route specific, write the `.md` within the same region.
  2. If the discussion concerns about GUI and front-end matters, prefer to use storybook [^1].
  3. Else, place it within the `/docs` folder.

Refer to Github's style of markdown as a basis to how you write[^2].

> [!IMPORTANT] 
> This is an example strcuture to how documentation should be done.
>```txt
>src/
>├── lib/
> │   ├── components/
> │   │   ├── Button.svelte
> │   │   ├── Button.test.ts       <-- Test file beside component
> │   │   └── Button.md            <-- Optional: component-level docs
> │   └── utils/
> │       ├── math.ts
> │       ├── math.test.ts
> │       └── math.md
> ├── routes/
> │   └── ...
> tests/
> ├── integration/
> │   ├── login.test.ts
> │   └── signup.test.ts
> docs/
> ├── index.md                    <-- Entry point (e.g. for VitePress or mdsvex)
> ├── components.md
> └── api.md
>```

## Repository Rules

 1. `main` is reserved for any complete SPRINT code, refrain from pushing unless absolutely necessary, changing docs, or if `dev` is complete finishing.
 2. `dev` is reserved for any ongoing SPRINT code, create a new branch to develop a new feature. 
 3. `production` is reserved for any released hosted code on vercel or any platform we're hosting. Ideally, it should rebase come directly from `main`.

## Table of Contents

 1. [Testing](./testing.md)

---
[^1]: [Storybook](https://storybook.js.org/docs/get-started/frameworks/sveltekit)
[^2]: [Github Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
