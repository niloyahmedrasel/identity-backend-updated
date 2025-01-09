import { IUserData, UserStore } from "../store/userStore"; // Adjust the path as necessary


export class UserRepository {
  // Initialize the repository
  async initialize() {
    await UserStore.initialize();
  }

  // Find multiple users based on criteria and optional sorting
  async find(criteria: Partial<IUserData> = {}, sort?: { [key: string]: 1 | -1 }): Promise<IUserData[]> {
    return UserStore.find(criteria).sort(sort);
  }

  // Find a single user based on criteria and optional sorting
  async findOne(criteria: Partial<IUserData> = {}, sort: { [key: string]: 1 | -1 } = {}): Promise<IUserData | undefined> {
    return UserStore.findOne(criteria, sort);
  }

  async findByPhone(phoneNo: string): Promise<IUserData | undefined> {
    try {
        const user = UserStore.findByPhone(phoneNo);
        return user;
    } catch (error) {
        throw new Error('Error fetching user by phone number');
    }
  }

  // Find a user by ID
  async findById(id: string): Promise<IUserData | undefined> {
    return UserStore.findById(id);
  }

  // Update user details by ID
  async updateUser(id: string, updatedFields: Partial<IUserData>): Promise<IUserData | null> {
    return UserStore.updateUser(id, updatedFields);
  }

  async updateProfilePicture(id: string, profilePictureUrl: string): Promise<IUserData | null> {
    return UserStore.updateProfilePicture(id, profilePictureUrl);
  }

  // Update user password by ID
  async updatePassword(id: string, password: string): Promise<IUserData | undefined> {
    return UserStore.updatePassword(id, password);
  }

  async countDocuments(filters?: {}): Promise<number> {
    if (!filters) return UserStore.totalCount();
    return UserStore.find(filters).sort().length;
  }

  async create(params: { username: string, firstName: string, lastName: string, userEmail: string, phoneNumber: string, password?: string, uid?: string, profile_photo?: string}): Promise<IUserData> {
    return UserStore.createUser(params.username, params.firstName, params.lastName, params.userEmail, params.phoneNumber, params.password, params.uid, params.profile_photo);
  }

  async updateUid(params:{id: string, newUid: number}): Promise<IUserData | null> {
    return UserStore.updateUid(params.id, params.newUid);
  }

  async updateAllCridentials(params:{id: string, firstName: string, lastName: string, email: string, phoneNumber: string}): Promise<IUserData | null> {
    return UserStore.updateAllCredentials(params.id, params.firstName, params.lastName, params.email, params.phoneNumber);
  }

  async addUserToGroup(params:{userId: string, targetGroupName: string}): Promise<void> {
    return UserStore.addUserToGroup(params.userId, params.targetGroupName);
  }
}
