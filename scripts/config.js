cfg = { };

cfg['language'] = 'ptbr'
cfg['path'] = '/ecco'

cfg['docFilemanContent'] = cfg['path']+'/content/fileman.'+cfg['language']+'.xml';
cfg['docConsoleContent'] = cfg['path']+'/content/console2.'+cfg['language']+'.xml';
cfg['docEditorContent']  = cfg['path']+'/content/editor.'+cfg['language']+'.xml';
cfg['docEccoContent']    = cfg['path']+'/content/ecco.'+cfg['language']+'.xml';

cfg['docFileman'] = cfg['path']+'/servlet/fileman.xml'; // trocar aqui pela servlet algo tipo ../getxml?fileman
cfg['docConsole'] = cfg['path']+'/servlet/console.xml';

cfg['msgBrowserError'] = 'Este browser não contém suporte para funções utilizadas pelo ECCO.'
cfg['msgFilemanError'] = 'Erro ao carregar o arquivo: '+cfg['docFilemanContent'];
cfg['msgConsoleError'] = 'Erro ao carregar o arquivo '+cfg['docConsoleContent'];
cfg['msgEditorError']  = 'Erro ao carregar o arquivo '+cfg['docEditorContent'];
cfg['msgEccoError']    = 'Erro ao carregar o arquivo '+cfg['docEccoContent'];