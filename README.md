# Esonge Shopping Mall Frontend

강원송이총판 동성유통 쇼핑몰 프론트엔드

## Tech Stack

- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **State Management**:
  - TanStack Query v5 (Server State)
  - Zustand 4 (Client State)
- **Routing**: React Router 6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library + Playwright
- **Code Quality**: ESLint + Prettier + Husky

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Build

```bash
# Type check
pnpm type-check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing

```bash
# Run unit tests
pnpm test

# Run unit tests with UI
pnpm test:ui

# Run E2E tests
pnpm test:e2e
```

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format
```

## Project Structure

```
esonge-frontend/
├── .github/              # GitHub Actions workflows and templates
├── .husky/               # Git hooks configuration
├── docs/                 # Project documentation
├── public/               # Static assets
├── src/
│   ├── components/       # Shared components
│   │   ├── ui/          # UI components
│   │   ├── layout/      # Layout components
│   │   ├── loading/     # Loading components
│   │   └── error/       # Error components
│   ├── domains/         # Feature domains
│   │   ├── user/        # User domain
│   │   ├── product/     # Product domain
│   │   ├── cart/        # Cart domain
│   │   ├── order/       # Order domain
│   │   ├── payment/     # Payment domain
│   │   ├── review/      # Review domain
│   │   └── customer-service/  # Customer service domain
│   ├── hooks/           # Custom hooks
│   ├── services/        # API and external services
│   │   ├── api/         # API client
│   │   ├── auth/        # Authentication
│   │   └── query/       # React Query setup
│   ├── utils/           # Utility functions
│   │   ├── format/      # Formatting utilities
│   │   └── validation/  # Validation schemas
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Constants
│   └── App.tsx          # Main application component
├── tests/               # E2E tests
└── package.json
```

## Architecture Principles

This project follows the [CLAUDE.md design guidelines](./CLAUDE.md):

- **Readability**: Clear naming, abstraction of complex logic
- **Predictability**: Consistent return types, explicit side effects
- **Cohesion**: Domain-based organization, related code together
- **Coupling**: Minimal dependencies, focused components

## Documentation

Comprehensive project documentation is available in the [docs/](./docs) directory:

- [Project Requirements](./docs/01-project-requirements.md)
- [Feature Breakdown](./docs/02-feature-breakdown.md)
- [Component Architecture](./docs/03-component-architecture.md)
- [Technical Stack](./docs/04-technical-stack.md)
- [Development Timeline](./docs/05-development-timeline.md)
- [Implementation Guidelines](./docs/06-implementation-guidelines.md)

## Environment Variables

Create `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Required environment variables:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_PAYMENT_API_KEY` - Payment gateway API key

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Pull Request Checks**: Type check, lint, test, build
- **E2E Testing**: Automated cross-browser testing
- **Code Quality**: Pre-commit hooks with lint-staged

## Contributing

1. Create a feature branch from `develop`
2. Make your changes following CLAUDE.md principles
3. Ensure all tests pass and code is linted
4. Submit a pull request using the PR template

## License

Proprietary - Dongsung Distribution
