// este arquivo tem q ser gerado dinamicamente com base nas configuracoes dentro de /users/nomeusuario/.config

cfg = { };

cfg['language'] = 'ptbr';
cfg['path'] = '/ecco';
cfg['user'] = 'feanndor'; // nome de usuario por enquanto estatico

// talvez juntar todas as mensagens dentro do ecco.xml ao inves de colocar separado
cfg['docFilemanContent'] = cfg['path']+'/content/fileman.'+cfg['language']+'.xml';
cfg['docConsoleContent'] = cfg['path']+'/content/console.'+cfg['language']+'.xml';
cfg['docEditorContent']  = cfg['path']+'/content/editor.'+cfg['language']+'.xml';
cfg['docEccoContent']    = cfg['path']+'/content/ecco.'+cfg['language']+'.xml';

cfg['docFileman'] = '/servlet/FileManager';
cfg['docEditor'] = '/servlet/Editor';
cfg['docConsole'] = '/servlet/Konsole';

cfg['msgBrowserError'] = 'Este browser não contém suporte para funções utilizadas pelo ECCO.'
cfg['msgFilemanError'] = 'Erro ao carregar o arquivo: '+cfg['docFilemanContent'];
cfg['msgConsoleError'] = 'Erro ao carregar o arquivo '+cfg['docConsoleContent'];
cfg['msgEditorError']  = 'Erro ao carregar o arquivo '+cfg['docEditorContent'];
cfg['msgEccoError']    = 'Erro ao carregar o arquivo '+cfg['docEccoContent'];