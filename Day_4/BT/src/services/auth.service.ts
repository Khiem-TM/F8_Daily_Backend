import { User } from "../types/user.type";
import * as fs from "fs";
import * as path from "path";

class AuthService {
  private filePath = path.join(__dirname, "../../data/users.json");

  register(email: string, password: string, fullname: string) {
    // check tồn tại
    const fileData = fs.readFileSync(this.filePath, "utf-8");
    const users: User[] = JSON.parse(fileData);
    const exitUser = users.find((user) => user.email === email);
    if (exitUser) {
      throw new Error("Email đã tồn tại");
    }

    // tao doi tuong user moi (type: User)
    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      password,
      fullname,
    };

    // Luu user moi vao mang users
    users.push(newUser);
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));

    // Tra ve thong tin
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}

export default new AuthService();
