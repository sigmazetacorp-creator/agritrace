// Shared user storage across API routes
let registeredUsers: any[] = []

export function getRegisteredUsers() {
  return registeredUsers
}

export function addUser(user: any) {
  registeredUsers.push(user)
}

export function userExists(email: string) {
  return registeredUsers.some((u: any) => u.email === email)
}

export function setRegisteredUsers(users: any[]) {
  registeredUsers = users
}
