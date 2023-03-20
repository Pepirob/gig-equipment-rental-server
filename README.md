# CoverGig

## Description

CoverGig is an app for the rental of instruments and sound equipment for concerts between individuals.

## User Stories

- **500:** As a user I can see a 500 page so that I know it is a server problem
- **404:** As a user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
- **Register/Login:** As a user I can login to the platform so that I can access to the site utilities.
- **Logout:** As a user I can logout from the platform so no one else can use it.
- **Edit/delete profile:** As a user I can edit and delete my own account so I have own management will.
- **Rent your Equipment** As a user I can upload my own equipment for renting others
- **List Equipment** As a user I want to see the equipment so that i can choose one to rent
- **Search Equipment by location** As a user I want to search equipment by location so that I can rent nearby equipment
- **Rent Equipment** As a user I want to pay other users for equipment renting services
- **See my equipment** As a user I want to see my own equipment so that I can manage it
- **See my transactions** As a user I want to see all transactions I am involved as client aswell as provider.
- **Mark as delivered/returned** As a user I need to track my transaction state and set it to delivered if i recieved the equipment I rented, or returned if client gives back my own equipment.
- **See other user profile** As a user I need to access to other users profiles so that I can interact with them

## Backlog

Wishlist:

- Mark equipment as favourite and add it to your own wishlist displayed in your profile

Geo Location:

- Search equipment by Geo Location.

Chat:

- Chat implementation for better user interaction

# Client

## Routes

- / - Homepage
- /register - Signup form
- /login - Login form
- /dashboard- User Dashboard
- /profile - User Profile
- /profile/edit - Profile edit form
- /my-equipment - User's equipment list
- /equipment/:equipmentId - Equipment details
- /equipment/:equipmentId/edit - Equipment edit form
- /my-transactions - User's transactions list
- /transaction/:transactionId - Transaction details
- /user/:userId - Other user profile
- /create-equipment - Create equipment form
- /payment-success - Payment success info
- /error - 500
- /\* - 404

## Pages

- Home Page (public)
- Sign in Page (public)
- Log in Page (public)
- Create Equipment Page (user only)
- Dashboard Page (user only)
- Equipment details Page (user only)
- Edit equipment Page (user only)
- My equipment Page (user only)
- My transactions Page (user only)
- Transaction details Page (user only)
- Payment Success Page (user only)
- Profile Page (user only)
- Edit profile Page (user only)
- User Page (user only)
- Not Found Page (public)
- Error Page (public)

## Components

- Create Equipment component
- Dashboard component
- Equipment Details component
- Equipment Edit component
- Home Domponent
- My Equipment component
- My Transactions component
- Payment Success component
- Profile component
- Profile Edit component
- Transaction Details component
- User component
- Image Styles component
  - Input: props: any
  - Output: logo: string
- Item Equipment component
  - Input: item: any
  - Output: item(id: string, img: string, name: string)
- Item Transaction component
  - Input: item: any
  - Output: item(id: string, equipment(img: string, name: string), state: string), remainingDays: number
- Layout component
  - Input: props: any
  - Output: props(children: any)
- Navbar component
  - Input: props: any
  - Output: logoIcon: string, props(children: any)
- Navigation Avatar component
  - Input: user: any
  - Output: user(img: string, name: string)
- Navigation Main component
  - Output: user: any
- Nav Item component
  - Input: path: string, children: any
  - Output: children: any
- Search Form component
  - Input: setSearchInput: function
- Form Checkout component
  - Output: message: string
- Form Create Equipment component
  - Output: wrongFileMessage: string, errorMessage: string
- Form Edit Equipment component
  - Input: equipmentData: any
  - Output: equipmentData(img: string, name: string, description: string, pricePerDay: number, deposit: number), wrongFileMessage: string, errorMessage: string
- Form Login component
  - Output: identifier: string, password: string, errorMessage: string
- Form Profile Edit component
  - Input: userData: any
  - Output: userData(img: string, name: string, id: string), imgUrl: string, username: string, email: string, location: string, phoneNumber: number, wrongFileMessage: string
- Form Register component
  - Output: username: string, email: string, location: string, phoneNumber: number, password: string, errorMessage: string
- Form Total Price component
  - Input: pricePerDay: number, deposit: number, setTotalDays: function, totalDays: number
  - Output: pricePerDay: number, totalDays: number, deposit: number
- Link Contact component
  - Input: owner: string, client: string
  - Output: owner: string, client: string
- List Equipment component
  - Input: equipment: any
  - Output: item: any
- List Transactions component
  - Input: transactions: any
  - Output: item: any
