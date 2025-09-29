<!-- Badges -->

![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)
![Nuxt](https://img.shields.io/badge/Nuxt-4-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)
![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

# Frontend - NoDesk - Pro4tech (API Fatec)

API frontend repository for the 6th Semester of the Database course at FATEC - São José dos Campos

<br>

## Stack

- **Nuxt 4** (Vue 3)
- **TypeScript**
- **@nuxt/ui** (UI components)
- **ESLint** (code quality)

<br>

## Installation

### 1. Install dependencies:

```bash
npm install
```

### 2. Install pre-commit hook:

```bash
pre-commit install
```

#### 2.1 Pre-commit activation:

```bash
pre-commit install --hook-type commit-msg --hook-type pre-commit
```

<br>

## Running in development

```bash
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)

<br>

## Tests

- Uses **Vitest** for unit testing.

```bash
npx vitest
```

<br>

## Code Quality

#### 1. Lint:

```bash
npm run lint
```

#### 2. Format:

```bash
npm run format
```
