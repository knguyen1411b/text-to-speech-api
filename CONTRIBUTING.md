# Contributing to Text-to-Speech API

First off, thank you for considering contributing to this project!

## Development Setup

To set up a local development environment:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/text-to-speech-api.git
   cd text-to-speech-api
   ```

2. **Install dependencies**:
   This project uses `pnpm`. If you don't have it installed, run `npm install -g pnpm`.
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your custom secret key:
   ```bash
   cp .env.example .env
   ```

4. **Run the local development server**:
   ```bash
   pnpm dev
   ```
   The API will be available at `http://localhost:3000`.

## Testing

Always run and add tests for any new features or bug fixes.

* **Run all tests**:
  ```bash
  pnpm test
  ```
* **Run tests with coverage**:
  ```bash
  pnpm test:cov
  ```

## Development Guidelines

- **TypeScript**: Write all code in TypeScript. Ensure compiler rules are satisfied (run `pnpm build` to verify compilation).
- **Code Style**: Keep code simple, clean, and self-documenting. Use descriptive variable and function names.
- **Testing**: Ensure unit tests cover new logic in `src/utils` or `src/middlewares` and integration tests cover new API routes.

## Pull Request Process

1. Create a new branch off `main` for your feature or bug fix: `git checkout -b feature/your-feature-name`.
2. Commit your changes with clear, descriptive commit messages.
3. Push to your branch and open a Pull Request targeting `main`.
4. Ensure the GitHub Actions CI workflow builds and passes tests successfully.
