function varargout = MapaSolar(varargin)
% MAPASOLAR MATLAB code for MapaSolar.fig
%      MAPASOLAR, by itself, creates a new MAPASOLAR or raises the existing
%      singleton*.
%
%      H = MAPASOLAR returns the handle to a new MAPASOLAR or the handle to
%      the existing singleton*.
%
%      MAPASOLAR('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in MAPASOLAR.M with the given input arguments.
%
%      MAPASOLAR('Property','Value',...) creates a new MAPASOLAR or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before MapaSolar_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to MapaSolar_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help MapaSolar

% Last Modified by GUIDE v2.5 20-Jan-2015 20:26:47

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @MapaSolar_OpeningFcn, ...
                   'gui_OutputFcn',  @MapaSolar_OutputFcn, ...
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


% --- Executes just before MapaSolar is made visible.
function MapaSolar_OpeningFcn(hObject, eventdata, handles, varargin)

%Centrar la ventana en la pantalla
movegui(hObject,'west');

axes(handles.mapa);
imagen_mapa=imread('MapaZN_Color.png');
imagen1=imresize(imagen_mapa,[610 926]); %Para ajustarlo directamente
imshow(imagen1);
axis off;

axes(handles.tabla);
imagen_tabla=imread('MapaZN_Tabla.png');
imagen2=imresize(imagen_tabla,[161 262]); %Para ajustarlo directamente
imshow(imagen2);

axis off;
% Choose default command line output for MapaSolar
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes MapaSolar wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = MapaSolar_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;
