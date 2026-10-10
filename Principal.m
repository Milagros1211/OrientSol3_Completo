function varargout = Principal(varargin)
% PRINCIPAL MATLAB code for Principal.fig
%      PRINCIPAL, by itself, creates a new PRINCIPAL or raises the existing
%      singleton*.
%
%      H = PRINCIPAL returns the handle to a new PRINCIPAL or the handle to
%      the existing singleton*.
%
%      PRINCIPAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in PRINCIPAL.M with the given input arguments.
%
%      PRINCIPAL('Property','Value',...) creates a new PRINCIPAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Principal_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Principal_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Principal

% Last Modified by GUIDE v2.5 04-Jan-2015 13:36:12

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Principal_OpeningFcn, ...
                   'gui_OutputFcn',  @Principal_OutputFcn, ...
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


% --- Executes just before Principal is made visible.
function Principal_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Principal (see VARARGIN)

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Desactivar los botones inicialmente:::::::::::::::::::::::::::::::::::::::

    
    set(handles.OptimaAnual,'Enable','on');
    set(handles.OptimaEstacional,'Enable','on');
    set(handles.SeguimientoPolar,'Enable','on');
    set(handles.SeguimientoAzimutal,'Enable','on');
    set(handles.SeguimientoHorizontal,'Enable','on');
    set(handles.SeguimientoDosEjes,'Enable','on');
    set(handles.Comparativa,'Enable','on');
    
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



