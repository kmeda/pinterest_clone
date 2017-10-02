export var authReducer = (state={signIn: '', signUp: ''}, action) => {
  switch (action.type) {
    case "SIGNING_IN_USER":         //SignIn Actions State
      return {
        ...state,
        signingIn: action.flag
      };
    case "INVALID_EMAIL_PASSWORD_ERROR":
      return {
        ...state,
        signIn: { ...state.signIn,
          invalidCredentials: action.alert
        }
      };
    case "EMPTY_EMAIL_ERROR":
      return {
        ...state,
        signIn: { ...state.signIn,
          noEmail: true
        }
      };
      case "EMPTY_PASSWORD_ERROR":
    return {
      ...state,
      signIn: { ...state.signIn,
        noPassword: true
      }
    };

    case "USERNAME_ERROR_MSG":         //SignUp Actions State
      return {
        ...state,
        signUp: { ...state.signUp,
          noUsername: action.flag
        }
      };
    case "USERNAME_VALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          usernameValid: action.flag
        }
      };
    case "USERNAME_INVALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          usernameInValid: action.flag
        }
      };
    case "USERNAME_IN_USE":
      return {
        ...state,
        signUp: { ...state.signUp,
          usernameInUse: action.flag
      }
    }

      case "FULLNAME_ERROR_MSG":
      return {
        ...state,
        signUp: { ...state.signUp,
          noFirstName: action.flag
        }
      };
    case "FULLNAME_VALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          fullnameValid: action.flag
        }
      };
    case "FULLNAME_INVALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          fullnameInValid: action.flag
        }
      };

    case "EMAIL_ERROR_MSG":
      return {
        ...state,
        signUp: { ...state.signUp,
          noEmail: action.flag
        }
      };
    case "EMAIL_VALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          emailValid: action.flag
        }
      };
    case "EMAIL_INVALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          emailInValid: action.flag
        }
      };
   
    case "PASSWORD_ERROR_MSG":
      return {
        ...state,
        signUp: { ...state.signUp,
          noPassword: action.flag
        }
      };
    case "PASSWORD_VALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          passwordValid: action.flag
        }
      };
    case "PASSWORD_INVALID":
      return {
        ...state,
        signUp: { ...state.signUp,
          passwordInValid: action.flag
        }
      };
    case "EMAIL_IN_USE":
      return {
        ...state,
        signUp: { ...state.signUp,
          emailInUse: action.flag
        }
      }
    case "SERVER_UNREACHABLE":
      return {
        ...state,
        signUp: { ...state.signUp,
          serverUnreachable: action.flag
        }
      }
    case "CLEAR_ERROR_MSG":
      return {
        signIn: '',
        signUp: ''
      }
    case "SET_AUTH_USER":
      return {
        ...state,
        authenticated: action.flag
      }
    case "SET_USER_DETAILS":
        return {
          ...state,
          user: action.payload
        }
    case "NUKE_AUTH_DATA":            // Clear Auth State
      return {
        signIn: '',
        signUp: ''
      };
      default:
        return state;
}
}

export var settingsReducer = (state={showSettings: false}, action) => {
  switch (action.type) {
    case "SHOW_SETTINGS":
      return {
        ...state,
        showSettings: action.flag
      }
    case "SAVE_SETTINGS":
      return {
        ...state,
        saveSettings: action.flag
      }
    default:
    return state;
  }
}

export var mintsReducer = (state={}, action) => {
  switch (action.type) {
    case "SET_MY_MINTS":
      return {
        ...state,
        myMints: action.payload
      }
    default:
      return state;
  }
}