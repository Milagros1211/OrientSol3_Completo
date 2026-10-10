function varargout = Energia_Osterwald(varargin)
% ENERGIA_OSTERWALD MATLAB code for Energia_Osterwald.fig
%      ENERGIA_OSTERWALD, by itself, creates a new ENERGIA_OSTERWALD or raises the existing
%      singleton*.
%
%      H = ENERGIA_OSTERWALD returns the handle to a new ENERGIA_OSTERWALD or the handle to
%      the existing singleton*.
%
%      ENERGIA_OSTERWALD('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in ENERGIA_OSTERWALD.M with the given input arguments.
%
%      ENERGIA_OSTERWALD('Property','Value',...) creates a new ENERGIA_OSTERWALD or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Energia_Osterwald_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Energia_Osterwald_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Energia_Osterwald

% Last Modified by GUIDE v2.5 05-Feb-2015 13:17:40

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Energia_Osterwald_OpeningFcn, ...
                   'gui_OutputFcn',  @Energia_Osterwald_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT


% --- Executes just before Energia_Osterwald is made visible.
function Energia_Osterwald_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Energia_Osterwald (see VARARGIN)
global NOMBRE_CIUDAD DATOS VOLVER_ENER;

%Centrar la ventana en la pantalla
movegui(hObject,'center');

axes(handles.Simb_coeftemp);
imagen_ctem = imread('Ener_coeftem.PNG');%Para ajustarlo directamente
imagen1_ctem = imresize(imagen_ctem, [33 29]);
imshow(imagen1_ctem);
axis off;

%Mostrar el logotipo
axes(handles.logotipo);
imagen_tit1=imread('Titulo.png');
imagen1_tit1=imresize(imagen_tit1,[30 153]); %Para ajustarlo directamente
imshow(imagen1_tit1);
axis off; 

set(handles.Ciudad,'String',NOMBRE_CIUDAD);
set(handles.Latitud,'String',roundn(DATOS(2),-2));

switch VOLVER_ENER
    
    case 1
        set(handles.Estudio,'String','Inclinación óptima anual');
    case 2 
        set(handles.Estudio,'String','Inclinación óptima estacional');        
    case 3 
        set(handles.Estudio,'String','Seguimiento a un eje polar');        
    case 4
        set(handles.Estudio,'String','Seguimiento a un eje azimutal');        
    case 5
        set(handles.Estudio,'String','Seguimiento a un eje horizontal');        
    case 6
        set(handles.Estudio,'String','Seguimiento a dos ejes');  
end

% Choose default command line output for Energia_Osterwald
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Energia_Osterwald wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Energia_Osterwald_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes on button press in Calcular.
function Calcular_Callback(hObject, eventdata, handles)
global DATOS;
global RADIACION_OST;

global E0_mes E0_ANUAL E_mes E_ANUAL Ganancia_mes Ganancia_anu;

% Se almacena el valor de la potencia instalada
potencia = get(handles.potencia,'String');
POTENCIA = str2double(potencia);

% Se almacena el valor del coeficiente de temperatura
coef_temp= get(handles.coef_temp,'String');
COEF_TEMP = str2double(coef_temp);

% Se almacena el valor de la TONC
tonc= get(handles.TONC,'String');
TONC = str2double(tonc);

%MENSAJES DE ERROR
%En caso de existir alguna casilla vacía devolvería un error
error_pot = isnan(POTENCIA);
error_ctem = isnan(COEF_TEMP);
error_tonc = isnan(TONC);

    if error_pot == 1 || error_ctem ==1 || error_tonc ==1
        warndlg('Asegúrese de introducir TODOS los datos CORRECTAMENTE para calcular.','Aviso');
        return
    end
%Acotaciones  
    if POTENCIA<0
        warndlg('La potencia pico instalada debe ser positiva.','Aviso');
        return
    end
 
    if COEF_TEMP<-0.005 || COEF_TEMP>-0.003
        warndlg('El coeficiente de temperatura debe estar comprendido entre -0.005 y -0.003.','Aviso');
        return
    end

    if TONC<40 || TONC>55
        warndlg('La TONC debe estar comprendida entre 40 y 55 ºC.','Aviso');
        return
    end
    
set(handles.resultados,'Visible','on');
set(handles.Exportar,'Enable','on');
set(handles.Informe,'Enable','on');    
    
%Valores de radiacion sobre el plano horizontal::::::::::::::::::::::::::::
RADIACION_0 = zeros(1,12);
for i=1:12
    RADIACION_0(i) = DATOS(i+2);
end

%TEMPERATURA AMBIENTE se almacena        
Temp_amb = zeros(1,12);
   for i=1:12
       Temp_amb(i) =  DATOS(i+14);
   end
   
%Se calcula la IRRADIANCIA a partir de la irradiación   G (W/m2) = Gdm(kWh/m2/día)* 1000 Wh/1Kwh * 1 día/24 horas
%Plano horizontal
G0_Wm2 = zeros(1,12); 
for i=1:12
    G0_Wm2 (i) = RADIACION_0 (i)*1000/24;
end   
   
guidata(hObject, handles);

%Tipo de estudio
G_Wm2 = zeros(1,12); 
for i=1:12
    G_Wm2 (i) = RADIACION_OST (i)*1000/24;
end   
 
%TEMPERATURA DE LA CÉLULA::::::::::::::::::::::::::::::::::::::::::::::::::
%Sobre plano horizontal
Tc0 = zeros(1,12); 
for i=1:12
    Tc0(i) = Temp_amb(i) + (((TONC - 20)/800)* G0_Wm2(i));  
end
%Tipo de estudio
Tc = zeros(1,12); 
for i=1:12
    Tc(i) = Temp_amb(i) + (((TONC - 20)/800)* G_Wm2(i));  
end


%POTENCIA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Potencia en W = Pot inst (W) *(G(W/m2) / Gstc(W/m2)* [1-(y *(tC - 25))]
%Sobre plano horizontal
P0 = zeros(1,12); 
for i=1:12
    P0(i) = (POTENCIA*1000)* (G0_Wm2(i)/1000)*(1+(COEF_TEMP*(Tc0(i)-25)));
end
%Tipo de estudio
P = zeros(1,12); 
for i=1:12
    P(i) = (POTENCIA*1000)* (G_Wm2(i)/1000)*(1+(COEF_TEMP*(Tc(i)-25)));
end

%ENERGÍA:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Energía en KWh = pot(W) * (1kW/1000W) * 24 horas /1 día
%Sobre plano horizontal
E0 = zeros(1,12);
for i=1:12
    E0(i) = (P0(i)*24) /1000;
end
%Tipo de estudio
E = zeros(1,12);
for i=1:12
    E(i) = (P(i)*24) /1000;
end

%ENERGÍA MENSUAL y ANUAL:::::::::::::::::::::::::::::::::::::::::::::::::::
%Energía al mes = E/día * número de días al mes
dias=[31 28 31 30 31 30 31 31 30 31 30 31];
%Sobre plano horizontal
E0_mes = zeros(1,12);
for i=1:12
    E0_mes(i) = E0(i) * dias(i);
end
E0_ANUAL = sum(E0_mes);
%tipo de estudio
E_mes = zeros(1,12);
for i=1:12
    E_mes(i) = E(i) * dias(i);
end
E_ANUAL = sum(E_mes);

%GANANCIA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Ganancia_mes=zeros(1,12); 
for i=1:12
    Ganancia_mes(i)= E_mes(i)- E0_mes(i);
end
Ganancia_anu= E_ANUAL - E0_ANUAL;


%MOSTRAR RESULTADOS::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Sobre el plano horizontal
set(handles.E0_ene,'String',roundn(E0_mes(1),-2)); 
set(handles.E0_feb,'String',roundn(E0_mes(2),-2)); 
set(handles.E0_mar,'String',roundn(E0_mes(3),-2)); 
set(handles.E0_abr,'String',roundn(E0_mes(4),-2)); 
set(handles.E0_may,'String',roundn(E0_mes(5),-2)); 
set(handles.E0_jun,'String',roundn(E0_mes(6),-2)); 
set(handles.E0_jul,'String',roundn(E0_mes(7),-2)); 
set(handles.E0_ago,'String',roundn(E0_mes(8),-2)); 
set(handles.E0_sep,'String',roundn(E0_mes(9),-2)); 
set(handles.E0_oct,'String',roundn(E0_mes(10),-2)); 
set(handles.E0_nov,'String',roundn(E0_mes(11),-2)); 
set(handles.E0_dic,'String',roundn(E0_mes(12),-2)); 
%Anual
set(handles.E0_anual,'String',roundn(E0_ANUAL,-2)); 

%Sobre el plano horizontal
set(handles.E_ene,'String',roundn(E_mes(1),-2)); 
set(handles.E_feb,'String',roundn(E_mes(2),-2)); 
set(handles.E_mar,'String',roundn(E_mes(3),-2)); 
set(handles.E_abr,'String',roundn(E_mes(4),-2)); 
set(handles.E_may,'String',roundn(E_mes(5),-2)); 
set(handles.E_jun,'String',roundn(E_mes(6),-2)); 
set(handles.E_jul,'String',roundn(E_mes(7),-2)); 
set(handles.E_ago,'String',roundn(E_mes(8),-2)); 
set(handles.E_sep,'String',roundn(E_mes(9),-2)); 
set(handles.E_oct,'String',roundn(E_mes(10),-2)); 
set(handles.E_nov,'String',roundn(E_mes(11),-2)); 
set(handles.E_dic,'String',roundn(E_mes(12),-2)); 
%Anual
set(handles.E_anual,'String',roundn(E_ANUAL,-2)); 

%Ganancias
set(handles.Gana_ene,'String',roundn(Ganancia_mes(1),-2)); 
set(handles.Gana_feb,'String',roundn(Ganancia_mes(2),-2)); 
set(handles.Gana_mar,'String',roundn(Ganancia_mes(3),-2)); 
set(handles.Gana_abr,'String',roundn(Ganancia_mes(4),-2)); 
set(handles.Gana_may,'String',roundn(Ganancia_mes(5),-2)); 
set(handles.Gana_jun,'String',roundn(Ganancia_mes(6),-2)); 
set(handles.Gana_jul,'String',roundn(Ganancia_mes(7),-2)); 
set(handles.Gana_ago,'String',roundn(Ganancia_mes(8),-2)); 
set(handles.Gana_sep,'String',roundn(Ganancia_mes(9),-2)); 
set(handles.Gana_oct,'String',roundn(Ganancia_mes(10),-2)); 
set(handles.Gana_nov,'String',roundn(Ganancia_mes(11),-2)); 
set(handles.Gana_dic,'String',roundn(Ganancia_mes(12),-2)); 
%Anual
set(handles.Gana_anual,'String',roundn(Ganancia_anu,-2)); 

guidata(hObject, handles);
% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)
global VOLVER_ENER;

switch VOLVER_ENER
    
    case 1
        Tabla_OptAnual;
        close ('OrientSol 3.0 - Cálculo de la energía');
    case 2 
        Tabla_OptEstacional;   
        close ('OrientSol 3.0 - Cálculo de la energía');
    case 3 
        Tabla_EjePolar;
        close ('OrientSol 3.0 - Cálculo de la energía');       
    case 4
        Tabla_EjeAzimutal;
        close ('OrientSol 3.0 - Cálculo de la energía');        
    case 5
        Tabla_EjeHorizontal;
        close ('OrientSol 3.0 - Cálculo de la energía');       
    case 6
        Tabla_2Ejes;
        close ('OrientSol 3.0 - Cálculo de la energía'); 
end



% --- Executes on button press in Informacion_simbolos.
function Informacion_simbolos_Callback(hObject, eventdata, handles)

Ayuda_Energia;


% --- Executes on button press in Salir.
function Salir_Callback(hObject, eventdata, handles)
global DATOS;
% Construct a questdlg with three options
opcion = questdlg('¿Está seguro de que desea salir del programa?', ...
	'Aviso', ...
	'Si','No','No');
% Handle response
switch opcion
    
    case 'Si'
        DATOS =[];
        % Hint: delete(hObject) closes the figure
    delete(hObject);
    close all;
    
    case 'No'
end


% --- Executes on button press in Exportar.
function Exportar_Callback(hObject, eventdata, handles)
global VOLVER_ENER;
global NOMBRE_CIUDAD  DATOS;

global E0_mes E0_ANUAL E_mes E_ANUAL Ganancia_mes Ganancia_anu;

Meses = {'Enero';'Febrero';'Marzo';'Abril';'Mayo';'Junio';'Julio';'Agosto';'Septiembre';'Octubre';'Noviembre';'Diciembre';'ANUAL'};

[nombre,ruta]=uiputfile({'*.xls'},'Guardar como');
     
   if nombre==0
      return
   end
%Cabecera----------------------------------------------------------
   escribir(1,1) = NOMBRE_CIUDAD;
   escribir(1,2)={'Latitud'};
   escribir(1,3)={DATOS(2)};
   switch VOLVER_ENER
    
        case 1
            escribir(1,5)={'Inclinación óptima anual'};
        case 2
            escribir(1,5)={'Inclinación óptima estacional'};
        case 3
            escribir(1,5)={'Seguimiento a un eje polar'};
        case 4
            escribir(1,5)={'Seguimiento a un eje azimutal'};
        case 5
            escribir(1,5)={'Seguimiento a un eje horizontal'};
        case 6
            escribir(1,5)={'Seguimiento a dos ejes'};
    end 
   
   escribir(3,2) = {'ENERGÍA MEDIA MENSUAL (kWh/mes)'};

%Meses------------------------------------------------------
for j=1:13
   escribir(j+4,1) = Meses(j);
end
   
%Títulos ---------------------------------------------------
escribir(4,2)={'Plano horizontal'};
escribir(4,3)={'Tipo de estudio'};
escribir(4,4)={'Ganancias (kWh)'};

%Valores ---------------------------------------------------
%Para el plano horizontal
for i=1:12
  escribir(i+4,2) = {E0_mes(i)};
end
  escribir(17,2) = {E0_ANUAL};
%Para el tipo de estudio seleccionado
for i=1:12
  escribir(i+4,3) = {E_mes(i)};
end
  escribir(17,3) = {E_ANUAL};
%Ganancias
for i=1:12
  escribir(i+4,4) = {Ganancia_mes(i)};
end
  escribir(17,4) = {Ganancia_anu};  
  
  
%Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
xlswrite(fullfile(ruta,nombre),escribir,'Hoja1','A1');
%Aviso
msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso'); 

guidata(hObject, handles);


% --- Executes on button press in Informe.
function Informe_Callback(hObject, eventdata, handles)
global VOLVER_ENER;
global LAT ESTUDIO;
global DATOS;

%Latitud-----------------------------------
LAT = DATOS(2);

   switch VOLVER_ENER
    
        case 1
            ESTUDIO = 'Inclinación óptima anual';
        case 2
            ESTUDIO = 'Inclinación óptima estacional';
        case 3
            ESTUDIO = 'Seguimiento a un eje polar';
        case 4
            ESTUDIO = 'Seguimiento a un eje azimutal';
        case 5
            ESTUDIO = 'Seguimiento a un eje horizontal';
        case 6
            ESTUDIO = 'Seguimiento a dos ejes';
    end 


opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'
        report ReportEnergia.rpt;

        msgbox('Informe generado y guardado en C:\\OrientSol3\InformesPDF','Aviso');
   
    otherwise 
        
            return
end



guidata(hObject, handles);


%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function potencia_Callback(hObject, eventdata, handles)
% hObject    handle to potencia (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of potencia as text
%        str2double(get(hObject,'String')) returns contents of potencia as a double


% --- Executes during object creation, after setting all properties.
function potencia_CreateFcn(hObject, eventdata, handles)
% hObject    handle to potencia (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function edit2_Callback(hObject, eventdata, handles)
% hObject    handle to edit2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of edit2 as text
%        str2double(get(hObject,'String')) returns contents of edit2 as a double


% --- Executes during object creation, after setting all properties.
function edit2_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit2 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


function coef_temp_Callback(hObject, eventdata, handles)
% hObject    handle to coef_temp (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of coef_temp as text
%        str2double(get(hObject,'String')) returns contents of coef_temp as a double


% --- Executes during object creation, after setting all properties.
function coef_temp_CreateFcn(hObject, eventdata, handles)
% hObject    handle to coef_temp (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function TONC_Callback(hObject, eventdata, handles)
% hObject    handle to TONC (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of TONC as text
%        str2double(get(hObject,'String')) returns contents of TONC as a double


% --- Executes during object creation, after setting all properties.
function TONC_CreateFcn(hObject, eventdata, handles)
% hObject    handle to TONC (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
