# 🔐 Admin Authentication Setup

## Firebase Admin Panel Credentials

### Project Information
- **Firebase Project**: `recharge-travels-73e76`
- **Admin Panel URL**: https://recharge-travels-73e76-admin.web.app
- **Main Site URL**: https://recharge-travels-73e76.web.app
- **Firebase Console**: https://console.firebase.google.com/project/recharge-travels-73e76

## Setup Admin User

### Option 1: Web Interface (Recommended)
1. Visit: https://recharge-travels-73e76.web.app/admin-setup.html
2. Enter admin email and password
3. Click "Create Admin Account"
4. You'll be redirected to the admin panel

### Option 2: Command Line Script
```bash
# Run the admin setup script
node scripts/setup-admin-auth.js
```

## Admin User Structure

### Firebase Authentication
- User created in Firebase Auth
- Email/password authentication
- Email verification (optional)

### Firestore Collections

#### `admins` Collection
```json
{
  "uid": "user_id",
  "email": "admin@example.com",
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "role": "super_admin",
  "permissions": ["read", "write", "delete", "admin"],
  "lastLogin": null
}
```

#### `profiles` Collection
```json
{
  "id": "user_id",
  "email": "admin@example.com",
  "is_admin": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "role": "admin"
}
```

## Admin Panel Features

### Authentication
- Login with email/password
- Admin role verification
- Session management
- Secure logout

### Admin Capabilities
- User management
- Content management
- Booking management
- Analytics dashboard
- System settings

## Security Notes

### Firebase Security Rules
- Admin access controlled by Firestore rules
- Authentication required for admin operations
- Role-based access control

### Best Practices
- Use strong passwords (min 6 characters)
- Enable email verification
- Regular password updates
- Monitor admin access logs

## Troubleshooting

### Common Issues
1. **"Account already exists"** - Use admin panel login instead
2. **"Permission denied"** - Check Firestore security rules
3. **"Invalid credentials"** - Verify email/password

### Support
- Firebase Console: https://console.firebase.google.com/project/recharge-travels-73e76
- Authentication: Firebase Console → Authentication
- Database: Firebase Console → Firestore Database

## Quick Access Links

- 🔗 **Admin Panel**: https://recharge-travels-73e76-admin.web.app
- 🌐 **Main Site**: https://recharge-travels-73e76.web.app
- 🔐 **Admin Setup**: https://recharge-travels-73e76.web.app/admin-setup.html
- 📊 **Firebase Console**: https://console.firebase.google.com/project/recharge-travels-73e76 