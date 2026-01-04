# Esonge Shopping Mall Frontend - Documentation

Welcome to the Esonge Shopping Mall frontend project documentation. This repository contains comprehensive planning and implementation documentation for building a modern, accessible, and performant e-commerce platform.

## Project Overview

**Esonge** (강원송이총판 동성유통) is a specialized e-commerce platform for premium Korean matsutake mushrooms, natural ginseng, and related agricultural products. The platform serves both retail customers and wholesale buyers.

**Website**: https://esonge.co.kr/

## Documentation Structure

This documentation is organized into six main documents:

### 1. [Project Requirements Specification](./01-project-requirements.md)
**Purpose**: Define what needs to be built

**Contents**:
- Project overview and business objectives
- Target audience and use cases
- Core functional requirements by domain (7+ domains)
- Non-functional requirements (performance, security, accessibility)
- Success criteria and metrics
- Constraints and assumptions

**Key Sections**:
- User Management (authentication, profile, membership)
- Product Catalog (browsing, search, filtering)
- Shopping Cart & Checkout
- Order Management (tracking, returns, exchanges)
- Customer Service (Q&A, reviews, notices)
- Membership Benefits (mileage, deposit, wishlist)

### 2. [Feature Breakdown by Domain](./02-feature-breakdown.md)
**Purpose**: Detail all features organized by business domain

**Contents**:
- 8 primary domains with complete feature lists
- Component structure for each domain
- Hook patterns and state management per domain
- Cross-domain features (navigation, layout)
- Feature priority matrix
- Integration points and dependencies

**Key Domains**:
- `domains/user/` - Authentication, profile, membership
- `domains/product/` - Catalog, search, details
- `domains/cart/` - Shopping cart management
- `domains/order/` - Checkout, orders, tracking
- `domains/payment/` - Payment processing
- `domains/review/` - Product reviews and ratings
- `domains/customer-service/` - Q&A, notices, support

### 3. [Component Architecture](./03-component-architecture.md)
**Purpose**: Define technical architecture and component patterns

**Contents**:
- Project folder structure (domain-based organization)
- Component categories (UI, layout, domain components)
- State management architecture (TanStack Query, Zustand, Context)
- Routing structure with React Router
- Component composition patterns
- Performance optimization strategies
- Accessibility patterns
- Testing architecture

**Highlights**:
- Domain-based organization following CLAUDE.md cohesion principles
- Component composition over props drilling
- Scoped state management (no overly broad stores)
- Form-level vs field-level validation cohesion
- Comprehensive examples aligned with CLAUDE.md

### 4. [Technical Stack Recommendations](./04-technical-stack.md)
**Purpose**: Specify technologies, libraries, and tools

**Contents**:
- Core technologies (React 18, TypeScript 5, Vite 5)
- Routing (React Router 6)
- State management (TanStack Query, Zustand, Context)
- Form handling (React Hook Form + Zod)
- Styling (CSS Modules, optional Tailwind)
- UI components (shadcn/ui)
- Testing (Vitest, React Testing Library, Playwright)
- Code quality (ESLint, Prettier)
- Additional libraries (date-fns, Framer Motion, Lucide icons)

**Package Manager**: pnpm

### 5. [Development Timeline](./05-development-timeline.md)
**Purpose**: Provide detailed project schedule and milestones

**Contents**:
- 8 development phases over 6-8 months
- Week-by-week task breakdown
- Sprint goals and deliverables
- Dependencies and sequencing
- Success metrics per phase
- Risk management strategies
- Post-launch roadmap

**Phases**:
1. Foundation & Core Infrastructure (2-3 weeks)
2. Authentication & User Management (3-4 weeks)
3. Product Catalog & Search (4-5 weeks)
4. Shopping Cart & Checkout (4-5 weeks)
5. Order Management & Tracking (3-4 weeks)
6. Customer Service & Reviews (3-4 weeks)
7. Testing, Optimization & Polish (3-4 weeks)
8. Deployment & Launch (2 weeks)

### 6. [Implementation Guidelines](./06-implementation-guidelines.md)
**Purpose**: Establish coding standards and best practices

