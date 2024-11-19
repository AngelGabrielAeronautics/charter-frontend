import Password from "antd/es/input/Password";
import {
  AuthCredential,
  EmailAuthProvider,
  UserCredential,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

import { setUserData } from "../helpers/cookies.helpers";
import { IUser } from "../models/IUser";
import { auth } from "./firebase";
import {
  ICreateUserDto,
  createFederatedUser,
  createUser,
  getUserByEmail,
  getUserByFID,
} from "./users.service";

export interface IFederatedUser {
  email: string;
  firstNames?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string | null;
  photoURL?: string | null;
  providerId?: string; // google.com | facebook.com
  provider?: "google" | "facebook" | "email";
  fid: string;
  jwtToken: string;
}

export interface ISignInPayload {
  email: string;
  password: string;
}

export interface ISignUpPayload {
  email: string;
  password: string;
  firstNames: string;
  lastName: string;
}

export async function signIn({
  email,
  password,
}: ISignInPayload): Promise<{ token: string; user: IUser } | any> {
  try {
    await setPersistence(auth, browserLocalPersistence);

    return await signInWithEmailAndPassword(auth, email, password)
      .then(async (credential: UserCredential) => {
        const firebaseAuthUID = credential.user.uid;
        const jwtToken = await credential.user.getIdToken();
        const user = await getUserByEmail(email);
        if (!user)
          return {
            hasError: true,
            error: { code: 404, message: "User with this email not found" },
          };

        setUserData(user);

        return user;
      })
      .catch((reason: any) => {
        return { hasError: true, error: reason };
      });
  } catch (error: any) {
    return { hasError: true, error };
  }
}

export async function resetFirebasePassword(email: string): Promise<any> {
  try {
    const response = await sendPasswordResetEmail(auth, email);
    return response;
  } catch (error) {
    return { success: false, error };
  }
}

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Re-authenticate the user if they have been signed in for a while
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      // Update password
      await updatePassword(user, newPassword);
      return { status: 200, message: "success" };
    }
  } catch (error: any) {
    if (error.code === "auth/wrong-password") {
      return { status: 500, message: "incorrect password" };
    } else if (error.code === "auth/weak-password") {
      return { status: 500, message: "weak password" };
    } else {
      return { status: 500, message: "error updating password" };
    }
  }
};

export async function handleFederatedAccountSignIn(
  userData: IFederatedUser
): Promise<any> {
  try {
    const {
      providerId,
      displayName,
      fid,
      email,
      jwtToken,
      firstNames,
      lastName,
      phoneNumber,
    } = userData;

    if (providerId === "google.com") {
      let _userData: ICreateUserDto = {
        displayName,
        fid,
        email,
        provider: "google",
        auditFields: {
          createdBy: `${firstNames} ${lastName}`,
          createdById: fid,
          dateCreated: new Date(),
        },
      };

      userData.firstNames
        ? (_userData.firstNames = userData.firstNames)
        : delete _userData.firstNames;
      userData.lastName
        ? (_userData.lastName = userData.lastName)
        : delete _userData.lastName;
      userData.phoneNumber
        ? (_userData.phoneNumber = userData.phoneNumber)
        : delete _userData.phoneNumber;

      // Create the user on the server
      const user = await createFederatedUser(_userData);

      return user;
    }

    return { success: false };
  } catch (e) {
    return false;
  }
}

export async function createFirebaseAccount(
  userData: ISignUpPayload
): Promise<any> {
  try {
    const { email, password, firstNames, lastName } = userData;

    // Step 1: Create the Firebase Auth user
    const credentials: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseAuthUID = credentials.user.uid;
    const jwtToken = await credentials.user.getIdToken();

    // Create the user on the server
    const user = await createUser({
      firstNames,
      lastName,
      displayName: `${firstNames} ${lastName}`,
      fid: firebaseAuthUID,
      email,
      provider: "email",
      auditFields: {
        createdBy: `${firstNames} ${lastName}`,
        createdById: firebaseAuthUID,
        dateCreated: new Date(),
      },
    });

    // Return new user and token
    return user;
  } catch (e: any) {
    const error = {
      code: e.code,
      message: e.message,
    };

    return { hasError: true, error };
  }
}

export async function clearSession() {
  try {
    await auth.signOut();
    sessionStorage.clear();
    localStorage.clear();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export function checkIsAuthenticated(): boolean {
  const user = auth.currentUser;

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    // ...
    return true;
  } else {
    // No user is signed in.
    return false;
  }
}
