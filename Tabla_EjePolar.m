function varargout = Tabla_EjePolar(varargin)
% TABLA_EJEPOLAR MATLAB code for Tabla_EjePolar.fig
%      TABLA_EJEPOLAR, by itself, creates a new TABLA_EJEPOLAR or raises the existing
%      singleton*.
%
%      H = TABLA_EJEPOLAR returns the handle to a new TABLA_EJEPOLAR or the handle to
%      the existing singleton*.
%
%      TABLA_EJEPOLAR('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_EJEPOLAR.M with the given input arguments.
%
%      TABLA_EJEPOLAR('Property','Value',...) creates a new TABLA_EJEPOLAR or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_EjePolar_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_EjePolar_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_EjePolar

% Last Modified by GUIDE v2.5 22-Jan-2015 17:13:30

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_EjePolar_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_EjePolar_OutputFcn, ...
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


% --- Executes just before Tabla_EjePolar is made visible.
function Tabla_EjePolar_OpeningFcn(hObject, eventdata, handles, varargin)

global OPCION_COMP; 
  
global NOMBRE_CIUDAD DATOS; 

global GdEjePolar media_GdEjePolar;
%Ganancias==========================
global PorGanaG_Pol_0 PorGanaG_Pol_Anu PorGanaG_Pol_Est PorGanaG_Pol_Azi PorGanaG_Pol_Hor;

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

imagen_pol=imread('SeguimientoPolar.jpg');
imagen1_pol=imresize(imagen_pol,[513 428]); %Para ajustarlo directamente
imshow(imagen1_pol);
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
    

%Mostrar valores para el seguimiento a un eje polar
    set(handles.CEjePol_ene,'String',roundn(GdEjePolar(1),-2));
    set(handles.CEjePol_feb,'String',roundn(GdEjePolar(2),-2));
    set(handles.CEjePol_mar,'String',roundn(GdEjePolar(3),-2));
    set(handles.CEjePol_abr,'String',roundn(GdEjePolar(4),-2));
    set(handles.CEjePol_may,'String',roundn(GdEjePolar(5),-2));
    set(handles.CEjePol_jun,'String',roundn(GdEjePolar(6),-2));
    set(handles.CEjePol_jul,'String',roundn(GdEjePolar(7),-2));
    set(handles.CEjePol_ago,'String',roundn(GdEjePolar(8),-2));
    set(handles.CEjePol_sep,'String',roundn(GdEjePolar(9),-2));
    set(handles.CEjePol_oct,'String',roundn(GdEjePolar(10),-2));
    set(handles.CEjePol_nov,'String',roundn(GdEjePolar(11),-2));
    set(handles.CEjePol_dic,'String',roundn(GdEjePolar(12),-2));
    
    set(handles.CEjePol_media,'String',roundn(media_GdEjePolar,-2));

%GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Mostrar valores de ganancias con respecto al plano horizontal
    set(handles.CGanaPol_0_ene,'String',roundn(PorGanaG_Pol_0(1),-2));
    set(handles.CGanaPol_0_feb,'String',roundn(PorGanaG_Pol_0(2),-2));
    set(handles.CGanaPol_0_mar,'String',roundn(PorGanaG_Pol_0(3),-2));
    set(handles.CGanaPol_0_abr,'String',roundn(PorGanaG_Pol_0(4),-2));
    set(handles.CGanaPol_0_may,'String',roundn(PorGanaG_Pol_0(5),-2));
    set(handles.CGanaPol_0_jun,'String',roundn(PorGanaG_Pol_0(6),-2));
    set(handles.CGanaPol_0_jul,'String',roundn(PorGanaG_Pol_0(7),-2));
    set(handles.CGanaPol_0_ago,'String',roundn(PorGanaG_Pol_0(8),-2));
    set(handles.CGanaPol_0_sep,'String',roundn(PorGanaG_Pol_0(9),-2));
    set(handles.CGanaPol_0_oct,'String',roundn(PorGanaG_Pol_0(10),-2));
    set(handles.CGanaPol_0_nov,'String',roundn(PorGanaG_Pol_0(11),-2));
    set(handles.CGanaPol_0_dic,'String',roundn(PorGanaG_Pol_0(12),-2));
    
    set(handles.CGanaPol_0_media,'String',roundn(mean(PorGanaG_Pol_0),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima anual
    set(handles.CGanaPol_Anu_ene,'String',roundn(PorGanaG_Pol_Anu(1),-2));
    set(handles.CGanaPol_Anu_feb,'String',roundn(PorGanaG_Pol_Anu(2),-2));
    set(handles.CGanaPol_Anu_mar,'String',roundn(PorGanaG_Pol_Anu(3),-2));
    set(handles.CGanaPol_Anu_abr,'String',roundn(PorGanaG_Pol_Anu(4),-2));
    set(handles.CGanaPol_Anu_may,'String',roundn(PorGanaG_Pol_Anu(5),-2));
    set(handles.CGanaPol_Anu_jun,'String',roundn(PorGanaG_Pol_Anu(6),-2));
    set(handles.CGanaPol_Anu_jul,'String',roundn(PorGanaG_Pol_Anu(7),-2));
    set(handles.CGanaPol_Anu_ago,'String',roundn(PorGanaG_Pol_Anu(8),-2));
    set(handles.CGanaPol_Anu_sep,'String',roundn(PorGanaG_Pol_Anu(9),-2));
    set(handles.CGanaPol_Anu_oct,'String',roundn(PorGanaG_Pol_Anu(10),-2));
    set(handles.CGanaPol_Anu_nov,'String',roundn(PorGanaG_Pol_Anu(11),-2));
    set(handles.CGanaPol_Anu_dic,'String',roundn(PorGanaG_Pol_Anu(12),-2));
    
    set(handles.CGanaPol_Anu_media,'String',roundn(mean(PorGanaG_Pol_Anu),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima estacional
    set(handles.CGanaPol_Est_ene,'String',roundn(PorGanaG_Pol_Est(1),-2));
    set(handles.CGanaPol_Est_feb,'String',roundn(PorGanaG_Pol_Est(2),-2));
    set(handles.CGanaPol_Est_mar,'String',roundn(PorGanaG_Pol_Est(3),-2));
    set(handles.CGanaPol_Est_abr,'String',roundn(PorGanaG_Pol_Est(4),-2));
    set(handles.CGanaPol_Est_may,'String',roundn(PorGanaG_Pol_Est(5),-2));
    set(handles.CGanaPol_Est_jun,'String',roundn(PorGanaG_Pol_Est(6),-2));
    set(handles.CGanaPol_Est_jul,'String',roundn(PorGanaG_Pol_Est(7),-2));
    set(handles.CGanaPol_Est_ago,'String',roundn(PorGanaG_Pol_Est(8),-2));
    set(handles.CGanaPol_Est_sep,'String',roundn(PorGanaG_Pol_Est(9),-2));
    set(handles.CGanaPol_Est_oct,'String',roundn(PorGanaG_Pol_Est(10),-2));
    set(handles.CGanaPol_Est_nov,'String',roundn(PorGanaG_Pol_Est(11),-2));
    set(handles.CGanaPol_Est_dic,'String',roundn(PorGanaG_Pol_Est(12),-2));
   
    set(handles.CGanaPol_Est_media,'String',roundn(mean(PorGanaG_Pol_Est),-2));
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
    set(handles.CGanaPol_Azi_ene,'String',roundn(PorGanaG_Pol_Azi(1),-2));
    set(handles.CGanaPol_Azi_feb,'String',roundn(PorGanaG_Pol_Azi(2),-2));
    set(handles.CGanaPol_Azi_mar,'String',roundn(PorGanaG_Pol_Azi(3),-2));
    set(handles.CGanaPol_Azi_abr,'String',roundn(PorGanaG_Pol_Azi(4),-2));
    set(handles.CGanaPol_Azi_may,'String',roundn(PorGanaG_Pol_Azi(5),-2));
    set(handles.CGanaPol_Azi_jun,'String',roundn(PorGanaG_Pol_Azi(6),-2));
    set(handles.CGanaPol_Azi_jul,'String',roundn(PorGanaG_Pol_Azi(7),-2));
    set(handles.CGanaPol_Azi_ago,'String',roundn(PorGanaG_Pol_Azi(8),-2));
    set(handles.CGanaPol_Azi_sep,'String',roundn(PorGanaG_Pol_Azi(9),-2));
    set(handles.CGanaPol_Azi_oct,'String',roundn(PorGanaG_Pol_Azi(10),-2));
    set(handles.CGanaPol_Azi_nov,'String',roundn(PorGanaG_Pol_Azi(11),-2));
    set(handles.CGanaPol_Azi_dic,'String',roundn(PorGanaG_Pol_Azi(12),-2));
    
    set(handles.CGanaPol_Azi_media,'String',roundn(mean(PorGanaG_Pol_Azi),-2));    
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
    set(handles.CGanaPol_Hor_ene,'String',roundn(PorGanaG_Pol_Hor(1),-2));
    set(handles.CGanaPol_Hor_feb,'String',roundn(PorGanaG_Pol_Hor(2),-2));
    set(handles.CGanaPol_Hor_mar,'String',roundn(PorGanaG_Pol_Hor(3),-2));
    set(handles.CGanaPol_Hor_abr,'String',roundn(PorGanaG_Pol_Hor(4),-2));
    set(handles.CGanaPol_Hor_may,'String',roundn(PorGanaG_Pol_Hor(5),-2));
    set(handles.CGanaPol_Hor_jun,'String',roundn(PorGanaG_Pol_Hor(6),-2));
    set(handles.CGanaPol_Hor_jul,'String',roundn(PorGanaG_Pol_Hor(7),-2));
    set(handles.CGanaPol_Hor_ago,'String',roundn(PorGanaG_Pol_Hor(8),-2));
    set(handles.CGanaPol_Hor_sep,'String',roundn(PorGanaG_Pol_Hor(9),-2));
    set(handles.CGanaPol_Hor_oct,'String',roundn(PorGanaG_Pol_Hor(10),-2));
    set(handles.CGanaPol_Hor_nov,'String',roundn(PorGanaG_Pol_Hor(11),-2));
    set(handles.CGanaPol_Hor_dic,'String',roundn(PorGanaG_Pol_Hor(12),-2));
    
    set(handles.CGanaPol_Hor_media,'String',roundn(mean(PorGanaG_Pol_Hor),-2)); 

% Choose default command line output for Tabla_EjePolar
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_EjePolar wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_EjePolar_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes during object creation, after setting all properties.
function edit1_CreateFcn(hObject, eventdata, handles)
% hObject    handle to edit1 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called



% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global OPCION_COMP 
    
global DATOS Val_Bdm0 Val_Ddm0

global angulo_optimo;
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;

global BdEjePolar media_BdEjePolar;
global DdEjePolar media_DdEjePolar;
global RdEjePolar media_RdEjePolar;
global GdEjePolar media_GdEjePolar;
%Ganancias==========================
global PorGanaG_Pol_0 PorGanaG_Pol_Anu PorGanaG_Pol_Est PorGanaG_Pol_Azi PorGanaG_Pol_Hor;
global PorGanaB_Pol_0 PorGanaB_Pol_Anu PorGanaB_Pol_Est PorGanaB_Pol_Azi PorGanaB_Pol_Hor;
global PorGanaD_Pol_0 PorGanaD_Pol_Anu PorGanaD_Pol_Est PorGanaD_Pol_Azi PorGanaD_Pol_Hor;
global PorGanaR_Pol_0 PorGanaR_Pol_Anu PorGanaR_Pol_Est PorGanaR_Pol_Azi PorGanaR_Pol_Hor;

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

        %Mostrar valores para el seguimiento a un eje polar
            set(handles.CEjePol_ene,'String',roundn(GdEjePolar(1),-2));
            set(handles.CEjePol_feb,'String',roundn(GdEjePolar(2),-2));
            set(handles.CEjePol_mar,'String',roundn(GdEjePolar(3),-2));
            set(handles.CEjePol_abr,'String',roundn(GdEjePolar(4),-2));
            set(handles.CEjePol_may,'String',roundn(GdEjePolar(5),-2));
            set(handles.CEjePol_jun,'String',roundn(GdEjePolar(6),-2));
            set(handles.CEjePol_jul,'String',roundn(GdEjePolar(7),-2));
            set(handles.CEjePol_ago,'String',roundn(GdEjePolar(8),-2));
            set(handles.CEjePol_sep,'String',roundn(GdEjePolar(9),-2));
            set(handles.CEjePol_oct,'String',roundn(GdEjePolar(10),-2));
            set(handles.CEjePol_nov,'String',roundn(GdEjePolar(11),-2));
            set(handles.CEjePol_dic,'String',roundn(GdEjePolar(12),-2));

            set(handles.CEjePol_media,'String',roundn(media_GdEjePolar,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaPol_0_ene,'String',roundn(PorGanaG_Pol_0(1),-2));
            set(handles.CGanaPol_0_feb,'String',roundn(PorGanaG_Pol_0(2),-2));
            set(handles.CGanaPol_0_mar,'String',roundn(PorGanaG_Pol_0(3),-2));
            set(handles.CGanaPol_0_abr,'String',roundn(PorGanaG_Pol_0(4),-2));
            set(handles.CGanaPol_0_may,'String',roundn(PorGanaG_Pol_0(5),-2));
            set(handles.CGanaPol_0_jun,'String',roundn(PorGanaG_Pol_0(6),-2));
            set(handles.CGanaPol_0_jul,'String',roundn(PorGanaG_Pol_0(7),-2));
            set(handles.CGanaPol_0_ago,'String',roundn(PorGanaG_Pol_0(8),-2));
            set(handles.CGanaPol_0_sep,'String',roundn(PorGanaG_Pol_0(9),-2));
            set(handles.CGanaPol_0_oct,'String',roundn(PorGanaG_Pol_0(10),-2));
            set(handles.CGanaPol_0_nov,'String',roundn(PorGanaG_Pol_0(11),-2));
            set(handles.CGanaPol_0_dic,'String',roundn(PorGanaG_Pol_0(12),-2));

            set(handles.CGanaPol_0_media,'String',roundn(mean(PorGanaG_Pol_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaPol_Anu_ene,'String',roundn(PorGanaG_Pol_Anu(1),-2));
            set(handles.CGanaPol_Anu_feb,'String',roundn(PorGanaG_Pol_Anu(2),-2));
            set(handles.CGanaPol_Anu_mar,'String',roundn(PorGanaG_Pol_Anu(3),-2));
            set(handles.CGanaPol_Anu_abr,'String',roundn(PorGanaG_Pol_Anu(4),-2));
            set(handles.CGanaPol_Anu_may,'String',roundn(PorGanaG_Pol_Anu(5),-2));
            set(handles.CGanaPol_Anu_jun,'String',roundn(PorGanaG_Pol_Anu(6),-2));
            set(handles.CGanaPol_Anu_jul,'String',roundn(PorGanaG_Pol_Anu(7),-2));
            set(handles.CGanaPol_Anu_ago,'String',roundn(PorGanaG_Pol_Anu(8),-2));
            set(handles.CGanaPol_Anu_sep,'String',roundn(PorGanaG_Pol_Anu(9),-2));
            set(handles.CGanaPol_Anu_oct,'String',roundn(PorGanaG_Pol_Anu(10),-2));
            set(handles.CGanaPol_Anu_nov,'String',roundn(PorGanaG_Pol_Anu(11),-2));
            set(handles.CGanaPol_Anu_dic,'String',roundn(PorGanaG_Pol_Anu(12),-2));

            set(handles.CGanaPol_Anu_media,'String',roundn(mean(PorGanaG_Pol_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaPol_Est_ene,'String',roundn(PorGanaG_Pol_Est(1),-2));
            set(handles.CGanaPol_Est_feb,'String',roundn(PorGanaG_Pol_Est(2),-2));
            set(handles.CGanaPol_Est_mar,'String',roundn(PorGanaG_Pol_Est(3),-2));
            set(handles.CGanaPol_Est_abr,'String',roundn(PorGanaG_Pol_Est(4),-2));
            set(handles.CGanaPol_Est_may,'String',roundn(PorGanaG_Pol_Est(5),-2));
            set(handles.CGanaPol_Est_jun,'String',roundn(PorGanaG_Pol_Est(6),-2));
            set(handles.CGanaPol_Est_jul,'String',roundn(PorGanaG_Pol_Est(7),-2));
            set(handles.CGanaPol_Est_ago,'String',roundn(PorGanaG_Pol_Est(8),-2));
            set(handles.CGanaPol_Est_sep,'String',roundn(PorGanaG_Pol_Est(9),-2));
            set(handles.CGanaPol_Est_oct,'String',roundn(PorGanaG_Pol_Est(10),-2));
            set(handles.CGanaPol_Est_nov,'String',roundn(PorGanaG_Pol_Est(11),-2));
            set(handles.CGanaPol_Est_dic,'String',roundn(PorGanaG_Pol_Est(12),-2));

            set(handles.CGanaPol_Est_media,'String',roundn(mean(PorGanaG_Pol_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaPol_Azi_ene,'String',roundn(PorGanaG_Pol_Azi(1),-2));
            set(handles.CGanaPol_Azi_feb,'String',roundn(PorGanaG_Pol_Azi(2),-2));
            set(handles.CGanaPol_Azi_mar,'String',roundn(PorGanaG_Pol_Azi(3),-2));
            set(handles.CGanaPol_Azi_abr,'String',roundn(PorGanaG_Pol_Azi(4),-2));
            set(handles.CGanaPol_Azi_may,'String',roundn(PorGanaG_Pol_Azi(5),-2));
            set(handles.CGanaPol_Azi_jun,'String',roundn(PorGanaG_Pol_Azi(6),-2));
            set(handles.CGanaPol_Azi_jul,'String',roundn(PorGanaG_Pol_Azi(7),-2));
            set(handles.CGanaPol_Azi_ago,'String',roundn(PorGanaG_Pol_Azi(8),-2));
            set(handles.CGanaPol_Azi_sep,'String',roundn(PorGanaG_Pol_Azi(9),-2));
            set(handles.CGanaPol_Azi_oct,'String',roundn(PorGanaG_Pol_Azi(10),-2));
            set(handles.CGanaPol_Azi_nov,'String',roundn(PorGanaG_Pol_Azi(11),-2));
            set(handles.CGanaPol_Azi_dic,'String',roundn(PorGanaG_Pol_Azi(12),-2));

            set(handles.CGanaPol_Azi_media,'String',roundn(mean(PorGanaG_Pol_Azi),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGanaPol_Hor_ene,'String',roundn(PorGanaG_Pol_Hor(1),-2));
            set(handles.CGanaPol_Hor_feb,'String',roundn(PorGanaG_Pol_Hor(2),-2));
            set(handles.CGanaPol_Hor_mar,'String',roundn(PorGanaG_Pol_Hor(3),-2));
            set(handles.CGanaPol_Hor_abr,'String',roundn(PorGanaG_Pol_Hor(4),-2));
            set(handles.CGanaPol_Hor_may,'String',roundn(PorGanaG_Pol_Hor(5),-2));
            set(handles.CGanaPol_Hor_jun,'String',roundn(PorGanaG_Pol_Hor(6),-2));
            set(handles.CGanaPol_Hor_jul,'String',roundn(PorGanaG_Pol_Hor(7),-2));
            set(handles.CGanaPol_Hor_ago,'String',roundn(PorGanaG_Pol_Hor(8),-2));
            set(handles.CGanaPol_Hor_sep,'String',roundn(PorGanaG_Pol_Hor(9),-2));
            set(handles.CGanaPol_Hor_oct,'String',roundn(PorGanaG_Pol_Hor(10),-2));
            set(handles.CGanaPol_Hor_nov,'String',roundn(PorGanaG_Pol_Hor(11),-2));
            set(handles.CGanaPol_Hor_dic,'String',roundn(PorGanaG_Pol_Hor(12),-2));

            set(handles.CGanaPol_Hor_media,'String',roundn(mean(PorGanaG_Pol_Hor),-2)); 
        
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

       %Mostrar valores para el seguimiento a un eje polar
            set(handles.CEjePol_ene,'String',roundn(BdEjePolar(1),-2));
            set(handles.CEjePol_feb,'String',roundn(BdEjePolar(2),-2));
            set(handles.CEjePol_mar,'String',roundn(BdEjePolar(3),-2));
            set(handles.CEjePol_abr,'String',roundn(BdEjePolar(4),-2));
            set(handles.CEjePol_may,'String',roundn(BdEjePolar(5),-2));
            set(handles.CEjePol_jun,'String',roundn(BdEjePolar(6),-2));
            set(handles.CEjePol_jul,'String',roundn(BdEjePolar(7),-2));
            set(handles.CEjePol_ago,'String',roundn(BdEjePolar(8),-2));
            set(handles.CEjePol_sep,'String',roundn(BdEjePolar(9),-2));
            set(handles.CEjePol_oct,'String',roundn(BdEjePolar(10),-2));
            set(handles.CEjePol_nov,'String',roundn(BdEjePolar(11),-2));
            set(handles.CEjePol_dic,'String',roundn(BdEjePolar(12),-2));

            set(handles.CEjePol_media,'String',roundn(media_BdEjePolar,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaPol_0_ene,'String',roundn(PorGanaB_Pol_0(1),-2));
            set(handles.CGanaPol_0_feb,'String',roundn(PorGanaB_Pol_0(2),-2));
            set(handles.CGanaPol_0_mar,'String',roundn(PorGanaB_Pol_0(3),-2));
            set(handles.CGanaPol_0_abr,'String',roundn(PorGanaB_Pol_0(4),-2));
            set(handles.CGanaPol_0_may,'String',roundn(PorGanaB_Pol_0(5),-2));
            set(handles.CGanaPol_0_jun,'String',roundn(PorGanaB_Pol_0(6),-2));
            set(handles.CGanaPol_0_jul,'String',roundn(PorGanaB_Pol_0(7),-2));
            set(handles.CGanaPol_0_ago,'String',roundn(PorGanaB_Pol_0(8),-2));
            set(handles.CGanaPol_0_sep,'String',roundn(PorGanaB_Pol_0(9),-2));
            set(handles.CGanaPol_0_oct,'String',roundn(PorGanaB_Pol_0(10),-2));
            set(handles.CGanaPol_0_nov,'String',roundn(PorGanaB_Pol_0(11),-2));
            set(handles.CGanaPol_0_dic,'String',roundn(PorGanaB_Pol_0(12),-2));

            set(handles.CGanaPol_0_media,'String',roundn(mean(PorGanaB_Pol_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaPol_Anu_ene,'String',roundn(PorGanaB_Pol_Anu(1),-2));
            set(handles.CGanaPol_Anu_feb,'String',roundn(PorGanaB_Pol_Anu(2),-2));
            set(handles.CGanaPol_Anu_mar,'String',roundn(PorGanaB_Pol_Anu(3),-2));
            set(handles.CGanaPol_Anu_abr,'String',roundn(PorGanaB_Pol_Anu(4),-2));
            set(handles.CGanaPol_Anu_may,'String',roundn(PorGanaB_Pol_Anu(5),-2));
            set(handles.CGanaPol_Anu_jun,'String',roundn(PorGanaB_Pol_Anu(6),-2));
            set(handles.CGanaPol_Anu_jul,'String',roundn(PorGanaB_Pol_Anu(7),-2));
            set(handles.CGanaPol_Anu_ago,'String',roundn(PorGanaB_Pol_Anu(8),-2));
            set(handles.CGanaPol_Anu_sep,'String',roundn(PorGanaB_Pol_Anu(9),-2));
            set(handles.CGanaPol_Anu_oct,'String',roundn(PorGanaB_Pol_Anu(10),-2));
            set(handles.CGanaPol_Anu_nov,'String',roundn(PorGanaB_Pol_Anu(11),-2));
            set(handles.CGanaPol_Anu_dic,'String',roundn(PorGanaB_Pol_Anu(12),-2));

            set(handles.CGanaPol_Anu_media,'String',roundn(mean(PorGanaB_Pol_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaPol_Est_ene,'String',roundn(PorGanaB_Pol_Est(1),-2));
            set(handles.CGanaPol_Est_feb,'String',roundn(PorGanaB_Pol_Est(2),-2));
            set(handles.CGanaPol_Est_mar,'String',roundn(PorGanaB_Pol_Est(3),-2));
            set(handles.CGanaPol_Est_abr,'String',roundn(PorGanaB_Pol_Est(4),-2));
            set(handles.CGanaPol_Est_may,'String',roundn(PorGanaB_Pol_Est(5),-2));
            set(handles.CGanaPol_Est_jun,'String',roundn(PorGanaB_Pol_Est(6),-2));
            set(handles.CGanaPol_Est_jul,'String',roundn(PorGanaB_Pol_Est(7),-2));
            set(handles.CGanaPol_Est_ago,'String',roundn(PorGanaB_Pol_Est(8),-2));
            set(handles.CGanaPol_Est_sep,'String',roundn(PorGanaB_Pol_Est(9),-2));
            set(handles.CGanaPol_Est_oct,'String',roundn(PorGanaB_Pol_Est(10),-2));
            set(handles.CGanaPol_Est_nov,'String',roundn(PorGanaB_Pol_Est(11),-2));
            set(handles.CGanaPol_Est_dic,'String',roundn(PorGanaB_Pol_Est(12),-2));

            set(handles.CGanaPol_Est_media,'String',roundn(mean(PorGanaB_Pol_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaPol_Azi_ene,'String',roundn(PorGanaB_Pol_Azi(1),-2));
            set(handles.CGanaPol_Azi_feb,'String',roundn(PorGanaB_Pol_Azi(2),-2));
            set(handles.CGanaPol_Azi_mar,'String',roundn(PorGanaB_Pol_Azi(3),-2));
            set(handles.CGanaPol_Azi_abr,'String',roundn(PorGanaB_Pol_Azi(4),-2));
            set(handles.CGanaPol_Azi_may,'String',roundn(PorGanaB_Pol_Azi(5),-2));
            set(handles.CGanaPol_Azi_jun,'String',roundn(PorGanaB_Pol_Azi(6),-2));
            set(handles.CGanaPol_Azi_jul,'String',roundn(PorGanaB_Pol_Azi(7),-2));
            set(handles.CGanaPol_Azi_ago,'String',roundn(PorGanaB_Pol_Azi(8),-2));
            set(handles.CGanaPol_Azi_sep,'String',roundn(PorGanaB_Pol_Azi(9),-2));
            set(handles.CGanaPol_Azi_oct,'String',roundn(PorGanaB_Pol_Azi(10),-2));
            set(handles.CGanaPol_Azi_nov,'String',roundn(PorGanaB_Pol_Azi(11),-2));
            set(handles.CGanaPol_Azi_dic,'String',roundn(PorGanaB_Pol_Azi(12),-2));

            set(handles.CGanaPol_Azi_media,'String',roundn(mean(PorGanaB_Pol_Azi),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGanaPol_Hor_ene,'String',roundn(PorGanaB_Pol_Hor(1),-2));
            set(handles.CGanaPol_Hor_feb,'String',roundn(PorGanaB_Pol_Hor(2),-2));
            set(handles.CGanaPol_Hor_mar,'String',roundn(PorGanaB_Pol_Hor(3),-2));
            set(handles.CGanaPol_Hor_abr,'String',roundn(PorGanaB_Pol_Hor(4),-2));
            set(handles.CGanaPol_Hor_may,'String',roundn(PorGanaB_Pol_Hor(5),-2));
            set(handles.CGanaPol_Hor_jun,'String',roundn(PorGanaB_Pol_Hor(6),-2));
            set(handles.CGanaPol_Hor_jul,'String',roundn(PorGanaB_Pol_Hor(7),-2));
            set(handles.CGanaPol_Hor_ago,'String',roundn(PorGanaB_Pol_Hor(8),-2));
            set(handles.CGanaPol_Hor_sep,'String',roundn(PorGanaB_Pol_Hor(9),-2));
            set(handles.CGanaPol_Hor_oct,'String',roundn(PorGanaB_Pol_Hor(10),-2));
            set(handles.CGanaPol_Hor_nov,'String',roundn(PorGanaB_Pol_Hor(11),-2));
            set(handles.CGanaPol_Hor_dic,'String',roundn(PorGanaB_Pol_Hor(12),-2));

            set(handles.CGanaPol_Hor_media,'String',roundn(mean(PorGanaB_Pol_Hor),-2)); 
        
        
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

       %Mostrar valores para el seguimiento a un eje polar
            set(handles.CEjePol_ene,'String',roundn(DdEjePolar(1),-2));
            set(handles.CEjePol_feb,'String',roundn(DdEjePolar(2),-2));
            set(handles.CEjePol_mar,'String',roundn(DdEjePolar(3),-2));
            set(handles.CEjePol_abr,'String',roundn(DdEjePolar(4),-2));
            set(handles.CEjePol_may,'String',roundn(DdEjePolar(5),-2));
            set(handles.CEjePol_jun,'String',roundn(DdEjePolar(6),-2));
            set(handles.CEjePol_jul,'String',roundn(DdEjePolar(7),-2));
            set(handles.CEjePol_ago,'String',roundn(DdEjePolar(8),-2));
            set(handles.CEjePol_sep,'String',roundn(DdEjePolar(9),-2));
            set(handles.CEjePol_oct,'String',roundn(DdEjePolar(10),-2));
            set(handles.CEjePol_nov,'String',roundn(DdEjePolar(11),-2));
            set(handles.CEjePol_dic,'String',roundn(DdEjePolar(12),-2));

            set(handles.CEjePol_media,'String',roundn(media_DdEjePolar,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaPol_0_ene,'String',roundn(PorGanaD_Pol_0(1),-2));
            set(handles.CGanaPol_0_feb,'String',roundn(PorGanaD_Pol_0(2),-2));
            set(handles.CGanaPol_0_mar,'String',roundn(PorGanaD_Pol_0(3),-2));
            set(handles.CGanaPol_0_abr,'String',roundn(PorGanaD_Pol_0(4),-2));
            set(handles.CGanaPol_0_may,'String',roundn(PorGanaD_Pol_0(5),-2));
            set(handles.CGanaPol_0_jun,'String',roundn(PorGanaD_Pol_0(6),-2));
            set(handles.CGanaPol_0_jul,'String',roundn(PorGanaD_Pol_0(7),-2));
            set(handles.CGanaPol_0_ago,'String',roundn(PorGanaD_Pol_0(8),-2));
            set(handles.CGanaPol_0_sep,'String',roundn(PorGanaD_Pol_0(9),-2));
            set(handles.CGanaPol_0_oct,'String',roundn(PorGanaD_Pol_0(10),-2));
            set(handles.CGanaPol_0_nov,'String',roundn(PorGanaD_Pol_0(11),-2));
            set(handles.CGanaPol_0_dic,'String',roundn(PorGanaD_Pol_0(12),-2));

            set(handles.CGanaPol_0_media,'String',roundn(mean(PorGanaD_Pol_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGanaPol_Anu_ene,'String',roundn(PorGanaD_Pol_Anu(1),-2));
            set(handles.CGanaPol_Anu_feb,'String',roundn(PorGanaD_Pol_Anu(2),-2));
            set(handles.CGanaPol_Anu_mar,'String',roundn(PorGanaD_Pol_Anu(3),-2));
            set(handles.CGanaPol_Anu_abr,'String',roundn(PorGanaD_Pol_Anu(4),-2));
            set(handles.CGanaPol_Anu_may,'String',roundn(PorGanaD_Pol_Anu(5),-2));
            set(handles.CGanaPol_Anu_jun,'String',roundn(PorGanaD_Pol_Anu(6),-2));
            set(handles.CGanaPol_Anu_jul,'String',roundn(PorGanaD_Pol_Anu(7),-2));
            set(handles.CGanaPol_Anu_ago,'String',roundn(PorGanaD_Pol_Anu(8),-2));
            set(handles.CGanaPol_Anu_sep,'String',roundn(PorGanaD_Pol_Anu(9),-2));
            set(handles.CGanaPol_Anu_oct,'String',roundn(PorGanaD_Pol_Anu(10),-2));
            set(handles.CGanaPol_Anu_nov,'String',roundn(PorGanaD_Pol_Anu(11),-2));
            set(handles.CGanaPol_Anu_dic,'String',roundn(PorGanaD_Pol_Anu(12),-2));

            set(handles.CGanaPol_Anu_media,'String',roundn(mean(PorGanaD_Pol_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGanaPol_Est_ene,'String',roundn(PorGanaD_Pol_Est(1),-2));
            set(handles.CGanaPol_Est_feb,'String',roundn(PorGanaD_Pol_Est(2),-2));
            set(handles.CGanaPol_Est_mar,'String',roundn(PorGanaD_Pol_Est(3),-2));
            set(handles.CGanaPol_Est_abr,'String',roundn(PorGanaD_Pol_Est(4),-2));
            set(handles.CGanaPol_Est_may,'String',roundn(PorGanaD_Pol_Est(5),-2));
            set(handles.CGanaPol_Est_jun,'String',roundn(PorGanaD_Pol_Est(6),-2));
            set(handles.CGanaPol_Est_jul,'String',roundn(PorGanaD_Pol_Est(7),-2));
            set(handles.CGanaPol_Est_ago,'String',roundn(PorGanaD_Pol_Est(8),-2));
            set(handles.CGanaPol_Est_sep,'String',roundn(PorGanaD_Pol_Est(9),-2));
            set(handles.CGanaPol_Est_oct,'String',roundn(PorGanaD_Pol_Est(10),-2));
            set(handles.CGanaPol_Est_nov,'String',roundn(PorGanaD_Pol_Est(11),-2));
            set(handles.CGanaPol_Est_dic,'String',roundn(PorGanaD_Pol_Est(12),-2));

            set(handles.CGanaPol_Est_media,'String',roundn(mean(PorGanaD_Pol_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaPol_Azi_ene,'String',roundn(PorGanaD_Pol_Azi(1),-2));
            set(handles.CGanaPol_Azi_feb,'String',roundn(PorGanaD_Pol_Azi(2),-2));
            set(handles.CGanaPol_Azi_mar,'String',roundn(PorGanaD_Pol_Azi(3),-2));
            set(handles.CGanaPol_Azi_abr,'String',roundn(PorGanaD_Pol_Azi(4),-2));
            set(handles.CGanaPol_Azi_may,'String',roundn(PorGanaD_Pol_Azi(5),-2));
            set(handles.CGanaPol_Azi_jun,'String',roundn(PorGanaD_Pol_Azi(6),-2));
            set(handles.CGanaPol_Azi_jul,'String',roundn(PorGanaD_Pol_Azi(7),-2));
            set(handles.CGanaPol_Azi_ago,'String',roundn(PorGanaD_Pol_Azi(8),-2));
            set(handles.CGanaPol_Azi_sep,'String',roundn(PorGanaD_Pol_Azi(9),-2));
            set(handles.CGanaPol_Azi_oct,'String',roundn(PorGanaD_Pol_Azi(10),-2));
            set(handles.CGanaPol_Azi_nov,'String',roundn(PorGanaD_Pol_Azi(11),-2));
            set(handles.CGanaPol_Azi_dic,'String',roundn(PorGanaD_Pol_Azi(12),-2));

            set(handles.CGanaPol_Azi_media,'String',roundn(mean(PorGanaD_Pol_Azi),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGanaPol_Hor_ene,'String',roundn(PorGanaD_Pol_Hor(1),-2));
            set(handles.CGanaPol_Hor_feb,'String',roundn(PorGanaD_Pol_Hor(2),-2));
            set(handles.CGanaPol_Hor_mar,'String',roundn(PorGanaD_Pol_Hor(3),-2));
            set(handles.CGanaPol_Hor_abr,'String',roundn(PorGanaD_Pol_Hor(4),-2));
            set(handles.CGanaPol_Hor_may,'String',roundn(PorGanaD_Pol_Hor(5),-2));
            set(handles.CGanaPol_Hor_jun,'String',roundn(PorGanaD_Pol_Hor(6),-2));
            set(handles.CGanaPol_Hor_jul,'String',roundn(PorGanaD_Pol_Hor(7),-2));
            set(handles.CGanaPol_Hor_ago,'String',roundn(PorGanaD_Pol_Hor(8),-2));
            set(handles.CGanaPol_Hor_sep,'String',roundn(PorGanaD_Pol_Hor(9),-2));
            set(handles.CGanaPol_Hor_oct,'String',roundn(PorGanaD_Pol_Hor(10),-2));
            set(handles.CGanaPol_Hor_nov,'String',roundn(PorGanaD_Pol_Hor(11),-2));
            set(handles.CGanaPol_Hor_dic,'String',roundn(PorGanaD_Pol_Hor(12),-2));

            set(handles.CGanaPol_Hor_media,'String',roundn(mean(PorGanaD_Pol_Hor),-2));
            

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

       %Mostrar valores para el seguimiento a un eje polar
            set(handles.CEjePol_ene,'String',roundn(RdEjePolar(1),-2));
            set(handles.CEjePol_feb,'String',roundn(RdEjePolar(2),-2));
            set(handles.CEjePol_mar,'String',roundn(RdEjePolar(3),-2));
            set(handles.CEjePol_abr,'String',roundn(RdEjePolar(4),-2));
            set(handles.CEjePol_may,'String',roundn(RdEjePolar(5),-2));
            set(handles.CEjePol_jun,'String',roundn(RdEjePolar(6),-2));
            set(handles.CEjePol_jul,'String',roundn(RdEjePolar(7),-2));
            set(handles.CEjePol_ago,'String',roundn(RdEjePolar(8),-2));
            set(handles.CEjePol_sep,'String',roundn(RdEjePolar(9),-2));
            set(handles.CEjePol_oct,'String',roundn(RdEjePolar(10),-2));
            set(handles.CEjePol_nov,'String',roundn(RdEjePolar(11),-2));
            set(handles.CEjePol_dic,'String',roundn(RdEjePolar(12),-2));

            set(handles.CEjePol_media,'String',roundn(media_RdEjePolar,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGanaPol_0_ene,'String', '-');
            set(handles.CGanaPol_0_feb,'String', '-');
            set(handles.CGanaPol_0_mar,'String', '-');
            set(handles.CGanaPol_0_abr,'String', '-');
            set(handles.CGanaPol_0_may,'String', '-');
            set(handles.CGanaPol_0_jun,'String', '-');
            set(handles.CGanaPol_0_jul,'String', '-');
            set(handles.CGanaPol_0_ago,'String', '-');
            set(handles.CGanaPol_0_sep,'String', '-');
            set(handles.CGanaPol_0_oct,'String', '-');
            set(handles.CGanaPol_0_nov,'String', '-');
            set(handles.CGanaPol_0_dic,'String', '-');

            set(handles.CGanaPol_0_media,'String', '-');

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
        
        if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaPol_Anu_ene,'String', '-');
            set(handles.CGanaPol_Anu_feb,'String', '-');
            set(handles.CGanaPol_Anu_mar,'String', '-');
            set(handles.CGanaPol_Anu_abr,'String', '-');
            set(handles.CGanaPol_Anu_may,'String', '-');
            set(handles.CGanaPol_Anu_jun,'String', '-');
            set(handles.CGanaPol_Anu_jul,'String', '-');
            set(handles.CGanaPol_Anu_ago,'String', '-');
            set(handles.CGanaPol_Anu_sep,'String', '-');
            set(handles.CGanaPol_Anu_oct,'String', '-');
            set(handles.CGanaPol_Anu_nov,'String', '-');
            set(handles.CGanaPol_Anu_dic,'String', '-');

            set(handles.CGanaPol_Anu_media,'String', '-');
        else
            set(handles.CGanaPol_Anu_ene,'String',roundn(PorGanaR_Pol_Anu(1),-2));
            set(handles.CGanaPol_Anu_feb,'String',roundn(PorGanaR_Pol_Anu(2),-2));
            set(handles.CGanaPol_Anu_mar,'String',roundn(PorGanaR_Pol_Anu(3),-2));
            set(handles.CGanaPol_Anu_abr,'String',roundn(PorGanaR_Pol_Anu(4),-2));
            set(handles.CGanaPol_Anu_may,'String',roundn(PorGanaR_Pol_Anu(5),-2));
            set(handles.CGanaPol_Anu_jun,'String',roundn(PorGanaR_Pol_Anu(6),-2));
            set(handles.CGanaPol_Anu_jul,'String',roundn(PorGanaR_Pol_Anu(7),-2));
            set(handles.CGanaPol_Anu_ago,'String',roundn(PorGanaR_Pol_Anu(8),-2));
            set(handles.CGanaPol_Anu_sep,'String',roundn(PorGanaR_Pol_Anu(9),-2));
            set(handles.CGanaPol_Anu_oct,'String',roundn(PorGanaR_Pol_Anu(10),-2));
            set(handles.CGanaPol_Anu_nov,'String',roundn(PorGanaR_Pol_Anu(11),-2));
            set(handles.CGanaPol_Anu_dic,'String',roundn(PorGanaR_Pol_Anu(12),-2));

            set(handles.CGanaPol_Anu_media,'String',roundn(mean(PorGanaR_Pol_Anu),-2));
        end
        
        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
        if angOptim_Inv==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaPol_Est_dic,'String', '-');
            set(handles.CGanaPol_Est_ene,'String', '-');
            set(handles.CGanaPol_Est_feb,'String', '-');  
        else
            set(handles.CGanaPol_Est_dic,'String',roundn(PorGanaR_Pol_Est(12),-2));
            set(handles.CGanaPol_Est_ene,'String',roundn(PorGanaR_Pol_Est(1),-2));
            set(handles.CGanaPol_Est_feb,'String',roundn(PorGanaR_Pol_Est(2),-2));  
        end
        
        
        if angOptim_Pri==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaPol_Est_mar,'String','-');  
            set(handles.CGanaPol_Est_abr,'String','-');  
            set(handles.CGanaPol_Est_may,'String','-'); 
        else
            set(handles.CGanaPol_Est_mar,'String',roundn(PorGanaR_Pol_Est(3),-2)); 
            set(handles.CGanaPol_Est_abr,'String',roundn(PorGanaR_Pol_Est(4),-2)); 
            set(handles.CGanaPol_Est_may,'String',roundn(PorGanaR_Pol_Est(5),-2));
        end
        
        
        if angOptim_Ver==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaPol_Est_jun,'String','-');
            set(handles.CGanaPol_Est_jul,'String','-');
            set(handles.CGanaPol_Est_ago,'String','-');
        else
            set(handles.CGanaPol_Est_jun,'String',roundn(PorGanaR_Pol_Est(6),-2));
            set(handles.CGanaPol_Est_jul,'String',roundn(PorGanaR_Pol_Est(7),-2));
            set(handles.CGanaPol_Est_ago,'String',roundn(PorGanaR_Pol_Est(8),-2));
        end
        
        if angOptim_Oto==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGanaPol_Est_sep,'String','-');
            set(handles.CGanaPol_Est_oct,'String','-');
            set(handles.CGanaPol_Est_nov,'String','-');
        else
            set(handles.CGanaPol_Est_sep,'String',roundn(PorGanaR_Pol_Est(9),-2));
            set(handles.CGanaPol_Est_oct,'String',roundn(PorGanaR_Pol_Est(10),-2)); 
            set(handles.CGanaPol_Est_nov,'String',roundn(PorGanaR_Pol_Est(11),-2)); 
        end
        
        if mean(PorGanaR_Pol_Est)==Inf
            set(handles.CGanaPol_Est_media,'String','-');
        else   
            set(handles.CGanaPol_Est_media,'String',roundn(mean(PorGanaR_Pol_Est),-2));
        end    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGanaPol_Azi_ene,'String',roundn(PorGanaR_Pol_Azi(1),-2));
            set(handles.CGanaPol_Azi_feb,'String',roundn(PorGanaR_Pol_Azi(2),-2));
            set(handles.CGanaPol_Azi_mar,'String',roundn(PorGanaR_Pol_Azi(3),-2));
            set(handles.CGanaPol_Azi_abr,'String',roundn(PorGanaR_Pol_Azi(4),-2));
            set(handles.CGanaPol_Azi_may,'String',roundn(PorGanaR_Pol_Azi(5),-2));
            set(handles.CGanaPol_Azi_jun,'String',roundn(PorGanaR_Pol_Azi(6),-2));
            set(handles.CGanaPol_Azi_jul,'String',roundn(PorGanaR_Pol_Azi(7),-2));
            set(handles.CGanaPol_Azi_ago,'String',roundn(PorGanaR_Pol_Azi(8),-2));
            set(handles.CGanaPol_Azi_sep,'String',roundn(PorGanaR_Pol_Azi(9),-2));
            set(handles.CGanaPol_Azi_oct,'String',roundn(PorGanaR_Pol_Azi(10),-2));
            set(handles.CGanaPol_Azi_nov,'String',roundn(PorGanaR_Pol_Azi(11),-2));
            set(handles.CGanaPol_Azi_dic,'String',roundn(PorGanaR_Pol_Azi(12),-2));

            set(handles.CGanaPol_Azi_media,'String',roundn(mean(PorGanaR_Pol_Azi),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGanaPol_Hor_ene,'String',roundn(PorGanaR_Pol_Hor(1),-2));
            set(handles.CGanaPol_Hor_feb,'String',roundn(PorGanaR_Pol_Hor(2),-2));
            set(handles.CGanaPol_Hor_mar,'String',roundn(PorGanaR_Pol_Hor(3),-2));
            set(handles.CGanaPol_Hor_abr,'String',roundn(PorGanaR_Pol_Hor(4),-2));
            set(handles.CGanaPol_Hor_may,'String',roundn(PorGanaR_Pol_Hor(5),-2));
            set(handles.CGanaPol_Hor_jun,'String',roundn(PorGanaR_Pol_Hor(6),-2));
            set(handles.CGanaPol_Hor_jul,'String',roundn(PorGanaR_Pol_Hor(7),-2));
            set(handles.CGanaPol_Hor_ago,'String',roundn(PorGanaR_Pol_Hor(8),-2));
            set(handles.CGanaPol_Hor_sep,'String',roundn(PorGanaR_Pol_Hor(9),-2));
            set(handles.CGanaPol_Hor_oct,'String',roundn(PorGanaR_Pol_Hor(10),-2));
            set(handles.CGanaPol_Hor_nov,'String',roundn(PorGanaR_Pol_Hor(11),-2));
            set(handles.CGanaPol_Hor_dic,'String',roundn(PorGanaR_Pol_Hor(12),-2));

            set(handles.CGanaPol_Hor_media,'String',roundn(mean(PorGanaR_Pol_Hor),-2));
            
        
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
    
global OPCION_COMP
global NOMBRE_CIUDAD;

global angulo_optimo;
%Global
global DATOS;
global GdEjePolar media_GdEjePolar;
global GanaG_Pol_0 GanaG_Pol_Anu GanaG_Pol_Est GanaG_Pol_Azi GanaG_Pol_Hor PorGanaG_Pol_0 PorGanaG_Pol_Anu PorGanaG_Pol_Est PorGanaG_Pol_Azi PorGanaG_Pol_Hor;
%Directa
global Val_Bdm0;
global BdEjePolar media_BdEjePolar;
global GanaB_Pol_0 GanaB_Pol_Anu GanaB_Pol_Est GanaB_Pol_Azi GanaB_Pol_Hor PorGanaB_Pol_0 PorGanaB_Pol_Anu PorGanaB_Pol_Est PorGanaB_Pol_Azi PorGanaB_Pol_Hor;
%Difusa
global Val_Ddm0;
global DdEjePolar media_DdEjePolar;
global GanaD_Pol_0 GanaD_Pol_Anu GanaD_Pol_Est GanaD_Pol_Azi GanaD_Pol_Hor PorGanaD_Pol_0 PorGanaD_Pol_Anu PorGanaD_Pol_Est PorGanaD_Pol_Azi PorGanaD_Pol_Hor;
%Albedo
global RdEjePolar media_RdEjePolar;
global GanaR_Pol_Anu GanaR_Pol_Est GanaR_Pol_Azi GanaR_Pol_Hor  PorGanaR_Pol_Anu PorGanaR_Pol_Est PorGanaR_Pol_Azi PorGanaR_Pol_Hor;
%ERROR global GanaR_Pol_0 PorGanaR_Pol_0

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

                    escribirG(1,5)={'Seguimiento a un eje polar'};

                    escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirG(j+4,1) = Meses(j);
                    end

                    %Títulos Gdm(0º),  Gdm(Eje Polar)---------------------------
                    escribirG(4,2)={'Gdm(0º)'};
                    escribirG(4,3)={'Gdm(Seg. a un eje polar)'};


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
                        escribirG(i+4,3) = {GdEjePolar(i)};
                    end
                    %Media
                    escribirG(17,3)={media_GdEjePolar;};

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
                    escribirG(21,11)={'Seg. a un eje azimutal'};
                    escribirG(21,14)={'Seg. a un eje horizontal'};

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
                        escribirG(i+22,2)={GanaG_Pol_0(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,3)={PorGanaG_Pol_0(i)};
                    end 
                    %medias
                    escribirG(35,2)={mean(GanaG_Pol_0)};
                    escribirG(35,3)={mean(PorGanaG_Pol_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirG(i+22,5)={GanaG_Pol_Anu(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,6)={PorGanaG_Pol_Anu(i)};
                    end
                    %medias
                    escribirG(35,5)={mean(GanaG_Pol_Anu)};
                    escribirG(35,6)={mean(PorGanaG_Pol_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirG(i+22,8)={GanaG_Pol_Est(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,9)={PorGanaG_Pol_Est(i)};
                    end
                    %medias
                    escribirG(35,8)={mean(GanaG_Pol_Est)};
                    escribirG(35,9)={mean(PorGanaG_Pol_Est)};

                    %Seguimiento Azimutal----------------------
                    for i=1:12
                        escribirG(i+22,11)={GanaG_Pol_Azi(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,12)={PorGanaG_Pol_Azi(i)};
                    end
                    %medias
                    escribirG(35,11)={mean(GanaG_Pol_Azi)};
                    escribirG(35,12)={mean(PorGanaG_Pol_Azi)};

                    %Seguimiento Horizontal--------------------
                    for i=1:12
                        escribirG(i+22,14)={GanaG_Pol_Hor(i)};
                    end 
                    for i=1:12
                        escribirG(i+22,15)={PorGanaG_Pol_Hor(i)};
                    end
                    %medias
                    escribirG(35,14)={mean(GanaG_Pol_Hor)};
                    escribirG(35,15)={mean(PorGanaG_Pol_Hor)};
                    
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

                    escribirB(1,5)={'Seguimiento a un eje polar'};

                    escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirB(j+4,1) = Meses(j);
                    end

                    %Títulos Bdm(0º),  Bdm(Eje Polar)---------------------------
                    escribirB(4,2)={'Bdm(0º)'};
                    escribirB(4,3)={'Bdm(Seg. a un eje polar)'};


                    %Valores
                    %Gdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirB(k+4,2) = {Val_Bdm0(k)};
                    end
                    %Media
                    escribirB(17,2)={mean(Val_Bdm0)};     

                    %Bdm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirB(i+4,3) = {BdEjePolar(i)};
                    end
                    %Media
                    escribirB(17,3)={media_BdEjePolar;};

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
                    escribirB(21,11)={'Seg. a un eje azimutal'};
                    escribirB(21,14)={'Seg. a un eje horizontal'};

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
                        escribirB(i+22,2)={GanaB_Pol_0(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,3)={PorGanaB_Pol_0(i)};
                    end 
                    %medias
                    escribirB(35,2)={mean(GanaB_Pol_0)};
                    escribirB(35,3)={mean(PorGanaB_Pol_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirB(i+22,5)={GanaB_Pol_Anu(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,6)={PorGanaB_Pol_Anu(i)};
                    end
                    %medias
                    escribirB(35,5)={mean(GanaB_Pol_Anu)};
                    escribirB(35,6)={mean(PorGanaB_Pol_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirB(i+22,8)={GanaB_Pol_Est(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,9)={PorGanaB_Pol_Est(i)};
                    end
                    %medias
                    escribirB(35,8)={mean(GanaB_Pol_Est)};
                    escribirB(35,9)={mean(PorGanaB_Pol_Est)};

                    %Seguimiento Azimutal----------------------
                    for i=1:12
                        escribirB(i+22,11)={GanaB_Pol_Azi(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,12)={PorGanaB_Pol_Azi(i)};
                    end
                    %medias
                    escribirB(35,11)={mean(GanaB_Pol_Azi)};
                    escribirB(35,12)={mean(PorGanaB_Pol_Azi)};

                    %Seguimiento Horizontal--------------------
                    for i=1:12
                        escribirB(i+22,14)={GanaB_Pol_Hor(i)};
                    end 
                    for i=1:12
                        escribirB(i+22,15)={PorGanaB_Pol_Hor(i)};
                    end
                    %medias
                    escribirB(35,14)={mean(GanaB_Pol_Hor)};
                    escribirB(35,15)={mean(PorGanaB_Pol_Hor)};                 
               
               
               
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

                    escribirD(1,5)={'Seguimiento a un eje polar'};

                    escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirD(j+4,1) = Meses(j);
                    end

                    %Títulos Ddm(0º),  Ddm(Eje Polar)---------------------------
                    escribirD(4,2)={'Ddm(0º)'};
                    escribirD(4,3)={'Ddm(Seg. a un eje polar)'};


                    %Valores
                    %Ddm (0º)--------------------------------------------------
                    for k=1:12
                        escribirD(k+4,2) = {Val_Ddm0(k)};
                    end
                    %Media
                    escribirD(17,2)={mean(Val_Ddm0)};     

                    %Ddm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirD(i+4,3) = {DdEjePolar(i)};
                    end
                    %Media
                    escribirD(17,3)={media_DdEjePolar;};

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
                    escribirD(21,11)={'Seg. a un eje azimutal'};
                    escribirD(21,14)={'Seg. a un eje horizontal'};

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
                        escribirD(i+22,2)={GanaD_Pol_0(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,3)={PorGanaD_Pol_0(i)};
                    end 
                    %medias
                    escribirD(35,2)={mean(GanaD_Pol_0)};
                    escribirD(35,3)={mean(PorGanaD_Pol_0)};
                    %Inclinación óptima anual------------------
                    for i=1:12
                        escribirD(i+22,5)={GanaD_Pol_Anu(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,6)={PorGanaD_Pol_Anu(i)};
                    end
                    %medias
                    escribirD(35,5)={mean(GanaD_Pol_Anu)};
                    escribirD(35,6)={mean(PorGanaD_Pol_Anu)};

                    %Inclinación óptima estacional-------------
                    for i=1:12
                        escribirD(i+22,8)={GanaD_Pol_Est(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,9)={PorGanaD_Pol_Est(i)};
                    end
                    %medias
                    escribirD(35,8)={mean(GanaD_Pol_Est)};
                    escribirD(35,9)={mean(PorGanaD_Pol_Est)};

                    %Seguimiento Azimutal----------------------
                    for i=1:12
                        escribirD(i+22,11)={GanaD_Pol_Azi(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,12)={PorGanaD_Pol_Azi(i)};
                    end
                    %medias
                    escribirD(35,11)={mean(GanaD_Pol_Azi)};
                    escribirD(35,12)={mean(PorGanaD_Pol_Azi)};

                    %Seguimiento Horizontal--------------------
                    for i=1:12
                        escribirD(i+22,14)={GanaD_Pol_Hor(i)};
                    end 
                    for i=1:12
                        escribirD(i+22,15)={PorGanaD_Pol_Hor(i)};
                    end
                    %medias
                    escribirD(35,14)={mean(GanaD_Pol_Hor)};
                    escribirD(35,15)={mean(PorGanaD_Pol_Hor)};  
               
               
               
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

                    escribirR(1,5)={'Seguimiento a un eje polar'};

                    escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};



                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirR(j+4,1) = Meses(j);
                    end

                    %Títulos Rdm(0º),  Rdm(Eje Polar)---------------------------
                    escribirR(4,2)={'Rdm(0º)'};
                    escribirR(4,3)={'Rdm(Seg. a un eje polar)'};


                    %Valores
                    %Rdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirR(k+4,2) = {0};
                    end
                    %Media
                    escribirR(17,2)={0};     

                    %Rdm (Seguimiento)-----------------------------------------
                    for i=1:12
                        escribirR(i+4,3) = {RdEjePolar(i)};
                    end
                    %Media
                    escribirR(17,3)={media_RdEjePolar};

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
                    escribirR(21,11)={'Seg. a un eje azimutal'};
                    escribirR(21,14)={'Seg. a un eje horizontal'};

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
                    if angulo_optimo == 0   
            
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
                            escribirR(i+22,5)={GanaR_Pol_Anu(i)};
                        end 
                        for i=1:12
                            escribirR(i+22,6)={PorGanaR_Pol_Anu(i)};
                        end
                        %medias
                        escribirR(35,5)={mean(GanaR_Pol_Anu)};
                        escribirR(35,6)={mean(PorGanaR_Pol_Anu)};
                    end

                    %Inclinación óptima estacional------(-------(CAMBIO)-------)-----
                    for i=1:12
                        if GanaR_Pol_Est(i)== Inf
                            escribirR(i+22,8)={'-'};
                        else
                        escribirR(i+22,8)={GanaR_Pol_Est(i)};
                        end 
                    end
                    for i=1:12
                        if GanaR_Pol_Est(i)== Inf
                            escribirR(i+22,9)={'-'};
                        else
                        escribirR(i+22,9)={PorGanaR_Pol_Est(i)};
                        end
                    end
                    %medias
                    if mean(GanaR_Pol_Est)==Inf
                        escribirR(35,8)={'-'};
                        escribirR(35,9)={'-'};
                    else
                    escribirR(35,8)={mean(GanaR_Pol_Est)};
                    escribirR(35,9)={mean(PorGanaR_Pol_Est)};
                    end
                    %Seguimiento Azimutal----------------------
                    for i=1:12
                        escribirR(i+22,11)={GanaR_Pol_Azi(i)};
                    end 
                    for i=1:12
                        escribirR(i+22,12)={PorGanaR_Pol_Azi(i)};
                    end
                    %medias
                    escribirR(35,11)={mean(GanaR_Pol_Azi)};
                    escribirR(35,12)={mean(PorGanaR_Pol_Azi)};

                    %Seguimiento Horizontal--------------------
                    for i=1:12
                        escribirR(i+22,14)={GanaR_Pol_Hor(i)};
                    end 
                    for i=1:12
                        escribirR(i+22,15)={PorGanaR_Pol_Hor(i)};
                    end
                    %medias
                    escribirR(35,14)={mean(GanaR_Pol_Hor)};
                    escribirR(35,15)={mean(PorGanaR_Pol_Hor)};   
               
               
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
        
        escribirG(1,5)={'Seguimiento a un eje polar'};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirG(j+4,1) = Meses(j);
        end
        
        %Títulos Gdm(0º),  Gdm(Eje Polar)---------------------------
        escribirG(4,2)={'Gdm(0º)'};
        escribirG(4,3)={'Gdm(Seg. a un eje polar)'};
        
        
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
            escribirG(i+4,3) = {GdEjePolar(i)};
        end
        %Media
        escribirG(17,3)={media_GdEjePolar};
        
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
        escribirG(21,11)={'Seg. a un eje azimutal'};
        escribirG(21,14)={'Seg. a un eje horizontal'};
        
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
            escribirG(i+22,2)={GanaG_Pol_0(i)};
        end 
        for i=1:12
            escribirG(i+22,3)={PorGanaG_Pol_0(i)};
        end 
        %medias
        escribirG(35,2)={mean(GanaG_Pol_0)};
        escribirG(35,3)={mean(PorGanaG_Pol_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirG(i+22,5)={GanaG_Pol_Anu(i)};
        end 
        for i=1:12
            escribirG(i+22,6)={PorGanaG_Pol_Anu(i)};
        end
        %medias
        escribirG(35,5)={mean(GanaG_Pol_Anu)};
        escribirG(35,6)={mean(PorGanaG_Pol_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirG(i+22,8)={GanaG_Pol_Est(i)};
        end 
        for i=1:12
            escribirG(i+22,9)={PorGanaG_Pol_Est(i)};
        end
        %medias
        escribirG(35,8)={mean(GanaG_Pol_Est)};
        escribirG(35,9)={mean(PorGanaG_Pol_Est)};
        
        %Seguimiento Azimutal----------------------
        for i=1:12
            escribirG(i+22,11)={GanaG_Pol_Azi(i)};
        end 
        for i=1:12
            escribirG(i+22,12)={PorGanaG_Pol_Azi(i)};
        end
        %medias
        escribirG(35,11)={mean(GanaG_Pol_Azi)};
        escribirG(35,12)={mean(PorGanaG_Pol_Azi)};
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirG(i+22,14)={GanaG_Pol_Hor(i)};
        end 
        for i=1:12
            escribirG(i+22,15)={PorGanaG_Pol_Hor(i)};
        end
        %medias
        escribirG(35,14)={mean(GanaG_Pol_Hor)};
        escribirG(35,15)={mean(PorGanaG_Pol_Hor)};
        
        %RADIACIÓN DIRECTA DIARIA::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Seguimiento a un eje polar'};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirB(j+4,1) = Meses(j);
        end
        
        %Títulos Bdm(0º),  Bdm(Eje Polar)---------------------------
        escribirB(4,2)={'Bdm(0º)'};
        escribirB(4,3)={'Bdm(Seg. a un eje polar)'};
        
        
        %Valores
        %Gdm (0º)--------------------------------------------------
        for k=1:12
            escribirB(k+4,2) = {Val_Bdm0(k)};
        end
        %Media
        escribirB(17,2)={mean(Val_Bdm0)};     
              
        %Bdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirB(i+4,3) = {BdEjePolar(i)};
        end
        %Media
        escribirB(17,3)={media_BdEjePolar;};
        
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
        escribirB(21,11)={'Seg. a un eje azimutal'};
        escribirB(21,14)={'Seg. a un eje horizontal'};
        
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
            escribirB(i+22,2)={GanaB_Pol_0(i)};
        end 
        for i=1:12
            escribirB(i+22,3)={PorGanaB_Pol_0(i)};
        end 
        %medias
        escribirB(35,2)={mean(GanaB_Pol_0)};
        escribirB(35,3)={mean(PorGanaB_Pol_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirB(i+22,5)={GanaB_Pol_Anu(i)};
        end 
        for i=1:12
            escribirB(i+22,6)={PorGanaB_Pol_Anu(i)};
        end
        %medias
        escribirB(35,5)={mean(GanaB_Pol_Anu)};
        escribirB(35,6)={mean(PorGanaB_Pol_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirB(i+22,8)={GanaB_Pol_Est(i)};
        end 
        for i=1:12
            escribirB(i+22,9)={PorGanaB_Pol_Est(i)};
        end
        %medias
        escribirB(35,8)={mean(GanaB_Pol_Est)};
        escribirB(35,9)={mean(PorGanaB_Pol_Est)};
        
        %Seguimiento Azimutal----------------------
        for i=1:12
            escribirB(i+22,11)={GanaB_Pol_Azi(i)};
        end 
        for i=1:12
            escribirB(i+22,12)={PorGanaB_Pol_Azi(i)};
        end
        %medias
        escribirB(35,11)={mean(GanaB_Pol_Azi)};
        escribirB(35,12)={mean(PorGanaB_Pol_Azi)};
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirB(i+22,14)={GanaB_Pol_Hor(i)};
        end 
        for i=1:12
            escribirB(i+22,15)={PorGanaB_Pol_Hor(i)};
        end
        %medias
        escribirB(35,14)={mean(GanaB_Pol_Hor)};
        escribirB(35,15)={mean(PorGanaB_Pol_Hor)};        
        
        %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Seguimiento a un eje polar'};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirD(j+4,1) = Meses(j);
        end
        
        %Títulos Ddm(0º),  Ddm(Eje Polar)---------------------------
        escribirD(4,2)={'Ddm(0º)'};
        escribirD(4,3)={'Ddm(Seg. a un eje polar)'};
        
        
        %Valores
        %Ddm (0º)--------------------------------------------------
        for k=1:12
            escribirD(k+4,2) = {Val_Ddm0(k)};
        end
        %Media
        escribirD(17,2)={mean(Val_Ddm0)};     
              
        %Ddm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirD(i+4,3) = {DdEjePolar(i)};
        end
        %Media
        escribirD(17,3)={media_DdEjePolar};
        
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
        escribirD(21,11)={'Seg. a un eje azimutal'};
        escribirD(21,14)={'Seg. a un eje horizontal'};
        
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
            escribirD(i+22,2)={GanaD_Pol_0(i)};
        end 
        for i=1:12
            escribirD(i+22,3)={PorGanaD_Pol_0(i)};
        end 
        %medias
        escribirD(35,2)={mean(GanaD_Pol_0)};
        escribirD(35,3)={mean(PorGanaD_Pol_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirD(i+22,5)={GanaD_Pol_Anu(i)};
        end 
        for i=1:12
            escribirD(i+22,6)={PorGanaD_Pol_Anu(i)};
        end
        %medias
        escribirD(35,5)={mean(GanaD_Pol_Anu)};
        escribirD(35,6)={mean(PorGanaD_Pol_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirD(i+22,8)={GanaD_Pol_Est(i)};
        end 
        for i=1:12
            escribirD(i+22,9)={PorGanaD_Pol_Est(i)};
        end
        %medias
        escribirD(35,8)={mean(GanaD_Pol_Est)};
        escribirD(35,9)={mean(PorGanaD_Pol_Est)};
        
        %Seguimiento Azimutal----------------------
        for i=1:12
            escribirD(i+22,11)={GanaD_Pol_Azi(i)};
        end 
        for i=1:12
            escribirD(i+22,12)={PorGanaD_Pol_Azi(i)};
        end
        %medias
        escribirD(35,11)={mean(GanaD_Pol_Azi)};
        escribirD(35,12)={mean(PorGanaD_Pol_Azi)};
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirD(i+22,14)={GanaD_Pol_Hor(i)};
        end 
        for i=1:12
            escribirD(i+22,15)={PorGanaD_Pol_Hor(i)};
        end
        %medias
        escribirD(35,14)={mean(GanaD_Pol_Hor)};
        escribirD(35,15)={mean(PorGanaD_Pol_Hor)};        
        
        %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Seguimiento a un eje polar'};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirR(j+4,1) = Meses(j);
        end
        
        %Títulos Rdm(0º),  Rdm(Eje Polar)---------------------------
        escribirR(4,2)={'Rdm(0º)'};
        escribirR(4,3)={'Rdm(Seg. a un eje polar)'};
        
        
        %Valores
        %Rdm (0º)--------------------------------------------------
        for k=1:12
            escribirR(k+4,2) = {0};
        end
        %Media
        escribirR(17,2)={0};     
              
        %Rdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirR(i+4,3) = {RdEjePolar(i)};
        end
        %Media
        escribirR(17,3)={media_RdEjePolar};
        
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
        escribirR(21,11)={'Seg. a un eje azimutal'};
        escribirR(21,14)={'Seg. a un eje horizontal'};
        
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
        if angulo_optimo == 0   %sería para Rdm(0º) --- Inf
            
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
                escribirR(i+22,5)={GanaR_Pol_Anu(i)};
            end 
            for i=1:12
                escribirR(i+22,6)={PorGanaR_Pol_Anu(i)};
            end
            %medias
            escribirR(35,5)={mean(GanaR_Pol_Anu)};
            escribirR(35,6)={mean(PorGanaR_Pol_Anu)};
        end
        %Inclinación óptima estacional-------------(-------(CAMBIO)-------)
        for i=1:12
            if GanaR_Pol_Est(i)== Inf
                escribirR(i+22,8)={'-'};
            else
            escribirR(i+22,8)={GanaR_Pol_Est(i)};
            end 
        end
        for i=1:12
            if GanaR_Pol_Est(i)== Inf
                escribirR(i+22,9)={'-'};
            else
            escribirR(i+22,9)={PorGanaR_Pol_Est(i)};
            end
        end
        %medias
        if mean(GanaR_Pol_Est)==Inf
            escribirR(35,8)={'-'};
            escribirR(35,9)={'-'};
        else
        escribirR(35,8)={mean(GanaR_Pol_Est)};
        escribirR(35,9)={mean(PorGanaR_Pol_Est)};
        end
        
        %Seguimiento Azimutal----------------------
        for i=1:12
            escribirR(i+22,11)={GanaR_Pol_Azi(i)};
        end 
        for i=1:12
            escribirR(i+22,12)={PorGanaR_Pol_Azi(i)};
        end
        %medias
        escribirR(35,11)={mean(GanaR_Pol_Azi)};
        escribirR(35,12)={mean(PorGanaR_Pol_Azi)};
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirR(i+22,14)={GanaR_Pol_Hor(i)};
        end 
        for i=1:12
            escribirR(i+22,15)={PorGanaR_Pol_Hor(i)};
        end
        %medias
        escribirR(35,14)={mean(GanaR_Pol_Hor)};
        escribirR(35,15)={mean(PorGanaR_Pol_Hor)};    
        
        
         
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
global  DATOS RadG0 medRadG0;
global PorGanaG_Pol_0 PorGanaG_Pol_Anu PorGanaG_Pol_Est PorGanaG_Pol_Azi PorGanaG_Pol_Hor;
global medPorGanaG_Pol_0 medPorGanaG_Pol_Anu medPorGanaG_Pol_Est medPorGanaG_Pol_Azi medPorGanaG_Pol_Hor;
%B
global Val_Bdm0 medRadB0;
global PorGanaB_Pol_0 PorGanaB_Pol_Anu PorGanaB_Pol_Est PorGanaB_Pol_Azi PorGanaB_Pol_Hor;
global medPorGanaB_Pol_0 medPorGanaB_Pol_Anu medPorGanaB_Pol_Est medPorGanaB_Pol_Azi medPorGanaB_Pol_Hor;
%D
global Val_Ddm0 medRadD0;
global PorGanaD_Pol_0 PorGanaD_Pol_Anu PorGanaD_Pol_Est PorGanaD_Pol_Azi PorGanaD_Pol_Hor;
global medPorGanaD_Pol_0 medPorGanaD_Pol_Anu medPorGanaD_Pol_Est medPorGanaD_Pol_Azi medPorGanaD_Pol_Hor;
%R
global Val_Rdm0 medRadR0;
global PorGanaR_Pol_0 PorGanaR_Pol_Anu PorGanaR_Pol_Est PorGanaR_Pol_Azi PorGanaR_Pol_Hor;
global medPorGanaR_Pol_0 medPorGanaR_Pol_Anu medPorGanaR_Pol_Est medPorGanaR_Pol_Azi medPorGanaR_Pol_Hor;

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
medPorGanaG_Pol_0 = mean(PorGanaG_Pol_0);
medPorGanaG_Pol_Anu = mean(PorGanaG_Pol_Anu);
medPorGanaG_Pol_Est = mean(PorGanaG_Pol_Est);
medPorGanaG_Pol_Azi = mean(PorGanaG_Pol_Azi);
medPorGanaG_Pol_Hor = mean(PorGanaG_Pol_Hor);

%DIRECTA-----------------------------------
%Media radiación directa 0º
medRadB0 = mean (Val_Bdm0);

%Ganancias
medPorGanaB_Pol_0 = mean(PorGanaB_Pol_0);
medPorGanaB_Pol_Anu = mean(PorGanaB_Pol_Anu);
medPorGanaB_Pol_Est = mean(PorGanaB_Pol_Est);
medPorGanaB_Pol_Azi = mean(PorGanaB_Pol_Azi);
medPorGanaB_Pol_Hor = mean(PorGanaB_Pol_Hor);

%DIFUSA-------------------------------------
%Media radiación directa 0º
medRadD0 = mean (Val_Ddm0);

%Ganancias
medPorGanaD_Pol_0 = mean(PorGanaD_Pol_0);
medPorGanaD_Pol_Anu = mean(PorGanaD_Pol_Anu);
medPorGanaD_Pol_Est = mean(PorGanaD_Pol_Est);
medPorGanaD_Pol_Azi = mean(PorGanaD_Pol_Azi);
medPorGanaD_Pol_Hor = mean(PorGanaD_Pol_Hor);

%ALBEDO-----------------------------------
%Media radiación directa 0º
Val_Rdm0 = zeros(1,12);
medRadR0 = 0;
 
%Ganancias
medPorGanaR_Pol_0 = mean(PorGanaR_Pol_0);
medPorGanaR_Pol_Anu = mean(PorGanaR_Pol_Anu);
medPorGanaR_Pol_Est = mean(PorGanaR_Pol_Est);
medPorGanaR_Pol_Azi = mean(PorGanaR_Pol_Azi);
medPorGanaR_Pol_Hor = mean(PorGanaR_Pol_Hor);

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'
        report ReportSegEjePolar.rpt;

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

close ('OrientSol 3.0 - Seguimiento a un eje polar');
 

% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_EjePolar;

close ('OrientSol 3.0 - Seguimiento a un eje polar');

% --- Executes on button press in Energia.
function Energia_Callback(hObject, eventdata, handles)
global DATOS;
global GdEjePolar;

global RADIACION_OST;

global VOLVER_ENER;

VOLVER_ENER = 3;

RADIACION_OST  = GdEjePolar;

if (DATOS(15)==1000)
   
   Energia_Osterwald_N; 
   close ('OrientSol 3.0 - Seguimiento a un eje polar');
   
else 
   
   Energia_Osterwald;
   close ('OrientSol 3.0 - Seguimiento a un eje polar');
   
end

%global RADIACION
%RADIACION  = mean(GdEjePolar);
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
