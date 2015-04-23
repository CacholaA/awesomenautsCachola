<?php 

    require_once(__DIR__ . "/../model/config.php");
    
//The two lines of code that lets  me retriwve posts from my database 
    $query = "SELECT * FROM posts";
    $result = $_SESSION["connection"]->query($query);
    
    if($result) {
//Below is the code ethat sets up each post to have headers, paragrapgs and 
//breaks
        while($row = mysqli_fetch_array($result)) {
            echo "<div class='post'>";
            echo "<h2>" . $row['title'] . "</h2>";
            echo "<br />";
            echo "<p>" . $row['post'] . "</p>";
            echo "<br/>";
            echo "</div";
        }
    }
