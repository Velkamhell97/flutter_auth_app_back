import { Request, Response } from 'express';
import AppleAuth from 'apple-auth';
import jwt from 'jsonwebtoken';
import fs from 'fs';

import { googleVeryfy } from '../helpers';


export const googleSigninController = async (req:Request, res:Response) => {
  const { idToken } = req.body;

  try {
    const googleUser = await googleVeryfy(idToken);

    res.json({
      name: googleUser.name,
      picture: googleUser.picture,
      email: googleUser.email
    })
  } catch (error) {
    console.log(error);
    res.json({error})
  }
}

// The callback route used for Android, which will send the callback parameters from Apple into the Android app.
// This is done using a deeplink, which will cause the Chrome Custom Tab to be dismissed and providing the parameters from Apple back to the app.
export const appleCallbackController = async (req:Request, res:Response) => {
  try {
    //-Este es el procedimiento que da apple para poder hacer el signin con android y web
    const redirect = `intent://callback?${new URLSearchParams(
      req.body
    ).toString()}#Intent;package=${
      process.env.ANDROID_PACKAGE_IDENTIFIER
    };scheme=signinwithapple;end`;

    console.log(`Redirecting to ${redirect}`);

    res.redirect(307, redirect);
  } catch (error) {
    console.log(error);
    res.json({error})
  }
}

// Endpoint for the app to login or register with the `code` obtained during Sign in with Apple
//
// Use this endpoint to exchange the code (which must be validated with Apple within 5 minutes) for a session in your system
export const appleSigninController = async (req:Request, res:Response) => {
  try {
    // Puede que toque salir otro directorio por estar trabajando con TS
    const privateKey = fs.readFileSync('./keys/applesigninkey.p8').toString();

    const auth = new AppleAuth(
      {
        client_id: req.query.useBundleId === "true"
          ? process.env.BUNDLE_ID!
          : process.env.SERVICE_ID!,
        team_id: process.env.TEAM_ID!,
        // aqui no puede ir un server local se debe desplegar la app a heroku y colocar el link
        redirect_uri:"http://localhost:8080/api/auth/apple-callback", 
        key_id: process.env.KEY_ID!,
        scope: "name email"
      },
      privateKey, 
      "text"
    );
  
    console.log(req.query);
  
    const accessToken = await auth.accessToken(req.query.code as string);
  
    const idToken:any = jwt.decode(accessToken.id_token);
      
    const userID = idToken;
  
    console.log(idToken);
  
    // `userEmail` and `userName` will only be provided for the initial authorization with your app
    const userEmail = idToken.email;
    const userName = `${req.query.firstName} ${req.query.lastName}`;
  
    // 👷🏻‍♀️ TODO: Use the values provided create a new session for the user in your system
    const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;
  
    console.log(`sessionID = ${sessionID}`);
  
    res.json({
      name: userName,
      email: userEmail
    })
  } catch (error) {
    console.log(error);
    res.json({error})
  }
}