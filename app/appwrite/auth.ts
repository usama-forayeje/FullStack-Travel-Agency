import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";

// --- getExistingUser ---
export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user (getExistingUser):", error);
    return null;
  }
};

// --- storeUserData ---
export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) {
      console.error("User not found in session after attempt to store data.");
      throw new Error("User session not found."); // Throw error for loader to catch
    }

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    // This function should RETURN the created user, not redirect
    return createdUser;
  } catch (error) {
    console.error("Error storing user data (storeUserData):", error);
    throw error; // Re-throw the error so the calling loader's catch block can handle it
  }
};

// --- getGooglePicture
const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch Google profile picture: ${response.statusText} (${response.status})`
      );

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture (getGooglePicture):", error);
    return null;
  }
};

// --- loginWithGoogle ---
export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error(
      "Error during OAuth2 session creation (loginWithGoogle):",
      error
    );
  }
};

// --- logoutUser ---
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout (logoutUser):", error);
    throw error;
  }
};

// --- getUser ---
export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) {
      console.log("No Appwrite session found in getUser.");
      return null;
    }

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select([
          "name",
          "email",
          "imageUrl",
          "joinedAt",
          "accountId",
          "status",
        ]),
      ]
    );

    return documents.length > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user (getUser):", error);
    return null;
  }
};

// --- getAllUsers ---
export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    );
    return { users, total };
  } catch (error) {
    console.error("Error fetching all users (getAllUsers):", error);
    return { users: [], total: 0 };
  }
};
