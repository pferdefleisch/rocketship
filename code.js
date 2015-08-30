'use strict'

var todoArray = []
var todoKey = 'todos'
var taskKey = '#tasks'

// var store = new Store('http://localhost:5984/tessido')

/*var addTodo = function() {
$('form').submit(function ( event ) {
  console.log($(this).serializeArray())
  event.preventDefault()
  addTodo()
})
}*/

var clearCheckedTodos = function () {
  var tempArray = []
  todoArray.forEach(function (task) {
    if (task['done'] === false) {
      tempArray.push(task)
    }
  })
  todoArray = tempArray
  console.dir(todoArray)
}

var check_our_storage = function (key) {
  return true
}

var load_our_storage = function (key) {
  return [
    { text: 'Make Tea', done: true},
    { text: 'Take Over The World', done: false}
  ]
}

var displayTodolist = function (todos, id) {
  todos.forEach(function (task) {
    $(id).append('<li> <input type="checkbox"' +
      ' onclick="todoChecked(this)"' + (task['done'] ? ' checked ' : '') + '">' +
      task['text'] + '</input></li>')
  })
}

$(document).ready(function () {
  if (check_our_storage(todoKey)) {
    todoArray = load_our_storage(todoKey)
  } else {
    todoArray = []
  }

  displayTodolist(todoArray, taskKey)

})
