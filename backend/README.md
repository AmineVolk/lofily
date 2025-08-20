# pomodoro

# Start the database

## Without the database test

```bash
docker compose up postgres -d
```

## With test database

```bash
docker compose up -d
```
## To fix invalid credentials error when trying to send an email
### Configure google to receive emails : 

1. Acceder au compte google
2. Sécurité
3. Activer la validation en deux étapes (2 factor authentication)
    - If you have enabled 2-factor authentication on your Google account you can't use your regular password to access Gmail programmatically. You need to generate an app-specific password and use that in place of your actual password.

4. Generer le mot de passe d'application 
https://myaccount.google.com/u/3/apppasswords
(App password will work only if you have 2FA setup for your account)

Comment l'utiliser ?
Accédez aux paramètres de votre compte Google dans l'application ou l'appareil que vous essayez de configurer. Remplacez le mot de passe par celui de 16 caractères indiqué ci-dessus.

Tout comme votre mot de passe classique, ce mot de passe spécifique à une application permet d'accorder un accès complet à votre compte Google. Étant donné que vous n'avez pas besoin de le mémoriser, ne le notez nulle part ni ne le partagez avec personne.