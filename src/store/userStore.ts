import { ApiError } from "../utils/api.response";
import { KeycloakAdminClient } from "../setup/keycloak";
import { log } from "console";
import { logger } from "../config/logger";

export interface IUserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  phone: string;
  uid: number;
  attributes: any;
  createdTimestamp: number;
}

export class UserStore {
  private static users: IUserData[] = [];
  private static index = {
    id: new Map<string, IUserData>(),
    email: new Map<string, IUserData>(),
    username: new Map<string, IUserData>(),
    phone: new Map<string, IUserData>(),
    uid: new Map<number, IUserData>(),
  };

  // Replace with actual Keycloak client and method
  private static async fetchUsersFromKeycloak(): Promise<IUserData[]> {
    // Simulating the fetch from Keycloak
    // Replace with actual API call
    const totalUsers = await KeycloakAdminClient.client().users.count();
    const response = await KeycloakAdminClient.client().users.find({
      first: 0,
      max: totalUsers,
    });

    return this.formatKeycloakUserData(response) as IUserData[]; // Adjust based on actual API response
  }

  // Initialize user data and start periodic updates
  static async initialize() {
    await this.loadUsers();
    setInterval(async () => {
      await this.loadUsers();
    }, 4 * 60 * 1000); // 4 minutes in milliseconds
  }

  // Load and index users
  private static async loadUsers() {
    const users = await this.fetchUsersFromKeycloak();
    this.users = users;
    this.index.id.clear();
    this.index.email.clear();
    this.index.username.clear();
    this.index.phone.clear();
    this.index.uid.clear();

    users.forEach((user) => {
      this.index.id.set(user.id, user);
      this.index.email.set(user.email, user);
      this.index.username.set(user.username, user);
      this.index.phone.set(user.phone, user);
      this.index.uid.set(user.uid, user);
    });

   //logger.debug(`Loaded ${users.length} users from Keycloak`);
  }

  // Find users by criteria and return a sort function
  // static find(criteria: any = {}) {
  //     let filteredUsers: IUserData[] = this.users;

  //     // Handle '$or' condition
  //     if (criteria.$or && Array.isArray(criteria.$or)) {
  //         filteredUsers = filteredUsers.filter(user => {
  //             return criteria.$or.some((condition: Partial<IUserData>) => {
  //                 return Object.entries(condition).every(([key, value]) => user[key as keyof IUserData] === value);
  //             });
  //         });
  //     }

  //     // Handle '$and' condition
  //     else if (criteria.$and && Array.isArray(criteria.$and)) {
  //         filteredUsers = filteredUsers.filter(user => {
  //             return criteria.$and.every((condition: Partial<IUserData>) => {
  //                 return Object.entries(condition).every(([key, value]) => user[key as keyof IUserData] === value);
  //             });
  //         });
  //     }

  //     // Standard filter for AND conditions when no $and or $or is provided
  //     else if (Object.keys(criteria).length !== 0) {
  //         filteredUsers = filteredUsers.filter(user =>
  //             Object.entries(criteria).every(([key, value]) => user[key as keyof IUserData] === value)
  //         );
  //     }

  //     // Return an object with a sort method
  //     return {
  //         // Sort the filtered results
  //         sort: (fields?: { [key: string]: 1 | -1 }) => {
  //             if (!fields) return filteredUsers;
  //             const sortFields = Object.entries(fields);
  //             filteredUsers.sort((a, b) => {
  //                 for (const [field, direction] of sortFields) {
  //                     const aValue = a[field as keyof IUserData];
  //                     const bValue = b[field as keyof IUserData];
  //                     const compareResult = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
  //                     if (compareResult !== 0) {
  //                         return compareResult * direction;
  //                     }
  //                 }
  //                 return 0;
  //             });
  //             return filteredUsers;
  //         },
  //     };
  // }

