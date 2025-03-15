# Echoes Front-End

Echoes is a collaborative document management application. This repository contains the front-end code for the Echoes app, built using **Vite**, **React**, and **TypeScript**.

## Features

- Manage documents (CRUD functionality).
- A clean and user-friendly interface.
- Built with modern front-end technologies.

## Project Structure

```
src
├── api          # API calls and integrations
├── assets       # Static assets like images, fonts, etc.
├── components   # Reusable React components
├── context      # React context for global state management
├── hooks        # Custom hooks
├── pages        # Page components for routing
├── routes       # Application routing setup
├── styles       # Global and component-specific styles
├── types        # TypeScript types and interfaces
├── utils        # Utility functions
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Yarn** or **npm**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/echoes-frontend.git
cd echoes-frontend
```

### 2. Install Dependencies

Using Yarn:

```bash
yarn install
```

Or using npm:

```bash
npm install
```

### 3. Start the Development Server

Using Yarn:

```bash
yarn dev
```

Or using npm:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### 4. Build for Production

Using Yarn:

```bash
yarn build
```

Or using npm:

```bash
npm run build
```

### 5. Preview the Production Build

Using Yarn:

```bash
yarn preview
```

Or using npm:

```bash
npm run preview
```

## Environment Variables

The app uses environment variables that need to be set up in a `.env` file. Create a `.env` file in the root directory and define the variables starting with `VITE_`.

Example:

```
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=Echoes
```

## Tech Stack

- **React**: Library for building user interfaces.
- **Vite**: Build tool for lightning-fast development.
- **TypeScript**: Superset of JavaScript for type safety.
- **CSS Modules**: For styling components.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, feel free to reach out:

- **Email**: oussemaheny2@gmail.com
- **GitHub Issues**: [Create an Issue](https://github.com/your-username/echoes-client/issues)
