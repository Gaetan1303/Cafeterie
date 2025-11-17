// Schéma de validation centralisé pour les formulaires (yup-like minimal)
export const formSchemas = {
  register: {
    firstName: {
      required: true,
      regex: /^[A-Za-zÀ-ÿ' -]{2,30}$/,
      message: 'Prénom invalide (2-30 lettres, pas de chiffres)'
    },
    lastName: {
      required: true,
      regex: /^[A-Za-zÀ-ÿ' -]{2,30}$/,
      message: 'Nom invalide (2-30 lettres, pas de chiffres)'
    },
    email: {
      required: true,
      regex: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/,
      message: 'Email invalide'
    },
    password: {
      required: true,
      regex: /^.{8,}$/,
      message: 'Mot de passe trop court (min 8 caractères)'
    }
  },
  login: {
    email: {
      required: true,
      regex: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/,
      message: 'Email invalide'
    },
    password: {
      required: true,
      regex: /^.{4,}$/,
      message: 'Mot de passe trop court'
    }
  },
  purchase: {
    type: {
      required: true,
      regex: /^(cafe|the|nourriture)$/,
      message: 'Type invalide'
    },
    subtype: {
      required: false,
      regex: /^(gateau|viennoiserie|autre)?$/,
      message: 'Sous-type invalide'
    },
    quantity: {
      required: true,
      regex: /^([1-9][0-9]?|100)$/,
      message: 'Quantité invalide (1-100)'
    }
  }
};

export function validateForm(schema, values) {
  for (const key in schema) {
    const rule = schema[key];
    const value = values[key];
    if (rule.required && (!value && value !== 0)) {
      return rule.message;
    }
    if (value && rule.regex && !rule.regex.test(value)) {
      return rule.message;
    }
  }
  return null;
}
