function request_messages()
{
    //new XMLHttpRequest object 
    var request = new XMLHttpRequest();
    request.open("GET", "data.json", true);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            messages = JSON.parse(request.responseText);
            parsed = "";
            for (i = 0; i < messages.length; i++)
            {
                parsed += "<p>" + messages[i].content + " " + messages[i].username + "</p>";
            }
            document.getElementById("messages").innerHTML = parsed;
        }
    };
    
    request.send();
}


