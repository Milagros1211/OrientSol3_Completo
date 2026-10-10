function varargout = AcercaDe(varargin)
% ACERCADE MATLAB code for AcercaDe.fig
%      ACERCADE, by itself, creates a new ACERCADE or raises the existing
%      singleton*.
%
%      H = ACERCADE returns the handle to a new ACERCADE or the handle to
%      the existing singleton*.
%
%      ACERCADE('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in ACERCADE.M with the given input arguments.
%
%      ACERCADE('Property','Value',...) creates a new ACERCADE or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before AcercaDe_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to AcercaDe_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help AcercaDe

% Last Modified by GUIDE v2.5 15-Jan-2015 10:05:29

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @AcercaDe_OpeningFcn, ...
                   'gui_OutputFcn',  @AcercaDe_OutputFcn, ...
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


% --- Executes just before AcercaDe is made visible.
function AcercaDe_OpeningFcn(hObject, eventdata, handles, varargin)

%Centrar la ventana en la pantalla
movegui(hObject,'center');

axes(handles.titulo);
imagen_tit1=imread('Titulo_cabecera.png');
imagen1_tit1=imresize(imagen_tit1,[118 693]); %Para ajustarlo directamente
imshow(imagen1_tit1);
axis off; 


axes(handles.licencia);
imagen_lic=imread('Derechos.png');
imagen1_lic=imresize(imagen_lic,[36 99]); %Para ajustarlo directamente
imshow(imagen1_lic);
axis off; 


% Choose default command line output for AcercaDe
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes AcercaDe wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = AcercaDe_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Cerrar.
function Cerrar_Callback(hObject, eventdata, handles)

close ('Acerca de OrientSol 3.0');
