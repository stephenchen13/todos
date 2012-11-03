// The Application
// Our overall **AppView** is the top-level piece of UI.
app.AppView = Backbone.View.extend({
  // Instead of generating a new element, bind to the existing skeleton of
  // the App already present in the HTML
  el: '#todoapp',

  // Our template for the line of statistics at the bottom of the app.
  statsTemplate: _.template($('#stats-template').html()),

  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // At initialization we bind to the relevant events on the 'Todos'
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting tasks that might be saved in database
  initialize: function() {
    this.input = this.$('#new-todo');
    this.allCheckbox = this.$('#toggle-all')[0]
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.$listItems = this.$('#todo-list');

    var origIndex;
    this.$listItems.sortable({
      activate: function(event, ui) {
        origIndex = ui.item.index();
      },
      update: function(event, ui) {
        var model = window.app.Todos.at(origIndex);
        var currIndex = ui.item.index();
        var lastIndex = window.app.Todos.length - 1;

        model.save({order: currIndex + 1});
        if (origIndex < currIndex) {
          console.log('down');
          for(var i = origIndex + 1; i <= currIndex; i++)
          {
            app.Todos.at(i).save({order: i});
          }
        } else {
          console.log('up');
          for (var i = currIndex; i < origIndex; i++)
          {
            console.log(app.Todos.at(i).get('title') + ' ' + (i + 2));
            app.Todos.at(i).save({order: i + 2});
          }
        }
      }
    });

    window.app.Todos.on('add', this.addOne, this);
    window.app.Todos.on('reset', this.addAll, this);
    window.app.Todos.on('change:completed', this.filterOne, this);
    window.app.Todos.on('filter', this.filterAll, this);

    window.app.Todos.on('all', this.render, this);

    app.Todos.fetch();
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function() {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if (app.Todos.length){
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/'+(app.TodoFilter || '') + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Add a single todo item to the list by creating a view for it, and 
  // appending its element to the '<ul>'.
  addOne: function(todo) {
    var view = new app.TaskView({model:todo});
    $('#todo-list').append(view.render().el);
  },

  // Add all items in the **THdos** collection at once.
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  filterOne : function(todo) {
    todo.trigger("visible");
  },

  filterAll : function() {
    app.Todos.each(this.filterOne, this);
  },

  // Generate the attributes for a new Todo item.
  newAttributes: function() {
    return {
      title: this.input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  // If you hit return in the main input field, create new **Todo** model,
  // persisting it to db
  createOnEnter: function(e) {
    if (e.which !== ENTER_KEY || !this.input.val().trim()) {
      return;
    }
    app.Todos.create(this.newAttributes());
    this.input.val('');
  },

  // Clear all completed todo items, destroying their models.
  clearCompleted: function() {
    _.each(window.app.Todos.completed(), function(todo) {
      todo.destroy();
    });
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    app.Todos.each(function(todo) {
      todo.save({
        'completed': completed
      });
    });
  }
});
