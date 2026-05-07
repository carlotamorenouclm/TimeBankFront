# TimeBankFront

Frontend of the **TimeBank** web application developed for the Web Systems Development laboratory assignment.

TimeBank lets users exchange services with other people using a virtual currency called **time credits** or **coins**. Users can publish services, request services, manage received requests, recharge their wallet, and review their transaction history.

## Repository

- Frontend: [https://github.com/carlotamorenouclm/TimeBankFront](https://github.com/carlotamorenouclm/TimeBankFront)
- Backend: [https://github.com/carlotamorenouclm/TimeBankBack](https://github.com/carlotamorenouclm/TimeBankBack)

## Main Features

- Public home page.
- User signup and login.
- JWT session stored in browser local storage.
- Role-based redirection to user or admin dashboard.
- Protected user dashboard.
- Service catalog with buy and sell views.
- Service request and payment confirmation flow.
- Service publication and deletion.
- User inbox to accept or reject received requests.
- Wallet balance and recharge flow.
- Transaction history filters.
- User profile edition and account deletion.
- Admin dashboard for viewing users and administrators.

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
| `/dashboarduser` | Authenticated user | User service catalog and service publication area. |
| `/history` | Authenticated user | Purchase and sale transaction history. |
| `/inbox` | Authenticated user | Received service requests. |
| `/wallet` | Authenticated user | Wallet balance and recharge page. |
| `/profile` | Authenticated user | Profile edition and account deletion. |
| `/dashboardadmin` | Authenticated admin | Administration panel. |
| `/users/:userId/edit` | Authenticated admin | User edition screen. |

## Environment Variables

Create a `.env` file inside `TimeBankFront/timebank-front`:

```env
VITE_API_URL=http://localhost:8000
```

This value must point to the running backend API.

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
- `/portal/wallet` for balance and recharges.
- `/portal/history` for transaction history.
- `/admins` and `/users` for administration views.

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

Catalog:

1. Open the dashboard.
2. Use `Buy` to view services published by other users.
3. Use `Sell` to view services published by the current user.
4. Click `Request` to request a service.
5. Fill in date, address data when needed, and an optional message.
6. Confirm payment to create the request.

Publish a service:

1. Click `Publish service`.
2. Fill in title, description, availability, service location, price, and image.
3. Confirm with `Publish`.

Inbox:

1. Open `Inbox`.
2. Review pending requests.
3. Accept a request with an optional clarification.
4. Reject a request with a required reason.

Wallet:

1. Open `Wallet`.
2. Review current balance and previous recharges.
3. Choose a quick recharge amount or enter a custom amount.
4. Confirm the recharge.

Profile:

1. Open the profile from the avatar area.
2. Update name, surname, email, or avatar.
3. Save changes.
4. Delete the account only when the user should be permanently removed.

## Admin Guide

1. Log in with an admin account.
2. Open the administration dashboard.
3. Switch between `Ver administradores` and `Ver usuarios`.
4. Review user cards and manage account data or roles through the admin flows.
