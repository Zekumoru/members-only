# Members Only

This is my implementation on the [members-only project](https://www.theodinproject.com/lessons/nodejs-members-only) in the [NodeJS course](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs) of [The Odin Project](https://www.theodinproject.com/).

## Viewing the project

[Click here to visit the website of this project.](https://members-only.zekumoru.com/)

To become a member, use the secret password: **givemeaccesspls**.

## Running locally

To run this project locally, create a `.env` file with the following keys:

```env
HOSTNAME="127.0.0.1"
HOST="http://127.0.0.1/"
PORT="3000"
NODE_ENV="development"
MONGODB_CONNECTION_STRING="mongodb://127.0.0.1/members_only"
DEBUG="members-only:*"
SESSION_SECRET="<Put any string you want here for the session secret>"
MEMBER_PASSWORD="<Put secret password here for member status>"
ADMIN_PASSWORD="<Put secret password here for admin status>"
```

> You either need mongodb running locally or Atlas for the `MONGODB_CONNECTION_STRING`.

Then install the necessary packages:

```bash
yarn
```

> If you prefer npm, run `npm install` instead.

And finally start the server:

```bash
yarn dev
```

> If you prefer npm, run `npm run dev` instead.

## About

Members-Only is a project to practice and learn how to authenticate users and manage permissions what the users can and cannot do by putting in a secret password which grants them one of the statuses below:

- `member`: can view the messages' authors and date of posting.
- `admin`: same as `member` plus the ability to delete messages.

Other statuses include:

- `visitor`: the initial status of a new user.
- `owner`: have the same permissions as `admin`.

> `owner` has no secret password, it is manually set in the database.

## Stats

The total amount of time it took to do this project is 8 hours.
