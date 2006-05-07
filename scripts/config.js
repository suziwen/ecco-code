// este arquivo tem q ser gerado dinamicamente com base nas configuracoes dentro de /users/nomeusuario/.config

cfg = { };

cfg['language'] = 'ptbr';
cfg['path'] = '/ecco';
cfg['user'] = 'feanndor';

// talvez juntar todas as mensagens dentro do ecco.xml ao inves de colocar separado
cfg['docFilemanContent'] = cfg['path']+'/content/fileman.'+cfg['language']+'.xml';
cfg['docConsoleContent'] = cfg['path']+'/content/console.'+cfg['language']+'.xml';
cfg['docEditorContent']  = cfg['path']+'/content/editor.'+cfg['language']+'.xml';
cfg['docEccoContent']    = cfg['path']+'/content/ecco.'+cfg['language']+'.xml';

cfg['docFileman'] = cfg['path']+'/servlet/fileman.xml'; // trocar aqui pela servlet 
cfg['docConsole'] = cfg['path']+'/servlet/console.xml';
cfg['docEditor'] = '/servlet/Editor';

cfg['msgBrowserError'] = 'Este browser não contém suporte para funções utilizadas pelo ECCO.'
cfg['msgFilemanError'] = 'Erro ao carregar o arquivo: '+cfg['docFilemanContent'];
cfg['msgConsoleError'] = 'Erro ao carregar o arquivo '+cfg['docConsoleContent'];
cfg['msgEditorError']  = 'Erro ao carregar o arquivo '+cfg['docEditorContent'];
cfg['msgEccoError']    = 'Erro ao carregar o arquivo '+cfg['docEccoContent'];