- Navigation Cta component
- Sheet Equipment component
  - Input: equipment: any
  - Output: equipment(name: string, img: string, pricePerDay: number, deposit: number, isAvailable: boolean, description: string, id: string, owner(id: string)), errorMessage: string
- Sheet Transaction component
  - Input: transaction: any
  - Output: transaction(equipment(name: string, img: string, pricePerDay: number, deposit: number), state: string), rentingPeriod: number
- User Details component
  - Input: user: any
  - Output: user(username: string, location: string, email: string, img: string, phoneNumber: number)

## IO

## Services

- Auth Service

  - loginService(newUser)
  - signupService(credentials)
  - verifyService()

- Equipment Service

  - createEquipmentService(data)
  - getAvailableEquipmentService()
  - getLocatedEquipmentService(searchQuery)
  - getMyEquipmentService()
  - getEquipmentDetailsService(equipmentId)
  - updateEquipmentService(equipmentId, data)
  - deleteSingleEquipmentService(equipmentId, ownerId)
  - deleteAllEquipmentService(ownerId)

- Payment Service

  - createPaymentIntentService(productId, totalDays)
  - updatePaymentIntentService(paymentIntentInfo)

- Transactions Service

  - getTransactionDetailsService(transactionId)
  - getTransactionsService
  - updateTransactionStateService(transactionId, body)
  - deleteTransactionsByEquipmentService(equipmentId)
  - deleteTransactionsByUserService(userId)

- Upload Service

  - uploadEquipmentImgService(img)
  - uploadUserImgService(img)

- User Service
  - getUserService(userId)
  - updateUserService(userId, body)
  - deleteUserService(userId)

# Server

## Models

User model

```
email - String // required, unique & trim
username - String // required & unique
email - String // required & unique
location - String // required & unique
phoneNumber - Number // required
password - String // required
wishlist - [String]
img - String // default
timestamps

```

Equipment model

```
owner - ObjectID<User>
name - String // required & lowecase
pricePerDay - Number // required
deposit - Number // required
description - String // maxlength
img - String // default
isAvailable - Boolean // default
```

Transaction model

```
equipment - ObjectID<Equipment>
client - ObjectID<User>
daysRented - Number // default
state - String // enum & default
paymentIntentId - String // required
clientSecret - String // required

```

## API Endpoints/Backend Routes

- POST /auth/signup
  - body:
    - username
    - email
    - password
    - location
    - phoneNumber
- POST /auth/login
  - body:
    - identifier
    - password
- GET /auth/verify
- POST /equipment
  - body:
    - name
    - pricePerDay
    - deposit
    - description
    - img
  - payload:
    - id
- GET /equipment
  - query:
    - location
- GET /equipment/my-equipment
  - payload:
    - id
- GET /equipment/:equId
  - params: equId
- PATCH /equipment/:equId
  - params: equId
  - body:
    - owner
    - name
    - pricePerDay
    - deposit
    - description
    - img
    - isAvailable
- DELETE /equipment/:equId
  - params: equId
  - query: ownerId
  - payload: id
- DELETE /equipment/all/:userId
  - params: userId
- POST /transaction/create-payment-intent
  - body: equipId
  - payload:
    - username
    - email
  - query: totaldays
- PATCH /transaction/update-payment-intent
  - body:
    - clientSecret
    - paymentIntentId
- PATCH /transaction/:transactionId
  - params: transactionId
  - body: state
- DELETE /transaction/:equipmentId
  - params: equipmentId
- GET /transaction
- DELETE
  - params: userId
- GET /transaction/:transactionId
  - params: transactionId
- POST /upload/equipmentImg
  - file: file
- POST /upload/userImg
  - file: file
- GET /user/:userId
  - params: userId
- PATCH /user/:userId
  - params: userId
  - payload: id
  - body:
    - email
    - username
    - location
    - phoneNumber
    - wishlist
    - creditCard
- DELETE /user/:userId
  - params: userId
  - payload: id

## Links

### Trello/Kanban

[TRELLO](https://trello.com/b/qCtu6Mm3/proyecto-m3) or picture of your physical board

### Git

[Client repository Link](https://github.com/Pepirob/gig-equipment-rental-client)
[Server repository Link](https://github.com/Pepirob/gig-equipment-rental-server)

[Deploy Link](https://covergig.netlify.app/)

### Slides

[Slides Link](https://www.canva.com/design/DAFdcVxNpkI/hF1UNkWrhnn0bfffPv-KIQ/edit?utm_content=DAFdcVxNpkI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
