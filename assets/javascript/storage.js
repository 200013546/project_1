




sessionStorage.clear();

sessionStorage.setItem("name", name);

$("#name-display").text(sessionStorage.getItem("name"));


$(document).on("click", "button.delete", function () {
    var todolist = JSON.parse(sessionStorage.getItem("todolist"));
    var currentIndex = $(this).attr("data-index");

    // Deletes the item marked for deletion
    todolist.splice(currentIndex, 1);
    list = todolist;

    sessionStorage.setItem("todolist", JSON.stringify(todolist));
});


var insideList = JSON.parse(sessionStorage.getItem("todolist"));

// Checks to see if we have any todos in localStorage
// If we do, set the local insideList variable to our todos
// Otherwise set the local insideList variable to an empty array
if (!Array.isArray(insideList)) {
    insideList = [];
}
