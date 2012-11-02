// Todo Item View

// The DOM element for a todo Item
app.TaskView = Backbone.View.extend({
  //... is a list tag.
  tagName: 'li',

  // Cache the template function for a single item.
  template: _.template($('#item-template').html()),

  // The DOM events specific to an item.
  events: {
    'click .toggle': 'togglecompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // The TodoView listens for changes to its model, re-rendering. Since there's
  // a one-to-one correspondence between a **Todo** and a **TodoView** in this
  // app, we set a direct reference on the model for convenience.
  initialize: function() {
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
    this.model.on('visible', this.toggleVisible, this);
  },

  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.TodoFilter === 'completed')
      || (isCompleted && app.TodoFilter === 'active')
    );
  },

  // Toggle the 'completed' state of the model
  togglecompleted: function() {
    this.model.toggle();
  },

  // Re-render the titles of the todo item.
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.input = this.$('.edit');

    this.toggleVisible();
    this.input = this.$('.edit');
    return this;
  },

  // Toggle the 'completed' state of the model
  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());  
  },

  // Switch this view into 'editing' mode, displaying the input field.
  edit: function() {
    this.$el.addClass('editing');
    this.input.focus();
  },

  // Close the 'editing' mode, saving changes to the todo.
  close: function() {
    var value = this.input.val().trim();

    if (value) {
      this.model.save({ title: value });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },

  // If you hit 'enter', w're through editing the item.
  updateOnEnter: function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  // Remove the item, destroy the model from *localStorage* and delete its view.
  clear: function() {
    this.model.destroy();
  }
});