  static find(criteria: any = {}) {
    let filteredUsers: IUserData[] = this.users;

    const handleCondition = (user: IUserData, condition: any) => {
      return Object.entries(condition).every(([key, value]) => {
        const userValue = user[key as keyof IUserData];

        // Normalize both userValue and value to strings for comparison
        const normalizedUserValue = String(userValue);
        const normalizedValue = String(value);

        if (typeof value === "object" && value !== null) {
          // Handle comparison operators ($gt, $lt, $gte, $lte)
          if ("$gt" in value && !(normalizedUserValue > String(value.$gt)))
            return false;
          if ("$lt" in value && !(normalizedUserValue < String(value.$lt)))
            return false;
          if ("$gte" in value && !(normalizedUserValue >= String(value.$gte)))
            return false;
          if ("$lte" in value && !(normalizedUserValue <= String(value.$lte)))
            return false;
          if ("$ne" in value && !(normalizedUserValue !== String(value.$ne)))
            return false;
          // Handle regex operator ($regex)
          if (
            "$regex" in value &&
            !new RegExp(String(value.$regex), "i").test(normalizedUserValue)
          )
            return false;
        } else {
          // Standard equality check
          if (normalizedUserValue !== normalizedValue) return false;
        }
        return true;
      });
    };

    // Handle '$or' condition
    if (criteria.$or && Array.isArray(criteria.$or)) {
      filteredUsers = filteredUsers.filter((user) =>
        criteria.$or.some((condition: Partial<IUserData>) =>
          handleCondition(user, condition)
        )
      );
    }

    // Handle '$and' condition
    else if (criteria.$and && Array.isArray(criteria.$and)) {
      filteredUsers = filteredUsers.filter((user) =>
        criteria.$and.every((condition: Partial<IUserData>) =>
          handleCondition(user, condition)
        )
      );
    }

    // Standard filter for AND conditions when no $and or $or is provided
    else if (Object.keys(criteria).length !== 0) {
      filteredUsers = filteredUsers.filter((user) =>
        handleCondition(user, criteria)
      );
    }

    // Return an object with a sort method
    return {
      // Sort the filtered results
      sort: (fields?: { [key: string]: 1 | -1 }) => {
        if (!fields) return filteredUsers;
        const sortFields = Object.entries(fields);
        filteredUsers.sort((a, b) => {
          for (const [field, direction] of sortFields) {
            const aValue = a[field as keyof IUserData];
            const bValue = b[field as keyof IUserData];

            // Normalize values for sorting
            const normalizedAValue = String(aValue);
            const normalizedBValue = String(bValue);

            const compareResult =
              normalizedAValue > normalizedBValue
                ? 1
                : normalizedAValue < normalizedBValue
                ? -1
                : 0;
            if (compareResult !== 0) {
              return compareResult * direction;
            }
          }
          return 0;
        });
        return filteredUsers;
      },
    };
  }

  // Find one user with optional sorting
  static findOne(
    criteria: Partial<IUserData> = {},
    sort: { [key: string]: 1 | -1 } = {}
  ): IUserData | undefined {
    console.log(" find one here", criteria);
    const result = this.find(criteria).sort(sort);
    console.log(" find one here", result);
    return result.length > 0 ? result[0] : undefined;
  }

  // Find by ID using the indexed data
  static findById(id: string): IUserData | undefined {
    return this.index.id.get(id);
  }

  // Find by phone number using the indexed data
  static findByPhone(phoneNo: string): IUserData | undefined {
    return this.index.phone.get(phoneNo);
  }

  private static formatKeycloakUserData(
    datas: any
  ): IUserData[] | IUserData | null {
    if (Array.isArray(datas)) {
      return datas.map((data: any) => {
        return this.extractFields(data);
      }) as IUserData[];
    } else {
      return this.extractFields(datas);
    }
  }

