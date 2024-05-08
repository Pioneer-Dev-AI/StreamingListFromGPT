# Welcome to Streaming List from GPT App

This application allows users to generate and edit a list of facts based on a user-provided topic, leveraging OpenAI's language model and streaming the response back to the client.

📖 For more information on the underlying technologies, see the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite).

## Setup

Before development or deployment, make sure to set up your environment variables:

1. Copy the `.env.example` file to `.env`:
   ```shell
   cp .env.example .env
   ```
2. Obtain an API key from OpenAI and paste it into the `.env` file. For more details on getting an API key, visit the [OpenAI documentation](https://beta.openai.com/docs/).
## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.
