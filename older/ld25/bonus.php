<!DOCTYPE html><html>
	<head>
		<meta charset="utf-8" /><!--[if IE ]><meta http-equiv="Content-Type" content="text/html;charset=UTF-8" xml:lang="fr" lang="fr"/><![endif]-->
		<title>Bug Story</title>
		<link rel="stylesheet" type="text/css" href="style/reset.css"></link>
		<link rel="stylesheet" type="text/css" href="style/main.css"></link>
		<link href="favicon.ico" type="image/x-icon" rel="SHORTCUT ICON">
</head>

	<body class="loading">
		<div id="mainwrapper">
			
			<div id="holder">
				
				<header>
					<h1>
						<a href="/"><img src="logo.png" style="height:80px;width:80px;vertical-align: bottom;"/>Bug Story =)</a>
					</h1>
					<nav>
						<a href="/">Play</a><a href="/bonus">Bonus</a><a href="/author">Author</a><a href="comments">Comments</a>
					</nav>
				</header>
				<div id="content">
					
					<h2>Source</h2>
					
					<p>
						Here you can get the source of the 48h version : <a href="bugstory.zip">Download link</a>
					</p>
					
					<h2>Installation</h2>
					
					<p>
						You can even install the game on your computer (every OS supported) !
					</p>
					
					<p>You just need to use Firefox and click here : <button id="install">Install</button></p>
					
					<h2>Timelapse</h2>
					
					<p>
						Because it's cool to watch that. ;)
					</p>
					
					<iframe width="640" height="480" src="http://www.youtube.com/embed/Ut6s_a3yhoU?rel=0" frameborder="0" allowfullscreen></iframe>
					
					<h2>Developpement Versions</h2>
					
					<p>
						During the creation of the game, I saved the project many times in a different directory so now it's stil available. You can check how the game looked like during its creation :
						<ul>
							<li><a href="v1">Version 1</a></li>
							<li><a href="v2">Version 2</a></li>
							<li><a href="v3">Version 3</a></li>
							<li><a href="v4">Version 4</a></li>
							<li><a href="v5">Version 5</a></li>
							<li><a href="v6">Version 6</a></li>
						</ul>
					</p>
					<div style="height:400px;"></div>
					<div style="clear:both;"></div>
				</div>
			</div>
		</div>
		<script src="jquery.js"></script>
		<script>
			
			$("#install").click(function(){
			
				if(navigator.mozApps){
					var request = navigator.mozApps.install("http://ld25demu.quantum-softwares.fr/bugstory.webapp");
					request.onsuccess = function() {
					  alert("Installation complete.")
					};
					request.onerror = function() {
					  alert("An error occured during the installation.")
					};
				
				}else{
					alert("The app installation is not supported by you browser.")
				}
			
			});
			

		</script>

	</body>
</html>