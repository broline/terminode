define(["./windows"],
	function (windows) {
	
		function getPlatform(platformName) {
			//if(platformName === "abc"){
			//return specific platform translator
			//}
			//for now only return windows
			return windows;
		}

		return {
			getPlatform: getPlatform
		};
});