# TimeBank Frontend App

This directory contains the React + Vite application for **TimeBank**.

For the complete frontend documentation, see the repository README one level above:

```text
../README.md
```

## Quick Start

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:8000
```

Wallet recharges use Stripe Checkout through the backend. No Stripe publishable key is required in the frontend for the current redirect-based flow.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Available scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the production version. |
| `npm run lint` | Runs ESLint. |
| `npm run preview` | Serves the production build locally. |

## Wallet Recharges

The wallet page asks the backend to create a Stripe Checkout session, redirects the user to Stripe, and then returns to `/wallet` after payment or cancellation. The backend is responsible for charging and adding coins after Stripe confirms the payment.

## Current App Areas

- Public home, login, and signup.
- User dashboard for browsing services from other users.
- `My services` for publishing, deleting, and reviewing feedback on owned services.
- `My purchases` and `My sales` for transaction history, update notifications, chat, request completion, and reviews.
- Inbox for accepting or rejecting received service requests.
- Wallet with Stripe Checkout recharge flow.
- Profile edition and account deletion.
- Admin dashboard for user/admin management, role changes, active status, wallet balance changes, monitoring, service moderation, and review moderation.

## Credits

Some illustrations used in the project come from [Storyset](https://storyset.com/work).
