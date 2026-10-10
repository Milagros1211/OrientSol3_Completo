function varargout = Tabla_OptEstacional(varargin)
% TABLA_OPTESTACIONAL MATLAB code for Tabla_OptEstacional.fig
%      TABLA_OPTESTACIONAL, by itself, creates a new TABLA_OPTESTACIONAL or raises the existing
%      singleton*.
%
%      H = TABLA_OPTESTACIONAL returns the handle to a new TABLA_OPTESTACIONAL or the handle to
%      the existing singleton*.
%
%      TABLA_OPTESTACIONAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_OPTESTACIONAL.M with the given input arguments.
%
%      TABLA_OPTESTACIONAL('Property','Value',...) creates a new TABLA_OPTESTACIONAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_OptEstacional_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_OptEstacional_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_OptEstacional

% Last Modified by GUIDE v2.5 22-Jan-2015 17:13:15

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_OptEstacional_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_OptEstacional_OutputFcn, ...
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


% --- Executes just before Tabla_OptEstacional is made visible.
function Tabla_OptEstacional_OpeningFcn(hObject, eventdata, handles, varargin)

global OPCION_COMP
global NOMBRE_CIUDAD DATOS 


global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;
%G
global GdBetaTotal
global GdBeta_Invierno GdOpt_Inv GdBeta_Primavera GdOpt_Pri GdBeta_Verano GdOpt_Ver GdBeta_Otonio GdOpt_Oto;
%global Med_GdOpt_Inv Med_GdOpt_Pri Med_GdOpt_Ver Med_GdOpt_Oto;

%Ganancias
%Ganancias==========================
global PorGanaG_Est_0 PorGanaG_Est_Anu;

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
OPCION_COMP=1;

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
    set(handles.C15_dic,'String',roundn(GdBeta_Invierno(1,15),-2))
    set(handles.C15_ene,'String',roundn(GdBeta_Invierno(2,15),-2));
    set(handles.C15_feb,'String',roundn(GdBeta_Invierno(3,15),-2));
    
    set(handles.C15_mar,'String',roundn(GdBeta_Primavera(1,15),-2));
    set(handles.C15_abr,'String',roundn(GdBeta_Primavera(2,15),-2));
    set(handles.C15_may,'String',roundn(GdBeta_Primavera(3,15),-2));
    
    set(handles.C15_jun,'String',roundn(GdBeta_Verano(1,15),-2));
    set(handles.C15_jul,'String',roundn(GdBeta_Verano(2,15),-2));
    set(handles.C15_ago,'String',roundn(GdBeta_Verano(3,15),-2));
    
    set(handles.C15_sep,'String',roundn(GdBeta_Otonio(1,15),-2));
    set(handles.C15_oct,'String',roundn(GdBeta_Otonio(2,15),-2));
    set(handles.C15_nov,'String',roundn(GdBeta_Otonio(3,15),-2));
    
    
    set(handles.C15_media,'String',roundn(mean(GdBetaTotal(:,15)),-2));

    
    %Mostrar valores para inclinación de 30º
    set(handles.C30_dic,'String',roundn(GdBeta_Invierno(1,30),-2));
    set(handles.C30_ene,'String',roundn(GdBeta_Invierno(2,30),-2));
    set(handles.C30_feb,'String',roundn(GdBeta_Invierno(3,30),-2));
    
    set(handles.C30_mar,'String',roundn(GdBeta_Invierno(1,30),-2));
    set(handles.C30_abr,'String',roundn(GdBeta_Invierno(2,30),-2));
    set(handles.C30_may,'String',roundn(GdBeta_Invierno(3,30),-2));
    
    set(handles.C30_jun,'String',roundn(GdBeta_Invierno(1,30),-2));
    set(handles.C30_jul,'String',roundn(GdBeta_Verano(2,30),-2));
    set(handles.C30_ago,'String',roundn(GdBeta_Verano(3,30),-2));
    
    set(handles.C30_sep,'String',roundn(GdBeta_Otonio(1,30),-2));
    set(handles.C30_oct,'String',roundn(GdBeta_Otonio(2,30),-2));
    set(handles.C30_nov,'String',roundn(GdBeta_Otonio(3,30),-2));
        
    set(handles.C30_media,'String',roundn(mean(GdBetaTotal(:,30)),-2));
    
        
    %Mostrar valores para inclinación de 45º
    set(handles.C45_dic,'String',roundn(GdBeta_Invierno(1,45),-2));
    set(handles.C45_ene,'String',roundn(GdBeta_Invierno(2,45),-2));
    set(handles.C45_feb,'String',roundn(GdBeta_Invierno(3,45),-2));
    
    set(handles.C45_mar,'String',roundn(GdBeta_Primavera(1,45),-2));
    set(handles.C45_abr,'String',roundn(GdBeta_Primavera(2,45),-2));
    set(handles.C45_may,'String',roundn(GdBeta_Primavera(3,45),-2));
    
    set(handles.C45_jun,'String',roundn(GdBeta_Verano(1,45),-2));
    set(handles.C45_jul,'String',roundn(GdBeta_Verano(2,45),-2));
    set(handles.C45_ago,'String',roundn(GdBeta_Verano(3,45),-2));
    
    set(handles.C45_sep,'String',roundn(GdBeta_Otonio(1,45),-2));
    set(handles.C45_oct,'String',roundn(GdBeta_Otonio(2,45),-2));
    set(handles.C45_nov,'String',roundn(GdBeta_Otonio(3,45),-2));
        
    set(handles.C45_media,'String',roundn(mean(GdBetaTotal(:,45)),-2));
    
    
    %Mostrar valores para inclinación de 60º
    set(handles.C60_dic,'String',roundn(GdBeta_Invierno(1,60),-2));
    set(handles.C60_ene,'String',roundn(GdBeta_Invierno(2,60),-2));
    set(handles.C60_feb,'String',roundn(GdBeta_Invierno(3,60),-2));
    
    set(handles.C60_mar,'String',roundn(GdBeta_Primavera(1,60),-2));
    set(handles.C60_abr,'String',roundn(GdBeta_Primavera(2,60),-2));
    set(handles.C60_may,'String',roundn(GdBeta_Primavera(3,60),-2));
    
    set(handles.C60_jun,'String',roundn(GdBeta_Verano(1,60),-2));
    set(handles.C60_jul,'String',roundn(GdBeta_Verano(2,60),-2));
    set(handles.C60_ago,'String',roundn(GdBeta_Verano(3,60),-2));
    
    set(handles.C60_sep,'String',roundn(GdBeta_Otonio(1,60),-2));
    set(handles.C60_oct,'String',roundn(GdBeta_Otonio(2,60),-2));
    set(handles.C60_nov,'String',roundn(GdBeta_Otonio(3,60),-2));
    
    set(handles.C60_media,'String',roundn(mean(GdBetaTotal(:,60)),-2));
    
    
    %Mostrar valores para inclinación de 75º
    set(handles.C75_dic,'String',roundn(GdBeta_Invierno(1,75),-2));
    set(handles.C75_ene,'String',roundn(GdBeta_Invierno(2,75),-2));
    set(handles.C75_feb,'String',roundn(GdBeta_Invierno(3,75),-2));
    
    set(handles.C75_mar,'String',roundn(GdBeta_Primavera(1,75),-2));
    set(handles.C75_abr,'String',roundn(GdBeta_Primavera(2,75),-2));
    set(handles.C75_may,'String',roundn(GdBeta_Primavera(3,75),-2));
    
    set(handles.C75_jun,'String',roundn(GdBeta_Verano(1,75),-2));
    set(handles.C75_jul,'String',roundn(GdBeta_Verano(2,75),-2));
    set(handles.C75_ago,'String',roundn(GdBeta_Verano(3,75),-2));
    
    set(handles.C75_sep,'String',roundn(GdBeta_Otonio(1,75),-2));
    set(handles.C75_oct,'String',roundn(GdBeta_Otonio(2,75),-2));
    set(handles.C75_nov,'String',roundn(GdBeta_Otonio(3,75),-2));
    
    
    set(handles.C75_media,'String',roundn(mean(GdBetaTotal(:,75)),-2));
    
    %Mostrar valores para inclinación de 90º
    set(handles.C90_dic,'String',roundn(GdBeta_Invierno(1,90),-2));
    set(handles.C90_ene,'String',roundn(GdBeta_Invierno(2,90),-2));
    set(handles.C90_feb,'String',roundn(GdBeta_Invierno(3,90),-2));
    
    set(handles.C90_mar,'String',roundn(GdBeta_Primavera(1,90),-2));
    set(handles.C90_abr,'String',roundn(GdBeta_Primavera(2,90),-2));
    set(handles.C90_may,'String',roundn(GdBeta_Primavera(3,90),-2));
    
    set(handles.C90_jun,'String',roundn(GdBeta_Verano(1,90),-2));
    set(handles.C90_jul,'String',roundn(GdBeta_Verano(2,90),-2));
    set(handles.C90_ago,'String',roundn(GdBeta_Verano(3,90),-2));
    
    set(handles.C90_sep,'String',roundn(GdBeta_Otonio(1,90),-2));
    set(handles.C90_oct,'String',roundn(GdBeta_Otonio(2,90),-2));
    set(handles.C90_nov,'String',roundn(GdBeta_Otonio(3,90),-2));
    
    
    set(handles.C90_media,'String',roundn(mean(GdBetaTotal(:,90)),-2));
    
    
    %Inclinación óptima
    %Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
    %estación 
    
    RadiacionG_optima_Est = zeros(1,12);

    RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
    RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
    RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

    RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
    RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
    RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

    RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
    RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
    RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

    RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
    RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
    RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre
    
    
    %Ángulos óptimos
    set (handles.Ang_Opt_Inv,'String', angOptim_Inv);
    set(handles.Ang_Opt_Pri, 'String', angOptim_Pri);
    set (handles.Ang_Opt_Ver,'String', angOptim_Ver);
    set(handles.Ang_Opt_Oto, 'String', angOptim_Oto);
    
    set(handles.COptEst_dic,'String',roundn(RadiacionG_optima_Est(12),-2));
    set(handles.COptEst_ene,'String',roundn(RadiacionG_optima_Est(1),-2));
    set(handles.COptEst_feb,'String',roundn(RadiacionG_optima_Est(2),-2));
    set(handles.COptEst_mar,'String',roundn(RadiacionG_optima_Est(3),-2));
    set(handles.COptEst_abr,'String',roundn(RadiacionG_optima_Est(4),-2));
    set(handles.COptEst_may,'String',roundn(RadiacionG_optima_Est(5),-2));
    set(handles.COptEst_jun,'String',roundn(RadiacionG_optima_Est(6),-2));
    set(handles.COptEst_jul,'String',roundn(RadiacionG_optima_Est(7),-2));
    set(handles.COptEst_ago,'String',roundn(RadiacionG_optima_Est(8),-2));
    set(handles.COptEst_sep,'String',roundn(RadiacionG_optima_Est(9),-2));
    set(handles.COptEst_oct,'String',roundn(RadiacionG_optima_Est(10),-2));
    set(handles.COptEst_nov,'String',roundn(RadiacionG_optima_Est(11),-2));
    
   
    set(handles.COptEst_media,'String',roundn(mean(RadiacionG_optima_Est),-2));
    
    
    
%GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Respecto al plano horizontal

    set(handles.CGanaEst_0_dic, 'String', roundn(PorGanaG_Est_0(12),-2));
    set(handles.CGanaEst_0_ene, 'String', roundn(PorGanaG_Est_0(1),-2));
    set(handles.CGanaEst_0_feb, 'String', roundn(PorGanaG_Est_0(2),-2));
    set(handles.CGanaEst_0_mar, 'String', roundn(PorGanaG_Est_0(3),-2));
    set(handles.CGanaEst_0_abr, 'String', roundn(PorGanaG_Est_0(4),-2));
    set(handles.CGanaEst_0_may, 'String', roundn(PorGanaG_Est_0(5),-2));
    set(handles.CGanaEst_0_jun, 'String', roundn(PorGanaG_Est_0(6),-2));
    set(handles.CGanaEst_0_jul, 'String', roundn(PorGanaG_Est_0(7),-2));
    set(handles.CGanaEst_0_ago, 'String', roundn(PorGanaG_Est_0(8),-2));
    set(handles.CGanaEst_0_sep, 'String', roundn(PorGanaG_Est_0(9),-2));
    set(handles.CGanaEst_0_oct, 'String', roundn(PorGanaG_Est_0(10),-2));
    set(handles.CGanaEst_0_nov, 'String', roundn(PorGanaG_Est_0(11),-2));
    
        
    set(handles.CGanaEst_0_media, 'String', roundn(mean(PorGanaG_Est_0),-2));

%Porcentaje de ganancia
    set(handles.CGanaEst_Anu_ene, 'String', roundn(PorGanaG_Est_Anu(1),-2));
    set(handles.CGanaEst_Anu_feb, 'String', roundn(PorGanaG_Est_Anu(2),-2));
    set(handles.CGanaEst_Anu_mar, 'String', roundn(PorGanaG_Est_Anu(3),-2));
    set(handles.CGanaEst_Anu_abr, 'String', roundn(PorGanaG_Est_Anu(4),-2));
    set(handles.CGanaEst_Anu_may, 'String', roundn(PorGanaG_Est_Anu(5),-2));
    set(handles.CGanaEst_Anu_jun, 'String', roundn(PorGanaG_Est_Anu(6),-2));
    set(handles.CGanaEst_Anu_jul, 'String', roundn(PorGanaG_Est_Anu(7),-2));
    set(handles.CGanaEst_Anu_ago, 'String', roundn(PorGanaG_Est_Anu(8),-2));
    set(handles.CGanaEst_Anu_sep, 'String', roundn(PorGanaG_Est_Anu(9),-2));
    set(handles.CGanaEst_Anu_oct, 'String', roundn(PorGanaG_Est_Anu(10),-2));
    set(handles.CGanaEst_Anu_nov, 'String', roundn(PorGanaG_Est_Anu(11),-2));
    set(handles.CGanaEst_Anu_dic, 'String', roundn(PorGanaG_Est_Anu(12),-2));
        
    set(handles.CGanaEst_Anu_media, 'String', roundn(mean(PorGanaG_Est_Anu),-2));



% Choose default command line output for Tabla_OptEstacional
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_OptEstacional wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_OptEstacional_OutputFcn(hObject, eventdata, handles) 
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

