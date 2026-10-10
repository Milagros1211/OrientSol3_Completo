function varargout = Tabla_OptAnual(varargin)
% TABLA_OPTANUAL MATLAB code for Tabla_OptAnual.fig
%      TABLA_OPTANUAL, by itself, creates a new TABLA_OPTANUAL or raises the existing
%      singleton*.
%
%      H = TABLA_OPTANUAL returns the handle to a new TABLA_OPTANUAL or the handle to
%      the existing singleton*.
%
%      TABLA_OPTANUAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_OPTANUAL.M with the given input arguments.
%
%      TABLA_OPTANUAL('Property','Value',...) creates a new TABLA_OPTANUAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_OptAnual_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_OptAnual_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_OptAnual

% Last Modified by GUIDE v2.5 22-Jan-2015 16:35:42

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_OptAnual_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_OptAnual_OutputFcn, ...
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


% --- Executes just before Tabla_OptAnual is made visible.
function Tabla_OptAnual_OpeningFcn(hObject, eventdata, handles, varargin)
global OPCION_COMP

global NOMBRE_CIUDAD DATOS 

global GdBetaTotal;
global angulo_optimo Radiacion_optima suma_angulo_optimo;
%Ganancias
global GanaG_Anu_0 PorGanaG_Anu_0;


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

     %Media de las temperaturas
        sumT = 0;
        for i=15:26
            sumT = sumT + DATOS(i);
        end
        
        mediaT = sumT/12;
        
set(handles.T_media,'String',roundn(mediaT,-2));

end

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
    
    
    %Mostrar valores para inclinación de 15º
    set(handles.C15_ene,'String',roundn(GdBetaTotal(1,15),-2));
    set(handles.C15_feb,'String',roundn(GdBetaTotal(2,15),-2));
    set(handles.C15_mar,'String',roundn(GdBetaTotal(3,15),-2));
    set(handles.C15_abr,'String',roundn(GdBetaTotal(4,15),-2));
    set(handles.C15_may,'String',roundn(GdBetaTotal(5,15),-2));
    set(handles.C15_jun,'String',roundn(GdBetaTotal(6,15),-2));
    set(handles.C15_jul,'String',roundn(GdBetaTotal(7,15),-2));
    set(handles.C15_ago,'String',roundn(GdBetaTotal(8,15),-2));
    set(handles.C15_sep,'String',roundn(GdBetaTotal(9,15),-2));
    set(handles.C15_oct,'String',roundn(GdBetaTotal(10,15),-2));
    set(handles.C15_nov,'String',roundn(GdBetaTotal(11,15),-2));
    set(handles.C15_dic,'String',roundn(GdBetaTotal(12,15),-2));
    
    set(handles.C15_media,'String',roundn(mean(GdBetaTotal(:,15)),-2));

    
    %Mostrar valores para inclinación de 30º
    set(handles.C30_ene,'String',roundn(GdBetaTotal(1,30),-2));
    set(handles.C30_feb,'String',roundn(GdBetaTotal(2,30),-2));
    set(handles.C30_mar,'String',roundn(GdBetaTotal(3,30),-2));
    set(handles.C30_abr,'String',roundn(GdBetaTotal(4,30),-2));
    set(handles.C30_may,'String',roundn(GdBetaTotal(5,30),-2));
    set(handles.C30_jun,'String',roundn(GdBetaTotal(6,30),-2));
    set(handles.C30_jul,'String',roundn(GdBetaTotal(7,30),-2));
    set(handles.C30_ago,'String',roundn(GdBetaTotal(8,30),-2));
    set(handles.C30_sep,'String',roundn(GdBetaTotal(9,30),-2));
    set(handles.C30_oct,'String',roundn(GdBetaTotal(10,30),-2));
    set(handles.C30_nov,'String',roundn(GdBetaTotal(11,30),-2));
    set(handles.C30_dic,'String',roundn(GdBetaTotal(12,30),-2));
    
    set(handles.C30_media,'String',roundn(mean(GdBetaTotal(:,30)),-2));
    
        
    %Mostrar valores para inclinación de 45º
    set(handles.C45_ene,'String',roundn(GdBetaTotal(1,45),-2));
    set(handles.C45_feb,'String',roundn(GdBetaTotal(2,45),-2));
    set(handles.C45_mar,'String',roundn(GdBetaTotal(3,45),-2));
    set(handles.C45_abr,'String',roundn(GdBetaTotal(4,45),-2));
    set(handles.C45_may,'String',roundn(GdBetaTotal(5,45),-2));
    set(handles.C45_jun,'String',roundn(GdBetaTotal(6,45),-2));
    set(handles.C45_jul,'String',roundn(GdBetaTotal(7,45),-2));
    set(handles.C45_ago,'String',roundn(GdBetaTotal(8,45),-2));
    set(handles.C45_sep,'String',roundn(GdBetaTotal(9,45),-2));
    set(handles.C45_oct,'String',roundn(GdBetaTotal(10,45),-2));
    set(handles.C45_nov,'String',roundn(GdBetaTotal(11,45),-2));
    set(handles.C45_dic,'String',roundn(GdBetaTotal(12,45),-2));
    
    set(handles.C45_media,'String',roundn(mean(GdBetaTotal(:,45)),-2));
    
    
    %Mostrar valores para inclinación de 60º
    set(handles.C60_ene,'String',roundn(GdBetaTotal(1,60),-2));
    set(handles.C60_feb,'String',roundn(GdBetaTotal(2,60),-2));
    set(handles.C60_mar,'String',roundn(GdBetaTotal(3,60),-2));
    set(handles.C60_abr,'String',roundn(GdBetaTotal(4,60),-2));
    set(handles.C60_may,'String',roundn(GdBetaTotal(5,60),-2));
    set(handles.C60_jun,'String',roundn(GdBetaTotal(6,60),-2));
    set(handles.C60_jul,'String',roundn(GdBetaTotal(7,60),-2));
    set(handles.C60_ago,'String',roundn(GdBetaTotal(8,60),-2));
    set(handles.C60_sep,'String',roundn(GdBetaTotal(9,60),-2));
    set(handles.C60_oct,'String',roundn(GdBetaTotal(10,60),-2));
    set(handles.C60_nov,'String',roundn(GdBetaTotal(11,60),-2));
    set(handles.C60_dic,'String',roundn(GdBetaTotal(12,60),-2));
    
    set(handles.C60_media,'String',roundn(mean(GdBetaTotal(:,60)),-2));
    
    
    %Mostrar valores para inclinación de 75º
    set(handles.C75_ene,'String',roundn(GdBetaTotal(1,75),-2));
    set(handles.C75_feb,'String',roundn(GdBetaTotal(2,75),-2));
    set(handles.C75_mar,'String',roundn(GdBetaTotal(3,75),-2));
    set(handles.C75_abr,'String',roundn(GdBetaTotal(4,75),-2));
    set(handles.C75_may,'String',roundn(GdBetaTotal(5,75),-2));
    set(handles.C75_jun,'String',roundn(GdBetaTotal(6,75),-2));
    set(handles.C75_jul,'String',roundn(GdBetaTotal(7,75),-2));
    set(handles.C75_ago,'String',roundn(GdBetaTotal(8,75),-2));
    set(handles.C75_sep,'String',roundn(GdBetaTotal(9,75),-2));
    set(handles.C75_oct,'String',roundn(GdBetaTotal(10,75),-2));
    set(handles.C75_nov,'String',roundn(GdBetaTotal(11,75),-2));
    set(handles.C75_dic,'String',roundn(GdBetaTotal(12,75),-2));
    
    set(handles.C75_media,'String',roundn(mean(GdBetaTotal(:,75)),-2));
    
    %Mostrar valores para inclinación de 90º
    set(handles.C90_ene,'String',roundn(GdBetaTotal(1,90),-2));
    set(handles.C90_feb,'String',roundn(GdBetaTotal(2,90),-2));
    set(handles.C90_mar,'String',roundn(GdBetaTotal(3,90),-2));
    set(handles.C90_abr,'String',roundn(GdBetaTotal(4,90),-2));
    set(handles.C90_may,'String',roundn(GdBetaTotal(5,90),-2));
    set(handles.C90_jun,'String',roundn(GdBetaTotal(6,90),-2));
    set(handles.C90_jul,'String',roundn(GdBetaTotal(7,90),-2));
    set(handles.C90_ago,'String',roundn(GdBetaTotal(8,90),-2));
    set(handles.C90_sep,'String',roundn(GdBetaTotal(9,90),-2));
    set(handles.C90_oct,'String',roundn(GdBetaTotal(10,90),-2));
    set(handles.C90_nov,'String',roundn(GdBetaTotal(11,90),-2));
    set(handles.C90_dic,'String',roundn(GdBetaTotal(12,90),-2));
    
    set(handles.C90_media,'String',roundn(mean(GdBetaTotal(:,90)),-2));
    
    
    %Inclinación óptima
    set (handles.Ang_Opt,'String', angulo_optimo);
    
    set(handles.COpt_ene,'String',roundn(Radiacion_optima(1),-2));
    set(handles.COpt_feb,'String',roundn(Radiacion_optima(2),-2));
    set(handles.COpt_mar,'String',roundn(Radiacion_optima(3),-2));
    set(handles.COpt_abr,'String',roundn(Radiacion_optima(4),-2));
    set(handles.COpt_may,'String',roundn(Radiacion_optima(5),-2));
    set(handles.COpt_jun,'String',roundn(Radiacion_optima(6),-2));
    set(handles.COpt_jul,'String',roundn(Radiacion_optima(7),-2));
    set(handles.COpt_ago,'String',roundn(Radiacion_optima(8),-2));
    set(handles.COpt_sep,'String',roundn(Radiacion_optima(9),-2));
    set(handles.COpt_oct,'String',roundn(Radiacion_optima(10),-2));
    set(handles.COpt_nov,'String',roundn(Radiacion_optima(11),-2));
    set(handles.COpt_dic,'String',roundn(Radiacion_optima(12),-2));
   
    set(handles.COpt_media,'String',roundn(suma_angulo_optimo,-2));
    
    
    
%GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Factor de ganancia
    set(handles.CFcGana_ene, 'String', roundn(GanaG_Anu_0(1),-2));
    set(handles.CFcGana_feb, 'String', roundn(GanaG_Anu_0(2),-2));
    set(handles.CFcGana_mar, 'String', roundn(GanaG_Anu_0(3),-2));
    set(handles.CFcGana_abr, 'String', roundn(GanaG_Anu_0(4),-2));
    set(handles.CFcGana_may, 'String', roundn(GanaG_Anu_0(5),-2));
    set(handles.CFcGana_jun, 'String', roundn(GanaG_Anu_0(6),-2));
    set(handles.CFcGana_jul, 'String', roundn(GanaG_Anu_0(7),-2));
    set(handles.CFcGana_ago, 'String', roundn(GanaG_Anu_0(8),-2));
    set(handles.CFcGana_sep, 'String', roundn(GanaG_Anu_0(9),-2));
    set(handles.CFcGana_oct, 'String', roundn(GanaG_Anu_0(10),-2));
    set(handles.CFcGana_nov, 'String', roundn(GanaG_Anu_0(11),-2));
    set(handles.CFcGana_dic, 'String', roundn(GanaG_Anu_0(12),-2));
        
    set(handles.CFcGana_media, 'String', roundn(mean(GanaG_Anu_0),-2));