  // Update a user by ID with new fields
  static async updateUser(
    id: string,
    updatedFields: Partial<IUserData>
  ): Promise<IUserData | null> {
    const user = this.index.id.get(id);
    if (!user) {
      return null; // User not found
    }

    try {
      let userRes = await KeycloakAdminClient.client().users.update(
        { id: id },
        updatedFields
      );
    } catch (error: any) {
      throw new ApiError({
        status: 500,
        message: "Failed to update user, please try again",
      });
    }

    // Update user fields
    Object.assign(user, updatedFields);

    // Update index maps
    this.index.id.set(id, user);
    this.index.email.set(user.email, user);
    this.index.username.set(user.username, user);
    this.index.phone.set(user.phone, user);
    this.index.uid.set(user.uid, user);

    return user; // Update successful
  }

  static async createUser(
    username: string,
    firstName: string,
    lastName: string,
    userEmail: string,
    phoneNumber: string,
    password?: string,
    uid?: string,
    profile_photo?: string
  ): Promise<IUserData> {
    const newUser = await KeycloakAdminClient.client().users.create({
      username: username,
      enabled: true,
      firstName: firstName || "N/A", // Handle empty names
      lastName: lastName || "", // If there's no last name, keep it empty
      email: userEmail,
      emailVerified: false,
      attributes: {
        phone: phoneNumber,
        uid: uid,
        profile_photo: profile_photo,
      },
      credentials: [
        {
          type: "password",
          value: password ?? username, // Fixed password
          temporary: false,
        },
      ],
    });

    return newUser;
  }

  static async updatePassword(id: string, password: string) {
    try {
      // Attempt to reset the user's password
      await KeycloakAdminClient.client().users.resetPassword({
        id: id,
        credential: {
          type: "password",
          value: password,
          temporary: false,
        },
      });
      console.log("User password reset successfully");
      return UserStore.findOne({ id: id });
    } catch (error: any) {
      // Handle any errors that occurred during the reset
      throw new Error(error);
    }
  }

  static async updateProfilePicture(
    id: string,
    profilePictureUrl: string
  ): Promise<IUserData | null> {
    const user = this.index.id.get(id);
    if (!user) {
      return null; // User not found
    }

    try {
      // Update the user's attributes with the new profile picture URL
      await KeycloakAdminClient.client().users.update(
        { id: id },
        {
          attributes: {
            ...user.attributes,
            profilePicture: [profilePictureUrl], // Add or update profile picture
          },
        }
      );
    } catch (error: any) {
      logger.error(`Failed to update profile picture for user ${id}:`, error);
      throw new ApiError({
        status: 500,
        message: "Failed to update profile picture, please try again",
      });
    }

    // Update the local user object and index with the new profile picture URL
    user.attributes = {
      ...user.attributes,
      profilePicture: [profilePictureUrl],
    };
    this.index.id.set(id, user);

    return user;
  }

  static async updateUid(
    id: string,
    newUid: number
  ): Promise<IUserData | null> {
    console.log("inside repo store");
    const user = this.index.id.get(id);
    if (!user) {
      console.log("user not found");
      return null; // User not found
    }

    try {
      await KeycloakAdminClient.client().users.update(
        { id: id },
        {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          enabled: user.enabled,
          emailVerified: user.emailVerified,
          attributes: {
            ...user.attributes,
            uid: newUid,
          },
        }
      );
    } catch (error: any) {
      console.error(
        "Failed to update user attributes:",
        error.response?.data || error.message
      );
      console.error("Failed to update user attributes:", error);
      throw new ApiError({
        status: 500,
        message: "Failed to update UID, please try again",
      });
    }

    // Update the local user object and index with the new UID
    user.attributes = {
      ...user.attributes,
      uid: [newUid],
    };
    this.index.id.set(id, user);

    return user;
  }