global angulo_optimo;
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;
%G
global GdBetaTotal
global DATOS GdBeta_Invierno GdOpt_Inv GdBeta_Primavera GdOpt_Pri GdBeta_Verano GdOpt_Ver GdBeta_Otonio GdOpt_Oto;
%global Med_GdOpt_Inv Med_GdOpt_Pri Med_GdOpt_Ver Med_GdOpt_Oto;
%B
global BdBetaTotal
global Val_Bdm0 BdBeta_Invierno BdOpt_Inv  BdBeta_Primavera BdOpt_Pri  BdBeta_Verano BdOpt_Ver  BdBeta_Otonio BdOpt_Oto;
%global Med_BdOpt_Inv Med_BdOpt_Pri Med_BdOpt_Ver Med_BdOpt_Oto;
%D
global DdBetaTotal
global Val_Ddm0 DdBeta_Invierno DdOpt_Inv  DdBeta_Primavera DdOpt_Pri  DdBeta_Verano DdOpt_Ver  DdBeta_Otonio DdOpt_Oto;
%global Med_DdOpt_Inv Med_DdOpt_Pri Med_DdOpt_Ver Med_DdOpt_Oto;
%R
global RdBetaTotal
global RdBeta_Invierno RdOpt_Inv  RdBeta_Primavera RdOpt_Pri  RdBeta_Verano RdOpt_Ver  RdBeta_Otonio RdOpt_Oto;
%global Med_RdOpt_Inv Med_RdOpt_Pri Med_RdOpt_Ver Med_RdOpt_Oto;
%Ganancias==========================
global PorGanaG_Est_0 PorGanaG_Est_Anu;
global PorGanaB_Est_0 PorGanaB_Est_Anu;
global PorGanaD_Est_0 PorGanaD_Est_Anu;
global PorGanaR_Est_0 PorGanaR_Est_Anu;

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
        set(handles.Componente_Opt,'String','Gdm');

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
            set(handles.C15_dic,'String',roundn(GdBeta_Invierno(1,15),-2))
            set(handles.C15_ene,'String',roundn(GdBeta_Invierno(2,15),-2));
            set(handles.C15_feb,'String',roundn(GdBeta_Invierno(3,15),-2));

            set(handles.C15_mar,'String',roundn(GdBeta_Primavera(1,15),-2));
            set(handles.C15_abr,'String',roundn(GdBeta_Primavera(2,15),-2));
            set(handles.C15_may,'String',roundn(GdBeta_Primavera(3,15),-2));

            set(handles.C15_jun,'String',roundn(GdBeta_Verano(1,15),-2));
            set(handles.C15_jul,'String',roundn(GdBeta_Verano(2,15),-2));
            set(handles.C15_ago,'String',roundn(GdBeta_Verano(3,15),-2));

            set(handles.C15_sep,'String',roundn(GdBeta_Otonio(1,15),-2));
            set(handles.C15_oct,'String',roundn(GdBeta_Otonio(2,15),-2));
            set(handles.C15_nov,'String',roundn(GdBeta_Otonio(3,15),-2));


            set(handles.C15_media,'String',roundn(mean(GdBetaTotal(:,15)),-2));


            %Mostrar valores para inclinación de 30º
            set(handles.C30_dic,'String',roundn(GdBeta_Invierno(1,30),-2));
            set(handles.C30_ene,'String',roundn(GdBeta_Invierno(2,30),-2));
            set(handles.C30_feb,'String',roundn(GdBeta_Invierno(3,30),-2));

            set(handles.C30_mar,'String',roundn(GdBeta_Primavera(1,30),-2));
            set(handles.C30_abr,'String',roundn(GdBeta_Primavera(2,30),-2));
            set(handles.C30_may,'String',roundn(GdBeta_Primavera(3,30),-2));

            set(handles.C30_jun,'String',roundn(GdBeta_Verano(1,30),-2));
            set(handles.C30_jul,'String',roundn(GdBeta_Verano(2,30),-2));
            set(handles.C30_ago,'String',roundn(GdBeta_Verano(3,30),-2));

            set(handles.C30_sep,'String',roundn(GdBeta_Otonio(1,30),-2));
            set(handles.C30_oct,'String',roundn(GdBeta_Otonio(2,30),-2));
            set(handles.C30_nov,'String',roundn(GdBeta_Otonio(3,30),-2));

            set(handles.C30_media,'String',roundn(mean(GdBetaTotal(:,30)),-2));


            %Mostrar valores para inclinación de 45º
            set(handles.C45_dic,'String',roundn(GdBeta_Invierno(1,45),-2));
            set(handles.C45_ene,'String',roundn(GdBeta_Invierno(2,45),-2));
            set(handles.C45_feb,'String',roundn(GdBeta_Invierno(3,45),-2));

            set(handles.C45_mar,'String',roundn(GdBeta_Primavera(1,45),-2));
            set(handles.C45_abr,'String',roundn(GdBeta_Primavera(2,45),-2));
            set(handles.C45_may,'String',roundn(GdBeta_Primavera(3,45),-2));

            set(handles.C45_jun,'String',roundn(GdBeta_Verano(1,45),-2));
            set(handles.C45_jul,'String',roundn(GdBeta_Verano(2,45),-2));
            set(handles.C45_ago,'String',roundn(GdBeta_Verano(3,45),-2));

            set(handles.C45_sep,'String',roundn(GdBeta_Otonio(1,45),-2));
            set(handles.C45_oct,'String',roundn(GdBeta_Otonio(2,45),-2));
            set(handles.C45_nov,'String',roundn(GdBeta_Otonio(3,45),-2));

            set(handles.C45_media,'String',roundn(mean(GdBetaTotal(:,45)),-2));


            %Mostrar valores para inclinación de 60º
            set(handles.C60_dic,'String',roundn(GdBeta_Invierno(1,60),-2));
            set(handles.C60_ene,'String',roundn(GdBeta_Invierno(2,60),-2));
            set(handles.C60_feb,'String',roundn(GdBeta_Invierno(3,60),-2));

            set(handles.C60_mar,'String',roundn(GdBeta_Primavera(1,60),-2));
            set(handles.C60_abr,'String',roundn(GdBeta_Primavera(2,60),-2));
            set(handles.C60_may,'String',roundn(GdBeta_Primavera(3,60),-2));

            set(handles.C60_jun,'String',roundn(GdBeta_Verano(1,60),-2));
            set(handles.C60_jul,'String',roundn(GdBeta_Verano(2,60),-2));
            set(handles.C60_ago,'String',roundn(GdBeta_Verano(3,60),-2));

            set(handles.C60_sep,'String',roundn(GdBeta_Otonio(1,60),-2));
            set(handles.C60_oct,'String',roundn(GdBeta_Otonio(2,60),-2));
            set(handles.C60_nov,'String',roundn(GdBeta_Otonio(3,60),-2));

            set(handles.C60_media,'String',roundn(mean(GdBetaTotal(:,60)),-2));


            %Mostrar valores para inclinación de 75º
            set(handles.C75_dic,'String',roundn(GdBeta_Invierno(1,75),-2));
            set(handles.C75_ene,'String',roundn(GdBeta_Invierno(2,75),-2));
            set(handles.C75_feb,'String',roundn(GdBeta_Invierno(3,75),-2));

            set(handles.C75_mar,'String',roundn(GdBeta_Primavera(1,75),-2));
            set(handles.C75_abr,'String',roundn(GdBeta_Primavera(2,75),-2));
            set(handles.C75_may,'String',roundn(GdBeta_Primavera(3,75),-2));

            set(handles.C75_jun,'String',roundn(GdBeta_Verano(1,75),-2));
            set(handles.C75_jul,'String',roundn(GdBeta_Verano(2,75),-2));
            set(handles.C75_ago,'String',roundn(GdBeta_Verano(3,75),-2));

            set(handles.C75_sep,'String',roundn(GdBeta_Otonio(1,75),-2));
            set(handles.C75_oct,'String',roundn(GdBeta_Otonio(2,75),-2));
            set(handles.C75_nov,'String',roundn(GdBeta_Otonio(3,75),-2));


            set(handles.C75_media,'String',roundn(mean(GdBetaTotal(:,75)),-2));

            %Mostrar valores para inclinación de 90º
            set(handles.C90_dic,'String',roundn(GdBeta_Invierno(1,90),-2));
            set(handles.C90_ene,'String',roundn(GdBeta_Invierno(2,90),-2));
            set(handles.C90_feb,'String',roundn(GdBeta_Invierno(3,90),-2));

            set(handles.C90_mar,'String',roundn(GdBeta_Primavera(1,90),-2));
            set(handles.C90_abr,'String',roundn(GdBeta_Primavera(2,90),-2));
            set(handles.C90_may,'String',roundn(GdBeta_Primavera(3,90),-2));

            set(handles.C90_jun,'String',roundn(GdBeta_Verano(1,90),-2));
            set(handles.C90_jul,'String',roundn(GdBeta_Verano(2,90),-2));
            set(handles.C90_ago,'String',roundn(GdBeta_Verano(3,90),-2));

            set(handles.C90_sep,'String',roundn(GdBeta_Otonio(1,90),-2));
            set(handles.C90_oct,'String',roundn(GdBeta_Otonio(2,90),-2));
            set(handles.C90_nov,'String',roundn(GdBeta_Otonio(3,90),-2));


            set(handles.C90_media,'String',roundn(mean(GdBetaTotal(:,90)),-2));


            %Inclinación óptima
            %Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
            %estación 

            RadiacionG_optima_Est = zeros(1,12);

            RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
            RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
            RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

            RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
            RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
            RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

            RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
            RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
            RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

            RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
            RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
            RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre


            %Ángulos óptimos
            set (handles.Ang_Opt_Inv,'String', angOptim_Inv);
            set(handles.Ang_Opt_Pri, 'String', angOptim_Pri);
            set (handles.Ang_Opt_Ver,'String', angOptim_Ver);
            set(handles.Ang_Opt_Oto, 'String', angOptim_Oto);

            set(handles.COptEst_dic,'String',roundn(RadiacionG_optima_Est(12),-2));
            set(handles.COptEst_ene,'String',roundn(RadiacionG_optima_Est(1),-2));
            set(handles.COptEst_feb,'String',roundn(RadiacionG_optima_Est(2),-2));
            set(handles.COptEst_mar,'String',roundn(RadiacionG_optima_Est(3),-2));
            set(handles.COptEst_abr,'String',roundn(RadiacionG_optima_Est(4),-2));
            set(handles.COptEst_may,'String',roundn(RadiacionG_optima_Est(5),-2));
            set(handles.COptEst_jun,'String',roundn(RadiacionG_optima_Est(6),-2));
            set(handles.COptEst_jul,'String',roundn(RadiacionG_optima_Est(7),-2));
            set(handles.COptEst_ago,'String',roundn(RadiacionG_optima_Est(8),-2));
            set(handles.COptEst_sep,'String',roundn(RadiacionG_optima_Est(9),-2));
            set(handles.COptEst_oct,'String',roundn(RadiacionG_optima_Est(10),-2));
            set(handles.COptEst_nov,'String',roundn(RadiacionG_optima_Est(11),-2));


            set(handles.COptEst_media,'String',roundn(mean(RadiacionG_optima_Est),-2));



        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Respecto al plano horizontal

            set(handles.CGanaEst_0_dic, 'String', roundn(PorGanaG_Est_0(12),-2));
            set(handles.CGanaEst_0_ene, 'String', roundn(PorGanaG_Est_0(1),-2));
            set(handles.CGanaEst_0_feb, 'String', roundn(PorGanaG_Est_0(2),-2));
            set(handles.CGanaEst_0_mar, 'String', roundn(PorGanaG_Est_0(3),-2));
            set(handles.CGanaEst_0_abr, 'String', roundn(PorGanaG_Est_0(4),-2));
            set(handles.CGanaEst_0_may, 'String', roundn(PorGanaG_Est_0(5),-2));
            set(handles.CGanaEst_0_jun, 'String', roundn(PorGanaG_Est_0(6),-2));
            set(handles.CGanaEst_0_jul, 'String', roundn(PorGanaG_Est_0(7),-2));
            set(handles.CGanaEst_0_ago, 'String', roundn(PorGanaG_Est_0(8),-2));
            set(handles.CGanaEst_0_sep, 'String', roundn(PorGanaG_Est_0(9),-2));
            set(handles.CGanaEst_0_oct, 'String', roundn(PorGanaG_Est_0(10),-2));
            set(handles.CGanaEst_0_nov, 'String', roundn(PorGanaG_Est_0(11),-2));


            set(handles.CGanaEst_0_media, 'String', roundn(mean(PorGanaG_Est_0),-2));

        %Porcentaje de ganancia
            set(handles.CGanaEst_Anu_ene, 'String', roundn(PorGanaG_Est_Anu(1),-2));
            set(handles.CGanaEst_Anu_feb, 'String', roundn(PorGanaG_Est_Anu(2),-2));
            set(handles.CGanaEst_Anu_mar, 'String', roundn(PorGanaG_Est_Anu(3),-2));
            set(handles.CGanaEst_Anu_abr, 'String', roundn(PorGanaG_Est_Anu(4),-2));
            set(handles.CGanaEst_Anu_may, 'String', roundn(PorGanaG_Est_Anu(5),-2));
            set(handles.CGanaEst_Anu_jun, 'String', roundn(PorGanaG_Est_Anu(6),-2));
            set(handles.CGanaEst_Anu_jul, 'String', roundn(PorGanaG_Est_Anu(7),-2));
            set(handles.CGanaEst_Anu_ago, 'String', roundn(PorGanaG_Est_Anu(8),-2));
            set(handles.CGanaEst_Anu_sep, 'String', roundn(PorGanaG_Est_Anu(9),-2));
            set(handles.CGanaEst_Anu_oct, 'String', roundn(PorGanaG_Est_Anu(10),-2));
            set(handles.CGanaEst_Anu_nov, 'String', roundn(PorGanaG_Est_Anu(11),-2));
            set(handles.CGanaEst_Anu_dic, 'String', roundn(PorGanaG_Est_Anu(12),-2));

            set(handles.CGanaEst_Anu_media, 'String', roundn(mean(PorGanaG_Est_Anu),-2));
        
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
        set(handles.Componente_Opt,'String','Bdm');

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
            set(handles.C15_dic,'String',roundn(BdBeta_Invierno(1,15),-2))
            set(handles.C15_ene,'String',roundn(BdBeta_Invierno(2,15),-2));
            set(handles.C15_feb,'String',roundn(BdBeta_Invierno(3,15),-2));

            set(handles.C15_mar,'String',roundn(BdBeta_Primavera(1,15),-2));
            set(handles.C15_abr,'String',roundn(BdBeta_Primavera(2,15),-2));
            set(handles.C15_may,'String',roundn(BdBeta_Primavera(3,15),-2));

            set(handles.C15_jun,'String',roundn(BdBeta_Verano(1,15),-2));
            set(handles.C15_jul,'String',roundn(BdBeta_Verano(2,15),-2));
            set(handles.C15_ago,'String',roundn(BdBeta_Verano(3,15),-2));

            set(handles.C15_sep,'String',roundn(BdBeta_Otonio(1,15),-2));
            set(handles.C15_oct,'String',roundn(BdBeta_Otonio(2,15),-2));
            set(handles.C15_nov,'String',roundn(BdBeta_Otonio(3,15),-2));


            set(handles.C15_media,'String',roundn(mean(BdBetaTotal(:,15)),-2));


            %Mostrar valores para inclinación de 30º
            set(handles.C30_dic,'String',roundn(BdBeta_Invierno(1,30),-2));
            set(handles.C30_ene,'String',roundn(BdBeta_Invierno(2,30),-2));
            set(handles.C30_feb,'String',roundn(BdBeta_Invierno(3,30),-2));

            set(handles.C30_mar,'String',roundn(BdBeta_Primavera(1,30),-2));
            set(handles.C30_abr,'String',roundn(BdBeta_Primavera(2,30),-2));
            set(handles.C30_may,'String',roundn(BdBeta_Primavera(3,30),-2));

            set(handles.C30_jun,'String',roundn(BdBeta_Verano(1,30),-2));
            set(handles.C30_jul,'String',roundn(BdBeta_Verano(2,30),-2));
            set(handles.C30_ago,'String',roundn(BdBeta_Verano(3,30),-2));

            set(handles.C30_sep,'String',roundn(BdBeta_Otonio(1,30),-2));
            set(handles.C30_oct,'String',roundn(BdBeta_Otonio(2,30),-2));
            set(handles.C30_nov,'String',roundn(BdBeta_Otonio(3,30),-2));

            set(handles.C30_media,'String',roundn(mean(BdBetaTotal(:,30)),-2));


            %Mostrar valores para inclinación de 45º
            set(handles.C45_dic,'String',roundn(BdBeta_Invierno(1,45),-2));
            set(handles.C45_ene,'String',roundn(BdBeta_Invierno(2,45),-2));
            set(handles.C45_feb,'String',roundn(BdBeta_Invierno(3,45),-2));

            set(handles.C45_mar,'String',roundn(BdBeta_Primavera(1,45),-2));
            set(handles.C45_abr,'String',roundn(BdBeta_Primavera(2,45),-2));
            set(handles.C45_may,'String',roundn(BdBeta_Primavera(3,45),-2));

            set(handles.C45_jun,'String',roundn(BdBeta_Verano(1,45),-2));
            set(handles.C45_jul,'String',roundn(BdBeta_Verano(2,45),-2));
            set(handles.C45_ago,'String',roundn(BdBeta_Verano(3,45),-2));

            set(handles.C45_sep,'String',roundn(BdBeta_Otonio(1,45),-2));
            set(handles.C45_oct,'String',roundn(BdBeta_Otonio(2,45),-2));
            set(handles.C45_nov,'String',roundn(BdBeta_Otonio(3,45),-2));

            set(handles.C45_media,'String',roundn(mean(BdBetaTotal(:,45)),-2));


            %Mostrar valores para inclinación de 60º
            set(handles.C60_dic,'String',roundn(BdBeta_Invierno(1,60),-2));
            set(handles.C60_ene,'String',roundn(BdBeta_Invierno(2,60),-2));
            set(handles.C60_feb,'String',roundn(BdBeta_Invierno(3,60),-2));

            set(handles.C60_mar,'String',roundn(BdBeta_Primavera(1,60),-2));
            set(handles.C60_abr,'String',roundn(BdBeta_Primavera(2,60),-2));
            set(handles.C60_may,'String',roundn(BdBeta_Primavera(3,60),-2));

            set(handles.C60_jun,'String',roundn(BdBeta_Verano(1,60),-2));
            set(handles.C60_jul,'String',roundn(BdBeta_Verano(2,60),-2));
            set(handles.C60_ago,'String',roundn(BdBeta_Verano(3,60),-2));

            set(handles.C60_sep,'String',roundn(BdBeta_Otonio(1,60),-2));
            set(handles.C60_oct,'String',roundn(BdBeta_Otonio(2,60),-2));
            set(handles.C60_nov,'String',roundn(BdBeta_Otonio(3,60),-2));

            set(handles.C60_media,'String',roundn(mean(BdBetaTotal(:,60)),-2));


            %Mostrar valores para inclinación de 75º
            set(handles.C75_dic,'String',roundn(BdBeta_Invierno(1,75),-2));
            set(handles.C75_ene,'String',roundn(BdBeta_Invierno(2,75),-2));
            set(handles.C75_feb,'String',roundn(BdBeta_Invierno(3,75),-2));

            set(handles.C75_mar,'String',roundn(BdBeta_Primavera(1,75),-2));
            set(handles.C75_abr,'String',roundn(BdBeta_Primavera(2,75),-2));
            set(handles.C75_may,'String',roundn(BdBeta_Primavera(3,75),-2));

            set(handles.C75_jun,'String',roundn(BdBeta_Verano(1,75),-2));
            set(handles.C75_jul,'String',roundn(BdBeta_Verano(2,75),-2));
            set(handles.C75_ago,'String',roundn(BdBeta_Verano(3,75),-2));

            set(handles.C75_sep,'String',roundn(BdBeta_Otonio(1,75),-2));
            set(handles.C75_oct,'String',roundn(BdBeta_Otonio(2,75),-2));
            set(handles.C75_nov,'String',roundn(BdBeta_Otonio(3,75),-2));


            set(handles.C75_media,'String',roundn(mean(BdBetaTotal(:,75)),-2));

            %Mostrar valores para inclinación de 90º
            set(handles.C90_dic,'String',roundn(BdBeta_Invierno(1,90),-2));
            set(handles.C90_ene,'String',roundn(BdBeta_Invierno(2,90),-2));
            set(handles.C90_feb,'String',roundn(BdBeta_Invierno(3,90),-2));

            set(handles.C90_mar,'String',roundn(BdBeta_Primavera(1,90),-2));
            set(handles.C90_abr,'String',roundn(BdBeta_Primavera(2,90),-2));
            set(handles.C90_may,'String',roundn(BdBeta_Primavera(3,90),-2));

            set(handles.C90_jun,'String',roundn(BdBeta_Verano(1,90),-2));
            set(handles.C90_jul,'String',roundn(BdBeta_Verano(2,90),-2));
            set(handles.C90_ago,'String',roundn(BdBeta_Verano(3,90),-2));

            set(handles.C90_sep,'String',roundn(BdBeta_Otonio(1,90),-2));
            set(handles.C90_oct,'String',roundn(BdBeta_Otonio(2,90),-2));
            set(handles.C90_nov,'String',roundn(BdBeta_Otonio(3,90),-2));


            set(handles.C90_media,'String',roundn(mean(BdBetaTotal(:,90)),-2));


            %Inclinación óptima
            %Rellenamos RadiacionB_optima_Est con los valores óptimos para cada
            %estación 

            RadiacionB_optima_Est = zeros(1,12);

            RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
            RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
            RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febero

            RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
            RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
            RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo

            RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
            RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
            RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

            RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
            RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
            RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre


            set(handles.COptEst_dic,'String',roundn(RadiacionB_optima_Est(12),-2));
            set(handles.COptEst_ene,'String',roundn(RadiacionB_optima_Est(1),-2));
            set(handles.COptEst_feb,'String',roundn(RadiacionB_optima_Est(2),-2));
            set(handles.COptEst_mar,'String',roundn(RadiacionB_optima_Est(3),-2));
            set(handles.COptEst_abr,'String',roundn(RadiacionB_optima_Est(4),-2));
            set(handles.COptEst_may,'String',roundn(RadiacionB_optima_Est(5),-2));
            set(handles.COptEst_jun,'String',roundn(RadiacionB_optima_Est(6),-2));
            set(handles.COptEst_jul,'String',roundn(RadiacionB_optima_Est(7),-2));
            set(handles.COptEst_ago,'String',roundn(RadiacionB_optima_Est(8),-2));
            set(handles.COptEst_sep,'String',roundn(RadiacionB_optima_Est(9),-2));
            set(handles.COptEst_oct,'String',roundn(RadiacionB_optima_Est(10),-2));
            set(handles.COptEst_nov,'String',roundn(RadiacionB_optima_Est(11),-2));


            set(handles.COptEst_media,'String',roundn(mean(RadiacionB_optima_Est),-2));

        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Respecto al plano horizontal

            set(handles.CGanaEst_0_dic, 'String', roundn(PorGanaB_Est_0(12),-2));
            set(handles.CGanaEst_0_ene, 'String', roundn(PorGanaB_Est_0(1),-2));
            set(handles.CGanaEst_0_feb, 'String', roundn(PorGanaB_Est_0(2),-2));
            set(handles.CGanaEst_0_mar, 'String', roundn(PorGanaB_Est_0(3),-2));
            set(handles.CGanaEst_0_abr, 'String', roundn(PorGanaB_Est_0(4),-2));
            set(handles.CGanaEst_0_may, 'String', roundn(PorGanaB_Est_0(5),-2));
            set(handles.CGanaEst_0_jun, 'String', roundn(PorGanaB_Est_0(6),-2));
            set(handles.CGanaEst_0_jul, 'String', roundn(PorGanaB_Est_0(7),-2));
            set(handles.CGanaEst_0_ago, 'String', roundn(PorGanaB_Est_0(8),-2));
            set(handles.CGanaEst_0_sep, 'String', roundn(PorGanaB_Est_0(9),-2));
            set(handles.CGanaEst_0_oct, 'String', roundn(PorGanaB_Est_0(10),-2));
            set(handles.CGanaEst_0_nov, 'String', roundn(PorGanaB_Est_0(11),-2));


            set(handles.CGanaEst_0_media, 'String', roundn(mean(PorGanaB_Est_0),-2));

        %Porcentaje de ganancia
            set(handles.CGanaEst_Anu_ene, 'String', roundn(PorGanaB_Est_Anu(1),-2));
            set(handles.CGanaEst_Anu_feb, 'String', roundn(PorGanaB_Est_Anu(2),-2));
            set(handles.CGanaEst_Anu_mar, 'String', roundn(PorGanaB_Est_Anu(3),-2));
            set(handles.CGanaEst_Anu_abr, 'String', roundn(PorGanaB_Est_Anu(4),-2));
            set(handles.CGanaEst_Anu_may, 'String', roundn(PorGanaB_Est_Anu(5),-2));
            set(handles.CGanaEst_Anu_jun, 'String', roundn(PorGanaB_Est_Anu(6),-2));
            set(handles.CGanaEst_Anu_jul, 'String', roundn(PorGanaB_Est_Anu(7),-2));
            set(handles.CGanaEst_Anu_ago, 'String', roundn(PorGanaB_Est_Anu(8),-2));
            set(handles.CGanaEst_Anu_sep, 'String', roundn(PorGanaB_Est_Anu(9),-2));
            set(handles.CGanaEst_Anu_oct, 'String', roundn(PorGanaB_Est_Anu(10),-2));
            set(handles.CGanaEst_Anu_nov, 'String', roundn(PorGanaB_Est_Anu(11),-2));
            set(handles.CGanaEst_Anu_dic, 'String', roundn(PorGanaB_Est_Anu(12),-2));

            set(handles.CGanaEst_Anu_media, 'String', roundn(mean(PorGanaB_Est_Anu),-2));
        
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
        set(handles.Componente_Opt,'String','Ddm');

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
            set(handles.C15_dic,'String',roundn(DdBeta_Invierno(1,15),-2))
            set(handles.C15_ene,'String',roundn(DdBeta_Invierno(2,15),-2));
            set(handles.C15_feb,'String',roundn(DdBeta_Invierno(3,15),-2));

            set(handles.C15_mar,'String',roundn(DdBeta_Primavera(1,15),-2));
            set(handles.C15_abr,'String',roundn(DdBeta_Primavera(2,15),-2));
            set(handles.C15_may,'String',roundn(DdBeta_Primavera(3,15),-2));

            set(handles.C15_jun,'String',roundn(DdBeta_Verano(1,15),-2));
            set(handles.C15_jul,'String',roundn(DdBeta_Verano(2,15),-2));
            set(handles.C15_ago,'String',roundn(DdBeta_Verano(3,15),-2));

            set(handles.C15_sep,'String',roundn(DdBeta_Otonio(1,15),-2));
            set(handles.C15_oct,'String',roundn(DdBeta_Otonio(2,15),-2));
            set(handles.C15_nov,'String',roundn(DdBeta_Otonio(3,15),-2));


            set(handles.C15_media,'String',roundn(mean(DdBetaTotal(:,15)),-2));


            %Mostrar valores para inclinación de 30º
            set(handles.C30_dic,'String',roundn(DdBeta_Invierno(1,30),-2));
            set(handles.C30_ene,'String',roundn(DdBeta_Invierno(2,30),-2));
            set(handles.C30_feb,'String',roundn(DdBeta_Invierno(3,30),-2));

            set(handles.C30_mar,'String',roundn(DdBeta_Invierno(1,30),-2));
            set(handles.C30_abr,'String',roundn(DdBeta_Invierno(2,30),-2));
            set(handles.C30_may,'String',roundn(DdBeta_Invierno(3,30),-2));

            set(handles.C30_jun,'String',roundn(DdBeta_Verano(1,30),-2));
            set(handles.C30_jul,'String',roundn(DdBeta_Verano(2,30),-2));
            set(handles.C30_ago,'String',roundn(DdBeta_Verano(3,30),-2));

            set(handles.C30_sep,'String',roundn(DdBeta_Otonio(1,30),-2));
            set(handles.C30_oct,'String',roundn(DdBeta_Otonio(2,30),-2));
            set(handles.C30_nov,'String',roundn(DdBeta_Otonio(3,30),-2));

            set(handles.C30_media,'String',roundn(mean(DdBetaTotal(:,30)),-2));


            %Mostrar valores para inclinación de 45º
            set(handles.C45_dic,'String',roundn(DdBeta_Invierno(1,45),-2));
            set(handles.C45_ene,'String',roundn(DdBeta_Invierno(2,45),-2));
            set(handles.C45_feb,'String',roundn(DdBeta_Invierno(3,45),-2));

            set(handles.C45_mar,'String',roundn(DdBeta_Primavera(1,45),-2));
            set(handles.C45_abr,'String',roundn(DdBeta_Primavera(2,45),-2));
            set(handles.C45_may,'String',roundn(DdBeta_Primavera(3,45),-2));

            set(handles.C45_jun,'String',roundn(DdBeta_Verano(1,45),-2));
            set(handles.C45_jul,'String',roundn(DdBeta_Verano(2,45),-2));
            set(handles.C45_ago,'String',roundn(DdBeta_Verano(3,45),-2));

            set(handles.C45_sep,'String',roundn(DdBeta_Otonio(1,45),-2));
            set(handles.C45_oct,'String',roundn(DdBeta_Otonio(2,45),-2));
            set(handles.C45_nov,'String',roundn(DdBeta_Otonio(3,45),-2));

            set(handles.C45_media,'String',roundn(mean(DdBetaTotal(:,45)),-2));


            %Mostrar valores para inclinación de 60º
            set(handles.C60_dic,'String',roundn(DdBeta_Invierno(1,60),-2));
            set(handles.C60_ene,'String',roundn(DdBeta_Invierno(2,60),-2));
            set(handles.C60_feb,'String',roundn(DdBeta_Invierno(3,60),-2));

            set(handles.C60_mar,'String',roundn(DdBeta_Primavera(1,60),-2));
            set(handles.C60_abr,'String',roundn(DdBeta_Primavera(2,60),-2));
            set(handles.C60_may,'String',roundn(DdBeta_Primavera(3,60),-2));

            set(handles.C60_jun,'String',roundn(DdBeta_Verano(1,60),-2));
            set(handles.C60_jul,'String',roundn(DdBeta_Verano(2,60),-2));
            set(handles.C60_ago,'String',roundn(DdBeta_Verano(3,60),-2));

            set(handles.C60_sep,'String',roundn(DdBeta_Otonio(1,60),-2));
            set(handles.C60_oct,'String',roundn(DdBeta_Otonio(2,60),-2));
            set(handles.C60_nov,'String',roundn(DdBeta_Otonio(3,60),-2));

            set(handles.C60_media,'String',roundn(mean(DdBetaTotal(:,60)),-2));


            %Mostrar valores para inclinación de 75º
            set(handles.C75_dic,'String',roundn(DdBeta_Invierno(1,75),-2));
            set(handles.C75_ene,'String',roundn(DdBeta_Invierno(2,75),-2));
            set(handles.C75_feb,'String',roundn(DdBeta_Invierno(3,75),-2));

            set(handles.C75_mar,'String',roundn(DdBeta_Primavera(1,75),-2));
            set(handles.C75_abr,'String',roundn(DdBeta_Primavera(2,75),-2));
            set(handles.C75_may,'String',roundn(DdBeta_Primavera(3,75),-2));

            set(handles.C75_jun,'String',roundn(DdBeta_Verano(1,75),-2));
            set(handles.C75_jul,'String',roundn(DdBeta_Verano(2,75),-2));
            set(handles.C75_ago,'String',roundn(DdBeta_Verano(3,75),-2));

            set(handles.C75_sep,'String',roundn(DdBeta_Otonio(1,75),-2));
            set(handles.C75_oct,'String',roundn(DdBeta_Otonio(2,75),-2));
            set(handles.C75_nov,'String',roundn(DdBeta_Otonio(3,75),-2));

            set(handles.C75_media,'String',roundn(mean(DdBetaTotal(:,75)),-2));

            %Mostrar valores para inclinación de 90º
            set(handles.C90_dic,'String',roundn(DdBeta_Invierno(1,90),-2));
            set(handles.C90_ene,'String',roundn(DdBeta_Invierno(2,90),-2));
            set(handles.C90_feb,'String',roundn(DdBeta_Invierno(3,90),-2));

            set(handles.C90_mar,'String',roundn(DdBeta_Primavera(1,90),-2));
            set(handles.C90_abr,'String',roundn(DdBeta_Primavera(2,90),-2));
            set(handles.C90_may,'String',roundn(DdBeta_Primavera(3,90),-2));
            
            set(handles.C90_jun,'String',roundn(DdBeta_Verano(1,90),-2));
            set(handles.C90_jul,'String',roundn(DdBeta_Verano(2,90),-2));
            set(handles.C90_ago,'String',roundn(DdBeta_Verano(3,90),-2));

            set(handles.C90_sep,'String',roundn(DdBeta_Otonio(1,90),-2));
            set(handles.C90_oct,'String',roundn(DdBeta_Otonio(2,90),-2));
            set(handles.C90_nov,'String',roundn(DdBeta_Otonio(3,90),-2));


            set(handles.C90_media,'String',roundn(mean(DdBetaTotal(:,90)),-2));


            %Inclinación óptima
            %Rellenamos RadiacionD_optima_Est con los valores óptimos para cada
            %estación 

            RadiacionD_optima_Est = zeros(1,12);

            RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
            RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
            RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero

            RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
            RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
            RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

            RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
            RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
            RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

            RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
            RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
            RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre


            set(handles.COptEst_dic,'String',roundn(RadiacionD_optima_Est(12),-2));
            set(handles.COptEst_ene,'String',roundn(RadiacionD_optima_Est(1),-2));
            set(handles.COptEst_feb,'String',roundn(RadiacionD_optima_Est(2),-2));
            set(handles.COptEst_mar,'String',roundn(RadiacionD_optima_Est(3),-2));
            set(handles.COptEst_abr,'String',roundn(RadiacionD_optima_Est(4),-2));
            set(handles.COptEst_may,'String',roundn(RadiacionD_optima_Est(5),-2));
            set(handles.COptEst_jun,'String',roundn(RadiacionD_optima_Est(6),-2));
            set(handles.COptEst_jul,'String',roundn(RadiacionD_optima_Est(7),-2));
            set(handles.COptEst_ago,'String',roundn(RadiacionD_optima_Est(8),-2));
            set(handles.COptEst_sep,'String',roundn(RadiacionD_optima_Est(9),-2));
            set(handles.COptEst_oct,'String',roundn(RadiacionD_optima_Est(10),-2));
            set(handles.COptEst_nov,'String',roundn(RadiacionD_optima_Est(11),-2));


            set(handles.COptEst_media,'String',roundn(mean(RadiacionD_optima_Est),-2));



        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Respecto al plano horizontal

            set(handles.CGanaEst_0_dic, 'String', roundn(PorGanaD_Est_0(12),-2));
            set(handles.CGanaEst_0_ene, 'String', roundn(PorGanaD_Est_0(1),-2));
            set(handles.CGanaEst_0_feb, 'String', roundn(PorGanaD_Est_0(2),-2));
            set(handles.CGanaEst_0_mar, 'String', roundn(PorGanaD_Est_0(3),-2));
            set(handles.CGanaEst_0_abr, 'String', roundn(PorGanaD_Est_0(4),-2));
            set(handles.CGanaEst_0_may, 'String', roundn(PorGanaD_Est_0(5),-2));
            set(handles.CGanaEst_0_jun, 'String', roundn(PorGanaD_Est_0(6),-2));
            set(handles.CGanaEst_0_jul, 'String', roundn(PorGanaD_Est_0(7),-2));
            set(handles.CGanaEst_0_ago, 'String', roundn(PorGanaD_Est_0(8),-2));
            set(handles.CGanaEst_0_sep, 'String', roundn(PorGanaD_Est_0(9),-2));
            set(handles.CGanaEst_0_oct, 'String', roundn(PorGanaD_Est_0(10),-2));
            set(handles.CGanaEst_0_nov, 'String', roundn(PorGanaD_Est_0(11),-2));


            set(handles.CGanaEst_0_media, 'String', roundn(mean(PorGanaD_Est_0),-2));

        %Porcentaje de ganancia
            set(handles.CGanaEst_Anu_ene, 'String', roundn(PorGanaD_Est_Anu(1),-2));
            set(handles.CGanaEst_Anu_feb, 'String', roundn(PorGanaD_Est_Anu(2),-2));
            set(handles.CGanaEst_Anu_mar, 'String', roundn(PorGanaD_Est_Anu(3),-2));
            set(handles.CGanaEst_Anu_abr, 'String', roundn(PorGanaD_Est_Anu(4),-2));
            set(handles.CGanaEst_Anu_may, 'String', roundn(PorGanaD_Est_Anu(5),-2));
            set(handles.CGanaEst_Anu_jun, 'String', roundn(PorGanaD_Est_Anu(6),-2));
            set(handles.CGanaEst_Anu_jul, 'String', roundn(PorGanaD_Est_Anu(7),-2));
            set(handles.CGanaEst_Anu_ago, 'String', roundn(PorGanaD_Est_Anu(8),-2));
            set(handles.CGanaEst_Anu_sep, 'String', roundn(PorGanaD_Est_Anu(9),-2));
            set(handles.CGanaEst_Anu_oct, 'String', roundn(PorGanaD_Est_Anu(10),-2));
            set(handles.CGanaEst_Anu_nov, 'String', roundn(PorGanaD_Est_Anu(11),-2));
            set(handles.CGanaEst_Anu_dic, 'String', roundn(PorGanaD_Est_Anu(12),-2));

            set(handles.CGanaEst_Anu_media, 'String', roundn(mean(PorGanaD_Est_Anu),-2));

    case 4 %Albedo  
        
        OPCION_COMP=4;
        
        warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_15,'String','Rdm (15 º)');
        set(handles.Componente_30,'String','Rdm (30 º)');
        set(handles.Componente_45,'String','Rdm (45 º)');
        set(handles.Componente_60,'String','Rdm (60 º)');
        set(handles.Componente_75,'String','Rdm (75 º)');
        set(handles.Componente_90,'String','Rdm (90 º)');
        set(handles.Componente_Opt,'String','Rdm');


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
            set(handles.C15_dic,'String',roundn(RdBeta_Invierno(1,15),-2))
            set(handles.C15_ene,'String',roundn(RdBeta_Invierno(2,15),-2));
            set(handles.C15_feb,'String',roundn(RdBeta_Invierno(3,15),-2));

            set(handles.C15_mar,'String',roundn(RdBeta_Primavera(1,15),-2));
            set(handles.C15_abr,'String',roundn(RdBeta_Primavera(2,15),-2));
            set(handles.C15_may,'String',roundn(RdBeta_Primavera(3,15),-2));

            set(handles.C15_jun,'String',roundn(RdBeta_Verano(1,15),-2));
            set(handles.C15_jul,'String',roundn(RdBeta_Verano(2,15),-2));
            set(handles.C15_ago,'String',roundn(RdBeta_Verano(3,15),-2));

            set(handles.C15_sep,'String',roundn(RdBeta_Otonio(1,15),-2));
            set(handles.C15_oct,'String',roundn(RdBeta_Otonio(2,15),-2));
            set(handles.C15_nov,'String',roundn(RdBeta_Otonio(3,15),-2));


            set(handles.C15_media,'String',roundn(mean(RdBetaTotal(:,15)),-2));


            %Mostrar valores para inclinación de 30º
            set(handles.C30_dic,'String',roundn(RdBeta_Invierno(1,30),-2));
            set(handles.C30_ene,'String',roundn(RdBeta_Invierno(2,30),-2));
            set(handles.C30_feb,'String',roundn(RdBeta_Invierno(3,30),-2));

            set(handles.C30_mar,'String',roundn(RdBeta_Invierno(1,30),-2));
            set(handles.C30_abr,'String',roundn(RdBeta_Invierno(2,30),-2));
            set(handles.C30_may,'String',roundn(RdBeta_Invierno(3,30),-2));

            set(handles.C30_jun,'String',roundn(RdBeta_Verano(1,30),-2));
            set(handles.C30_jul,'String',roundn(RdBeta_Verano(2,30),-2));
            set(handles.C30_ago,'String',roundn(RdBeta_Verano(3,30),-2));

            set(handles.C30_sep,'String',roundn(RdBeta_Otonio(1,30),-2));
            set(handles.C30_oct,'String',roundn(RdBeta_Otonio(2,30),-2));
            set(handles.C30_nov,'String',roundn(RdBeta_Otonio(3,30),-2));

            set(handles.C30_media,'String',roundn(mean(RdBetaTotal(:,30)),-2));


            %Mostrar valores para inclinación de 45º
            set(handles.C45_dic,'String',roundn(RdBeta_Invierno(1,45),-2));
            set(handles.C45_ene,'String',roundn(RdBeta_Invierno(2,45),-2));
            set(handles.C45_feb,'String',roundn(RdBeta_Invierno(3,45),-2));

            set(handles.C45_mar,'String',roundn(RdBeta_Primavera(1,45),-2));
            set(handles.C45_abr,'String',roundn(RdBeta_Primavera(2,45),-2));
            set(handles.C45_may,'String',roundn(RdBeta_Primavera(3,45),-2));

            set(handles.C45_jun,'String',roundn(RdBeta_Verano(1,45),-2));
            set(handles.C45_jul,'String',roundn(RdBeta_Verano(2,45),-2));
            set(handles.C45_ago,'String',roundn(RdBeta_Verano(3,45),-2));

            set(handles.C45_sep,'String',roundn(RdBeta_Otonio(1,45),-2));
            set(handles.C45_oct,'String',roundn(RdBeta_Otonio(2,45),-2));
            set(handles.C45_nov,'String',roundn(RdBeta_Otonio(3,45),-2));

            set(handles.C45_media,'String',roundn(mean(RdBetaTotal(:,45)),-2));


            %Mostrar valores para inclinación de 60º
            set(handles.C60_dic,'String',roundn(RdBeta_Invierno(1,60),-2));
            set(handles.C60_ene,'String',roundn(RdBeta_Invierno(2,60),-2));
            set(handles.C60_feb,'String',roundn(RdBeta_Invierno(3,60),-2));

            set(handles.C60_mar,'String',roundn(RdBeta_Primavera(1,60),-2));
            set(handles.C60_abr,'String',roundn(RdBeta_Primavera(2,60),-2));
            set(handles.C60_may,'String',roundn(RdBeta_Primavera(3,60),-2));

            set(handles.C60_jun,'String',roundn(RdBeta_Verano(1,60),-2));
            set(handles.C60_jul,'String',roundn(RdBeta_Verano(2,60),-2));
            set(handles.C60_ago,'String',roundn(RdBeta_Verano(3,60),-2));

            set(handles.C60_sep,'String',roundn(RdBeta_Otonio(1,60),-2));
            set(handles.C60_oct,'String',roundn(RdBeta_Otonio(2,60),-2));
            set(handles.C60_nov,'String',roundn(RdBeta_Otonio(3,60),-2));

            set(handles.C60_media,'String',roundn(mean(RdBetaTotal(:,60)),-2));


            %Mostrar valores para inclinación de 75º
            set(handles.C75_dic,'String',roundn(RdBeta_Invierno(1,75),-2));
            set(handles.C75_ene,'String',roundn(RdBeta_Invierno(2,75),-2));
            set(handles.C75_feb,'String',roundn(RdBeta_Invierno(3,75),-2));

            set(handles.C75_mar,'String',roundn(RdBeta_Primavera(1,75),-2));
            set(handles.C75_abr,'String',roundn(RdBeta_Primavera(2,75),-2));
            set(handles.C75_may,'String',roundn(RdBeta_Primavera(3,75),-2));

            set(handles.C75_jun,'String',roundn(RdBeta_Verano(1,75),-2));
            set(handles.C75_jul,'String',roundn(RdBeta_Verano(2,75),-2));
            set(handles.C75_ago,'String',roundn(RdBeta_Verano(3,75),-2));

            set(handles.C75_sep,'String',roundn(RdBeta_Otonio(1,75),-2));
            set(handles.C75_oct,'String',roundn(RdBeta_Otonio(2,75),-2));
            set(handles.C75_nov,'String',roundn(RdBeta_Otonio(3,75),-2));

            set(handles.C75_media,'String',roundn(mean(RdBetaTotal(:,75)),-2));

            %Mostrar valores para inclinación de 90º
            set(handles.C90_dic,'String',roundn(RdBeta_Invierno(1,90),-2));
            set(handles.C90_ene,'String',roundn(RdBeta_Invierno(2,90),-2));
            set(handles.C90_feb,'String',roundn(RdBeta_Invierno(3,90),-2));

            set(handles.C90_mar,'String',roundn(RdBeta_Primavera(1,90),-2));
            set(handles.C90_abr,'String',roundn(RdBeta_Primavera(2,90),-2));
            set(handles.C90_may,'String',roundn(RdBeta_Primavera(3,90),-2));
            
            set(handles.C90_jun,'String',roundn(RdBeta_Verano(1,90),-2));
            set(handles.C90_jul,'String',roundn(RdBeta_Verano(2,90),-2));
            set(handles.C90_ago,'String',roundn(RdBeta_Verano(3,90),-2));

            set(handles.C90_sep,'String',roundn(RdBeta_Otonio(1,90),-2));
            set(handles.C90_oct,'String',roundn(RdBeta_Otonio(2,90),-2));
            set(handles.C90_nov,'String',roundn(RdBeta_Otonio(3,90),-2));


            set(handles.C90_media,'String',roundn(mean(RdBetaTotal(:,90)),-2));


            %Inclinación óptima
            %Rellenamos RadiacionD_optima_Est con los valores óptimos para cada
            %estación 

            RadiacionR_optima_Est = zeros(1,12);

            RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
            RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
            RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febero

            RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
            RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
            RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

            RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
            RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
            RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

            RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
            RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
            RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre


            set(handles.COptEst_dic,'String',roundn(RadiacionR_optima_Est(12),-2));
            set(handles.COptEst_ene,'String',roundn(RadiacionR_optima_Est(1),-2));
            set(handles.COptEst_feb,'String',roundn(RadiacionR_optima_Est(2),-2));
            set(handles.COptEst_mar,'String',roundn(RadiacionR_optima_Est(3),-2));
            set(handles.COptEst_abr,'String',roundn(RadiacionR_optima_Est(4),-2));
            set(handles.COptEst_may,'String',roundn(RadiacionR_optima_Est(5),-2));
            set(handles.COptEst_jun,'String',roundn(RadiacionR_optima_Est(6),-2));
            set(handles.COptEst_jul,'String',roundn(RadiacionR_optima_Est(7),-2));
            set(handles.COptEst_ago,'String',roundn(RadiacionR_optima_Est(8),-2));
            set(handles.COptEst_sep,'String',roundn(RadiacionR_optima_Est(9),-2));
            set(handles.COptEst_oct,'String',roundn(RadiacionR_optima_Est(10),-2));
            set(handles.COptEst_nov,'String',roundn(RadiacionR_optima_Est(11),-2));


            set(handles.COptEst_media,'String',roundn(mean(RadiacionR_optima_Est),-2));



        %GANANCIAS:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %Respecto al plano horizontal

            set(handles.CGanaEst_0_dic, 'String', '-');
            set(handles.CGanaEst_0_ene, 'String', '-');
            set(handles.CGanaEst_0_feb, 'String', '-');
            set(handles.CGanaEst_0_mar, 'String', '-');
            set(handles.CGanaEst_0_abr, 'String', '-');
            set(handles.CGanaEst_0_may, 'String', '-');
            set(handles.CGanaEst_0_jun, 'String', '-');
            set(handles.CGanaEst_0_jul, 'String', '-');
            set(handles.CGanaEst_0_ago, 'String', '-');
            set(handles.CGanaEst_0_sep, 'String', '-');
            set(handles.CGanaEst_0_oct, 'String', '-');
            set(handles.CGanaEst_0_nov, 'String', '-');


            set(handles.CGanaEst_0_media, 'String', '-');

        %Respecto a la inclinación óptima anual
        
        if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
            
            set(handles.CGanaEst_Anu_ene, 'String','-');
            set(handles.CGanaEst_Anu_feb, 'String','-');
            set(handles.CGanaEst_Anu_mar, 'String','-');
            set(handles.CGanaEst_Anu_abr, 'String','-');
            set(handles.CGanaEst_Anu_may, 'String','-');
            set(handles.CGanaEst_Anu_jun, 'String','-');
            set(handles.CGanaEst_Anu_jul, 'String','-');
            set(handles.CGanaEst_Anu_ago, 'String','-');
            set(handles.CGanaEst_Anu_sep, 'String','-');
            set(handles.CGanaEst_Anu_oct, 'String','-');
            set(handles.CGanaEst_Anu_nov, 'String','-');
            set(handles.CGanaEst_Anu_dic, 'String','-');

            set(handles.CGanaEst_Anu_media, 'String','-');
        
        else %Cualquier otro valor, hará que Rdm(0º) != 0
            set(handles.CGanaEst_Anu_ene, 'String', roundn(PorGanaR_Est_Anu(1),-2));
            set(handles.CGanaEst_Anu_feb, 'String', roundn(PorGanaR_Est_Anu(2),-2));
            set(handles.CGanaEst_Anu_mar, 'String', roundn(PorGanaR_Est_Anu(3),-2));
            set(handles.CGanaEst_Anu_abr, 'String', roundn(PorGanaR_Est_Anu(4),-2));
            set(handles.CGanaEst_Anu_may, 'String', roundn(PorGanaR_Est_Anu(5),-2));
            set(handles.CGanaEst_Anu_jun, 'String', roundn(PorGanaR_Est_Anu(6),-2));
            set(handles.CGanaEst_Anu_jul, 'String', roundn(PorGanaR_Est_Anu(7),-2));
            set(handles.CGanaEst_Anu_ago, 'String', roundn(PorGanaR_Est_Anu(8),-2));
            set(handles.CGanaEst_Anu_sep, 'String', roundn(PorGanaR_Est_Anu(9),-2));
            set(handles.CGanaEst_Anu_oct, 'String', roundn(PorGanaR_Est_Anu(10),-2));
            set(handles.CGanaEst_Anu_nov, 'String', roundn(PorGanaR_Est_Anu(11),-2));
            set(handles.CGanaEst_Anu_dic, 'String', roundn(PorGanaR_Est_Anu(12),-2));

            set(handles.CGanaEst_Anu_media, 'String', roundn(mean(PorGanaR_Est_Anu),-2));   
            
        end
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
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;
%Global
global DATOS GdBetaTotal;
global GdBeta_Invierno GdOpt_Inv GdBeta_Primavera GdOpt_Pri GdBeta_Verano GdOpt_Ver GdBeta_Otonio GdOpt_Oto;
global Med_GdOpt_Inv Med_GdOpt_Pri Med_GdOpt_Ver Med_GdOpt_Oto;
global GanaG_Est_0 GanaG_Est_Anu PorGanaG_Est_0 PorGanaG_Est_Anu;
%Directa
global Val_Bdm0 BdBetaTotal;
global BdBeta_Invierno BdOpt_Inv  BdBeta_Primavera BdOpt_Pri  BdBeta_Verano BdOpt_Ver  BdBeta_Otonio BdOpt_Oto;
global Med_BdOpt_Inv Med_BdOpt_Pri Med_BdOpt_Ver Med_BdOpt_Oto;
global GanaB_Est_0 GanaB_Est_Anu PorGanaB_Est_0 PorGanaB_Est_Anu;
%Difusa
global Val_Ddm0 DdBetaTotal;
global DdBeta_Invierno DdOpt_Inv  DdBeta_Primavera DdOpt_Pri  DdBeta_Verano DdOpt_Ver  DdBeta_Otonio DdOpt_Oto;
global Med_DdOpt_Inv Med_DdOpt_Pri Med_DdOpt_Ver Med_DdOpt_Oto;
global GanaD_Est_0 GanaD_Est_Anu PorGanaD_Est_0 PorGanaD_Est_Anu;
%Albedo
global RdBetaTotal;
global RdBeta_Invierno RdOpt_Inv  RdBeta_Primavera RdOpt_Pri  RdBeta_Verano RdOpt_Ver  RdBeta_Otonio RdOpt_Oto;
global Med_RdOpt_Inv Med_RdOpt_Pri Med_RdOpt_Ver Med_RdOpt_Oto;
global GanaR_Est_Anu  PorGanaR_Est_Anu;
%ERROR GanaR_Est_0 PorGanaR_Est_0

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

