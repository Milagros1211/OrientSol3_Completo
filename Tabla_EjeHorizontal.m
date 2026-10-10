function varargout = Tabla_EjeHorizontal(varargin)
% TABLA_EJEHORIZONTAL MATLAB code for Tabla_EjeHorizontal.fig
%      TABLA_EJEHORIZONTAL, by itself, creates a new TABLA_EJEHORIZONTAL or raises the existing
%      singleton*.
%
%      H = TABLA_EJEHORIZONTAL returns the handle to a new TABLA_EJEHORIZONTAL or the handle to
%      the existing singleton*.
%
%      TABLA_EJEHORIZONTAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_EJEHORIZONTAL.M with the given input arguments.
%
%      TABLA_EJEHORIZONTAL('Property','Value',...) creates a new TABLA_EJEHORIZONTAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_EjeHorizontal_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_EjeHorizontal_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_EjeHorizontal

% Last Modified by GUIDE v2.5 22-Jan-2015 17:17:37

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_EjeHorizontal_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_EjeHorizontal_OutputFcn, ...
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


% --- Executes just before Tabla_EjeHorizontal is made visible.
function Tabla_EjeHorizontal_OpeningFcn(hObject, eventdata, handles, varargin)

global OPCION_COMP;

global NOMBRE_CIUDAD DATOS 

global GdEjeHorizontal media_GdEjeHorizontal;
%Ganancias==========================
global PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Mostrar el logotipo
axes(handles.logotipo);
imagen_tit1=imread('Titulo.png');
imagen1_tit1=imresize(imagen_tit1,[30 153]); %Para ajustarlo directamente
imshow(imagen1_tit1);
axis off; 

set(handles.Ciudad,'String',NOMBRE_CIUDAD);
set(handles.Latitud,'String',roundn(DATOS(2),-2));
OPCION_COMP = 1;
%Imagen
set(handles.Esquema,'Visible', 'on');
axes(handles.Esquema);

imagen_hor=imread('SeguimientoHorizontal.jpg');
imagen1_hor=imresize(imagen_hor,[399 1228]); %Para ajustarlo directamente
imshow(imagen1_hor);
axis off;


%TEMPERATURA:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Si hemos llegado hasta aquí introduciendo valores manualmente, NO hay
%temperaturas... 

if (DATOS(15)==1000)
    
    set(handles.Temperatura,'Visible','off');
    %set(handles.T_ene,'Visible','off');  Es blanco, no hace falta
 
      
else   
set(handles.T_ene,'String',roundn(DATOS(15),-2));
set(handles.T_feb,'String',roundn(DATOS(16),-2));
set(handles.T_mar,'String',roundn(DATOS(17),-2));
set(handles.T_abr,'String',roundn(DATOS(18),-2));
set(handles.T_may,'String',roundn(DATOS(19),-2));
set(handles.T_jun,'String',roundn(DATOS(20),-2));
set(handles.T_jul,'String',roundn(DATOS(21),-2));
set(handles.T_ago,'String',roundn(DATOS(22),-2));
set(handles.T_sep,'String',roundn(DATOS(23),-2));
set(handles.T_oct,'String',roundn(DATOS(24),-2));
set(handles.T_nov,'String',roundn(DATOS(25),-2));
set(handles.T_dic,'String',roundn(DATOS(26),-2));

     %Media de las temperaturas para 0º
        sumT = 0;
        for i=15:26
            sumT = sumT + DATOS(i);
        end
        
        mediaT = sumT/12;
        
set(handles.T_media,'String',roundn(mediaT,-2));

end

%RADIACIÓN:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Mostrar valores para inclinación de 0º
    set(handles.C0_ene,'String',roundn(DATOS(3),-2));
    set(handles.C0_feb,'String',roundn(DATOS(4),-2));
    set(handles.C0_mar,'String',roundn(DATOS(5),-2));
    set(handles.C0_abr,'String',roundn(DATOS(6),-2));
    set(handles.C0_may,'String',roundn(DATOS(7),-2));
    set(handles.C0_jun,'String',roundn(DATOS(8),-2));
    set(handles.C0_jul,'String',roundn(DATOS(9),-2));
    set(handles.C0_ago,'String',roundn(DATOS(10),-2));
    set(handles.C0_sep,'String',roundn(DATOS(11),-2));
    set(handles.C0_oct,'String',roundn(DATOS(12),-2));
    set(handles.C0_nov,'String',roundn(DATOS(13),-2));
    set(handles.C0_dic,'String',roundn(DATOS(14),-2));
    
    %Media de las radiaciones para 0º
        sum = 0;
        for i=3:14
            sum = sum + DATOS(i);
        end
        
        media0 = sum/12;
        
    set(handles.C0_media,'String',roundn(media0,-2));

%Mostrar valores para el seguimiento a un eje horizontal
    set(handles.CEjeHor_ene,'String',roundn(GdEjeHorizontal(1),-2));
    set(handles.CEjeHor_feb,'String',roundn(GdEjeHorizontal(2),-2));
    set(handles.CEjeHor_mar,'String',roundn(GdEjeHorizontal(3),-2));
    set(handles.CEjeHor_abr,'String',roundn(GdEjeHorizontal(4),-2));
    set(handles.CEjeHor_may,'String',roundn(GdEjeHorizontal(5),-2));
    set(handles.CEjeHor_jun,'String',roundn(GdEjeHorizontal(6),-2));
    set(handles.CEjeHor_jul,'String',roundn(GdEjeHorizontal(7),-2));
    set(handles.CEjeHor_ago,'String',roundn(GdEjeHorizontal(8),-2));
    set(handles.CEjeHor_sep,'String',roundn(GdEjeHorizontal(9),-2));
    set(handles.CEjeHor_oct,'String',roundn(GdEjeHorizontal(10),-2));
    set(handles.CEjeHor_nov,'String',roundn(GdEjeHorizontal(11),-2));
    set(handles.CEjeHor_dic,'String',roundn(GdEjeHorizontal(12),-2));
    
    set(handles.CEjeHor_media,'String',roundn(media_GdEjeHorizontal,-2));

%GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Mostrar valores de ganancias con respecto al plano horizontal
    set(handles.CGanaHor_0_ene,'String',roundn(PorGanaG_Hor_0(1),-2));
    set(handles.CGanaHor_0_feb,'String',roundn(PorGanaG_Hor_0(2),-2));
    set(handles.CGanaHor_0_mar,'String',roundn(PorGanaG_Hor_0(3),-2));
    set(handles.CGanaHor_0_abr,'String',roundn(PorGanaG_Hor_0(4),-2));
    set(handles.CGanaHor_0_may,'String',roundn(PorGanaG_Hor_0(5),-2));
    set(handles.CGanaHor_0_jun,'String',roundn(PorGanaG_Hor_0(6),-2));
    set(handles.CGanaHor_0_jul,'String',roundn(PorGanaG_Hor_0(7),-2));
    set(handles.CGanaHor_0_ago,'String',roundn(PorGanaG_Hor_0(8),-2));
    set(handles.CGanaHor_0_sep,'String',roundn(PorGanaG_Hor_0(9),-2));
    set(handles.CGanaAzi_0_oct,'String',roundn(PorGanaG_Hor_0(10),-2));
    set(handles.CGanaHor_0_nov,'String',roundn(PorGanaG_Hor_0(11),-2));
    set(handles.CGanaHor_0_dic,'String',roundn(PorGanaG_Hor_0(12),-2));
    
    set(handles.CGanaAzi_0_media,'String',roundn(mean(PorGanaG_Hor_0),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima anual
    set(handles.CGanaHor_Anu_ene,'String',roundn(PorGanaG_Hor_Anu(1),-2));
    set(handles.CGanaHor_Anu_feb,'String',roundn(PorGanaG_Hor_Anu(2),-2));
    set(handles.CGanaHor_Anu_mar,'String',roundn(PorGanaG_Hor_Anu(3),-2));
    set(handles.CGanaHor_Anu_abr,'String',roundn(PorGanaG_Hor_Anu(4),-2));
    set(handles.CGanaHor_Anu_may,'String',roundn(PorGanaG_Hor_Anu(5),-2));
    set(handles.CGanaHor_Anu_jun,'String',roundn(PorGanaG_Hor_Anu(6),-2));
    set(handles.CGanaHor_Anu_jul,'String',roundn(PorGanaG_Hor_Anu(7),-2));
    set(handles.CGanaHor_Anu_ago,'String',roundn(PorGanaG_Hor_Anu(8),-2));
    set(handles.CGanaHor_Anu_sep,'String',roundn(PorGanaG_Hor_Anu(9),-2));
    set(handles.CGanaHor_Anu_oct,'String',roundn(PorGanaG_Hor_Anu(10),-2));
    set(handles.CGanaHor_Anu_nov,'String',roundn(PorGanaG_Hor_Anu(11),-2));
    set(handles.CGanaHor_Anu_dic,'String',roundn(PorGanaG_Hor_Anu(12),-2));
    
    set(handles.CGanaHor_Anu_media,'String',roundn(mean(PorGanaG_Hor_Anu),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima estacional
    set(handles.CGanaHor_Est_ene,'String',roundn(PorGanaG_Hor_Est(1),-2));
    set(handles.CGanaHor_Est_feb,'String',roundn(PorGanaG_Hor_Est(2),-2));
    set(handles.CGanaHor_Est_mar,'String',roundn(PorGanaG_Hor_Est(3),-2));
    set(handles.CGanaHor_Est_abr,'String',roundn(PorGanaG_Hor_Est(4),-2));
    set(handles.CGanaHor_Est_may,'String',roundn(PorGanaG_Hor_Est(5),-2));
    set(handles.CGanaHor_Est_jun,'String',roundn(PorGanaG_Hor_Est(6),-2));
    set(handles.CGanaHor_Est_jul,'String',roundn(PorGanaG_Hor_Est(7),-2));
    set(handles.CGanaHor_Est_ago,'String',roundn(PorGanaG_Hor_Est(8),-2));
    set(handles.CGanaHor_Est_sep,'String',roundn(PorGanaG_Hor_Est(9),-2));
    set(handles.CGanaHor_Est_oct,'String',roundn(PorGanaG_Hor_Est(10),-2));
    set(handles.CGanaHor_Est_nov,'String',roundn(PorGanaG_Hor_Est(11),-2));
    set(handles.CGanaHor_Est_dic,'String',roundn(PorGanaG_Hor_Est(12),-2));
   
    set(handles.CGanaHor_Est_media,'String',roundn(mean(PorGanaG_Hor_Est),-2));
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
    set(handles.CGanaHor_Pol_ene,'String',roundn(PorGanaG_Hor_Pol(1),-2));
    set(handles.CGanaHor_Pol_feb,'String',roundn(PorGanaG_Hor_Pol(2),-2));
    set(handles.CGanaHor_Pol_mar,'String',roundn(PorGanaG_Hor_Pol(3),-2));
    set(handles.CGanaHor_Pol_abr,'String',roundn(PorGanaG_Hor_Pol(4),-2));
    set(handles.CGanaHor_Pol_may,'String',roundn(PorGanaG_Hor_Pol(5),-2));
    set(handles.CGanaHor_Pol_jun,'String',roundn(PorGanaG_Hor_Pol(6),-2));
    set(handles.CGanaHor_Pol_jul,'String',roundn(PorGanaG_Hor_Pol(7),-2));
    set(handles.CGanaHor_Pol_ago,'String',roundn(PorGanaG_Hor_Pol(8),-2));
    set(handles.CGanaHor_Pol_sep,'String',roundn(PorGanaG_Hor_Pol(9),-2));
    set(handles.CGanaHor_Pol_oct,'String',roundn(PorGanaG_Hor_Pol(10),-2));
    set(handles.CGanaAzi_Pol_nov,'String',roundn(PorGanaG_Hor_Pol(11),-2));
    set(handles.CGanaHor_Pol_dic,'String',roundn(PorGanaG_Hor_Pol(12),-2));
    
    set(handles.CGanaHor_Pol_media,'String',roundn(mean(PorGanaG_Hor_Pol),-2));    
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
    set(handles.CGanaHor_Azi_ene,'String',roundn(PorGanaG_Hor_Azi(1),-2));
    set(handles.CGanaHor_Azi_feb,'String',roundn(PorGanaG_Hor_Azi(2),-2));
    set(handles.CGanaHor_Azi_mar,'String',roundn(PorGanaG_Hor_Azi(3),-2));
    set(handles.CGanaHor_Azi_abr,'String',roundn(PorGanaG_Hor_Azi(4),-2));
    set(handles.CGanaHor_Azi_may,'String',roundn(PorGanaG_Hor_Azi(5),-2));
    set(handles.CGanaHor_Azi_jun,'String',roundn(PorGanaG_Hor_Azi(6),-2));
    set(handles.CGanaAzi_Hor_jul,'String',roundn(PorGanaG_Hor_Azi(7),-2));
    set(handles.CGanaHor_Azi_ago,'String',roundn(PorGanaG_Hor_Azi(8),-2));
    set(handles.CGanaHor_Azi_sep,'String',roundn(PorGanaG_Hor_Azi(9),-2));
    set(handles.CGanaHor_Azi_oct,'String',roundn(PorGanaG_Hor_Azi(10),-2));
    set(handles.CGanaHor_Azi_nov,'String',roundn(PorGanaG_Hor_Azi(11),-2));
    set(handles.CGanaHor_Azi_dic,'String',roundn(PorGanaG_Hor_Azi(12),-2));
    
    set(handles.CGanaHor_Azi_media,'String',roundn(mean(PorGanaG_Hor_Azi),-2)); 

% Choose default command line output for Tabla_EjeHorizontal
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_EjeHorizontal wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_EjeHorizontal_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes during object creation, after setting all properties.
function tt_CreateFcn(hObject, eventdata, handles)
% hObject    handle to temperatura (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global OPCION_COMP;

global DATOS Val_Bdm0 Val_Ddm0;

global angulo_optimo;
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;

global BdEjeHorizontal media_BdEjeHorizontal;
global DdEjeHorizontal media_DdEjeHorizontal;
global RdEjeHorizontal media_RdEjeHorizontal;
global GdEjeHorizontal media_GdEjeHorizontal;
%Ganancias==========================
global PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;
global PorGanaB_Hor_0 PorGanaB_Hor_Anu PorGanaB_Hor_Est PorGanaB_Hor_Pol PorGanaB_Hor_Azi;
global PorGanaD_Hor_0 PorGanaD_Hor_Anu PorGanaD_Hor_Est PorGanaD_Hor_Pol PorGanaD_Hor_Azi;
global PorGanaR_Hor_0 PorGanaR_Hor_Anu PorGanaR_Hor_Est PorGanaR_Hor_Pol PorGanaR_Hor_Azi;

Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
        
        OPCION_COMP = 1;
        
        set(handles.titulo,'String','Radiación global media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Gdm (0 º)');
        set(handles.Componente_Eje,'String','Gdm');

        %RADIACIÓN:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores para inclinación de 0º
            set(handles.C0_ene,'String',roundn(DATOS(3),-2));
            set(handles.C0_feb,'String',roundn(DATOS(4),-2));
            set(handles.C0_mar,'String',roundn(DATOS(5),-2));
            set(handles.C0_abr,'String',roundn(DATOS(6),-2));
            set(handles.C0_may,'String',roundn(DATOS(7),-2));
            set(handles.C0_jun,'String',roundn(DATOS(8),-2));
            set(handles.C0_jul,'String',roundn(DATOS(9),-2));
            set(handles.C0_ago,'String',roundn(DATOS(10),-2));
            set(handles.C0_sep,'String',roundn(DATOS(11),-2));
            set(handles.C0_oct,'String',roundn(DATOS(12),-2));
            set(handles.C0_nov,'String',roundn(DATOS(13),-2));
            set(handles.C0_dic,'String',roundn(DATOS(14),-2));

            %Media de las radiaciones para 0º
                sum = 0;
                for i=3:14
                    sum = sum + DATOS(i);
                end

                media0 = sum/12;

            set(handles.C0_media,'String',roundn(media0,-2));

         %Mostrar valores para el seguimiento a un eje horizontal
            set(handles.CEjeHor_ene,'String',roundn(GdEjeHorizontal(1),-2));
            set(handles.CEjeHor_feb,'String',roundn(GdEjeHorizontal(2),-2));
            set(handles.CEjeHor_mar,'String',roundn(GdEjeHorizontal(3),-2));
            set(handles.CEjeHor_abr,'String',roundn(GdEjeHorizontal(4),-2));
            set(handles.CEjeHor_may,'String',roundn(GdEjeHorizontal(5),-2));
            set(handles.CEjeHor_jun,'String',roundn(GdEjeHorizontal(6),-2));
            set(handles.CEjeHor_jul,'String',roundn(GdEjeHorizontal(7),-2));
            set(handles.CEjeHor_ago,'String',roundn(GdEjeHorizontal(8),-2));
            set(handles.CEjeHor_sep,'String',roundn(GdEjeHorizontal(9),-2));
            set(handles.CEjeHor_oct,'String',roundn(GdEjeHorizontal(10),-2));
            set(handles.CEjeHor_nov,'String',roundn(GdEjeHorizontal(11),-2));
            set(handles.CEjeHor_dic,'String',roundn(GdEjeHorizontal(12),-2));

            set(handles.CEjeHor_media,'String',roundn(media_GdEjeHorizontal,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaHor_0_ene,'String',roundn(PorGanaG_Hor_0(1),-2));
            set(handles.CGanaHor_0_feb,'String',roundn(PorGanaG_Hor_0(2),-2));
            set(handles.CGanaHor_0_mar,'String',roundn(PorGanaG_Hor_0(3),-2));
            set(handles.CGanaHor_0_abr,'String',roundn(PorGanaG_Hor_0(4),-2));
            set(handles.CGanaHor_0_may,'String',roundn(PorGanaG_Hor_0(5),-2));
            set(handles.CGanaHor_0_jun,'String',roundn(PorGanaG_Hor_0(6),-2));
            set(handles.CGanaHor_0_jul,'String',roundn(PorGanaG_Hor_0(7),-2));
            set(handles.CGanaHor_0_ago,'String',roundn(PorGanaG_Hor_0(8),-2));
            set(handles.CGanaHor_0_sep,'String',roundn(PorGanaG_Hor_0(9),-2));
            set(handles.CGanaAzi_0_oct,'String',roundn(PorGanaG_Hor_0(10),-2));
            set(handles.CGanaHor_0_nov,'String',roundn(PorGanaG_Hor_0(11),-2));
            set(handles.CGanaHor_0_dic,'String',roundn(PorGanaG_Hor_0(12),-2));

            set(handles.CGanaAzi_0_media,'String',roundn(mean(PorGanaG_Hor_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaHor_Anu_ene,'String',roundn(PorGanaG_Hor_Anu(1),-2));
            set(handles.CGanaHor_Anu_feb,'String',roundn(PorGanaG_Hor_Anu(2),-2));
            set(handles.CGanaHor_Anu_mar,'String',roundn(PorGanaG_Hor_Anu(3),-2));
            set(handles.CGanaHor_Anu_abr,'String',roundn(PorGanaG_Hor_Anu(4),-2));
            set(handles.CGanaHor_Anu_may,'String',roundn(PorGanaG_Hor_Anu(5),-2));
            set(handles.CGanaHor_Anu_jun,'String',roundn(PorGanaG_Hor_Anu(6),-2));
            set(handles.CGanaHor_Anu_jul,'String',roundn(PorGanaG_Hor_Anu(7),-2));
            set(handles.CGanaHor_Anu_ago,'String',roundn(PorGanaG_Hor_Anu(8),-2));
            set(handles.CGanaHor_Anu_sep,'String',roundn(PorGanaG_Hor_Anu(9),-2));
            set(handles.CGanaHor_Anu_oct,'String',roundn(PorGanaG_Hor_Anu(10),-2));
            set(handles.CGanaHor_Anu_nov,'String',roundn(PorGanaG_Hor_Anu(11),-2));
            set(handles.CGanaHor_Anu_dic,'String',roundn(PorGanaG_Hor_Anu(12),-2));

            set(handles.CGanaHor_Anu_media,'String',roundn(mean(PorGanaG_Hor_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaHor_Est_ene,'String',roundn(PorGanaG_Hor_Est(1),-2));
            set(handles.CGanaHor_Est_feb,'String',roundn(PorGanaG_Hor_Est(2),-2));
            set(handles.CGanaHor_Est_mar,'String',roundn(PorGanaG_Hor_Est(3),-2));
            set(handles.CGanaHor_Est_abr,'String',roundn(PorGanaG_Hor_Est(4),-2));
            set(handles.CGanaHor_Est_may,'String',roundn(PorGanaG_Hor_Est(5),-2));
            set(handles.CGanaHor_Est_jun,'String',roundn(PorGanaG_Hor_Est(6),-2));
            set(handles.CGanaHor_Est_jul,'String',roundn(PorGanaG_Hor_Est(7),-2));
            set(handles.CGanaHor_Est_ago,'String',roundn(PorGanaG_Hor_Est(8),-2));
            set(handles.CGanaHor_Est_sep,'String',roundn(PorGanaG_Hor_Est(9),-2));
            set(handles.CGanaHor_Est_oct,'String',roundn(PorGanaG_Hor_Est(10),-2));
            set(handles.CGanaHor_Est_nov,'String',roundn(PorGanaG_Hor_Est(11),-2));
            set(handles.CGanaHor_Est_dic,'String',roundn(PorGanaG_Hor_Est(12),-2));

            set(handles.CGanaHor_Est_media,'String',roundn(mean(PorGanaG_Hor_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGanaHor_Pol_ene,'String',roundn(PorGanaG_Hor_Pol(1),-2));
            set(handles.CGanaHor_Pol_feb,'String',roundn(PorGanaG_Hor_Pol(2),-2));
            set(handles.CGanaHor_Pol_mar,'String',roundn(PorGanaG_Hor_Pol(3),-2));
            set(handles.CGanaHor_Pol_abr,'String',roundn(PorGanaG_Hor_Pol(4),-2));
            set(handles.CGanaHor_Pol_may,'String',roundn(PorGanaG_Hor_Pol(5),-2));
            set(handles.CGanaHor_Pol_jun,'String',roundn(PorGanaG_Hor_Pol(6),-2));
            set(handles.CGanaHor_Pol_jul,'String',roundn(PorGanaG_Hor_Pol(7),-2));
            set(handles.CGanaHor_Pol_ago,'String',roundn(PorGanaG_Hor_Pol(8),-2));
            set(handles.CGanaHor_Pol_sep,'String',roundn(PorGanaG_Hor_Pol(9),-2));
            set(handles.CGanaHor_Pol_oct,'String',roundn(PorGanaG_Hor_Pol(10),-2));
            set(handles.CGanaAzi_Pol_nov,'String',roundn(PorGanaG_Hor_Pol(11),-2));
            set(handles.CGanaHor_Pol_dic,'String',roundn(PorGanaG_Hor_Pol(12),-2));

            set(handles.CGanaHor_Pol_media,'String',roundn(mean(PorGanaG_Hor_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaHor_Azi_ene,'String',roundn(PorGanaG_Hor_Azi(1),-2));
            set(handles.CGanaHor_Azi_feb,'String',roundn(PorGanaG_Hor_Azi(2),-2));
            set(handles.CGanaHor_Azi_mar,'String',roundn(PorGanaG_Hor_Azi(3),-2));
            set(handles.CGanaHor_Azi_abr,'String',roundn(PorGanaG_Hor_Azi(4),-2));
            set(handles.CGanaHor_Azi_may,'String',roundn(PorGanaG_Hor_Azi(5),-2));
            set(handles.CGanaHor_Azi_jun,'String',roundn(PorGanaG_Hor_Azi(6),-2));
            set(handles.CGanaAzi_Hor_jul,'String',roundn(PorGanaG_Hor_Azi(7),-2));
            set(handles.CGanaHor_Azi_ago,'String',roundn(PorGanaG_Hor_Azi(8),-2));
            set(handles.CGanaHor_Azi_sep,'String',roundn(PorGanaG_Hor_Azi(9),-2));
            set(handles.CGanaHor_Azi_oct,'String',roundn(PorGanaG_Hor_Azi(10),-2));
            set(handles.CGanaHor_Azi_nov,'String',roundn(PorGanaG_Hor_Azi(11),-2));
            set(handles.CGanaHor_Azi_dic,'String',roundn(PorGanaG_Hor_Azi(12),-2));

            set(handles.CGanaHor_Azi_media,'String',roundn(mean(PorGanaG_Hor_Azi),-2)); 

        
    case 2 %Directa  
        
        OPCION_COMP = 2;
        
        set(handles.titulo,'String','Radiación directa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Bdm (0 º)');
        set(handles.Componente_Eje,'String','Bdm');

        %RADIACIÓN:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores para inclinación de 0º
            set(handles.C0_ene,'String',roundn(Val_Bdm0(1),-2));
            set(handles.C0_feb,'String',roundn(Val_Bdm0(2),-2));
            set(handles.C0_mar,'String',roundn(Val_Bdm0(3),-2));
            set(handles.C0_abr,'String',roundn(Val_Bdm0(4),-2));
            set(handles.C0_may,'String',roundn(Val_Bdm0(5),-2));
            set(handles.C0_jun,'String',roundn(Val_Bdm0(6),-2));
            set(handles.C0_jul,'String',roundn(Val_Bdm0(7),-2));
            set(handles.C0_ago,'String',roundn(Val_Bdm0(8),-2));
            set(handles.C0_sep,'String',roundn(Val_Bdm0(9),-2));
            set(handles.C0_oct,'String',roundn(Val_Bdm0(10),-2));
            set(handles.C0_nov,'String',roundn(Val_Bdm0(11),-2));
            set(handles.C0_dic,'String',roundn(Val_Bdm0(12),-2));

            %Media de las radiaciones para 0º
            media0_Directa = mean (Val_Bdm0);

            set(handles.C0_media,'String',roundn(media0_Directa,-2));

        %Mostrar valores para el seguimiento a un eje horizontal
            set(handles.CEjeHor_ene,'String',roundn(BdEjeHorizontal(1),-2));
            set(handles.CEjeHor_feb,'String',roundn(BdEjeHorizontal(2),-2));
            set(handles.CEjeHor_mar,'String',roundn(BdEjeHorizontal(3),-2));
            set(handles.CEjeHor_abr,'String',roundn(BdEjeHorizontal(4),-2));
            set(handles.CEjeHor_may,'String',roundn(BdEjeHorizontal(5),-2));
            set(handles.CEjeHor_jun,'String',roundn(BdEjeHorizontal(6),-2));
            set(handles.CEjeHor_jul,'String',roundn(BdEjeHorizontal(7),-2));
            set(handles.CEjeHor_ago,'String',roundn(BdEjeHorizontal(8),-2));
            set(handles.CEjeHor_sep,'String',roundn(BdEjeHorizontal(9),-2));
            set(handles.CEjeHor_oct,'String',roundn(BdEjeHorizontal(10),-2));
            set(handles.CEjeHor_nov,'String',roundn(BdEjeHorizontal(11),-2));
            set(handles.CEjeHor_dic,'String',roundn(BdEjeHorizontal(12),-2));

            set(handles.CEjeHor_media,'String',roundn(media_BdEjeHorizontal,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaHor_0_ene,'String',roundn(PorGanaB_Hor_0(1),-2));
            set(handles.CGanaHor_0_feb,'String',roundn(PorGanaB_Hor_0(2),-2));
            set(handles.CGanaHor_0_mar,'String',roundn(PorGanaB_Hor_0(3),-2));
            set(handles.CGanaHor_0_abr,'String',roundn(PorGanaB_Hor_0(4),-2));
            set(handles.CGanaHor_0_may,'String',roundn(PorGanaB_Hor_0(5),-2));
            set(handles.CGanaHor_0_jun,'String',roundn(PorGanaB_Hor_0(6),-2));
            set(handles.CGanaHor_0_jul,'String',roundn(PorGanaB_Hor_0(7),-2));
            set(handles.CGanaHor_0_ago,'String',roundn(PorGanaB_Hor_0(8),-2));
            set(handles.CGanaHor_0_sep,'String',roundn(PorGanaB_Hor_0(9),-2));
            set(handles.CGanaAzi_0_oct,'String',roundn(PorGanaB_Hor_0(10),-2));
            set(handles.CGanaHor_0_nov,'String',roundn(PorGanaB_Hor_0(11),-2));
            set(handles.CGanaHor_0_dic,'String',roundn(PorGanaB_Hor_0(12),-2));

            set(handles.CGanaAzi_0_media,'String',roundn(mean(PorGanaB_Hor_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaHor_Anu_ene,'String',roundn(PorGanaB_Hor_Anu(1),-2));
            set(handles.CGanaHor_Anu_feb,'String',roundn(PorGanaB_Hor_Anu(2),-2));
            set(handles.CGanaHor_Anu_mar,'String',roundn(PorGanaB_Hor_Anu(3),-2));
            set(handles.CGanaHor_Anu_abr,'String',roundn(PorGanaB_Hor_Anu(4),-2));
            set(handles.CGanaHor_Anu_may,'String',roundn(PorGanaB_Hor_Anu(5),-2));
            set(handles.CGanaHor_Anu_jun,'String',roundn(PorGanaB_Hor_Anu(6),-2));
            set(handles.CGanaHor_Anu_jul,'String',roundn(PorGanaB_Hor_Anu(7),-2));
            set(handles.CGanaHor_Anu_ago,'String',roundn(PorGanaB_Hor_Anu(8),-2));
            set(handles.CGanaHor_Anu_sep,'String',roundn(PorGanaB_Hor_Anu(9),-2));
            set(handles.CGanaHor_Anu_oct,'String',roundn(PorGanaB_Hor_Anu(10),-2));
            set(handles.CGanaHor_Anu_nov,'String',roundn(PorGanaB_Hor_Anu(11),-2));
            set(handles.CGanaHor_Anu_dic,'String',roundn(PorGanaB_Hor_Anu(12),-2));

            set(handles.CGanaHor_Anu_media,'String',roundn(mean(PorGanaB_Hor_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaHor_Est_ene,'String',roundn(PorGanaB_Hor_Est(1),-2));
            set(handles.CGanaHor_Est_feb,'String',roundn(PorGanaB_Hor_Est(2),-2));
            set(handles.CGanaHor_Est_mar,'String',roundn(PorGanaB_Hor_Est(3),-2));
            set(handles.CGanaHor_Est_abr,'String',roundn(PorGanaB_Hor_Est(4),-2));
            set(handles.CGanaHor_Est_may,'String',roundn(PorGanaB_Hor_Est(5),-2));
            set(handles.CGanaHor_Est_jun,'String',roundn(PorGanaB_Hor_Est(6),-2));
            set(handles.CGanaHor_Est_jul,'String',roundn(PorGanaB_Hor_Est(7),-2));
            set(handles.CGanaHor_Est_ago,'String',roundn(PorGanaB_Hor_Est(8),-2));
            set(handles.CGanaHor_Est_sep,'String',roundn(PorGanaB_Hor_Est(9),-2));
            set(handles.CGanaHor_Est_oct,'String',roundn(PorGanaB_Hor_Est(10),-2));
            set(handles.CGanaHor_Est_nov,'String',roundn(PorGanaB_Hor_Est(11),-2));
            set(handles.CGanaHor_Est_dic,'String',roundn(PorGanaB_Hor_Est(12),-2));

            set(handles.CGanaHor_Est_media,'String',roundn(mean(PorGanaB_Hor_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGanaHor_Pol_ene,'String',roundn(PorGanaB_Hor_Pol(1),-2));
            set(handles.CGanaHor_Pol_feb,'String',roundn(PorGanaB_Hor_Pol(2),-2));
            set(handles.CGanaHor_Pol_mar,'String',roundn(PorGanaB_Hor_Pol(3),-2));
            set(handles.CGanaHor_Pol_abr,'String',roundn(PorGanaB_Hor_Pol(4),-2));
            set(handles.CGanaHor_Pol_may,'String',roundn(PorGanaB_Hor_Pol(5),-2));
            set(handles.CGanaHor_Pol_jun,'String',roundn(PorGanaB_Hor_Pol(6),-2));
            set(handles.CGanaHor_Pol_jul,'String',roundn(PorGanaB_Hor_Pol(7),-2));
            set(handles.CGanaHor_Pol_ago,'String',roundn(PorGanaB_Hor_Pol(8),-2));
            set(handles.CGanaHor_Pol_sep,'String',roundn(PorGanaB_Hor_Pol(9),-2));
            set(handles.CGanaHor_Pol_oct,'String',roundn(PorGanaB_Hor_Pol(10),-2));
            set(handles.CGanaAzi_Pol_nov,'String',roundn(PorGanaB_Hor_Pol(11),-2));
            set(handles.CGanaHor_Pol_dic,'String',roundn(PorGanaB_Hor_Pol(12),-2));

            set(handles.CGanaHor_Pol_media,'String',roundn(mean(PorGanaB_Hor_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaHor_Azi_ene,'String',roundn(PorGanaB_Hor_Azi(1),-2));
            set(handles.CGanaHor_Azi_feb,'String',roundn(PorGanaB_Hor_Azi(2),-2));
            set(handles.CGanaHor_Azi_mar,'String',roundn(PorGanaB_Hor_Azi(3),-2));
            set(handles.CGanaHor_Azi_abr,'String',roundn(PorGanaB_Hor_Azi(4),-2));
            set(handles.CGanaHor_Azi_may,'String',roundn(PorGanaB_Hor_Azi(5),-2));
            set(handles.CGanaHor_Azi_jun,'String',roundn(PorGanaB_Hor_Azi(6),-2));
            set(handles.CGanaAzi_Hor_jul,'String',roundn(PorGanaB_Hor_Azi(7),-2));
            set(handles.CGanaHor_Azi_ago,'String',roundn(PorGanaB_Hor_Azi(8),-2));
            set(handles.CGanaHor_Azi_sep,'String',roundn(PorGanaB_Hor_Azi(9),-2));
            set(handles.CGanaHor_Azi_oct,'String',roundn(PorGanaB_Hor_Azi(10),-2));
            set(handles.CGanaHor_Azi_nov,'String',roundn(PorGanaB_Hor_Azi(11),-2));
            set(handles.CGanaHor_Azi_dic,'String',roundn(PorGanaB_Hor_Azi(12),-2));

            set(handles.CGanaHor_Azi_media,'String',roundn(mean(PorGanaB_Hor_Azi),-2)); 
 
        
        
    case 3 %Difusa
        
        OPCION_COMP = 3;
        
        set(handles.titulo,'String','Radiación difusa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Ddm (0 º)');
        set(handles.Componente_Eje,'String','Ddm');
        

        %RADIACIÓN:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores para inclinación de 0º
            set(handles.C0_ene,'String',roundn(Val_Ddm0(1),-2));
            set(handles.C0_feb,'String',roundn(Val_Ddm0(2),-2));
            set(handles.C0_mar,'String',roundn(Val_Ddm0(3),-2));
            set(handles.C0_abr,'String',roundn(Val_Ddm0(4),-2));
            set(handles.C0_may,'String',roundn(Val_Ddm0(5),-2));
            set(handles.C0_jun,'String',roundn(Val_Ddm0(6),-2));
            set(handles.C0_jul,'String',roundn(Val_Ddm0(7),-2));
            set(handles.C0_ago,'String',roundn(Val_Ddm0(8),-2));
            set(handles.C0_sep,'String',roundn(Val_Ddm0(9),-2));
            set(handles.C0_oct,'String',roundn(Val_Ddm0(10),-2));
            set(handles.C0_nov,'String',roundn(Val_Ddm0(11),-2));
            set(handles.C0_dic,'String',roundn(Val_Ddm0(12),-2));

            %Media de las radiaciones para 0º
            media0_Difusa = mean (Val_Ddm0);

            set(handles.C0_media,'String',roundn(media0_Difusa,-2));

     
        %Mostrar valores para el seguimiento a un eje horizontal
            set(handles.CEjeHor_ene,'String',roundn(DdEjeHorizontal(1),-2));
            set(handles.CEjeHor_feb,'String',roundn(DdEjeHorizontal(2),-2));
            set(handles.CEjeHor_mar,'String',roundn(DdEjeHorizontal(3),-2));
            set(handles.CEjeHor_abr,'String',roundn(DdEjeHorizontal(4),-2));
            set(handles.CEjeHor_may,'String',roundn(DdEjeHorizontal(5),-2));
            set(handles.CEjeHor_jun,'String',roundn(DdEjeHorizontal(6),-2));
            set(handles.CEjeHor_jul,'String',roundn(DdEjeHorizontal(7),-2));
            set(handles.CEjeHor_ago,'String',roundn(DdEjeHorizontal(8),-2));
            set(handles.CEjeHor_sep,'String',roundn(DdEjeHorizontal(9),-2));
            set(handles.CEjeHor_oct,'String',roundn(DdEjeHorizontal(10),-2));
            set(handles.CEjeHor_nov,'String',roundn(DdEjeHorizontal(11),-2));
            set(handles.CEjeHor_dic,'String',roundn(DdEjeHorizontal(12),-2));

            set(handles.CEjeHor_media,'String',roundn(media_DdEjeHorizontal,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaHor_0_ene,'String',roundn(PorGanaD_Hor_0(1),-2));
            set(handles.CGanaHor_0_feb,'String',roundn(PorGanaD_Hor_0(2),-2));
            set(handles.CGanaHor_0_mar,'String',roundn(PorGanaD_Hor_0(3),-2));
            set(handles.CGanaHor_0_abr,'String',roundn(PorGanaD_Hor_0(4),-2));
            set(handles.CGanaHor_0_may,'String',roundn(PorGanaD_Hor_0(5),-2));
            set(handles.CGanaHor_0_jun,'String',roundn(PorGanaD_Hor_0(6),-2));
            set(handles.CGanaHor_0_jul,'String',roundn(PorGanaD_Hor_0(7),-2));
            set(handles.CGanaHor_0_ago,'String',roundn(PorGanaD_Hor_0(8),-2));
            set(handles.CGanaHor_0_sep,'String',roundn(PorGanaD_Hor_0(9),-2));
            set(handles.CGanaAzi_0_oct,'String',roundn(PorGanaD_Hor_0(10),-2));
            set(handles.CGanaHor_0_nov,'String',roundn(PorGanaD_Hor_0(11),-2));
            set(handles.CGanaHor_0_dic,'String',roundn(PorGanaD_Hor_0(12),-2));

            set(handles.CGanaAzi_0_media,'String',roundn(mean(PorGanaD_Hor_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaHor_Anu_ene,'String',roundn(PorGanaD_Hor_Anu(1),-2));
            set(handles.CGanaHor_Anu_feb,'String',roundn(PorGanaD_Hor_Anu(2),-2));
            set(handles.CGanaHor_Anu_mar,'String',roundn(PorGanaD_Hor_Anu(3),-2));
            set(handles.CGanaHor_Anu_abr,'String',roundn(PorGanaD_Hor_Anu(4),-2));
            set(handles.CGanaHor_Anu_may,'String',roundn(PorGanaD_Hor_Anu(5),-2));
            set(handles.CGanaHor_Anu_jun,'String',roundn(PorGanaD_Hor_Anu(6),-2));
            set(handles.CGanaHor_Anu_jul,'String',roundn(PorGanaD_Hor_Anu(7),-2));
            set(handles.CGanaHor_Anu_ago,'String',roundn(PorGanaD_Hor_Anu(8),-2));
            set(handles.CGanaHor_Anu_sep,'String',roundn(PorGanaD_Hor_Anu(9),-2));
            set(handles.CGanaHor_Anu_oct,'String',roundn(PorGanaD_Hor_Anu(10),-2));
            set(handles.CGanaHor_Anu_nov,'String',roundn(PorGanaD_Hor_Anu(11),-2));
            set(handles.CGanaHor_Anu_dic,'String',roundn(PorGanaD_Hor_Anu(12),-2));

            set(handles.CGanaHor_Anu_media,'String',roundn(mean(PorGanaD_Hor_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaHor_Est_ene,'String',roundn(PorGanaD_Hor_Est(1),-2));
            set(handles.CGanaHor_Est_feb,'String',roundn(PorGanaD_Hor_Est(2),-2));
            set(handles.CGanaHor_Est_mar,'String',roundn(PorGanaD_Hor_Est(3),-2));
            set(handles.CGanaHor_Est_abr,'String',roundn(PorGanaD_Hor_Est(4),-2));
            set(handles.CGanaHor_Est_may,'String',roundn(PorGanaD_Hor_Est(5),-2));
            set(handles.CGanaHor_Est_jun,'String',roundn(PorGanaD_Hor_Est(6),-2));
            set(handles.CGanaHor_Est_jul,'String',roundn(PorGanaD_Hor_Est(7),-2));
            set(handles.CGanaHor_Est_ago,'String',roundn(PorGanaD_Hor_Est(8),-2));
            set(handles.CGanaHor_Est_sep,'String',roundn(PorGanaD_Hor_Est(9),-2));
            set(handles.CGanaHor_Est_oct,'String',roundn(PorGanaD_Hor_Est(10),-2));
            set(handles.CGanaHor_Est_nov,'String',roundn(PorGanaD_Hor_Est(11),-2));
            set(handles.CGanaHor_Est_dic,'String',roundn(PorGanaD_Hor_Est(12),-2));

            set(handles.CGanaHor_Est_media,'String',roundn(mean(PorGanaD_Hor_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGanaHor_Pol_ene,'String',roundn(PorGanaD_Hor_Pol(1),-2));
            set(handles.CGanaHor_Pol_feb,'String',roundn(PorGanaD_Hor_Pol(2),-2));
            set(handles.CGanaHor_Pol_mar,'String',roundn(PorGanaD_Hor_Pol(3),-2));
            set(handles.CGanaHor_Pol_abr,'String',roundn(PorGanaD_Hor_Pol(4),-2));
            set(handles.CGanaHor_Pol_may,'String',roundn(PorGanaD_Hor_Pol(5),-2));
            set(handles.CGanaHor_Pol_jun,'String',roundn(PorGanaD_Hor_Pol(6),-2));
            set(handles.CGanaHor_Pol_jul,'String',roundn(PorGanaD_Hor_Pol(7),-2));
            set(handles.CGanaHor_Pol_ago,'String',roundn(PorGanaD_Hor_Pol(8),-2));
            set(handles.CGanaHor_Pol_sep,'String',roundn(PorGanaD_Hor_Pol(9),-2));
            set(handles.CGanaHor_Pol_oct,'String',roundn(PorGanaD_Hor_Pol(10),-2));
            set(handles.CGanaAzi_Pol_nov,'String',roundn(PorGanaD_Hor_Pol(11),-2));
            set(handles.CGanaHor_Pol_dic,'String',roundn(PorGanaD_Hor_Pol(12),-2));

            set(handles.CGanaHor_Pol_media,'String',roundn(mean(PorGanaD_Hor_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaHor_Azi_ene,'String',roundn(PorGanaD_Hor_Azi(1),-2));
            set(handles.CGanaHor_Azi_feb,'String',roundn(PorGanaD_Hor_Azi(2),-2));
            set(handles.CGanaHor_Azi_mar,'String',roundn(PorGanaD_Hor_Azi(3),-2));
            set(handles.CGanaHor_Azi_abr,'String',roundn(PorGanaD_Hor_Azi(4),-2));
            set(handles.CGanaHor_Azi_may,'String',roundn(PorGanaD_Hor_Azi(5),-2));
            set(handles.CGanaHor_Azi_jun,'String',roundn(PorGanaD_Hor_Azi(6),-2));
            set(handles.CGanaAzi_Hor_jul,'String',roundn(PorGanaD_Hor_Azi(7),-2));
            set(handles.CGanaHor_Azi_ago,'String',roundn(PorGanaD_Hor_Azi(8),-2));
            set(handles.CGanaHor_Azi_sep,'String',roundn(PorGanaD_Hor_Azi(9),-2));
            set(handles.CGanaHor_Azi_oct,'String',roundn(PorGanaD_Hor_Azi(10),-2));
            set(handles.CGanaHor_Azi_nov,'String',roundn(PorGanaD_Hor_Azi(11),-2));
            set(handles.CGanaHor_Azi_dic,'String',roundn(PorGanaD_Hor_Azi(12),-2));

            set(handles.CGanaHor_Azi_media,'String',roundn(mean(PorGanaD_Hor_Azi),-2)); 
 

    case 4 %Albedo  
        
        OPCION_COMP = 4;
        
        warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_Eje,'String','Rdm');
       
        %RADIACIÓN:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores para inclinación de 0º
            set(handles.C0_ene,'String',0);
            set(handles.C0_feb,'String',0);
            set(handles.C0_mar,'String',0);
            set(handles.C0_abr,'String',0);
            set(handles.C0_may,'String',0);
            set(handles.C0_jun,'String',0);
            set(handles.C0_jul,'String',0);
            set(handles.C0_ago,'String',0);
            set(handles.C0_sep,'String',0);
            set(handles.C0_oct,'String',0);
            set(handles.C0_nov,'String',0);
            set(handles.C0_dic,'String',0);

            %Media de las radiaciones para 0º
            media0_Albedo = 0;

            set(handles.C0_media,'String',roundn(media0_Albedo,-2));

        %Mostrar valores para el seguimiento a un eje horizontal
            set(handles.CEjeHor_ene,'String',roundn(RdEjeHorizontal(1),-2));
            set(handles.CEjeHor_feb,'String',roundn(RdEjeHorizontal(2),-2));
            set(handles.CEjeHor_mar,'String',roundn(RdEjeHorizontal(3),-2));
            set(handles.CEjeHor_abr,'String',roundn(RdEjeHorizontal(4),-2));
            set(handles.CEjeHor_may,'String',roundn(RdEjeHorizontal(5),-2));
            set(handles.CEjeHor_jun,'String',roundn(RdEjeHorizontal(6),-2));
            set(handles.CEjeHor_jul,'String',roundn(RdEjeHorizontal(7),-2));
            set(handles.CEjeHor_ago,'String',roundn(RdEjeHorizontal(8),-2));
            set(handles.CEjeHor_sep,'String',roundn(RdEjeHorizontal(9),-2));
            set(handles.CEjeHor_oct,'String',roundn(RdEjeHorizontal(10),-2));
            set(handles.CEjeHor_nov,'String',roundn(RdEjeHorizontal(11),-2));
            set(handles.CEjeHor_dic,'String',roundn(RdEjeHorizontal(12),-2));

            set(handles.CEjeHor_media,'String',roundn(media_RdEjeHorizontal,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaHor_0_ene,'String', '-');
            set(handles.CGanaHor_0_feb,'String', '-');
            set(handles.CGanaHor_0_mar,'String', '-');
            set(handles.CGanaHor_0_abr,'String', '-');
            set(handles.CGanaHor_0_may,'String', '-');
            set(handles.CGanaHor_0_jun,'String', '-');
            set(handles.CGanaHor_0_jul,'String', '-');
            set(handles.CGanaHor_0_ago,'String', '-');
            set(handles.CGanaHor_0_sep,'String', '-');
            set(handles.CGanaAzi_0_oct,'String', '-');
            set(handles.CGanaHor_0_nov,'String', '-');
            set(handles.CGanaHor_0_dic,'String', '-');

            set(handles.CGanaAzi_0_media,'String', '-');

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
        if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            
            set(handles.CGanaHor_Anu_ene,'String', '-');
            set(handles.CGanaHor_Anu_feb,'String', '-');
            set(handles.CGanaHor_Anu_mar,'String', '-');
            set(handles.CGanaHor_Anu_abr,'String', '-');
            set(handles.CGanaHor_Anu_may,'String', '-');
            set(handles.CGanaHor_Anu_jun,'String', '-');
            set(handles.CGanaHor_Anu_jul,'String', '-');
            set(handles.CGanaHor_Anu_ago,'String', '-');
            set(handles.CGanaHor_Anu_sep,'String', '-');
            set(handles.CGanaHor_Anu_oct,'String', '-');
            set(handles.CGanaHor_Anu_nov,'String', '-');
            set(handles.CGanaHor_Anu_dic,'String', '-');

            set(handles.CGanaHor_Anu_media,'String', '-');
        else
            set(handles.CGanaHor_Anu_ene,'String',roundn(PorGanaR_Hor_Anu(1),-2));
            set(handles.CGanaHor_Anu_feb,'String',roundn(PorGanaR_Hor_Anu(2),-2));
            set(handles.CGanaHor_Anu_mar,'String',roundn(PorGanaR_Hor_Anu(3),-2));
            set(handles.CGanaHor_Anu_abr,'String',roundn(PorGanaR_Hor_Anu(4),-2));
            set(handles.CGanaHor_Anu_may,'String',roundn(PorGanaR_Hor_Anu(5),-2));
            set(handles.CGanaHor_Anu_jun,'String',roundn(PorGanaR_Hor_Anu(6),-2));
            set(handles.CGanaHor_Anu_jul,'String',roundn(PorGanaR_Hor_Anu(7),-2));
            set(handles.CGanaHor_Anu_ago,'String',roundn(PorGanaR_Hor_Anu(8),-2));
            set(handles.CGanaHor_Anu_sep,'String',roundn(PorGanaR_Hor_Anu(9),-2));
            set(handles.CGanaHor_Anu_oct,'String',roundn(PorGanaR_Hor_Anu(10),-2));
            set(handles.CGanaHor_Anu_nov,'String',roundn(PorGanaR_Hor_Anu(11),-2));
            set(handles.CGanaHor_Anu_dic,'String',roundn(PorGanaR_Hor_Anu(12),-2));

            set(handles.CGanaHor_Anu_media,'String',roundn(mean(PorGanaR_Hor_Anu),-2));
        end
        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
        if angOptim_Inv==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaHor_Est_dic,'String', '-');
            set(handles.CGanaHor_Est_ene,'String', '-');
            set(handles.CGanaHor_Est_feb,'String', '-');
        else
            set(handles.CGanaHor_Est_dic,'String',roundn(PorGanaR_Hor_Est(12),-2));
            set(handles.CGanaHor_Est_ene,'String',roundn(PorGanaR_Hor_Est(1),-2));
            set(handles.CGanaHor_Est_feb,'String',roundn(PorGanaR_Hor_Est(2),-2));
        end
        
        if angOptim_Pri==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaHor_Est_mar,'String', '-');
            set(handles.CGanaHor_Est_abr,'String', '-');
            set(handles.CGanaHor_Est_may,'String', '-');
        else
            set(handles.CGanaHor_Est_mar,'String',roundn(PorGanaR_Hor_Est(3),-2));
            set(handles.CGanaHor_Est_abr,'String',roundn(PorGanaR_Hor_Est(4),-2));
            set(handles.CGanaHor_Est_may,'String',roundn(PorGanaR_Hor_Est(5),-2));
        end
        
        if angOptim_Ver==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaHor_Est_jun,'String', '-');
            set(handles.CGanaHor_Est_jul,'String', '-');
            set(handles.CGanaHor_Est_ago,'String', '-');
        else
            set(handles.CGanaHor_Est_jun,'String',roundn(PorGanaR_Hor_Est(6),-2));
            set(handles.CGanaHor_Est_jul,'String',roundn(PorGanaR_Hor_Est(7),-2));
            set(handles.CGanaHor_Est_ago,'String',roundn(PorGanaR_Hor_Est(8),-2));
        end
        
        if angOptim_Oto==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaHor_Est_sep,'String', '-');
            set(handles.CGanaHor_Est_oct,'String', '-');
            set(handles.CGanaHor_Est_nov,'String', '-');
        else
            set(handles.CGanaHor_Est_sep,'String',roundn(PorGanaR_Hor_Est(9),-2));
            set(handles.CGanaHor_Est_oct,'String',roundn(PorGanaR_Hor_Est(10),-2));
            set(handles.CGanaHor_Est_nov,'String',roundn(PorGanaR_Hor_Est(11),-2));
        end
        
        if mean(PorGanaR_Hor_Est)==Inf
            set(handles.CGanaHor_Est_media,'String', '-');
        else
            set(handles.CGanaHor_Est_media,'String',roundn(mean(PorGanaR_Hor_Est),-2));
        end

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGanaHor_Pol_ene,'String',roundn(PorGanaR_Hor_Pol(1),-2));
            set(handles.CGanaHor_Pol_feb,'String',roundn(PorGanaR_Hor_Pol(2),-2));
            set(handles.CGanaHor_Pol_mar,'String',roundn(PorGanaR_Hor_Pol(3),-2));
            set(handles.CGanaHor_Pol_abr,'String',roundn(PorGanaR_Hor_Pol(4),-2));
            set(handles.CGanaHor_Pol_may,'String',roundn(PorGanaR_Hor_Pol(5),-2));
            set(handles.CGanaHor_Pol_jun,'String',roundn(PorGanaR_Hor_Pol(6),-2));
            set(handles.CGanaHor_Pol_jul,'String',roundn(PorGanaR_Hor_Pol(7),-2));
            set(handles.CGanaHor_Pol_ago,'String',roundn(PorGanaR_Hor_Pol(8),-2));
            set(handles.CGanaHor_Pol_sep,'String',roundn(PorGanaR_Hor_Pol(9),-2));
            set(handles.CGanaHor_Pol_oct,'String',roundn(PorGanaR_Hor_Pol(10),-2));
            set(handles.CGanaAzi_Pol_nov,'String',roundn(PorGanaR_Hor_Pol(11),-2));
            set(handles.CGanaHor_Pol_dic,'String',roundn(PorGanaR_Hor_Pol(12),-2));

            set(handles.CGanaHor_Pol_media,'String',roundn(mean(PorGanaR_Hor_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaHor_Azi_ene,'String',roundn(PorGanaR_Hor_Azi(1),-2));
            set(handles.CGanaHor_Azi_feb,'String',roundn(PorGanaR_Hor_Azi(2),-2));
            set(handles.CGanaHor_Azi_mar,'String',roundn(PorGanaR_Hor_Azi(3),-2));
            set(handles.CGanaHor_Azi_abr,'String',roundn(PorGanaR_Hor_Azi(4),-2));
            set(handles.CGanaHor_Azi_may,'String',roundn(PorGanaR_Hor_Azi(5),-2));
            set(handles.CGanaHor_Azi_jun,'String',roundn(PorGanaR_Hor_Azi(6),-2));
            set(handles.CGanaAzi_Hor_jul,'String',roundn(PorGanaR_Hor_Azi(7),-2));
            set(handles.CGanaHor_Azi_ago,'String',roundn(PorGanaR_Hor_Azi(8),-2));
            set(handles.CGanaHor_Azi_sep,'String',roundn(PorGanaR_Hor_Azi(9),-2));
            set(handles.CGanaHor_Azi_oct,'String',roundn(PorGanaR_Hor_Azi(10),-2));
            set(handles.CGanaHor_Azi_nov,'String',roundn(PorGanaR_Hor_Azi(11),-2));
            set(handles.CGanaHor_Azi_dic,'String',roundn(PorGanaR_Hor_Azi(12),-2));

            set(handles.CGanaHor_Azi_media,'String',roundn(mean(PorGanaR_Hor_Azi),-2)); 
            
        
end
% hObject    handle to Componente (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns Componente contents as cell array
%        contents{get(hObject,'Value')} returns selected item from Componente

guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function Componente_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Componente (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on button press in Excel.
function Excel_Callback(hObject, eventdata, handles)

global OPCION_COMP;
global NOMBRE_CIUDAD;

global angulo_optimo;
%Global
global DATOS;
global GdEjeHorizontal media_GdEjeHorizontal;
global GanaG_Hor_0 GanaG_Hor_Anu GanaG_Hor_Est GanaG_Hor_Pol GanaG_Hor_Azi PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;
%Directa
global Val_Bdm0;
global BdEjeHorizontal media_BdEjeHorizontal;
global GanaB_Hor_0 GanaB_Hor_Anu GanaB_Hor_Est GanaB_Hor_Pol GanaB_Hor_Azi PorGanaB_Hor_0 PorGanaB_Hor_Anu PorGanaB_Hor_Est PorGanaB_Hor_Pol PorGanaB_Hor_Azi;
%Difusa
global Val_Ddm0;
global DdEjeHorizontal media_DdEjeHorizontal;
global GanaD_Hor_0 GanaD_Hor_Anu GanaD_Hor_Est GanaD_Hor_Pol GanaD_Hor_Azi PorGanaD_Hor_0 PorGanaD_Hor_Anu PorGanaD_Hor_Est PorGanaD_Hor_Pol PorGanaD_Hor_Azi;
%Albedo
global RdEjeHorizontal media_RdEjeHorizontal;
global GanaR_Hor_Anu GanaR_Hor_Est GanaR_Hor_Pol GanaR_Hor_Azi PorGanaR_Hor_Anu PorGanaR_Hor_Est PorGanaR_Hor_Pol PorGanaR_Hor_Azi;
%ERROR global GanaR_Azi_0 PorGanaR_Azi_0

Meses = {'Enero';'Febrero';'Marzo';'Abril';'Mayo';'Junio';'Julio';'Agosto';'Septiembre';'Octubre';'Noviembre';'Diciembre';'MEDIA'};

%Pregunta
opcion = questdlg('¿Qúe desea exportar a un fichero Excel?', ...
	'Seleccione la opción deseada', ...
	'Sólo la componente visualizada','Todas las componentes','Todas las componentes');

%Respuesta
switch opcion
    
    case 'Sólo la componente visualizada'
       
        [nombre,ruta]=uiputfile({'*.xls'},'Guardar como');
     
        if nombre==0
            return
        end
        
        switch OPCION_COMP
        
            case 1 %Global 
               %RADIACIÓN GLOBAL DIARIA:::::::::::::::::::::::::::::::::::::::::::
               %Cabecera----------------------------------------------------------
                    escribirG(1,1) = NOMBRE_CIUDAD;
                    escribirG(1,2)={'Latitud'};
                    escribirG(1,3)={DATOS(2)};

                    escribirG(1,5)={'Seguimiento a un eje horizontal'};

                    escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirG(j+4,1) = Meses(j);
                    end

                    %Títulos Gdm(0º),  Gdm(Eje Horizontal)-----------------------
                    escribirG(4,2)={'Gdm(0º)'};
                    escribirG(4,3)={'Gdm(Seg. a un eje horizontal)'};


                    %Valores
                    %Gdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirG(k+4,2) = {DATOS(k+2)};
                    end
                    %Media
                          sum = 0;
                          for i=3:14
                             sum = sum + DATOS(i);
                          end

                          media0= sum/12;

                     escribirG(17,2)={media0};     

                    %Gdm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirG(i+4,3) = {GdEjeHorizontal(i)};
                    end
                    %Media
                    escribirG(17,3)={media_GdEjeHorizontal;};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirG(3,6) = {'TEMPERATURA'};
                             escribirG(4,6)={'Temp.(ºC)'};

                            for i=1:12

                                escribirG(i+4,6) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirG(17,6) = {mediaT};

                          end        
                    %Ganancias---------------------------------------------
                    %Meses
                    for j=1:13
                        escribirG(j+22,1) = Meses(j);
                    end
                    %Títulos
                    escribirG(19,2)={'GANANCIAS'};
                    escribirG(20,2)={'Respecto a:'};

                    escribirG(21,2)={'Plano horizontal'};
                    escribirG(21,5)={'Inclinación óptima anual'};
                    escribirG(21,8)={'Incl.  óptima estacional'};
                    escribirG(21,11)={'Seg. a un eje polar'};
                    escribirG(21,14)={'Seg. a un eje azimutal'};

                    escribirG(22,2)={'Fc.Ganancia'};
                    escribirG(22,3)={'Ganancia(%)'};
                    escribirG(22,5)={'Fc.Ganancia'};
                    escribirG(22,6)={'Ganancia(%)'};
                    escribirG(22,8)={'Fc.Ganancia'};
                    escribirG(22,9)={'Ganancia(%)'};
                    escribirG(22,11)={'Fc.Ganancia'};
                    escribirG(22,12)={'Ganancia(%)'};
                    escribirG(22,14)={'Fc.Ganancia'};
                    escribirG(22,15)={'Ganancia(%)'};

                    %Valores
                    %Plano horizontal--------------------------
                    for i=1:12
                        escribirG(i+22,2)={GanaG_Hor_0(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,3)={PorGanaG_Hor_0(i)};
                    end 
                    %medias
                    escribirG(35,2)={mean(GanaG_Hor_0)};
                    escribirG(35,3)={mean(PorGanaG_Hor_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirG(i+22,5)={GanaG_Hor_Anu(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,6)={PorGanaG_Hor_Anu(i)};
                    end
                    %medias
                    escribirG(35,5)={mean(GanaG_Hor_Anu)};
                    escribirG(35,6)={mean(PorGanaG_Hor_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirG(i+22,8)={GanaG_Hor_Est(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,9)={PorGanaG_Hor_Est(i)};
                    end
                    %medias
                    escribirG(35,8)={mean(GanaG_Hor_Est)};
                    escribirG(35,9)={mean(PorGanaG_Hor_Est)};

                    %Seguimiento Polar----------------------
                    for i=1:12
                        escribirG(i+22,11)={GanaG_Hor_Pol(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,12)={PorGanaG_Hor_Pol(i)};
                    end
                    %medias
                    escribirG(35,11)={mean(GanaG_Hor_Pol)};
                    escribirG(35,12)={mean(PorGanaG_Hor_Pol)};

                    %Seguimiento Azimutal--------------------
                    for i=1:12
                        escribirG(i+22,14)={GanaG_Hor_Azi(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,15)={PorGanaG_Hor_Azi(i)};
                    end
                    %medias
                    escribirG(35,14)={mean(GanaG_Hor_Azi)};
                    escribirG(35,15)={mean(PorGanaG_Hor_Azi)};
                    
               %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
               xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
               %Aviso
               msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
               
            case 2 %Directa
               %RADIACIÓN DIRECTA DIARIA:::::::::::::::::::::::::::::::::::::::::::
               %Cabecera----------------------------------------------------------
                    escribirB(1,1) = NOMBRE_CIUDAD;
                    escribirB(1,2)={'Latitud'};
                    escribirB(1,3)={DATOS(2)};

                    escribirB(1,5)={'Seguimiento a un eje horizontal'};

                    escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirB(j+4,1) = Meses(j);
                    end

                    %Títulos Bdm(0º),  Bdm(Eje Horizontal)---------------------------
                    escribirB(4,2)={'Bdm(0º)'};
                    escribirB(4,3)={'Bdm(Seg. a un eje horizontal)'};


                    %Valores
                    %Gdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirB(k+4,2) = {Val_Bdm0(k)};
                    end
                    %Media
                    escribirB(17,2)={mean(Val_Bdm0)};     

                    %Bdm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirB(i+4,3) = {BdEjeHorizontal(i)};
                    end
                    %Media
                    escribirB(17,3)={media_BdEjeHorizontal};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirB(3,6) = {'TEMPERATURA'};
                             escribirB(4,6)={'Temp.(ºC)'};

                            for i=1:12

                                escribirB(i+4,6) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirB(17,6) = {mediaT};

                          end        
                    %Ganancias---------------------------------------------
                    %Meses
                    for j=1:13
                        escribirB(j+22,1) = Meses(j);
                    end
                    %Títulos
                    escribirB(19,2)={'GANANCIAS'};
                    escribirB(20,2)={'Respecto a:'};

                    escribirB(21,2)={'Plano horizontal'};
                    escribirB(21,5)={'Inclinación óptima anual'};
                    escribirB(21,8)={'Incl.  óptima estacional'};
                    escribirB(21,11)={'Seg. a un eje polar'};
                    escribirB(21,14)={'Seg. a un eje azimutal'};

                    escribirB(22,2)={'Fc.Ganancia'};
                    escribirB(22,3)={'Ganancia(%)'};
                    escribirB(22,5)={'Fc.Ganancia'};
                    escribirB(22,6)={'Ganancia(%)'};
                    escribirB(22,8)={'Fc.Ganancia'};
                    escribirB(22,9)={'Ganancia(%)'};
                    escribirB(22,11)={'Fc.Ganancia'};
                    escribirB(22,12)={'Ganancia(%)'};
                    escribirB(22,14)={'Fc.Ganancia'};
                    escribirB(22,15)={'Ganancia(%)'};

                    %Valores
                    %Plano horizontal--------------------------
                    for i=1:12
                        escribirB(i+22,2)={GanaB_Hor_0(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,3)={PorGanaB_Hor_0(i)};
                    end 
                    %medias
                    escribirB(35,2)={mean(GanaB_Hor_0)};
                    escribirB(35,3)={mean(PorGanaB_Hor_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirB(i+22,5)={GanaB_Hor_Anu(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,6)={PorGanaB_Hor_Anu(i)};
                    end
                    %medias
                    escribirB(35,5)={mean(GanaB_Hor_Anu)};
                    escribirB(35,6)={mean(PorGanaB_Hor_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirB(i+22,8)={GanaB_Hor_Est(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,9)={PorGanaB_Hor_Est(i)};
                    end
                    %medias
                    escribirB(35,8)={mean(GanaB_Hor_Est)};
                    escribirB(35,9)={mean(PorGanaB_Hor_Est)};

                    %Seguimiento Polar----------------------
                    for i=1:12
                        escribirB(i+22,11)={GanaB_Hor_Pol(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,12)={PorGanaB_Hor_Pol(i)};
                    end
                    %medias
                    escribirB(35,11)={mean(GanaB_Hor_Pol)};
                    escribirB(35,12)={mean(PorGanaB_Hor_Pol)};

                    %Seguimiento Azimutal--------------------
                    for i=1:12
                        escribirB(i+22,14)={GanaB_Hor_Azi(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,15)={PorGanaB_Hor_Azi(i)};
                    end
                    %medias
                    escribirB(35,14)={mean(GanaB_Hor_Azi)};
                    escribirB(35,15)={mean(PorGanaB_Hor_Azi)};                 
               
               
               
               %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
               xlswrite(fullfile(ruta,nombre),escribirB,'Hoja1','A1');
               %Aviso
               msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
               
            case 3 %Difusa
               %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
               %Cabecera---------------------------------------------------------- 
                    escribirD(1,1) = NOMBRE_CIUDAD;
                    escribirD(1,2)={'Latitud'};
                    escribirD(1,3)={DATOS(2)};

                    escribirD(1,5)={'Seguimiento a un eje horizontal'};

                    escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirD(j+4,1) = Meses(j);
                    end

                    %Títulos Ddm(0º),  Ddm(Eje Horizontal)---------------------------
                    escribirD(4,2)={'Ddm(0º)'};
                    escribirD(4,3)={'Ddm(Seg. a un eje horizontal)'};


                    %Valores
                    %Ddm (0º)--------------------------------------------------
                    for k=1:12
                        escribirD(k+4,2) = {Val_Ddm0(k)};
                    end
                    %Media
                    escribirD(17,2)={mean(Val_Ddm0)};     

                    %Ddm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirD(i+4,3) = {DdEjeHorizontal(i)};
                    end
                    %Media
                    escribirD(17,3)={media_DdEjeHorizontal};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirD(3,6) = {'TEMPERATURA'};
                             escribirD(4,6)={'Temp.(ºC)'};

                            for i=1:12

                                escribirD(i+4,6) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirD(17,6) = {mediaT};

                          end        
                    %Ganancias---------------------------------------------
                    %Meses
                    for j=1:13
                        escribirD(j+22,1) = Meses(j);
                    end
                    %Títulos
                    escribirD(19,2)={'GANANCIAS'};
                    escribirD(20,2)={'Respecto a:'};

                    escribirD(21,2)={'Plano horizontal'};
                    escribirD(21,5)={'Inclinación óptima anual'};
                    escribirD(21,8)={'Incl.  óptima estacional'};
                    escribirD(21,11)={'Seg. a un eje polar'};
                    escribirD(21,14)={'Seg. a un eje azimutal'};

                    escribirD(22,2)={'Fc.Ganancia'};
                    escribirD(22,3)={'Ganancia(%)'};
                    escribirD(22,5)={'Fc.Ganancia'};
                    escribirD(22,6)={'Ganancia(%)'};
                    escribirD(22,8)={'Fc.Ganancia'};
                    escribirD(22,9)={'Ganancia(%)'};
                    escribirD(22,11)={'Fc.Ganancia'};
                    escribirD(22,12)={'Ganancia(%)'};
                    escribirD(22,14)={'Fc.Ganancia'};
                    escribirD(22,15)={'Ganancia(%)'};

                    %Valores
                    %Plano horizontal--------------------------
                    for i=1:12
                        escribirD(i+22,2)={GanaD_Hor_0(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,3)={PorGanaD_Hor_0(i)};
                    end 
                    %medias
                    escribirD(35,2)={mean(GanaD_Hor_0)};
                    escribirD(35,3)={mean(PorGanaD_Hor_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirD(i+22,5)={GanaD_Hor_Anu(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,6)={PorGanaD_Hor_Anu(i)};
                    end
                    %medias
                    escribirD(35,5)={mean(GanaD_Hor_Anu)};
                    escribirD(35,6)={mean(PorGanaD_Hor_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirD(i+22,8)={GanaD_Hor_Est(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,9)={PorGanaD_Hor_Est(i)};
                    end
                    %medias
                    escribirD(35,8)={mean(GanaD_Hor_Est)};
                    escribirD(35,9)={mean(PorGanaD_Hor_Est)};

                    %Seguimiento Polar----------------------
                    for i=1:12
                        escribirD(i+22,11)={GanaD_Hor_Pol(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,12)={PorGanaD_Hor_Pol(i)};
                    end
                    %medias
                    escribirD(35,11)={mean(GanaD_Hor_Pol)};
                    escribirD(35,12)={mean(PorGanaD_Hor_Pol)};

                    %Seguimiento Azimutal--------------------
                    for i=1:12
                        escribirD(i+22,14)={GanaD_Hor_Azi(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,15)={PorGanaD_Hor_Azi(i)};
                    end
                    %medias
                    escribirD(35,14)={mean(GanaD_Hor_Azi)};
                    escribirD(35,15)={mean(PorGanaD_Hor_Azi)};  
               
               
               
               %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
               xlswrite(fullfile(ruta,nombre),escribirD,'Hoja1','A1');
               %Aviso
               msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
               
            case 4 %Albedo
               %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
               %Cabecera----------------------------------------------------------
                    escribirR(1,1) = NOMBRE_CIUDAD;
                    escribirR(1,2)={'Latitud'};
                    escribirR(1,3)={DATOS(2)};

                    escribirR(1,5)={'Seguimiento a un eje horizontal'};

                    escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirR(j+4,1) = Meses(j);
                    end

                    %Títulos Rdm(0º),  Rdm(Eje Horizontal)---------------------------
                    escribirR(4,2)={'Rdm(0º)'};
                    escribirR(4,3)={'Rdm(Seg. a un eje horizontal)'};


                    %Valores
                    %Rdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirR(k+4,2) = {0};
                    end
                    %Media
                    escribirR(17,2)={0};     

                    %Rdm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirR(i+4,3) = {RdEjeHorizontal(i)};
                    end
                    %Media
                    escribirR(17,3)={media_RdEjeHorizontal};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirR(3,6) = {'TEMPERATURA'};
                             escribirR(4,6)={'Temp.(ºC)'};

                            for i=1:12

                                escribirR(i+4,6) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirR(17,6) = {mediaT};

                          end        
                    %Ganancias---------------------------------------------
                    %Meses
                    for j=1:13
                        escribirR(j+22,1) = Meses(j);
                    end
                    %Títulos
                    escribirR(19,2)={'GANANCIAS'};
                    escribirR(20,2)={'Respecto a:'};

                    escribirR(21,2)={'Plano horizontal'};
                    escribirR(21,5)={'Inclinación óptima anual'};
                    escribirR(21,8)={'Incl.  óptima estacional'};
                    escribirR(21,11)={'Seg. a un eje polar'};
                    escribirR(21,14)={'Seg. a un eje azimutal'};

                    escribirR(22,2)={'Fc.Ganancia'};
                    escribirR(22,3)={'Ganancia(%)'};
                    escribirR(22,5)={'Fc.Ganancia'};
                    escribirR(22,6)={'Ganancia(%)'};
                    escribirR(22,8)={'Fc.Ganancia'};
                    escribirR(22,9)={'Ganancia(%)'};
                    escribirR(22,11)={'Fc.Ganancia'};
                    escribirR(22,12)={'Ganancia(%)'};
                    escribirR(22,14)={'Fc.Ganancia'};
                    escribirR(22,15)={'Ganancia(%)'};

                    %Valores
                    %Plano horizontal--------------------------
                    for i=1:12
                        escribirR(i+22,2)={'-'};
                    end 
                    for i=1:12
                        escribirR(i+22,3)={'-'};
                    end 
                    %medias
                    escribirR(35,2)={'-'};
                    escribirR(35,3)={'-'};
                    %Inclinación óptima anual------------------
                    if angulo_optimo == 0    %sería para Rdm(0º) --- Inf   
                        for i=1:12
                            escribirR(i+22,5)={'-'};
                        end 
                        for i=1:12
                            escribirR(i+22,6)={'-'};
                        end
                        %medias
                        escribirR(35,5)={'-'};
                        escribirR(35,6)={'-'};
                    else
                        for i=1:12
                            escribirR(i+22,5)={GanaR_Hor_Anu(i)};
                        end 
                        for i=1:12
                            escribirR(i+22,6)={PorGanaR_Hor_Anu(i)};
                        end
                        %medias
                        escribirR(35,5)={mean(GanaR_Hor_Anu)};
                        escribirR(35,6)={mean(PorGanaR_Hor_Anu)};
                    end

                    %Inclinación óptima estacional------(-------(CAMBIO)-------)-----
                    for i=1:12
                        if GanaR_Hor_Est(i)== Inf
                            escribirR(i+22,8)={'-'};
                        else
                        escribirR(i+22,8)={GanaR_Hor_Est(i)};
                        end 
                    end
                    for i=1:12
                        if GanaR_Hor_Est(i)== Inf
                            escribirR(i+22,9)={'-'};
                        else
                        escribirR(i+22,9)={PorGanaR_Hor_Est(i)};
                        end
                    end
                    %medias
                    if mean(GanaR_Hor_Est)==Inf
                        escribirR(35,8)={'-'};
                        escribirR(35,9)={'-'};
                    else
                    escribirR(35,8)={mean(GanaR_Hor_Est)};
                    escribirR(35,9)={mean(PorGanaR_Hor_Est)};
                    end
                    %Seguimiento Polar----------------------
                    for i=1:12
                        escribirR(i+22,11)={GanaR_Hor_Pol(i)};
                    end 
                    for i=1:12
                        escribirR(i+22,12)={PorGanaR_Hor_Pol(i)};
                    end
                    %medias
                    escribirR(35,11)={mean(GanaR_Hor_Pol)};
                    escribirR(35,12)={mean(PorGanaR_Hor_Pol)};

                    %Seguimiento Azimutal--------------------
                    for i=1:12
                        escribirR(i+22,14)={GanaR_Hor_Azi(i)};
                    end 
                    for i=1:12
                        escribirR(i+22,15)={PorGanaR_Hor_Azi(i)};
                    end
                    %medias
                    escribirR(35,14)={mean(GanaR_Hor_Azi)};
                    escribirR(35,15)={mean(PorGanaR_Hor_Azi)};   
               
               
               %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
               xlswrite(fullfile(ruta,nombre),escribirR,'Hoja1','A1');  
               %Aviso
               msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
        end
        
     case 'Todas las componentes'
        
         [nombre,ruta]=uiputfile({'*.xls'},'Guardar como');

         if nombre==0
             return
         end

        %En la matriz "EscribirG" se almacenan todos los datos para radiación GLOBAL
        %En la matriz "EscribirB" se almacenan todos los datos para radiación DIRECTA
        %En la matriz "EscribirD" se almacenan todos los datos para radiación DIFUSA
        %En la matriz "EscribirR" se almacenan todos los datos para radiación DE ALBEDO

        %GLOBAL::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN GLOBAL DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirG(1,1) = NOMBRE_CIUDAD;
        escribirG(1,2)={'Latitud'};
        escribirG(1,3)={DATOS(2)};
        
        escribirG(1,5)={'Seguimiento a un eje horizontal'};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirG(j+4,1) = Meses(j);
        end
        
        %Títulos Gdm(0º),  Gdm(Eje Horizontal)---------------------------
        escribirG(4,2)={'Gdm(0º)'};
        escribirG(4,3)={'Gdm(Seg. a un eje horizontal)'};
        
        
        %Valores
        %Gdm (0º)--------------------------------------------------
        for k=1:12
            escribirG(k+4,2) = {DATOS(k+2)};
        end
        %Media
              sum = 0;
              for i=3:14
                 sum = sum + DATOS(i);
              end

              media0= sum/12;
         
         escribirG(17,2)={media0};     
              
        %Gdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirG(i+4,3) = {GdEjeHorizontal(i)};
        end
        %Media
        escribirG(17,3)={media_GdEjeHorizontal};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirG(3,6) = {'TEMPERATURA'};
                 escribirG(4,6)={'Temp.(ºC)'};

                for i=1:12

                    escribirG(i+4,6) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirG(17,6) = {mediaT};

              end        
        %Ganancias---------------------------------------------
        %Meses
        for j=1:13
            escribirG(j+22,1) = Meses(j);
        end
        %Títulos
        escribirG(19,2)={'GANANCIAS'};
        escribirG(20,2)={'Respecto a:'};
        
        escribirG(21,2)={'Plano horizontal'};
        escribirG(21,5)={'Inclinación óptima anual'};
        escribirG(21,8)={'Incl.  óptima estacional'};
        escribirG(21,11)={'Seg. a un eje polar'};
        escribirG(21,14)={'Seg. a un eje azimutal'};
        
        escribirG(22,2)={'Fc.Ganancia'};
        escribirG(22,3)={'Ganancia(%)'};
        escribirG(22,5)={'Fc.Ganancia'};
        escribirG(22,6)={'Ganancia(%)'};
        escribirG(22,8)={'Fc.Ganancia'};
        escribirG(22,9)={'Ganancia(%)'};
        escribirG(22,11)={'Fc.Ganancia'};
        escribirG(22,12)={'Ganancia(%)'};
        escribirG(22,14)={'Fc.Ganancia'};
        escribirG(22,15)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirG(i+22,2)={GanaG_Hor_0(i)};
        end 
        for i=1:12
            escribirG(i+22,3)={PorGanaG_Hor_0(i)};
        end 
        %medias
        escribirG(35,2)={mean(GanaG_Hor_0)};
        escribirG(35,3)={mean(PorGanaG_Hor_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirG(i+22,5)={GanaG_Hor_Anu(i)};
        end 
        for i=1:12
            escribirG(i+22,6)={PorGanaG_Hor_Anu(i)};
        end
        %medias
        escribirG(35,5)={mean(GanaG_Hor_Anu)};
        escribirG(35,6)={mean(PorGanaG_Hor_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirG(i+22,8)={GanaG_Hor_Est(i)};
        end 
        for i=1:12
            escribirG(i+22,9)={PorGanaG_Hor_Est(i)};
        end
        %medias
        escribirG(35,8)={mean(GanaG_Hor_Est)};
        escribirG(35,9)={mean(PorGanaG_Hor_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirG(i+22,11)={GanaG_Hor_Pol(i)};
        end 
        for i=1:12
            escribirG(i+22,12)={PorGanaG_Hor_Pol(i)};
        end
        %medias
        escribirG(35,11)={mean(GanaG_Hor_Pol)};
        escribirG(35,12)={mean(PorGanaG_Hor_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirG(i+22,14)={GanaG_Hor_Azi(i)};
        end 
        for i=1:12
            escribirG(i+22,15)={PorGanaG_Hor_Azi(i)};
        end
        %medias
        escribirG(35,14)={mean(GanaG_Hor_Azi)};
        escribirG(35,15)={mean(PorGanaG_Hor_Azi)};
        
        %RADIACIÓN DIRECTA DIARIA::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Seguimiento a un eje horizontal'};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirB(j+4,1) = Meses(j);
        end
        
        %Títulos Bdm(0º),  Bdm(Eje Horizontal)---------------------------
        escribirB(4,2)={'Bdm(0º)'};
        escribirB(4,3)={'Bdm(Seg. a un eje horizontal)'};
        
        
        %Valores
        %Gdm (0º)--------------------------------------------------
        for k=1:12
            escribirB(k+4,2) = {Val_Bdm0(k)};
        end
        %Media
        escribirB(17,2)={mean(Val_Bdm0)};     
              
        %Bdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirB(i+4,3) = {BdEjeHorizontal(i)};
        end
        %Media
        escribirB(17,3)={media_BdEjeHorizontal};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirB(3,6) = {'TEMPERATURA'};
                 escribirB(4,6)={'Temp.(ºC)'};

                for i=1:12

                    escribirB(i+4,6) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirB(17,6) = {mediaT};

              end        
        %Ganancias---------------------------------------------
        %Meses
        for j=1:13
            escribirB(j+22,1) = Meses(j);
        end
        %Títulos
        escribirB(19,2)={'GANANCIAS'};
        escribirB(20,2)={'Respecto a:'};
        
        escribirB(21,2)={'Plano horizontal'};
        escribirB(21,5)={'Inclinación óptima anual'};
        escribirB(21,8)={'Incl.  óptima estacional'};
        escribirB(21,11)={'Seg. a un eje polar'};
        escribirB(21,14)={'Seg. a un eje azimutal'};
        
        escribirB(22,2)={'Fc.Ganancia'};
        escribirB(22,3)={'Ganancia(%)'};
        escribirB(22,5)={'Fc.Ganancia'};
        escribirB(22,6)={'Ganancia(%)'};
        escribirB(22,8)={'Fc.Ganancia'};
        escribirB(22,9)={'Ganancia(%)'};
        escribirB(22,11)={'Fc.Ganancia'};
        escribirB(22,12)={'Ganancia(%)'};
        escribirB(22,14)={'Fc.Ganancia'};
        escribirB(22,15)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirB(i+22,2)={GanaB_Hor_0(i)};
        end 
        for i=1:12
            escribirB(i+22,3)={PorGanaB_Hor_0(i)};
        end 
        %medias
        escribirB(35,2)={mean(GanaB_Hor_0)};
        escribirB(35,3)={mean(PorGanaB_Hor_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirB(i+22,5)={GanaB_Hor_Anu(i)};
        end 
        for i=1:12
            escribirB(i+22,6)={PorGanaB_Hor_Anu(i)};
        end
        %medias
        escribirB(35,5)={mean(GanaB_Hor_Anu)};
        escribirB(35,6)={mean(PorGanaB_Hor_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirB(i+22,8)={GanaB_Hor_Est(i)};
        end 
        for i=1:12
            escribirB(i+22,9)={PorGanaB_Hor_Est(i)};
        end
        %medias
        escribirB(35,8)={mean(GanaB_Hor_Est)};
        escribirB(35,9)={mean(PorGanaB_Hor_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirB(i+22,11)={GanaB_Hor_Pol(i)};
        end 
        for i=1:12
            escribirB(i+22,12)={PorGanaB_Hor_Pol(i)};
        end
        %medias
        escribirB(35,11)={mean(GanaB_Hor_Pol)};
        escribirB(35,12)={mean(PorGanaB_Hor_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirB(i+22,14)={GanaB_Hor_Azi(i)};
        end 
        for i=1:12
            escribirB(i+22,15)={PorGanaB_Hor_Azi(i)};
        end
        %medias
        escribirB(35,14)={mean(GanaB_Hor_Azi)};
        escribirB(35,15)={mean(PorGanaB_Hor_Azi)};        
        
        %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Seguimiento a un eje horizontal'};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirD(j+4,1) = Meses(j);
        end
        
        %Títulos Ddm(0º),  Ddm(Eje Horizontal)---------------------------
        escribirD(4,2)={'Ddm(0º)'};
        escribirD(4,3)={'Ddm(Seg. a un eje horizontal)'};
        
        
        %Valores
        %Ddm (0º)--------------------------------------------------
        for k=1:12
            escribirD(k+4,2) = {Val_Ddm0(k)};
        end
        %Media
        escribirD(17,2)={mean(Val_Ddm0)};     
              
        %Ddm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirD(i+4,3) = {DdEjeHorizontal(i)};
        end
        %Media
        escribirD(17,3)={media_DdEjeHorizontal};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirD(3,6) = {'TEMPERATURA'};
                 escribirD(4,6)={'Temp.(ºC)'};

                for i=1:12

                    escribirD(i+4,6) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirD(17,6) = {mediaT};

              end        
        %Ganancias---------------------------------------------
        %Meses
        for j=1:13
            escribirD(j+22,1) = Meses(j);
        end
        %Títulos
        escribirD(19,2)={'GANANCIAS'};
        escribirD(20,2)={'Respecto a:'};
        
        escribirD(21,2)={'Plano horizontal'};
        escribirD(21,5)={'Inclinación óptima anual'};
        escribirD(21,8)={'Incl.  óptima estacional'};
        escribirD(21,11)={'Seg. a un eje polar'};
        escribirD(21,14)={'Seg. a un eje azimutal'};
        
        escribirD(22,2)={'Fc.Ganancia'};
        escribirD(22,3)={'Ganancia(%)'};
        escribirD(22,5)={'Fc.Ganancia'};
        escribirD(22,6)={'Ganancia(%)'};
        escribirD(22,8)={'Fc.Ganancia'};
        escribirD(22,9)={'Ganancia(%)'};
        escribirD(22,11)={'Fc.Ganancia'};
        escribirD(22,12)={'Ganancia(%)'};
        escribirD(22,14)={'Fc.Ganancia'};
        escribirD(22,15)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirD(i+22,2)={GanaD_Hor_0(i)};
        end 
        for i=1:12
            escribirD(i+22,3)={PorGanaD_Hor_0(i)};
        end 
        %medias
        escribirD(35,2)={mean(GanaD_Hor_0)};
        escribirD(35,3)={mean(PorGanaD_Hor_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirD(i+22,5)={GanaD_Hor_Anu(i)};
        end 
        for i=1:12
            escribirD(i+22,6)={PorGanaD_Hor_Anu(i)};
        end
        %medias
        escribirD(35,5)={mean(GanaD_Hor_Anu)};
        escribirD(35,6)={mean(PorGanaD_Hor_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirD(i+22,8)={GanaD_Hor_Est(i)};
        end 
        for i=1:12
            escribirD(i+22,9)={PorGanaD_Hor_Est(i)};
        end
        %medias
        escribirD(35,8)={mean(GanaD_Hor_Est)};
        escribirD(35,9)={mean(PorGanaD_Hor_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirD(i+22,11)={GanaD_Hor_Pol(i)};
        end 
        for i=1:12
            escribirD(i+22,12)={PorGanaD_Hor_Pol(i)};
        end
        %medias
        escribirD(35,11)={mean(GanaD_Hor_Pol)};
        escribirD(35,12)={mean(PorGanaD_Hor_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirD(i+22,14)={GanaD_Hor_Azi(i)};
        end 
        for i=1:12
            escribirD(i+22,15)={PorGanaD_Hor_Azi(i)};
        end
        %medias
        escribirD(35,14)={mean(GanaD_Hor_Azi)};
        escribirD(35,15)={mean(PorGanaD_Hor_Azi)};        
        
        %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Seguimiento a un eje horizontal'};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirR(j+4,1) = Meses(j);
        end
        
        %Títulos Rdm(0º),  Rdm(Eje Horizontal)---------------------------
        escribirR(4,2)={'Rdm(0º)'};
        escribirR(4,3)={'Rdm(Seg. a un eje horizontal)'};
        
        
        %Valores
        %Rdm (0º)--------------------------------------------------
        for k=1:12
            escribirR(k+4,2) = {0};
        end
        %Media
        escribirR(17,2)={0};     
              
        %Rdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirR(i+4,3) = {RdEjeHorizontal(i)};
        end
        %Media
        escribirR(17,3)={media_RdEjeHorizontal};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirR(3,6) = {'TEMPERATURA'};
                 escribirR(4,6)={'Temp.(ºC)'};

                for i=1:12

                    escribirR(i+4,6) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirR(17,6) = {mediaT};

              end        
        %Ganancias---------------------------------------------
        %Meses
        for j=1:13
            escribirR(j+22,1) = Meses(j);
        end
        %Títulos
        escribirR(19,2)={'GANANCIAS'};
        escribirR(20,2)={'Respecto a:'};
        
        escribirR(21,2)={'Plano horizontal'};
        escribirR(21,5)={'Inclinación óptima anual'};
        escribirR(21,8)={'Incl.  óptima estacional'};
        escribirR(21,11)={'Seg. a un eje polar'};
        escribirR(21,14)={'Seg. a un eje azimutal'};
        
        escribirR(22,2)={'Fc.Ganancia'};
        escribirR(22,3)={'Ganancia(%)'};
        escribirR(22,5)={'Fc.Ganancia'};
        escribirR(22,6)={'Ganancia(%)'};
        escribirR(22,8)={'Fc.Ganancia'};
        escribirR(22,9)={'Ganancia(%)'};
        escribirR(22,11)={'Fc.Ganancia'};
        escribirR(22,12)={'Ganancia(%)'};
        escribirR(22,14)={'Fc.Ganancia'};
        escribirR(22,15)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirR(i+22,2)={'-'};
        end 
        for i=1:12
            escribirR(i+22,3)={'-'};
        end 
        %medias
        escribirR(35,2)={'-'};
        escribirR(35,3)={'-'};
        %Inclinación óptima anual------------------
        if angulo_optimo == 0    %sería para Rdm(0º) --- Inf   
            for i=1:12
                escribirR(i+22,5)={'-'};
            end 
            for i=1:12
                escribirR(i+22,6)={'-'};
            end
            %medias
            escribirR(35,5)={'-'};
            escribirR(35,6)={'-'};
        else
            for i=1:12
                escribirR(i+22,5)={GanaR_Hor_Anu(i)};
            end 
            for i=1:12
                escribirR(i+22,6)={PorGanaR_Hor_Anu(i)};
            end
            %medias
            escribirR(35,5)={mean(GanaR_Hor_Anu)};
            escribirR(35,6)={mean(PorGanaR_Hor_Anu)};
        end
        %Inclinación óptima estacional-------------(-------(CAMBIO)-------)
        for i=1:12
            if GanaR_Hor_Est(i)== Inf
                escribirR(i+22,8)={'-'};
            else
            escribirR(i+22,8)={GanaR_Hor_Est(i)};
            end 
        end
        for i=1:12
            if GanaR_Hor_Est(i)== Inf
                escribirR(i+22,9)={'-'};
            else
            escribirR(i+22,9)={PorGanaR_Hor_Est(i)};
            end
        end
        %medias
        if mean(GanaR_Hor_Est)==Inf
            escribirR(35,8)={'-'};
            escribirR(35,9)={'-'};
        else
        escribirR(35,8)={mean(GanaR_Hor_Est)};
        escribirR(35,9)={mean(PorGanaR_Hor_Est)};
        end
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirR(i+22,11)={GanaR_Hor_Pol(i)};
        end 
        for i=1:12
            escribirR(i+22,12)={PorGanaR_Hor_Pol(i)};
        end
        %medias
        escribirR(35,11)={mean(GanaR_Hor_Pol)};
        escribirR(35,12)={mean(PorGanaR_Hor_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirR(i+22,14)={GanaR_Hor_Azi(i)};
        end 
        for i=1:12
            escribirR(i+22,15)={PorGanaR_Hor_Azi(i)};
        end
        %medias
        escribirR(35,14)={mean(GanaR_Hor_Azi)};
        escribirR(35,15)={mean(PorGanaR_Hor_Azi)};    
        
        
         
        %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
        xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
        xlswrite(fullfile(ruta,nombre),escribirB,'Hoja2','A1');
        xlswrite(fullfile(ruta,nombre),escribirD,'Hoja3','A1');
        xlswrite(fullfile(ruta,nombre),escribirR,'Hoja4','A1');

        %Quitar posible error por creación de una nueva hoja en Excel
        warning('off','MATLAB:xlswrite:AddSheet');


        msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
   
end            

guidata(hObject, handles);


% --- Executes on button press in Informe.
function Informe_Callback(hObject, eventdata, handles)
%G
global DATOS RadG0 medRadG0;
global PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;
global medPorGanaG_Hor_0 medPorGanaG_Hor_Anu medPorGanaG_Hor_Est medPorGanaG_Hor_Pol medPorGanaG_Hor_Azi;
%B
global Val_Bdm0 medRadB0;
global PorGanaB_Hor_0 PorGanaB_Hor_Anu PorGanaB_Hor_Est PorGanaB_Hor_Pol PorGanaB_Hor_Azi;
global medPorGanaB_Hor_0 medPorGanaB_Hor_Anu medPorGanaB_Hor_Est medPorGanaB_Hor_Pol medPorGanaB_Hor_Azi;
%D
global Val_Ddm0 medRadD0;
global PorGanaD_Hor_0 PorGanaD_Hor_Anu PorGanaD_Hor_Est PorGanaD_Hor_Pol PorGanaD_Hor_Azi;
global medPorGanaD_Hor_0 medPorGanaD_Hor_Anu medPorGanaD_Hor_Est medPorGanaD_Hor_Pol medPorGanaD_Hor_Azi;
%R
global Val_Rdm0 medRadR0;
global PorGanaR_Hor_0 PorGanaR_Hor_Anu PorGanaR_Hor_Est PorGanaR_Hor_Pol PorGanaR_Hor_Azi;
global medPorGanaR_Hor_0 medPorGanaR_Hor_Anu medPorGanaR_Hor_Est medPorGanaR_Hor_Pol medPorGanaR_Hor_Azi;

global LAT TEMP;


%Latitud-----------------------------------
LAT = DATOS(2);

%Temperatura-------------------------------
TEMP = zeros(1,12);
if (DATOS(15)==1000)

    TEMP =[];
else

    for i = 1:12

        TEMP(i) = DATOS(i+14);

    end
end

%GLOBAL-----------------------------------
%Radiación para 0º........................
RadG0 = zeros(1,12);

    for i = 1:12

        RadG0(i) = DATOS(i+2);

    end
%Media
    %Media de las radiaciones para 0º.....
        sum = 0;
        for i=3:14
            sum = sum + DATOS(i);
        end
        
        medRadG0 = sum/12;

%Ganancias
medPorGanaG_Hor_0 = mean(PorGanaG_Hor_0);
medPorGanaG_Hor_Anu = mean(PorGanaG_Hor_Anu);
medPorGanaG_Hor_Est = mean(PorGanaG_Hor_Est);
medPorGanaG_Hor_Pol = mean(PorGanaG_Hor_Pol);
medPorGanaG_Hor_Azi = mean(PorGanaG_Hor_Azi);

%DIRECTA-----------------------------------
%Media radiación directa 0º
medRadB0 = mean (Val_Bdm0);

%Ganancias
medPorGanaB_Hor_0 = mean(PorGanaB_Hor_0);
medPorGanaB_Hor_Anu = mean(PorGanaB_Hor_Anu);
medPorGanaB_Hor_Est = mean(PorGanaB_Hor_Est);
medPorGanaB_Hor_Pol = mean(PorGanaB_Hor_Pol);
medPorGanaB_Hor_Azi = mean(PorGanaB_Hor_Azi);

%DIFUSA-------------------------------------
%Media radiación directa 0º
medRadD0 = mean (Val_Ddm0);

%Ganancias
medPorGanaD_Hor_0 = mean(PorGanaD_Hor_0);
medPorGanaD_Hor_Anu = mean(PorGanaD_Hor_Anu);
medPorGanaD_Hor_Est = mean(PorGanaD_Hor_Est);
medPorGanaD_Hor_Pol = mean(PorGanaD_Hor_Pol);
medPorGanaD_Hor_Azi = mean(PorGanaD_Hor_Azi);
%ALBEDO-----------------------------------
%Media radiación directa 0º
Val_Rdm0 = zeros(1,12);
medRadR0 = 0;
 
%Ganancias
medPorGanaR_Hor_0 = mean(PorGanaR_Hor_0);
medPorGanaR_Hor_Anu = mean(PorGanaR_Hor_Anu);
medPorGanaR_Hor_Est = mean(PorGanaR_Hor_Est);
medPorGanaR_Hor_Pol = mean(PorGanaR_Hor_Pol);
medPorGanaR_Hor_Azi = mean(PorGanaR_Hor_Azi);

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'

        report ReportSegEjeHorizontal.rpt;

        msgbox('Informe generado y guardado en C:\\OrientSol3\InformesPDF','Aviso');
        
    otherwise 
        
        return
end        

guidata(hObject, handles);

% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)
global DATOS

if (DATOS(15)==1000)
  
    Principal_N;  
   
else 
   
    Principal;

end

close ('OrientSol 3.0 - Seguimiento a un eje horizontal');
 

% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_EjeHorizontal;

close ('OrientSol 3.0 - Seguimiento a un eje horizontal');

% --- Executes on button press in Energia.
function Energia_Callback(hObject, eventdata, handles)
global DATOS;
global GdEjeHorizontal;

global RADIACION_OST;

global VOLVER_ENER;

VOLVER_ENER = 5;

RADIACION_OST  = GdEjeHorizontal;

if (DATOS(15)==1000)
   
   Energia_Osterwald_N;  
   close ('OrientSol 3.0 - Seguimiento a un eje horizontal');
   
else 
   
   Energia_Osterwald;
   close ('OrientSol 3.0 - Seguimiento a un eje horizontal');
   
end
%global RADIACION
%RADIACION  = mean(GdEjeHorizontal);
%Energia;


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
% hObject    handle to figure1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: delete(hObject) closes the figure
delete(hObject);
