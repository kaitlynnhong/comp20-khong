function parse()
{
    //new XMLHttpRequest object 
    var request = new XMLHttpRequest();
    request.open("GET", "data.json", true);

    //onreadystatechange function parses data.json
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) 
        {
            messages = JSON.parse(request.responseText);
            parsed = "";
            
            for (i = 0; i < messages.length; i++)
            {
                parsed += "<p><span class='question'>" + messages[i].content + "</span>" + " " + messages[i].username + "</p>";
            }
            document.getElementById("messages").innerHTML = parsed;
        }
    };
    
    request.send();
}