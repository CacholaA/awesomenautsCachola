<?php
//Belwo I link this require to create my connection because it stores all the
//info I need to make a new mysqli
require_once(__DIR__ . "/../model/config.php");
//Below is my variable for the title section of my post
//It takes info of my title and uts it into the variable
//The filter input code prevents my title from getting hacked
//The FILTER_SANITIZE_STRING code is to make sure no illegal characters are used
    $title = filter_input(INPUT_POST, "title", FILTER_SANITIZE_STRING);
//Below is my variable for the post section of my post
//It takes info of my post and uts it into the variable
//The filter input code prevents my title from getting hacked
//The FILTER_SANITIZE_STRING code is to make sure no illegal characters are used
    $post = filter_input(INPUT_POST, "post", FILTER_SANITIZE_STRING);
//Below is the code that created a query that inserts into my title and post
//(database)
    $query = $_SESSION["connection"]->query("INSERT INTO posts SET title = '$title', post = '$post' ");
//Below is the code that tells me that my post was successfully inserted was 
//true
    if ($query) {
        echo "<p>Successfully inserted post: $title</p>";
    }
//Below it is saying that If my query wasnt succesfull it will echo out the 
//connection error
    else {
        echo "<p>" . $_SESSION["connection"]->error . "</p>";
    }
    
  