**Contents**:
- Coding standards (TypeScript, naming conventions)
- Component development patterns (CLAUDE.md aligned)
- State management best practices
- Form validation strategies
- API integration patterns
- Testing strategies (unit, integration, E2E)
- Performance optimization techniques
- Accessibility guidelines (WCAG 2.1 AA)
- Error handling patterns
- Security best practices

**Key Principles** (from CLAUDE.md):
- **Readability**: Named constants, abstracted logic, separated conditional paths
- **Predictability**: Consistent return types, single responsibility
- **Cohesion**: Domain-based organization, related code together
- **Coupling**: Minimal dependencies, component composition

## Quick Start Guide

### For Project Managers
1. Start with [Project Requirements](./01-project-requirements.md) to understand scope
2. Review [Development Timeline](./05-development-timeline.md) for planning
3. Check [Feature Breakdown](./02-feature-breakdown.md) for deliverables

### For Developers
1. Read [Implementation Guidelines](./06-implementation-guidelines.md) for coding standards
2. Study [Component Architecture](./03-component-architecture.md) for patterns
3. Reference [Technical Stack](./04-technical-stack.md) for technology choices
4. Follow [Development Timeline](./05-development-timeline.md) for task sequencing

### For UI/UX Designers
1. Review [Feature Breakdown](./02-feature-breakdown.md) for all UI components needed
2. Check [Project Requirements](./01-project-requirements.md) for user flows
3. Consult [Component Architecture](./03-component-architecture.md) for component hierarchy

