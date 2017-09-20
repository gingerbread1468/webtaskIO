function getToDos() {
    var i;
    var myNodelist = [];
    $.get("https://wt-c51c96b192de661a33698c52a44c4391-0.run.webtask.io/expressHack", function (data, status) {
        myObj = JSON.parse(data);
        var i;
        for (i = 0; i < myObj.length; i++) {
            var li = document.createElement("LI");
            li.innerHTML = myObj[i]["todo"];
            li.id = myObj[i]["_id"]
            document.getElementById("myUL").appendChild(li);
            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.onclick = function () {
                var id = this.parentElement.id;
                this.parentElement.style.display = "none";
                $.ajax({
                    url: "https://wt-c51c96b192de661a33698c52a44c4391-0.run.webtask.io/expressHack?id=" + id,
                    type: 'DELETE',
                    success: function (result) {},
                    error:  function(result) {console.log("Error deleting the task: " + JSON.stringify(result))}
                });
            }
            span.appendChild(txt);
            li.appendChild(span)
        }
    });
}
function addCheckedSymbol() {
    // Add a "checked" symbol when clicking on a list item
    var list = document.querySelector('ul');
    list.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'LI') {
            ev.target.classList.toggle('checked');
        }
    }, false);
}
function newElement() {
    var inputValue = document.getElementById("myInput").value;
    if (inputValue === '') {
        alert("Please enter a task!");
    } else {
        $.post("https://wt-c51c96b192de661a33698c52a44c4391-0.run.webtask.io/expressHack?todo=" + inputValue, function (data, status) {
            var li = document.createElement("li");
            var t = document.createTextNode(inputValue);
            li.appendChild(t);
            li.id = data;
            document.getElementById("myUL").appendChild(li);
            var span = document.createElement("SPAN");
            var txt = document.createTextNode("\u00D7");
            span.className = "close";
            span.onclick = function () {
                var id = this.parentElement.id;
                this.parentElement.style.display = "none";
                $.ajax({
                    url: "https://wt-c51c96b192de661a33698c52a44c4391-0.run.webtask.io/expressHack?id=" + id,
                    type: 'DELETE',
                    success: function (result) {},
                    error:  function(result) {console.log("Error deleting the task: " + JSON.stringify(result))}
                });
            }
            span.appendChild(txt);
            li.appendChild(span);
            document.getElementById("myUL").insertBefore(li, document.getElementById("myUL").firstChild);
            document.getElementById("myInput").value = "";
        });
    }
}
