'use strict'

/**
 * util functions
*/
function d(str) {
  console.debug(str);
  Array.prototype.slice.call(arguments, 1,arguments.length).forEach(function(obj) {
    console.debug(str, obj)
  });
}



/**
 * TodosController deals with delegating user interactions to data and "views"
*/
function TodosController (store) {
  this.todoStore = store;
  var todoKey = '.js-todo-task';

  var self = this;

  this.todoStore.onChange(this.renderTodos.bind(this))

  this.$todoContainer = $('.js-todo-container')

  var $form = $('.js-add-todo');
  var $input = $form.find(todoKey);
  // init list from store
  $form.on('submit', function (event) {
    event.preventDefault()
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

  this.$todoContainer.on('change', '.js-todo', function (event) {
    self.handleTodoChecked(event.target);
  });

  this.init = function () {
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
  var $checkbox = $(checkboxElement);
  var id = $checkbox.data('id');
  var isChecked = $checkbox.is(':checked');
  d("checkbox data", isChecked);
  return this.todoStore.update(id, { checked: isChecked });
}

TodosController.prototype.renderTodos = function () {
  var self = this;
  this.todoStore.all().then(function(todos) {
    var renderedHTML = "";
    todos.forEach(function(todo) {
      renderedHTML += todo.toHTML()
    });
    d("rendering todos");
    self.$todoContainer.html(renderedHTML);
  });
}



/**
 * TodoStore wraps the pouch store and deals with our persistence layer
*/
function TodoStore (store) {
  this.store = store;
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
  var self = this;
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
  d("updating", id, data);
  return store.update(id, data);
}

TodoStore.prototype.onChange = function(func) {
  this.handlers.push(func);
}



/**
 * Todo is our model and can also present itself, kind of the view too
 * a presenter would be good here, will add if we get this thing working
*/
function Todo (data) {
  d("create todo data", data);
  this.id = data.id;
  this.task = data.task;
  this.checked = data.checked;
  this.createdAt = new Date(data.createdAt);
}

Todo.prototype.toggleDone = function () { this.checked = !this.checked }

Todo.prototype.toJSON = function () {
  return {task: this.task, checked: this.checked }
}

Todo.prototype.toHTML = function () {
  var str = '<li><label><input class="js-todo" type="checkbox" ' + (this.checked ? 'checked' : '');
  str += ' data-id="' + this.id + '" />';
  str += this.task + '</label></li>'
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
