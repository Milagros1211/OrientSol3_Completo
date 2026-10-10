function varargout = NuevaLocalizacion(varargin)
% NUEVALOCALIZACION MATLAB code for NuevaLocalizacion.fig
%      NUEVALOCALIZACION, by itself, creates a new NUEVALOCALIZACION or raises the existing
%      singleton*.
%
%      H = NUEVALOCALIZACION returns the handle to a new NUEVALOCALIZACION or the handle to
%      the existing singleton*.
%
%      NUEVALOCALIZACION('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in NUEVALOCALIZACION.M with the given input arguments.
%
%      NUEVALOCALIZACION('Property','Value',...) creates a new NUEVALOCALIZACION or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before NuevaLocalizacion_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to NuevaLocalizacion_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help NuevaLocalizacion

% Last Modified by GUIDE v2.5 27-Dec-2014 09:26:48

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @NuevaLocalizacion_OpeningFcn, ...
                   'gui_OutputFcn',  @NuevaLocalizacion_OutputFcn, ...
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


% --- Executes just before NuevaLocalizacion is made visible.
function NuevaLocalizacion_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to NuevaLocalizacion (see VARARGIN)


%Centrar la ventana en la pantalla
movegui(hObject,'center');

% Choose default command line output for NuevaLocalizacion
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes NuevaLocalizacion wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = NuevaLocalizacion_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Continuar.
function Continuar_Callback(hObject, eventdata, handles)

global NOMBRE_CIUDAD DATOS LAT_RAD;
 
% Se almacena el nombre de la CIUDAD
NombreCiudad = get(handles.Ciudad,'String');
NOMBRE_CIUDAD = {NombreCiudad};
 
 
%DATOS es el vector donde se almacenan los valores de longitud, latitud y
%las radiaciones global horizontal. 
DATOS=zeros(1,14);
 
% Se almacena el nombre de la LONGITUD
dat1 = get(handles.Longitud,'String');
dat1= str2double(dat1);
DATOS(1)=dat1;
% Se almacena el nombre de la LATITUD
dat2 = get(handles.Latitud,'String');
dat2 = str2double(dat2);
DATOS(2)=dat2;
%El valor de la latitud se debe pasar a radianes para hacer los cálculos.
    %ERROR EN ORIENTSOL 2   
    %En caso de ser negativo se hace positivo, que es necesario para realizar
    %los cálculos.
    %lat_real = DATOS(2);
    %lat = abs(lat_real);
lat=DATOS(2);
LAT_RAD = (lat*2*pi)/360; 
 
% Se almacenan los Valores de RAD. GLOBAL sobre plano horizontal
dat3 = get(handles.Enero,'String');
dat3 = str2double(dat3);
DATOS(3)=dat3;
 
dat4 = get(handles.Febrero,'String');
dat4 = str2double(dat4);
DATOS(4)=dat4;
 
dat5 = get(handles.Marzo,'String');
dat5 = str2double(dat5);
DATOS(5)=dat5;
 
dat6 = get(handles.Abril,'String');
dat6 = str2double(dat6);
DATOS(6)=dat6;
 
dat7 = get(handles.Mayo,'String');
dat7 = str2double(dat7);
DATOS(7)=dat7;
 
dat8 = get(handles.Junio,'String');
dat8 = str2double(dat8);
DATOS(8)=dat8;
 
dat9 = get(handles.Julio,'String');
dat9 = str2double(dat9);
DATOS(9)=dat9;
 
dat10  = get(handles.Agosto,'String');
dat10  = str2double(dat10);
DATOS(10)=dat10;
 
dat11 = get(handles.Septiembre,'String');
dat11 = str2double(dat11);
DATOS(11)=dat11;
 
dat12 = get(handles.Octubre,'String');
dat12 = str2double(dat12);
DATOS(12)=dat12;
 
dat13 = get(handles.Noviembre,'String');
dat13 = str2double(dat13);
DATOS(13)=dat13;
 
dat14 = get(handles.Diciembre,'String');
dat14 = str2double(dat14);
DATOS(14)=dat14;
 
DATOS(15)=1000;
DATOS(16)=1000;
DATOS(17)=1000;
DATOS(18)=1000;
DATOS(19)=1000;
DATOS(20)=1000;
DATOS(21)=1000;
DATOS(22)=1000;
DATOS(23)=1000;
DATOS(24)=1000;
DATOS(25)=1000;
DATOS(26)=1000;
 
%-------------------------------------------------------------------------%
%MENSAJES DE ERROR
%En caso de existir alguna casilla vacía devolvería un error
error = isnan(DATOS);
for i=2:14
    if error (i) == 1 
        warndlg('Asegúrese de introducir TODOS los datos CORRECTAMENTE antes de continuar','Aviso');
        return
    end
end
for i=3:14
    if DATOS(i)<0
        warndlg('Asegúrese de introducir TODOS los datos CORRECTAMENTE antes de continuar','Aviso');
        return
    end
end
 
if strcmp('',NOMBRE_CIUDAD)
    warndlg('Debe introducir el nombre de la ciudad o localidad','Aviso');
    return
end
 
%En caso de que no se tengan valores de longitud, el programa inserta un 0.
%Como no tiene ningún efecto sobre los cálculos no ocurre nada
if error(1) == 1
    DATOS(1)= 0;
 
end

Principal_N;

close ('OrientSol 3.0 - Introducir los datos manualmente');
% hObject    handle to Continuar (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)



% --- Executes on button press in Ayuda.
function Ayuda_Callback(hObject, eventdata, handles)

Ayuda_NuevaLocalizacion;


% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Principal;
close ('OrientSol 3.0 - Introducir los datos manualmente');
% hObject    handle to Volver (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)









%--------------------------NADA------------------------------------------%
%------------------------------------------------------------------------%
%--------------------------NADA------------------------------------------%
%------------------------------------------------------------------------%
%--------------------------NADA------------------------------------------%
%------------------------------------------------------------------------%
%--------------------------NADA------------------------------------------%

function Enero_Callback(hObject, eventdata, handles)
% hObject    handle to Enero (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Enero as text
%        str2double(get(hObject,'String')) returns contents of Enero as a double


% --- Executes during object creation, after setting all properties.
function Enero_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Enero (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Febrero_Callback(hObject, eventdata, handles)
% hObject    handle to Febrero (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Febrero as text
%        str2double(get(hObject,'String')) returns contents of Febrero as a double


% --- Executes during object creation, after setting all properties.
function Febrero_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Febrero (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Marzo_Callback(hObject, eventdata, handles)
% hObject    handle to Marzo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Marzo as text
%        str2double(get(hObject,'String')) returns contents of Marzo as a double


% --- Executes during object creation, after setting all properties.
function Marzo_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Marzo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Abril_Callback(hObject, eventdata, handles)
% hObject    handle to Abril (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Abril as text
%        str2double(get(hObject,'String')) returns contents of Abril as a double


% --- Executes during object creation, after setting all properties.
function Abril_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Abril (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Mayo_Callback(hObject, eventdata, handles)
% hObject    handle to Mayo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Mayo as text
%        str2double(get(hObject,'String')) returns contents of Mayo as a double


% --- Executes during object creation, after setting all properties.
function Mayo_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Mayo (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Junio_Callback(hObject, eventdata, handles)
% hObject    handle to Junio (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Junio as text
%        str2double(get(hObject,'String')) returns contents of Junio as a double


% --- Executes during object creation, after setting all properties.
function Junio_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Junio (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Julio_Callback(hObject, eventdata, handles)
% hObject    handle to Julio (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Julio as text
%        str2double(get(hObject,'String')) returns contents of Julio as a double


% --- Executes during object creation, after setting all properties.
function Julio_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Julio (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Agosto_Callback(hObject, eventdata, handles)
% hObject    handle to Agosto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Agosto as text
%        str2double(get(hObject,'String')) returns contents of Agosto as a double


% --- Executes during object creation, after setting all properties.
function Agosto_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Agosto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Septiembre_Callback(hObject, eventdata, handles)
% hObject    handle to Septiembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Septiembre as text
%        str2double(get(hObject,'String')) returns contents of Septiembre as a double


% --- Executes during object creation, after setting all properties.
function Septiembre_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Septiembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Octubre_Callback(hObject, eventdata, handles)
% hObject    handle to Octubre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Octubre as text
%        str2double(get(hObject,'String')) returns contents of Octubre as a double


% --- Executes during object creation, after setting all properties.
function Octubre_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Octubre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Noviembre_Callback(hObject, eventdata, handles)
% hObject    handle to Noviembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Noviembre as text
%        str2double(get(hObject,'String')) returns contents of Noviembre as a double


% --- Executes during object creation, after setting all properties.
function Noviembre_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Noviembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Diciembre_Callback(hObject, eventdata, handles)
% hObject    handle to Diciembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Diciembre as text
%        str2double(get(hObject,'String')) returns contents of Diciembre as a double


% --- Executes during object creation, after setting all properties.
function Diciembre_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Diciembre (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Ciudad_Callback(hObject, eventdata, handles)
% hObject    handle to Ciudad (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Ciudad as text
%        str2double(get(hObject,'String')) returns contents of Ciudad as a double


% --- Executes during object creation, after setting all properties.
function Ciudad_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Ciudad (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Latitud_Callback(hObject, eventdata, handles)
% hObject    handle to Latitud (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Latitud as text
%        str2double(get(hObject,'String')) returns contents of Latitud as a double


% --- Executes during object creation, after setting all properties.
function Latitud_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Latitud (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function Longitud_Callback(hObject, eventdata, handles)
% hObject    handle to Longitud (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of Longitud as text
%        str2double(get(hObject,'String')) returns contents of Longitud as a double


% --- Executes during object creation, after setting all properties.
function Longitud_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Longitud (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