%Porcentaje de ganancia
    set(handles.CPcGana_ene, 'String', roundn(PorGanaG_Anu_0(1),-2));
    set(handles.CPcGana_feb, 'String', roundn(PorGanaG_Anu_0(2),-2));
    set(handles.CPcGana_mar, 'String', roundn(PorGanaG_Anu_0(3),-2));
    set(handles.CPcGana_abr, 'String', roundn(PorGanaG_Anu_0(4),-2));
    set(handles.CPcGana_may, 'String', roundn(PorGanaG_Anu_0(5),-2));
    set(handles.CPcGana_jun, 'String', roundn(PorGanaG_Anu_0(6),-2));
    set(handles.CPcGana_jul, 'String', roundn(PorGanaG_Anu_0(7),-2));
    set(handles.CPcGana_ago, 'String', roundn(PorGanaG_Anu_0(8),-2));
    set(handles.CPcGana_sep, 'String', roundn(PorGanaG_Anu_0(9),-2));
    set(handles.CPcGana_oct, 'String', roundn(PorGanaG_Anu_0(10),-2));
    set(handles.CPcGana_nov, 'String', roundn(PorGanaG_Anu_0(11),-2));
    set(handles.CPcGana_dic, 'String', roundn(PorGanaG_Anu_0(12),-2));
        
    set(handles.CPcGana_media, 'String', roundn(mean(PorGanaG_Anu_0),-2));



% Choose default command line output for Tabla_OptAnual
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_OptAnual wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_OptAnual_OutputFcn(hObject, eventdata, handles) 
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


% --- Executes on button press in InclinaX.
function InclinaX_Callback(hObject, eventdata, handles)

