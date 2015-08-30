'use strict'

var todoArray = []
var todoKey = 'todos'
var taskKey = '#tasks'

// var store = new Store('http://localhost:5984/tessido')

var addTodo = function () {
  $('task-form').submit(function ( event ) {
    var todoTitle
    todoTitle = $('#todos').val()
    if (todoTitle === '') {
      return
    }
    todoArray.push(todoTitle)
    update_storage(todoArray)
    $('#tasks').append('<li> <input type="checkbox" onclick="todoChecked(this)">' + todoTitle + '</input></li>')
    $('todos').val('')
  })

  $('#task-form').on('submit', function (event) {
    event.preventDefault()
    addTodo()
  })

  var delete_checked_from_array = function () {
    var tempArray = []
    todoArray.forEach(function (task) {
      if (task['checked'] === true) {
        tempArray.push(task)
      }
    })
    todoArray = tempArray
    console.dir(todoArray)
  }

  var clearCheckedTodos = function () {
    delete_checked_from_array()
    $('input:checked').parent().remove()
  }

  var check_our_storage = function (key) {
    return true
  }

  var load_our_storage = function (key) {
    return [
      { text: 'blah blah', checked: true},
      { text: 'blah blah', checked: false}
    ]
  }

  var displayTodolist = function (todos, id) {
    todos.forEach(function (task) {
      $(id).append('<li> <input type="checkbox"' +
        ' onclick="todoChecked(this)"' + (task['checked'] ? ' checked ' : '') + '">' +
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
}
