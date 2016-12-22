import Ember from 'ember';
/**
  A mixin for providing utility methods to routes associated with User behaviour.
  These are grouped together in the case the ambitious developers want to glob this
  behaviour together into a single route, for a highly interactive experience.

  **Important:** The `yebo-ember-auth` install generator will attempt to overwrite your application
  route.  If you opt out of this, or you're defining it in a pod instead, you'll
  need to ensure that you're mixing Simple Auth's Application Route Mixin into your
  application route.

  ```bash
  import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
  ```

  This is essentially a thin wrapper on Ember Simple Auth.  If you'd like to
  modify behaviour or catch events relating to Authentication, please refer to
  the [Simple Auth Documentnation](http://ember-simple-auth.com/ember-simple-auth-api-docs.html)

  @class UserRouteActions
  @namespace Mixin
  @extends Ember.Mixin
*/

export default Ember.Mixin.create({
  /**
    Triggered on the `yebo` service whenever a user is successfully created
    through the `createAndAuthenticateUser` call.

    @event didCreateUser
    @param {DS.Model} newUser The newly created user model.
  */

  /**
    Triggered on the `yebo` service whenever the `createAndAuthenticateUser`
    call fails to create a new user.

    @event userCreateFailed
    @param {Error} error The server error.
  */

  /**
    Triggered on the `yebo` service whenever the `updateCurrentUser`
    call updates the current user successfully.

    @event didUpdateCurrentUser
    @param {DS.Model} currentUser The newly updated Current User.
  */

  /**
    Triggered on the `yebo` service whenever the `updateCurrentUser`
    call updates the current user successfully.

    @event currentUserUpdateFailed
    @param {Error} error The server error.
  */
  /**
    Extracts errors from failed Authenticate and Create actions, and sets them
    so that the UI can surface them.

    @method extractAuthErrors
    @param {Object} serverError A JSON Payload containing server errors.
    @return {Object} A normalized errors object.
  */
  extractAuthErrors: function(serverError) {
    serverError.errors = serverError.errors || {};

    var errors = {};
    for (var key in serverError.errors) {
      errors[key] = [{
        attribute: Ember.String.camelize(key),
        message: serverError.errors[key]
      }];
    }
    return errors;
  },

  actions: {
    /**
      The `authenticateUser` call simply wraps the `session#authenticate` method
      provided by Ember Simple Auth.

      @method authenticateUser
      @param {Object} params A javascript object with identification, password,
      and password confirmation (optional).
      @return {Ember.RSVP.Promise} A promise that resolves successfully on a
      successful authentication.
    */
    authenticateUser: function(params, authComponent) {
      authComponent.set('errors', null);

      return this.get('session').authenticate('ember-simple-auth-authenticator:yebo', params).catch(serverError => {
        authComponent.set('errors', this.extractAuthErrors(serverError));
      });
    },
    /**
      The `createAndAuthenticateUser` method attempts to create a new Yebo User,
      and when successful, triggers the `authenticateUser` action.

      @method createAndAuthenticateUser
      @param {Object} params A javascript object with identification, password,
      and password confirmation (optional).
      @return {Ember.RSVP.Promise} A promise that resolves successfully on a
      successful create then authenticate.
    */
    createAndAuthenticateUser: function(params, authComponent) {
      authComponent.set('errors', null);

      const newUser = this.yebo.store.createRecord('user', {
        email: params.identification,
        password: params.password,
        passwordConfirmation: params.passwordConfirmation
      });

      newUser.save().then(user => {
          this.yebo.trigger('didCreateUser', user);
          return this.send('authenticateUser', params, authComponent);
      }).catch(serverError => {
        this.yebo.trigger('userCreateFailed', serverError);
        this.yebo.trigger('serverError', serverError);
        authComponent.set('errors', authComponent.get("user").get("errors"));
      });

      authComponent.set('user', newUser);

      return newUser;
    },
    /**
     * Redirect to the reset password route
     */
    resetPasswordRedirect: function() {
      this.transitionTo('yebo.request-reset-password');
    }
  }
});
