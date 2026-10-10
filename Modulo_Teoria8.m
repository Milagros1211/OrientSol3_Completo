function varargout = Modulo_Teoria8(varargin)
% MODULO_TEORIA8 MATLAB code for Modulo_Teoria8.fig
%      MODULO_TEORIA8, by itself, creates a new MODULO_TEORIA8 or raises the existing
%      singleton*.
%
%      H = MODULO_TEORIA8 returns the handle to a new MODULO_TEORIA8 or the handle to
%      the existing singleton*.
%
%      MODULO_TEORIA8('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in MODULO_TEORIA8.M with the given input arguments.
%
%      MODULO_TEORIA8('Property','Value',...) creates a new MODULO_TEORIA8 or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Modulo_Teoria8_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Modulo_Teoria8_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Modulo_Teoria8

% Last Modified by GUIDE v2.5 23-Jan-2015 11:59:16

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Modulo_Teoria8_OpeningFcn, ...
                   'gui_OutputFcn',  @Modulo_Teoria8_OutputFcn, ...
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


% --- Executes just before Modulo_Teoria8 is made visible.
function Modulo_Teoria8_OpeningFcn(hObject, eventdata, handles, varargin)

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Botón inicio de casita
cdat=imread('Casita_Inicio.jpg');
set(handles.Inicio, 'CData', cdat);

axes(handles.EsquemaSituaciones);

imagen_calc = imread('TablaSituacionesOptimas.png');%Para ajustarlo directamente
imagen1_calc = imresize(imagen_calc, [380 550]);
imshow(imagen1_calc);
axis off;



% Choose default command line output for Modulo_Teoria8
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Modulo_Teoria8 wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Modulo_Teoria8_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Modulo_Teoria7;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');

% --- Executes on button press in Siguiente.
function Siguiente_Callback(hObject, eventdata, handles)

Modulo_Teoria9;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');

% --- Executes on button press in RadiacionSolar.
function RadiacionSolar_Callback(hObject, eventdata, handles)

Modulo_Teoria1;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');

% --- Executes on button press in ComponentesRadiacion.
function ComponentesRadiacion_Callback(hObject, eventdata, handles)

Modulo_Teoria2;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');


% --- Executes on button press in EstimacionRadiacion.
function EstimacionRadiacion_Callback(hObject, eventdata, handles)

Modulo_Teoria5;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');


% --- Executes on button press in EsquemaSituaciones.
function EsquemaCalculo_Callback(hObject, eventdata, handles)

Modulo_Teoria6;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');



% --- Executes on button press in SituacionesOptimas.
function SituacionesOptimas_Callback(hObject, eventdata, handles)

Modulo_Teoria7;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');

% --- Executes on button press in AprendaUso.
function AprendaUso_Callback(hObject, eventdata, handles)

Modulo_Teoria9;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');


% --- Executes on button press in Inicio.
function Inicio_Callback(hObject, eventdata, handles)

Inicio;

close ('Nociones Básicas - Tabla de inclinaciones y orientaciones');