### For QA Engineers
1. Use [Project Requirements](./01-project-requirements.md) for test scenarios
2. Follow [Testing Strategies](./06-implementation-guidelines.md#testing-strategies) section
3. Reference [Development Timeline](./05-development-timeline.md) for testing phases

## Key Features

### Core E-Commerce Features
- **Product Catalog**: 8 categories with advanced search and filtering
- **Shopping Cart**: Persistent cart with stock validation
- **Checkout**: Multi-step checkout with multiple payment methods
- **Order Management**: Order tracking, returns, and exchanges
- **User Accounts**: Authentication, profiles, addresses, membership tiers
- **Reviews & Ratings**: Product reviews with photo uploads
- **Customer Support**: Q&A system, notices, FAQ, contact forms
- **Membership Benefits**: Mileage system, deposit system, wishlist

### Technical Highlights
- **Modern Stack**: React 18, TypeScript 5, Vite 5
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Code splitting, lazy loading, optimized images
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: 70%+ test coverage with unit, integration, and E2E tests
- **SEO**: Server-side rendering ready, structured data, meta tags
- **Mobile-First**: Responsive design from 320px to 4K displays

## Architecture Principles

### Domain-Driven Organization

```
src/
├── domains/              # Business domains
│   ├── user/            # User management
│   ├── product/         # Product catalog
│   ├── cart/            # Shopping cart
│   ├── order/           # Order processing
│   ├── payment/         # Payment handling
│   ├── review/          # Reviews
│   └── customer-service/ # Support
├── components/          # Shared components
├── hooks/              # Shared hooks
├── utils/              # Utilities
└── services/           # API services
```

### CLAUDE.md Design Principles

All code follows these four core principles:

1. **Readability**
   - Named constants for magic numbers
   - Abstracted complex logic into dedicated components
   - Separated conditional rendering paths
   - Simplified complex ternary operators

2. **Predictability**
   - Standardized return types for similar functions
   - Single responsibility for all functions
   - Unique and descriptive names

3. **Cohesion**
   - Features organized by domain, not by type
   - Related code kept together
   - Form-level or field-level validation based on requirements

4. **Coupling**
   - Minimal dependencies between modules
   - Component composition over props drilling
   - Scoped state management (no overly broad stores)

## Technology Stack Summary

### Core
- **React 18.3** - UI framework
- **TypeScript 5.3** - Type safety
- **Vite 5** - Build tool

### State Management
- **TanStack Query v5** - Server state
- **Zustand 4** - Client state
- **React Context** - Auth & theme

### Forms & Validation
- **React Hook Form 7** - Form management
- **Zod 3** - Schema validation

### Testing
- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **Playwright** - E2E tests

### Additional
- **React Router 6** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Development Workflow

### 1. Setup Phase (Week 1)
```bash
# Initialize project
pnpm create vite esonge-frontend --template react-ts
cd esonge-frontend
pnpm install

# Install dependencies
pnpm add react-router-dom @tanstack/react-query zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add axios date-fns lucide-react framer-motion

# Install dev dependencies
pnpm add -D vitest @testing-library/react @playwright/test
pnpm add -D eslint prettier husky lint-staged
```

### 2. Development Phases (Week 2-29)
Follow the [Development Timeline](./05-development-timeline.md) for detailed task breakdown.

### 3. Testing & QA (Week 26-29)
- Unit tests for all components and hooks
- Integration tests for critical flows
- E2E tests with Playwright
- Performance optimization
- Accessibility audit

### 4. Deployment (Week 30-31)
- Staging deployment
- Production deployment
- Monitoring setup
- Launch and post-launch support

## Success Metrics

### Technical Metrics
- **Performance**: Lighthouse score > 90
- **Accessibility**: WCAG 2.1 AA compliant (Lighthouse > 95)
- **SEO**: Lighthouse SEO score > 95
- **Test Coverage**: > 70% for critical paths
- **Error Rate**: < 0.5% of all requests

### Business Metrics
- **Conversion Rate**: 2-3% (new), 5-8% (returning)
- **Cart Abandonment**: < 70%
- **Customer Satisfaction**: 4.5+ stars average
- **Uptime**: 99.5% availability

## Next Steps

### For New Team Members
1. Read this README thoroughly
2. Review CLAUDE.md in the project root
3. Study [Implementation Guidelines](./06-implementation-guidelines.md)
4. Set up development environment
5. Review first sprint tasks in [Development Timeline](./05-development-timeline.md)

### For Starting Development
1. Complete Phase 1 setup tasks (Week 1-3)
2. Establish coding standards compliance
3. Set up CI/CD pipeline
4. Begin Phase 2 implementation

### For Stakeholders
1. Review [Project Requirements](./01-project-requirements.md)
2. Approve timeline in [Development Timeline](./05-development-timeline.md)
3. Provide feedback on feature priorities
4. Schedule regular review meetings

## Additional Resources

### External Documentation
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

### Internal Resources
- CLAUDE.md (project root) - Frontend design guidelines
- .eslintrc.js - ESLint configuration
- .prettierrc - Prettier configuration
- tsconfig.json - TypeScript configuration
- vite.config.ts - Vite configuration

## Contributing

### Code Review Checklist
- [ ] Follows CLAUDE.md design principles
- [ ] TypeScript types properly defined
- [ ] Components have unit tests
- [ ] Accessibility standards met
- [ ] No console errors or warnings
- [ ] ESLint passes with no errors
- [ ] Prettier formatted
- [ ] Documentation updated

### Pull Request Template
```markdown
## Description
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## CLAUDE.md Compliance
- [ ] Readability: Code is clear and self-documenting
- [ ] Predictability: Consistent patterns used
- [ ] Cohesion: Related code grouped appropriately
- [ ] Coupling: Minimal dependencies

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (if applicable)
- [ ] All tests passing

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Support & Contact

### Development Team
- **Lead Frontend Developer**: [Name]
- **Frontend Developers**: [Names]
- **UI/UX Designer**: [Name]
- **QA Engineer**: [Name]
- **DevOps Engineer**: [Name]

### Communication Channels
- Daily standups: 10:00 AM
- Sprint planning: Every other Monday
- Sprint review: Every other Friday
- Code reviews: Via GitHub pull requests

## Version History

- **v1.0** (2026-01-04): Initial documentation created
  - Project requirements defined
  - Feature breakdown completed
  - Component architecture documented
  - Technical stack selected
  - Development timeline established
  - Implementation guidelines written

## License

[Specify license here]

---

**Last Updated**: 2026-01-04
**Documentation Version**: 1.0
**Project Status**: Planning Phase

For questions or clarifications, please contact the project lead or create an issue in the project repository.
