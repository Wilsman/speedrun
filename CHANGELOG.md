# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-05-22
### Added
- Wiki links for all Kappa tasks in the task list
- Clickable link icon next to each task that opens the wiki page in a new tab
- Hover effects on wiki link icons for better user experience

### Changed
- Updated `LocalTask` interface to include optional `url` field
- Enhanced task list UI to display wiki links with consistent styling
- Improved task list item layout to accommodate wiki links

### Technical
- Added proper TypeScript types for task data structure
- Implemented accessibility features including ARIA labels
- Added click event handling to prevent event propagation
- Used React's `stopPropagation()` to prevent unwanted checkbox toggles

## Template for Future Entries

```markdown
## [x.y.z] - YYYY-MM-DD
### Added
- New features or components added

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security-related fixes
```

## Versioning Guidelines

- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backward-compatible manner
- **PATCH** version when you make backward-compatible bug fixes

## How to Update This Changelog

1. Add new entries under the [Unreleased] section
2. When releasing a new version, move the [Unreleased] changes to a new version section
3. Update the version number and date
4. Keep the template at the bottom for future reference

## Links

- [Keep a Changelog](https://keepachangelog.com)
- [Semantic Versioning](https://semver.org/)
