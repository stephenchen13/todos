var Workspace = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },

  setFilter: function(param) {
    console.log(param);
    // Set the current filter to be used
    var filter = window.app.TodoFilter = param.trim() || '';
    // Trigger a collection filter event, causing hiding/unhiding
    // of Todo view items
    window.app.Todos.trigger('filter');
  }
});

app.TodoRouter = new Workspace();
Backbone.history.start();