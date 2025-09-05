<!-- Badges -->
![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)
![Nuxt](https://img.shields.io/badge/Nuxt-4-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)
![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

# Frontend - NoDesk - Pro4tech (API Fatec)

Repositório frontend da API para o 6º Semestre do curso de Banco de Dados da FATEC - São José dos Campos

<br>

## Stack

* **Nuxt 4** (Vue 3)
* **TypeScript**
* **@nuxt/ui** (UI components)
* **ESLint** (qualidade de código)

<br>

## Instalação

### 1. Instalar dependências:

   ```bash
   npm install
   ```

### 2. Instalar pre-commit hook:

   ```bash
   pre-commit install
   ```

#### 2.1 Ativação do pre-commit:

   ```bash
   pre-commit install --hook-type commit-msg --hook-type pre-commit
   ```

<br>

## Executando em desenvolvimento

```bash
npm run dev
```

* App: [http://localhost:3000](http://localhost:3000)

<br>

## Testes

* Utiliza `@nuxt/test-utils` para testes.

```bash
npm run test
```

<br>

## Qualidade de Código

#### 1. Lint:

   ```bash
   npm run lint
   ```

#### 2. Formatar:

   ```bash
   npm run format
   ```
