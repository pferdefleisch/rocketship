'use strict'

var todoArray = []
var todoKey = 'todos'
var taskKey = '#tasks'
var formKey = '#task-form'
var addTodo = function ()
var delete_checked_from_array = function () 
  var tempArray = []
  todoArray.forEach(function (task) {
    if (task['checked'] === false) {
      tempArray.push(task)
    }
  })
  todoArray = tempArray
}

/**
 * a small helper function that turns a text into our task item
 * */
var text_to_task = function (text) {
  return { text: text, checked: false }
}

/**
 * push the task into our global todoArray
 * */
var push_task_in_todo_list = function (text) {
  todoArray.push(text_to_task(text))
}

/**
 * lol
 * */
var check_our_storage = function (key) {
  return true
}
var load_our_storage = function (key) {
  return []
}

/**
 * display a single todo item
 * */
var display_todo_item = function (item, id) {
  $(id).append('<li> <input type="checkbox"' +
    ' onclick="todoChecked(this)"' + (item['checked'] ? ' checked ' : '') + '">' +
    item['text'] + '</input></li>')
}
/****
 * ** starting here, all the functions are referenced
 * ** in index.html, hence, camelCase
 **/

/**
 * display ALL todo items!
 * */
var displayTodoList = function (todos, id) {
  todos.forEach(function (task) {
    display_todo_item(task, id)
  })
}

var clearCheckedTodos = function () {
  delete_checked_from_array()
  $('input:checked').parent().remove()
}

/**
 * add the input field as task in our todoArray
 *
 * XXX: this doesn't work on first load properly :|
 * and i have no idea how to make it reset
 **/
/*var addTodo = function () {
  $('#task-form').on('submit', function (event) {
    event.preventDefault()
    addTodo()
  })
}*/

$('#task-form').on('submit', function (event) {
  event.preventDefault()
  addTodo()
})

$(document).ready(function () {
  if (check_our_storage(todoKey)) {
    todoArray = load_our_storage(todoKey)
  } else {
    todoArray = []
  }

  displayTodoList(todoArray, taskKey)
})