% Choose default command line output for Principal
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Principal wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Principal_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on selection change in opcion.
function opcion_Callback(hObject, eventdata, handles)
% hObject    handle to opcion (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns opcion contents as cell array
%        contents{get(hObject,'Value')} returns selected item from opcion


% --- Executes during object creation, after setting all properties.
function opcion_CreateFcn(hObject, eventdata, handles)
% hObject    handle to opcion (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


%:::::::::::::::::::::::::NUEVA LOCALIZACION::::::::::::::::::::::::::::::%
% --- Executes on button press in NuevaLocalizacion.
function NuevaLocalizacion_Callback(hObject, eventdata, handles)

NuevaLocalizacion; 
close ('OrientSol 3.0');

% hObject    handle to NuevaLocalizacion (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

%guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%




%:::::::::::::::::::::::::OPTIMA ANUAL::::::::::::::::::::::::::::::::::::%
% --- Executes on button press in OptimaAnual.
function OptimaAnual_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST
OPCION_EST=1;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end


% hObject    handle to OptimaAnual (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%


%:::::::::::::::::::::::OPTIMA ESTACIONAL:::::::::::::::::::::::::::::::::%
% --- Executes on button press in OptimaEstacional.
function OptimaEstacional_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST;
OPCION_EST=2;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end
% hObject    handle to OptimaEstacional (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE POLAR:::::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoPolar.
function SeguimientoPolar_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST;
OPCION_EST=3;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end

% hObject    handle to SeguimientoPolar (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE AZIMUTAL::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoAzimutal.
function SeguimientoAzimutal_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST
OPCION_EST=4;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end
% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE HORIZONTAL::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoHorizontal.
function SeguimientoHorizontal_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST
OPCION_EST=5;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end
% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%




%::::::::::::::::::::::::::SEG. DOS EJES::::::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoDosEjes.
function SeguimientoDosEjes_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST
OPCION_EST=6;

VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end
% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::COMPARATIVA::::::::::::::::::::::::::::::::::::%
% --- Executes on button press in Comparativa.
function Comparativa_Callback(hObject, eventdata, handles)
global DATOS;
global OPCION_EST

OPCION_EST=7;
VALOR_OPC = get(handles.opcion,'Value');
switch VALOR_OPC;
    
    %CASOS ERRÓNEOS
    case 1 
                
        DATOS = [];
        
    case 54 
                
        DATOS = [];
        
    case 80 
               
        DATOS = [];
      
    case 87 
               
        DATOS = []; 
          
    case 93 
                
        DATOS = [];  
        
    case 94 
                
        DATOS = [];   
        
    case 95 
                
        DATOS = [];   
    
    case 107 
                
        DATOS = [];      
   
    case 110 
                
        DATOS = [];   
        
    case 112 
        
        DATOS = [];  
        
    case 121 
        
        DATOS = [];  
        
end   



if isempty(DATOS)
    
    errordlg('Primero debe seleccionar una ciudad y pulsar Ok', 'Error');
    
else
    
    
   CoeficienteCalculos;
 
end

% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



% --- Executes on button press in Cargar_Datos.
function Cargar_Datos_Callback(hObject, eventdata, handles)

global NOMBRE_CIUDAD DATOS LAT_RAD VALOR_OPC;
%global TEXTO


DATOS = zeros(1,26);
%NOMBRE DE LAS CIUDADDES:::::::::::::::::::::::::::::::::::::::::::::::::::
ciudades = {'Albacete';'Alicante';'Almería';'Ávila';
            'Badajoz';'Barcelona';'Bilbao';'Burgos';
            'Cáceres';'Cádiz';'Castellón';'Ceuta';'Ciudad Real';'Córdoba';'Cuenca';
            'Gerona';'Granada';'Guadalajara';
            'Huelva';'Huesca';
            'Jaén';'La Coruña';'L.P.Gran Canaria';'León';'Lérida';'Logroño';'Lugo';
            'Madrid';'Málaga';'Melilla';'Murcia';
            'Orense';'Oviedo';
            'Palencia';'P. de Mallorca';'Pamplona';'Pontevedra';
            'Salamanca';'San Sebastián';'S.C. de Tenerife';'Santander';'Segovia';'Sevilla';'Soria';
            'Tarragona';'Teruel';'Toledo';
            'Valencia';'Valladolid';'Vitoria';
            'Zamora';'Zaragoza';
            
            'Amsterdam';'Atenas';
            'Belgrado';'Berlín';'Berna';'Bruselas';'Bucarest';'Budapest';
            'Copenhage';'Dublín';'Estocolmo';
            'Helsinki';'Kiev';'Lisboa';'Londres';'Luxemburgo';'Moscú'
            'Oslo';'París';'Praga';'Riga';'Roma';'Varsovia';'Viena';'Zagreb';
            
            'Ciudad del Cabo';'Dakar';'El Cairo';'Kinshasa';'Nairobi';'Rabat';
            
            'Bagdag';'Bangkok';'Pekín';'Riad';'Tokio';
            
            'Atlanta';'Chicago';'Dallas';'Dénver';'Las Vegas';'Los Ángeles';
            'Miami';'Minneapolis';'Nueva York';'Seattle';'Washington D.C.';
            'Montreal';'Vancouver';'Ciudad de México';
            
            'Bogotá';'Buenos Aires';'Caracas';'La Paz';
            'Lima';'Montevideo';'Río Janeiro';'Santiago'
        
            'La Habana ';'Managua';'San Salvador';'Tegucigalpa'};       
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

%SELECCIÓN DE LA CIUDAD::::::::::::::::::::::::::::::::::::::::::::::::::::
%CARGAR LOS DATOS::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
VALOR_OPC = get(handles.opcion,'Value');

switch VALOR_OPC
    
    %CASOS ERRÓNEOS
    case 1 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];
        
    case 54 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];
        
    case 80 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];
      
    case 87 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = []; 
          
    case 93 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];  
        
    case 94 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];   
        
    case 95 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];   
    
    case 107 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];      
   
    case 110 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];   
        
    case 112 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];  
        
    case 121 
        errordlg('Seleccione una ubicación correcta','Error');
        
        DATOS = [];  
    
        
        
        
    %CIUDADES 
    %ESPAÑA----------------------------------------------------------------
    case 2 %Albacete
        DATOS = xlsread('BBDD','Hoja1','B3:AA3');
    
        NOMBRE_CIUDAD = ciudades(1);
               
    case 3 
        
        DATOS = xlsread('BBDD','Hoja1','B4:AA4');
        
        NOMBRE_CIUDAD = ciudades(2);
                        
    case 4 
        
        DATOS = xlsread('BBDD','Hoja1','B5:AA5');
        
        NOMBRE_CIUDAD = ciudades(3);    
                                
    case 5 
        
        DATOS = xlsread('BBDD','Hoja1','B6:AA6');
   
        NOMBRE_CIUDAD= ciudades(4);        
                    
    case 6 
        
        DATOS = xlsread('BBDD','Hoja1','B7:AA7');
   
        NOMBRE_CIUDAD = ciudades(5);
               
    case 7 
        
        DATOS = xlsread('BBDD','Hoja1','B8:AA8');
          
        NOMBRE_CIUDAD = ciudades(6);
        
        
    case 8 
        
        DATOS = xlsread('BBDD','Hoja1','B9:AA9');
        
        NOMBRE_CIUDAD = ciudades(7);
        
    case 9 
        
        DATOS = xlsread('BBDD','Hoja1','B10:AA10');
        
        NOMBRE_CIUDAD = ciudades(8);
         
    case 10 
        
        DATOS = xlsread('BBDD','Hoja1','B11:AA11');
        
        NOMBRE_CIUDAD = ciudades(9);
        
    case 11 
        
        DATOS = xlsread('BBDD','Hoja1','B12:AA12');
        
        NOMBRE_CIUDAD = ciudades(10);
        
    case 12 
        
        DATOS = xlsread('BBDD','Hoja1','B13:AA13'); 
        
        NOMBRE_CIUDAD = ciudades(11);
        
    case 13 
        
        DATOS = xlsread('BBDD','Hoja1','B14:AA14');
        
        NOMBRE_CIUDAD = ciudades(12);
        
    case 14 
        
        DATOS = xlsread('BBDD','Hoja1','B15:AA15');
        
        NOMBRE_CIUDAD = ciudades(13);
        
    case 15 
        
        DATOS = xlsread('BBDD','Hoja1','B16:AA16');
        
        NOMBRE_CIUDAD = ciudades(14);
        
    case 16 
        
        DATOS = xlsread('BBDD','Hoja1','B17:AA17');
        
        NOMBRE_CIUDAD = ciudades(15);
        
    case 17 
        
        DATOS = xlsread('BBDD','Hoja1','B18:AA18');
        
        NOMBRE_CIUDAD = ciudades(16);
        
    case 18 
        
        DATOS = xlsread('BBDD','Hoja1','B19:AA19');
        
        NOMBRE_CIUDAD = ciudades(17);
   
    case 19 
        
        DATOS = xlsread('BBDD','Hoja1','B20:AA20');
        
        NOMBRE_CIUDAD = ciudades(18);
        
    case 20 
        
        DATOS = xlsread('BBDD','Hoja1','B21:AA21');
        
        NOMBRE_CIUDAD = ciudades(19);
        
    case 21 
        
        DATOS = xlsread('BBDD','Hoja1','B22:AA22');
        
        NOMBRE_CIUDAD = ciudades(20);
        
    case 22 
        
        DATOS = xlsread('BBDD','Hoja1','B23:AA23');  
        
        NOMBRE_CIUDAD = ciudades(21);
        
    case 23 %Jaén
        
        DATOS = xlsread('BBDD','Hoja1','B24:AA24');
        
        NOMBRE_CIUDAD = ciudades(22);
        
    case 24 
        
        DATOS = xlsread('BBDD','Hoja1','B25:AA25');
        
        NOMBRE_CIUDAD = ciudades(23);
        
    case 25 
        
        DATOS = xlsread('BBDD','Hoja1','B26:AA26');
        
        NOMBRE_CIUDAD = ciudades(24);
        
    case 26 
        
        DATOS = xlsread('BBDD','Hoja1','B27:AA27');
        
        NOMBRE_CIUDAD = ciudades(25);
        
    case 27 
        
        DATOS = xlsread('BBDD','Hoja1','B28:AA28');
        
        NOMBRE_CIUDAD = ciudades(26);
        
    case 28 
        
        DATOS = xlsread('BBDD','Hoja1','B29:AA29');
        
        NOMBRE_CIUDAD = ciudades(27);
        
    case 29 
        
        DATOS = xlsread('BBDD','Hoja1','B30:AA30');
        
        NOMBRE_CIUDAD = ciudades(28);
        
    case 30 
        
        DATOS = xlsread('BBDD','Hoja1','B31:AA31');  
        
        NOMBRE_CIUDAD = ciudades(29);
        
    case 31 
        
        DATOS = xlsread('BBDD','Hoja1','B32:AA32');
        
        NOMBRE_CIUDAD = ciudades(30);
        
    case 32 
        
        DATOS = xlsread('BBDD','Hoja1','B33:AA33');
        
        NOMBRE_CIUDAD = ciudades(31);
        
    case 33 
        
        DATOS = xlsread('BBDD','Hoja1','B34:AA34');
        
        NOMBRE_CIUDAD = ciudades(32);
        
    case 34 
        
        DATOS = xlsread('BBDD','Hoja1','B35:AA35');
        
        NOMBRE_CIUDAD = ciudades(33);
        
    case 35 
        
        DATOS = xlsread('BBDD','Hoja1','B36:AA36');   
        
        NOMBRE_CIUDAD = ciudades(34);
        
    case 36 
        
        DATOS = xlsread('BBDD','Hoja1','B37:AA37');
        
        NOMBRE_CIUDAD = ciudades(35);
        
    case 37 
        
        DATOS = xlsread('BBDD','Hoja1','B38:AA38');
        
        NOMBRE_CIUDAD = ciudades(36);
        
    case 38 
        
        DATOS = xlsread('BBDD','Hoja1','B39:AA39');
        
        NOMBRE_CIUDAD = ciudades(37);
        
    case 39 
        
        DATOS = xlsread('BBDD','Hoja1','B40:AA40');
        
        NOMBRE_CIUDAD = ciudades(38);
        
    case 40 
        
        DATOS = xlsread('BBDD','Hoja1','B41:AA41');   
        
        NOMBRE_CIUDAD = ciudades(39);
        
    case 41 
        
        DATOS = xlsread('BBDD','Hoja1','B42:AA42');  
        
        NOMBRE_CIUDAD = ciudades(40);
        
    case 42 
        
        DATOS = xlsread('BBDD','Hoja1','B43:AA43');
        
        NOMBRE_CIUDAD = ciudades(41);
        
    case 43 
        
        DATOS = xlsread('BBDD','Hoja1','B44:AA44');
        
        NOMBRE_CIUDAD = ciudades(42);
        
    case 44 
        
        DATOS = xlsread('BBDD','Hoja1','B45:AA45');
        
        NOMBRE_CIUDAD = ciudades(43);
        
    case 45 
        
        DATOS = xlsread('BBDD','Hoja1','B46:AA46');
        
        NOMBRE_CIUDAD = ciudades(44);
        
    case 46 
        
        DATOS = xlsread('BBDD','Hoja1','B47:AA47');
        
        NOMBRE_CIUDAD = ciudades(45);
        
    case 47 
        
        DATOS = xlsread('BBDD','Hoja1','B48:AA48');
        
        NOMBRE_CIUDAD = ciudades(46);
        
    case 48 
        
        DATOS = xlsread('BBDD','Hoja1','B49:AA49');
        
        NOMBRE_CIUDAD = ciudades(47);
        
    case 49 
        
        DATOS = xlsread('BBDD','Hoja1','B50:AA50');
        
        NOMBRE_CIUDAD = ciudades(48);
        
    case 50 
        
        DATOS = xlsread('BBDD','Hoja1','B51:AA51');  
        
        NOMBRE_CIUDAD = ciudades(49);
        
    case 51 
        
        DATOS = xlsread('BBDD','Hoja1','B52:AA52');
        
        NOMBRE_CIUDAD = ciudades(50);
        
    case 52 
        
        DATOS = xlsread('BBDD','Hoja1','B53:AA53');
        
        NOMBRE_CIUDAD = ciudades(51);
        
    case 53 
        
        DATOS = xlsread('BBDD','Hoja1','B54:AA54');  
        
        NOMBRE_CIUDAD = ciudades(52);
    
        
    %EUROPA----------------------------------------------------------------       
    %54
    case 55 %Amsterdam
        
        DATOS = xlsread('BBDD','Hoja1','B56:AA56');
        
        NOMBRE_CIUDAD = ciudades(53);
       
    case 56 
        
        DATOS = xlsread('BBDD','Hoja1','B57:AA57');
        
        NOMBRE_CIUDAD = ciudades(54);
       
    case 57
        
        DATOS = xlsread('BBDD','Hoja1','B58:AA58');  
        
        NOMBRE_CIUDAD = ciudades(55);
        
    case 58
        
        DATOS = xlsread('BBDD','Hoja1','B59:AA59');
        
        NOMBRE_CIUDAD = ciudades(56);    
        
    case 59
        
        DATOS = xlsread('BBDD','Hoja1','B60:AA60'); 
        
        NOMBRE_CIUDAD = ciudades(57);    
        
    case 60
        
        DATOS = xlsread('BBDD','Hoja1','B61:AA61');
        
        NOMBRE_CIUDAD = ciudades(58);
        
    case 61
        
        DATOS = xlsread('BBDD','Hoja1','B62:AA62');
        
        NOMBRE_CIUDAD = ciudades(59);      
        
    case 62
        
        DATOS = xlsread('BBDD','Hoja1','B63:AA63');
        
        NOMBRE_CIUDAD = ciudades(60);  
        
    case 63
        
        DATOS = xlsread('BBDD','Hoja1','B64:AA64');
          
        NOMBRE_CIUDAD = ciudades(61); 
        
    case 64
        
        DATOS = xlsread('BBDD','Hoja1','B65:AA65'); 
        
        NOMBRE_CIUDAD = ciudades(62);
        
    case 65
        
        DATOS = xlsread('BBDD','Hoja1','B66:AA66');
                
        NOMBRE_CIUDAD = ciudades(63); 
        
    case 66
        
        DATOS = xlsread('BBDD','Hoja1','B67:AA67');
        
        NOMBRE_CIUDAD = ciudades(64);       
        
    case 67
        
        DATOS = xlsread('BBDD','Hoja1','B68:AA68');
        
        NOMBRE_CIUDAD = ciudades(65);           

    case 68
        
        DATOS = xlsread('BBDD','Hoja1','B69:AA69');
        
        NOMBRE_CIUDAD = ciudades(66);  
    
    case 69
        
        DATOS = xlsread('BBDD','Hoja1','B70:AA70');
        
        NOMBRE_CIUDAD = ciudades(67);  
             
    case 70
        
        DATOS = xlsread('BBDD','Hoja1','B71:AA71');
        
        NOMBRE_CIUDAD = ciudades(68);  
      
    case 71
        
        DATOS = xlsread('BBDD','Hoja1','B72:AA72');
        
        NOMBRE_CIUDAD = ciudades(69);
        
    case 72
        
        DATOS = xlsread('BBDD','Hoja1','B73:AA73');
        
        NOMBRE_CIUDAD = ciudades(70);
        
    case 73
        
        DATOS = xlsread('BBDD','Hoja1','B74:AA74');
        
        NOMBRE_CIUDAD = ciudades(71);     
        
    case 74
        
        DATOS = xlsread('BBDD','Hoja1','B75:AA75');
        
        NOMBRE_CIUDAD = ciudades(72);
        
    case 75
        
        DATOS = xlsread('BBDD','Hoja1','B76:AA76');
        
        NOMBRE_CIUDAD = ciudades(73);
        
    case 76
        
        DATOS = xlsread('BBDD','Hoja1','B77:AA77');
        
        NOMBRE_CIUDAD = ciudades(74); 
        
    case 77
        
        DATOS = xlsread('BBDD','Hoja1','B78:AA78');
        
        NOMBRE_CIUDAD = ciudades(75);
        
    case 78 
        
        DATOS = xlsread('BBDD','Hoja1','B79:AA79');
        
        NOMBRE_CIUDAD = ciudades(76);    
      
      
    case 79  %Zagreb   
       
        DATOS = xlsread('BBDD','Hoja1','B80:AA80');
        
        NOMBRE_CIUDAD = ciudades(77);    
    
    %80
    case 81  %Ciudad del Cabo
        
        DATOS = xlsread('BBDD','Hoja1','B82:AA82');
        
        NOMBRE_CIUDAD = ciudades(78); 
       
    case 82
        
        DATOS = xlsread('BBDD','Hoja1','B83:AA83');
        
        NOMBRE_CIUDAD = ciudades(79); 
       
    case 83
        
        DATOS = xlsread('BBDD','Hoja1','B84:AA84');
        
        NOMBRE_CIUDAD = ciudades(80); 
       
    case 84
        
        DATOS = xlsread('BBDD','Hoja1','B85:AA85');
    
        NOMBRE_CIUDAD = ciudades(81); 
        
    case 85
        
        DATOS = xlsread('BBDD','Hoja1','B86:AA86');
        
        NOMBRE_CIUDAD = ciudades(82); 
       
    
    case 86 %Rabat
        
        DATOS = xlsread('BBDD','Hoja1','B87:AA87');
        
        NOMBRE_CIUDAD = ciudades(83);   
    
    %87    
    case 88 %Bagdag
        
        DATOS = xlsread('BBDD','Hoja1','B89:AA89');
        
        NOMBRE_CIUDAD = ciudades(84);   
        
    case 89
        
        DATOS = xlsread('BBDD','Hoja1','B90:AA90');
        
        NOMBRE_CIUDAD = ciudades(85);  
       
    case 90
        
        DATOS = xlsread('BBDD','Hoja1','B91:AA91');
        
        NOMBRE_CIUDAD = ciudades(86);  
       
    case 91
        
        DATOS = xlsread('BBDD','Hoja1','B92:AA92'); 
        
        NOMBRE_CIUDAD = ciudades(87);  
       
    case 92
        
        DATOS = xlsread('BBDD','Hoja1','B93:AA93');
        
        NOMBRE_CIUDAD = ciudades(88);  
 
    %93 94 95
       
    case 96 %Atlanta
        
        DATOS = xlsread('BBDD','Hoja1','B97:AA97');
        
        NOMBRE_CIUDAD = ciudades(89);
    
    case 97 
       
        DATOS = xlsread('BBDD','Hoja1','B98:AA98');
        
        NOMBRE_CIUDAD = ciudades(90);
       
    case 98
        
        DATOS = xlsread('BBDD','Hoja1','B99:AA99');
        
        NOMBRE_CIUDAD = ciudades(91);  
       
    case 99
        
        DATOS = xlsread('BBDD','Hoja1','B100:AA100');
        
        NOMBRE_CIUDAD = ciudades(92); 
    
    case 100
        
        DATOS = xlsread('BBDD','Hoja1','B101:AA101');
        
        NOMBRE_CIUDAD = ciudades(93); 
       
    case 101
        
        DATOS = xlsread('BBDD','Hoja1','B102:AA102');
        
        NOMBRE_CIUDAD = ciudades(94);  
       
    case 102
        
        DATOS = xlsread('BBDD','Hoja1','B103:AA103');
        
        NOMBRE_CIUDAD = ciudades(95);    
        
    case 103
       
       DATOS = xlsread('BBDD','Hoja1','B104:AA104');
        
       NOMBRE_CIUDAD = ciudades(96);    
        
    case 104
        
       DATOS = xlsread('BBDD','Hoja1','B105:AA105');
        
       NOMBRE_CIUDAD = ciudades(97);    
       
    case 105
        
       DATOS = xlsread('BBDD','Hoja1','B106:AA106');
        
       NOMBRE_CIUDAD = ciudades(98);   
        
    case 106
       
       DATOS = xlsread('BBDD','Hoja1','B107:AA107');
        
       NOMBRE_CIUDAD = ciudades(99);     
        
    %107     
    case 108 %Montreal
       
       DATOS = xlsread('BBDD','Hoja1','B109:AA109');
        
       NOMBRE_CIUDAD = ciudades(100);     
        
    case 109
        
       DATOS = xlsread('BBDD','Hoja1','B110:AA110');
        
       NOMBRE_CIUDAD = ciudades(101);     
        
    
    %110    
    case 111 %Ciudad de Mexico
        
       DATOS = xlsread('BBDD','Hoja1','B112:AA112');
        
       NOMBRE_CIUDAD = ciudades(102);     
    
       
    %112      
    case 113 %Bogotá
        
       DATOS = xlsread('BBDD','Hoja1','B114:AA114');
        
       NOMBRE_CIUDAD = ciudades(103);     
        
    case 114
        
       DATOS = xlsread('BBDD','Hoja1','B115:AA115');
        
       NOMBRE_CIUDAD = ciudades(104);    
        
    case 115
       
       DATOS = xlsread('BBDD','Hoja1','B116:AA116');
        
       NOMBRE_CIUDAD = ciudades(105);     
        
    case 116
        
       DATOS = xlsread('BBDD','Hoja1','B117:AA117');
        
       NOMBRE_CIUDAD = ciudades(106);     
        
    case 117
    
       DATOS = xlsread('BBDD','Hoja1','B118:AA118');
        
       NOMBRE_CIUDAD = ciudades(107);     
        
    case 118
      
       DATOS = xlsread('BBDD','Hoja1','B119:AA119');
        
       NOMBRE_CIUDAD = ciudades(108);     
        
    case 119
        
       DATOS = xlsread('BBDD','Hoja1','B120:AA120');
        
       NOMBRE_CIUDAD = ciudades(109);     
        
    case 120
        
       DATOS = xlsread('BBDD','Hoja1','B121:AA121');
        
       NOMBRE_CIUDAD = ciudades(110);     
    
    %121    
    case 122  %La Habana
        
       DATOS = xlsread('BBDD','Hoja1','B123:AA123');
        
       NOMBRE_CIUDAD = ciudades(111);     
        
    case 123
       
       DATOS = xlsread('BBDD','Hoja1','B124:AA124');
        
       NOMBRE_CIUDAD = ciudades(112);     
        
    case 124
        
       DATOS = xlsread('BBDD','Hoja1','B125:AA125');
        
       NOMBRE_CIUDAD = ciudades(113);    
        
    case 125
      
       DATOS = xlsread('BBDD','Hoja1','B126:AA126');
        
       NOMBRE_CIUDAD = ciudades(114);    
       
