function moveEnemy(){
	timeRemaining--;
	var distance = 90*timeRemaining/20;
	$("#demonPic").css("right", distance+"%");
	if (timeRemaining > 0){
		setTimeout(moveEnemy, 1000);	
	} else{
		//out of time!
		setTimeout(alert, 10,"buzz!");
	}
	
}
var timeRemaining = 20;
//setTimeout(moveEnemy, 1000);