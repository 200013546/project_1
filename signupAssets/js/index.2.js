$("main").addClass("pre-enter").removeClass("with-hover");
setTimeout(function(){
	$("main").addClass("on-enter");
}, 500);
setTimeout(function(){
	$("main").removeClass("pre-enter on-enter");
	setTimeout(function(){
		$("main").addClass("with-hover");
	}, 50);
}, 3000);

$("h1 a").click(function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
	if ($(this).is("#link-signup")) {
		$("#form-login").removeClass("active");
		$("#intro-login").removeClass("active");
		setTimeout(function(){
			$("#form-signup").addClass("active");
			$("#intro-signup").addClass("active");
				// rchaudry
			$("#intro-signup2").addClass("active");
				// rchaudry-end
		}, 50);
	} else {
		$("#form-signup").removeClass("active");
		$("#intro-signup").removeClass("active");
			// rchaudry
		$("#intro-signup2").removeClass("active");
			// rchaudry-end
		setTimeout(function(){
			$("#form-login").addClass("active");
			$("#intro-login").addClass("active");
		}, 50);
	}
});