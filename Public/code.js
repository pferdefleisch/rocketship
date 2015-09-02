'use strict'

/**
 * TodosController deals with delegating user interactions to data and "views"
*/
function TodosController (store) {
  // set store
  this.todoStore = store;


  // set data change handler in store to render todos to DOM
  this.todoStore.onChange(this.renderTodos.bind(this));


  // we're doing lots of callbacks so set this to self to use
  // in the callbacks
  var self = this;


  // set todoContainer, we will be using this a lot
  this.$todoContainer = $('.js-todo-container');


  /////////////////////////////
  // User interaction handlers
  /////////////////////////////

  // Handle user adding a todo
  var $form  = $('.js-add-todo');
  var $input = $form.find('.js-todo-task');
  $form.on('submit', function (event) {
    stop(event);
    var todoData = $input.val();
    var todo = new Todo({task: todoData});
    d("handle add todo", todo);
    $input.val('');
    self.todoStore.add(todo);
  });

  // Handle clear button clicked
  $('.js-clear-todos').on('click', function (event) {
    stop(event);
    d("handle clear todos");
    self.clearChecked()
  });

  // Handle check all button click
  $('.js-check-all').on('click', function(event) {
    stop(event);
    d("handle check all todos");
    self.$todoContainer.find("input").each(function(i, element) {
      // TODO: this is very inefficient
      $(element).attr('checked', true).trigger('change');
    })
  });

  // Handle todo being checked, unchecked
  this.$todoContainer.on('change', '.js-todo', function (event) {
    d("handle check todo");
    self.handleTodoChecked(event.target);
  });

  // initialize controller - render todos to dom
  this.init = function () {
    d("initializing TodosController");
    self.renderTodos();
  }
}

TodosController.prototype.clearChecked = function () {
  var self = this
  this.$todoContainer.find('input:checked').each(function(i, element) {
    var id = $(element).data('id');
    d("removing todo with id", id);
    self.todoStore.remove(id);
  });
}

TodosController.prototype.handleTodoChecked = function (checkboxElement) {
  var $checkbox = $(checkboxElement),
      isChecked = $checkbox.is(':checked'),
      id        = $checkbox.data('id');
  return this.todoStore.update(id, { checked: isChecked });
}

TodosController.prototype.renderTodos = function () {
  var self = this;
  this.todoStore.all().then(function(todos) {
    var renderedHTML = "";
    todos.forEach(function(todo) { renderedHTML += todo.toHTML(); });
    d("rendering todos");
    self.$todoContainer.html(renderedHTML);
  });
}



/**
 * TodoStore wraps the pouch store and deals with our persistence layer
*/
function TodoStore (store) {
  var self      = this;
  this.store    = store;
  this.handlers = [];
  store.on('change', function () {
    self.handlers.forEach(function(handler) { handler(); });
  })
}

TodoStore.prototype.add = function(todo) {
  return this.store.add(todo.toJSON());
}

TodoStore.prototype.remove = function(id) {
  return store.remove(id);
}

TodoStore.prototype.all = function() {
  var self     = this;
  var sortFunc = function(a, b) {
    return b.createdAt < a.createdAt ? -1 : 1;
  }
  var promise = store.findAll().then(function(storedTodos){
    d("storedTodos", storedTodos);
    var todos = [];
    storedTodos.forEach(function(todo) {
      todos.push(new Todo(todo));
    })
    return todos.sort(sortFunc);
  });
  return promise;
}

TodoStore.prototype.update = function(id, data) {
  return store.update(id, data);
}

TodoStore.prototype.onChange = function(func) {
  return this.handlers.push(func);
}



/**
 * Todo is our model and can also present itself, kind of the view too
 * a presenter would be good here, will add if we get this thing working
*/
function Todo (data) {
  this.id        = data.id;
  this.task      = data.task;
  this.checked   = data.checked;
  this.createdAt = new Date(data.createdAt);
}

Todo.prototype.toJSON = function () {
  return { task: this.task, checked: this.checked }
}

Todo.prototype.toHTML = function () {
  var str = '<li><label><input class="js-todo" type="checkbox" ' + (this.checked ? 'checked' : '');
  str    += ' data-id="' + this.id + '" />';
  str    += this.task + '</label></li>'
  return str;
}



/**
 * Utility functions
*/
function d(str) {
  console.debug(str);
  Array.prototype.slice.call(arguments, 1,arguments.length).forEach(function(obj) {
    console.debug(str, obj);
  });
}

function stop(event) {
  event.preventDefault();
}



/**
 * Bootstrap the app
*/
$(document).ready(function () {
  var todoStore  = new TodoStore(store);
  var controller = new TodosController(todoStore);
  controller.init();
});