  static async updateAllCredentials(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
  ): Promise<IUserData | null> {
    const user = this.index.id.get(id);
    if (!user) {
      return null; // User not found
    }

    try {
      // await KeycloakAdminClient.client().users.update(
      //   { id: id },
      //   {
      //     username: user.username,
      //     firstName: firstName,
      //     lastName: lastName,
      //     email: email,
      //     enabled: user.enabled,
      //     emailVerified: user.emailVerified,
      //     attributes: {
      //       ...user.attributes,
      //       phone: phoneNumber,
      //     },
      //   }
      // );
    } catch (error: any) {
      console.error(
        "Failed to update user attributes:",
        error.response?.data || error.message
      );
      console.error("Failed to update user attributes:", error);
      throw new ApiError({
        status: 500,
        message: "Failed to update user attributes, please try again",
      });
    }

    // Update the local user object and index with the new UID
    // user.attributes = {
    //   ...user.attributes,
    //   phone: phoneNumber,
    // };
    // this.index.id.set(id, user);

    return user;
  }

  // Recursive helper function to fetch all levels of subgroups for a given group
  // Function to recursively search for the group by name in the hierarchy and add user to it
  static async addUserToGroup(
    userId: string,
    targetGroupName: string
  ): Promise<void> {
    try {
      //logger.info(`Adding user ${userId} to group ${targetGroupName}`);
      // Step 1: Retrieve all top-level groups
      const groups = await KeycloakAdminClient.client().groups.find();
      // Step 2: Recursively search for the target group in the hierarchy
      const targetGroup = await this.findGroupInHierarchy(
        groups,
        targetGroupName
      );

      if (!targetGroup) {
        throw new Error(
          `Group with name ${targetGroupName} not found in hierarchy`
        );
      }

      // Step 3: Add the user to the found group
      await KeycloakAdminClient.client().users.addToGroup({
        id: userId,
        groupId: targetGroup.id,
      });

      console.log(`User ${userId} added to group ${targetGroupName}`);
    } catch (error: any) {
      console.error(
        `Failed to add user ${userId} to group ${targetGroupName}:`,
        error.message
      );
      throw new Error(`Failed to add user to group ${targetGroupName}`);
    }
  }

  // Recursive function to search for the group in the hierarchy
  // Add a Set to keep track of visited groups
  private static async findGroupInHierarchy(
    groups: any[],
    targetGroupName: string,
    visitedGroups = new Set()
  ): Promise<any | null> {
    for (const group of groups) {
      if (visitedGroups.has(group.id)) {
        continue; // Skip groups that have already been visited
      }
      visitedGroups.add(group.id); // Mark the group as visited

      // Check if the current group is the target group
      if (group.name === targetGroupName) {
        return group;
      }

      // Retrieve child groups and perform the recursive search
      const childGroups = await this.getChildGroups(group.id);
      // logger.info(
      //   `Found ${childGroups.length} child groups for group ${group.name}`
      // );
      const childGroup = await this.findGroupInHierarchy(
        childGroups,
        targetGroupName,
        visitedGroups
      );

      if (childGroup) {
        return childGroup; // Return immediately if target group found
      }
    }

    return null; // Return null if the target group is not found
  }

  // Custom function to retrieve child groups (if any)
  private static async getChildGroups(groupId: string): Promise<any[]> {
    try {
      const childGroups =
        await KeycloakAdminClient.client().groups.listSubGroups({
          parentId: groupId,
          briefRepresentation: true,
        });
      return childGroups;
    } catch (error: any) {
      console.error(
        `Failed to retrieve child groups for group ${groupId}:`,
        error.message
      );
      throw new Error(`Failed to retrieve child groups for group ${groupId}`);
    }
  }

  static async totalCount(): Promise<number> {
    return this.users.length;
  }

  private static extractFields(user: any): IUserData | null {
    if (user) {
      const {
        id,
        username,
        firstName,
        lastName,
        email,
        enabled,
        emailVerified,
        attributes,
        createdTimestamp,
      } = user;
      return {
        id,
        username,
        firstName,
        lastName,
        email,
        enabled,
        emailVerified,
        phone: (attributes?.phone && attributes?.phone[0]) || null,
        uid: (attributes?.uid && attributes?.uid[0]) || null,
        attributes,
        createdTimestamp,
      };
    }
    return null;
  }
}
