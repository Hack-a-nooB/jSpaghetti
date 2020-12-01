//It gets the functions that can be used into the procedures
function getSharedFunctions(moduleName, sequenceName){
	return{
		sendSignal: function(message){ //This function must be used to send a signal to a waiting for signal listener
			if ((message === null) || (message === undefined)){
				message = "Empty message"
			}
			if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Signal sent (" + moduleName + ":" + sequenceName + "): ", message)
			jSpaghetti.modules[moduleName].sequences[sequenceName].signalChannel = message
		},
		next: function(message){
			const callback = () => {
				if (jSpaghetti.modules[moduleName].config.debugMode) showDebugMessage("Next called (" + moduleName + ":" + sequenceName + "): ", message)
				//jSpaghetti.modules[moduleName].sequences[sequenceName].state.callLastProcedure = false
				//jSpaghetti.modules[moduleName].sequences[sequenceName].state.shared.$ = message
				jSpaghetti.modules[moduleName].sequences[sequenceName].events.dispatchEvent(getEvent(LAST_COMMAND_TERMINATED))
			}
			jSpaghetti.modules[moduleName].sequences[sequenceName].state.callLastProcedure = false
			jSpaghetti.modules[moduleName].sequences[sequenceName].state.shared.$ = message
			if(jSpaghetti.modules[moduleName].sequences[sequenceName].released){
				callback()
			} else {
				const interval = setInterval(() => {
					if(jSpaghetti.modules[moduleName].sequences[sequenceName].released){
						clearInterval(interval)
						callback()
					}
				}, 100)
			}
		},
		getObjectSnapshot: getObjectSnapshot
	}
}