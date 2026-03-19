export const serializeUser = (user: any) => {
  const obj = user.toObject();

  return {
    _id: obj._id.toString(),
    firstname: obj.firstname,
    lastname: obj.lastname,
    email: obj.email,
    role: obj.role,
  };
};
