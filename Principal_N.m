function varargout = Principal_N(varargin)
% PRINCIPAL_N MATLAB code for Principal_N.fig
%      PRINCIPAL_N, by itself, creates a new PRINCIPAL_N or raises the existing
%      singleton*.
%
%      H = PRINCIPAL_N returns the handle to a new PRINCIPAL_N or the handle to
%      the existing singleton*.
%
%      PRINCIPAL_N('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in PRINCIPAL_N.M with the given input arguments.
%
%      PRINCIPAL_N('Property','Value',...) creates a new PRINCIPAL_N or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Principal_N_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Principal_N_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Principal_N

% Last Modified by GUIDE v2.5 14-Jan-2015 19:08:07

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Principal_N_OpeningFcn, ...
                   'gui_OutputFcn',  @Principal_N_OutputFcn, ...
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


% --- Executes just before Principal_N is made visible.
function Principal_N_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Principal_N (see VARARGIN)

global NOMBRE_CIUDAD
%Centrar la ventana en la pantalla
movegui(hObject,'center');


%Activar los botones inicialmente:::::::::::::::::::::::::::::::::::::::

    
    set(handles.OptimaAnual,'Enable','on');
    set(handles.OptimaEstacional,'Enable','on');
    set(handles.SeguimientoPolar,'Enable','on');
    set(handles.SeguimientoAzimutal,'Enable','on');
    set(handles.SeguimientoHorizontal,'Enable','on');
    set(handles.SeguimientoDosEjes,'Enable','on');
    set(handles.Comparativa,'Enable','on');

%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


%Indicaciones::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
set(handles.Ciudad,'String',NOMBRE_CIUDAD);
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

% Choose default command line output for Principal_N
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Principal_N wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Principal_N_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


%:::::::::::::::::::::::::OPTIMA ANUAL::::::::::::::::::::::::::::::::::::%
% --- Executes on button press in OptimaAnual.
function OptimaAnual_Callback(hObject, eventdata, handles)

global OPCION_EST

OPCION_EST=1;

CoeficienteCalculos;

% hObject    handle to OptimaAnual (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%


%:::::::::::::::::::::::OPTIMA ESTACIONAL:::::::::::::::::::::::::::::::::%
% --- Executes on button press in OptimaEstacional.
function OptimaEstacional_Callback(hObject, eventdata, handles)

global OPCION_EST;
OPCION_EST=2;

CoeficienteCalculos;

% hObject    handle to OptimaEstacional (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE POLAR:::::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoPolar.
function SeguimientoPolar_Callback(hObject, eventdata, handles)

global OPCION_EST;
OPCION_EST=3;

CoeficienteCalculos;


% hObject    handle to SeguimientoPolar (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE AZIMUTAL::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoAzimutal.
function SeguimientoAzimutal_Callback(hObject, eventdata, handles)

global OPCION_EST
OPCION_EST=4;

CoeficienteCalculos;

% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%::::::::::::::::::::::::::SEG. EJE HORIZONTAL::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoHorizontal.
function SeguimientoHorizontal_Callback(hObject, eventdata, handles)

global OPCION_EST
OPCION_EST=5;

CoeficienteCalculos;

% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%

%::::::::::::::::::::::::::SEG. DOS EJES::::::::::::::::::::::::::::::::::%
% --- Executes on button press in SeguimientoDosEjes.
function SeguimientoDosEjes_Callback(hObject, eventdata, handles)
global OPCION_EST
OPCION_EST=6;

CoeficienteCalculos;
% hObject    handle to SeguimientoDosEjes (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%

%::::::::::::::::::::::::::COMPARATIVA::::::::::::::::::::::::::::::::::::%
% --- Executes on button press in Comparativa.
function Comparativa_Callback(hObject, eventdata, handles)

global OPCION_EST

OPCION_EST=7;

CoeficienteCalculos;
 
% hObject    handle to SeguimientoAzimutal (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);
%:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::%



%:::::::::::::::::::::::BOTONES DE INFORMACIÓN::::::::::::::::::::::::::::%
% --- Executes on button press in info_OptAnu.
function info_OptAnu_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Inclinación óptima anual');
set(handles.InformacionGeneral,'String','Inclinación óptima anual: la superficie está orientada hacia el Sur (en el caso del hemisferio Norte) o hacia el Norte(en el caso del hemisferio Sur). La inclinación es fija durante todo el año para el mejor ángulo posible.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_anu=imread('InclinacionOptAnual.jpg');
imagen1_anu=imresize(imagen_anu,[504 976]); %Para ajustarlo directamente
imshow(imagen1_anu);
axis off;


% hObject    handle to info_OptAnu (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

guidata(hObject, handles);


% --- Executes on button press in info_OptEst.
function info_OptEst_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Inclinación óptima estacional');
set(handles.InformacionGeneral,'String','Inclinación óptima estacional: la superficie está orientada hacia el Sur (en el caso del hemisferio Norte) o hacia el Norte  (en el caso del hemisferio Sur). La inclinación es fija durante todo el año. La inclinación es fija en cada estación del año, para el mejor ángulo posible en cada caso.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_est=imread('InclinacionOptEstacional.jpg');
imagen1_est=imresize(imagen_est,[465 946]); %Para ajustarlo directamente
imshow(imagen1_est);
axis off;


% hObject    handle to info_OptAnu (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

guidata(hObject, handles);


% --- Executes on button press in info_SegPol.
function info_SegPol_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje polar');
set(handles.InformacionGeneral,'String','El seguimiento a un eje polar: la superficie gira sobre un eje orientado al Sur e inclinada un ángulo igual a la latitud. El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano terrestre que contiene al Sol. La velocidad de giro es de 15º por hora, como la del reloj.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_pol=imread('SeguimientoPolar.jpg');
imagen1_pol=imresize(imagen_pol,[513 428]); %Para ajustarlo directamente
imshow(imagen1_pol);
axis off;


% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);


% --- Executes on button press in info_SegAzi.
function info_SegAzi_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje azimutal');
set(handles.InformacionGeneral,'String','El seguimiento a un eje azimutal: la superficie gira sobre un eje vertical, el ángulo de la superficie es constante e igual a la latitud. El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano local que contiene al sol. La velocidad de giro es variable a lo largo del día.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_azi=imread('SeguimientoAzimutal.jpg');
imagen1_azi=imresize(imagen_azi,[520 889]); %Para ajustarlo directamente
imshow(imagen1_azi);
axis off;


% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);


% --- Executes on button press in info_SegHor.
function info_SegHor_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a un eje horizontal');
set(handles.InformacionGeneral,'String','El seguimiento a un eje horizontal: la superficie gira en un eje horizontal y orientada en dirección Norte-Sur. El giro se ajusta para que la normal a la superficie coincida en todo momento con el meridiano terrestre que contiene al Sol.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_hor=imread('SeguimientoHorizontal.jpg');
imagen1_hor=imresize(imagen_hor,[399 1228]); %Para ajustarlo directamente
imshow(imagen1_hor);
axis off;



% hObject    handle to info_SegHor (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);

% --- Executes on button press in info_Seg2Ej.
function info_Seg2Ej_Callback(hObject, eventdata, handles)

set(handles.NombreEstudio,'String','Seguimiento a dos ejes');
set(handles.InformacionGeneral,'String','El seguimiento a dos ejes: la superficie gira en un eje vertical, a su vez el ángulo de la misma varía según la altura solar. El giro se ajusta para que la normal a la superficie coincida en todo momento con el mediano local que contiene al Sol.');

%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_2ejes=imread('Seguimiento2Ejes.jpg');
imagen1_2ejes=imresize(imagen_2ejes,[509 1078]); %Para ajustarlo directamente
imshow(imagen1_2ejes);
axis off;

% hObject    handle to info_Seg2Ej (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);




% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Principal;
close ('OrientSol 3.0 - Ciudad manual');


% --- Executes when user attempts to close figure1.
function figure1_CloseRequestFcn(hObject, eventdata, handles)


delete(hObject);
