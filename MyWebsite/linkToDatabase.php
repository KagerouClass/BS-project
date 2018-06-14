<html>
<body>
<?php
$dbHost = '101.132.104.70';
$dbSocket = 'MySQL';
$dbPort = '3306';
$dbDatabase = 'my_db';
$dbUser = 'root';
$dbPWD = '861924';
$newUserID = $_POST["userID"];
$newUserPWD = $_POST["pwd"];
$newUserRealName = $_POST["realName"];
$query = 'insert into my_db.users_regist values(' . '\'' . $newUserID . '\', ' .
                                                       '\'' . $newUserPWD . '\', ' .
                                                       '\'' . $newUserRealName . '\'' . ')';
$conn = mysqli_connect($dbHost, $dbUser, $dbPWD, $dbDatabase, $dbPort, $dbSocket);
if($conn)
{
    echo "数据库连接成功!\n";
    $result = $conn->query($query);
    echo "用户注册成功!\n";
    echo "学号:" . $newUserID . "\n";
    echo "姓名:" . $newUserRealName . "\n";

}
mysqli_close($conn);
?>
</body>
</html>