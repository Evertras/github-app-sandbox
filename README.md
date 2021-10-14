# sandbox-app

> A GitHub App built with [Probot](https://github.com/probot/probot)

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t sandbox-app .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> sandbox-app
```

## Contributing

If you have suggestions for how sandbox-app could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Brandon Fulljames <bfullj@gmail.com>