end

guidata(hObject,handles);

if isempty(DATOS)
    
    
else 
    msgbox('Datos cargados satisfactoriamente');   

%set(handles.Ciudad,'String',NOMBRE_CIUDAD);
    
    %Para activar los botones de los ESTUDIOS:::::::::::::::::::::::::::::::::%
    set(handles.OptimaAnual,'Enable','on');
    set(handles.OptimaEstacional,'Enable','on');
    set(handles.SeguimientoPolar,'Enable','on');
    set(handles.SeguimientoAzimutal,'Enable','on');
    set(handles.SeguimientoHorizontal,'Enable','on');
    set(handles.SeguimientoDosEjes,'Enable','on');
    set(handles.Comparativa,'Enable','on');
    %::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    %CONVERTIR LATITUD:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    lat = DATOS(2); 
    %long =DATOS(1);  %No se necesita.
    %lat = abs(lat_real);   nooooo!!   -- ERROR  
    LAT_RAD = (lat*2*pi)/360;  
    %::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

end
 
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

% hObject    handle to Cargar_Datos (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);



%:::::::::::::::::::::::BOTONES DE INFORMACIÓN::::::::::::::::::::::::::::%
% --- Executes on button press in info_OptAnu.
function info_OptAnu_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Inclinación óptima anual');
set(handles.InformacionGeneral,'String','Para la inclinación óptima anual la superficie está orientada hacia el Sur (en el caso del hemisferio Norte) o hacia el Norte (en el caso del hemisferio Sur). La inclinación es fija durante todo el año para el mejor ángulo posible.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('InclinacionOptAnual.jpg');
axis off;

% hObject    handle to info_OptAnu (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

guidata(hObject, handles);


% --- Executes on button press in info_OptEst.
function info_OptEst_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Inclinación óptima estacional');
set(handles.InformacionGeneral,'String','Para la inclinación óptima estacional la superficie está orientada hacia el Sur (en el caso del hemisferio Norte) o hacia el Norte  (en el caso del hemisferio Sur). La inclinación es fija en cada estación del año, para el mejor ángulo posible en cada caso.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('InclinacionOptEstacional.jpg');
axis off;

% hObject    handle to info_OptAnu (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

guidata(hObject, handles);


% --- Executes on button press in info_SegPol.
function info_SegPol_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje polar');
set(handles.InformacionGeneral,'String','En el seguimiento a un eje polar la superficie gira sobre un eje orientado al Sur e inclinado un ángulo igual a la latitud. El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano terrestre local que contiene al Sol.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('SeguimientoPolar.jpg');
axis off;


% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);


% --- Executes on button press in info_SegAzi.
function info_SegAzi_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje azimutal');
set(handles.InformacionGeneral,'String','El seguimiento a un eje azimutal es aquel en el que la superficie gira sobre un eje vertical, el ángulo de la superficie con respecto al eje de giro es constante e igual a la co-latitud (o ángulo igual a la laititud respecto a la horizontal). El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano terrestre local que contiene al Sol.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('SeguimientoAzimutal.jpg');
axis off;


% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);


% --- Executes on button press in info_SegHor.
function info_SegHor_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje horizontal');
set(handles.InformacionGeneral,'String','El seguimiento a un eje horizontal es en el que la superficie gira en un eje horizontal y orientado en dirección Norte-Sur. El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano terrestre local que contiene al Sol.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('SeguimientoHorizontal.jpg');
axis off;


% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);

% --- Executes on button press in info_Seg2Ej.
function info_Seg2Ej_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a dos ejes');
set(handles.InformacionGeneral,'String','El seguimiento a dos ejes es aquel en el que la superficie gira en un seguidor que en todo momento hace que la normal a la superficie coincida con el meridiano terrestre local que contiene al Sol.');

set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);
imshow('Seguimiento2Ejes.jpg');
axis off;


% hObject    handle to info_Seg2Ej (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);




% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

  Inicio;
  
  close ('OrientSol 3.0');


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


% --- Executes when user attempts to close figure1.
function figure1_CloseRequestFcn(hObject, eventdata, handles)

delete(hObject);
    
        
    
