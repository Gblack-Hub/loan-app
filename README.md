# loan-app

## Project Setup

1.  Clone this repository and run the command below to install all dependencies

```
npm install
```

2. Install MongoDB

# NOTE

To make repayment, load the `views/index.html` page on port 8888 e.g `http://localhost:8888/loan-app/views/index.html` or change the port to your environment port.

### Admin Registration

**URL** : `/api/admin/register`

**Method** : `POST`

**Body** : `{username: String, email: String, password: String}`

**Success message** : `Registration successful`

**Auth required** : NO

### Admin Login

**URL** : `/api/admin/login`

**Method** : `POST`

**Body** : `{ email: String, password: String}`

**Success message** : `Signed In successfully`

**Auth required** : NO

### User Registration

**URL** : `/api/user/register`

**Method** : `POST`

**Body** : `{username: String, email: String, password: String}`

**Success message** : `Registration successful`

**Auth required** : NO

### User Login

**URL** : `/api/admin/login`

**Method** : `POST`

**Body** : `{ email: String, password: String}`

**Success message** : `Signed In successfully`

**Auth required** : NO

### Create Loan (User end)

**URL** : `/api/user/loan/create`

**Method** : `POST`

**Body** : `{ amount_request: Number }`

**Success message** : `Loan request created successfully`

**Auth required** : YES

### Get Loans (User end)

**URL** : `/api/user/loans`

**Method** : `GET`

**Success message** : `Successful`

**Auth required** : YES

### Get One Loan (User end)

**URL** : `/api/user/loan/:id`

**Method** : `GET`

**Success message** : `Loan data fetched successfully`

**Auth required** : YES

### Create Loan (Admin end)

**URL** : `/api/loan/create`

**Method** : `POST`

**Body** : `{ amount_request: Number, owner_email: String}`

**Success message** :`Loan request created successfully`

**Auth required** : YES

### Get Loans (Admin end)

**URL** : `/api/loan/loans`

**Method** : `GET`

**Success message** : `Successful`

**Auth required** : YES

### Get One Loan (Admin end)

**URL** : `/api/loan/:id`

**Method** : `GET`

**Success message** : `Loan data fetched successfully`

**Auth required** : YES

### Update Loan Status (Admin)

**URL** : `/api/loan/update-status/:id`

**Method** : `PUT`

**Body** : `{ loan_status: String }`

**Allowed Statuses** : `[pending, accepted, reviewing, rejected, disbursed]`

**Success message** :`Loan data updated successfully`

**Auth required** : YES

### Repay Loan (User)

**URL** : `/api/user/loan/repay/:id`

**Method** : `PUT`

**Body** : `{ email: String, amount: Number, response: Object (containing paystack response) }`

**Success message** :`Loan repayment of (amount) was successful.

**Auth required** : YES
