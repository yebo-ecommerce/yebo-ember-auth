import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import UserRouteActions from 'yebo-ember-auth/mixins/user-route-actions';

export default Ember.Route.extend(UnauthenticatedRouteMixin, UserRouteActions);
