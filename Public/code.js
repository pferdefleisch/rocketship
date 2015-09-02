'use strict'

/**
 * util functions
*/
function d(str, obj) {
  if (obj) {
    return console.debug(str, obj);
  }
  return console.debug(str);
}



/**
 * TodoStore wraps the pouch store and deals with our persistence layer
*/
function TodoStore (store) {
  this.store = store;
  this.todos = [];
  this.handlers = [];
  var self = this;
  store.on('change', function () {
    self.handlers.forEach(function(handler) { handler() });
  })
}

TodoStore.prototype.add = function(todo) {
  return this.store.add(todo.toJSON());
}

TodoStore.prototype.remove = function(id) {
  return store.remove(id);
}

TodoStore.prototype.all = function() {
  var promise = store.findAll().then(function(storedTodos){
    d("storedTodos", storedTodos);
    var todos = [];
    storedTodos.forEach(function(todo) {
      todos.push(new Todo(todo));
    })
    return todos;
  });
  return promise;
}

TodoStore.prototype.onChange = function(func) {
  this.handlers.push(func);
}



/**
 * TodosController deals with delegating user interactions to data and "views"
*/
function TodosController (store) {
  this.todoStore = store;
  var todoKey = '.js-todo-task';

  var self = this;

  this.todoStore.onChange(this.renderTodos(this))

  this.$todoContainer = $('.js-todo-container')
  var $form = $('.js-add-todo');
  // init list from store
  $form.on('submit', function (event) {
    event.preventDefault()
    var $input = $form.find(todoKey);
    var todoData = $input.val();
    var todo = new Todo({task: todoData});
    d("adding todo", todo);
    $input.val('');
    self.todoStore.add(todo);
  });

  $('.js-clear-todos').on('click', function (event) {
    event.preventDefault()
    d("clearing todos");
    self.clearChecked()
  });

  this.init = function () {
    self.renderTodos(self)();
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

TodosController.prototype.renderTodos = function (context) {
  return function() {
    context.todoStore.all().then(function(todos) {
      var renderedHTML = "";
      todos.forEach(function(todo) {
        renderedHTML += todo.toHTML()
      });
      d("rendering todos");
      context.$todoContainer.html(renderedHTML);
    });
  };
}



/**
 * Todo is our model and can also present itself, kind of the view too
 * a presenter would be good here, will add if we get this thing working
*/
function Todo (data) {
  d("create todo data", data);
  this.id = data.id;
  this.task = data.task;
  this.checked = false;
}

Todo.prototype.toggleDone = function () { this.checked = !this.checked }

Todo.prototype.toJSON = function () {
  return {task: this.task, checked: this.checked }
}

Todo.prototype.toHTML = function () {
  var str = '<li> <input type="checkbox"';
  str += ' data-id="' + this.id + (this.checked ? ' checked ' : '') + '">';
  str += this.task + '</input></li>'
  return str;
}



/**
 * Bootstrap the app
*/
$(document).ready(function () {
  var todoStore = new TodoStore(store)
  var controller = new TodosController(todoStore)
  controller.init();
});