Tabla_OptAnual_IncliX;
close ('OrientSol 3.0 - Inclinación óptima anual');
% hObject    handle to InclinaX (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global OPCION_COMP;

global DATOS GdBetaTotal Radiacion_optima suma_angulo_optimo;
global Val_Bdm0 BdBetaTotal Radiacion_Bd_Optima media_Bd_optimo;
global Val_Ddm0 DdBetaTotal Radiacion_Dd_Optima media_Dd_optimo;
global RdBetaTotal Radiacion_Rd_Optima media_Rd_optimo;
%Ganancias
global GanaG_Anu_0 PorGanaG_Anu_0;
global GanaB_Anu_0 PorGanaB_Anu_0;
global GanaD_Anu_0 PorGanaD_Anu_0;
global GanaR_Anu_0 PorGanaR_Anu_0;


Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
        
        OPCION_COMP=1;
        
        set(handles.titulo,'String','Radiación global media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Gdm (0 º)');
        set(handles.Componente_15,'String','Gdm (15 º)');
        set(handles.Componente_30,'String','Gdm (30 º)');
        set(handles.Componente_45,'String','Gdm (45 º)');
        set(handles.Componente_60,'String','Gdm (60 º)');
        set(handles.Componente_75,'String','Gdm (75 º)');
        set(handles.Componente_90,'String','Gdm (90 º)');
        set(handles.Componente_Opt,'String','Gdm óptimo');

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

        %Mostrar valores para inclinación de 15º
            set(handles.C15_ene,'String',roundn(GdBetaTotal(1,15),-2));
            set(handles.C15_feb,'String',roundn(GdBetaTotal(2,15),-2));
            set(handles.C15_mar,'String',roundn(GdBetaTotal(3,15),-2));
            set(handles.C15_abr,'String',roundn(GdBetaTotal(4,15),-2));
            set(handles.C15_may,'String',roundn(GdBetaTotal(5,15),-2));
            set(handles.C15_jun,'String',roundn(GdBetaTotal(6,15),-2));
            set(handles.C15_jul,'String',roundn(GdBetaTotal(7,15),-2));
            set(handles.C15_ago,'String',roundn(GdBetaTotal(8,15),-2));
            set(handles.C15_sep,'String',roundn(GdBetaTotal(9,15),-2));
            set(handles.C15_oct,'String',roundn(GdBetaTotal(10,15),-2));
            set(handles.C15_nov,'String',roundn(GdBetaTotal(11,15),-2));
            set(handles.C15_dic,'String',roundn(GdBetaTotal(12,15),-2));

            set(handles.C15_media,'String',roundn(mean(GdBetaTotal(:,15)),-2));


        %Mostrar valores para inclinación de 30º
            set(handles.C30_ene,'String',roundn(GdBetaTotal(1,30),-2));
            set(handles.C30_feb,'String',roundn(GdBetaTotal(2,30),-2));
            set(handles.C30_mar,'String',roundn(GdBetaTotal(3,30),-2));
            set(handles.C30_abr,'String',roundn(GdBetaTotal(4,30),-2));
            set(handles.C30_may,'String',roundn(GdBetaTotal(5,30),-2));
            set(handles.C30_jun,'String',roundn(GdBetaTotal(6,30),-2));
            set(handles.C30_jul,'String',roundn(GdBetaTotal(7,30),-2));
            set(handles.C30_ago,'String',roundn(GdBetaTotal(8,30),-2));
            set(handles.C30_sep,'String',roundn(GdBetaTotal(9,30),-2));
            set(handles.C30_oct,'String',roundn(GdBetaTotal(10,30),-2));
            set(handles.C30_nov,'String',roundn(GdBetaTotal(11,30),-2));
            set(handles.C30_dic,'String',roundn(GdBetaTotal(12,30),-2));

            set(handles.C30_media,'String',roundn(mean(GdBetaTotal(:,30)),-2));

        %Mostrar valores para inclinación de 45º
            set(handles.C45_ene,'String',roundn(GdBetaTotal(1,45),-2));
            set(handles.C45_feb,'String',roundn(GdBetaTotal(2,45),-2));
            set(handles.C45_mar,'String',roundn(GdBetaTotal(3,45),-2));
            set(handles.C45_abr,'String',roundn(GdBetaTotal(4,45),-2));
            set(handles.C45_may,'String',roundn(GdBetaTotal(5,45),-2));
            set(handles.C45_jun,'String',roundn(GdBetaTotal(6,45),-2));
            set(handles.C45_jul,'String',roundn(GdBetaTotal(7,45),-2));
            set(handles.C45_ago,'String',roundn(GdBetaTotal(8,45),-2));
            set(handles.C45_sep,'String',roundn(GdBetaTotal(9,45),-2));
            set(handles.C45_oct,'String',roundn(GdBetaTotal(10,45),-2));
            set(handles.C45_nov,'String',roundn(GdBetaTotal(11,45),-2));
            set(handles.C45_dic,'String',roundn(GdBetaTotal(12,45),-2));

            set(handles.C45_media,'String',roundn(mean(GdBetaTotal(:,45)),-2));


        %Mostrar valores para inclinación de 60º
            set(handles.C60_ene,'String',roundn(GdBetaTotal(1,60),-2));
            set(handles.C60_feb,'String',roundn(GdBetaTotal(2,60),-2));
            set(handles.C60_mar,'String',roundn(GdBetaTotal(3,60),-2));
            set(handles.C60_abr,'String',roundn(GdBetaTotal(4,60),-2));
            set(handles.C60_may,'String',roundn(GdBetaTotal(5,60),-2));
            set(handles.C60_jun,'String',roundn(GdBetaTotal(6,60),-2));
            set(handles.C60_jul,'String',roundn(GdBetaTotal(7,60),-2));
            set(handles.C60_ago,'String',roundn(GdBetaTotal(8,60),-2));
            set(handles.C60_sep,'String',roundn(GdBetaTotal(9,60),-2));
            set(handles.C60_oct,'String',roundn(GdBetaTotal(10,60),-2));
            set(handles.C60_nov,'String',roundn(GdBetaTotal(11,60),-2));
            set(handles.C60_dic,'String',roundn(GdBetaTotal(12,60),-2));

            set(handles.C60_media,'String',roundn(mean(GdBetaTotal(:,60)),-2));


        %Mostrar valores para inclinación de 75º
            set(handles.C75_ene,'String',roundn(GdBetaTotal(1,75),-2));
            set(handles.C75_feb,'String',roundn(GdBetaTotal(2,75),-2));
            set(handles.C75_mar,'String',roundn(GdBetaTotal(3,75),-2));
            set(handles.C75_abr,'String',roundn(GdBetaTotal(4,75),-2));
            set(handles.C75_may,'String',roundn(GdBetaTotal(5,75),-2));
            set(handles.C75_jun,'String',roundn(GdBetaTotal(6,75),-2));
            set(handles.C75_jul,'String',roundn(GdBetaTotal(7,75),-2));
            set(handles.C75_ago,'String',roundn(GdBetaTotal(8,75),-2));
            set(handles.C75_sep,'String',roundn(GdBetaTotal(9,75),-2));
            set(handles.C75_oct,'String',roundn(GdBetaTotal(10,75),-2));
            set(handles.C75_nov,'String',roundn(GdBetaTotal(11,75),-2));
            set(handles.C75_dic,'String',roundn(GdBetaTotal(12,75),-2));

            set(handles.C75_media,'String',roundn(mean(GdBetaTotal(:,75)),-2));

        %Mostrar valores para inclinación de 90º
            set(handles.C90_ene,'String',roundn(GdBetaTotal(1,90),-2));
            set(handles.C90_feb,'String',roundn(GdBetaTotal(2,90),-2));
            set(handles.C90_mar,'String',roundn(GdBetaTotal(3,90),-2));
            set(handles.C90_abr,'String',roundn(GdBetaTotal(4,90),-2));
            set(handles.C90_may,'String',roundn(GdBetaTotal(5,90),-2));
            set(handles.C90_jun,'String',roundn(GdBetaTotal(6,90),-2));
            set(handles.C90_jul,'String',roundn(GdBetaTotal(7,90),-2));
            set(handles.C90_ago,'String',roundn(GdBetaTotal(8,90),-2));
            set(handles.C90_sep,'String',roundn(GdBetaTotal(9,90),-2));
            set(handles.C90_oct,'String',roundn(GdBetaTotal(10,90),-2));
            set(handles.C90_nov,'String',roundn(GdBetaTotal(11,90),-2));
            set(handles.C90_dic,'String',roundn(GdBetaTotal(12,90),-2));

            set(handles.C90_media,'String',roundn(mean(GdBetaTotal(:,90)),-2));


        %Inclinación óptima

            set(handles.COpt_ene,'String',roundn(Radiacion_optima(1),-2));
            set(handles.COpt_feb,'String',roundn(Radiacion_optima(2),-2));
            set(handles.COpt_mar,'String',roundn(Radiacion_optima(3),-2));
            set(handles.COpt_abr,'String',roundn(Radiacion_optima(4),-2));
            set(handles.COpt_may,'String',roundn(Radiacion_optima(5),-2));
            set(handles.COpt_jun,'String',roundn(Radiacion_optima(6),-2));
            set(handles.COpt_jul,'String',roundn(Radiacion_optima(7),-2));
            set(handles.COpt_ago,'String',roundn(Radiacion_optima(8),-2));
            set(handles.COpt_sep,'String',roundn(Radiacion_optima(9),-2));
            set(handles.COpt_oct,'String',roundn(Radiacion_optima(10),-2));
            set(handles.COpt_nov,'String',roundn(Radiacion_optima(11),-2));
            set(handles.COpt_dic,'String',roundn(Radiacion_optima(12),-2));

            set(handles.COpt_media,'String',roundn(suma_angulo_optimo,-2));
            
        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Factor de ganancia
            set(handles.CFcGana_ene, 'String', roundn(GanaG_Anu_0(1),-2));
            set(handles.CFcGana_feb, 'String', roundn(GanaG_Anu_0(2),-2));
            set(handles.CFcGana_mar, 'String', roundn(GanaG_Anu_0(3),-2));
            set(handles.CFcGana_abr, 'String', roundn(GanaG_Anu_0(4),-2));
            set(handles.CFcGana_may, 'String', roundn(GanaG_Anu_0(5),-2));
            set(handles.CFcGana_jun, 'String', roundn(GanaG_Anu_0(6),-2));
            set(handles.CFcGana_jul, 'String', roundn(GanaG_Anu_0(7),-2));
            set(handles.CFcGana_ago, 'String', roundn(GanaG_Anu_0(8),-2));
            set(handles.CFcGana_sep, 'String', roundn(GanaG_Anu_0(9),-2));
            set(handles.CFcGana_oct, 'String', roundn(GanaG_Anu_0(10),-2));
            set(handles.CFcGana_nov, 'String', roundn(GanaG_Anu_0(11),-2));
            set(handles.CFcGana_dic, 'String', roundn(GanaG_Anu_0(12),-2));

            set(handles.CFcGana_media, 'String', roundn(mean(GanaG_Anu_0),-2));

        %Porcentaje de ganancia
            set(handles.CPcGana_ene, 'String', roundn(PorGanaG_Anu_0(1),-2));
            set(handles.CPcGana_feb, 'String', roundn(PorGanaG_Anu_0(2),-2));
            set(handles.CPcGana_mar, 'String', roundn(PorGanaG_Anu_0(3),-2));
            set(handles.CPcGana_abr, 'String', roundn(PorGanaG_Anu_0(4),-2));
            set(handles.CPcGana_may, 'String', roundn(PorGanaG_Anu_0(5),-2));
            set(handles.CPcGana_jun, 'String', roundn(PorGanaG_Anu_0(6),-2));
            set(handles.CPcGana_jul, 'String', roundn(PorGanaG_Anu_0(7),-2));
            set(handles.CPcGana_ago, 'String', roundn(PorGanaG_Anu_0(8),-2));
            set(handles.CPcGana_sep, 'String', roundn(PorGanaG_Anu_0(9),-2));
            set(handles.CPcGana_oct, 'String', roundn(PorGanaG_Anu_0(10),-2));
            set(handles.CPcGana_nov, 'String', roundn(PorGanaG_Anu_0(11),-2));
            set(handles.CPcGana_dic, 'String', roundn(PorGanaG_Anu_0(12),-2));

            set(handles.CPcGana_media, 'String', roundn(mean(PorGanaG_Anu_0),-2));
        
    case 2 %Directa  
        
        OPCION_COMP=2;
        
        set(handles.titulo,'String','Radiación directa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Bdm (0 º)');
        set(handles.Componente_15,'String','Bdm (15 º)');
        set(handles.Componente_30,'String','Bdm (30 º)');
        set(handles.Componente_45,'String','Bdm (45 º)');
        set(handles.Componente_60,'String','Bdm (60 º)');
        set(handles.Componente_75,'String','Bdm (75 º)');
        set(handles.Componente_90,'String','Bdm (90 º)');
        set(handles.Componente_Opt,'String','Bdm óptimo');

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


        %Mostrar valores para inclinación de 15º
            set(handles.C15_ene,'String',roundn(BdBetaTotal(1,15),-2));
            set(handles.C15_feb,'String',roundn(BdBetaTotal(2,15),-2));
            set(handles.C15_mar,'String',roundn(BdBetaTotal(3,15),-2));
            set(handles.C15_abr,'String',roundn(BdBetaTotal(4,15),-2));
            set(handles.C15_may,'String',roundn(BdBetaTotal(5,15),-2));
            set(handles.C15_jun,'String',roundn(BdBetaTotal(6,15),-2));
            set(handles.C15_jul,'String',roundn(BdBetaTotal(7,15),-2));
            set(handles.C15_ago,'String',roundn(BdBetaTotal(8,15),-2));
            set(handles.C15_sep,'String',roundn(BdBetaTotal(9,15),-2));
            set(handles.C15_oct,'String',roundn(BdBetaTotal(10,15),-2));
            set(handles.C15_nov,'String',roundn(BdBetaTotal(11,15),-2));
            set(handles.C15_dic,'String',roundn(BdBetaTotal(12,15),-2));

            set(handles.C15_media,'String',roundn(mean(BdBetaTotal(:,15)),-2));


        %Mostrar valores para inclinación de 30º
            set(handles.C30_ene,'String',roundn(BdBetaTotal(1,30),-2));
            set(handles.C30_feb,'String',roundn(BdBetaTotal(2,30),-2));
            set(handles.C30_mar,'String',roundn(BdBetaTotal(3,30),-2));
            set(handles.C30_abr,'String',roundn(BdBetaTotal(4,30),-2));
            set(handles.C30_may,'String',roundn(BdBetaTotal(5,30),-2));
            set(handles.C30_jun,'String',roundn(BdBetaTotal(6,30),-2));
            set(handles.C30_jul,'String',roundn(BdBetaTotal(7,30),-2));
            set(handles.C30_ago,'String',roundn(BdBetaTotal(8,30),-2));
            set(handles.C30_sep,'String',roundn(BdBetaTotal(9,30),-2));
            set(handles.C30_oct,'String',roundn(BdBetaTotal(10,30),-2));
            set(handles.C30_nov,'String',roundn(BdBetaTotal(11,30),-2));
            set(handles.C30_dic,'String',roundn(BdBetaTotal(12,30),-2));

            set(handles.C30_media,'String',roundn(mean(BdBetaTotal(:,30)),-2));


        %Mostrar valores para inclinación de 45º
            set(handles.C45_ene,'String',roundn(BdBetaTotal(1,45),-2));
            set(handles.C45_feb,'String',roundn(BdBetaTotal(2,45),-2));
            set(handles.C45_mar,'String',roundn(BdBetaTotal(3,45),-2));
            set(handles.C45_abr,'String',roundn(BdBetaTotal(4,45),-2));
            set(handles.C45_may,'String',roundn(BdBetaTotal(5,45),-2));
            set(handles.C45_jun,'String',roundn(BdBetaTotal(6,45),-2));
            set(handles.C45_jul,'String',roundn(BdBetaTotal(7,45),-2));
            set(handles.C45_ago,'String',roundn(BdBetaTotal(8,45),-2));
            set(handles.C45_sep,'String',roundn(BdBetaTotal(9,45),-2));
            set(handles.C45_oct,'String',roundn(BdBetaTotal(10,45),-2));
            set(handles.C45_nov,'String',roundn(BdBetaTotal(11,45),-2));
            set(handles.C45_dic,'String',roundn(BdBetaTotal(12,45),-2));

            set(handles.C45_media,'String',roundn(mean(BdBetaTotal(:,45)),-2));


        %Mostrar valores para inclinación de 60º
            set(handles.C60_ene,'String',roundn(BdBetaTotal(1,60),-2));
            set(handles.C60_feb,'String',roundn(BdBetaTotal(2,60),-2));
            set(handles.C60_mar,'String',roundn(BdBetaTotal(3,60),-2));
            set(handles.C60_abr,'String',roundn(BdBetaTotal(4,60),-2));
            set(handles.C60_may,'String',roundn(BdBetaTotal(5,60),-2));
            set(handles.C60_jun,'String',roundn(BdBetaTotal(6,60),-2));
            set(handles.C60_jul,'String',roundn(BdBetaTotal(7,60),-2));
            set(handles.C60_ago,'String',roundn(BdBetaTotal(8,60),-2));
            set(handles.C60_sep,'String',roundn(BdBetaTotal(9,60),-2));
            set(handles.C60_oct,'String',roundn(BdBetaTotal(10,60),-2));
            set(handles.C60_nov,'String',roundn(BdBetaTotal(11,60),-2));
            set(handles.C60_dic,'String',roundn(BdBetaTotal(12,60),-2));

            set(handles.C60_media,'String',roundn(mean(BdBetaTotal(:,60)),-2));


        %Mostrar valores para inclinación de 75º
            set(handles.C75_ene,'String',roundn(BdBetaTotal(1,75),-2));
            set(handles.C75_feb,'String',roundn(BdBetaTotal(2,75),-2));
            set(handles.C75_mar,'String',roundn(BdBetaTotal(3,75),-2));
            set(handles.C75_abr,'String',roundn(BdBetaTotal(4,75),-2));
            set(handles.C75_may,'String',roundn(BdBetaTotal(5,75),-2));
            set(handles.C75_jun,'String',roundn(BdBetaTotal(6,75),-2));
            set(handles.C75_jul,'String',roundn(BdBetaTotal(7,75),-2));
            set(handles.C75_ago,'String',roundn(BdBetaTotal(8,75),-2));
            set(handles.C75_sep,'String',roundn(BdBetaTotal(9,75),-2));
            set(handles.C75_oct,'String',roundn(BdBetaTotal(10,75),-2));
            set(handles.C75_nov,'String',roundn(BdBetaTotal(11,75),-2));
            set(handles.C75_dic,'String',roundn(BdBetaTotal(12,75),-2));

            set(handles.C75_media,'String',roundn(mean(BdBetaTotal(:,75)),-2));

        %Mostrar valores para inclinación de 90º
            set(handles.C90_ene,'String',roundn(BdBetaTotal(1,90),-2));
            set(handles.C90_feb,'String',roundn(BdBetaTotal(2,90),-2));
            set(handles.C90_mar,'String',roundn(BdBetaTotal(3,90),-2));
            set(handles.C90_abr,'String',roundn(BdBetaTotal(4,90),-2));
            set(handles.C90_may,'String',roundn(BdBetaTotal(5,90),-2));
            set(handles.C90_jun,'String',roundn(BdBetaTotal(6,90),-2));
            set(handles.C90_jul,'String',roundn(BdBetaTotal(7,90),-2));
            set(handles.C90_ago,'String',roundn(BdBetaTotal(8,90),-2));
            set(handles.C90_sep,'String',roundn(BdBetaTotal(9,90),-2));
            set(handles.C90_oct,'String',roundn(BdBetaTotal(10,90),-2));
            set(handles.C90_nov,'String',roundn(BdBetaTotal(11,90),-2));
            set(handles.C90_dic,'String',roundn(BdBetaTotal(12,90),-2));

            set(handles.C90_media,'String',roundn(mean(BdBetaTotal(:,90)),-2));


        %Inclinación óptima
            set(handles.COpt_ene,'String',roundn(Radiacion_Bd_Optima(1),-2));
            set(handles.COpt_feb,'String',roundn(Radiacion_Bd_Optima(2),-2));
            set(handles.COpt_mar,'String',roundn(Radiacion_Bd_Optima(3),-2));
            set(handles.COpt_abr,'String',roundn(Radiacion_Bd_Optima(4),-2));
            set(handles.COpt_may,'String',roundn(Radiacion_Bd_Optima(5),-2));
            set(handles.COpt_jun,'String',roundn(Radiacion_Bd_Optima(6),-2));
            set(handles.COpt_jul,'String',roundn(Radiacion_Bd_Optima(7),-2));
            set(handles.COpt_ago,'String',roundn(Radiacion_Bd_Optima(8),-2));
            set(handles.COpt_sep,'String',roundn(Radiacion_Bd_Optima(9),-2));
            set(handles.COpt_oct,'String',roundn(Radiacion_Bd_Optima(10),-2));
            set(handles.COpt_nov,'String',roundn(Radiacion_Bd_Optima(11),-2));
            set(handles.COpt_dic,'String',roundn(Radiacion_Bd_Optima(12),-2));

            set(handles.COpt_media,'String',roundn(media_Bd_optimo,-2));
            
        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Factor de ganancia
            set(handles.CFcGana_ene, 'String', roundn(GanaB_Anu_0(1),-2));
            set(handles.CFcGana_feb, 'String', roundn(GanaB_Anu_0(2),-2));
            set(handles.CFcGana_mar, 'String', roundn(GanaB_Anu_0(3),-2));
            set(handles.CFcGana_abr, 'String', roundn(GanaB_Anu_0(4),-2));
            set(handles.CFcGana_may, 'String', roundn(GanaB_Anu_0(5),-2));
            set(handles.CFcGana_jun, 'String', roundn(GanaB_Anu_0(6),-2));
            set(handles.CFcGana_jul, 'String', roundn(GanaB_Anu_0(7),-2));
            set(handles.CFcGana_ago, 'String', roundn(GanaB_Anu_0(8),-2));
            set(handles.CFcGana_sep, 'String', roundn(GanaB_Anu_0(9),-2));
            set(handles.CFcGana_oct, 'String', roundn(GanaB_Anu_0(10),-2));
            set(handles.CFcGana_nov, 'String', roundn(GanaB_Anu_0(11),-2));
            set(handles.CFcGana_dic, 'String', roundn(GanaB_Anu_0(12),-2));

            set(handles.CFcGana_media, 'String', roundn(mean(GanaB_Anu_0),-2));

        %Porcentaje de ganancia
            set(handles.CPcGana_ene, 'String', roundn(PorGanaB_Anu_0(1),-2));
            set(handles.CPcGana_feb, 'String', roundn(PorGanaB_Anu_0(2),-2));
            set(handles.CPcGana_mar, 'String', roundn(PorGanaB_Anu_0(3),-2));
            set(handles.CPcGana_abr, 'String', roundn(PorGanaB_Anu_0(4),-2));
            set(handles.CPcGana_may, 'String', roundn(PorGanaB_Anu_0(5),-2));
            set(handles.CPcGana_jun, 'String', roundn(PorGanaB_Anu_0(6),-2));
            set(handles.CPcGana_jul, 'String', roundn(PorGanaB_Anu_0(7),-2));
            set(handles.CPcGana_ago, 'String', roundn(PorGanaB_Anu_0(8),-2));
            set(handles.CPcGana_sep, 'String', roundn(PorGanaB_Anu_0(9),-2));
            set(handles.CPcGana_oct, 'String', roundn(PorGanaB_Anu_0(10),-2));
            set(handles.CPcGana_nov, 'String', roundn(PorGanaB_Anu_0(11),-2));
            set(handles.CPcGana_dic, 'String', roundn(PorGanaB_Anu_0(12),-2));

            set(handles.CPcGana_media, 'String', roundn(mean(PorGanaB_Anu_0),-2));
        
    case 3 %Difusa
        
        OPCION_COMP=3;
        
        set(handles.titulo,'String','Radiación difusa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Ddm (0 º)');
        set(handles.Componente_15,'String','Ddm (15 º)');
        set(handles.Componente_30,'String','Ddm (30 º)');
        set(handles.Componente_45,'String','Ddm (45 º)');
        set(handles.Componente_60,'String','Ddm (60 º)');
        set(handles.Componente_75,'String','Ddm (75 º)');
        set(handles.Componente_90,'String','Ddm (90 º)');
        set(handles.Componente_Opt,'String','Ddm óptimo');

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

        %Mostrar valores para inclinación de 15º
            set(handles.C15_ene,'String',roundn(DdBetaTotal(1,15),-2));
            set(handles.C15_feb,'String',roundn(DdBetaTotal(2,15),-2));
            set(handles.C15_mar,'String',roundn(DdBetaTotal(3,15),-2));
            set(handles.C15_abr,'String',roundn(DdBetaTotal(4,15),-2));
            set(handles.C15_may,'String',roundn(DdBetaTotal(5,15),-2));
            set(handles.C15_jun,'String',roundn(DdBetaTotal(6,15),-2));
            set(handles.C15_jul,'String',roundn(DdBetaTotal(7,15),-2));
            set(handles.C15_ago,'String',roundn(DdBetaTotal(8,15),-2));
            set(handles.C15_sep,'String',roundn(DdBetaTotal(9,15),-2));
            set(handles.C15_oct,'String',roundn(DdBetaTotal(10,15),-2));
            set(handles.C15_nov,'String',roundn(DdBetaTotal(11,15),-2));
            set(handles.C15_dic,'String',roundn(DdBetaTotal(12,15),-2));

            set(handles.C15_media,'String',roundn(mean(DdBetaTotal(:,15)),-2));


        %Mostrar valores para inclinación de 30º
            set(handles.C30_ene,'String',roundn(DdBetaTotal(1,30),-2));
            set(handles.C30_feb,'String',roundn(DdBetaTotal(2,30),-2));
            set(handles.C30_mar,'String',roundn(DdBetaTotal(3,30),-2));
            set(handles.C30_abr,'String',roundn(DdBetaTotal(4,30),-2));
            set(handles.C30_may,'String',roundn(DdBetaTotal(5,30),-2));
            set(handles.C30_jun,'String',roundn(DdBetaTotal(6,30),-2));
            set(handles.C30_jul,'String',roundn(DdBetaTotal(7,30),-2));
            set(handles.C30_ago,'String',roundn(DdBetaTotal(8,30),-2));
            set(handles.C30_sep,'String',roundn(DdBetaTotal(9,30),-2));
            set(handles.C30_oct,'String',roundn(DdBetaTotal(10,30),-2));
            set(handles.C30_nov,'String',roundn(DdBetaTotal(11,30),-2));
            set(handles.C30_dic,'String',roundn(DdBetaTotal(12,30),-2));

            set(handles.C30_media,'String',roundn(mean(DdBetaTotal(:,30)),-2));


        %Mostrar valores para inclinación de 45º
            set(handles.C45_ene,'String',roundn(DdBetaTotal(1,45),-2));
            set(handles.C45_feb,'String',roundn(DdBetaTotal(2,45),-2));
            set(handles.C45_mar,'String',roundn(DdBetaTotal(3,45),-2));
            set(handles.C45_abr,'String',roundn(DdBetaTotal(4,45),-2));
            set(handles.C45_may,'String',roundn(DdBetaTotal(5,45),-2));
            set(handles.C45_jun,'String',roundn(DdBetaTotal(6,45),-2));
            set(handles.C45_jul,'String',roundn(DdBetaTotal(7,45),-2));
            set(handles.C45_ago,'String',roundn(DdBetaTotal(8,45),-2));
            set(handles.C45_sep,'String',roundn(DdBetaTotal(9,45),-2));
            set(handles.C45_oct,'String',roundn(DdBetaTotal(10,45),-2));
            set(handles.C45_nov,'String',roundn(DdBetaTotal(11,45),-2));
            set(handles.C45_dic,'String',roundn(DdBetaTotal(12,45),-2));

            set(handles.C45_media,'String',roundn(mean(DdBetaTotal(:,45)),-2));


        %Mostrar valores para inclinación de 60º
            set(handles.C60_ene,'String',roundn(DdBetaTotal(1,60),-2));
            set(handles.C60_feb,'String',roundn(DdBetaTotal(2,60),-2));
            set(handles.C60_mar,'String',roundn(DdBetaTotal(3,60),-2));
            set(handles.C60_abr,'String',roundn(DdBetaTotal(4,60),-2));
            set(handles.C60_may,'String',roundn(DdBetaTotal(5,60),-2));
            set(handles.C60_jun,'String',roundn(DdBetaTotal(6,60),-2));
            set(handles.C60_jul,'String',roundn(DdBetaTotal(7,60),-2));
            set(handles.C60_ago,'String',roundn(DdBetaTotal(8,60),-2));
            set(handles.C60_sep,'String',roundn(DdBetaTotal(9,60),-2));
            set(handles.C60_oct,'String',roundn(DdBetaTotal(10,60),-2));
            set(handles.C60_nov,'String',roundn(DdBetaTotal(11,60),-2));
            set(handles.C60_dic,'String',roundn(DdBetaTotal(12,60),-2));

            set(handles.C60_media,'String',roundn(mean(DdBetaTotal(:,60)),-2));


        %Mostrar valores para inclinación de 75º
            set(handles.C75_ene,'String',roundn(DdBetaTotal(1,75),-2));
            set(handles.C75_feb,'String',roundn(DdBetaTotal(2,75),-2));
            set(handles.C75_mar,'String',roundn(DdBetaTotal(3,75),-2));
            set(handles.C75_abr,'String',roundn(DdBetaTotal(4,75),-2));
            set(handles.C75_may,'String',roundn(DdBetaTotal(5,75),-2));
            set(handles.C75_jun,'String',roundn(DdBetaTotal(6,75),-2));
            set(handles.C75_jul,'String',roundn(DdBetaTotal(7,75),-2));
            set(handles.C75_ago,'String',roundn(DdBetaTotal(8,75),-2));
            set(handles.C75_sep,'String',roundn(DdBetaTotal(9,75),-2));
            set(handles.C75_oct,'String',roundn(DdBetaTotal(10,75),-2));
            set(handles.C75_nov,'String',roundn(DdBetaTotal(11,75),-2));
            set(handles.C75_dic,'String',roundn(DdBetaTotal(12,75),-2));

            set(handles.C75_media,'String',roundn(mean(DdBetaTotal(:,75)),-2));

        %Mostrar valores para inclinación de 90º
            set(handles.C90_ene,'String',roundn(DdBetaTotal(1,90),-2));
            set(handles.C90_feb,'String',roundn(DdBetaTotal(2,90),-2));
            set(handles.C90_mar,'String',roundn(DdBetaTotal(3,90),-2));
            set(handles.C90_abr,'String',roundn(DdBetaTotal(4,90),-2));
            set(handles.C90_may,'String',roundn(DdBetaTotal(5,90),-2));
            set(handles.C90_jun,'String',roundn(DdBetaTotal(6,90),-2));
            set(handles.C90_jul,'String',roundn(DdBetaTotal(7,90),-2));
            set(handles.C90_ago,'String',roundn(DdBetaTotal(8,90),-2));
            set(handles.C90_sep,'String',roundn(DdBetaTotal(9,90),-2));
            set(handles.C90_oct,'String',roundn(DdBetaTotal(10,90),-2));
            set(handles.C90_nov,'String',roundn(DdBetaTotal(11,90),-2));
            set(handles.C90_dic,'String',roundn(DdBetaTotal(12,90),-2));

            set(handles.C90_media,'String',roundn(mean(DdBetaTotal(:,90)),-2));

        %Inclinación óptima   
            set(handles.COpt_ene,'String',roundn(Radiacion_Dd_Optima(1),-2));
            set(handles.COpt_feb,'String',roundn(Radiacion_Dd_Optima(2),-2));
            set(handles.COpt_mar,'String',roundn(Radiacion_Dd_Optima(3),-2));
            set(handles.COpt_abr,'String',roundn(Radiacion_Dd_Optima(4),-2));
            set(handles.COpt_may,'String',roundn(Radiacion_Dd_Optima(5),-2));
            set(handles.COpt_jun,'String',roundn(Radiacion_Dd_Optima(6),-2));
            set(handles.COpt_jul,'String',roundn(Radiacion_Dd_Optima(7),-2));
            set(handles.COpt_ago,'String',roundn(Radiacion_Dd_Optima(8),-2));
            set(handles.COpt_sep,'String',roundn(Radiacion_Dd_Optima(9),-2));
            set(handles.COpt_oct,'String',roundn(Radiacion_Dd_Optima(10),-2));
            set(handles.COpt_nov,'String',roundn(Radiacion_Dd_Optima(11),-2));
            set(handles.COpt_dic,'String',roundn(Radiacion_Dd_Optima(12),-2));

            set(handles.COpt_media,'String',roundn(media_Dd_optimo,-2));
            
        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Factor de ganancia
            set(handles.CFcGana_ene, 'String', roundn(GanaD_Anu_0(1),-2));
            set(handles.CFcGana_feb, 'String', roundn(GanaD_Anu_0(2),-2));
            set(handles.CFcGana_mar, 'String', roundn(GanaD_Anu_0(3),-2));
            set(handles.CFcGana_abr, 'String', roundn(GanaD_Anu_0(4),-2));
            set(handles.CFcGana_may, 'String', roundn(GanaD_Anu_0(5),-2));
            set(handles.CFcGana_jun, 'String', roundn(GanaD_Anu_0(6),-2));
            set(handles.CFcGana_jul, 'String', roundn(GanaD_Anu_0(7),-2));
            set(handles.CFcGana_ago, 'String', roundn(GanaD_Anu_0(8),-2));
            set(handles.CFcGana_sep, 'String', roundn(GanaD_Anu_0(9),-2));
            set(handles.CFcGana_oct, 'String', roundn(GanaD_Anu_0(10),-2));
            set(handles.CFcGana_nov, 'String', roundn(GanaD_Anu_0(11),-2));
            set(handles.CFcGana_dic, 'String', roundn(GanaD_Anu_0(12),-2));

            set(handles.CFcGana_media, 'String', roundn(mean(GanaD_Anu_0),-2));

        %Porcentaje de ganancia
            set(handles.CPcGana_ene, 'String', roundn(PorGanaD_Anu_0(1),-2));
            set(handles.CPcGana_feb, 'String', roundn(PorGanaD_Anu_0(2),-2));
            set(handles.CPcGana_mar, 'String', roundn(PorGanaD_Anu_0(3),-2));
            set(handles.CPcGana_abr, 'String', roundn(PorGanaD_Anu_0(4),-2));
            set(handles.CPcGana_may, 'String', roundn(PorGanaD_Anu_0(5),-2));
            set(handles.CPcGana_jun, 'String', roundn(PorGanaD_Anu_0(6),-2));
            set(handles.CPcGana_jul, 'String', roundn(PorGanaD_Anu_0(7),-2));
            set(handles.CPcGana_ago, 'String', roundn(PorGanaD_Anu_0(8),-2));
            set(handles.CPcGana_sep, 'String', roundn(PorGanaD_Anu_0(9),-2));
            set(handles.CPcGana_oct, 'String', roundn(PorGanaD_Anu_0(10),-2));
            set(handles.CPcGana_nov, 'String', roundn(PorGanaD_Anu_0(11),-2));
            set(handles.CPcGana_dic, 'String', roundn(PorGanaD_Anu_0(12),-2));

            set(handles.CPcGana_media, 'String', roundn(mean(PorGanaD_Anu_0),-2));

    case 4 %Albedo  
        
        OPCION_COMP = 4;
        
        warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_15,'String','Rdm (15 º)');
        set(handles.Componente_30,'String','Rdm (30 º)');
        set(handles.Componente_45,'String','Rdm (45 º)');
        set(handles.Componente_60,'String','Rdm (60 º)');
        set(handles.Componente_75,'String','Rdm (75 º)');
        set(handles.Componente_90,'String','Rdm (90 º)');
        set(handles.Componente_Opt,'String','Rdm óptimo');


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

        %Mostrar valores para inclinación de 15º
            set(handles.C15_ene,'String',roundn(RdBetaTotal(1,15),-2));
            set(handles.C15_feb,'String',roundn(RdBetaTotal(2,15),-2));
            set(handles.C15_mar,'String',roundn(RdBetaTotal(3,15),-2));
            set(handles.C15_abr,'String',roundn(RdBetaTotal(4,15),-2));
            set(handles.C15_may,'String',roundn(RdBetaTotal(5,15),-2));
            set(handles.C15_jun,'String',roundn(RdBetaTotal(6,15),-2));
            set(handles.C15_jul,'String',roundn(RdBetaTotal(7,15),-2));
            set(handles.C15_ago,'String',roundn(RdBetaTotal(8,15),-2));
            set(handles.C15_sep,'String',roundn(RdBetaTotal(9,15),-2));
            set(handles.C15_oct,'String',roundn(RdBetaTotal(10,15),-2));
            set(handles.C15_nov,'String',roundn(RdBetaTotal(11,15),-2));
            set(handles.C15_dic,'String',roundn(RdBetaTotal(12,15),-2));

            set(handles.C15_media,'String',roundn(mean(RdBetaTotal(:,15)),-2));    

        %Mostrar valores para inclinación de 30º
            set(handles.C30_ene,'String',roundn(RdBetaTotal(1,30),-2));
            set(handles.C30_feb,'String',roundn(RdBetaTotal(2,30),-2));
            set(handles.C30_mar,'String',roundn(RdBetaTotal(3,30),-2));
            set(handles.C30_abr,'String',roundn(RdBetaTotal(4,30),-2));
            set(handles.C30_may,'String',roundn(RdBetaTotal(5,30),-2));
            set(handles.C30_jun,'String',roundn(RdBetaTotal(6,30),-2));
            set(handles.C30_jul,'String',roundn(RdBetaTotal(7,30),-2));
            set(handles.C30_ago,'String',roundn(RdBetaTotal(8,30),-2));
            set(handles.C30_sep,'String',roundn(RdBetaTotal(9,30),-2));
            set(handles.C30_oct,'String',roundn(RdBetaTotal(10,30),-2));
            set(handles.C30_nov,'String',roundn(RdBetaTotal(11,30),-2));
            set(handles.C30_dic,'String',roundn(RdBetaTotal(12,30),-2));

            set(handles.C30_media,'String',roundn(mean(RdBetaTotal(:,30)),-2));


        %Mostrar valores para inclinación de 45º
            set(handles.C45_ene,'String',roundn(RdBetaTotal(1,45),-2));
            set(handles.C45_feb,'String',roundn(RdBetaTotal(2,45),-2));
            set(handles.C45_mar,'String',roundn(RdBetaTotal(3,45),-2));
            set(handles.C45_abr,'String',roundn(RdBetaTotal(4,45),-2));
            set(handles.C45_may,'String',roundn(RdBetaTotal(5,45),-2));
            set(handles.C45_jun,'String',roundn(RdBetaTotal(6,45),-2));
            set(handles.C45_jul,'String',roundn(RdBetaTotal(7,45),-2));
            set(handles.C45_ago,'String',roundn(RdBetaTotal(8,45),-2));
            set(handles.C45_sep,'String',roundn(RdBetaTotal(9,45),-2));
            set(handles.C45_oct,'String',roundn(RdBetaTotal(10,45),-2));
            set(handles.C45_nov,'String',roundn(RdBetaTotal(11,45),-2));
            set(handles.C45_dic,'String',roundn(RdBetaTotal(12,45),-2));

            set(handles.C45_media,'String',roundn(mean(RdBetaTotal(:,45)),-2));


        %Mostrar valores para inclinación de 60º
            set(handles.C60_ene,'String',roundn(RdBetaTotal(1,60),-2));
            set(handles.C60_feb,'String',roundn(RdBetaTotal(2,60),-2));
            set(handles.C60_mar,'String',roundn(RdBetaTotal(3,60),-2));
            set(handles.C60_abr,'String',roundn(RdBetaTotal(4,60),-2));
            set(handles.C60_may,'String',roundn(RdBetaTotal(5,60),-2));
            set(handles.C60_jun,'String',roundn(RdBetaTotal(6,60),-2));
            set(handles.C60_jul,'String',roundn(RdBetaTotal(7,60),-2));
            set(handles.C60_ago,'String',roundn(RdBetaTotal(8,60),-2));
            set(handles.C60_sep,'String',roundn(RdBetaTotal(9,60),-2));
            set(handles.C60_oct,'String',roundn(RdBetaTotal(10,60),-2));
            set(handles.C60_nov,'String',roundn(RdBetaTotal(11,60),-2));
            set(handles.C60_dic,'String',roundn(RdBetaTotal(12,60),-2));

            set(handles.C60_media,'String',roundn(mean(RdBetaTotal(:,60)),-2));


        %Mostrar valores para inclinación de 75º
            set(handles.C75_ene,'String',roundn(RdBetaTotal(1,75),-2));
            set(handles.C75_feb,'String',roundn(RdBetaTotal(2,75),-2));
            set(handles.C75_mar,'String',roundn(RdBetaTotal(3,75),-2));
            set(handles.C75_abr,'String',roundn(RdBetaTotal(4,75),-2));
            set(handles.C75_may,'String',roundn(RdBetaTotal(5,75),-2));
            set(handles.C75_jun,'String',roundn(RdBetaTotal(6,75),-2));
            set(handles.C75_jul,'String',roundn(RdBetaTotal(7,75),-2));
            set(handles.C75_ago,'String',roundn(RdBetaTotal(8,75),-2));
            set(handles.C75_sep,'String',roundn(RdBetaTotal(9,75),-2));
            set(handles.C75_oct,'String',roundn(RdBetaTotal(10,75),-2));
            set(handles.C75_nov,'String',roundn(RdBetaTotal(11,75),-2));
            set(handles.C75_dic,'String',roundn(RdBetaTotal(12,75),-2));

            set(handles.C75_media,'String',roundn(mean(RdBetaTotal(:,75)),-2));

        %Mostrar valores para inclinación de 90º
            set(handles.C90_ene,'String',roundn(RdBetaTotal(1,90),-2));
            set(handles.C90_feb,'String',roundn(RdBetaTotal(2,90),-2));
            set(handles.C90_mar,'String',roundn(RdBetaTotal(3,90),-2));
            set(handles.C90_abr,'String',roundn(RdBetaTotal(4,90),-2));
            set(handles.C90_may,'String',roundn(RdBetaTotal(5,90),-2));
            set(handles.C90_jun,'String',roundn(RdBetaTotal(6,90),-2));
            set(handles.C90_jul,'String',roundn(RdBetaTotal(7,90),-2));
            set(handles.C90_ago,'String',roundn(RdBetaTotal(8,90),-2));
            set(handles.C90_sep,'String',roundn(RdBetaTotal(9,90),-2));
            set(handles.C90_oct,'String',roundn(RdBetaTotal(10,90),-2));
            set(handles.C90_nov,'String',roundn(RdBetaTotal(11,90),-2));
            set(handles.C90_dic,'String',roundn(RdBetaTotal(12,90),-2));

            set(handles.C90_media,'String',roundn(mean(RdBetaTotal(:,90)),-2));    

        %Inclinación óptima    
            set(handles.COpt_ene,'String',roundn(Radiacion_Rd_Optima(1),-2));
            set(handles.COpt_feb,'String',roundn(Radiacion_Rd_Optima(2),-2));
            set(handles.COpt_mar,'String',roundn(Radiacion_Rd_Optima(3),-2));
            set(handles.COpt_abr,'String',roundn(Radiacion_Rd_Optima(4),-2));
            set(handles.COpt_may,'String',roundn(Radiacion_Rd_Optima(5),-2));
            set(handles.COpt_jun,'String',roundn(Radiacion_Rd_Optima(6),-2));
            set(handles.COpt_jul,'String',roundn(Radiacion_Rd_Optima(7),-2));
            set(handles.COpt_ago,'String',roundn(Radiacion_Rd_Optima(8),-2));
            set(handles.COpt_sep,'String',roundn(Radiacion_Rd_Optima(9),-2));
            set(handles.COpt_oct,'String',roundn(Radiacion_Rd_Optima(10),-2));
            set(handles.COpt_nov,'String',roundn(Radiacion_Rd_Optima(11),-2));
            set(handles.COpt_dic,'String',roundn(Radiacion_Rd_Optima(12),-2));

            set(handles.COpt_media,'String',roundn(media_Rd_optimo,-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Factor de ganancia
            set(handles.CFcGana_ene, 'String', '-');
            set(handles.CFcGana_feb, 'String', '-');
            set(handles.CFcGana_mar, 'String', '-');
            set(handles.CFcGana_abr, 'String', '-');
            set(handles.CFcGana_may, 'String', '-');
            set(handles.CFcGana_jun, 'String', '-');
            set(handles.CFcGana_jul, 'String', '-');
            set(handles.CFcGana_ago, 'String', '-');
            set(handles.CFcGana_sep, 'String', '-');
            set(handles.CFcGana_oct, 'String', '-');
            set(handles.CFcGana_nov, 'String', '-');
            set(handles.CFcGana_dic, 'String', '-');

            set(handles.CFcGana_media, 'String', '-');

        %Porcentaje de ganancia
            set(handles.CPcGana_ene, 'String', '-');
            set(handles.CPcGana_feb, 'String', '-');
            set(handles.CPcGana_mar, 'String', '-');
            set(handles.CPcGana_abr, 'String', '-');
            set(handles.CPcGana_may, 'String', '-');
            set(handles.CPcGana_jun, 'String', '-');
            set(handles.CPcGana_jul, 'String', '-');
            set(handles.CPcGana_ago, 'String', '-');
            set(handles.CPcGana_sep, 'String', '-');
            set(handles.CPcGana_oct, 'String', '-');
            set(handles.CPcGana_nov, 'String', '-');
            set(handles.CPcGana_dic, 'String', '-');

            set(handles.CPcGana_media, 'String', '-');      
        
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

global NOMBRE_CIUDAD 
%Global
global DATOS GdBetaTotal 
global Radiacion_optima angulo_optimo;
global GanaG_Anu_0 PorGanaG_Anu_0
%Directa
global Val_Bdm0 BdBetaTotal;
global Radiacion_Bd_Optima media_Bd_optimo
global GanaB_Anu_0 PorGanaB_Anu_0
%Difusa
global Val_Ddm0 DdBetaTotal;
global Radiacion_Dd_Optima media_Dd_optimo
global GanaD_Anu_0 PorGanaD_Anu_0
%Albedo
global RdBetaTotal;
global Radiacion_Rd_Optima media_Rd_optimo
%ERROR global GanaR_Anu_0 PorGanaR_Anu_0

%Calcular las medias de radiación para todos los ángulos de 1 a 90º 
%GLOBAL
    Media_GdBeta=zeros(1,91);
    %Media de las radiaciones para 0º
                    sum = 0;
                    for i=3:14
                        sum = sum + DATOS(i);
                    end

                    media0= sum/12;

    Media_GdBeta(1)= media0;

    for i=1:90
    Media_GdBeta(i+1)= mean(GdBetaTotal(:,i));
    end

%DIRECTA
    Media_BdBeta=zeros(1,91);
    %Media de las radiaciones para 0º              
    Media_BdBeta(1)= mean(Val_Bdm0);

    for i=1:90
    Media_BdBeta(i+1)= mean(BdBetaTotal(:,i));
    end

%DIFUSA
    Media_DdBeta=zeros(1,91);
    %Media de las radiaciones para 0º              
    Media_DdBeta(1)= mean(Val_Ddm0);

    for i=1:90
    Media_DdBeta(i+1)= mean(DdBetaTotal(:,i));
    end    
    
%ALBEDO
    Media_RdBeta=zeros(1,91);
    %Media de las radiaciones para 0º              
    Media_RdBeta(1)= 0;

    for i=1:90
    Media_RdBeta(i+1)= mean(RdBetaTotal(:,i));
    end  


GradosG = {'Gdm(0º)','Gdm(1º)','Gdm(2º)','Gdm(3º)','Gdm(4º)','Gdm(5º)','Gdm(6º)','Gdm(7º)','Gdm(8º)','Gdm(9º)','Gdm(10º)',...
        'Gdm(11º)','Gdm(12º)','Gdm(13º)','Gdm(14º)','Gdm(15º)','Gdm(16º)','Gdm(17º)','Gdm(18º)','Gdm(19º)','Gdm(20º)',...
        'Gdm(21º)','Gdm(22º)','Gdm(23º)','Gdm(24º)','Gdm(25º)','Gdm(26º)','Gdm(27º)','Gdm(28º)','Gdm(29º)','Gdm(30º)',...
        'Gdm(31º)','Gdm(32º)','Gdm(33º)','Gdm(34º)','Gdm(35º)','Gdm(36º)','Gdm(37º)','Gdm(38º)','Gdm(39º)','Gdm(40º)',...
        'Gdm(41º)','Gdm(42º)','Gdm(43º)','Gdm(44º)','Gdm(45º)','Gdm(46º)','Gdm(47º)','Gdm(48º)','Gdm(49º)','Gdm(50º)',...
        'Gdm(51º)','Gdm(52º)','Gdm(53º)','Gdm(54º)','Gdm(55º)','Gdm(56º)','Gdm(57º)','Gdm(58º)','Gdm(59º)','Gdm(60º)',...
        'Gdm(61º)','Gdm(62º)','Gdm(63º)','Gdm(64º)','Gdm(65º)','Gdm(66º)','Gdm(67º)','Gdm(68º)','Gdm(69º)','Gdm(70º)',...
        'Gdm(71º)','Gdm(72º)','Gdm(73º)','Gdm(74º)','Gdm(75º)','Gdm(76º)','Gdm(77º)','Gdm(78º)','Gdm(79º)','Gdm(80º)',...
        'Gdm(81º)','Gdm(82º)','Gdm(83º)','Gdm(84º)','Gdm(85º)','Gdm(86º)','Gdm(87º)','Gdm(88º)','Gdm(89º)','Gdm(90º)'};
    
GradosB = {'Bdm(0º)','Bdm(1º)','Bdm(2º)','Bdm(3º)','Bdm(4º)','Bdm(5º)','Bdm(6º)','Bdm(7º)','Bdm(8º)','Bdm(9º)','Bdm(10º)',...
        'Bdm(11º)','Bdm(12º)','Bdm(13º)','Bdm(14º)','Bdm(15º)','Bdm(16º)','Bdm(17º)','Bdm(18º)','Gdm(19º)','Bdm(20º)',...
        'Bdm(21º)','Bdm(22º)','Bdm(23º)','Bdm(24º)','Bdm(25º)','Bdm(26º)','Bdm(27º)','Bdm(28º)','Bdm(29º)','Bdm(30º)',...
        'Bdm(31º)','Bdm(32º)','Bdm(33º)','Bdm(34º)','Bdm(35º)','Bdm(36º)','Bdm(37º)','Bdm(38º)','Bdm(39º)','Bdm(40º)',...
        'Bdm(41º)','Bdm(42º)','Bdm(43º)','Bdm(44º)','Bdm(45º)','Bdm(46º)','Bdm(47º)','Bdm(48º)','Bdm(49º)','Bdm(50º)',...
        'Bdm(51º)','Bdm(52º)','Bdm(53º)','Bdm(54º)','Bdm(55º)','Bdm(56º)','Bdm(57º)','Bdm(58º)','Bdm(59º)','Bdm(60º)',...
        'Bdm(61º)','Bdm(62º)','Bdm(63º)','Bdm(64º)','Bdm(65º)','Bdm(66º)','Bdm(67º)','Bdm(68º)','Bdm(69º)','Bdm(70º)',...
        'Bdm(71º)','Bdm(72º)','Bdm(73º)','Bdm(74º)','Bdm(75º)','Bdm(76º)','Bdm(77º)','Bdm(78º)','Bdm(79º)','Bdm(80º)',...
        'Bdm(81º)','Bdm(82º)','Bdm(83º)','Bdm(84º)','Bdm(85º)','Bdm(86º)','Bdm(87º)','Bdm(88º)','Bdm(89º)','Bdm(90º)'};
    
GradosD = {'Ddm(0º)','Ddm(1º)','Ddm(2º)','Ddm(3º)','Ddm(4º)','Ddm(5º)','Ddm(6º)','Ddm(7º)','Ddm(8º)','Ddm(9º)','Ddm(10º)',...
        'Ddm(11º)','Ddm(12º)','Ddm(13º)','Ddm(14º)','Ddm(15º)','Ddm(16º)','Ddm(17º)','Ddm(18º)','Ddm(19º)','Ddm(20º)',...
        'Ddm(21º)','Ddm(22º)','Ddm(23º)','Ddm(24º)','Ddm(25º)','Ddm(26º)','Ddm(27º)','Ddm(28º)','Ddm(29º)','Ddm(30º)',...
        'Ddm(31º)','Ddm(32º)','Ddm(33º)','Ddm(34º)','Ddm(35º)','Ddm(36º)','Ddm(37º)','Ddm(38º)','Ddm(39º)','Ddm(40º)',...
        'Ddm(41º)','Ddm(42º)','Ddm(43º)','Ddm(44º)','Ddm(45º)','Ddm(46º)','Ddm(47º)','Ddm(48º)','Ddm(49º)','Ddm(50º)',...
        'Ddm(51º)','Ddm(52º)','Ddm(53º)','Ddm(54º)','Ddm(55º)','Ddm(56º)','Ddm(57º)','Ddm(58º)','Ddm(59º)','Ddm(60º)',...
        'Ddm(61º)','Ddm(62º)','Ddm(63º)','Ddm(64º)','Ddm(65º)','Ddm(66º)','Ddm(67º)','Ddm(68º)','Ddm(69º)','Ddm(70º)',...
        'Ddm(71º)','Ddm(72º)','Ddm(73º)','Ddm(74º)','Ddm(75º)','Ddm(76º)','Ddm(77º)','Ddm(78º)','Ddm(79º)','Ddm(80º)',...
        'Ddm(81º)','Ddm(82º)','Ddm(83º)','Ddm(84º)','Ddm(85º)','Ddm(86º)','Ddm(87º)','Ddm(88º)','Ddm(89º)','Ddm(90º)'};    
    
GradosR = {'Rdm(0º)','Rdm(1º)','Rdm(2º)','Rdm(3º)','Rdm(4º)','Rdm(5º)','Rdm(6º)','Rdm(7º)','Rdm(8º)','Rdm(9º)','Rdm(10º)',...
        'Rdm(11º)','Rdm(12º)','Rdm(13º)','Rdm(14º)','Rdm(15º)','Rdm(16º)','Rdm(17º)','Rdm(18º)','Rdm(19º)','Rdm(20º)',...
        'Rdm(21º)','Rdm(22º)','Rdm(23º)','Rdm(24º)','Rdm(25º)','Rdm(26º)','Rdm(27º)','Rdm(28º)','Rdm(29º)','Rdm(30º)',...
        'Rdm(31º)','Rdm(32º)','Rdm(33º)','Rdm(34º)','Rdm(35º)','Rdm(36º)','Rdm(37º)','Rdm(38º)','Rdm(39º)','Rdm(40º)',...
        'Rdm(41º)','Rdm(42º)','Rdm(43º)','Rdm(44º)','Rdm(45º)','Rdm(46º)','Rdm(47º)','Rdm(48º)','Rdm(49º)','Rdm(50º)',...
        'Rdm(51º)','Rdm(52º)','Rdm(53º)','Rdm(54º)','Rdm(55º)','Rdm(56º)','Rdm(57º)','Rdm(58º)','Rdm(59º)','Rdm(60º)',...
        'Rdm(61º)','Rdm(62º)','Rdm(63º)','Rdm(64º)','Rdm(65º)','Rdm(66º)','Rdm(67º)','Rdm(68º)','Rdm(69º)','Rdm(70º)',...
        'Rdm(71º)','Rdm(72º)','Rdm(73º)','Rdm(74º)','Rdm(75º)','Rdm(76º)','Rdm(77º)','Rdm(78º)','Rdm(79º)','Rdm(80º)',...
        'Rdm(81º)','Rdm(82º)','Rdm(83º)','Rdm(84º)','Rdm(85º)','Rdm(86º)','Rdm(87º)','Rdm(88º)','Rdm(89º)','Rdm(90º)'};
    
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
                
                %En la matriz "EscribirG" se almacenan todos los datos para radiación GLOBAL
                
                
                %RADIACIÓN GLOBAL DIARIA--------------------------------------------------%
                %Cabecera----------------------------------------------------------
                    escribirG(1,1) = NOMBRE_CIUDAD;
                    escribirG(1,2)={'Latitud'};
                    escribirG(1,3)={DATOS(2)};

                    escribirG(1,5)={'Inclinación óptima anual'};
                    escribirG(1,7) = {angulo_optimo};

                    escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};


                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirG(4,i+1) = GradosG(i);
                    end

                    for j=1:13
                        escribirG(j+4,1) = Meses(j);
                    end

                    for k=1:12
                        escribirG(k+4,2) = {DATOS(k+2)};
                    end

                    for u=1:12
                        for v=1:90
                           escribirG(u+4,v+2)= {GdBetaTotal(u,v)};
                        end
                    end


                    %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
                    for j=1:91
                    escribirG(17,j+1)={Media_GdBeta(j)};
                    end


                    %Valores ÓPTIMOS de radiación-------------------------------------- 
                    for j=1:13

                        escribirG(j+21,1) = Meses(j);

                    end
                    %Títulos
                    escribirG(21,2) = {'Gdm(Ópt.)'};
                    %Valores de Inclinación óptima
                    for i=1:12

                        escribirG(i+21,2) = {Radiacion_optima(i)};

                    end
                        %Media
                        escribirG(34,2) = {mean(Radiacion_optima)};

                    %Valores TEMPERATURAS----------------------------------------------
                    if (DATOS(15)==1000)

                    else   
                        escribirG(21,3) = {'Temp.(ºC)'};

                        for i=1:12

                           escribirG(i+21,3) = {DATOS(i+14)};

                        end

                         %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i+14);
                            end

                            mediaT = sumT/12;

                            escribirG(34,3) = {mediaT};

                    end

                    %Valores GANANCIAS-------------------------------------------------
                    %Títulos
                    escribirG(19,5) = {'GANANCIAS'};
                    escribirG(19,6) = {'Respecto a:'};
                    escribirG(20,6) = {'Plano horizontal'};
                    escribirG(21,6) = {'Fc.Ganancia'};
                    escribirG(21,7) = {'Ganancia(%)'};

                    %Valores de ganancias
                    %Factor de ganancia
                    for i=1:12

                        escribirG(i+21,6) = {GanaG_Anu_0(i)};

                    end
                        %Media 
                        escribirG(34,6) = {mean(GanaG_Anu_0)};

                    %Factor de ganancia
                    for i=1:12

                        escribirG(i+21,7) =  {PorGanaG_Anu_0(i)};

                    end
                        %Media
                         escribirG(34,7) = {mean(PorGanaG_Anu_0)};

                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
     
            case 2 %Directa     
            
                %En la matriz "EscribirB" se almacenan todos los datos para radiación DIRECTA
                
                %RADIACIÓN DIRECTA DIARIA--------------------------------------------------%
                %Cabecera----------------------------------------------------------
                    escribirB(1,1) = NOMBRE_CIUDAD;
                    escribirB(1,2)={'Latitud'};
                    escribirB(1,3)={DATOS(2)};

                    escribirB(1,5)={'Inclinación óptima anual'};
                    escribirB(1,7) = {angulo_optimo};

                    escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};


                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirB(4,i+1) = GradosB(i);
                    end

                    for j=1:13
                        escribirB(j+4,1) = Meses(j);
                    end

                    for k=1:12
                        escribirB(k+4,2) = {Val_Bdm0(k)};
                    end

                    for u=1:12
                        for v=1:90
                           escribirB(u+4,v+2)= {BdBetaTotal(u,v)};
                        end
                    end


                    %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
                    for j=1:91
                    escribirB(17,j+1)={Media_BdBeta(j)};
                    end


                    %Valores ÓPTIMOS de radiación-------------------------------------- 
                    for j=1:13

                        escribirB(j+21,1) = Meses(j);

                    end
                    %Títulos
                    escribirB(21,2) = {'Bdm(Ópt.)'};
                    %Valores de Inclinación óptima
                    for i=1:12

                        escribirB(i+21,2) = {Radiacion_Bd_Optima(i)};

                    end
                        %Media
                        escribirB(34,2) = {media_Bd_optimo};

                    %Valores TEMPERATURAS----------------------------------------------
                    if (DATOS(15)==1000)

                    else   
                        escribirB(21,3) = {'Temp.(ºC)'};

                        for i=1:12

                           escribirB(i+21,3) = {DATOS(i+14)};

                        end

                         %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i+14);
                            end

                            mediaT = sumT/12;

                            escribirB(34,3) = {mediaT};

                    end

                    %Valores GANANCIAS-------------------------------------------------
                    %Títulos
                    escribirB(19,5) = {'GANANCIAS'};
                    escribirB(19,6) = {'Respecto a:'};
                    escribirB(20,6) = {'Plano horizontal'};
                    escribirB(21,6) = {'Fc.Ganancia'};
                    escribirB(21,7) = {'Ganancia(%)'};

                    %Valores de ganancias
                    %Factor de ganancia
                    for i=1:12

                        escribirB(i+21,6) = {GanaB_Anu_0(i)};

                    end
                        %Media 
                        escribirB(34,6) = {mean(GanaB_Anu_0)};

                    %Factor de ganancia
                    for i=1:12

                        escribirB(i+21,7) =  {PorGanaB_Anu_0(i)};

                    end
                        %Media
                         escribirB(34,7) = {mean(PorGanaB_Anu_0)};


                
                
                
                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirB,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');  
                
                
                
            case 3 %Difusa 
            
                %En la matriz "EscribirD" se almacenan todos los datos para radiación DIFUSA       
                 
                %RADIACIÓ DIFUSA DIARIA---------------------------------------------------%
                %Cabecera----------------------------------------------------------
                    escribirD(1,1) = NOMBRE_CIUDAD;
                    escribirD(1,2)={'Latitud'};
                    escribirD(1,3)={DATOS(2)};

                    escribirD(1,5)={'Inclinación óptima anual'};
                    escribirD(1,7) = {angulo_optimo};

                    escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};


                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirD(4,i+1) = GradosD(i);
                    end

                    for j=1:13
                        escribirD(j+4,1) = Meses(j);
                    end

                    for k=1:12
                        escribirD(k+4,2) = {Val_Ddm0(k)};
                    end

                    for u=1:12
                        for v=1:90
                           escribirD(u+4,v+2)= {DdBetaTotal(u,v)};
                        end
                    end


                    %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
                    for j=1:91
                    escribirD(17,j+1)={Media_DdBeta(j)};
                    end


                    %Valores ÓPTIMOS de radiación-------------------------------------- 
                    for j=1:13

                        escribirD(j+21,1) = Meses(j);

                    end
                    %Títulos
                    escribirD(21,2) = {'Ddm(Ópt.)'};
                    %Valores de Inclinación óptima
                    for i=1:12

                        escribirD(i+21,2) = {Radiacion_Dd_Optima(i)};

                    end
                        %Media
                        escribirD(34,2) = {media_Dd_optimo};

                    %Valores TEMPERATURAS----------------------------------------------
                    if (DATOS(15)==1000)

                    else   
                        escribirD(21,3) = {'Temp.(ºC)'};

                        for i=1:12

                           escribirD(i+21,3) = {DATOS(i+14)};

                        end

                         %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                            escribirD(34,3) = {mediaT};

                    end

                    %Valores GANANCIAS-------------------------------------------------
                    %Títulos
                    escribirD(19,5) = {'GANANCIAS'};
                    escribirD(19,6) = {'Respecto a:'};
                    escribirD(20,6) = {'Plano horizontal'};
                    escribirD(21,6) = {'Fc.Ganancia'};
                    escribirD(21,7) = {'Ganancia(%)'};

                    %Valores de ganancias
                    %Factor de ganancia
                    for i=1:12

                        escribirD(i+21,6) = {GanaD_Anu_0(i)};

                    end
                        %Media 
                        escribirD(34,6) = {mean(GanaD_Anu_0)};

                    %Factor de ganancia
                    for i=1:12

                        escribirD(i+21,7) =  {PorGanaD_Anu_0(i)};

                    end
                        %Media
                         escribirD(34,7) = {mean(PorGanaD_Anu_0)};                
                 
                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirD,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
         
            case 4 %Albedo
                
                %En la matriz "EscribirR" se almacenan todos los datos para radiación DE ALBEDO
                  
                %RADIACIÓN DE ALBEDO DIARIA-------------------------------------------------
                %Cabecera----------------------------------------------------------
                    escribirR(1,1) = NOMBRE_CIUDAD;
                    escribirR(1,2)={'Latitud'};
                    escribirR(1,3)={DATOS(2)};

                    escribirR(1,5)={'Inclinación óptima anual'};
                    escribirR(1,7) = {angulo_optimo};

                    escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};


                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirR(4,i+1) = GradosR(i);
                    end

                    for j=1:13
                        escribirR(j+4,1) = Meses(j);
                    end

                    for k=1:12
                        escribirR(k+4,2) = {0};
                    end

                    for u=1:12
                        for v=1:90
                           escribirR(u+4,v+2)= {RdBetaTotal(u,v)};
                        end
                    end


                    %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
                    for j=1:91
                    escribirR(17,j+1)={Media_RdBeta(j)};
                    end


                    %Valores ÓPTIMOS de radiación-------------------------------------- 
                    for j=1:13

                        escribirR(j+21,1) = Meses(j);

                    end
                    %Títulos
                    escribirR(21,2) = {'Rdm(Ópt.)'};
                    %Valores de Inclinación óptima
                    for i=1:12

                        escribirR(i+21,2) = {Radiacion_Rd_Optima(i)};

                    end
                        %Media
                        escribirR(34,2) = {media_Rd_optimo};

                    %Valores TEMPERATURAS----------------------------------------------
                    if (DATOS(15)==1000)

                    else   
                        escribirR(21,3) = {'Temp.(ºC)'};

                        for i=1:12

                           escribirR(i+21,3) = {DATOS(i+14)};

                        end

                         %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                            escribirR(34,3) = {mediaT};

                    end

                    %Valores GANANCIAS-------------------------------------------------
                    %Títulos
                    escribirR(19,5) = {'GANANCIAS'};
                    escribirR(19,6) = {'Respecto a:'};
                    escribirR(20,6) = {'Plano horizontal'};
                    escribirR(21,6) = {'Fc.Ganancia'};
                    escribirR(21,7) = {'Ganancia(%)'};

                    %Valores de ganancias
                    %Factor de ganancia
                    for i=1:12

                        escribirR(i+21,6) = {'-'};

                    end
                        %Media 
                        escribirR(34,6) = {'-'};
                    %Factor de ganancia
                    for i=1:12

                        escribirR(i+21,7) =  {'-'};

                    end
                        %Media
                         escribirR(34,7) = {'-'};
                
                %Escritura
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
        
        escribirG(1,5)={'Inclinación óptima anual'};
        escribirG(1,7) = {angulo_optimo};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirG(4,i+1) = GradosG(i);
        end

        for j=1:13
            escribirG(j+4,1) = Meses(j);
        end

        for k=1:12
            escribirG(k+4,2) = {DATOS(k+2)};
        end

        for u=1:12
            for v=1:90
               escribirG(u+4,v+2)= {GdBetaTotal(u,v)};
            end
        end
        
        
        %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
        for j=1:91
        escribirG(17,j+1)={Media_GdBeta(j)};
        end
        
        
        %Valores ÓPTIMOS de radiación-------------------------------------- 
        for j=1:13
    
            escribirG(j+21,1) = Meses(j);
  
        end
        %Títulos
        escribirG(21,2) = {'Gdm(Ópt.)'};
        %Valores de Inclinación óptima
        for i=1:12

            escribirG(i+21,2) = {Radiacion_optima(i)};

        end
            %Media
            escribirG(34,2) = {mean(Radiacion_optima)};
        
        %Valores TEMPERATURAS----------------------------------------------
        if (DATOS(15)==1000)
    
        else   
            escribirG(21,3) = {'Temp.(ºC)'};
            
            for i=1:12
                
               escribirG(i+21,3) = {DATOS(i+14)};
                
            end
            
             %Media de las temperaturas
                sumT = 0;
                for i=15:26
                    sumT = sumT + DATOS(i);
                end

                mediaT = sumT/12;

                escribirG(34,3) = {mediaT};

        end
        
        %Valores GANANCIAS-------------------------------------------------
        %Títulos
        escribirG(19,5) = {'GANANCIAS'};
        escribirG(19,6) = {'Respecto a:'};
        escribirG(20,6) = {'Plano horizontal'};
        escribirG(21,6) = {'Fc.Ganancia'};
        escribirG(21,7) = {'Ganancia(%)'};
        
        %Valores de ganancias
        %Factor de ganancia
        for i=1:12

            escribirG(i+21,6) = {GanaG_Anu_0(i)};

        end
            %Media 
            escribirG(34,6) = {mean(GanaG_Anu_0)};
        
        %Factor de ganancia
        for i=1:12

            escribirG(i+21,7) =  {PorGanaG_Anu_0(i)};

        end
            %Media
             escribirG(34,7) = {mean(PorGanaG_Anu_0)};
             
        %DIRECTA:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Inclinación óptima anual'};
        escribirB(1,7) = {angulo_optimo};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirB(4,i+1) = GradosB(i);
        end

        for j=1:13
            escribirB(j+4,1) = Meses(j);
        end

        for k=1:12
            escribirB(k+4,2) = {Val_Bdm0(k)};
        end

        for u=1:12
            for v=1:90
               escribirB(u+4,v+2)= {BdBetaTotal(u,v)};
            end
        end
        
        
        %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
        for j=1:91
        escribirB(17,j+1)={Media_BdBeta(j)};
        end
        
        
        %Valores ÓPTIMOS de radiación-------------------------------------- 
        for j=1:13
    
            escribirB(j+21,1) = Meses(j);
  
        end
        %Títulos
        escribirB(21,2) = {'Bdm(Ópt.)'};
        %Valores de Inclinación óptima
        for i=1:12

            escribirB(i+21,2) = {Radiacion_Bd_Optima(i)};

        end
            %Media
            escribirB(34,2) = {media_Bd_optimo};
        
        %Valores TEMPERATURAS----------------------------------------------
        if (DATOS(15)==1000)
    
        else   
            escribirB(21,3) = {'Temp.(ºC)'};
            
            for i=1:12
                
               escribirB(i+21,3) = {DATOS(i+14)};
                
            end
            
             %Media de las temperaturas
                sumT = 0;
                for i=15:26
                    sumT = sumT + DATOS(i);
                end

                mediaT = sumT/12;

                escribirB(34,3) = {mediaT};

        end
        
        %Valores GANANCIAS-------------------------------------------------
        %Títulos
        escribirB(19,5) = {'GANANCIAS'};
        escribirB(19,6) = {'Respecto a:'};
        escribirB(20,6) = {'Plano horizontal'};
        escribirB(21,6) = {'Fc.Ganancia'};
        escribirB(21,7) = {'Ganancia(%)'};
        
        %Valores de ganancias
        %Factor de ganancia
        for i=1:12

            escribirB(i+21,6) = {GanaB_Anu_0(i)};

        end
            %Media 
            escribirB(34,6) = {mean(GanaB_Anu_0)};
        
        %Factor de ganancia
        for i=1:12

            escribirB(i+21,7) =  {PorGanaB_Anu_0(i)};

        end
            %Media
             escribirB(34,7) = {mean(PorGanaB_Anu_0)};



        %DIFUSA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Inclinación óptima anual'};
        escribirD(1,7) = {angulo_optimo};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirD(4,i+1) = GradosD(i);
        end

        for j=1:13
            escribirD(j+4,1) = Meses(j);
        end

        for k=1:12
            escribirD(k+4,2) = {Val_Ddm0(k)};
        end

        for u=1:12
            for v=1:90
               escribirD(u+4,v+2)= {DdBetaTotal(u,v)};
            end
        end
        
        
        %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
        for j=1:91
        escribirD(17,j+1)={Media_DdBeta(j)};
        end
        
        
        %Valores ÓPTIMOS de radiación-------------------------------------- 
        for j=1:13
    
            escribirD(j+21,1) = Meses(j);
  
        end
        %Títulos
        escribirD(21,2) = {'Ddm(Ópt.)'};
        %Valores de Inclinación óptima
        for i=1:12

            escribirD(i+21,2) = {Radiacion_Dd_Optima(i)};

        end
            %Media
            escribirD(34,2) = {media_Dd_optimo};
        
        %Valores TEMPERATURAS----------------------------------------------
        if (DATOS(15)==1000)
    
        else   
            escribirD(21,3) = {'Temp.(ºC)'};
            
            for i=1:12
                
               escribirD(i+21,3) = {DATOS(i+14)};
                
            end
            
             %Media de las temperaturas
                sumT = 0;
                for i=15:26
                    sumT = sumT + DATOS(i);
                end

                mediaT = sumT/12;

                escribirD(34,3) = {mediaT};

        end
        
        %Valores GANANCIAS-------------------------------------------------
        %Títulos
        escribirD(19,5) = {'GANANCIAS'};
        escribirD(19,6) = {'Respecto a:'};
        escribirD(20,6) = {'Plano horizontal'};
        escribirD(21,6) = {'Fc.Ganancia'};
        escribirD(21,7) = {'Ganancia(%)'};
        
        %Valores de ganancias
        %Factor de ganancia
        for i=1:12

            escribirD(i+21,6) = {GanaD_Anu_0(i)};

        end
            %Media 
            escribirD(34,6) = {mean(GanaD_Anu_0)};
        
        %Factor de ganancia
        for i=1:12

            escribirD(i+21,7) =  {PorGanaD_Anu_0(i)};

        end
            %Media
             escribirD(34,7) = {mean(PorGanaD_Anu_0)};



        %ALBEDO::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Inclinación óptima anual'};
        escribirR(1,7) = {angulo_optimo};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirR(4,i+1) = GradosR(i);
        end

        for j=1:13
            escribirR(j+4,1) = Meses(j);
        end

        for k=1:12
            escribirR(k+4,2) = {0};
        end

        for u=1:12
            for v=1:90
               escribirR(u+4,v+2)= {RdBetaTotal(u,v)};
            end
        end
        
        
        %Valores MEDIOS de radiación para cada inclinación 0º hasta 90º----
        for j=1:91
        escribirR(17,j+1)={Media_RdBeta(j)};
        end
        
        
        %Valores ÓPTIMOS de radiación-------------------------------------- 
        for j=1:13
    
            escribirR(j+21,1) = Meses(j);
  
        end
        %Títulos
        escribirR(21,2) = {'Rdm(Ópt.)'};
        %Valores de Inclinación óptima
        for i=1:12

            escribirR(i+21,2) = {Radiacion_Rd_Optima(i)};

        end
            %Media
            escribirR(34,2) = {media_Rd_optimo};
        
        %Valores TEMPERATURAS----------------------------------------------
        if (DATOS(15)==1000)
    
        else   
            escribirR(21,3) = {'Temp.(ºC)'};
            
            for i=1:12
                
               escribirR(i+21,3) = {DATOS(i+14)};
                
            end
            
             %Media de las temperaturas
                sumT = 0;
                for i=15:26
                    sumT = sumT + DATOS(i);
                end

                mediaT = sumT/12;

                escribirR(34,3) = {mediaT};

        end
        
        %Valores GANANCIAS-------------------------------------------------
        %Títulos
        escribirR(19,5) = {'GANANCIAS'};
        escribirR(19,6) = {'Respecto a:'};
        escribirR(20,6) = {'Plano horizontal'};
        escribirR(21,6) = {'Fc.Ganancia'};
        escribirR(21,7) = {'Ganancia(%)'};
        
        %Valores de ganancias
        %Factor de ganancia
        for i=1:12

            escribirR(i+21,6) = {'-'};

        end
            %Media 
            escribirR(34,6) = {'-'};
        %Factor de ganancia
        for i=1:12

            escribirR(i+21,7) =  {'-'};

        end
            %Media
             escribirR(34,7) = {'-'};



        %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
        xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
        xlswrite(fullfile(ruta,nombre),escribirB,'Hoja2','A1');
        xlswrite(fullfile(ruta,nombre),escribirD,'Hoja3','A1');
        xlswrite(fullfile(ruta,nombre),escribirR,'Hoja4','A1');


        warning('off','MATLAB:xlswrite:AddSheet');


        msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
   
