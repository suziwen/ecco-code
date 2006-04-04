
Messages = {
		msgsConsole : Object, 
		msgsFileman : Object, 
		msgsEditor : Object,
		msgsEcco : Object,

	init : function(type, module) {
		Ajax.get('console.'+language+'.xml',{parameters:'', method:'post', async:true, onStart:'', onEnd:'Messages.console=XMLobj;', onError:'Ajax.error()'})
		Ajax.get('fileman.'+language+'.xml',{parameters:'', method:'post', async:true, onStart:'', onEnd:'Messages.fileman=XMLobj;', onError:'Ajax.error()'})
		Ajax.get('editor.'+language+'.xml',{parameters:'', method:'post', async:true, onStart:'', onEnd:'Messages.editor=XMLobj;', onError:'Ajax.error()'})
		Ajax.get('ecco.'+language+'.xml',{parameters:'', method:'post', async:true, onStart:'', onEnd:'Messages.ecco=XMLobj;', onError:'Ajax.error()'})
	},
		
	get : function(type, module) {

							
	}
}

