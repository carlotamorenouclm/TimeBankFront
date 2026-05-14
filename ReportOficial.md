# Time Bank

**Carlota Moreno Tirado**  
**Belén Huertas Ruiz**

**Universidad de Castilla-La Mancha**  
**Escuela Superior de Informática**

**Subject:** Web Systems Development  
**Degree:** Grado en Ingeniería Informática  
**Date:** 20/02/2026

---

## Index

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Content Diagram](#content-diagram-3-layers)
  - [Main Entities](#main-entities)
  - [Relationships](#relationships)
- [Navigation Diagram](#navigation-diagram)
- [Presentation Diagram](#presentation-diagram)
- [API Dictionary](#api-dictionary)
  - [Health](#health)
  - [Current User (me)](#current-user-me)
  - [Portal](#portal)
  - [Chat](#chat)
  - [Users](#users)
  - [Admins](#admins)
  - [Authentication](#authentication)
- [Main Data Types](#main-data-types)
  - [UserOut](#userout)
  - [PortalUserSummary](#portalusersummary)
  - [ServiceOfferOut](#serviceofferout)
  - [TransactionOut](#transactionout)
- [User Guide](#user-guide)
  - [Installation and Local Execution](#installation-and-local-execution)
  - [Regular User Guide](#regular-user-guide)
  - [Administrator Guide](#administrator-guide)

---

## Project Overview

TimeBank is a web application where users exchange services using a virtual currency called time credits or coins. A user can publish services, request services from other users, manage received requests, review transaction history, and recharge their wallet.

The project is split into two repositories:

- **Frontend:** <https://github.com/carlotamorenouclm/TimeBankFront>
- **Backend:** <https://github.com/carlotamorenouclm/TimeBankBack>
- **Models:** <https://drive.google.com/file/d/1-dKTxqYtD5g7gQ12-faBSI_ctbbNoa47/view?usp=sharing>

## Technology Stack

- **Frontend:** React, Vite, React Router, React Bootstrap, Bootstrap
- **Backend:** FastAPI, SQLAlchemy, Pydantic, JWT authentication
- **Database:** MySQL through PyMySQL
- **Authentication:** OAuth2 password form login with Bearer JWT tokens

## Content Diagram (3 layers)

![alt text](image.png)

### Main Entities

| Entity | Main fields |
|---|---|
| User | `id`, `email`, `hashed_password`, `name`, `surname`, `avatar_key`, `role`, `is_active`, `created_at` |
| ServiceOffer | `id`, `owner_id`, `title`, `description`, `availability`, `home_service`, `address`, `extra`, `price`, `image_key`, `owner_name`, `created_at` |
| ServiceRequest | `id`, `receiver_id`, `requester_id`, `service_offer_id`, `buyer_transaction_id`, `requester_name`, `service`, `description`, `scheduled_at`, `address`, `message`, `image_key`, `price`, `status`, `clarification`, `reject_reason`, `created_at` |
| UserWallet | `id`, `user_id`, `balance`, `status`, `created_at` |
| WalletRecharge | `id`, `user_id`, `amount`, `created_at` |
| UserTransaction | `id`, `user_id`, `type`, `service`, `other_user`, `amount`, `status`, `occurred_at`, `created_at` |

### Relationships

- User publishes zero or more `ServiceOffer` records.
- User owns one `UserWallet`.
- `UserWallet` receives zero or more `WalletRecharge` records.
- User has zero or more `UserTransaction` records.
- User can request zero or more `ServiceRequest` records.
- User can receive zero or more `ServiceRequest` records.
- `ServiceOffer` can generate zero or more `ServiceRequest` records.
- `UserTransaction` can be linked to zero or one `ServiceRequest` as a purchase transaction.

## Navigation Diagram

![alt text](image-1.png)

## Presentation Diagram

![alt text](image-2.png)

## API Dictionary

### Health

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| GET | `/health` | No | Checks backend availability. | None | `{ "status": "ok" }` |

### Current User (me)

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| GET | `/me` | User | Returns the authenticated user's profile. | None | `UserOut` |
| POST | `/me/update` | User | Updates the authenticated user's profile. | `email`, `name`, `surname`, `avatar_key` | `UserOut` |
| DELETE | `/me/delete` | User | Deletes the authenticated user's own account. | None | Empty 204 response |
| POST | `/me/isAdmin` | User | Checks whether the authenticated user has admin role. | None | `true` or `false` |

### Portal

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| GET | `/portal/summary` | User | Returns the summary shown in the sidebar. | None | `PortalUserSummary` |
| GET | `/portal/dashboard` | User | Returns available services and the user's own services. | None | `DashboardResponse` |
| GET | `/portal/history` | User | Returns the user's transaction history. | None | `HistoryResponse` |
| POST | `/portal/history/notifications/read` | User | Marks purchase or sale history update notification as read. | `{ "transaction_type": "Purchase" \| "Sale" }` | `PortalUserSummary` |
| GET | `/portal/inbox` | User | Returns received service requests. | None | `InboxResponse` |
| POST | `/portal/inbox/{request_id}/accept` | User | Accepts a received request. | `{ "clarification": "..." }` | Updated `InboxResponse` |
| POST | `/portal/inbox/{request_id}/reject` | User | Rejects a received request. | `{ "reason": "..." }` | Updated `InboxResponse` |
| POST | `/portal/requests/{request_id}/complete` | User | Completes a transaction. | None | `TransactionsResponse` |
| GET | `/portal/wallet` | User | Returns wallet balance, status, and recharge history. | None | `WalletResponse` |
| POST | `/portal/wallet/recharge` | User | Adds coins to the wallet. | `{ "amount": 10 }` | Updated `WalletResponse` |
| POST | `/portal/services/{service_offer_id}/request` | User | Requests a service and deducts the payment from the wallet. | `scheduled_at`, address fields, `message` | `CreateServiceRequestResponse` |
| POST | `/portal/services` | User | Publishes a new service offer. | Service `title`, `description`, `availability`, location, `price`, `image_key` | `CreateServiceOfferResponse` |
| POST | `/portal/wallet/checkout-session` | User | Creates a Stripe Checkout Session for a wallet recharge. | Not specified | Not specified |
| POST | `/portal/wallet/checkout-session/{session_id}/confirm` | User | Legacy status check that returns the wallet without crediting coins. | None | `WalletResponse`: `balance`, `status`, `recharges[]` |
| POST | `/portal/stripe/webhook` | Stripe | Receives signed Stripe webhook events and credits paid wallet recharges. | Stripe webhook payload and `stripe-signature` header | `{ "received": true }` |
| POST | `/portal/services/{service_offer_id}/request` | User | Requests a service and deducts the payment. | `scheduled_at`, `street`, `street_number`, `floor`, `door`, `message` | `CreateServiceRequestResponse`: `request_id`, `message`, `new_balance` |
| POST | `/portal/services` | User | Publishes a new service offer. | `title`, `description`, `availability`, `home_service`, `street`, `street_number`, `floor`, `door`, `extra`, `price`, `image_key` | `CreateServiceOfferResponse`: `message`, `service` |
| DELETE | `/portal/services/{service_offer_id}` | User | Deletes one of the user's own services. | None | `DeleteServiceOfferResponse` |

### Chat

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| GET | `/chat/requests/{request_id}/messages` | User | Lists all chat messages. | `{request_id}` | `UserOut[]` |
| POST | `/chat/requests/{request_id}/messages` | User | Creates a new message. | `{request_id}` | `UserOut` |
| GET | `/chat/threads/{thread_key}/messages` | User | Lists all thread messages. | `{thread_key}` | None |
| POST | `/chat/threads/{thread_key}/messages` | User | Creates thread messages. | `{thread_key}` | Text confirmation |

### Users

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| POST | `/users/signup` | No | Creates a new user account. | `email`, `password`, `name`, `surname` | `UserOut` |
| GET | `/users` | Admin | Lists all users. | None | `UserOut[]` |
| GET | `/users/{user_id}` | Admin | Gets a specific user by id. | None | `UserOut` |
| POST | `/users/update/{user_id}` | Admin | Updates another user's public profile data. | `email`, `name`, `surname`, `avatar_key` | Text confirmation |
| DELETE | `/users/delete/{user_id}` | Admin | Deletes a user by id. | None | Empty 204 response |

### Admins

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| GET | `/admins` | Admin | Lists all administrator accounts. | None | `UserOut[]` |
| POST | `/admins/updateRole/{user_id}` | Admin | Changes a user's role. | `{ "new_role": "USER" }` or `{ "new_role": "ADMIN" }` | Text confirmation |
| POST | `/admins/update/is-active/{user_id}` | Admin | Changes user's `is_active` status. | Not specified | Not specified |
| GET | `/admins/wallet/history` | Admin | Lists all the wallet history of a user. | Not specified | Not specified |
| GET | `/admins/transaction/history` | Admin | Lists all the transactions that a user has made. | Not specified | Not specified |

### Authentication

| Method | Endpoint | Auth | Description | Request body | Response |
|---|---|---|---|---|---|
| POST | `/auth/token` | No | Logs in a user and returns a JWT. | `username`, `password` as `application/x-www-form-urlencoded` | `{ access_token, token_type }` |

## Main Data Types

### UserOut

| Field | Type | Description |
|---|---|---|
| `id` | integer | User identifier. |
| `email` | string | User email address. |
| `name` | string or null | First name. |
| `surname` | string or null | Last name. |
| `avatar_key` | string or null | Selected avatar key. |
| `is_active` | boolean | Account status. |

### PortalUserSummary

| Field | Type | Description |
|---|---|---|
| `id` | integer | User identifier. |
| `name` | string | Name shown in the sidebar. |
| `role` | string | `USER` or `ADMIN`. |
| `email` | string | User email. |
| `avatar_key` | string or null | Selected avatar key. |

### ServiceOfferOut

| Field | Type | Description |
|---|---|---|
| `id` | integer | Service identifier. |
| `owner_id` | integer or null | User who owns the service. |
| `title` | string | Service title. |
| `description` | string | Service description. |
| `availability` | string | Availability text. |
| `home_service` | boolean | Whether the service is performed at the requester's home. |
| `address` | string or null | Provider address when the service is not home based. |
| `extra` | string or null | Extra service information. |
| `price` | integer | Price in coins. |
| `image_key` | string | Local frontend image key. |
| `owner_name` | string | Provider display name. |

### TransactionOut

| Field | Type | Description |
|---|---|---|
| `id` | integer | Transaction identifier. |
| `type` | string | Purchase or Sale. |
| `service` | string | Related service name. |
| `other_user` | string or null | Counterparty name. |
| `date` | string | Transaction date in `YYYY-MM-DD` format. |
| `address` | string or null | Service address. |
| `amount` | integer | Coins transferred. |
| `status` | string | Transaction status. |
| `clarification` | string or null | Provider clarification when accepted. |

## User Guide

### Installation and Local Execution

#### Frontend

**Prerequisites**

- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)

**Setup**

1. Open a terminal at `timebank-front/`.
2. Create a `.env` file with the backend URL:

```env
VITE_API_URL=http://localhost:8000
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

The app will start on the Vite development server, usually at <http://localhost:5173>.

#### Backend

**Prerequisites**

- Python 3.10+ installed
- MySQL server running, local or Docker

**Setup**

1. Create and activate a virtual environment:

```bash
python -m venv .venv
```

2. Activate it:

```bash
# Windows
.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=timebank
DB_USER=<database-user>
DB_PASSWORD=<database-password>
SECRET_KEY=<secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-signing-secret>
STRIPE_CURRENCY=eur
STRIPE_COIN_UNIT_AMOUNT_CENTS=100
FRONTEND_URL=http://localhost:5173
```

5. Run the API locally:

```bash
uvicorn app.main:app --reload
```

### Regular User Guide

YouTube playlist with all the user guide videos:  
<https://www.youtube.com/playlist?list=PL5ISQmiP9ucbDl44ZIRndhnTX8tamhMLy>

| Guide | Link |
|---|---|
| Create User Account | <https://youtu.be/aqFwQxqLiRQ> |
| Publish a Service | <https://youtu.be/6jkrCT_v5A0> |
| Request a Service | <https://youtu.be/EcFJ-h6j50s> |
| Delete a Service | <https://youtu.be/LmMkdHiBGOc> |
| Inbox Accept Request | <https://youtu.be/8n2TKm9yS9s> |
| Inbox Reject Request | <https://youtu.be/nKFCpO84tHo> |
| Chat | <https://youtu.be/6PqKplIX1F0> |
| Wallet | <https://www.youtube.com/watch?v=0SwPBKf6YO4> |
| Review | <https://youtu.be/Q7kJC8p4IfI> |
| Profile | <https://youtu.be/CG-Kg5HE-jo> |

### Administrator Guide

<https://youtu.be/7uRWQPooUQk>
