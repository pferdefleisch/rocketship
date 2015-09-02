'use strict'

var todoArray = []
var todoKey = '#todos'
var taskKey = '#tasks'
var formKey = '#task-form'
var renderTodoList = todoArray

// Add Item to List

// store.add('todoKey')

// Load Todos Initially

// store.findAll('todoKey')

// Event Listener

// store.on('change', renderTodoList)

var delete_checked_from_array = function () {
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

var load_our_storage = function (key) {
  store.findAll(key).then(
    function (tasks) {
      todoArray = tasks
    },
    function (error) {
      console.log('unable to load tasks from storage: ' + error
      )})
  return todoArray
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
 * it operates on the global variables todoArray and id
 * */
var displayTodoList = function () {
  todoArray.forEach(function (task) {
    display_todo_item(task, taskKey)
  })
}

var clearCheckedTodos = function () {
  delete_checked_from_array()
  $('input:checked').parent().remove()
}

/**
 * add the input field as task in our todoArray
 * as well as into the store
*/
function addTodo () {
  var todo_item = $(todoKey).val()
  if (todo_item === '') {
    return
  }
  todoArray.push(text_to_task(todo_item))
  store.add(text_to_task(todo_item))
}

$('#task-form').on('submit', function (event) {
  event.preventDefault()
  addTodo()
})

$(document).ready(function () {
  todoArray = load_our_storage(todoKey)
  displayTodoList()
})

store.on('change', displayTodoList)
