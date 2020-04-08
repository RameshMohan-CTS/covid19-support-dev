# covid19-support

## Step 1 : Firebase Setup

* Create a Firebase account
* Create a project in firebase with default setup.
* Enable following authentication mechanism in your firebase project
    * By navigating firebase --> Develop --> Authentication --> Signin methods. And follow the steps there.
    * Auth Mechanisms
        * Email
        * Google
* create a firebase database with probably same name as your project

## Step 2 : Local dev Setup 

#### PreRequistes

* NodeJS 12 or later version
* VS Code or any other IDE

#### Setup Instructions

Once installed Node JS, Execute the following commands 

    npm install -g yarn firebase-tools

The above command will deploy dependent packages globally.

## Step 3 :  Update Local config Config

* Update `.firebaserc` file to mark your firebase project name
* Update `src/config/config.js` file with your firebase settings
* Update superadmin email addresses in `functions/src/index.ts` 

## Step 4 : Install Dependencies and start developing

* Run the following command to setup Dependencies

        yarn setup

*  Then, Run the following command to start the development

        yarn watch

* Navigate to `localhost:8080` to see your code running.
* Open devtools in browser to make sure no errors turns update
* Make changes to code and it will update the webpage automatically. No need to refresh

## Step 5: deploy

* Run the following command to deploy your project to firebase

        yarn deploy

* The above command will deploy following services in firebase
    * Hosting
    * Database / Firestore
    * Functions

* If you want to deploy specific components follow the commands specified in `package.json` script section
