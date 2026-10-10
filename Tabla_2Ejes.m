function varargout = Tabla_2Ejes(varargin)
% TABLA_2EJES MATLAB code for Tabla_2Ejes.fig
%      TABLA_2EJES, by itself, creates a new TABLA_2EJES or raises the existing
%      singleton*.
%
%      H = TABLA_2EJES returns the handle to a new TABLA_2EJES or the handle to
%      the existing singleton*.
%
%      TABLA_2EJES('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_2EJES.M with the given input arguments.
%
%      TABLA_2EJES('Property','Value',...) creates a new TABLA_2EJES or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_2Ejes_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_2Ejes_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_2Ejes

% Last Modified by GUIDE v2.5 22-Jan-2015 17:25:30

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_2Ejes_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_2Ejes_OutputFcn, ...
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


% --- Executes just before Tabla_2Ejes is made visible.
function Tabla_2Ejes_OpeningFcn(hObject, eventdata, handles, varargin)

global OPCION_COMP;

global NOMBRE_CIUDAD DATOS; 

global Gd2Ejes media_Gd2Ejes;
%Ganancias==========================
global PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;

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

imagen_2ejes=imread('Seguimiento2Ejes.jpg');
imagen1_2ejes=imresize(imagen_2ejes,[509 1078]); %Para ajustarlo directamente
imshow(imagen1_2ejes);
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
    

%Mostrar valores para el seguimiento a dos ejes
    set(handles.C2Ejes_ene,'String',roundn(Gd2Ejes(1),-2));
    set(handles.C2Ejes_feb,'String',roundn(Gd2Ejes(2),-2));
    set(handles.C2Ejes_mar,'String',roundn(Gd2Ejes(3),-2));
    set(handles.C2Ejes_abr,'String',roundn(Gd2Ejes(4),-2));
    set(handles.C2Ejes_may,'String',roundn(Gd2Ejes(5),-2));
    set(handles.C2Ejes_jun,'String',roundn(Gd2Ejes(6),-2));
    set(handles.C2Ejes_jul,'String',roundn(Gd2Ejes(7),-2));
    set(handles.C2Ejes_ago,'String',roundn(Gd2Ejes(8),-2));
    set(handles.C2Ejes_sep,'String',roundn(Gd2Ejes(9),-2));
    set(handles.C2Ejes_oct,'String',roundn(Gd2Ejes(10),-2));
    set(handles.C2Ejes_nov,'String',roundn(Gd2Ejes(11),-2));
    set(handles.C2Ejes_dic,'String',roundn(Gd2Ejes(12),-2));
    
    set(handles.C2Ejes_media,'String',roundn(media_Gd2Ejes,-2));

%GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Mostrar valores de ganancias con respecto al plano horizontal
    set(handles.CGana2Ej_0_ene,'String',roundn(PorGanaG_2Ej_0(1),-2));
    set(handles.CGana2Ej_0_feb,'String',roundn(PorGanaG_2Ej_0(2),-2));
    set(handles.CGana2Ej_0_mar,'String',roundn(PorGanaG_2Ej_0(3),-2));
    set(handles.CGana2Ej_0_abr,'String',roundn(PorGanaG_2Ej_0(4),-2));
    set(handles.CGana2Ej_0_may,'String',roundn(PorGanaG_2Ej_0(5),-2));
    set(handles.CGana2Ej_0_jun,'String',roundn(PorGanaG_2Ej_0(6),-2));
    set(handles.CGana2Ej_0_jul,'String',roundn(PorGanaG_2Ej_0(7),-2));
    set(handles.CGana2Ej_0_ago,'String',roundn(PorGanaG_2Ej_0(8),-2));
    set(handles.CGana2Ej_0_sep,'String',roundn(PorGanaG_2Ej_0(9),-2));
    set(handles.CGana2Ej_0_oct,'String',roundn(PorGanaG_2Ej_0(10),-2));
    set(handles.CGana2Ej_0_nov,'String',roundn(PorGanaG_2Ej_0(11),-2));
    set(handles.CGana2Ej_0_dic,'String',roundn(PorGanaG_2Ej_0(12),-2));
    
    set(handles.CGana2Ej_0_media,'String',roundn(mean(PorGanaG_2Ej_0),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima anual
    set(handles.CGana2Ej_Anu_ene,'String',roundn(PorGanaG_2Ej_Anu(1),-2));
    set(handles.CGana2Ej_Anu_feb,'String',roundn(PorGanaG_2Ej_Anu(2),-2));
    set(handles.CGana2Ej_Anu_mar,'String',roundn(PorGanaG_2Ej_Anu(3),-2));
    set(handles.CGana2Ej_Anu_abr,'String',roundn(PorGanaG_2Ej_Anu(4),-2));
    set(handles.CGana2Ej_Anu_may,'String',roundn(PorGanaG_2Ej_Anu(5),-2));
    set(handles.CGana2Ej_Anu_jun,'String',roundn(PorGanaG_2Ej_Anu(6),-2));
    set(handles.CGana2Ej_Anu_jul,'String',roundn(PorGanaG_2Ej_Anu(7),-2));
    set(handles.CGana2Ej_Anu_ago,'String',roundn(PorGanaG_2Ej_Anu(8),-2));
    set(handles.CGana2Ej_Anu_sep,'String',roundn(PorGanaG_2Ej_Anu(9),-2));
    set(handles.CGana2Ej_Anu_oct,'String',roundn(PorGanaG_2Ej_Anu(10),-2));
    set(handles.CGana2Ej_Anu_nov,'String',roundn(PorGanaG_2Ej_Anu(11),-2));
    set(handles.CGana2Ej_Anu_dic,'String',roundn(PorGanaG_2Ej_Anu(12),-2));
    
    set(handles.CGana2Ej_Anu_media,'String',roundn(mean(PorGanaG_2Ej_Anu),-2));
    
%Mostrar valores de ganancias con respecto a la inclinación óptima estacional
    set(handles.CGana2Ej_Est_ene,'String',roundn(PorGanaG_2Ej_Est(1),-2));
    set(handles.CGana2Ej_Est_feb,'String',roundn(PorGanaG_2Ej_Est(2),-2));
    set(handles.CGana2Ej_Est_mar,'String',roundn(PorGanaG_2Ej_Est(3),-2));
    set(handles.CGana2Ej_Est_abr,'String',roundn(PorGanaG_2Ej_Est(4),-2));
    set(handles.CGana2Ej_Est_may,'String',roundn(PorGanaG_2Ej_Est(5),-2));
    set(handles.CGana2Ej_Est_jun,'String',roundn(PorGanaG_2Ej_Est(6),-2));
    set(handles.CGana2Ej_Est_jul,'String',roundn(PorGanaG_2Ej_Est(7),-2));
    set(handles.CGana2Ej_Est_ago,'String',roundn(PorGanaG_2Ej_Est(8),-2));
    set(handles.CGana2Ej_Est_sep,'String',roundn(PorGanaG_2Ej_Est(9),-2));
    set(handles.CGana2Ej_Est_oct,'String',roundn(PorGanaG_2Ej_Est(10),-2));
    set(handles.CGana2Ej_Est_nov,'String',roundn(PorGanaG_2Ej_Est(11),-2));
    set(handles.CGana2Ej_Est_dic,'String',roundn(PorGanaG_2Ej_Est(12),-2));
   
    set(handles.CGana2Ej_Est_media,'String',roundn(mean(PorGanaG_2Ej_Est),-2));
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
    set(handles.CGana2Ej_Pol_ene,'String',roundn(PorGanaG_2Ej_Pol(1),-2));
    set(handles.CGana2Ej_Pol_feb,'String',roundn(PorGanaG_2Ej_Pol(2),-2));
    set(handles.CGana2Ej_Pol_mar,'String',roundn(PorGanaG_2Ej_Pol(3),-2));
    set(handles.CGana2Ej_Pol_abr,'String',roundn(PorGanaG_2Ej_Pol(4),-2));
    set(handles.CGana2Ej_Pol_may,'String',roundn(PorGanaG_2Ej_Pol(5),-2));
    set(handles.CGana2Ej_Pol_jun,'String',roundn(PorGanaG_2Ej_Pol(6),-2));
    set(handles.CGana2Ej_Pol_jul,'String',roundn(PorGanaG_2Ej_Pol(7),-2));
    set(handles.CGana2Ej_Pol_ago,'String',roundn(PorGanaG_2Ej_Pol(8),-2));
    set(handles.CGana2Ej_Pol_sep,'String',roundn(PorGanaG_2Ej_Pol(9),-2));
    set(handles.CGana2Ej_Pol_oct,'String',roundn(PorGanaG_2Ej_Pol(10),-2));
    set(handles.CGana2Ej_Pol_nov,'String',roundn(PorGanaG_2Ej_Pol(11),-2));
    set(handles.CGana2Ej_Pol_dic,'String',roundn(PorGanaG_2Ej_Pol(12),-2));
    
    set(handles.CGana2Ej_Pol_media,'String',roundn(mean(PorGanaG_2Ej_Pol),-2));    
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
    set(handles.CGana2Ej_Azi_ene,'String',roundn(PorGanaG_2Ej_Azi(1),-2));
    set(handles.CGana2Ej_Azi_feb,'String',roundn(PorGanaG_2Ej_Azi(2),-2));
    set(handles.CGana2Ej_Azi_mar,'String',roundn(PorGanaG_2Ej_Azi(3),-2));
    set(handles.CGana2Ej_Azi_abr,'String',roundn(PorGanaG_2Ej_Azi(4),-2));
    set(handles.CGana2Ej_Azi_may,'String',roundn(PorGanaG_2Ej_Azi(5),-2));
    set(handles.CGana2Ej_Azi_jun,'String',roundn(PorGanaG_2Ej_Azi(6),-2));
    set(handles.CGana2Ej_Azi_jul,'String',roundn(PorGanaG_2Ej_Azi(7),-2));
    set(handles.CGana2Ej_Azi_ago,'String',roundn(PorGanaG_2Ej_Azi(8),-2));
    set(handles.CGana2Ej_Azi_sep,'String',roundn(PorGanaG_2Ej_Azi(9),-2));
    set(handles.CGana2Ej_Azi_oct,'String',roundn(PorGanaG_2Ej_Azi(10),-2));
    set(handles.CGana2Ej_Azi_nov,'String',roundn(PorGanaG_2Ej_Azi(11),-2));
    set(handles.CGana2Ej_Azi_dic,'String',roundn(PorGanaG_2Ej_Azi(12),-2));
    
    set(handles.CGana2Ej_Azi_media,'String',roundn(mean(PorGanaG_2Ej_Azi),-2)); 
    
    
%Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
    set(handles.CGana2Ej_Hor_ene,'String',roundn(PorGanaG_2Ej_Hor(1),-2));
    set(handles.CGana2Ej_Hor_feb,'String',roundn(PorGanaG_2Ej_Hor(2),-2));
    set(handles.CGana2Ej_Hor_mar,'String',roundn(PorGanaG_2Ej_Hor(3),-2));
    set(handles.CGana2Ej_Hor_abr,'String',roundn(PorGanaG_2Ej_Hor(4),-2));
    set(handles.CGana2Ej_Hor_may,'String',roundn(PorGanaG_2Ej_Hor(5),-2));
    set(handles.CGana2Ej_Hor_jun,'String',roundn(PorGanaG_2Ej_Hor(6),-2));
    set(handles.CGana2Ej_Hor_jul,'String',roundn(PorGanaG_2Ej_Hor(7),-2));
    set(handles.CGana2Ej_Hor_ago,'String',roundn(PorGanaG_2Ej_Hor(8),-2));
    set(handles.CGana2Ej_Hor_sep,'String',roundn(PorGanaG_2Ej_Hor(9),-2));
    set(handles.CGana2Ej_Hor_oct,'String',roundn(PorGanaG_2Ej_Hor(10),-2));
    set(handles.CGana2Ej_Hor_nov,'String',roundn(PorGanaG_2Ej_Hor(11),-2));
    set(handles.CGana2Ej_Hor_dic,'String',roundn(PorGanaG_2Ej_Hor(12),-2));
    
    set(handles.CGana2Ej_Hor_media,'String',roundn(mean(PorGanaG_2Ej_Hor),-2)); 

% Choose default command line output for Tabla_2Ejes
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_2Ejes wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_2Ejes_OutputFcn(hObject, eventdata, handles) 
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

global Bd2Ejes media_Bd2Ejes;
global Dd2Ejes media_Dd2Ejes;
global Rd2Ejes media_Rd2Ejes;
global Gd2Ejes media_Gd2Ejes;
%Ganancias==========================
global PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;
global PorGanaB_2Ej_0 PorGanaB_2Ej_Anu PorGanaB_2Ej_Est PorGanaB_2Ej_Pol PorGanaB_2Ej_Azi PorGanaB_2Ej_Hor;
global PorGanaD_2Ej_0 PorGanaD_2Ej_Anu PorGanaD_2Ej_Est PorGanaD_2Ej_Pol PorGanaD_2Ej_Azi PorGanaD_2Ej_Hor;
global PorGanaR_2Ej_0 PorGanaR_2Ej_Anu PorGanaR_2Ej_Est PorGanaR_2Ej_Pol PorGanaR_2Ej_Azi PorGanaR_2Ej_Hor;

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

        %Mostrar valores para el seguimiento a dos ejes
            set(handles.C2Ejes_ene,'String',roundn(Gd2Ejes(1),-2));
            set(handles.C2Ejes_feb,'String',roundn(Gd2Ejes(2),-2));
            set(handles.C2Ejes_mar,'String',roundn(Gd2Ejes(3),-2));
            set(handles.C2Ejes_abr,'String',roundn(Gd2Ejes(4),-2));
            set(handles.C2Ejes_may,'String',roundn(Gd2Ejes(5),-2));
            set(handles.C2Ejes_jun,'String',roundn(Gd2Ejes(6),-2));
            set(handles.C2Ejes_jul,'String',roundn(Gd2Ejes(7),-2));
            set(handles.C2Ejes_ago,'String',roundn(Gd2Ejes(8),-2));
            set(handles.C2Ejes_sep,'String',roundn(Gd2Ejes(9),-2));
            set(handles.C2Ejes_oct,'String',roundn(Gd2Ejes(10),-2));
            set(handles.C2Ejes_nov,'String',roundn(Gd2Ejes(11),-2));
            set(handles.C2Ejes_dic,'String',roundn(Gd2Ejes(12),-2));

            set(handles.C2Ejes_media,'String',roundn(media_Gd2Ejes,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGana2Ej_0_ene,'String',roundn(PorGanaG_2Ej_0(1),-2));
            set(handles.CGana2Ej_0_feb,'String',roundn(PorGanaG_2Ej_0(2),-2));
            set(handles.CGana2Ej_0_mar,'String',roundn(PorGanaG_2Ej_0(3),-2));
            set(handles.CGana2Ej_0_abr,'String',roundn(PorGanaG_2Ej_0(4),-2));
            set(handles.CGana2Ej_0_may,'String',roundn(PorGanaG_2Ej_0(5),-2));
            set(handles.CGana2Ej_0_jun,'String',roundn(PorGanaG_2Ej_0(6),-2));
            set(handles.CGana2Ej_0_jul,'String',roundn(PorGanaG_2Ej_0(7),-2));
            set(handles.CGana2Ej_0_ago,'String',roundn(PorGanaG_2Ej_0(8),-2));
            set(handles.CGana2Ej_0_sep,'String',roundn(PorGanaG_2Ej_0(9),-2));
            set(handles.CGana2Ej_0_oct,'String',roundn(PorGanaG_2Ej_0(10),-2));
            set(handles.CGana2Ej_0_nov,'String',roundn(PorGanaG_2Ej_0(11),-2));
            set(handles.CGana2Ej_0_dic,'String',roundn(PorGanaG_2Ej_0(12),-2));

            set(handles.CGana2Ej_0_media,'String',roundn(mean(PorGanaG_2Ej_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGana2Ej_Anu_ene,'String',roundn(PorGanaG_2Ej_Anu(1),-2));
            set(handles.CGana2Ej_Anu_feb,'String',roundn(PorGanaG_2Ej_Anu(2),-2));
            set(handles.CGana2Ej_Anu_mar,'String',roundn(PorGanaG_2Ej_Anu(3),-2));
            set(handles.CGana2Ej_Anu_abr,'String',roundn(PorGanaG_2Ej_Anu(4),-2));
            set(handles.CGana2Ej_Anu_may,'String',roundn(PorGanaG_2Ej_Anu(5),-2));
            set(handles.CGana2Ej_Anu_jun,'String',roundn(PorGanaG_2Ej_Anu(6),-2));
            set(handles.CGana2Ej_Anu_jul,'String',roundn(PorGanaG_2Ej_Anu(7),-2));
            set(handles.CGana2Ej_Anu_ago,'String',roundn(PorGanaG_2Ej_Anu(8),-2));
            set(handles.CGana2Ej_Anu_sep,'String',roundn(PorGanaG_2Ej_Anu(9),-2));
            set(handles.CGana2Ej_Anu_oct,'String',roundn(PorGanaG_2Ej_Anu(10),-2));
            set(handles.CGana2Ej_Anu_nov,'String',roundn(PorGanaG_2Ej_Anu(11),-2));
            set(handles.CGana2Ej_Anu_dic,'String',roundn(PorGanaG_2Ej_Anu(12),-2));

            set(handles.CGana2Ej_Anu_media,'String',roundn(mean(PorGanaG_2Ej_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGana2Ej_Est_ene,'String',roundn(PorGanaG_2Ej_Est(1),-2));
            set(handles.CGana2Ej_Est_feb,'String',roundn(PorGanaG_2Ej_Est(2),-2));
            set(handles.CGana2Ej_Est_mar,'String',roundn(PorGanaG_2Ej_Est(3),-2));
            set(handles.CGana2Ej_Est_abr,'String',roundn(PorGanaG_2Ej_Est(4),-2));
            set(handles.CGana2Ej_Est_may,'String',roundn(PorGanaG_2Ej_Est(5),-2));
            set(handles.CGana2Ej_Est_jun,'String',roundn(PorGanaG_2Ej_Est(6),-2));
            set(handles.CGana2Ej_Est_jul,'String',roundn(PorGanaG_2Ej_Est(7),-2));
            set(handles.CGana2Ej_Est_ago,'String',roundn(PorGanaG_2Ej_Est(8),-2));
            set(handles.CGana2Ej_Est_sep,'String',roundn(PorGanaG_2Ej_Est(9),-2));
            set(handles.CGana2Ej_Est_oct,'String',roundn(PorGanaG_2Ej_Est(10),-2));
            set(handles.CGana2Ej_Est_nov,'String',roundn(PorGanaG_2Ej_Est(11),-2));
            set(handles.CGana2Ej_Est_dic,'String',roundn(PorGanaG_2Ej_Est(12),-2));

            set(handles.CGana2Ej_Est_media,'String',roundn(mean(PorGanaG_2Ej_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGana2Ej_Pol_ene,'String',roundn(PorGanaG_2Ej_Pol(1),-2));
            set(handles.CGana2Ej_Pol_feb,'String',roundn(PorGanaG_2Ej_Pol(2),-2));
            set(handles.CGana2Ej_Pol_mar,'String',roundn(PorGanaG_2Ej_Pol(3),-2));
            set(handles.CGana2Ej_Pol_abr,'String',roundn(PorGanaG_2Ej_Pol(4),-2));
            set(handles.CGana2Ej_Pol_may,'String',roundn(PorGanaG_2Ej_Pol(5),-2));
            set(handles.CGana2Ej_Pol_jun,'String',roundn(PorGanaG_2Ej_Pol(6),-2));
            set(handles.CGana2Ej_Pol_jul,'String',roundn(PorGanaG_2Ej_Pol(7),-2));
            set(handles.CGana2Ej_Pol_ago,'String',roundn(PorGanaG_2Ej_Pol(8),-2));
            set(handles.CGana2Ej_Pol_sep,'String',roundn(PorGanaG_2Ej_Pol(9),-2));
            set(handles.CGana2Ej_Pol_oct,'String',roundn(PorGanaG_2Ej_Pol(10),-2));
            set(handles.CGana2Ej_Pol_nov,'String',roundn(PorGanaG_2Ej_Pol(11),-2));
            set(handles.CGana2Ej_Pol_dic,'String',roundn(PorGanaG_2Ej_Pol(12),-2));

            set(handles.CGana2Ej_Pol_media,'String',roundn(mean(PorGanaG_2Ej_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGana2Ej_Azi_ene,'String',roundn(PorGanaG_2Ej_Azi(1),-2));
            set(handles.CGana2Ej_Azi_feb,'String',roundn(PorGanaG_2Ej_Azi(2),-2));
            set(handles.CGana2Ej_Azi_mar,'String',roundn(PorGanaG_2Ej_Azi(3),-2));
            set(handles.CGana2Ej_Azi_abr,'String',roundn(PorGanaG_2Ej_Azi(4),-2));
            set(handles.CGana2Ej_Azi_may,'String',roundn(PorGanaG_2Ej_Azi(5),-2));
            set(handles.CGana2Ej_Azi_jun,'String',roundn(PorGanaG_2Ej_Azi(6),-2));
            set(handles.CGana2Ej_Azi_jul,'String',roundn(PorGanaG_2Ej_Azi(7),-2));
            set(handles.CGana2Ej_Azi_ago,'String',roundn(PorGanaG_2Ej_Azi(8),-2));
            set(handles.CGana2Ej_Azi_sep,'String',roundn(PorGanaG_2Ej_Azi(9),-2));
            set(handles.CGana2Ej_Azi_oct,'String',roundn(PorGanaG_2Ej_Azi(10),-2));
            set(handles.CGana2Ej_Azi_nov,'String',roundn(PorGanaG_2Ej_Azi(11),-2));
            set(handles.CGana2Ej_Azi_dic,'String',roundn(PorGanaG_2Ej_Azi(12),-2));

            set(handles.CGana2Ej_Azi_media,'String',roundn(mean(PorGanaG_2Ej_Azi),-2)); 


        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGana2Ej_Hor_ene,'String',roundn(PorGanaG_2Ej_Hor(1),-2));
            set(handles.CGana2Ej_Hor_feb,'String',roundn(PorGanaG_2Ej_Hor(2),-2));
            set(handles.CGana2Ej_Hor_mar,'String',roundn(PorGanaG_2Ej_Hor(3),-2));
            set(handles.CGana2Ej_Hor_abr,'String',roundn(PorGanaG_2Ej_Hor(4),-2));
            set(handles.CGana2Ej_Hor_may,'String',roundn(PorGanaG_2Ej_Hor(5),-2));
            set(handles.CGana2Ej_Hor_jun,'String',roundn(PorGanaG_2Ej_Hor(6),-2));
            set(handles.CGana2Ej_Hor_jul,'String',roundn(PorGanaG_2Ej_Hor(7),-2));
            set(handles.CGana2Ej_Hor_ago,'String',roundn(PorGanaG_2Ej_Hor(8),-2));
            set(handles.CGana2Ej_Hor_sep,'String',roundn(PorGanaG_2Ej_Hor(9),-2));
            set(handles.CGana2Ej_Hor_oct,'String',roundn(PorGanaG_2Ej_Hor(10),-2));
            set(handles.CGana2Ej_Hor_nov,'String',roundn(PorGanaG_2Ej_Hor(11),-2));
            set(handles.CGana2Ej_Hor_dic,'String',roundn(PorGanaG_2Ej_Hor(12),-2));

            set(handles.CGana2Ej_Hor_media,'String',roundn(mean(PorGanaG_2Ej_Hor),-2)); 
        
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

        %Mostrar valores para el seguimiento a dos ejes
            set(handles.C2Ejes_ene,'String',roundn(Bd2Ejes(1),-2));
            set(handles.C2Ejes_feb,'String',roundn(Bd2Ejes(2),-2));
            set(handles.C2Ejes_mar,'String',roundn(Bd2Ejes(3),-2));
            set(handles.C2Ejes_abr,'String',roundn(Bd2Ejes(4),-2));
            set(handles.C2Ejes_may,'String',roundn(Bd2Ejes(5),-2));
            set(handles.C2Ejes_jun,'String',roundn(Bd2Ejes(6),-2));
            set(handles.C2Ejes_jul,'String',roundn(Bd2Ejes(7),-2));
            set(handles.C2Ejes_ago,'String',roundn(Bd2Ejes(8),-2));
            set(handles.C2Ejes_sep,'String',roundn(Bd2Ejes(9),-2));
            set(handles.C2Ejes_oct,'String',roundn(Bd2Ejes(10),-2));
            set(handles.C2Ejes_nov,'String',roundn(Bd2Ejes(11),-2));
            set(handles.C2Ejes_dic,'String',roundn(Bd2Ejes(12),-2));

            set(handles.C2Ejes_media,'String',roundn(media_Bd2Ejes,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGana2Ej_0_ene,'String',roundn(PorGanaB_2Ej_0(1),-2));
            set(handles.CGana2Ej_0_feb,'String',roundn(PorGanaB_2Ej_0(2),-2));
            set(handles.CGana2Ej_0_mar,'String',roundn(PorGanaB_2Ej_0(3),-2));
            set(handles.CGana2Ej_0_abr,'String',roundn(PorGanaB_2Ej_0(4),-2));
            set(handles.CGana2Ej_0_may,'String',roundn(PorGanaB_2Ej_0(5),-2));
            set(handles.CGana2Ej_0_jun,'String',roundn(PorGanaB_2Ej_0(6),-2));
            set(handles.CGana2Ej_0_jul,'String',roundn(PorGanaB_2Ej_0(7),-2));
            set(handles.CGana2Ej_0_ago,'String',roundn(PorGanaB_2Ej_0(8),-2));
            set(handles.CGana2Ej_0_sep,'String',roundn(PorGanaB_2Ej_0(9),-2));
            set(handles.CGana2Ej_0_oct,'String',roundn(PorGanaB_2Ej_0(10),-2));
            set(handles.CGana2Ej_0_nov,'String',roundn(PorGanaB_2Ej_0(11),-2));
            set(handles.CGana2Ej_0_dic,'String',roundn(PorGanaB_2Ej_0(12),-2));

            set(handles.CGana2Ej_0_media,'String',roundn(mean(PorGanaB_2Ej_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGana2Ej_Anu_ene,'String',roundn(PorGanaB_2Ej_Anu(1),-2));
            set(handles.CGana2Ej_Anu_feb,'String',roundn(PorGanaB_2Ej_Anu(2),-2));
            set(handles.CGana2Ej_Anu_mar,'String',roundn(PorGanaB_2Ej_Anu(3),-2));
            set(handles.CGana2Ej_Anu_abr,'String',roundn(PorGanaB_2Ej_Anu(4),-2));
            set(handles.CGana2Ej_Anu_may,'String',roundn(PorGanaB_2Ej_Anu(5),-2));
            set(handles.CGana2Ej_Anu_jun,'String',roundn(PorGanaB_2Ej_Anu(6),-2));
            set(handles.CGana2Ej_Anu_jul,'String',roundn(PorGanaB_2Ej_Anu(7),-2));
            set(handles.CGana2Ej_Anu_ago,'String',roundn(PorGanaB_2Ej_Anu(8),-2));
            set(handles.CGana2Ej_Anu_sep,'String',roundn(PorGanaB_2Ej_Anu(9),-2));
            set(handles.CGana2Ej_Anu_oct,'String',roundn(PorGanaB_2Ej_Anu(10),-2));
            set(handles.CGana2Ej_Anu_nov,'String',roundn(PorGanaB_2Ej_Anu(11),-2));
            set(handles.CGana2Ej_Anu_dic,'String',roundn(PorGanaB_2Ej_Anu(12),-2));

            set(handles.CGana2Ej_Anu_media,'String',roundn(mean(PorGanaB_2Ej_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGana2Ej_Est_ene,'String',roundn(PorGanaB_2Ej_Est(1),-2));
            set(handles.CGana2Ej_Est_feb,'String',roundn(PorGanaB_2Ej_Est(2),-2));
            set(handles.CGana2Ej_Est_mar,'String',roundn(PorGanaB_2Ej_Est(3),-2));
            set(handles.CGana2Ej_Est_abr,'String',roundn(PorGanaB_2Ej_Est(4),-2));
            set(handles.CGana2Ej_Est_may,'String',roundn(PorGanaB_2Ej_Est(5),-2));
            set(handles.CGana2Ej_Est_jun,'String',roundn(PorGanaB_2Ej_Est(6),-2));
            set(handles.CGana2Ej_Est_jul,'String',roundn(PorGanaB_2Ej_Est(7),-2));
            set(handles.CGana2Ej_Est_ago,'String',roundn(PorGanaB_2Ej_Est(8),-2));
            set(handles.CGana2Ej_Est_sep,'String',roundn(PorGanaB_2Ej_Est(9),-2));
            set(handles.CGana2Ej_Est_oct,'String',roundn(PorGanaB_2Ej_Est(10),-2));
            set(handles.CGana2Ej_Est_nov,'String',roundn(PorGanaB_2Ej_Est(11),-2));
            set(handles.CGana2Ej_Est_dic,'String',roundn(PorGanaB_2Ej_Est(12),-2));

            set(handles.CGana2Ej_Est_media,'String',roundn(mean(PorGanaB_2Ej_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGana2Ej_Pol_ene,'String',roundn(PorGanaB_2Ej_Pol(1),-2));
            set(handles.CGana2Ej_Pol_feb,'String',roundn(PorGanaB_2Ej_Pol(2),-2));
            set(handles.CGana2Ej_Pol_mar,'String',roundn(PorGanaB_2Ej_Pol(3),-2));
            set(handles.CGana2Ej_Pol_abr,'String',roundn(PorGanaB_2Ej_Pol(4),-2));
            set(handles.CGana2Ej_Pol_may,'String',roundn(PorGanaB_2Ej_Pol(5),-2));
            set(handles.CGana2Ej_Pol_jun,'String',roundn(PorGanaB_2Ej_Pol(6),-2));
            set(handles.CGana2Ej_Pol_jul,'String',roundn(PorGanaB_2Ej_Pol(7),-2));
            set(handles.CGana2Ej_Pol_ago,'String',roundn(PorGanaB_2Ej_Pol(8),-2));
            set(handles.CGana2Ej_Pol_sep,'String',roundn(PorGanaB_2Ej_Pol(9),-2));
            set(handles.CGana2Ej_Pol_oct,'String',roundn(PorGanaB_2Ej_Pol(10),-2));
            set(handles.CGana2Ej_Pol_nov,'String',roundn(PorGanaB_2Ej_Pol(11),-2));
            set(handles.CGana2Ej_Pol_dic,'String',roundn(PorGanaB_2Ej_Pol(12),-2));

            set(handles.CGana2Ej_Pol_media,'String',roundn(mean(PorGanaB_2Ej_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGana2Ej_Azi_ene,'String',roundn(PorGanaB_2Ej_Azi(1),-2));
            set(handles.CGana2Ej_Azi_feb,'String',roundn(PorGanaB_2Ej_Azi(2),-2));
            set(handles.CGana2Ej_Azi_mar,'String',roundn(PorGanaB_2Ej_Azi(3),-2));
            set(handles.CGana2Ej_Azi_abr,'String',roundn(PorGanaB_2Ej_Azi(4),-2));
            set(handles.CGana2Ej_Azi_may,'String',roundn(PorGanaB_2Ej_Azi(5),-2));
            set(handles.CGana2Ej_Azi_jun,'String',roundn(PorGanaB_2Ej_Azi(6),-2));
            set(handles.CGana2Ej_Azi_jul,'String',roundn(PorGanaB_2Ej_Azi(7),-2));
            set(handles.CGana2Ej_Azi_ago,'String',roundn(PorGanaB_2Ej_Azi(8),-2));
            set(handles.CGana2Ej_Azi_sep,'String',roundn(PorGanaB_2Ej_Azi(9),-2));
            set(handles.CGana2Ej_Azi_oct,'String',roundn(PorGanaB_2Ej_Azi(10),-2));
            set(handles.CGana2Ej_Azi_nov,'String',roundn(PorGanaB_2Ej_Azi(11),-2));
            set(handles.CGana2Ej_Azi_dic,'String',roundn(PorGanaB_2Ej_Azi(12),-2));

            set(handles.CGana2Ej_Azi_media,'String',roundn(mean(PorGanaB_2Ej_Azi),-2)); 


        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGana2Ej_Hor_ene,'String',roundn(PorGanaB_2Ej_Hor(1),-2));
            set(handles.CGana2Ej_Hor_feb,'String',roundn(PorGanaB_2Ej_Hor(2),-2));
            set(handles.CGana2Ej_Hor_mar,'String',roundn(PorGanaB_2Ej_Hor(3),-2));
            set(handles.CGana2Ej_Hor_abr,'String',roundn(PorGanaB_2Ej_Hor(4),-2));
            set(handles.CGana2Ej_Hor_may,'String',roundn(PorGanaB_2Ej_Hor(5),-2));
            set(handles.CGana2Ej_Hor_jun,'String',roundn(PorGanaB_2Ej_Hor(6),-2));
            set(handles.CGana2Ej_Hor_jul,'String',roundn(PorGanaB_2Ej_Hor(7),-2));
            set(handles.CGana2Ej_Hor_ago,'String',roundn(PorGanaB_2Ej_Hor(8),-2));
            set(handles.CGana2Ej_Hor_sep,'String',roundn(PorGanaB_2Ej_Hor(9),-2));
            set(handles.CGana2Ej_Hor_oct,'String',roundn(PorGanaB_2Ej_Hor(10),-2));
            set(handles.CGana2Ej_Hor_nov,'String',roundn(PorGanaB_2Ej_Hor(11),-2));
            set(handles.CGana2Ej_Hor_dic,'String',roundn(PorGanaB_2Ej_Hor(12),-2));

            set(handles.CGana2Ej_Hor_media,'String',roundn(mean(PorGanaB_2Ej_Hor),-2)); 
        
        
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

        %Mostrar valores para el seguimiento a dos ejes
            set(handles.C2Ejes_ene,'String',roundn(Dd2Ejes(1),-2));
            set(handles.C2Ejes_feb,'String',roundn(Dd2Ejes(2),-2));
            set(handles.C2Ejes_mar,'String',roundn(Dd2Ejes(3),-2));
            set(handles.C2Ejes_abr,'String',roundn(Dd2Ejes(4),-2));
            set(handles.C2Ejes_may,'String',roundn(Dd2Ejes(5),-2));
            set(handles.C2Ejes_jun,'String',roundn(Dd2Ejes(6),-2));
            set(handles.C2Ejes_jul,'String',roundn(Dd2Ejes(7),-2));
            set(handles.C2Ejes_ago,'String',roundn(Dd2Ejes(8),-2));
            set(handles.C2Ejes_sep,'String',roundn(Dd2Ejes(9),-2));
            set(handles.C2Ejes_oct,'String',roundn(Dd2Ejes(10),-2));
            set(handles.C2Ejes_nov,'String',roundn(Dd2Ejes(11),-2));
            set(handles.C2Ejes_dic,'String',roundn(Dd2Ejes(12),-2));

            set(handles.C2Ejes_media,'String',roundn(media_Dd2Ejes,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGana2Ej_0_ene,'String',roundn(PorGanaD_2Ej_0(1),-2));
            set(handles.CGana2Ej_0_feb,'String',roundn(PorGanaD_2Ej_0(2),-2));
            set(handles.CGana2Ej_0_mar,'String',roundn(PorGanaD_2Ej_0(3),-2));
            set(handles.CGana2Ej_0_abr,'String',roundn(PorGanaD_2Ej_0(4),-2));
            set(handles.CGana2Ej_0_may,'String',roundn(PorGanaD_2Ej_0(5),-2));
            set(handles.CGana2Ej_0_jun,'String',roundn(PorGanaD_2Ej_0(6),-2));
            set(handles.CGana2Ej_0_jul,'String',roundn(PorGanaD_2Ej_0(7),-2));
            set(handles.CGana2Ej_0_ago,'String',roundn(PorGanaD_2Ej_0(8),-2));
            set(handles.CGana2Ej_0_sep,'String',roundn(PorGanaD_2Ej_0(9),-2));
            set(handles.CGana2Ej_0_oct,'String',roundn(PorGanaD_2Ej_0(10),-2));
            set(handles.CGana2Ej_0_nov,'String',roundn(PorGanaD_2Ej_0(11),-2));
            set(handles.CGana2Ej_0_dic,'String',roundn(PorGanaD_2Ej_0(12),-2));

            set(handles.CGana2Ej_0_media,'String',roundn(mean(PorGanaD_2Ej_0),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
            set(handles.CGana2Ej_Anu_ene,'String',roundn(PorGanaD_2Ej_Anu(1),-2));
            set(handles.CGana2Ej_Anu_feb,'String',roundn(PorGanaD_2Ej_Anu(2),-2));
            set(handles.CGana2Ej_Anu_mar,'String',roundn(PorGanaD_2Ej_Anu(3),-2));
            set(handles.CGana2Ej_Anu_abr,'String',roundn(PorGanaD_2Ej_Anu(4),-2));
            set(handles.CGana2Ej_Anu_may,'String',roundn(PorGanaD_2Ej_Anu(5),-2));
            set(handles.CGana2Ej_Anu_jun,'String',roundn(PorGanaD_2Ej_Anu(6),-2));
            set(handles.CGana2Ej_Anu_jul,'String',roundn(PorGanaD_2Ej_Anu(7),-2));
            set(handles.CGana2Ej_Anu_ago,'String',roundn(PorGanaD_2Ej_Anu(8),-2));
            set(handles.CGana2Ej_Anu_sep,'String',roundn(PorGanaD_2Ej_Anu(9),-2));
            set(handles.CGana2Ej_Anu_oct,'String',roundn(PorGanaD_2Ej_Anu(10),-2));
            set(handles.CGana2Ej_Anu_nov,'String',roundn(PorGanaD_2Ej_Anu(11),-2));
            set(handles.CGana2Ej_Anu_dic,'String',roundn(PorGanaD_2Ej_Anu(12),-2));

            set(handles.CGana2Ej_Anu_media,'String',roundn(mean(PorGanaD_2Ej_Anu),-2));

        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
            set(handles.CGana2Ej_Est_ene,'String',roundn(PorGanaD_2Ej_Est(1),-2));
            set(handles.CGana2Ej_Est_feb,'String',roundn(PorGanaD_2Ej_Est(2),-2));
            set(handles.CGana2Ej_Est_mar,'String',roundn(PorGanaD_2Ej_Est(3),-2));
            set(handles.CGana2Ej_Est_abr,'String',roundn(PorGanaD_2Ej_Est(4),-2));
            set(handles.CGana2Ej_Est_may,'String',roundn(PorGanaD_2Ej_Est(5),-2));
            set(handles.CGana2Ej_Est_jun,'String',roundn(PorGanaD_2Ej_Est(6),-2));
            set(handles.CGana2Ej_Est_jul,'String',roundn(PorGanaD_2Ej_Est(7),-2));
            set(handles.CGana2Ej_Est_ago,'String',roundn(PorGanaD_2Ej_Est(8),-2));
            set(handles.CGana2Ej_Est_sep,'String',roundn(PorGanaD_2Ej_Est(9),-2));
            set(handles.CGana2Ej_Est_oct,'String',roundn(PorGanaD_2Ej_Est(10),-2));
            set(handles.CGana2Ej_Est_nov,'String',roundn(PorGanaD_2Ej_Est(11),-2));
            set(handles.CGana2Ej_Est_dic,'String',roundn(PorGanaD_2Ej_Est(12),-2));

            set(handles.CGana2Ej_Est_media,'String',roundn(mean(PorGanaD_2Ej_Est),-2));

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGana2Ej_Pol_ene,'String',roundn(PorGanaD_2Ej_Pol(1),-2));
            set(handles.CGana2Ej_Pol_feb,'String',roundn(PorGanaD_2Ej_Pol(2),-2));
            set(handles.CGana2Ej_Pol_mar,'String',roundn(PorGanaD_2Ej_Pol(3),-2));
            set(handles.CGana2Ej_Pol_abr,'String',roundn(PorGanaD_2Ej_Pol(4),-2));
            set(handles.CGana2Ej_Pol_may,'String',roundn(PorGanaD_2Ej_Pol(5),-2));
            set(handles.CGana2Ej_Pol_jun,'String',roundn(PorGanaD_2Ej_Pol(6),-2));
            set(handles.CGana2Ej_Pol_jul,'String',roundn(PorGanaD_2Ej_Pol(7),-2));
            set(handles.CGana2Ej_Pol_ago,'String',roundn(PorGanaD_2Ej_Pol(8),-2));
            set(handles.CGana2Ej_Pol_sep,'String',roundn(PorGanaD_2Ej_Pol(9),-2));
            set(handles.CGana2Ej_Pol_oct,'String',roundn(PorGanaD_2Ej_Pol(10),-2));
            set(handles.CGana2Ej_Pol_nov,'String',roundn(PorGanaD_2Ej_Pol(11),-2));
            set(handles.CGana2Ej_Pol_dic,'String',roundn(PorGanaD_2Ej_Pol(12),-2));

            set(handles.CGana2Ej_Pol_media,'String',roundn(mean(PorGanaD_2Ej_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGana2Ej_Azi_ene,'String',roundn(PorGanaD_2Ej_Azi(1),-2));
            set(handles.CGana2Ej_Azi_feb,'String',roundn(PorGanaD_2Ej_Azi(2),-2));
            set(handles.CGana2Ej_Azi_mar,'String',roundn(PorGanaD_2Ej_Azi(3),-2));
            set(handles.CGana2Ej_Azi_abr,'String',roundn(PorGanaD_2Ej_Azi(4),-2));
            set(handles.CGana2Ej_Azi_may,'String',roundn(PorGanaD_2Ej_Azi(5),-2));
            set(handles.CGana2Ej_Azi_jun,'String',roundn(PorGanaD_2Ej_Azi(6),-2));
            set(handles.CGana2Ej_Azi_jul,'String',roundn(PorGanaD_2Ej_Azi(7),-2));
            set(handles.CGana2Ej_Azi_ago,'String',roundn(PorGanaD_2Ej_Azi(8),-2));
            set(handles.CGana2Ej_Azi_sep,'String',roundn(PorGanaD_2Ej_Azi(9),-2));
            set(handles.CGana2Ej_Azi_oct,'String',roundn(PorGanaD_2Ej_Azi(10),-2));
            set(handles.CGana2Ej_Azi_nov,'String',roundn(PorGanaD_2Ej_Azi(11),-2));
            set(handles.CGana2Ej_Azi_dic,'String',roundn(PorGanaD_2Ej_Azi(12),-2));

            set(handles.CGana2Ej_Azi_media,'String',roundn(mean(PorGanaD_2Ej_Azi),-2)); 


        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGana2Ej_Hor_ene,'String',roundn(PorGanaD_2Ej_Hor(1),-2));
            set(handles.CGana2Ej_Hor_feb,'String',roundn(PorGanaD_2Ej_Hor(2),-2));
            set(handles.CGana2Ej_Hor_mar,'String',roundn(PorGanaD_2Ej_Hor(3),-2));
            set(handles.CGana2Ej_Hor_abr,'String',roundn(PorGanaD_2Ej_Hor(4),-2));
            set(handles.CGana2Ej_Hor_may,'String',roundn(PorGanaD_2Ej_Hor(5),-2));
            set(handles.CGana2Ej_Hor_jun,'String',roundn(PorGanaD_2Ej_Hor(6),-2));
            set(handles.CGana2Ej_Hor_jul,'String',roundn(PorGanaD_2Ej_Hor(7),-2));
            set(handles.CGana2Ej_Hor_ago,'String',roundn(PorGanaD_2Ej_Hor(8),-2));
            set(handles.CGana2Ej_Hor_sep,'String',roundn(PorGanaD_2Ej_Hor(9),-2));
            set(handles.CGana2Ej_Hor_oct,'String',roundn(PorGanaD_2Ej_Hor(10),-2));
            set(handles.CGana2Ej_Hor_nov,'String',roundn(PorGanaD_2Ej_Hor(11),-2));
            set(handles.CGana2Ej_Hor_dic,'String',roundn(PorGanaD_2Ej_Hor(12),-2));

            set(handles.CGana2Ej_Hor_media,'String',roundn(mean(PorGanaD_2Ej_Hor),-2));       
            
            
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

        %Mostrar valores para el seguimiento a dos ejes
            set(handles.C2Ejes_ene,'String',roundn(Rd2Ejes(1),-2));
            set(handles.C2Ejes_feb,'String',roundn(Rd2Ejes(2),-2));
            set(handles.C2Ejes_mar,'String',roundn(Rd2Ejes(3),-2));
            set(handles.C2Ejes_abr,'String',roundn(Rd2Ejes(4),-2));
            set(handles.C2Ejes_may,'String',roundn(Rd2Ejes(5),-2));
            set(handles.C2Ejes_jun,'String',roundn(Rd2Ejes(6),-2));
            set(handles.C2Ejes_jul,'String',roundn(Rd2Ejes(7),-2));
            set(handles.C2Ejes_ago,'String',roundn(Rd2Ejes(8),-2));
            set(handles.C2Ejes_sep,'String',roundn(Rd2Ejes(9),-2));
            set(handles.C2Ejes_oct,'String',roundn(Rd2Ejes(10),-2));
            set(handles.C2Ejes_nov,'String',roundn(Rd2Ejes(11),-2));
            set(handles.C2Ejes_dic,'String',roundn(Rd2Ejes(12),-2));

            set(handles.C2Ejes_media,'String',roundn(media_Rd2Ejes,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Mostrar valores de ganancias con respecto al plano horizontal
            set(handles.CGana2Ej_0_ene,'String', '-');
            set(handles.CGana2Ej_0_feb,'String', '-');
            set(handles.CGana2Ej_0_mar,'String', '-');
            set(handles.CGana2Ej_0_abr,'String', '-');
            set(handles.CGana2Ej_0_may,'String', '-');
            set(handles.CGana2Ej_0_jun,'String', '-');
            set(handles.CGana2Ej_0_jul,'String', '-');
            set(handles.CGana2Ej_0_ago,'String', '-');
            set(handles.CGana2Ej_0_sep,'String', '-');
            set(handles.CGana2Ej_0_oct,'String', '-');
            set(handles.CGana2Ej_0_nov,'String', '-');
            set(handles.CGana2Ej_0_dic,'String', '-');

            set(handles.CGana2Ej_0_media,'String', '-');

        %Mostrar valores de ganancias con respecto a la inclinación óptima anual
         if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGana2Ej_Anu_ene,'String','-');
            set(handles.CGana2Ej_Anu_feb,'String','-');
            set(handles.CGana2Ej_Anu_mar,'String','-');
            set(handles.CGana2Ej_Anu_abr,'String','-');
            set(handles.CGana2Ej_Anu_may,'String','-');
            set(handles.CGana2Ej_Anu_jun,'String','-');
            set(handles.CGana2Ej_Anu_jul,'String','-');
            set(handles.CGana2Ej_Anu_ago,'String','-');
            set(handles.CGana2Ej_Anu_sep,'String','-');
            set(handles.CGana2Ej_Anu_oct,'String','-');
            set(handles.CGana2Ej_Anu_nov,'String','-');
            set(handles.CGana2Ej_Anu_dic,'String','-');

            set(handles.CGana2Ej_Anu_media,'String','-');
         else
            set(handles.CGana2Ej_Anu_ene,'String',roundn(PorGanaR_2Ej_Anu(1),-2));
            set(handles.CGana2Ej_Anu_feb,'String',roundn(PorGanaR_2Ej_Anu(2),-2));
            set(handles.CGana2Ej_Anu_mar,'String',roundn(PorGanaR_2Ej_Anu(3),-2));
            set(handles.CGana2Ej_Anu_abr,'String',roundn(PorGanaR_2Ej_Anu(4),-2));
            set(handles.CGana2Ej_Anu_may,'String',roundn(PorGanaR_2Ej_Anu(5),-2));
            set(handles.CGana2Ej_Anu_jun,'String',roundn(PorGanaR_2Ej_Anu(6),-2));
            set(handles.CGana2Ej_Anu_jul,'String',roundn(PorGanaR_2Ej_Anu(7),-2));
            set(handles.CGana2Ej_Anu_ago,'String',roundn(PorGanaR_2Ej_Anu(8),-2));
            set(handles.CGana2Ej_Anu_sep,'String',roundn(PorGanaR_2Ej_Anu(9),-2));
            set(handles.CGana2Ej_Anu_oct,'String',roundn(PorGanaR_2Ej_Anu(10),-2));
            set(handles.CGana2Ej_Anu_nov,'String',roundn(PorGanaR_2Ej_Anu(11),-2));
            set(handles.CGana2Ej_Anu_dic,'String',roundn(PorGanaR_2Ej_Anu(12),-2));

            set(handles.CGana2Ej_Anu_media,'String',roundn(mean(PorGanaR_2Ej_Anu),-2));
         end
        %Mostrar valores de ganancias con respecto a la inclinación óptima estacional
        if angOptim_Inv==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGana2Ej_Est_dic,'String','-');
            set(handles.CGana2Ej_Est_ene,'String','-');
            set(handles.CGana2Ej_Est_feb,'String','-');
        else
            set(handles.CGana2Ej_Est_dic,'String',roundn(PorGanaR_2Ej_Est(12),-2));
            set(handles.CGana2Ej_Est_ene,'String',roundn(PorGanaR_2Ej_Est(1),-2));
            set(handles.CGana2Ej_Est_feb,'String',roundn(PorGanaR_2Ej_Est(2),-2));
        end
        
        if angOptim_Pri==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGana2Ej_Est_mar,'String','-');
            set(handles.CGana2Ej_Est_abr,'String','-');
            set(handles.CGana2Ej_Est_may,'String','-');
        else
            set(handles.CGana2Ej_Est_mar,'String',roundn(PorGanaR_2Ej_Est(3),-2));
            set(handles.CGana2Ej_Est_abr,'String',roundn(PorGanaR_2Ej_Est(4),-2));
            set(handles.CGana2Ej_Est_may,'String',roundn(PorGanaR_2Ej_Est(5),-2));
        end
        
        if angOptim_Ver==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGana2Ej_Est_jun,'String','-');
            set(handles.CGana2Ej_Est_jul,'String','-');
            set(handles.CGana2Ej_Est_ago,'String','-');
        else
            set(handles.CGana2Ej_Est_jun,'String',roundn(PorGanaR_2Ej_Est(6),-2));
            set(handles.CGana2Ej_Est_jul,'String',roundn(PorGanaR_2Ej_Est(7),-2));
            set(handles.CGana2Ej_Est_ago,'String',roundn(PorGanaR_2Ej_Est(8),-2));
        end
        
        if angOptim_Oto==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            set(handles.CGana2Ej_Est_sep,'String','-');
            set(handles.CGana2Ej_Est_oct,'String','-');
            set(handles.CGana2Ej_Est_nov,'String','-');
        else
            set(handles.CGana2Ej_Est_sep,'String',roundn(PorGanaR_2Ej_Est(9),-2));
            set(handles.CGana2Ej_Est_oct,'String',roundn(PorGanaR_2Ej_Est(10),-2));
            set(handles.CGana2Ej_Est_nov,'String',roundn(PorGanaR_2Ej_Est(11),-2));
        end
        
       if mean(PorGanaR_2Ej_Est)==Inf
            set(handles.CGana2Ej_Est_media,'String','-');
       else
            set(handles.CGana2Ej_Est_media,'String',roundn(mean(PorGanaR_2Ej_Est),-2));
       end

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje polar
            set(handles.CGana2Ej_Pol_ene,'String',roundn(PorGanaR_2Ej_Pol(1),-2));
            set(handles.CGana2Ej_Pol_feb,'String',roundn(PorGanaR_2Ej_Pol(2),-2));
            set(handles.CGana2Ej_Pol_mar,'String',roundn(PorGanaR_2Ej_Pol(3),-2));
            set(handles.CGana2Ej_Pol_abr,'String',roundn(PorGanaR_2Ej_Pol(4),-2));
            set(handles.CGana2Ej_Pol_may,'String',roundn(PorGanaR_2Ej_Pol(5),-2));
            set(handles.CGana2Ej_Pol_jun,'String',roundn(PorGanaR_2Ej_Pol(6),-2));
            set(handles.CGana2Ej_Pol_jul,'String',roundn(PorGanaR_2Ej_Pol(7),-2));
            set(handles.CGana2Ej_Pol_ago,'String',roundn(PorGanaR_2Ej_Pol(8),-2));
            set(handles.CGana2Ej_Pol_sep,'String',roundn(PorGanaR_2Ej_Pol(9),-2));
            set(handles.CGana2Ej_Pol_oct,'String',roundn(PorGanaR_2Ej_Pol(10),-2));
            set(handles.CGana2Ej_Pol_nov,'String',roundn(PorGanaR_2Ej_Pol(11),-2));
            set(handles.CGana2Ej_Pol_dic,'String',roundn(PorGanaR_2Ej_Pol(12),-2));

            set(handles.CGana2Ej_Pol_media,'String',roundn(mean(PorGanaR_2Ej_Pol),-2));    

        %Mostrar valores de ganancias con respecto a un seguimiento a un eje azimutal
            set(handles.CGana2Ej_Azi_ene,'String',roundn(PorGanaR_2Ej_Azi(1),-2));
            set(handles.CGana2Ej_Azi_feb,'String',roundn(PorGanaR_2Ej_Azi(2),-2));
            set(handles.CGana2Ej_Azi_mar,'String',roundn(PorGanaR_2Ej_Azi(3),-2));
            set(handles.CGana2Ej_Azi_abr,'String',roundn(PorGanaR_2Ej_Azi(4),-2));
            set(handles.CGana2Ej_Azi_may,'String',roundn(PorGanaR_2Ej_Azi(5),-2));
            set(handles.CGana2Ej_Azi_jun,'String',roundn(PorGanaR_2Ej_Azi(6),-2));
            set(handles.CGana2Ej_Azi_jul,'String',roundn(PorGanaR_2Ej_Azi(7),-2));
            set(handles.CGana2Ej_Azi_ago,'String',roundn(PorGanaR_2Ej_Azi(8),-2));
            set(handles.CGana2Ej_Azi_sep,'String',roundn(PorGanaR_2Ej_Azi(9),-2));
            set(handles.CGana2Ej_Azi_oct,'String',roundn(PorGanaR_2Ej_Azi(10),-2));
            set(handles.CGana2Ej_Azi_nov,'String',roundn(PorGanaR_2Ej_Azi(11),-2));
            set(handles.CGana2Ej_Azi_dic,'String',roundn(PorGanaR_2Ej_Azi(12),-2));

            set(handles.CGana2Ej_Azi_media,'String',roundn(mean(PorGanaR_2Ej_Azi),-2)); 


        %Mostrar valores de ganancias con respecto a un seguimiento a un eje horizontal
            set(handles.CGana2Ej_Hor_ene,'String',roundn(PorGanaR_2Ej_Hor(1),-2));
            set(handles.CGana2Ej_Hor_feb,'String',roundn(PorGanaR_2Ej_Hor(2),-2));
            set(handles.CGana2Ej_Hor_mar,'String',roundn(PorGanaR_2Ej_Hor(3),-2));
            set(handles.CGana2Ej_Hor_abr,'String',roundn(PorGanaR_2Ej_Hor(4),-2));
            set(handles.CGana2Ej_Hor_may,'String',roundn(PorGanaR_2Ej_Hor(5),-2));
            set(handles.CGana2Ej_Hor_jun,'String',roundn(PorGanaR_2Ej_Hor(6),-2));
            set(handles.CGana2Ej_Hor_jul,'String',roundn(PorGanaR_2Ej_Hor(7),-2));
            set(handles.CGana2Ej_Hor_ago,'String',roundn(PorGanaR_2Ej_Hor(8),-2));
            set(handles.CGana2Ej_Hor_sep,'String',roundn(PorGanaR_2Ej_Hor(9),-2));
            set(handles.CGana2Ej_Hor_oct,'String',roundn(PorGanaR_2Ej_Hor(10),-2));
            set(handles.CGana2Ej_Hor_nov,'String',roundn(PorGanaR_2Ej_Hor(11),-2));
            set(handles.CGana2Ej_Hor_dic,'String',roundn(PorGanaR_2Ej_Hor(12),-2));

            set(handles.CGana2Ej_Hor_media,'String',roundn(mean(PorGanaR_2Ej_Hor),-2));
            
        
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
global Gd2Ejes media_Gd2Ejes;
global GanaG_2Ej_0 GanaG_2Ej_Anu GanaG_2Ej_Est GanaG_2Ej_Pol GanaG_2Ej_Azi GanaG_2Ej_Hor PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;
%Directa
global Val_Bdm0;
global Bd2Ejes media_Bd2Ejes;
global GanaB_2Ej_0 GanaB_2Ej_Anu GanaB_2Ej_Est GanaB_2Ej_Pol GanaB_2Ej_Azi GanaB_2Ej_Hor PorGanaB_2Ej_0 PorGanaB_2Ej_Anu PorGanaB_2Ej_Est PorGanaB_2Ej_Pol PorGanaB_2Ej_Azi PorGanaB_2Ej_Hor;
%Difusa
global Val_Ddm0;
global Dd2Ejes media_Dd2Ejes;
global GanaD_2Ej_0 GanaD_2Ej_Anu GanaD_2Ej_Est GanaD_2Ej_Pol GanaD_2Ej_Azi GanaD_2Ej_Hor PorGanaD_2Ej_0 PorGanaD_2Ej_Anu PorGanaD_2Ej_Est PorGanaD_2Ej_Pol PorGanaD_2Ej_Azi PorGanaD_2Ej_Hor;
%Albedo
global Rd2Ejes media_Rd2Ejes;
global  GanaR_2Ej_Anu GanaR_2Ej_Est GanaR_2Ej_Pol GanaR_2Ej_Azi GanaR_2Ej_Hor PorGanaR_2Ej_Anu PorGanaR_2Ej_Est PorGanaR_2Ej_Pol PorGanaR_2Ej_Azi PorGanaR_2Ej_Hor;
%ERROR global GanaR_2Ej_0 PorGanaR_2Ej_0

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

                escribirG(1,5)={'Seguimiento a dos ejes'};

                escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};



                %Meses------------------------------------------------------
                for j=1:13
                    escribirG(j+4,1) = Meses(j);
                end

                %Títulos Gdm(0º),  Gdm(2 Ejes)---------------------------
                escribirG(4,2)={'Gdm(0º)'};
                escribirG(4,3)={'Gdm(Seg. a dos ejes)'};


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
                    escribirG(i+4,3) = {Gd2Ejes(i)};
                end
                %Media
                escribirG(17,3)={media_Gd2Ejes};

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
                escribirG(21,17)={'Seg. a un eje horizontal'};

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
                escribirG(22,17)={'Fc.Ganancia'};
                escribirG(22,18)={'Ganancia(%)'};

                %Valores
                %Plano horizontal--------------------------
                for i=1:12
                    escribirG(i+22,2)={GanaG_2Ej_0(i)};
                end 
                for i=1:12
                    escribirG(i+22,3)={PorGanaG_2Ej_0(i)};
                end 
                %medias
                escribirG(35,2)={mean(GanaG_2Ej_0)};
                escribirG(35,3)={mean(PorGanaG_2Ej_0)};
                %Inclinación óptima anual------------------
                for i=1:12
                    escribirG(i+22,5)={GanaG_2Ej_Anu(i)};
                end 
                for i=1:12
                    escribirG(i+22,6)={PorGanaG_2Ej_Anu(i)};
                end
                %medias
                escribirG(35,5)={mean(GanaG_2Ej_Anu)};
                escribirG(35,6)={mean(PorGanaG_2Ej_Anu)};

                %Inclinación óptima estacional-------------
                for i=1:12
                    escribirG(i+22,8)={GanaG_2Ej_Est(i)};
                end 
                for i=1:12
                    escribirG(i+22,9)={PorGanaG_2Ej_Est(i)};
                end
                %medias
                escribirG(35,8)={mean(GanaG_2Ej_Est)};
                escribirG(35,9)={mean(PorGanaG_2Ej_Est)};

                %Seguimiento Polar----------------------
                for i=1:12
                    escribirG(i+22,11)={GanaG_2Ej_Pol(i)};
                end 
                for i=1:12
                    escribirG(i+22,12)={PorGanaG_2Ej_Pol(i)};
                end
                %medias
                escribirG(35,11)={mean(GanaG_2Ej_Pol)};
                escribirG(35,12)={mean(PorGanaG_2Ej_Pol)};

                %Seguimiento Azimutal--------------------
                for i=1:12
                    escribirG(i+22,14)={GanaG_2Ej_Azi(i)};
                end 
                for i=1:12
                    escribirG(i+22,15)={PorGanaG_2Ej_Azi(i)};
                end
                %medias
                escribirG(35,14)={mean(GanaG_2Ej_Azi)};
                escribirG(35,15)={mean(PorGanaG_2Ej_Azi)};

                %Seguimiento Horizontal--------------------
                for i=1:12
                    escribirG(i+22,17)={GanaG_2Ej_Hor(i)};
                end 
                for i=1:12
                    escribirG(i+22,18)={PorGanaG_2Ej_Hor(i)};
                end
                %medias
                escribirG(35,17)={mean(GanaG_2Ej_Hor)};
                escribirG(35,18)={mean(PorGanaG_2Ej_Hor)};     
                    
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

                escribirB(1,5)={'Seguimiento a dos ejes'};

                escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};



                %Meses------------------------------------------------------
                for j=1:13
                    escribirB(j+4,1) = Meses(j);
                end

                %Títulos Bdm(0º),  Bdm(2 Ejes)---------------------------
                escribirB(4,2)={'Bdm(0º)'};
                escribirB(4,3)={'Bdm(Seg. a dos ejes)'};


                %Valores
                %Gdm (0º)--------------------------------------------------
                for k=1:12
                    escribirB(k+4,2) = {Val_Bdm0(k)};
                end
                %Media
                escribirB(17,2)={mean(Val_Bdm0)};     

                %Bdm (Seguimiento)-----------------------------------------
                for i=1:12
                    escribirB(i+4,3) = {Bd2Ejes(i)};
                end
                %Media
                escribirB(17,3)={media_Bd2Ejes};

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
                escribirB(21,17)={'Seg. a un eje horizontal'};

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
                escribirB(22,17)={'Fc.Ganancia'};
                escribirB(22,18)={'Ganancia(%)'};

                %Valores
                %Plano horizontal--------------------------
                for i=1:12
                    escribirB(i+22,2)={GanaB_2Ej_0(i)};
                end 
                for i=1:12
                    escribirB(i+22,3)={PorGanaB_2Ej_0(i)};
                end 
                %medias
                escribirB(35,2)={mean(GanaB_2Ej_0)};
                escribirB(35,3)={mean(PorGanaB_2Ej_0)};
                %Inclinación óptima anual------------------
                for i=1:12
                    escribirB(i+22,5)={GanaB_2Ej_Anu(i)};
                end 
                for i=1:12
                    escribirB(i+22,6)={PorGanaB_2Ej_Anu(i)};
                end
                %medias
                escribirB(35,5)={mean(GanaB_2Ej_Anu)};
                escribirB(35,6)={mean(PorGanaB_2Ej_Anu)};

                %Inclinación óptima estacional-------------
                for i=1:12
                    escribirB(i+22,8)={GanaB_2Ej_Est(i)};
                end 
                for i=1:12
                    escribirB(i+22,9)={PorGanaB_2Ej_Est(i)};
                end
                %medias
                escribirB(35,8)={mean(GanaB_2Ej_Est)};
                escribirB(35,9)={mean(PorGanaB_2Ej_Est)};

                %Seguimiento Polar----------------------
                for i=1:12
                    escribirB(i+22,11)={GanaB_2Ej_Pol(i)};
                end 
                for i=1:12
                    escribirB(i+22,12)={PorGanaB_2Ej_Pol(i)};
                end
                %medias
                escribirB(35,11)={mean(GanaB_2Ej_Pol)};
                escribirB(35,12)={mean(PorGanaB_2Ej_Pol)};

                %Seguimiento Azimutal--------------------
                for i=1:12
                    escribirB(i+22,14)={GanaB_2Ej_Azi(i)};
                end 
                for i=1:12
                    escribirB(i+22,15)={PorGanaB_2Ej_Azi(i)};
                end
                %medias
                escribirB(35,14)={mean(GanaB_2Ej_Azi)};
                escribirB(35,15)={mean(PorGanaB_2Ej_Azi)};   

                %Seguimiento Horizontal--------------------
                for i=1:12
                    escribirB(i+22,17)={GanaB_2Ej_Hor(i)};
                end 
                for i=1:12
                    escribirB(i+22,18)={PorGanaB_2Ej_Hor(i)};
                end
                %medias
                escribirB(35,17)={mean(GanaB_2Ej_Hor)};
                escribirB(35,18)={mean(PorGanaB_2Ej_Hor)};    
               
               
               
               %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
               xlswrite(fullfile(ruta,nombre),escribirB,'Hoja1','A1');
               %Aviso
               msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
               
               
               
            case 3 %Difusa
               %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
                escribirD(1,1) = NOMBRE_CIUDAD;
                escribirD(1,2)={'Latitud'};
                escribirD(1,3)={DATOS(2)};

                escribirD(1,5)={'Seguimiento a dos ejes'};

                escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};



                %Meses------------------------------------------------------
                for j=1:13
                    escribirD(j+4,1) = Meses(j);
                end

                %Títulos Ddm(0º),  Ddm(2 Ejes)---------------------------
                escribirD(4,2)={'Ddm(0º)'};
                escribirD(4,3)={'Ddm(Seg. a dos ejes)'};


                %Valores
                %Ddm (0º)--------------------------------------------------
                for k=1:12
                    escribirD(k+4,2) = {Val_Ddm0(k)};
                end
                %Media
                escribirD(17,2)={mean(Val_Ddm0)};     

                %Ddm (Seguimiento)-----------------------------------------
                for i=1:12
                    escribirD(i+4,3) = {Dd2Ejes(i)};
                end
                %Media
                escribirD(17,3)={media_Dd2Ejes};

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
                escribirD(21,17)={'Seg. a un eje horizontal'};

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
                escribirD(21,17)={'Fc.Ganancia'};
                escribirD(22,18)={'Ganancia(%)'};

                %Valores
                %Plano horizontal--------------------------
                for i=1:12
                    escribirD(i+22,2)={GanaD_2Ej_0(i)};
                end 
                for i=1:12
                    escribirD(i+22,3)={PorGanaD_2Ej_0(i)};
                end 
                %medias
                escribirD(35,2)={mean(GanaD_2Ej_0)};
                escribirD(35,3)={mean(PorGanaD_2Ej_0)};
                %Inclinación óptima anual------------------
                for i=1:12
                    escribirD(i+22,5)={GanaD_2Ej_Anu(i)};
                end 
                for i=1:12
                    escribirD(i+22,6)={PorGanaD_2Ej_Anu(i)};
                end
                %medias
                escribirD(35,5)={mean(GanaD_2Ej_Anu)};
                escribirD(35,6)={mean(PorGanaD_2Ej_Anu)};

                %Inclinación óptima estacional-------------
                for i=1:12
                    escribirD(i+22,8)={GanaD_2Ej_Est(i)};
                end 
                for i=1:12
                    escribirD(i+22,9)={PorGanaD_2Ej_Est(i)};
                end
                %medias
                escribirD(35,8)={mean(GanaD_2Ej_Est)};
                escribirD(35,9)={mean(PorGanaD_2Ej_Est)};

                %Seguimiento Polar----------------------
                for i=1:12
                    escribirD(i+22,11)={GanaD_2Ej_Pol(i)};
                end 
                for i=1:12
                    escribirD(i+22,12)={PorGanaD_2Ej_Pol(i)};
                end
                %medias
                escribirD(35,11)={mean(GanaD_2Ej_Pol)};
                escribirD(35,12)={mean(PorGanaD_2Ej_Pol)};

                %Seguimiento Azimutal--------------------
                for i=1:12
                    escribirD(i+22,14)={GanaD_2Ej_Azi(i)};
                end 
                for i=1:12
                    escribirD(i+22,15)={PorGanaD_2Ej_Azi(i)};
                end
                %medias
                escribirD(35,14)={mean(GanaD_2Ej_Azi)};
                escribirD(35,15)={mean(PorGanaD_2Ej_Azi)};   

                %Seguimiento Horizontal-------------------
                for i=1:12
                    escribirD(i+22,17)={GanaD_2Ej_Hor(i)};
                end 
                for i=1:12
                    escribirD(i+22,18)={PorGanaD_2Ej_Hor(i)};
                end
                %medias
                escribirD(35,17)={mean(GanaD_2Ej_Hor)};
                escribirD(35,18)={mean(PorGanaD_2Ej_Hor)};                 
               
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

                escribirR(1,5)={'Seguimiento a dos ejes'};

                escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};



                %Meses------------------------------------------------------
                for j=1:13
                    escribirR(j+4,1) = Meses(j);
                end

                %Títulos Rdm(0º),  Rdm(2 Ejes)---------------------------
                escribirR(4,2)={'Rdm(0º)'};
                escribirR(4,3)={'Rdm(Seg. a dos ejes)'};


                %Valores
                %Rdm (0º)--------------------------------------------------
                for k=1:12
                    escribirR(k+4,2) = {0};
                end
                %Media
                escribirR(17,2)={0};     

                %Rdm (Seguimiento)-----------------------------------------
                for i=1:12
                    escribirR(i+4,3) = {Rd2Ejes(i)};
                end
                %Media
                escribirR(17,3)={media_Rd2Ejes};

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
                escribirR(21,17)={'Seg. a un eje horizontal'};

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
                escribirR(21,17)={'Fc.Ganancia'};
                escribirR(22,18)={'Ganancia(%)'};

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
                        escribirR(i+22,5)={GanaR_2Ej_Anu(i)};
                    end 
                    for i=1:12
                        escribirR(i+22,6)={PorGanaR_2Ej_Anu(i)};
                    end
                    %medias
                    escribirR(35,5)={mean(GanaR_2Ej_Anu)};
                    escribirR(35,6)={mean(PorGanaR_2Ej_Anu)};
                end

                %Inclinación óptima estacional-------------(-------(CAMBIO)-------)
                for i=1:12
                    if GanaR_2Ej_Est(i)== Inf
                        escribirR(i+22,8)={'-'};
                    else
                    escribirR(i+22,8)={GanaR_2Ej_Est(i)};
                    end 
                end
                for i=1:12
                    if GanaR_2Ej_Est(i)== Inf
                        escribirR(i+22,9)={'-'};
                    else
                    escribirR(i+22,9)={PorGanaR_2Ej_Est(i)};
                    end
                end
                %medias
                if mean(GanaR_2Ej_Est)==Inf
                    escribirR(35,8)={'-'};
                    escribirR(35,9)={'-'};
                else
                escribirR(35,8)={mean(GanaR_2Ej_Est)};
                escribirR(35,9)={mean(PorGanaR_2Ej_Est)};
                end

                %Seguimiento Polar----------------------
                for i=1:12
                    escribirR(i+22,11)={GanaR_2Ej_Pol(i)};
                end 
                for i=1:12
                    escribirR(i+22,12)={PorGanaR_2Ej_Pol(i)};
                end
                %medias
                escribirR(35,11)={mean(GanaR_2Ej_Pol)};
                escribirR(35,12)={mean(PorGanaR_2Ej_Pol)};

                %Seguimiento Azimutal--------------------
                for i=1:12
                    escribirR(i+22,14)={GanaR_2Ej_Azi(i)};
                end 
                for i=1:12
                    escribirR(i+22,15)={PorGanaR_2Ej_Azi(i)};
                end
                %medias
                escribirR(35,14)={mean(GanaR_2Ej_Azi)};
                escribirR(35,15)={mean(PorGanaR_2Ej_Azi)};    

                %Seguimiento Horizontal--------------------
                for i=1:12
                    escribirR(i+22,17)={GanaR_2Ej_Hor(i)};
                end 
                for i=1:12
                    escribirR(i+22,18)={PorGanaR_2Ej_Hor(i)};
                end
                %medias
                escribirR(35,17)={mean(GanaR_2Ej_Hor)};
                escribirR(35,18)={mean(PorGanaR_2Ej_Hor)};         
               
               
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
        
        escribirG(1,5)={'Seguimiento a dos ejes'};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirG(j+4,1) = Meses(j);
        end
        
        %Títulos Gdm(0º),  Gdm(2 Ejes)---------------------------
        escribirG(4,2)={'Gdm(0º)'};
        escribirG(4,3)={'Gdm(Seg. a dos ejes)'};
        
        
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
            escribirG(i+4,3) = {Gd2Ejes(i)};
        end
        %Media
        escribirG(17,3)={media_Gd2Ejes};
        
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
        escribirG(21,17)={'Seg. a un eje horizontal'};
        
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
        escribirG(22,17)={'Fc.Ganancia'};
        escribirG(22,18)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirG(i+22,2)={GanaG_2Ej_0(i)};
        end 
        for i=1:12
            escribirG(i+22,3)={PorGanaG_2Ej_0(i)};
        end 
        %medias
        escribirG(35,2)={mean(GanaG_2Ej_0)};
        escribirG(35,3)={mean(PorGanaG_2Ej_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirG(i+22,5)={GanaG_2Ej_Anu(i)};
        end 
        for i=1:12
            escribirG(i+22,6)={PorGanaG_2Ej_Anu(i)};
        end
        %medias
        escribirG(35,5)={mean(GanaG_2Ej_Anu)};
        escribirG(35,6)={mean(PorGanaG_2Ej_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirG(i+22,8)={GanaG_2Ej_Est(i)};
        end 
        for i=1:12
            escribirG(i+22,9)={PorGanaG_2Ej_Est(i)};
        end
        %medias
        escribirG(35,8)={mean(GanaG_2Ej_Est)};
        escribirG(35,9)={mean(PorGanaG_2Ej_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirG(i+22,11)={GanaG_2Ej_Pol(i)};
        end 
        for i=1:12
            escribirG(i+22,12)={PorGanaG_2Ej_Pol(i)};
        end
        %medias
        escribirG(35,11)={mean(GanaG_2Ej_Pol)};
        escribirG(35,12)={mean(PorGanaG_2Ej_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirG(i+22,14)={GanaG_2Ej_Azi(i)};
        end 
        for i=1:12
            escribirG(i+22,15)={PorGanaG_2Ej_Azi(i)};
        end
        %medias
        escribirG(35,14)={mean(GanaG_2Ej_Azi)};
        escribirG(35,15)={mean(PorGanaG_2Ej_Azi)};
       
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirG(i+22,17)={GanaG_2Ej_Hor(i)};
        end 
        for i=1:12
            escribirG(i+22,18)={PorGanaG_2Ej_Hor(i)};
        end
        %medias
        escribirG(35,17)={mean(GanaG_2Ej_Hor)};
        escribirG(35,18)={mean(PorGanaG_2Ej_Hor)};
        
        
        %RADIACIÓN DIRECTA DIARIA::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Seguimiento a dos ejes'};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirB(j+4,1) = Meses(j);
        end
        
        %Títulos Bdm(0º),  Bdm(2 Ejes)---------------------------
        escribirB(4,2)={'Bdm(0º)'};
        escribirB(4,3)={'Bdm(Seg. a dos ejes)'};
        
        
        %Valores
        %Gdm (0º)--------------------------------------------------
        for k=1:12
            escribirB(k+4,2) = {Val_Bdm0(k)};
        end
        %Media
        escribirB(17,2)={mean(Val_Bdm0)};     
              
        %Bdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirB(i+4,3) = {Bd2Ejes(i)};
        end
        %Media
        escribirB(17,3)={media_Bd2Ejes};
        
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
        escribirB(21,17)={'Seg. a un eje horizontal'};
        
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
        escribirB(22,17)={'Fc.Ganancia'};
        escribirB(22,18)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirB(i+22,2)={GanaB_2Ej_0(i)};
        end 
        for i=1:12
            escribirB(i+22,3)={PorGanaB_2Ej_0(i)};
        end 
        %medias
        escribirB(35,2)={mean(GanaB_2Ej_0)};
        escribirB(35,3)={mean(PorGanaB_2Ej_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirB(i+22,5)={GanaB_2Ej_Anu(i)};
        end 
        for i=1:12
            escribirB(i+22,6)={PorGanaB_2Ej_Anu(i)};
        end
        %medias
        escribirB(35,5)={mean(GanaB_2Ej_Anu)};
        escribirB(35,6)={mean(PorGanaB_2Ej_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirB(i+22,8)={GanaB_2Ej_Est(i)};
        end 
        for i=1:12
            escribirB(i+22,9)={PorGanaB_2Ej_Est(i)};
        end
        %medias
        escribirB(35,8)={mean(GanaB_2Ej_Est)};
        escribirB(35,9)={mean(PorGanaB_2Ej_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirB(i+22,11)={GanaB_2Ej_Pol(i)};
        end 
        for i=1:12
            escribirB(i+22,12)={PorGanaB_2Ej_Pol(i)};
        end
        %medias
        escribirB(35,11)={mean(GanaB_2Ej_Pol)};
        escribirB(35,12)={mean(PorGanaB_2Ej_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirB(i+22,14)={GanaB_2Ej_Azi(i)};
        end 
        for i=1:12
            escribirB(i+22,15)={PorGanaB_2Ej_Azi(i)};
        end
        %medias
        escribirB(35,14)={mean(GanaB_2Ej_Azi)};
        escribirB(35,15)={mean(PorGanaB_2Ej_Azi)};   
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirB(i+22,17)={GanaB_2Ej_Hor(i)};
        end 
        for i=1:12
            escribirB(i+22,18)={PorGanaB_2Ej_Hor(i)};
        end
        %medias
        escribirB(35,17)={mean(GanaB_2Ej_Hor)};
        escribirB(35,18)={mean(PorGanaB_2Ej_Hor)};
        
        %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Seguimiento a dos ejes'};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirD(j+4,1) = Meses(j);
        end
        
        %Títulos Ddm(0º),  Ddm(2 Ejes)---------------------------
        escribirD(4,2)={'Ddm(0º)'};
        escribirD(4,3)={'Ddm(Seg. a dos ejes)'};
        
        
        %Valores
        %Ddm (0º)--------------------------------------------------
        for k=1:12
            escribirD(k+4,2) = {Val_Ddm0(k)};
        end
        %Media
        escribirD(17,2)={mean(Val_Ddm0)};     
              
        %Ddm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirD(i+4,3) = {Dd2Ejes(i)};
        end
        %Media
        escribirD(17,3)={media_Dd2Ejes};
        
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
        escribirD(21,17)={'Seg. a un eje horizontal'};
        
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
        escribirD(21,17)={'Fc.Ganancia'};
        escribirD(22,18)={'Ganancia(%)'};
        
        %Valores
        %Plano horizontal--------------------------
        for i=1:12
            escribirD(i+22,2)={GanaD_2Ej_0(i)};
        end 
        for i=1:12
            escribirD(i+22,3)={PorGanaD_2Ej_0(i)};
        end 
        %medias
        escribirD(35,2)={mean(GanaD_2Ej_0)};
        escribirD(35,3)={mean(PorGanaD_2Ej_0)};
        %Inclinación óptima anual------------------
        for i=1:12
            escribirD(i+22,5)={GanaD_2Ej_Anu(i)};
        end 
        for i=1:12
            escribirD(i+22,6)={PorGanaD_2Ej_Anu(i)};
        end
        %medias
        escribirD(35,5)={mean(GanaD_2Ej_Anu)};
        escribirD(35,6)={mean(PorGanaD_2Ej_Anu)};
        
        %Inclinación óptima estacional-------------
        for i=1:12
            escribirD(i+22,8)={GanaD_2Ej_Est(i)};
        end 
        for i=1:12
            escribirD(i+22,9)={PorGanaD_2Ej_Est(i)};
        end
        %medias
        escribirD(35,8)={mean(GanaD_2Ej_Est)};
        escribirD(35,9)={mean(PorGanaD_2Ej_Est)};
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirD(i+22,11)={GanaD_2Ej_Pol(i)};
        end 
        for i=1:12
            escribirD(i+22,12)={PorGanaD_2Ej_Pol(i)};
        end
        %medias
        escribirD(35,11)={mean(GanaD_2Ej_Pol)};
        escribirD(35,12)={mean(PorGanaD_2Ej_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirD(i+22,14)={GanaD_2Ej_Azi(i)};
        end 
        for i=1:12
            escribirD(i+22,15)={PorGanaD_2Ej_Azi(i)};
        end
        %medias
        escribirD(35,14)={mean(GanaD_2Ej_Azi)};
        escribirD(35,15)={mean(PorGanaD_2Ej_Azi)};   
        
        %Seguimiento Horizontal-------------------
        for i=1:12
            escribirD(i+22,17)={GanaD_2Ej_Hor(i)};
        end 
        for i=1:12
            escribirD(i+22,18)={PorGanaD_2Ej_Hor(i)};
        end
        %medias
        escribirD(35,17)={mean(GanaD_2Ej_Hor)};
        escribirD(35,18)={mean(PorGanaD_2Ej_Hor)};  
        
        %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Seguimiento a dos ejes'};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirR(j+4,1) = Meses(j);
        end
        
        %Títulos Rdm(0º),  Rdm(2 Ejes)---------------------------
        escribirR(4,2)={'Rdm(0º)'};
        escribirR(4,3)={'Rdm(Seg. a dos ejes)'};
        
        
        %Valores
        %Rdm (0º)--------------------------------------------------
        for k=1:12
            escribirR(k+4,2) = {0};
        end
        %Media
        escribirR(17,2)={0};     
              
        %Rdm (Seguimiento)-----------------------------------------
        for i=1:12
            escribirR(i+4,3) = {Rd2Ejes(i)};
        end
        %Media
        escribirR(17,3)={media_Rd2Ejes};
        
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
        escribirR(21,17)={'Seg. a un eje horizontal'};
        
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
        escribirR(21,17)={'Fc.Ganancia'};
        escribirR(22,18)={'Ganancia(%)'};
        
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
                escribirR(i+22,5)={GanaR_2Ej_Anu(i)};
            end 
            for i=1:12
                escribirR(i+22,6)={PorGanaR_2Ej_Anu(i)};
            end
            %medias
            escribirR(35,5)={mean(GanaR_2Ej_Anu)};
            escribirR(35,6)={mean(PorGanaR_2Ej_Anu)};
        end
        %Inclinación óptima estacional-------------(-------(CAMBIO)-------)
        for i=1:12
            if GanaR_2Ej_Est(i)== Inf
                escribirR(i+22,8)={'-'};
            else
            escribirR(i+22,8)={GanaR_2Ej_Est(i)};
            end 
        end
        for i=1:12
            if GanaR_2Ej_Est(i)== Inf
                escribirR(i+22,9)={'-'};
            else
            escribirR(i+22,9)={PorGanaR_2Ej_Est(i)};
            end
        end
        %medias
        if mean(GanaR_2Ej_Est)==Inf
            escribirR(35,8)={'-'};
            escribirR(35,9)={'-'};
        else
        escribirR(35,8)={mean(GanaR_2Ej_Est)};
        escribirR(35,9)={mean(PorGanaR_2Ej_Est)};
        end
        
        %Seguimiento Polar----------------------
        for i=1:12
            escribirR(i+22,11)={GanaR_2Ej_Pol(i)};
        end 
        for i=1:12
            escribirR(i+22,12)={PorGanaR_2Ej_Pol(i)};
        end
        %medias
        escribirR(35,11)={mean(GanaR_2Ej_Pol)};
        escribirR(35,12)={mean(PorGanaR_2Ej_Pol)};
        
        %Seguimiento Azimutal--------------------
        for i=1:12
            escribirR(i+22,14)={GanaR_2Ej_Azi(i)};
        end 
        for i=1:12
            escribirR(i+22,15)={PorGanaR_2Ej_Azi(i)};
        end
        %medias
        escribirR(35,14)={mean(GanaR_2Ej_Azi)};
        escribirR(35,15)={mean(PorGanaR_2Ej_Azi)};    
        
        %Seguimiento Horizontal--------------------
        for i=1:12
            escribirR(i+22,17)={GanaR_2Ej_Hor(i)};
        end 
        for i=1:12
            escribirR(i+22,18)={PorGanaR_2Ej_Hor(i)};
        end
        %medias
        escribirR(35,17)={mean(GanaR_2Ej_Hor)};
        escribirR(35,18)={mean(PorGanaR_2Ej_Hor)};         
         
   
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
global PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;
global medPorGanaG_2Ej_0 medPorGanaG_2Ej_Anu medPorGanaG_2Ej_Est medPorGanaG_2Ej_Pol medPorGanaG_2Ej_Azi medPorGanaG_2Ej_Hor;
%B
global Val_Bdm0 medRadB0;
global PorGanaB_2Ej_0 PorGanaB_2Ej_Anu PorGanaB_2Ej_Est PorGanaB_2Ej_Pol PorGanaB_2Ej_Azi PorGanaB_2Ej_Hor;
global medPorGanaB_2Ej_0 medPorGanaB_2Ej_Anu medPorGanaB_2Ej_Est medPorGanaB_2Ej_Pol medPorGanaB_2Ej_Azi medPorGanaB_2Ej_Hor;
%D
global Val_Ddm0 medRadD0;
global PorGanaD_2Ej_0 PorGanaD_2Ej_Anu PorGanaD_2Ej_Est PorGanaD_2Ej_Pol PorGanaD_2Ej_Azi PorGanaD_2Ej_Hor;
global medPorGanaD_2Ej_0 medPorGanaD_2Ej_Anu medPorGanaD_2Ej_Est medPorGanaD_2Ej_Pol medPorGanaD_2Ej_Azi medPorGanaD_2Ej_Hor;
%R
global Val_Rdm0 medRadR0;
global PorGanaR_2Ej_0 PorGanaR_2Ej_Anu PorGanaR_2Ej_Est PorGanaR_2Ej_Pol PorGanaR_2Ej_Azi PorGanaR_2Ej_Hor;
global medPorGanaR_2Ej_0 medPorGanaR_2Ej_Anu medPorGanaR_2Ej_Est medPorGanaR_2Ej_Pol medPorGanaR_2Ej_Azi medPorGanaR_2Ej_Hor;

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
medPorGanaG_2Ej_0 = mean(PorGanaG_2Ej_0);
medPorGanaG_2Ej_Anu = mean(PorGanaG_2Ej_Anu);
medPorGanaG_2Ej_Est = mean(PorGanaG_2Ej_Est);
medPorGanaG_2Ej_Pol = mean(PorGanaG_2Ej_Pol);
medPorGanaG_2Ej_Azi = mean(PorGanaG_2Ej_Azi);
medPorGanaG_2Ej_Hor = mean(PorGanaG_2Ej_Hor);

%DIRECTA-----------------------------------
%Media radiación directa 0º
medRadB0 = mean (Val_Bdm0);

%Ganancias
medPorGanaB_2Ej_0 = mean(PorGanaB_2Ej_0);
medPorGanaB_2Ej_Anu = mean(PorGanaB_2Ej_Anu);
medPorGanaB_2Ej_Est = mean(PorGanaB_2Ej_Est);
medPorGanaB_2Ej_Pol = mean(PorGanaB_2Ej_Pol);
medPorGanaB_2Ej_Azi = mean(PorGanaB_2Ej_Azi);
medPorGanaB_2Ej_Hor = mean(PorGanaB_2Ej_Hor);

%DIFUSA-------------------------------------
%Media radiación directa 0º
medRadD0 = mean (Val_Ddm0);

%Ganancias
medPorGanaD_2Ej_0 = mean(PorGanaD_2Ej_0);
medPorGanaD_2Ej_Anu = mean(PorGanaD_2Ej_Anu);
medPorGanaD_2Ej_Est = mean(PorGanaD_2Ej_Est);
medPorGanaD_2Ej_Pol = mean(PorGanaD_2Ej_Pol);
medPorGanaD_2Ej_Azi = mean(PorGanaD_2Ej_Azi);
medPorGanaD_2Ej_Hor = mean(PorGanaD_2Ej_Hor);

%ALBEDO-----------------------------------
%Media radiación directa 0º
Val_Rdm0 = zeros(1,12);
medRadR0 = 0;
 
%Ganancias
medPorGanaR_2Ej_0 = mean(PorGanaR_2Ej_0);
medPorGanaR_2Ej_Anu = mean(PorGanaR_2Ej_Anu);
medPorGanaR_2Ej_Est = mean(PorGanaR_2Ej_Est);
medPorGanaR_2Ej_Pol = mean(PorGanaR_2Ej_Pol);
medPorGanaR_2Ej_Azi = mean(PorGanaR_2Ej_Azi);
medPorGanaR_2Ej_Hor = mean(PorGanaR_2Ej_Hor);

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'

        report ReportSeg2Ejes.rpt;

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

close ('OrientSol 3.0 - Seguimiento a dos ejes');
 



% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_2Ejes;

close ('OrientSol 3.0 - Seguimiento a dos ejes');

% --- Executes on button press in Energia.
function Energia_Callback(hObject, eventdata, handles)
global DATOS;
global Gd2Ejes;

global RADIACION_OST;

global VOLVER_ENER;

VOLVER_ENER = 6;

RADIACION_OST  = Gd2Ejes;

if (DATOS(15)==1000)
   
   Energia_Osterwald_N;  
   close ('OrientSol 3.0 - Seguimiento a dos ejes');
   
else 
   
   Energia_Osterwald;
   close ('OrientSol 3.0 - Seguimiento a dos ejes');
   
end

%global RADIACION
%RADIACION  = mean(Gd2Ejes);
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
