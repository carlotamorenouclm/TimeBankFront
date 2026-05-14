# TimeBankFront

Frontend of the **TimeBank** web application developed for the Web Systems Development laboratory assignment.

TimeBank lets users exchange services with other people using a virtual currency called **time credits** or **coins**. Users can publish services, request services, manage received requests, recharge their wallet, chat about transactions, complete requests, and review services.

## Repository

- Frontend: [https://github.com/carlotamorenouclm/TimeBankFront](https://github.com/carlotamorenouclm/TimeBankFront)
- Backend: [https://github.com/carlotamorenouclm/TimeBankBack](https://github.com/carlotamorenouclm/TimeBankBack)

## Main Features

- Public home page.
- User signup and login.
- JWT session stored in browser local storage.
- Role-based redirection to user or admin dashboard.
- Protected user dashboard.
- Service catalog with separate dashboard, owned services, purchases, and sales views.
- Service request and payment confirmation flow.
- Service publication and deletion.
- User inbox to accept or reject received requests.
- Request completion from purchase and sale history.
- Purchase and sale notification counters for pending history updates.
- Wallet balance and Stripe Checkout recharge flow.
- Purchase and sale transaction history.
- Chat from transaction history between buyer and seller.
- Unread message badge on history transactions.
- Service ratings and transaction reviews.
- User profile edition and account deletion.
- Admin dashboard for viewing users and administrators, editing accounts, changing roles, enabling/disabling users, editing wallet balances, monitoring user activity, and moderating published services.

## Tech Stack

- React
- Vite
- React Router
- React Bootstrap
- Bootstrap
- ESLint

## Project Structure

```text
timebank-front/
  public/             Static public assets
  src/
    assets/           Images and logos
    components/       Reusable UI components
    constants/        API paths, image maps, avatar options
    models/           Frontend data builders
    pages/            Route-level views
    services/         API clients grouped by domain
    utils/            Auth helpers, route guards, normalization helpers
    App.jsx           Main frontend route tree
    main.jsx          React entry point
```

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page with project introduction. |
| `/login` | Public | Login form. |
| `/signup` | Public | Registration form. |
| `/dashboarduser` | Authenticated user | Service catalog with services published by other users. |
| `/my-services` | Authenticated user | Current user's published services, including publishing, deletion, and service reviews. |
| `/my-purchases` | Authenticated user | Purchase history with chat, completion, and review actions. |
| `/my-sales` | Authenticated user | Sale history with chat, completion, and review visibility. |
| `/inbox` | Authenticated user | Received service requests. |
| `/wallet` | Authenticated user | Wallet balance and recharge page. |
| `/profile` | Authenticated user | Profile edition and account deletion. |
| `/dashboardadmin` | Authenticated admin | Administration panel. |
| `/monitoring` | Authenticated admin | General monitoring entry screen. |
| `/users/:userId/edit` | Authenticated admin | User edition screen. |
| `/users/:userId/monitoring` | Authenticated admin | User monitoring screen with movements, wallet recharges, transactions, and reviews. |

## Environment Variables

Create a `.env` file inside `TimeBankFront/timebank-front`:

```env
VITE_API_URL=http://localhost:8000
```

This value must point to the running backend API.

Wallet recharges use Stripe Checkout through the backend. The frontend does not need a Stripe publishable key in the current redirect-based integration.

## Installation

From the `TimeBankFront/timebank-front` directory:

```bash
npm install
```

## Run the Frontend

```bash
npm run dev
```

The app will usually be available at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may start on another available port such as `5174`. Both ports are currently allowed by the backend CORS configuration.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the production version. |
| `npm run lint` | Runs ESLint. |
| `npm run preview` | Serves the production build locally. |

## Backend API Usage

The frontend uses `VITE_API_URL` as the API base URL and consumes these main backend areas:

- `/auth/token` for login.
- `/users/signup` for registration.
- `/me` and `/me/update` for profile data.
- `/me/isAdmin` for role-based navigation.
- `/portal/dashboard` for service catalog data.
- `/portal/services` for publishing services.
- `/portal/services/{service_offer_id}/request` for service requests.
- `/portal/inbox` for received requests.
- `/portal/requests/{request_id}/complete` for marking accepted requests as completed.
- `/portal/history/notifications/read` for clearing purchase or sale history notification counters.
- `/portal/wallet` for wallet balance and recharge history.
- `/portal/wallet/checkout-session` for starting Stripe Checkout wallet recharges.
- `/portal/stripe/webhook` for backend-side Stripe confirmation; wallet credits are added only after the signed webhook.
- `/portal/history` for transaction history.
- `/reviews`, `/reviews/{transaction_id}`, and `/reviews/services/{service_offer_id}` for creating and reading reviews.
- `/chat/requests/{request_id}/messages` for request-linked chat messages.
- `/chat/threads/{thread_key}/messages` for history-linked chat messages.
- `/admins` and `/users` for administration views.
- `/admins/updateRole/{user_id}`, `/admins/update/is-active/{user_id}`, and `/admins/wallet/balance/{user_id}` for administrator account management.
- `/admins/wallet/history`, `/admins/transaction/history`, `/admins/reviews`, and `/admins/services` for administrator monitoring and moderation.

Protected requests include this header:

```http
Authorization: Bearer <access_token>
```

## User Flow

1. A visitor opens the home page.
2. The visitor creates an account from the signup page.
3. After registration, the user logs in.
4. The app stores the JWT access token in `localStorage`.
5. The app checks whether the user is an admin.
6. Regular users go to `/dashboarduser`.
7. Admin users go to `/dashboardadmin`.

## Regular User Guide
Youtube list with all the user guide videos:
https://www.youtube.com/playlist?list=PL5ISQmiP9ucbDl44ZIRndhnTX8tamhMLy 
