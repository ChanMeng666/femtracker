# Contributing to FemTracker

Thank you for your interest in contributing! FemTracker is a React Native (Expo) mobile app for
smart tracking of menstrual product usage duration. This guide explains how to get involved.

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/ChanMeng666/femtracker/issues/new) with:

- The screen or flow where it happens
- Steps to reproduce the problem
- Expected vs. actual behavior (screenshots help)
- Your device/OS and whether you ran on iOS, Android, or web

### Suggesting Features

Have an idea to improve tracking, reminders, or insights? [Open a feature request](https://github.com/ChanMeng666/femtracker/issues/new) describing the problem you want to solve and your proposed solution.

### Submitting Changes

1. **Fork** the repository and **clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/femtracker.git
   cd femtracker
   ```
2. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Make your changes** and verify on a simulator/device (see Development Setup below).
5. **Commit** with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add reminder snooze option"
   ```
6. **Push** and open a Pull Request against the `master` branch.

## Development Setup

This is an [Expo](https://expo.dev/) project.

```bash
# Install dependencies
npm install

# Start the Expo dev server
npm start

# Or launch directly on a platform
npm run android
npm run ios
npm run web
```

## Quality Checks

Please make sure these pass before opening a PR:

```bash
npm run lint   # Expo lint
npm test       # Jest test suite
```

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). For questions or
support, see [SUPPORT.md](SUPPORT.md). For security issues, see [SECURITY.md](SECURITY.md).
