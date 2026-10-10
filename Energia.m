function varargout = Energia(varargin)
% ENERGIA MATLAB code for Energia.fig
%      ENERGIA, by itself, creates a new ENERGIA or raises the existing
%      singleton*.
%
%      H = ENERGIA returns the handle to a new ENERGIA or the handle to
%      the existing singleton*.
%
%      ENERGIA('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in ENERGIA.M with the given input arguments.
%
%      ENERGIA('Property','Value',...) creates a new ENERGIA or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Energia_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Energia_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Energia

% Last Modified by GUIDE v2.5 23-Jan-2015 10:31:09

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Energia_OpeningFcn, ...
                   'gui_OutputFcn',  @Energia_OutputFcn, ...
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


% --- Executes just before Energia is made visible.
function Energia_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Energia (see VARARGIN)
global RADIACION;
global DATOS RADIACION_0;

datos = zeros(1,12);
for i=1:12
    datos(i) = DATOS(i+2);
end
RADIACION_0 = mean(datos);


if DATOS(15) == 1000
   
    %TEMP_MEDIA = get
else
    
    temperaturas = zeros(1,12);
    for i=1:12 
         temperaturas(i)= DATOS(i+14);
    end
    TEMP_MEDIA = mean(temperaturas);
end

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Se muestra el valor de la radiación media anual según el estudio
set(handles.Radiacion,'String',roundn(RADIACION,-2));
%Se muestra el valor de la radiación media anual sobere superficie horizontal
set(handles.Radiacion2,'String',roundn(RADIACION_0,-2));

set(handles.unidades2,'Visible','off');
set(handles.unidades,'Visible','off');

% Choose default command line output for Energia
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Energia wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Energia_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Calcular.
function Calcular_Callback(hObject, eventdata, handles)

global RADIACION;

global RADIACION_0;

set(handles.Panel,'Visible','on');

set(handles.unidades2,'Visible','on');
set(handles.unidades,'Visible','on');

% Se almacena el valor de la potencia
potencia = get(handles.Potencia,'String');
POTENCIA = str2double(potencia);

% Se almacena el valor del PR
pr = get(handles.PR,'String');
PR = str2double(pr);

%MENSAJES DE ERROR
%En caso de existir alguna casilla vacía devolvería un error
error_pot = isnan(POTENCIA);
error_pr = isnan(PR);

    if error_pot == 1 || error_pr ==1 
        warndlg('Asegúrese de introducir TODOS los datos CORRECTAMENTE para calcular.','Aviso');
        return
    end

    if POTENCIA<0
        warndlg('Asegúrese de introducir TODOS los datos CORRECTAMENTE para calcular.','Aviso');
        return
    end
    
    if PR<0 || PR>1
        warndlg('El PR debe estar comprendido entre 0 y 1.,','Aviso');
        return
    end

    
ENERGIA = RADIACION * POTENCIA * 365 * PR;
ENERGIA_0 = RADIACION_0 * POTENCIA * 365 * PR;

DIFERENCIA = ENERGIA - ENERGIA_0;

set(handles.Solucion,'String',roundn(ENERGIA,-2));
set(handles.Solucion2,'String',roundn(ENERGIA_0,-2));
set(handles.Diferencia,'String',roundn(DIFERENCIA,-2));

% hObject    handle to Calcular (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);


% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

close ('OrientSol 3.0 - Cálculo de la energía');
% hObject    handle to Volver (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)



%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%NADA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
function Potencia_Callback(hObject, eventdata, handles)
% hObject    handle to Potencia (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Potencia as text
%        str2double(get(hObject,'String')) returns contents of Potencia as a double
% --- Executes during object creation, after setting all properties.
function Potencia_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Potencia (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
function PR_Callback(hObject, eventdata, handles)
% hObject    handle to PR (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of PR as text
%        str2double(get(hObject,'String')) returns contents of PR as a double
% --- Executes during object creation, after setting all properties.
function PR_CreateFcn(hObject, eventdata, handles)
% hObject    handle to PR (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
