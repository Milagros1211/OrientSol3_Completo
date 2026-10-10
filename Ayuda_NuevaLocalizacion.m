function varargout = Ayuda_NuevaLocalizacion(varargin)
% AYUDA_NUEVALOCALIZACION MATLAB code for Ayuda_NuevaLocalizacion.fig
%      AYUDA_NUEVALOCALIZACION, by itself, creates a new AYUDA_NUEVALOCALIZACION or raises the existing
%      singleton*.
%
%      H = AYUDA_NUEVALOCALIZACION returns the handle to a new AYUDA_NUEVALOCALIZACION or the handle to
%      the existing singleton*.
%
%      AYUDA_NUEVALOCALIZACION('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in AYUDA_NUEVALOCALIZACION.M with the given input arguments.
%
%      AYUDA_NUEVALOCALIZACION('Property','Value',...) creates a new AYUDA_NUEVALOCALIZACION or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Ayuda_NuevaLocalizacion_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Ayuda_NuevaLocalizacion_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Ayuda_NuevaLocalizacion

% Last Modified by GUIDE v2.5 05-Jan-2015 18:15:14

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Ayuda_NuevaLocalizacion_OpeningFcn, ...
                   'gui_OutputFcn',  @Ayuda_NuevaLocalizacion_OutputFcn, ...
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


% --- Executes just before Ayuda_NuevaLocalizacion is made visible.
function Ayuda_NuevaLocalizacion_OpeningFcn(hObject, eventdata, handles, varargin)


%Centrar la ventana en la pantalla
movegui(hObject,'east');

% Choose default command line output for Ayuda_NuevaLocalizacion
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Ayuda_NuevaLocalizacion wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Ayuda_NuevaLocalizacion_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Mapa.
function Mapa_Callback(hObject, eventdata, handles)

MapaSolar;


% --- Executes on button press in Cerrar.
function Cerrar_Callback(hObject, eventdata, handles)

NuevaLocalizacion;
close('Ayuda');
close('OrientSol 3.0 - Mapa de las zonas climáticas de España');
