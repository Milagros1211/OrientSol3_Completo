function varargout = Ayuda_Energia(varargin)
% AYUDA_ENERGIA MATLAB code for Ayuda_Energia.fig
%      AYUDA_ENERGIA, by itself, creates a new AYUDA_ENERGIA or raises the existing
%      singleton*.
%
%      H = AYUDA_ENERGIA returns the handle to a new AYUDA_ENERGIA or the handle to
%      the existing singleton*.
%
%      AYUDA_ENERGIA('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in AYUDA_ENERGIA.M with the given input arguments.
%
%      AYUDA_ENERGIA('Property','Value',...) creates a new AYUDA_ENERGIA or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Ayuda_Energia_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Ayuda_Energia_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Ayuda_Energia

% Last Modified by GUIDE v2.5 05-Feb-2015 16:28:44

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Ayuda_Energia_OpeningFcn, ...
                   'gui_OutputFcn',  @Ayuda_Energia_OutputFcn, ...
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


% --- Executes just before Ayuda_Energia is made visible.
function Ayuda_Energia_OpeningFcn(hObject, eventdata, handles, varargin)

%Centrar la ventana en la pantalla
movegui(hObject,'east');

axes(handles.Formulas);
imagen_for = imread('Ener_Formulas.PNG');%Para ajustarlo directamente
imagen1_for = imresize(imagen_for, [103 545]);
imshow(imagen1_for);
axis off;

axes(handles.Nomenclatura);
imagen_nom = imread('Ener_Ayu_Nomen.PNG');%Para ajustarlo directamente
imagen1_nom = imresize(imagen_nom, [287 537]);
imshow(imagen1_nom);
axis off;

% Choose default command line output for Ayuda_Energia
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Ayuda_Energia wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Ayuda_Energia_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Cerrar.
function Cerrar_Callback(hObject, eventdata, handles)

close('Información y nomenclatura del método de Osterwald');