end

guidata(hObject, handles);

% --- Executes on button press in Informe.
function Informe_Callback(hObject, eventdata, handles)

global DATOS RadG0 medRadG0;
global Val_Bdm0 medRadB0;
global Val_Ddm0 medRadD0;
global Val_Rdm0 medRadR0;

%Ganancias
global medPorGanaG_Anu_0 PorGanaG_Anu_0;
global medPorGanaB_Anu_0 PorGanaB_Anu_0;
global medPorGanaD_Anu_0 PorGanaD_Anu_0;
global medPorGanaR_Anu_0 PorGanaR_Anu_0;

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
  
medPorGanaG_Anu_0 = mean(PorGanaG_Anu_0);

%DIRECTA-----------------------------------
%Media radiación directa 0º
medRadB0 = mean (Val_Bdm0);
  
medPorGanaB_Anu_0 = mean(PorGanaB_Anu_0);  
%DIFUSA-----------------------------------
%Media radiación directa 0º
medRadD0 = mean (Val_Ddm0);
  
medPorGanaD_Anu_0 = mean(PorGanaD_Anu_0);  
%ALBEDO-----------------------------------
%Media radiación directa 0º
Val_Rdm0 = zeros(1,12);
medRadR0 = 0;
  
medPorGanaR_Anu_0 = mean(PorGanaR_Anu_0);  

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'
        report ReportOptAnual.rpt;

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

close ('OrientSol 3.0 - Inclinación óptima anual');
 

% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_OptAnual;
close ('OrientSol 3.0 - Inclinación óptima anual');

% --- Executes on button press in Energia.
function Energia_Callback(hObject, eventdata, handles)
global DATOS;
global Radiacion_optima;

global RADIACION_OST;

global VOLVER_ENER;

VOLVER_ENER = 1;

RADIACION_OST  = Radiacion_optima;

if (DATOS(15)==1000)
   
   Energia_Osterwald_N; 
   close ('OrientSol 3.0 - Inclinación óptima anual');
   
else 
   
   Energia_Osterwald;
   close ('OrientSol 3.0 - Inclinación óptima anual');
end

%global RADIACION
%RADIACION  = mean(Radiacion_optima);
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
