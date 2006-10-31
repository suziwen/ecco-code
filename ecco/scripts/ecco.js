 /*
    ECCO - A online software programming IDE
    Copyright (C) 2006
    Fabio Moreira Blanco         iogui@users.sourceforge.net
    Fernando Mi?alli             feanndor@users.sourceforge.net
    William Okuyama              willok@users.sourceforge.net

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
    
*/
ECCO = function() {
	
	ECCO = this;
	var loaded = Array;
		
	this.initialize = function() {
	
		loaded = {
			'ecco'    : false,
			'console' : false,
			'fileman' : false,
			'editor'  : false
		}
	
		new AJAX();
		new Content();
		Content.initialize();
	}
	
	this.set = function(mod) {
		loaded[mod] = true;
		if(loaded['fileman'] && loaded['console'] && loaded['editor'] && loaded['ecco']) { // fazer aqui a verificacao de todos os xmls necessarios para iniciar
			this.run();
		}
	}
	
	this.run = function() {
		new Fileman();
		Fileman.initialize();
		new Editor();
		Editor.initialize();
		new Console();
		Console.initialize();

	}
	
	this.detect = function() {
		// detectar resolucao do monitor ... minimo 800x600
		// detectar outras configuracoes de browser necessarias para rodar o ECCO
	}
}

// metodo global
$ = function(id) {
	if(!arguments[1]) return document.getElementById(id);
	else document.getElementById(id).style[arguments[1]] = arguments[2];
}