Estacion = {'Invierno';'Primavera';'Verano';'Otoño'};


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

                    escribirG(1,5)={'Inclinación óptima estacional'};

                    escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};

                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirG(4,i+2) = GradosG(i);
                    end

                    %INVIERNO..........................................................
                    %Meses
                    escribirG(6,1) = Estacion(1);
                    escribirG(5,2)= Meses(12);
                    escribirG(6,2)= Meses(1);
                    escribirG(7,2)= Meses(2);
                    escribirG(8,2)= {'MEDIA(Inv)'};       

                    %Valores Gdm(0º)-------------------------------
                    escribirG(5,3)= {DATOS(14)};
                    escribirG(6,3)= {DATOS(3)};
                    escribirG(7,3)= {DATOS(4)};
                    %Media invierno
                        cont1 = DATOS(14);
                        for i=3:4
                            cont1=cont1+DATOS(i);
                        end
                        media_Inv_0 = cont1/3;

                    escribirG(8,3)= {media_Inv_0};

                    %Valores Gdm(1º) a Gdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirG(i+4,j+3)= {GdBeta_Invierno(i,j)};

                        end  
                    end
                    %Media Invierno
                       media_Inv = zeros(1,90);
                       suma = 0;
                       for i=1:90
                           for j= 1:3

                               suma = suma + GdBeta_Invierno(j,i);

                           end
                           media_Inv(i) = suma /3;
                           suma = 0;
                       end
                    for a=1:90
                        escribirG(8,a+3)= {media_Inv(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirG(30,1)= Estacion(1);
                    escribirG(29,3) = Meses(12);
                    escribirG(30,3) = Meses(1);
                    escribirG(31,3) = Meses(2);
                    escribirG(32,3) = {'MEDIA(Inv)'};
                    escribirG(30,2) = {angOptim_Inv};

                    for i=1:3
                        escribirG(i+28,4)={GdOpt_Inv(i)};
                    end
                    escribirG(32,4)= {Med_GdOpt_Inv};


                    %PRIMAVERA.........................................................
                    escribirG(11,1) = Estacion(2);
                    escribirG(10,2)= Meses(3);
                    escribirG(11,2)= Meses(4);
                    escribirG(12,2)= Meses(5);
                    escribirG(13,2)= {'MEDIA(Pri)'};

                    %Valores Gdm(0º)-------------------------------
                    escribirG(10,3)= {DATOS(5)};
                    escribirG(11,3)= {DATOS(6)};
                    escribirG(12,3)= {DATOS(7)};
                    %Media primavera
                        cont2 = 0;
                        for i=5:7
                            cont2=cont2+DATOS(i);
                        end
                        media_Pri_0 = cont2/3;
                        cont2 = 0;

                    escribirG(13,3)= {media_Pri_0};

                    %Valores Gdm(1º) a Gdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirG(i+9,j+3)= {GdBeta_Primavera(i,j)};

                        end  
                    end
                    %Media primavera
                       media_Pri = zeros(1,90);
                       suma2 = 0;
                       for i=1:90
                           for j= 1:3

                               suma2 = suma2 + GdBeta_Primavera(j,i);

                           end
                           media_Pri(i) = suma2 /3;
                           suma2 = 0;

                       end
                    for a=1:90
                        escribirG(13,a+3)= {media_Pri(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirG(35,1) = Estacion(2);
                    escribirG(34,3) = Meses(3);
                    escribirG(35,3) = Meses(4);
                    escribirG(36,3) = Meses(5);
                    escribirG(37,3) = {'MEDIA(Pri)'};
                    escribirG(35,2) = {angOptim_Pri};

                    for i=1:3
                        escribirG(i+33,4)={GdOpt_Pri(i)};
                    end
                    escribirG(37,4)= {Med_GdOpt_Pri};


                    %VERANO............................................................
                    escribirG(16,1) = Estacion(3);
                    escribirG(15,2)= Meses(6);
                    escribirG(16,2)= Meses(7);
                    escribirG(17,2)= Meses(8);
                    escribirG(18,2)= {'MEDIA(Ver)'};

                    %Valores Gdm(0º)-------------------------------
                    escribirG(15,3)= {DATOS(8)};
                    escribirG(16,3)= {DATOS(9)};
                    escribirG(17,3)= {DATOS(10)};
                    %Media Verano
                        cont3 = 0;
                        for i=8:10
                            cont3=cont3+DATOS(i);
                        end
                        media_Ver_0 = cont3/3;
                        cont3 = 0;

                    escribirG(18,3)= {media_Ver_0};

                    %Valores Gdm(1º) a Gdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirG(i+14,j+3)= {GdBeta_Verano(i,j)};

                        end  
                    end
                    %Media Verano
                       media_Ver = zeros(1,90);
                       suma3 = 0;
                       for i=1:90
                           for j= 1:3

                               suma3 = suma3 + GdBeta_Verano(j,i);

                           end
                           media_Ver(i) = suma3 /3;
                           suma3 = 0;

                       end
                    for a=1:90
                        escribirG(18,a+3)= {media_Ver(a)};
                    end     

                    %Valores ÓPTIMOS--------------------------------
                    escribirG(40,1) = Estacion(3);
                    escribirG(39,3) = Meses(6);
                    escribirG(40,3) = Meses(7);
                    escribirG(41,3) = Meses(8);
                    escribirG(42,3) = {'MEDIA(Ver)'};
                    escribirG(40,2) = {angOptim_Ver};

                    for i=1:3
                        escribirG(i+38,4)={GdOpt_Ver(i)};
                    end
                    escribirG(42,4)= {Med_GdOpt_Ver};


                    %OTOÑO.............................................................
                    escribirG(21,1) = Estacion(4);
                    escribirG(20,2)= Meses(9);
                    escribirG(21,2)= Meses(10);
                    escribirG(22,2)= Meses(11);
                    escribirG(23,2)= {'MEDIA(Oto)'};

                    %Valores Gdm(0º)-------------------------------
                    escribirG(20,3)= {DATOS(11)};
                    escribirG(21,3)= {DATOS(12)};
                    escribirG(22,3)= {DATOS(13)};
                    %Media Otoño
                        cont4 = 0;
                        for i=11:13
                            cont4=cont4+DATOS(i);
                        end
                        media_Oto_0 = cont4/3;
                        cont4 = 0;

                    escribirG(23,3)= {media_Oto_0};

                    %Valores Gdm(1º) a Gdm(90º)---------------------
                     for i=1:3
                        for j=1:90

                            escribirG(i+19,j+3)= {GdBeta_Otonio(i,j)};

                        end  
                    end
                    %Media Otoño
                       media_Oto = zeros(1,90);
                       suma4 = 0;
                       for i=1:90
                           for j= 1:3

                               suma4 = suma4 + GdBeta_Otonio(j,i);

                           end
                           media_Oto(i) = suma4 /3;
                           suma4 = 0;

                       end
                    for a=1:90
                        escribirG(23,a+3)= {media_Oto(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirG(45,1) = Estacion(4);
                    escribirG(44,3) = Meses(9);
                    escribirG(45,3) = Meses(10);
                    escribirG(46,3) = Meses(11);
                    escribirG(47,3) = {'MEDIA(Oto)'};
                    escribirG(45,2) = {angOptim_Oto};

                    for i=1:3
                        escribirG(i+43,4)={GdOpt_Oto(i)};
                    end
                    escribirG(47,4)= {Med_GdOpt_Oto};
                    %COMÚN.............................................................
                    %Media Anual de Todas las inclinaciones
                    escribirG(25,2) = {'MED.ANUAL'};
                        sum = 0;
                           for i=3:14
                              sum = sum + DATOS(i);
                           end

                        media0 = sum/12;

                    escribirG(25,3) = {media0};

                    media_Gd = zeros(1,90);
                    c = 0;

                        for m=1:90
                            for n=1:12

                                c = c + GdBetaTotal(n,m);
                            end

                            media_Gd(m)= c/12;

                            c=0;
                        end

                    for j=1:90
                        escribirG(25,j+3) = {media_Gd(j)};
                    end

                    escribirG(27,2) = {'RADIACIÓN GLOBAL A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
                    escribirG(28,2) = {'Áng.Óptimo'};
                    escribirG(28,4) = {'Gdm(Ópt.Est)'};


                    %RESUMEN----------------------------------
                    escribirG(49,1) = {'RESUMEN'};

                    %TÍTULOS
                    escribirG(51,2) = {'Gdm(Ópt)'};
                    

                    %Meses 
                    for i=1:13
                        escribirG(i+51,1)= Meses(i);
                    end

                    %Gdm óptimo total
                        %Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
                        %estación 
                        RadiacionG_optima_Est = zeros(1,12);

                        RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
                        RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
                        RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

                        RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
                        RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
                        RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

                        RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
                        RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
                        RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

                        RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
                        RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
                        RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre

                    for i=1:12
                       escribirG (i+51,2)={RadiacionG_optima_Est(i)};
                    end
                    %Media 
                    escribirG(64,2)={mean(RadiacionG_optima_Est)};

                    %Temperaturas
                    if (DATOS(15)==1000)

                    else 
                        escribirG(51,3)={'Temp.(ºC)'};
                        for i=1:12
                            escribirG(i+51,3)={DATOS(i+14)};
                        end
                        %Media de las temperaturas 
                              sumT = 0;
                              for i=15:26
                                 sumT = sumT + DATOS(i);
                              end

                                 mediaT = sumT/12;

                        escribirG(64,3) = {mediaT};
                    end

                    %GANANCIAS----------------------------------
                    %Títulos
                    escribirG(49,5)={'GANANCIAS'};
                    escribirG(49,6)={'Respecto a:'};

                    escribirG(50,6)={'Plano horizontal'};
                    escribirG(50,8)={'Inclinación óptima anual'};

                    escribirG(51,6)={'Fc.Ganancia'};
                    escribirG(51,7)={'Ganancia(%)'};
                    escribirG(51,8)={'Fc.Ganancia'};
                    escribirG(51,9)={'Ganancia(%)'};

                    %Ganancia respecto al plano horizontal
                    for i=1:12
                        escribirG(i+51,6)={GanaG_Est_0(i)};
                    end


                    for i=1:12
                        escribirG(i+51,7)={PorGanaG_Est_0(i)};
                    end
                    %Medias
                    escribirG(64,6)={mean(GanaG_Est_0)};
                    escribirG(64,7)={mean(PorGanaG_Est_0)};

                    %Ganancia respecto a la inclinación óptima anual
                    for i=1:12
                        escribirG(i+51,8)={GanaG_Est_Anu(i)};
                    end


                    for i=1:12
                        escribirG(i+51,9)={PorGanaG_Est_Anu(i)};
                    end
                    %Medias
                    escribirG(64,8)={mean(GanaG_Est_Anu)};
                    escribirG(64,9)={mean(PorGanaG_Est_Anu)};
                        
                
                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
                
            case 2 %Directa
                %RADIACIÓN DIRECTA DIARIA:::::::::::::::::::::::::::::::::::::::::::
                    %Cabecera----------------------------------------------------------
                    escribirB(1,1) = NOMBRE_CIUDAD;
                    escribirB(1,2)={'Latitud'};
                    escribirB(1,3)={DATOS(2)};

                    escribirB(1,5)={'Inclinación óptima estacional'};

                    escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};

                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirB(4,i+2) = GradosB(i);
                    end

                    %INVIERNO..........................................................
                    %Meses
                    escribirB(6,1) = Estacion(1);
                    escribirB(5,2)= Meses(12);
                    escribirB(6,2)= Meses(1);
                    escribirB(7,2)= Meses(2);
                    escribirB(8,2)= {'MEDIA(Inv)'};       

                    %Valores Bdm(0º)-------------------------------
                    escribirB(5,3)= {Val_Bdm0(12)};
                    escribirB(6,3)= {Val_Bdm0(1)};
                    escribirB(7,3)= {Val_Bdm0(2)};
                    %Media invierno
                            contB1 = Val_Bdm0(12);
                            for i=1:2
                                contB1=contB1 + Val_Bdm0(i);
                            end
                            mediaBd_Inv_0 = contB1/3;

                    escribirB(8,3)= {mediaBd_Inv_0};

                    %Valores Bdm(1º) a Bdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirB(i+4,j+3)= {BdBeta_Invierno(i,j)};

                        end  
                    end
                    %Media Invierno
                       mediaBd_Inv = zeros(1,90);
                       suma = 0;
                       for i=1:90
                           for j= 1:3

                               suma = suma + BdBeta_Invierno(j,i);

                           end
                           mediaBd_Inv(i) = suma /3;
                           suma = 0;
                       end
                    for a=1:90
                        escribirB(8,a+3)= {mediaBd_Inv(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirB(30,1)= Estacion(1);
                    escribirB(29,3) = Meses(12);
                    escribirB(30,3) = Meses(1);
                    escribirB(31,3) = Meses(2);
                    escribirB(32,3) = {'MEDIA(Inv)'};
                    escribirB(30,2) = {angOptim_Inv};

                    for i=1:3
                        escribirB(i+28,4)={BdOpt_Inv(i)};
                    end
                    escribirB(32,4)= {Med_BdOpt_Inv};


                    %PRIMAVERA.........................................................
                    escribirB(11,1) = Estacion(2);
                    escribirB(10,2)= Meses(3);
                    escribirB(11,2)= Meses(4);
                    escribirB(12,2)= Meses(5);
                    escribirB(13,2)= {'MEDIA(Pri)'};

                    %Valores Bdm(0º)-------------------------------
                    escribirB(10,3)= {Val_Bdm0(3)};
                    escribirB(11,3)= {Val_Bdm0(4)};
                    escribirB(12,3)= {Val_Bdm0(5)};
                    %Media primavera
                        contB2 = 0;
                        for i=3:5
                            contB2=contB2 + Val_Bdm0(i);
                        end
                        mediaBd_Pri_0 = contB2/3;
                        contB2 = 0;

                    escribirB(13,3)= {mediaBd_Pri_0};

                    %Valores Bdm(1º) a Bdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirB(i+9,j+3)= {BdBeta_Primavera(i,j)};

                        end  
                    end
                    %Media primavera
                       mediaBd_Pri = zeros(1,90);
                       suma2 = 0;
                       for i=1:90
                           for j= 1:3

                               suma2 = suma2 + BdBeta_Primavera(j,i);

                           end
                           mediaBd_Pri(i) = suma2 /3;
                           suma2 = 0;

                       end
                    for a=1:90
                        escribirB(13,a+3)= {mediaBd_Pri(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirB(35,1) = Estacion(2);
                    escribirB(34,3) = Meses(3);
                    escribirB(35,3) = Meses(4);
                    escribirB(36,3) = Meses(5);
                    escribirB(37,3) = {'MEDIA(Pri)'};
                    escribirB(35,2) = {angOptim_Pri};

                    for i=1:3
                        escribirB(i+33,4)={BdOpt_Pri(i)};
                    end
                    escribirB(37,4)= {Med_BdOpt_Pri};


                    %VERANO............................................................
                    escribirB(16,1) = Estacion(3);
                    escribirB(15,2)= Meses(6);
                    escribirB(16,2)= Meses(7);
                    escribirB(17,2)= Meses(8);
                    escribirB(18,2)= {'MEDIA(Ver)'};

                    %Valores Bdm(0º)-------------------------------
                    escribirB(15,3)= {Val_Bdm0(6)};
                    escribirB(16,3)= {Val_Bdm0(7)};
                    escribirB(17,3)= {Val_Bdm0(8)};
                    %Media Verano
                        contB3 = 0;
                        for i=6:8
                            contB3=contB3 + Val_Bdm0(i);
                        end
                        mediaBd_Ver_0 = contB3/3;
                        contB3 = 0;

                    escribirB(18,3)= {mediaBd_Ver_0};

                    %Valores Bdm(1º) a Bdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirB(i+14,j+3)= {BdBeta_Verano(i,j)};

                        end  
                    end
                    %Media Verano
                       mediaBd_Ver = zeros(1,90);
                       suma3 = 0;
                       for i=1:90
                           for j= 1:3

                               suma3 = suma3 + BdBeta_Verano(j,i);

                           end
                           mediaBd_Ver(i) = suma3 /3;
                           suma3 = 0;

                       end
                    for a=1:90
                        escribirB(18,a+3)= {mediaBd_Ver(a)};
                    end     

                    %Valores ÓPTIMOS--------------------------------
                    escribirB(40,1) = Estacion(3);
                    escribirB(39,3) = Meses(6);
                    escribirB(40,3) = Meses(7);
                    escribirB(41,3) = Meses(8);
                    escribirB(42,3) = {'MEDIA(Ver)'};
                    escribirB(40,2) = {angOptim_Ver};

                    for i=1:3
                        escribirB(i+38,4)={BdOpt_Ver(i)};
                    end
                    escribirB(42,4)= {Med_BdOpt_Ver};


                    %OTOÑO.............................................................
                    escribirB(21,1) = Estacion(4);
                    escribirB(20,2)= Meses(9);
                    escribirB(21,2)= Meses(10);
                    escribirB(22,2)= Meses(11);
                    escribirB(23,2)= {'MEDIA(Oto)'};

                    %Valores Bdm(0º)-------------------------------
                    escribirB(20,3)= {Val_Bdm0(9)};
                    escribirB(21,3)= {Val_Bdm0(10)};
                    escribirB(22,3)= {Val_Bdm0(11)};
                    %Media Otoño
                        contB4 = 0;
                        for i=9:11
                            contB4=contB4 + Val_Bdm0(i);
                        end
                        mediaBd_Oto_0 = contB4/3;
                        contB4 = 0;

                    escribirB(23,3)= {mediaBd_Oto_0};

                    %Valores Bdm(1º) a Bdm(90º)---------------------
                     for i=1:3
                        for j=1:90

                            escribirB(i+19,j+3)= {BdBeta_Otonio(i,j)};

                        end  
                    end
                    %Media Otoño
                       mediaBd_Oto = zeros(1,90);
                       suma4 = 0;
                       for i=1:90
                           for j= 1:3

                               suma4 = suma4 + BdBeta_Otonio(j,i);

                           end
                           mediaBd_Oto(i) = suma4 /3;
                           suma4 = 0;

                       end
                    for a=1:90
                        escribirB(23,a+3)= {mediaBd_Oto(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirB(45,1) = Estacion(4);
                    escribirB(44,3) = Meses(9);
                    escribirB(45,3) = Meses(10);
                    escribirB(46,3) = Meses(11);
                    escribirB(47,3) = {'MEDIA(Oto)'};
                    escribirB(45,2) = {angOptim_Oto};

                    for i=1:3
                        escribirB(i+43,4)={BdOpt_Oto(i)};
                    end
                    escribirB(47,4)= {Med_BdOpt_Oto};
                    %COMÚN.............................................................
                    %Media Anual de Todas las inclinaciones
                    escribirB(25,2) = {'MED.ANUAL'};


                    escribirB(25,3) = {mean(Val_Bdm0)};

                    media_Bd = zeros(1,90);
                    c = 0;

                        for m=1:90
                            for n=1:12

                                c = c + BdBetaTotal(n,m);
                            end

                            media_Bd(m)= c/12;

                            c=0;
                        end

                    for j=1:90
                        escribirB(25,j+3) = {media_Bd(j)};
                    end

                    escribirB(27,2) = {'RADIACIÓN DIRECTA A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
                    escribirB(28,2) = {'Áng.Óptimo'};
                    escribirB(28,4) = {'Bdm(Ópt.Est)'};


                    %RESUMEN----------------------------------
                    escribirB(49,1) = {'RESUMEN'};

                    %TÍTULOS
                    escribirB(51,2) = {'Bdm(Ópt)'};
                   

                    %Meses 
                    for i=1:13
                        escribirB(i+51,1)= Meses(i);
                    end

                    %Gdm óptimo total
                        %Rellenamos RadiacionB_optima_Est con los valores óptimos para cada
                        %estación 
                        RadiacionB_optima_Est = zeros(1,12);

                        RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
                        RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
                        RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febero

                        RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
                        RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
                        RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo

                        RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
                        RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
                        RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

                        RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
                        RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
                        RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre

                    for i=1:12
                       escribirB (i+51,2)={RadiacionB_optima_Est(i)};
                    end
                    %Media 
                    escribirB(64,2)={mean(RadiacionB_optima_Est)};

                    %Temperaturas
                    if (DATOS(15)==1000)

                    else 
                        escribirB(51,3)={'Temp.(ºC)'};
                        for i=1:12
                            escribirB(i+51,3)={DATOS(i+14)};
                        end
                        %Media de las temperaturas 
                              sumT = 0;
                              for i=15:26
                                 sumT = sumT + DATOS(i);
                              end

                                 mediaT = sumT/12;

                        escribirB(64,3) = {mediaT};
                    end

                    %GANANCIAS----------------------------------
                    %Títulos
                    escribirB(49,5)={'GANANCIAS'};
                    escribirB(49,6)={'Respecto a:'};

                    escribirB(50,6)={'Plano horizontal'};
                    escribirB(50,8)={'Inclinación óptima anual'};

                    escribirB(51,6)={'Fc.Ganancia'};
                    escribirB(51,7)={'Ganancia(%)'};
                    escribirB(51,8)={'Fc.Ganancia'};
                    escribirB(51,9)={'Ganancia(%)'};

                    %Ganancia respecto al plano horizontal
                    for i=1:12
                        escribirB(i+51,6)={GanaB_Est_0(i)};
                    end


                    for i=1:12
                        escribirB(i+51,7)={PorGanaB_Est_0(i)};
                    end
                    %Medias
                    escribirB(64,6)={mean(GanaB_Est_0)};
                    escribirB(64,7)={mean(PorGanaB_Est_0)};

                    %Ganancia respecto a la inclinación óptima anual
                    for i=1:12
                        escribirB(i+51,8)={GanaB_Est_Anu(i)};
                    end


                    for i=1:12
                        escribirB(i+51,9)={PorGanaB_Est_Anu(i)};
                    end
                    %Medias
                    escribirB(64,8)={mean(GanaB_Est_Anu)};
                    escribirB(64,9)={mean(PorGanaB_Est_Anu)};        
        
                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirB,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
                
            case 3 %Difusa
                %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
                    %Cabecera----------------------------------------------------------
                    escribirD(1,1) = NOMBRE_CIUDAD;
                    escribirD(1,2)={'Latitud'};
                    escribirD(1,3)={DATOS(2)};

                    escribirD(1,5)={'Inclinación óptima estacional'};

                    escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};

                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirD(4,i+2) = GradosD(i);
                    end

                    %INVIERNO..........................................................
                    %Meses
                    escribirD(6,1) = Estacion(1);
                    escribirD(5,2)= Meses(12);
                    escribirD(6,2)= Meses(1);
                    escribirD(7,2)= Meses(2);
                    escribirD(8,2)= {'MEDIA(Inv)'};       

                    %Valores Ddm(0º)-------------------------------
                    escribirD(5,3)= {Val_Ddm0(12)};
                    escribirD(6,3)= {Val_Ddm0(1)};
                    escribirD(7,3)= {Val_Ddm0(2)};
                    %Media invierno
                            contB1 = Val_Ddm0(12);
                            for i=1:2
                                contB1=contB1 + Val_Ddm0(i);
                            end
                            mediaDd_Inv_0 = contB1/3;

                    escribirD(8,3)= {mediaDd_Inv_0};

                    %Valores Ddm(1º) a Ddm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirD(i+4,j+3)= {DdBeta_Invierno(i,j)};

                        end  
                    end
                    %Media Invierno
                       mediaDd_Inv = zeros(1,90);
                       suma = 0;
                       for i=1:90
                           for j= 1:3

                               suma = suma + DdBeta_Invierno(j,i);

                           end
                           mediaDd_Inv(i) = suma /3;
                           suma = 0;
                       end
                    for a=1:90
                        escribirD(8,a+3)= {mediaDd_Inv(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirD(30,1)= Estacion(1);
                    escribirD(29,3) = Meses(12);
                    escribirD(30,3) = Meses(1);
                    escribirD(31,3) = Meses(2);
                    escribirD(32,3) = {'MEDIA(Inv)'};
                    escribirD(30,2) = {angOptim_Inv};

                    for i=1:3
                        escribirD(i+28,4)={DdOpt_Inv(i)};
                    end
                    escribirD(32,4)= {Med_DdOpt_Inv};


                    %PRIMAVERA.........................................................
                    escribirD(11,1) = Estacion(2);
                    escribirD(10,2)= Meses(3);
                    escribirD(11,2)= Meses(4);
                    escribirD(12,2)= Meses(5);
                    escribirD(13,2)= {'MEDIA(Pri)'};

                    %Valores Ddm(0º)-------------------------------
                    escribirD(10,3)= {Val_Ddm0(3)};
                    escribirD(11,3)= {Val_Ddm0(4)};
                    escribirD(12,3)= {Val_Ddm0(5)};
                    %Media primavera
                        contB2 = 0;
                        for i=3:5
                            contB2=contB2 + Val_Ddm0(i);
                        end
                        mediaDd_Pri_0 = contB2/3;
                        contB2 = 0;

                    escribirD(13,3)= {mediaDd_Pri_0};

                    %Valores Ddm(1º) a Ddm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirD(i+9,j+3)= {DdBeta_Primavera(i,j)};

                        end  
                    end
                    %Media primavera
                       mediaDd_Pri = zeros(1,90);
                       suma2 = 0;
                       for i=1:90
                           for j= 1:3

                               suma2 = suma2 + DdBeta_Primavera(j,i);

                           end
                           mediaDd_Pri(i) = suma2 /3;
                           suma2 = 0;

                       end
                    for a=1:90
                        escribirD(13,a+3)= {mediaDd_Pri(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirD(35,1) = Estacion(2);
                    escribirD(34,3) = Meses(3);
                    escribirD(35,3) = Meses(4);
                    escribirD(36,3) = Meses(5);
                    escribirD(37,3) = {'MEDIA(Pri)'};
                    escribirD(35,2) = {angOptim_Pri};

                    for i=1:3
                        escribirD(i+33,4)={DdOpt_Pri(i)};
                    end
                    escribirD(37,4)= {Med_DdOpt_Pri};


                    %VERANO............................................................
                    escribirD(16,1) = Estacion(3);
                    escribirD(15,2)= Meses(6);
                    escribirD(16,2)= Meses(7);
                    escribirD(17,2)= Meses(8);
                    escribirD(18,2)= {'MEDIA(Ver)'};

                    %Valores Ddm(0º)-------------------------------
                    escribirD(15,3)= {Val_Ddm0(6)};
                    escribirD(16,3)= {Val_Ddm0(7)};
                    escribirD(17,3)= {Val_Ddm0(8)};
                    %Media Verano
                        contB3 = 0;
                        for i=6:8
                            contB3=contB3 + Val_Ddm0(i);
                        end
                        mediaDd_Ver_0 = contB3/3;
                        contB3 = 0;

                    escribirD(18,3)= {mediaDd_Ver_0};

                    %Valores Ddm(1º) a Ddm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirD(i+14,j+3)= {DdBeta_Verano(i,j)};

                        end  
                    end
                    %Media Verano
                       mediaDd_Ver = zeros(1,90);
                       suma3 = 0;
                       for i=1:90
                           for j= 1:3

                               suma3 = suma3 + DdBeta_Verano(j,i);

                           end
                           mediaDd_Ver(i) = suma3 /3;
                           suma3 = 0;

                       end
                    for a=1:90
                        escribirD(18,a+3)= {mediaDd_Ver(a)};
                    end     

                    %Valores ÓPTIMOS--------------------------------
                    escribirD(40,1) = Estacion(3);
                    escribirD(39,3) = Meses(6);
                    escribirD(40,3) = Meses(7);
                    escribirD(41,3) = Meses(8);
                    escribirD(42,3) = {'MEDIA(Ver)'};
                    escribirD(40,2) = {angOptim_Ver};

                    for i=1:3
                        escribirD(i+38,4)={DdOpt_Ver(i)};
                    end
                    escribirD(42,4)= {Med_DdOpt_Ver};


                    %OTOÑO.............................................................
                    escribirD(21,1) = Estacion(4);
                    escribirD(20,2)= Meses(9);
                    escribirD(21,2)= Meses(10);
                    escribirD(22,2)= Meses(11);
                    escribirD(23,2)= {'MEDIA(Oto)'};

                    %Valores Ddm(0º)-------------------------------
                    escribirD(20,3)= {Val_Ddm0(9)};
                    escribirD(21,3)= {Val_Ddm0(10)};
                    escribirD(22,3)= {Val_Ddm0(11)};
                    %Media Otoño
                        contB4 = 0;
                        for i=9:11
                            contB4=contB4 + Val_Ddm0(i);
                        end
                        mediaDd_Oto_0 = contB4/3;
                        contB4 = 0;

                    escribirD(23,3)= {mediaDd_Oto_0};

                    %Valores Bdm(1º) a Bdm(90º)---------------------
                     for i=1:3
                        for j=1:90

                            escribirD(i+19,j+3)= {DdBeta_Otonio(i,j)};

                        end  
                    end
                    %Media Otoño
                       mediaDd_Oto = zeros(1,90);
                       suma4 = 0;
                       for i=1:90
                           for j= 1:3

                               suma4 = suma4 + DdBeta_Otonio(j,i);

                           end
                           mediaDd_Oto(i) = suma4 /3;
                           suma4 = 0;

                       end
                    for a=1:90
                        escribirD(23,a+3)= {mediaDd_Oto(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirD(45,1) = Estacion(4);
                    escribirD(44,3) = Meses(9);
                    escribirD(45,3) = Meses(10);
                    escribirD(46,3) = Meses(11);
                    escribirD(47,3) = {'MEDIA(Oto)'};
                    escribirD(45,2) = {angOptim_Oto};

                    for i=1:3
                        escribirD(i+43,4)={DdOpt_Oto(i)};
                    end
                    escribirD(47,4)= {Med_DdOpt_Oto};
                    %COMÚN.............................................................
                    %Media Anual de Todas las inclinaciones
                    escribirD(25,2) = {'MED.ANUAL'};


                    escribirD(25,3) = {mean(Val_Ddm0)};

                    media_Dd = zeros(1,90);
                    c = 0;

                        for m=1:90
                            for n=1:12

                                c = c + DdBetaTotal(n,m);
                            end

                            media_Dd(m)= c/12;

                            c=0;
                        end

                    for j=1:90
                        escribirD(25,j+3) = {media_Dd(j)};
                    end

                    escribirD(27,2) = {'RADIACIÓN DIFUSA A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
                    escribirD(28,2) = {'Áng.Óptimo'};
                    escribirD(28,4) = {'Ddm(Ópt.Est)'};


                    %RESUMEN----------------------------------
                    escribirD(49,1) = {'RESUMEN'};

                    %TÍTULOS
                    escribirD(51,2) = {'Ddm(Ópt)'};
                    

                    %Meses 
                    for i=1:13
                        escribirD(i+51,1)= Meses(i);
                    end

                    %Gdm óptimo total
                        %Rellenamos RadiacionD_optima_Est con los valores óptimos para cada
                        %estación 
                        RadiacionD_optima_Est = zeros(1,12);

                        RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
                        RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
                        RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero

                        RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
                        RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
                        RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

                        RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
                        RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
                        RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

                        RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
                        RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
                        RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre

                    for i=1:12
                       escribirD (i+51,2)={RadiacionD_optima_Est(i)};
                    end
                    %Media 
                    escribirD(64,2)={mean(RadiacionD_optima_Est)};

                    %Temperaturas
                    if (DATOS(15)==1000)

                    else 
                        escribirD(51,3)={'Temp.(ºC)'};
                        for i=1:12
                            escribirD(i+51,3)={DATOS(i+14)};
                        end
                        %Media de las temperaturas 
                              sumT = 0;
                              for i=15:26
                                 sumT = sumT + DATOS(i);
                              end

                                 mediaT = sumT/12;

                        escribirD(64,3) = {mediaT};
                    end

                    %GANANCIAS----------------------------------
                    %Títulos
                    escribirD(49,5)={'GANANCIAS'};
                    escribirD(49,6)={'Respecto a:'};

                    escribirD(50,6)={'Plano horizontal'};
                    escribirD(50,8)={'Inclinación óptima anual'};

                    escribirD(51,6)={'Fc.Ganancia'};
                    escribirD(51,7)={'Ganancia(%)'};
                    escribirD(51,8)={'Fc.Ganancia'};
                    escribirD(51,9)={'Ganancia(%)'};

                    %Ganancia respecto al plano horizontal
                    for i=1:12
                        escribirD(i+51,6)={GanaD_Est_0(i)};
                    end


                    for i=1:12
                        escribirD(i+51,7)={PorGanaD_Est_0(i)};
                    end
                    %Medias
                    escribirD(64,6)={mean(GanaD_Est_0)};
                    escribirD(64,7)={mean(PorGanaD_Est_0)};

                    %Ganancia respecto a la inclinación óptima anual
                    for i=1:12
                        escribirD(i+51,8)={GanaD_Est_Anu(i)};
                    end


                    for i=1:12
                        escribirD(i+51,9)={PorGanaD_Est_Anu(i)};
                    end
                    %Medias
                    escribirD(64,8)={mean(GanaD_Est_Anu)};
                    escribirD(64,9)={mean(PorGanaD_Est_Anu)};                   

                
                %Escritura
                xlswrite(fullfile(ruta,nombre),escribirD,'Hoja1','A1');
                %Aviso
                msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
                
            case 4 %Albedo   
                %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
                    %Cabecera----------------------------------------------------------
                    escribirR(1,1) = NOMBRE_CIUDAD;
                    escribirR(1,2)={'Latitud'};
                    escribirR(1,3)={DATOS(2)};

                    escribirR(1,5)={'Inclinación óptima estacional'};

                    escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};

                    %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
                    for i=1:91
                        escribirR(4,i+2) = GradosR(i);
                    end

                    %INVIERNO..........................................................
                    %Meses
                    escribirR(6,1) = Estacion(1);
                    escribirR(5,2)= Meses(12);
                    escribirR(6,2)= Meses(1);
                    escribirR(7,2)= Meses(2);
                    escribirR(8,2)= {'MEDIA(Inv)'};       

                    %Valores Ddm(0º)-------------------------------
                    escribirR(5,3)= {0};
                    escribirR(6,3)= {0};
                    escribirR(7,3)= {0};
                    %Media invierno
                    escribirR(8,3)= {0};

                    %Valores Rdm(1º) a Rdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirR(i+4,j+3)= {RdBeta_Invierno(i,j)};

                        end  
                    end
                    %Media Invierno
                       mediaRd_Inv = zeros(1,90);
                       suma = 0;
                       for i=1:90
                           for j= 1:3

                               suma = suma + RdBeta_Invierno(j,i);

                           end
                           mediaRd_Inv(i) = suma /3;
                           suma = 0;
                       end
                    for a=1:90
                        escribirR(8,a+3)= {mediaRd_Inv(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirR(30,1)= Estacion(1);
                    escribirR(29,3) = Meses(12);
                    escribirR(30,3) = Meses(1);
                    escribirR(31,3) = Meses(2);
                    escribirR(32,3) = {'MEDIA(Inv)'};
                    escribirR(30,2) = {angOptim_Inv};

                    for i=1:3
                        escribirR(i+28,4)={RdOpt_Inv(i)};
                    end
                    escribirR(32,4)= {Med_RdOpt_Inv};


                    %PRIMAVERA.........................................................
                    escribirR(11,1) = Estacion(2);
                    escribirR(10,2)= Meses(3);
                    escribirR(11,2)= Meses(4);
                    escribirR(12,2)= Meses(5);
                    escribirR(13,2)= {'MEDIA(Pri)'};

                    %Valores Rdm(0º)-------------------------------
                    escribirR(10,3)= {0};
                    escribirR(11,3)= {0};
                    escribirR(12,3)= {0};
                    %Media primavera
                    escribirR(13,3)= {0};

                    %Valores Rdm(1º) a Rdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirR(i+9,j+3)= {RdBeta_Primavera(i,j)};

                        end  
                    end
                    %Media primavera
                       mediaRd_Pri = zeros(1,90);
                       suma2 = 0;
                       for i=1:90
                           for j= 1:3

                               suma2 = suma2 + RdBeta_Primavera(j,i);

                           end
                           mediaRd_Pri(i) = suma2 /3;
                           suma2 = 0;

                       end
                    for a=1:90
                        escribirR(13,a+3)= {mediaRd_Pri(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirR(35,1) = Estacion(2);
                    escribirR(34,3) = Meses(3);
                    escribirR(35,3) = Meses(4);
                    escribirR(36,3) = Meses(5);
                    escribirR(37,3) = {'MEDIA(Pri)'};
                    escribirR(35,2) = {angOptim_Pri};

                    for i=1:3
                        escribirR(i+33,4)={RdOpt_Pri(i)};
                    end
                    escribirR(37,4)= {Med_RdOpt_Pri};


                    %VERANO............................................................
                    escribirR(16,1) = Estacion(3);
                    escribirR(15,2)= Meses(6);
                    escribirR(16,2)= Meses(7);
                    escribirR(17,2)= Meses(8);
                    escribirR(18,2)= {'MEDIA(Ver)'};

                    %Valores Rdm(0º)-------------------------------
                    escribirR(15,3)= {0};
                    escribirR(16,3)= {0};
                    escribirR(17,3)= {0};
                    %Media Verano
                    escribirR(18,3)= {0};

                    %Valores Rdm(1º) a Rdm(90º)---------------------
                    for i=1:3
                        for j=1:90

                            escribirR(i+14,j+3)= {RdBeta_Verano(i,j)};

                        end  
                    end
                    %Media Verano
                       mediaRd_Ver = zeros(1,90);
                       suma3 = 0;
                       for i=1:90
                           for j= 1:3

                               suma3 = suma3 + RdBeta_Verano(j,i);

                           end
                           mediaRd_Ver(i) = suma3 /3;
                           suma3 = 0;

                       end
                    for a=1:90
                        escribirR(18,a+3)= {mediaRd_Ver(a)};
                    end     

                    %Valores ÓPTIMOS--------------------------------
                    escribirR(40,1) = Estacion(3);
                    escribirR(39,3) = Meses(6);
                    escribirR(40,3) = Meses(7);
                    escribirR(41,3) = Meses(8);
                    escribirR(42,3) = {'MEDIA(Ver)'};
                    escribirR(40,2) = {angOptim_Ver};

                    for i=1:3
                        escribirR(i+38,4)={RdOpt_Ver(i)};
                    end
                    escribirR(42,4)= {Med_RdOpt_Ver};


                    %OTOÑO.............................................................
                    escribirR(21,1) = Estacion(4);
                    escribirR(20,2)= Meses(9);
                    escribirR(21,2)= Meses(10);
                    escribirR(22,2)= Meses(11);
                    escribirR(23,2)= {'MEDIA(Oto)'};

                    %Valores Rdm(0º)-------------------------------
                    escribirR(20,3)= {0};
                    escribirR(21,3)= {0};
                    escribirR(22,3)= {0};

                    %Media Otoño
                    escribirR(23,3)= {0};

                    %Valores Rdm(1º) a Rdm(90º)---------------------
                     for i=1:3
                        for j=1:90

                            escribirR(i+19,j+3)= {RdBeta_Otonio(i,j)};

                        end  
                    end
                    %Media Otoño
                       mediaRd_Oto = zeros(1,90);
                       suma4 = 0;
                       for i=1:90
                           for j= 1:3

                               suma4 = suma4 + RdBeta_Otonio(j,i);

                           end
                           mediaRd_Oto(i) = suma4 /3;
                           suma4 = 0;

                       end
                    for a=1:90
                        escribirR(23,a+3)= {mediaRd_Oto(a)};
                    end

                    %Valores ÓPTIMOS--------------------------------
                    escribirR(45,1) = Estacion(4);
                    escribirR(44,3) = Meses(9);
                    escribirR(45,3) = Meses(10);
                    escribirR(46,3) = Meses(11);
                    escribirR(47,3) = {'MEDIA(Oto)'};
                    escribirR(45,2) = {angOptim_Oto};

                    for i=1:3
                        escribirR(i+43,4)={RdOpt_Oto(i)};
                    end
                    escribirR(47,4)= {Med_RdOpt_Oto};
                    %COMÚN.............................................................
                    %Media Anual de Todas las inclinaciones
                    escribirR(25,2) = {'MED.ANUAL'};

                    escribirR(25,3) = {0};

                    media_Rd = zeros(1,90);
                    c = 0;

                        for m=1:90
                            for n=1:12

                                c = c + RdBetaTotal(n,m);
                            end

                            media_Rd(m)= c/12;

                            c=0;
                        end

                    for j=1:90
                        escribirR(25,j+3) = {media_Rd(j)};
                    end

                    escribirR(27,2) = {'RADIACIÓN DE ALBEDO A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
                    escribirR(28,2) = {'Áng.Óptimo'};
                    escribirR(28,4) = {'Rdm(Ópt.Est)'};


                    %RESUMEN----------------------------------
                    escribirR(49,1) = {'RESUMEN'};

                    %TÍTULOS
                    escribirR(51,2) = {'Rdm(Ópt)'};
                    

                    %Meses 
                    for i=1:13
                        escribirR(i+51,1)= Meses(i);
                    end

                    %Gdm óptimo total
                        %Rellenamos RadiacionR_optima_Est con los valores óptimos para cada
                        %estación 
                        RadiacionR_optima_Est = zeros(1,12);

                        RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
                        RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
                        RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febero

                        RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
                        RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
                        RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

                        RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
                        RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
                        RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

                        RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
                        RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
                        RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre

                    for i=1:12
                       escribirR (i+51,2)={RadiacionR_optima_Est(i)};
                    end
                    %Media 
                    escribirR(64,2)={mean(RadiacionR_optima_Est)};

                    %Temperaturas
                    if (DATOS(15)==1000)

                    else 
                        escribirR(51,3)={'Temp.(ºC)'};
                        for i=1:12
                            escribirR(i+51,3)={DATOS(i+14)};
                        end
                        %Media de las temperaturas 
                              sumT = 0;
                              for i=15:26
                                 sumT = sumT + DATOS(i);
                              end

                                 mediaT = sumT/12;

                        escribirR(64,3) = {mediaT};
                    end

                    %GANANCIAS----------------------------------
                    %Títulos
                    escribirR(49,5)={'GANANCIAS'};
                    escribirR(49,6)={'Respecto a:'};

                    escribirR(50,6)={'Plano horizontal'};
                    escribirR(50,8)={'Inclinación óptima anual'};

                    escribirR(51,6)={'Fc.Ganancia'};
                    escribirR(51,7)={'Ganancia(%)'};
                    escribirR(51,8)={'Fc.Ganancia'};
                    escribirR(51,9)={'Ganancia(%)'};

                    %Ganancia respecto al plano horizontal
                    for i=1:12
                        escribirR(i+51,6)={'-'};
                    end


                    for i=1:12
                        escribirR(i+51,7)={'-'};
                    end
                    %Medias
                    escribirR(64,6)={'-'};
                    escribirR(64,7)={'-'};

                    %Ganancia respecto a la inclinación óptima anual
                    if angulo_optimo==0 
                       for i=1:12
                            escribirR(i+51,8)={'-'};
                        end


                        for i=1:12
                            escribirR(i+51,9)={'-'};
                        end
                        %Medias
                        escribirR(64,8)={'-'};
                        escribirR(64,9)={'-'};   
                        
                    else
                        for i=1:12
                            escribirR(i+51,8)={GanaR_Est_Anu(i)};
                        end


                        for i=1:12
                            escribirR(i+51,9)={PorGanaR_Est_Anu(i)};
                        end
                        %Medias
                        escribirR(64,8)={mean(GanaR_Est_Anu)};
                        escribirR(64,9)={mean(PorGanaR_Est_Anu)};      
                    end
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
        
        escribirG(1,5)={'Inclinación óptima estacional'};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirG(4,i+2) = GradosG(i);
        end
        
        %INVIERNO..........................................................
        %Meses
        escribirG(6,1) = Estacion(1);
        escribirG(5,2)= Meses(12);
        escribirG(6,2)= Meses(1);
        escribirG(7,2)= Meses(2);
        escribirG(8,2)= {'MEDIA(Inv)'};       
        
        %Valores Gdm(0º)-------------------------------
        escribirG(5,3)= {DATOS(14)};
        escribirG(6,3)= {DATOS(3)};
        escribirG(7,3)= {DATOS(4)};
        %Media invierno
            cont1 = DATOS(14);
            for i=3:4
                cont1=cont1+DATOS(i);
            end
            media_Inv_0 = cont1/3;

        escribirG(8,3)= {media_Inv_0};
        
        %Valores Gdm(1º) a Gdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirG(i+4,j+3)= {GdBeta_Invierno(i,j)};

            end  
        end
        %Media Invierno
           media_Inv = zeros(1,90);
           suma = 0;
           for i=1:90
               for j= 1:3

                   suma = suma + GdBeta_Invierno(j,i);

               end
               media_Inv(i) = suma /3;
               suma = 0;
           end
        for a=1:90
            escribirG(8,a+3)= {media_Inv(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirG(30,1)= Estacion(1);
        escribirG(29,3) = Meses(12);
        escribirG(30,3) = Meses(1);
        escribirG(31,3) = Meses(2);
        escribirG(32,3) = {'MEDIA(Inv)'};
        escribirG(30,2) = {angOptim_Inv};

        for i=1:3
            escribirG(i+28,4)={GdOpt_Inv(i)};
        end
        escribirG(32,4)= {Med_GdOpt_Inv};
        
        
        %PRIMAVERA.........................................................
        escribirG(11,1) = Estacion(2);
        escribirG(10,2)= Meses(3);
        escribirG(11,2)= Meses(4);
        escribirG(12,2)= Meses(5);
        escribirG(13,2)= {'MEDIA(Pri)'};
       
        %Valores Gdm(0º)-------------------------------
        escribirG(10,3)= {DATOS(5)};
        escribirG(11,3)= {DATOS(6)};
        escribirG(12,3)= {DATOS(7)};
        %Media primavera
            cont2 = 0;
            for i=5:7
                cont2=cont2+DATOS(i);
            end
            media_Pri_0 = cont2/3;
            cont2 = 0;

        escribirG(13,3)= {media_Pri_0};
        
        %Valores Gdm(1º) a Gdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirG(i+9,j+3)= {GdBeta_Primavera(i,j)};

            end  
        end
        %Media primavera
           media_Pri = zeros(1,90);
           suma2 = 0;
           for i=1:90
               for j= 1:3

                   suma2 = suma2 + GdBeta_Primavera(j,i);

               end
               media_Pri(i) = suma2 /3;
               suma2 = 0;

           end
        for a=1:90
            escribirG(13,a+3)= {media_Pri(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirG(35,1) = Estacion(2);
        escribirG(34,3) = Meses(3);
        escribirG(35,3) = Meses(4);
        escribirG(36,3) = Meses(5);
        escribirG(37,3) = {'MEDIA(Pri)'};
        escribirG(35,2) = {angOptim_Pri};

        for i=1:3
            escribirG(i+33,4)={GdOpt_Pri(i)};
        end
        escribirG(37,4)= {Med_GdOpt_Pri};
        
        
        %VERANO............................................................
        escribirG(16,1) = Estacion(3);
        escribirG(15,2)= Meses(6);
        escribirG(16,2)= Meses(7);
        escribirG(17,2)= Meses(8);
        escribirG(18,2)= {'MEDIA(Ver)'};
        
        %Valores Gdm(0º)-------------------------------
        escribirG(15,3)= {DATOS(8)};
        escribirG(16,3)= {DATOS(9)};
        escribirG(17,3)= {DATOS(10)};
        %Media Verano
            cont3 = 0;
            for i=8:10
                cont3=cont3+DATOS(i);
            end
            media_Ver_0 = cont3/3;
            cont3 = 0;

        escribirG(18,3)= {media_Ver_0};
        
        %Valores Gdm(1º) a Gdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirG(i+14,j+3)= {GdBeta_Verano(i,j)};

            end  
        end
        %Media Verano
           media_Ver = zeros(1,90);
           suma3 = 0;
           for i=1:90
               for j= 1:3

                   suma3 = suma3 + GdBeta_Verano(j,i);

               end
               media_Ver(i) = suma3 /3;
               suma3 = 0;

           end
        for a=1:90
            escribirG(18,a+3)= {media_Ver(a)};
        end     
        
        %Valores ÓPTIMOS--------------------------------
        escribirG(40,1) = Estacion(3);
        escribirG(39,3) = Meses(6);
        escribirG(40,3) = Meses(7);
        escribirG(41,3) = Meses(8);
        escribirG(42,3) = {'MEDIA(Ver)'};
        escribirG(40,2) = {angOptim_Ver};

        for i=1:3
            escribirG(i+38,4)={GdOpt_Ver(i)};
        end
        escribirG(42,4)= {Med_GdOpt_Ver};

        
        %OTOÑO.............................................................
        escribirG(21,1) = Estacion(4);
        escribirG(20,2)= Meses(9);
        escribirG(21,2)= Meses(10);
        escribirG(22,2)= Meses(11);
        escribirG(23,2)= {'MEDIA(Oto)'};
        
        %Valores Gdm(0º)-------------------------------
        escribirG(20,3)= {DATOS(11)};
        escribirG(21,3)= {DATOS(12)};
        escribirG(22,3)= {DATOS(13)};
        %Media Otoño
            cont4 = 0;
            for i=11:13
                cont4=cont4+DATOS(i);
            end
            media_Oto_0 = cont4/3;
            cont4 = 0;

        escribirG(23,3)= {media_Oto_0};
        
        %Valores Gdm(1º) a Gdm(90º)---------------------
         for i=1:3
            for j=1:90

                escribirG(i+19,j+3)= {GdBeta_Otonio(i,j)};

            end  
        end
        %Media Otoño
           media_Oto = zeros(1,90);
           suma4 = 0;
           for i=1:90
               for j= 1:3

                   suma4 = suma4 + GdBeta_Otonio(j,i);

               end
               media_Oto(i) = suma4 /3;
               suma4 = 0;

           end
        for a=1:90
            escribirG(23,a+3)= {media_Oto(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirG(45,1) = Estacion(4);
        escribirG(44,3) = Meses(9);
        escribirG(45,3) = Meses(10);
        escribirG(46,3) = Meses(11);
        escribirG(47,3) = {'MEDIA(Oto)'};
        escribirG(45,2) = {angOptim_Oto};

        for i=1:3
            escribirG(i+43,4)={GdOpt_Oto(i)};
        end
        escribirG(47,4)= {Med_GdOpt_Oto};
        %COMÚN.............................................................
        %Media Anual de Todas las inclinaciones
        escribirG(25,2) = {'MED.ANUAL'};
            sum = 0;
               for i=3:14
                  sum = sum + DATOS(i);
               end

            media0 = sum/12;
            
        escribirG(25,3) = {media0};

        media_Gd = zeros(1,90);
        c = 0;

            for m=1:90
                for n=1:12

                    c = c + GdBetaTotal(n,m);
                end

                media_Gd(m)= c/12;

                c=0;
            end

        for j=1:90
            escribirG(25,j+3) = {media_Gd(j)};
        end

        escribirG(27,2) = {'RADIACIÓN GLOBAL A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
        escribirG(28,2) = {'Áng.Óptimo'};
        escribirG(28,4) = {'Gdm(Ópt.Est)'};
        
        
        %RESUMEN----------------------------------
        escribirG(49,1) = {'RESUMEN'};
        
        %TÍTULOS
        escribirG(51,2) = {'Gdm(Ópt)'};
        
        
        %Meses 
        for i=1:13
            escribirG(i+51,1)= Meses(i);
        end
        
        %Gdm óptimo total
            %Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
            %estación 
            RadiacionG_optima_Est = zeros(1,12);

            RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
            RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
            RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

            RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
            RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
            RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

            RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
            RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
            RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

            RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
            RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
            RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre
               
        for i=1:12
           escribirG (i+51,2)={RadiacionG_optima_Est(i)};
        end
        %Media 
        escribirG(64,2)={mean(RadiacionG_optima_Est)};
        
        %Temperaturas
        if (DATOS(15)==1000)

        else 
            escribirG(51,3)={'Temp.(ºC)'};
            for i=1:12
                escribirG(i+51,3)={DATOS(i+14)};
            end
            %Media de las temperaturas 
                  sumT = 0;
                  for i=15:26
                     sumT = sumT + DATOS(i);
                  end

                     mediaT = sumT/12;

            escribirG(64,3) = {mediaT};
        end
        
        %GANANCIAS----------------------------------
        %Títulos
        escribirG(49,5)={'GANANCIAS'};
        escribirG(49,6)={'Respecto a:'};
        
        escribirG(50,6)={'Plano horizontal'};
        escribirG(50,8)={'Inclinación óptima anual'};
        
        escribirG(51,6)={'Fc.Ganancia'};
        escribirG(51,7)={'Ganancia(%)'};
        escribirG(51,8)={'Fc.Ganancia'};
        escribirG(51,9)={'Ganancia(%)'};
        
        %Ganancia respecto al plano horizontal
        for i=1:12
            escribirG(i+51,6)={GanaG_Est_0(i)};
        end
        
        
        for i=1:12
            escribirG(i+51,7)={PorGanaG_Est_0(i)};
        end
        %Medias
        escribirG(64,6)={mean(GanaG_Est_0)};
        escribirG(64,7)={mean(PorGanaG_Est_0)};
        
        %Ganancia respecto a la inclinación óptima anual
        for i=1:12
            escribirG(i+51,8)={GanaG_Est_Anu(i)};
        end
        
        
        for i=1:12
            escribirG(i+51,9)={PorGanaG_Est_Anu(i)};
        end
        %Medias
        escribirG(64,8)={mean(GanaG_Est_Anu)};
        escribirG(64,9)={mean(PorGanaG_Est_Anu)};
        
        %DIRECTA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DIRECTA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Inclinación óptima estacional'};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirB(4,i+2) = GradosB(i);
        end
        
        %INVIERNO..........................................................
        %Meses
        escribirB(6,1) = Estacion(1);
        escribirB(5,2)= Meses(12);
        escribirB(6,2)= Meses(1);
        escribirB(7,2)= Meses(2);
        escribirB(8,2)= {'MEDIA(Inv)'};       
        
        %Valores Bdm(0º)-------------------------------
        escribirB(5,3)= {Val_Bdm0(12)};
        escribirB(6,3)= {Val_Bdm0(1)};
        escribirB(7,3)= {Val_Bdm0(2)};
        %Media invierno
                contB1 = Val_Bdm0(12);
                for i=1:2
                    contB1=contB1 + Val_Bdm0(i);
                end
                mediaBd_Inv_0 = contB1/3;

        escribirB(8,3)= {mediaBd_Inv_0};
        
        %Valores Bdm(1º) a Bdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirB(i+4,j+3)= {BdBeta_Invierno(i,j)};

            end  
        end
        %Media Invierno
           mediaBd_Inv = zeros(1,90);
           suma = 0;
           for i=1:90
               for j= 1:3

                   suma = suma + BdBeta_Invierno(j,i);

               end
               mediaBd_Inv(i) = suma /3;
               suma = 0;
           end
        for a=1:90
            escribirB(8,a+3)= {mediaBd_Inv(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirB(30,1)= Estacion(1);
        escribirB(29,3) = Meses(12);
        escribirB(30,3) = Meses(1);
        escribirB(31,3) = Meses(2);
        escribirB(32,3) = {'MEDIA(Inv)'};
        escribirB(30,2) = {angOptim_Inv};

        for i=1:3
            escribirB(i+28,4)={BdOpt_Inv(i)};
        end
        escribirB(32,4)= {Med_BdOpt_Inv};
        
        
        %PRIMAVERA.........................................................
        escribirB(11,1) = Estacion(2);
        escribirB(10,2)= Meses(3);
        escribirB(11,2)= Meses(4);
        escribirB(12,2)= Meses(5);
        escribirB(13,2)= {'MEDIA(Pri)'};
       
        %Valores Bdm(0º)-------------------------------
        escribirB(10,3)= {Val_Bdm0(3)};
        escribirB(11,3)= {Val_Bdm0(4)};
        escribirB(12,3)= {Val_Bdm0(5)};
        %Media primavera
            contB2 = 0;
            for i=3:5
                contB2=contB2 + Val_Bdm0(i);
            end
            mediaBd_Pri_0 = contB2/3;
            contB2 = 0;

        escribirB(13,3)= {mediaBd_Pri_0};
        
        %Valores Bdm(1º) a Bdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirB(i+9,j+3)= {BdBeta_Primavera(i,j)};

            end  
        end
        %Media primavera
           mediaBd_Pri = zeros(1,90);
           suma2 = 0;
           for i=1:90
               for j= 1:3

                   suma2 = suma2 + BdBeta_Primavera(j,i);

               end
               mediaBd_Pri(i) = suma2 /3;
               suma2 = 0;

           end
        for a=1:90
            escribirB(13,a+3)= {mediaBd_Pri(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirB(35,1) = Estacion(2);
        escribirB(34,3) = Meses(3);
        escribirB(35,3) = Meses(4);
        escribirB(36,3) = Meses(5);
        escribirB(37,3) = {'MEDIA(Pri)'};
        escribirB(35,2) = {angOptim_Pri};

        for i=1:3
            escribirB(i+33,4)={BdOpt_Pri(i)};
        end
        escribirB(37,4)= {Med_BdOpt_Pri};
        
        
        %VERANO............................................................
        escribirB(16,1) = Estacion(3);
        escribirB(15,2)= Meses(6);
        escribirB(16,2)= Meses(7);
        escribirB(17,2)= Meses(8);
        escribirB(18,2)= {'MEDIA(Ver)'};
        
        %Valores Bdm(0º)-------------------------------
        escribirB(15,3)= {Val_Bdm0(6)};
        escribirB(16,3)= {Val_Bdm0(7)};
        escribirB(17,3)= {Val_Bdm0(8)};
        %Media Verano
            contB3 = 0;
            for i=6:8
                contB3=contB3 + Val_Bdm0(i);
            end
            mediaBd_Ver_0 = contB3/3;
            contB3 = 0;

        escribirB(18,3)= {mediaBd_Ver_0};
        
        %Valores Bdm(1º) a Bdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirB(i+14,j+3)= {BdBeta_Verano(i,j)};

            end  
        end
        %Media Verano
           mediaBd_Ver = zeros(1,90);
           suma3 = 0;
           for i=1:90
               for j= 1:3

                   suma3 = suma3 + BdBeta_Verano(j,i);

               end
               mediaBd_Ver(i) = suma3 /3;
               suma3 = 0;

           end
        for a=1:90
            escribirB(18,a+3)= {mediaBd_Ver(a)};
        end     
        
        %Valores ÓPTIMOS--------------------------------
        escribirB(40,1) = Estacion(3);
        escribirB(39,3) = Meses(6);
        escribirB(40,3) = Meses(7);
        escribirB(41,3) = Meses(8);
        escribirB(42,3) = {'MEDIA(Ver)'};
        escribirB(40,2) = {angOptim_Ver};

        for i=1:3
            escribirB(i+38,4)={BdOpt_Ver(i)};
        end
        escribirB(42,4)= {Med_BdOpt_Ver};

        
        %OTOÑO.............................................................
        escribirB(21,1) = Estacion(4);
        escribirB(20,2)= Meses(9);
        escribirB(21,2)= Meses(10);
        escribirB(22,2)= Meses(11);
        escribirB(23,2)= {'MEDIA(Oto)'};
        
        %Valores Bdm(0º)-------------------------------
        escribirB(20,3)= {Val_Bdm0(9)};
        escribirB(21,3)= {Val_Bdm0(10)};
        escribirB(22,3)= {Val_Bdm0(11)};
        %Media Otoño
            contB4 = 0;
            for i=9:11
                contB4=contB4 + Val_Bdm0(i);
            end
            mediaBd_Oto_0 = contB4/3;
            contB4 = 0;

        escribirB(23,3)= {mediaBd_Oto_0};
        
        %Valores Bdm(1º) a Bdm(90º)---------------------
         for i=1:3
            for j=1:90

                escribirB(i+19,j+3)= {BdBeta_Otonio(i,j)};

            end  
        end
        %Media Otoño
           mediaBd_Oto = zeros(1,90);
           suma4 = 0;
           for i=1:90
               for j= 1:3

                   suma4 = suma4 + BdBeta_Otonio(j,i);

               end
               mediaBd_Oto(i) = suma4 /3;
               suma4 = 0;

           end
        for a=1:90
            escribirB(23,a+3)= {mediaBd_Oto(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirB(45,1) = Estacion(4);
        escribirB(44,3) = Meses(9);
        escribirB(45,3) = Meses(10);
        escribirB(46,3) = Meses(11);
        escribirB(47,3) = {'MEDIA(Oto)'};
        escribirB(45,2) = {angOptim_Oto};

        for i=1:3
            escribirB(i+43,4)={BdOpt_Oto(i)};
        end
        escribirB(47,4)= {Med_BdOpt_Oto};
        %COMÚN.............................................................
        %Media Anual de Todas las inclinaciones
        escribirB(25,2) = {'MED.ANUAL'};
           
            
        escribirB(25,3) = {mean(Val_Bdm0)};

        media_Bd = zeros(1,90);
        c = 0;

            for m=1:90
                for n=1:12

                    c = c + BdBetaTotal(n,m);
                end

                media_Bd(m)= c/12;

                c=0;
            end

        for j=1:90
            escribirB(25,j+3) = {media_Bd(j)};
        end

        escribirB(27,2) = {'RADIACIÓN DIRECTA A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
        escribirB(28,2) = {'Áng.Óptimo'};
        escribirB(28,4) = {'Bdm(Ópt.Est)'};
        
        
        %RESUMEN----------------------------------
        escribirB(49,1) = {'RESUMEN'};
        
        %TÍTULOS
        escribirB(51,2) = {'Bdm(Ópt)'};
        
        
        %Meses 
        for i=1:13
            escribirB(i+51,1)= Meses(i);
        end
        
        %Gdm óptimo total
            %Rellenamos RadiacionB_optima_Est con los valores óptimos para cada
            %estación 
            RadiacionB_optima_Est = zeros(1,12);

            RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
            RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
            RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febero

            RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
            RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
            RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo
            
            RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
            RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
            RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

            RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
            RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
            RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre
               
        for i=1:12
           escribirB (i+51,2)={RadiacionB_optima_Est(i)};
        end
        %Media 
        escribirB(64,2)={mean(RadiacionB_optima_Est)};
        
        %Temperaturas
        if (DATOS(15)==1000)

        else 
            escribirB(51,3)={'Temp.(ºC)'};
            for i=1:12
                escribirB(i+51,3)={DATOS(i+14)};
            end
            %Media de las temperaturas 
                  sumT = 0;
                  for i=15:26
                     sumT = sumT + DATOS(i);
                  end

                     mediaT = sumT/12;

            escribirB(64,3) = {mediaT};
        end
        
        %GANANCIAS----------------------------------
        %Títulos
        escribirB(49,5)={'GANANCIAS'};
        escribirB(49,6)={'Respecto a:'};
        
        escribirB(50,6)={'Plano horizontal'};
        escribirB(50,8)={'Inclinación óptima anual'};
        
        escribirB(51,6)={'Fc.Ganancia'};
        escribirB(51,7)={'Ganancia(%)'};
        escribirB(51,8)={'Fc.Ganancia'};
        escribirB(51,9)={'Ganancia(%)'};
        
        %Ganancia respecto al plano horizontal
        for i=1:12
            escribirB(i+51,6)={GanaB_Est_0(i)};
        end
        
        
        for i=1:12
            escribirB(i+51,7)={PorGanaB_Est_0(i)};
        end
        %Medias
        escribirB(64,6)={mean(GanaB_Est_0)};
        escribirB(64,7)={mean(PorGanaB_Est_0)};
        
        %Ganancia respecto a la inclinación óptima anual
        for i=1:12
            escribirB(i+51,8)={GanaB_Est_Anu(i)};
        end
        
        
        for i=1:12
            escribirB(i+51,9)={PorGanaB_Est_Anu(i)};
        end
        %Medias
        escribirB(64,8)={mean(GanaB_Est_Anu)};
        escribirB(64,9)={mean(PorGanaB_Est_Anu)};        
        
        
        %DIFUSA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Inclinación óptima estacional'};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirD(4,i+2) = GradosD(i);
        end
        
        %INVIERNO..........................................................
        %Meses
        escribirD(6,1) = Estacion(1);
        escribirD(5,2)= Meses(12);
        escribirD(6,2)= Meses(1);
        escribirD(7,2)= Meses(2);
        escribirD(8,2)= {'MEDIA(Inv)'};       
        
        %Valores Ddm(0º)-------------------------------
        escribirD(5,3)= {Val_Ddm0(12)};
        escribirD(6,3)= {Val_Ddm0(1)};
        escribirD(7,3)= {Val_Ddm0(2)};
        %Media invierno
                contB1 = Val_Ddm0(12);
                for i=1:2
                    contB1=contB1 + Val_Ddm0(i);
                end
                mediaDd_Inv_0 = contB1/3;

        escribirD(8,3)= {mediaDd_Inv_0};
        
        %Valores Ddm(1º) a Ddm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirD(i+4,j+3)= {DdBeta_Invierno(i,j)};

            end  
        end
        %Media Invierno
           mediaDd_Inv = zeros(1,90);
           suma = 0;
           for i=1:90
               for j= 1:3

                   suma = suma + DdBeta_Invierno(j,i);

               end
               mediaDd_Inv(i) = suma /3;
               suma = 0;
           end
        for a=1:90
            escribirD(8,a+3)= {mediaDd_Inv(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirD(30,1)= Estacion(1);
        escribirD(29,3) = Meses(12);
        escribirD(30,3) = Meses(1);
        escribirD(31,3) = Meses(2);
        escribirD(32,3) = {'MEDIA(Inv)'};
        escribirD(30,2) = {angOptim_Inv};

        for i=1:3
            escribirD(i+28,4)={DdOpt_Inv(i)};
        end
        escribirD(32,4)= {Med_DdOpt_Inv};
        
        
        %PRIMAVERA.........................................................
        escribirD(11,1) = Estacion(2);
        escribirD(10,2)= Meses(3);
        escribirD(11,2)= Meses(4);
        escribirD(12,2)= Meses(5);
        escribirD(13,2)= {'MEDIA(Pri)'};
       
        %Valores Ddm(0º)-------------------------------
        escribirD(10,3)= {Val_Ddm0(3)};
        escribirD(11,3)= {Val_Ddm0(4)};
        escribirD(12,3)= {Val_Ddm0(5)};
        %Media primavera
            contB2 = 0;
            for i=3:5
                contB2=contB2 + Val_Ddm0(i);
            end
            mediaDd_Pri_0 = contB2/3;
            contB2 = 0;

        escribirD(13,3)= {mediaDd_Pri_0};
        
        %Valores Ddm(1º) a Ddm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirD(i+9,j+3)= {DdBeta_Primavera(i,j)};

            end  
        end
        %Media primavera
           mediaDd_Pri = zeros(1,90);
           suma2 = 0;
           for i=1:90
               for j= 1:3

                   suma2 = suma2 + DdBeta_Primavera(j,i);

               end
               mediaDd_Pri(i) = suma2 /3;
               suma2 = 0;

           end
        for a=1:90
            escribirD(13,a+3)= {mediaDd_Pri(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirD(35,1) = Estacion(2);
        escribirD(34,3) = Meses(3);
        escribirD(35,3) = Meses(4);
        escribirD(36,3) = Meses(5);
        escribirD(37,3) = {'MEDIA(Pri)'};
        escribirD(35,2) = {angOptim_Pri};

        for i=1:3
            escribirD(i+33,4)={DdOpt_Pri(i)};
        end
        escribirD(37,4)= {Med_DdOpt_Pri};
        
        
        %VERANO............................................................
        escribirD(16,1) = Estacion(3);
        escribirD(15,2)= Meses(6);
        escribirD(16,2)= Meses(7);
        escribirD(17,2)= Meses(8);
        escribirD(18,2)= {'MEDIA(Ver)'};
        
        %Valores Ddm(0º)-------------------------------
        escribirD(15,3)= {Val_Ddm0(6)};
        escribirD(16,3)= {Val_Ddm0(7)};
        escribirD(17,3)= {Val_Ddm0(8)};
        %Media Verano
            contB3 = 0;
            for i=6:8
                contB3=contB3 + Val_Ddm0(i);
            end
            mediaDd_Ver_0 = contB3/3;
            contB3 = 0;

        escribirD(18,3)= {mediaDd_Ver_0};
        
        %Valores Ddm(1º) a Ddm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirD(i+14,j+3)= {DdBeta_Verano(i,j)};

            end  
        end
        %Media Verano
           mediaDd_Ver = zeros(1,90);
           suma3 = 0;
           for i=1:90
               for j= 1:3

                   suma3 = suma3 + DdBeta_Verano(j,i);

               end
               mediaDd_Ver(i) = suma3 /3;
               suma3 = 0;

           end
        for a=1:90
            escribirD(18,a+3)= {mediaDd_Ver(a)};
        end     
        
        %Valores ÓPTIMOS--------------------------------
        escribirD(40,1) = Estacion(3);
        escribirD(39,3) = Meses(6);
        escribirD(40,3) = Meses(7);
        escribirD(41,3) = Meses(8);
        escribirD(42,3) = {'MEDIA(Ver)'};
        escribirD(40,2) = {angOptim_Ver};

        for i=1:3
            escribirD(i+38,4)={DdOpt_Ver(i)};
        end
        escribirD(42,4)= {Med_DdOpt_Ver};

        
        %OTOÑO.............................................................
        escribirD(21,1) = Estacion(4);
        escribirD(20,2)= Meses(9);
        escribirD(21,2)= Meses(10);
        escribirD(22,2)= Meses(11);
        escribirD(23,2)= {'MEDIA(Oto)'};
        
        %Valores Ddm(0º)-------------------------------
        escribirD(20,3)= {Val_Ddm0(9)};
        escribirD(21,3)= {Val_Ddm0(10)};
        escribirD(22,3)= {Val_Ddm0(11)};
        %Media Otoño
            contB4 = 0;
            for i=9:11
                contB4=contB4 + Val_Ddm0(i);
            end
            mediaDd_Oto_0 = contB4/3;
            contB4 = 0;

        escribirD(23,3)= {mediaDd_Oto_0};
        
        %Valores Bdm(1º) a Bdm(90º)---------------------
         for i=1:3
            for j=1:90

                escribirD(i+19,j+3)= {DdBeta_Otonio(i,j)};

            end  
        end
        %Media Otoño
           mediaDd_Oto = zeros(1,90);
           suma4 = 0;
           for i=1:90
               for j= 1:3

                   suma4 = suma4 + DdBeta_Otonio(j,i);

               end
               mediaDd_Oto(i) = suma4 /3;
               suma4 = 0;

           end
        for a=1:90
            escribirD(23,a+3)= {mediaDd_Oto(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirD(45,1) = Estacion(4);
        escribirD(44,3) = Meses(9);
        escribirD(45,3) = Meses(10);
        escribirD(46,3) = Meses(11);
        escribirD(47,3) = {'MEDIA(Oto)'};
        escribirD(45,2) = {angOptim_Oto};

        for i=1:3
            escribirD(i+43,4)={DdOpt_Oto(i)};
        end
        escribirD(47,4)= {Med_DdOpt_Oto};
        %COMÚN.............................................................
        %Media Anual de Todas las inclinaciones
        escribirD(25,2) = {'MED.ANUAL'};
           
            
        escribirD(25,3) = {mean(Val_Ddm0)};

        media_Dd = zeros(1,90);
        c = 0;

            for m=1:90
                for n=1:12

                    c = c + DdBetaTotal(n,m);
                end

                media_Dd(m)= c/12;

                c=0;
            end

        for j=1:90
            escribirD(25,j+3) = {media_Dd(j)};
        end

        escribirD(27,2) = {'RADIACIÓN DIFUSA A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
        escribirD(28,2) = {'Áng.Óptimo'};
        escribirD(28,4) = {'Ddm(Ópt.Est)'};
        
        
        %RESUMEN----------------------------------
        escribirD(49,1) = {'RESUMEN'};
        
        %TÍTULOS
        escribirD(51,2) = {'Ddm(Ópt)'};
        
        
        %Meses 
        for i=1:13
            escribirD(i+51,1)= Meses(i);
        end
        
        %Ddm óptimo total
            %Rellenamos RadiacionD_optima_Est con los valores óptimos para cada
            %estación 
            RadiacionD_optima_Est = zeros(1,12);

            RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
            RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
            RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero
            
            RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
            RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
            RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo
            
            RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
            RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
            RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

            RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
            RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
            RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre
               
        for i=1:12
           escribirD (i+51,2)={RadiacionD_optima_Est(i)};
        end
        %Media 
        escribirD(64,2)={mean(RadiacionD_optima_Est)};
        
        %Temperaturas
        if (DATOS(15)==1000)

        else 
            escribirD(51,3)={'Temp.(ºC)'};
            for i=1:12
                escribirD(i+51,3)={DATOS(i+14)};
            end
            %Media de las temperaturas 
                  sumT = 0;
                  for i=15:26
                     sumT = sumT + DATOS(i);
                  end

                     mediaT = sumT/12;

            escribirD(64,3) = {mediaT};
        end
        
        %GANANCIAS----------------------------------
        %Títulos
        escribirD(49,5)={'GANANCIAS'};
        escribirD(49,6)={'Respecto a:'};
        
        escribirD(50,6)={'Plano horizontal'};
        escribirD(50,8)={'Inclinación óptima anual'};
        
        escribirD(51,6)={'Fc.Ganancia'};
        escribirD(51,7)={'Ganancia(%)'};
        escribirD(51,8)={'Fc.Ganancia'};
        escribirD(51,9)={'Ganancia(%)'};
        
        %Ganancia respecto al plano horizontal
        for i=1:12
            escribirD(i+51,6)={GanaD_Est_0(i)};
        end
        
        
        for i=1:12
            escribirD(i+51,7)={PorGanaD_Est_0(i)};
        end
        %Medias
        escribirD(64,6)={mean(GanaD_Est_0)};
        escribirD(64,7)={mean(PorGanaD_Est_0)};
        
        %Ganancia respecto a la inclinación óptima anual
        for i=1:12
            escribirD(i+51,8)={GanaD_Est_Anu(i)};
        end
        
        
        for i=1:12
            escribirD(i+51,9)={PorGanaD_Est_Anu(i)};
        end
        %Medias
        escribirD(64,8)={mean(GanaD_Est_Anu)};
        escribirD(64,9)={mean(PorGanaD_Est_Anu)};           
       
        
        %DE ALBEDO::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Inclinación óptima estacional'};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        %Valores de RADIACIÓN para cada inclinación 0º hasta 90º-----------
        for i=1:91
            escribirR(4,i+2) = GradosR(i);
        end
        
        %INVIERNO..........................................................
        %Meses
        escribirR(6,1) = Estacion(1);
        escribirR(5,2)= Meses(12);
        escribirR(6,2)= Meses(1);
        escribirR(7,2)= Meses(2);
        escribirR(8,2)= {'MEDIA(Inv)'};       
        
        %Valores Ddm(0º)-------------------------------
        escribirR(5,3)= {0};
        escribirR(6,3)= {0};
        escribirR(7,3)= {0};
        %Media invierno
        escribirR(8,3)= {0};
        
        %Valores Rdm(1º) a Rdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirR(i+4,j+3)= {RdBeta_Invierno(i,j)};

            end  
        end
        %Media Invierno
           mediaRd_Inv = zeros(1,90);
           suma = 0;
           for i=1:90
               for j= 1:3

                   suma = suma + RdBeta_Invierno(j,i);

               end
               mediaRd_Inv(i) = suma /3;
               suma = 0;
           end
        for a=1:90
            escribirR(8,a+3)= {mediaRd_Inv(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirR(30,1)= Estacion(1);
        escribirR(29,3) = Meses(12);
        escribirR(30,3) = Meses(1);
        escribirR(31,3) = Meses(2);
        escribirR(32,3) = {'MEDIA(Inv)'};
        escribirR(30,2) = {angOptim_Inv};

        for i=1:3
            escribirR(i+28,4)={RdOpt_Inv(i)};
        end
        escribirR(32,4)= {Med_RdOpt_Inv};
        
        
        %PRIMAVERA.........................................................
        escribirR(11,1) = Estacion(2);
        escribirR(10,2)= Meses(3);
        escribirR(11,2)= Meses(4);
        escribirR(12,2)= Meses(5);
        escribirR(13,2)= {'MEDIA(Pri)'};
       
        %Valores Rdm(0º)-------------------------------
        escribirR(10,3)= {0};
        escribirR(11,3)= {0};
        escribirR(12,3)= {0};
        %Media primavera
        escribirR(13,3)= {0};
        
        %Valores Rdm(1º) a Rdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirR(i+9,j+3)= {RdBeta_Primavera(i,j)};

            end  
        end
        %Media primavera
           mediaRd_Pri = zeros(1,90);
           suma2 = 0;
           for i=1:90
               for j= 1:3

                   suma2 = suma2 + RdBeta_Primavera(j,i);

               end
               mediaRd_Pri(i) = suma2 /3;
               suma2 = 0;

           end
        for a=1:90
            escribirR(13,a+3)= {mediaRd_Pri(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirR(35,1) = Estacion(2);
        escribirR(34,3) = Meses(3);
        escribirR(35,3) = Meses(4);
        escribirR(36,3) = Meses(5);
        escribirR(37,3) = {'MEDIA(Pri)'};
        escribirR(35,2) = {angOptim_Pri};

        for i=1:3
            escribirR(i+33,4)={RdOpt_Pri(i)};
        end
        escribirR(37,4)= {Med_RdOpt_Pri};
        
        
        %VERANO............................................................
        escribirR(16,1) = Estacion(3);
        escribirR(15,2)= Meses(6);
        escribirR(16,2)= Meses(7);
        escribirR(17,2)= Meses(8);
        escribirR(18,2)= {'MEDIA(Ver)'};
        
        %Valores Rdm(0º)-------------------------------
        escribirR(15,3)= {0};
        escribirR(16,3)= {0};
        escribirR(17,3)= {0};
        %Media Verano
        escribirR(18,3)= {0};
        
        %Valores Rdm(1º) a Rdm(90º)---------------------
        for i=1:3
            for j=1:90

                escribirR(i+14,j+3)= {RdBeta_Verano(i,j)};

            end  
        end
        %Media Verano
           mediaRd_Ver = zeros(1,90);
           suma3 = 0;
           for i=1:90
               for j= 1:3

                   suma3 = suma3 + RdBeta_Verano(j,i);

               end
               mediaRd_Ver(i) = suma3 /3;
               suma3 = 0;

           end
        for a=1:90
            escribirR(18,a+3)= {mediaRd_Ver(a)};
        end     
        
        %Valores ÓPTIMOS--------------------------------
        escribirR(40,1) = Estacion(3);
        escribirR(39,3) = Meses(6);
        escribirR(40,3) = Meses(7);
        escribirR(41,3) = Meses(8);
        escribirR(42,3) = {'MEDIA(Ver)'};
        escribirR(40,2) = {angOptim_Ver};

        for i=1:3
            escribirR(i+38,4)={RdOpt_Ver(i)};
        end
        escribirR(42,4)= {Med_RdOpt_Ver};

        
        %OTOÑO.............................................................
        escribirR(21,1) = Estacion(4);
        escribirR(20,2)= Meses(9);
        escribirR(21,2)= Meses(10);
        escribirR(22,2)= Meses(11);
        escribirR(23,2)= {'MEDIA(Oto)'};
        
        %Valores Rdm(0º)-------------------------------
        escribirR(20,3)= {0};
        escribirR(21,3)= {0};
        escribirR(22,3)= {0};
        
        %Media Otoño
        escribirR(23,3)= {0};
        
        %Valores Rdm(1º) a Rdm(90º)---------------------
         for i=1:3
            for j=1:90

                escribirR(i+19,j+3)= {RdBeta_Otonio(i,j)};

            end  
        end
        %Media Otoño
           mediaRd_Oto = zeros(1,90);
           suma4 = 0;
           for i=1:90
               for j= 1:3

                   suma4 = suma4 + RdBeta_Otonio(j,i);

               end
               mediaRd_Oto(i) = suma4 /3;
               suma4 = 0;

           end
        for a=1:90
            escribirR(23,a+3)= {mediaRd_Oto(a)};
        end
        
        %Valores ÓPTIMOS--------------------------------
        escribirR(45,1) = Estacion(4);
        escribirR(44,3) = Meses(9);
        escribirR(45,3) = Meses(10);
        escribirR(46,3) = Meses(11);
        escribirR(47,3) = {'MEDIA(Oto)'};
        escribirR(45,2) = {angOptim_Oto};

        for i=1:3
            escribirR(i+43,4)={RdOpt_Oto(i)};
        end
        escribirR(47,4)= {Med_RdOpt_Oto};
        %COMÚN.............................................................
        %Media Anual de Todas las inclinaciones
        escribirR(25,2) = {'MED.ANUAL'};
           
            
        escribirR(25,3) = {0};

        media_Rd = zeros(1,90);
        c = 0;

            for m=1:90
                for n=1:12

                    c = c + RdBetaTotal(n,m);
                end

                media_Rd(m)= c/12;

                c=0;
            end

        for j=1:90
            escribirR(25,j+3) = {media_Rd(j)};
        end

        escribirR(27,2) = {'RADIACIÓN DE ALBEDO A LAS INCLINACIONES ÓPTIMAS ESTACIONALES'};
        escribirR(28,2) = {'Áng.Óptimo'};
        escribirR(28,4) = {'Rdm(Ópt.Est)'};
        
        
        %RESUMEN----------------------------------
        escribirR(49,1) = {'RESUMEN'};
        
        %TÍTULOS
        escribirR(51,2) = {'Rdm(Ópt)'};
        
        
        %Meses 
        for i=1:13
            escribirR(i+51,1)= Meses(i);
        end
        
        %Gdm óptimo total
            %Rellenamos RadiacionR_optima_Est con los valores óptimos para cada
            %estación 
            RadiacionR_optima_Est = zeros(1,12);

            RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
            RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
            RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febero
            
            RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
            RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
            RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo
            
            RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
            RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
            RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

            RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
            RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
            RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre
               
        for i=1:12
           escribirR (i+51,2)={RadiacionR_optima_Est(i)};
        end
        %Media 
        escribirR(64,2)={mean(RadiacionR_optima_Est)};
        
        %Temperaturas
        if (DATOS(15)==1000)

        else 
            escribirR(51,3)={'Temp.(ºC)'};
            for i=1:12
                escribirR(i+51,3)={DATOS(i+14)};
            end
            %Media de las temperaturas 
                  sumT = 0;
                  for i=15:26
                     sumT = sumT + DATOS(i);
                  end

                     mediaT = sumT/12;

            escribirR(64,3) = {mediaT};
        end
        
        %GANANCIAS----------------------------------
        %Títulos
        escribirR(49,5)={'GANANCIAS'};
        escribirR(49,6)={'Respecto a:'};
        
        escribirR(50,6)={'Plano horizontal'};
        escribirR(50,8)={'Inclinación óptima anual'};
        
        escribirR(51,6)={'Fc.Ganancia'};
        escribirR(51,7)={'Ganancia(%)'};
        escribirR(51,8)={'Fc.Ganancia'};
        escribirR(51,9)={'Ganancia(%)'};
        
        %Ganancia respecto al plano horizontal
        for i=1:12
            escribirR(i+51,6)={'-'};
        end
        
        
        for i=1:12
            escribirR(i+51,7)={'-'};
        end
        %Medias
        escribirR(64,6)={'-'};
        escribirR(64,7)={'-'};
       
        %Ganancia respecto a la inclinacion óptima anual
        if angulo_optimo==0 %Por tanto Rdm(0º) = 0
            for i=1:12
               escribirR(i+51,8)={'-'};
            end


            for i=1:12
               escribirR(i+51,9)={'-'};
           end
           %Medias
          escribirR(64,8)={'-'};
          escribirR(64,9)={'-'};   
                        
        else %Cualquier otro valor
           for i=1:12
              escribirR(i+51,8)={GanaR_Est_Anu(i)};
           end


           for i=1:12
              escribirR(i+51,9)={PorGanaR_Est_Anu(i)};
           end
              %Medias
              escribirR(64,8)={mean(GanaR_Est_Anu)};
              escribirR(64,9)={mean(PorGanaR_Est_Anu)};      
       end         
        
        %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
        xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
        xlswrite(fullfile(ruta,nombre),escribirB,'Hoja2','A1');
        xlswrite(fullfile(ruta,nombre),escribirD,'Hoja3','A1');
        xlswrite(fullfile(ruta,nombre),escribirR,'Hoja4','A1');

        warning('off','MATLAB:xlswrite:AddSheet');
        
        msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
end


% --- Executes on button press in Informe.
function Informe_Callback(hObject, eventdata, handles)
%G
global  DATOS RadG0 medRadG0 G_optima_Est medG_optima_Est ;
global GdOpt_Inv GdOpt_Pri GdOpt_Ver  GdOpt_Oto;
%B
global Val_Bdm0 medRadB0 B_optima_Est medB_optima_Est ;
global BdOpt_Inv BdOpt_Pri BdOpt_Ver  BdOpt_Oto;
%D
global Val_Ddm0 medRadD0 D_optima_Est medD_optima_Est ;
global DdOpt_Inv DdOpt_Pri DdOpt_Ver  DdOpt_Oto;
%R
global Val_Rdm0 medRadR0 R_optima_Est medR_optima_Est ;
global RdOpt_Inv RdOpt_Pri RdOpt_Ver  RdOpt_Oto;

%Ganancias
global medPorGanaG_Est_0 PorGanaG_Est_0 medPorGanaG_Est_Anu PorGanaG_Est_Anu;
global medPorGanaB_Est_0 PorGanaB_Est_0 medPorGanaB_Est_Anu PorGanaB_Est_Anu;
global medPorGanaD_Est_0 PorGanaD_Est_0 medPorGanaD_Est_Anu PorGanaD_Est_Anu;
global medPorGanaR_Est_0 PorGanaR_Est_0 medPorGanaR_Est_Anu PorGanaR_Est_Anu;

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
        
%Radiación para angulos óptimos.............        
G_optima_Est = zeros(1,12);

G_optima_Est(12)= GdOpt_Inv(1); %Diciembre
G_optima_Est(1)= GdOpt_Inv(2); %Enero
G_optima_Est(2)= GdOpt_Inv(3); %Feber

G_optima_Est(3)= GdOpt_Pri(1); %Marzo
G_optima_Est(4)= GdOpt_Pri(2); %Abril
G_optima_Est(5)= GdOpt_Pri(3); %Mayo

G_optima_Est(6)= GdOpt_Ver(1); %Junio
G_optima_Est(7)= GdOpt_Ver(2); %Julio
G_optima_Est(8)= GdOpt_Ver(3); %Agosto

G_optima_Est(9)= GdOpt_Oto(1); %Septiembre
G_optima_Est(10)= GdOpt_Oto(2); %Octubre
G_optima_Est(11)= GdOpt_Oto(3); %Noviembre
%Media
medG_optima_Est = mean(G_optima_Est);

%Ganancias  
medPorGanaG_Est_0 = mean(PorGanaG_Est_0);
medPorGanaG_Est_Anu = mean(PorGanaG_Est_Anu);

%DIRECTA-----------------------------------
%Media radiación directa 0º
medRadB0 = mean (Val_Bdm0);

%Radiación para angulos óptimos.............        
B_optima_Est = zeros(1,12);

B_optima_Est(12)= BdOpt_Inv(1); %Diciembre
B_optima_Est(1)= BdOpt_Inv(2); %Enero
B_optima_Est(2)= BdOpt_Inv(3); %Feber

B_optima_Est(3)= BdOpt_Pri(1); %Marzo
B_optima_Est(4)= BdOpt_Pri(2); %Abril
B_optima_Est(5)= BdOpt_Pri(3); %Mayo

B_optima_Est(6)= BdOpt_Ver(1); %Junio
B_optima_Est(7)= BdOpt_Ver(2); %Julio
B_optima_Est(8)= BdOpt_Ver(3); %Agosto

B_optima_Est(9)= BdOpt_Oto(1); %Septiembre
B_optima_Est(10)= BdOpt_Oto(2); %Octubre
B_optima_Est(11)= BdOpt_Oto(3); %Noviembre
%Media
medB_optima_Est = mean(B_optima_Est);

%Ganancias  
medPorGanaB_Est_0 = mean(PorGanaB_Est_0);  
medPorGanaB_Est_Anu = mean(PorGanaB_Est_Anu);  

%DIFUSA-------------------------------------
%Media radiación directa 0º
medRadD0 = mean (Val_Ddm0);

%Radiación para angulos óptimos.............        
D_optima_Est = zeros(1,12);

D_optima_Est(12)= DdOpt_Inv(1); %Diciembre
D_optima_Est(1)= DdOpt_Inv(2); %Enero
D_optima_Est(2)= DdOpt_Inv(3); %Feber

D_optima_Est(3)= DdOpt_Pri(1); %Marzo
D_optima_Est(4)= DdOpt_Pri(2); %Abril
D_optima_Est(5)= DdOpt_Pri(3); %Mayo

D_optima_Est(6)= DdOpt_Ver(1); %Junio
D_optima_Est(7)= DdOpt_Ver(2); %Julio
D_optima_Est(8)= DdOpt_Ver(3); %Agosto

D_optima_Est(9)= DdOpt_Oto(1); %Septiembre
D_optima_Est(10)= DdOpt_Oto(2); %Octubre
D_optima_Est(11)= DdOpt_Oto(3); %Noviembre
%Media
medD_optima_Est = mean(D_optima_Est);

%Ganancias    
medPorGanaD_Est_0 = mean(PorGanaD_Est_0);  
medPorGanaD_Est_Anu = mean(PorGanaD_Est_Anu); 

%ALBEDO-----------------------------------
%Media radiación directa 0º
Val_Rdm0 = zeros(1,12);
medRadR0 = 0;

%Radiación para angulos óptimos.............        
R_optima_Est = zeros(1,12);

R_optima_Est(12)= RdOpt_Inv(1); %Diciembre
R_optima_Est(1)= RdOpt_Inv(2); %Enero
R_optima_Est(2)= RdOpt_Inv(3); %Feber

R_optima_Est(3)= RdOpt_Pri(1); %Marzo
R_optima_Est(4)= RdOpt_Pri(2); %Abril
R_optima_Est(5)= RdOpt_Pri(3); %Mayo

R_optima_Est(6)= RdOpt_Ver(1); %Junio
R_optima_Est(7)= RdOpt_Ver(2); %Julio
R_optima_Est(8)= RdOpt_Ver(3); %Agosto

R_optima_Est(9)= RdOpt_Oto(1); %Septiembre
R_optima_Est(10)= RdOpt_Oto(2); %Octubre
R_optima_Est(11)= RdOpt_Oto(3); %Noviembre
%Media
medR_optima_Est = mean(R_optima_Est);

%Ganancias   
medPorGanaR_Est_0 = mean(PorGanaR_Est_0);
medPorGanaR_Est_Anu = mean(PorGanaR_Est_Anu);

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'
        report ReportOptEstacional.rpt;

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

close('OrientSol 3.0 - Inclinación óptima estacional');
 


% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_OptEstacional;

close('OrientSol 3.0 - Inclinación óptima estacional');

% --- Executes on button press in Energia.
function Energia_Callback(hObject, eventdata, handles)

global DATOS;

global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;

global RADIACION_OST;

global VOLVER_ENER;

VOLVER_ENER = 2;

            %Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
            %estación 

            RadiacionG_optima_Est = zeros(1,12);

            RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
            RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
            RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

            RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
            RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
            RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

            RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
            RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
            RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

            RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
            RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
            RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre

RADIACION_OST  = RadiacionG_optima_Est;

if (DATOS(15)==1000)
   
   Energia_Osterwald_N;  
   close('OrientSol 3.0 - Inclinación óptima estacional');
   
else 
   
   Energia_Osterwald;
   close('OrientSol 3.0 - Inclinación óptima estacional');
   
end


%global RADIACION
%RADIACION  = mean(RadiacionG_optima_Est);
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
