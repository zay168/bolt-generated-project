function storeCredentials(username, email, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('password', password); // NE JAMAIS faire ça en production
}
