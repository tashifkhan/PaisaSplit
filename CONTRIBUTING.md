# Contributing to PaisaSplit

Thank you for your interest in contributing to PaisaSplit! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm/yarn
- Python 3.11+
- MongoDB (local or cloud)
- Git
- Expo CLI (`npm install -g @expo/cli`)

### Development Setup

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/PaisaSplit.git
   cd PaisaSplit
   ```

2. **Set up the frontend**

   ```bash
   cd app
   npm install
   npm run dev
   ```

3. **Set up the backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Configure your .env file
   python run.py
   ```

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Operating system and version
   - App version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Clearly describe**:
   - The problem you're trying to solve
   - Your proposed solution
   - Any alternatives considered
   - Mockups or examples (if applicable)

### Code Contributions

#### Types of Contributions We Welcome

- **Bug fixes**
- **New features** (please discuss in issues first)
- **Performance improvements**
- **Documentation updates**
- **Test improvements**
- **UI/UX enhancements**

#### Development Workflow

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**

   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   # Frontend
   cd app
   npm test
   npm run lint

   # Backend
   cd backend
   pytest
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add expense category filtering"
   # Use conventional commit format
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Then create a Pull Request on GitHub
   ```

## Coding Standards

### Frontend (React Native/TypeScript)

```typescript
// Use TypeScript interfaces for props
interface Props {
	amount: number;
	currency: string;
	onPress: () => void;
}

// Use functional components with hooks
export default function ExpenseCard({ amount, currency, onPress }: Props) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<TouchableOpacity onPress={onPress}>{/* Component JSX */}</TouchableOpacity>
	);
}
```

#### Guidelines:

- Use TypeScript for all new code
- Follow React Native best practices
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use custom hooks for reusable logic

### Backend (Python/FastAPI)

```python
from typing import List, Optional
from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    currency: str
    participants: List[str]

@router.post("/expenses", response_model=Expense)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_user)
) -> Expense:
    """Create a new expense."""
    return await expense_service.create_expense(expense_data, current_user.id)
```

#### Guidelines:

- Follow PEP 8 style guide
- Use type hints for all function signatures
- Write descriptive docstrings
- Use Pydantic models for request/response validation
- Keep business logic in service layers
- Use async/await for database operations

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(auth): add social login support
fix(balance): correct currency conversion calculation
docs(api): update authentication endpoints documentation
```

## Testing Guidelines

### Frontend Testing

- Write unit tests for utility functions
- Add component tests for complex UI logic
- Test user interactions and edge cases

### Backend Testing

- Write unit tests for service functions
- Add integration tests for API endpoints
- Test error handling and edge cases
- Maintain good test coverage

## Documentation

When contributing, please also update:

- **README.md** for significant changes
- **API documentation** for backend changes
- **Component documentation** for frontend changes
- **Type definitions** for TypeScript changes

## UI/UX Guidelines

- Follow the existing design system
- Ensure accessibility (proper contrast, labels)
- Test on multiple screen sizes
- Maintain consistency across platforms
- Consider dark mode support

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Commits follow conventional format
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)

Add screenshots of UI changes

## Additional Notes

Any additional context or considerations
```

## Release Process

1. **Development** happens on feature branches
2. **Testing** on the `develop` branch
3. **Releases** from the `main` branch
4. **Hotfixes** directly to `main` when needed

## Getting Help

- **Discord:** [Join our community](https://discord.gg/paisasplit)
- **GitHub Discussions:** [Ask questions](https://github.com/tashifkhan/PaisaSplit/discussions)
- **Email:** dev@tashif.codes

## Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes
- Featured on our website (with permission)

Thank you for contributing to PaisaSplit!
