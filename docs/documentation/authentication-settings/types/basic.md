# Basic

The `Basic` authentication type performs a [Basic](https://en.wikipedia.org/wiki/Basic\_access\_authentication) authentication by adding a Base64 encoded `Authorization` header in the format of `Basic <Base64 credentials>`, it requires the following parameters;

| Name       | Description            |
| ---------- | ---------------------- |
| `Username` | The username to encode |
| `Password` | The password to encode |
