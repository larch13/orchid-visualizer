# Contributing to Orchid

Thank you for your interest in contributing to Orchid! We welcome contributions from the community and are pleased to have you join us. This document outlines the process for contributing to our project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (we expect all contributors to be respectful, inclusive, and professional in all interactions).

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/orchid.git
   cd orchid
   ```
3. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```
4. Set up your development environment:
   ```bash
   npm install
   
   ```
5. Make your changes and ensure they follow our coding standards:
   ```bash
   npm run format:write  # Format code
   npm run lint:fix      # Fix linting issues
   npm run typecheck     # Check TypeScript
   ```

## Development Process

1. Write your code following our coding standards
2. Add or update tests as needed
3. Update documentation if required
4. Run the full test suite to ensure nothing was broken

## Commit Guidelines

We follow conventional commits for our commit messages. Each commit message should be structured as follows:

```
type(scope): description

[optional body]

[optional footer]
```

Types include:
- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc)
- refactor: Code changes that neither fix bugs nor add features
- test: Adding or modifying tests
- chore: Changes to build process or auxiliary tools

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with details of any changes to interfaces
3. Ensure all tests pass and code meets our quality standards
4. Push to your fork and submit a pull request to our main branch
5. The PR title should follow the same conventional commit format

Example PR title:
```
feat(auth): add OAuth2 authentication support
```

## Pull Request Review

1. At least one maintainer will review your PR
2. We may suggest changes or improvements
3. Once approved, your PR will be merged

## Development Setup Tips

1. Use Cursor or VSCode with our recommended extensions (listed in .vscode/extensions.json)
2. Enable "Format on Save" in your editor for consistent code formatting
3. Install the ESLint and Prettier extensions

## Documentation

- Update README.md if adding new features or changing setup requirements

## Questions or Problems?

We welcome discussions, questions, and contributions in our **Discord server**!  
Join us here: [![Discord](https://img.shields.io/discord/1344898163898585138?logo=discord&color=5865F2)](https://discord.gg/m23GeqeS8D)

🔹 **Contribution Discussion Channel:** `#orchid-lab`  
🔹 Feel free to ask questions or collaborate with other contributors!

## License

By contributing to the Orchid Visualizer, you agree that your contributions will be licensed under the same terms as the project (MIT License).

Thank you for contributing to the Orchid Visualizer! 🌟 