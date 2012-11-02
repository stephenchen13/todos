var app = app || {};

// Task Model
// Our basic **Task** model has 'title', 'order', and 'completed' attributes

app.Task = Backbone.Model.extend({
  url: function() {
    var base = 'tasks';
    if (this.isNew()) return base;
    return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;
  },
  // Default attributes for the task
  // and ensure that each task created has 'title' and 'completed' keys
  defaults: {
    title: '',
    completed: false
  },
  // Toggle the 'completed' state of this todo item.
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});