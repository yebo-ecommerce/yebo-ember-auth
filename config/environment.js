'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    "yebo": {
      signinPath: 'signin',
      signupPath: 'signup',
      accountPath: 'account'
    },
    "ember-simple-auth": {
      localStorageKey: 'yebo-ember:session',
      authorizer: 'ember-simple-auth-authorizer:yebo',
      crossOriginWhitelist: ['http://localhost:3000'],
      authenticationRoute: 'yebo.signin',
      // routeAfterAuthenticationWithItems: "yebo.checkout",
      // routeAfterAuthenticationWithoutItems: "yebo.account",
      routeIfAlreadyAuthenticated: "yebo.account"
    }
  };
};
