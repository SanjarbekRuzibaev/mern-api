import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    //bcyrpt is used to encrypt the password
    //to use npm i bcryptjs
    //hash password synchronusly
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Sanjar',
    email: 'sanjar@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Sultan',
    email: 'sultan@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

export default users
