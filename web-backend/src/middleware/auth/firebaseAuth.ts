import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'
import env from 'src/config/env'

// Initialize Firebase Admin SDK
admin.initializeApp({
  // Add your Firebase admin credentials here
  credential: admin.credential.cert(JSON.parse(env.GCLOUD_ADMIN_KEY!)),
})

// Middleware function to validate Firebase auth header
const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get the Firebase auth header from the request
    const authHeader: string | undefined = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' })
      return
    }

    // Extract the Firebase ID token from the auth header
    const [, idToken]: string[] = authHeader.split(' ')

    // Verify the ID token using Firebase Admin SDK
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(idToken)

    // Check if the ID token belongs to a Google account
    if (decodedToken.firebase.sign_in_provider !== 'google.com') {
      res.status(401).json({ message: 'Invalid auth provider' })
      return
    }

    // Attach the decoded token to the request object for further use
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.decodedToken = decodedToken

    // Validate that the Google account email ends with 'cmu.edu'
    const { email } = decodedToken
    if (!email || !email.endsWith('cmu.edu')) {
      res.status(401).json({ message: 'Invalid email domain' })
      return
    }

    // attach users andrew id to the request object
    const [andrewId] = email.split('@')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.andrewId = andrewId

    // Call the next middleware or route handler
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid auth token' })
  }
}

export default firebaseAuthMiddleware
