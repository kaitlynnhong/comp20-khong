Messages part 2 
1. all elements of the lab work correctly. 
2. I did not work with anyone on this assignment.
3. I spent approximately 4 hours on this assignment. 
4. is it possible to request the data from a different origin (e.g., http://messagehub.herokuapp.com/) or from your local machine (from file:///) from using XMLHttpRequest? Why or why not? 

No it is not possible to request the data from a different origin or from the local machine when using XMLHttpRequest. This is due to the same-origin policy. The same-origin policy entails that a web browser will only permit different web pages to access the same data if the web pages have the same origin. If webpages have the same host or port, they have the same origin; and they can access and modify the same data. Because we accessed the data.json file through an XMLHttpRequest (which establishes an independent connection where data can be trasnferred to and from the webserver), the parsed data.json file cannot be accessed through opening it directly from the local machine index file or the link. the XMLHttpRequest and the index file on the local machine have different origins. 