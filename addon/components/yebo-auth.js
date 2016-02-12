import Ember from 'ember';
import layout from '../templates/components/yebo-auth';
/**
  A simple Fieldset that doubles as a Signin & Signup form.  Sends action:
  `authenticateUser` or `createAndAuthenticateUser` depending on whether
  `isSignup` is set to `true` or `false`.

  **To Override:** You'll need to run the generator:

  ```bash
  ember g yebo-ember-auth-component
  ```

  This will install a layout file at: `app/templates/components/yebo-auth`, and
  a component file at `app/components/yebo-auth`, ready to be extended.

  @class YeboAuth
  @namespace Component
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout: layout,
  /**
    The mode of the component.

    @property isSignup
    @type Boolean
    @default false
  */
  isSignup: false,
  /**
    An array of server errors.

    @property errors
    @type Object
    @default {}
  */
  errors: {},
  /**
    The action that is sent when `isSignup` is `false`.  This is caught by the action
    defined in the `yebo-auth-user-route-mixin`.

    @property authAction
    @type String
    @default 'authenticateUser'
  */
  authAction: 'authenticateUser',
  /**
    The action that is sent when `isSignup` is `true`.  This is caught by the action
    defined in the `yebo-auth-user-route-mixin`.

    @property createAction
    @type String
    @default 'createAndAuthenticateUser'
  */
  createAction: 'createAndAuthenticateUser',

  /**
   *
   */
  resetPasswordAction: 'resetPasswordRedirect',

  identification: null,
  password: null,
  passwordConfirmation: null,

  actions: {
    submit: function() {
      var identification       = this.get('identification');
      var password             = this.get('password');
      var passwordConfirmation = this.get('passwordConfirmation');

      var action = this.get('isSignup') ? 'createAction' : 'authAction';

      this.sendAction(action, {
        identification: identification,
        password: password,
        passwordConfirmation: passwordConfirmation,
        orderToken: this.get("yebo.currentOrder.guestToken")
      }, this);
    },
    // Reset password actions
    requestToReset: function() {
      this.sendAction('resetPasswordAction');
    }
  },
  identificationDidChange: Ember.observer('identification', function() {
    this.set('errors.email', null);
  }),
  passwordDidChange: Ember.observer('password', function() {
    this.set('errors.password', null);
  }),
  passwordConfirmationDidChange: Ember.observer('passwordConfirmation', function() {
    this.set('errors.passwordConfirmation', null);
  })
});
