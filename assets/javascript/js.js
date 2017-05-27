function moveEnemy(){
	timeRemaining--;
	var distance = 90*timeRemaining/globalTime;
	$("#demonPic").css("right", distance+"%");
	if (timeRemaining > 0){
		setTimeout(moveEnemy, 1000);	
	} else{
		//out of time!
		setTimeout(alert, 10,"buzz!");
		setTimeout(changeFriend,11);
	}
	
}

function changeFriend(){
	currentFriend ++;
	$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");
	timeRemaining = globalTime
	var distance = 90*timeRemaining/globalTime;
	$("#demonPic").css("right", distance+"%");
	setTimeout(moveEnemy, 1000);
}
function nextQuestion(){

}
var globalTime = 10
var timeRemaining = globalTime;
var currentFriend = 0;
var friendArray = ["cordelia","xander","oz","willow","giles"];
$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");
//setTimeout(moveEnemy, 1000);