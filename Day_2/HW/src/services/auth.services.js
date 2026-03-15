// hard code
const user = {
  name: "Khiem Truong",
  username: "khiemkhoaito",
  password: "123456",
};

const login = (username, password) => {
  if (username === user.username && password === user.password) {
    return {
      name: user.name,
      username: user.username,
    };
  } else {
    return null;
  }
};

module.exports = new AuthService();
