const {
  getUsers,
} = require("../../../../../Day_1/HW2/src/services/userService");
const ForbiddenException = require("../exception/forbidden.exception");

module.exports = {
  getUser: () => {},
  getUsers: () => {
    // Call model hoac repository de lay du lieu
    // return ve gia tri sau khi da xu ly hoac throw error neu co loi
    const isError = false;
    if (isError) {
      throw new ForbiddenException("No permission to access this resource");
    }
    const users = [
      {
        id: 1,
        name: "John Doe",
      },
      {
        id: 2,
        name: "Jane Doe",
      },
    ];
    return users;
  },
};

//  1 controller --> Gọi nhiều service
// 1 service --> Gọi nhiều model hoặc repository
// 1 repository --> Gọi 1 model
// lưu ý: Không được trả về response trong service. --> Phải back về cho controller la,f
