// Todo Collection
// The collection of todos is backed by a database

var TodoList = Backbone.Collection.extend({
  // Reference to this collection's model.
  model: app.Task,

  url: function() {
    return 'tasks';
  },

  // Save all of the todo items under the 'todos' namespace
  // localStorage: new Store('todos-backbone'),

  completed: function() {
    return this.filter(function(todo) {
      return todo.get('completed');
    });
  },

  // Filter down the list to only todo items that are still not finished.
  remaining: function() {
    return this.without.apply(this, this.completed());
  },

  // We keep the Tasks in sequential order, despite being saved by unordered
  // GUID in the database. This generateds the next order number for new items
  nextOrder: function() {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  }, 

  // Tasks are sorted by their original insertion order.
  comparator: function(todo) {
    return todo.get('order');
  }
});

// Create our global collection of **Todos**
app.Todos = new TodoList();