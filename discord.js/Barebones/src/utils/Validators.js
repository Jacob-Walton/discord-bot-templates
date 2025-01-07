class Validators {
    static isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    static isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static isValidHexColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    static isValidUsername(username) {
        return /^[a-zA-Z0-9_]{3,32}$/.test(username);
    }

    static isValidDiscordId(id) {
        return /^\d{17,19}$/.test(id);
    }

    static isValidPermission(permission) {
        return typeof permission === 'string' && 
               permission.toUpperCase() === permission &&
               permission.split('_').every(part => /^[A-Z0-9]+$/.test(part));
    }
}

module.exports = Validators;