## Environment Variables Setup

To configure your environment, please follow these steps:

1. **Copy the Example File**: Duplicate the `.env.example` file and rename it to `.env`.

2. **Fill in the Necessary Fields**: Open the .env file in a text editor and fill in the required values for your environment.

## Running the App in Your Local Environment

[NVM](https://github.com/nvm-sh/nvm)

Install node v20 with nvm. Then activate v20 with nvm:

```bash
nvm use
```

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Before Development

- To ensure code consistency and quality, please configure your IDE to automatically format with **Prettier** and **ESLint** on save.

## Git

- Clear, **descriptive commit messages** are essential for a maintainable codebase. They help us understand why changes were made,
  make it easier to trace bugs, and improve collaboration.
- Separate subject and body with a blank line
- Explain the **why**, not just the what.
- To maintain a clean and linear commit history, **please use rebase instead of merge** when incorporating changes from the main branch

## Dockerize

Optionally the application can be build and run in docker container.

Uncomment [next.config.ts](next.config.ts) `output: 'standalone'`

```bash
docker-compose up --build
```
