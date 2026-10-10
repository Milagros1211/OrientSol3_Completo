function varargout = Modulo_Teoria7(varargin)
% MODULO_TEORIA7 MATLAB code for Modulo_Teoria7.fig
%      MODULO_TEORIA7, by itself, creates a new MODULO_TEORIA7 or raises the existing
%      singleton*.
%
%      H = MODULO_TEORIA7 returns the handle to a new MODULO_TEORIA7 or the handle to
%      the existing singleton*.
%
%      MODULO_TEORIA7('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in MODULO_TEORIA7.M with the given input arguments.
%
%      MODULO_TEORIA7('Property','Value',...) creates a new MODULO_TEORIA7 or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Modulo_Teoria7_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Modulo_Teoria7_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Modulo_Teoria7

% Last Modified by GUIDE v2.5 23-Jan-2015 11:41:41

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Modulo_Teoria7_OpeningFcn, ...
                   'gui_OutputFcn',  @Modulo_Teoria7_OutputFcn, ...
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


% --- Executes just before Modulo_Teoria7 is made visible.
function Modulo_Teoria7_OpeningFcn(hObject, eventdata, handles, varargin)

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Botón inicio de casita
cdat=imread('Casita_Inicio.jpg');
set(handles.Inicio, 'CData', cdat);

axes(handles.formula);
imagen_for = imread('Formula.png');%Para ajustarlo directamente
imagen1_for = imresize(imagen_for, [34 341]);
imshow(imagen1_for);
axis off;

axes(handles.simbolos);
imagen_sim = imread('Simbolos.png');%Para ajustarlo directamente
imagen1_sim = imresize(imagen_sim, [123 196]);
imshow(imagen1_sim);
axis off;

axes(handles.frase);
imagen_alf = imread('Frase_inc_ori.png');%Para ajustarlo directamente
imagen1_alf = imresize(imagen_alf, [27 645]);
imshow(imagen1_alf);
axis off;

% Choose default command line output for Modulo_Teoria7
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Modulo_Teoria7 wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Modulo_Teoria7_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Modulo_Teoria6;

close ('Nociones Básicas - Situaciones óptimas');

% --- Executes on button press in Siguiente.
function Siguiente_Callback(hObject, eventdata, handles)

Modulo_Teoria8;

close ('Nociones Básicas - Situaciones óptimas');

% --- Executes on button press in RadiacionSolar.
function RadiacionSolar_Callback(hObject, eventdata, handles)

Modulo_Teoria1;

close ('Nociones Básicas - Situaciones óptimas');

% --- Executes on button press in ComponentesRadiacion.
function ComponentesRadiacion_Callback(hObject, eventdata, handles)

Modulo_Teoria2;

close ('Nociones Básicas - Situaciones óptimas');


% --- Executes on button press in EstimacionRadiacion.
function EstimacionRadiacion_Callback(hObject, eventdata, handles)

Modulo_Teoria5;

close ('Nociones Básicas - Situaciones óptimas');


% --- Executes on button press in EsquemaSituaciones.
function EsquemaCalculo_Callback(hObject, eventdata, handles)

Modulo_Teoria6;

close ('Nociones Básicas - Situaciones óptimas');


% --- Executes on button press in SituacionesOptimas.
function SituacionesOptimas_Callback(hObject, eventdata, handles)
%NADA, NO ACTIVO
guidata(hObject, handles);



% --- Executes on button press in AprendaUso.
function AprendaUso_Callback(hObject, eventdata, handles)

Modulo_Teoria9;

close ('Nociones Básicas - Situaciones óptimas');


% --- Executes on button press in Inicio.
function Inicio_Callback(hObject, eventdata, handles)

Inicio;

close ('Nociones Básicas - Situaciones óptimas');
