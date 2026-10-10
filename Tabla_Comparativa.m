function varargout = Tabla_Comparativa(varargin)
% TABLA_COMPARATIVA MATLAB code for Tabla_Comparativa.fig
%      TABLA_COMPARATIVA, by itself, creates a new TABLA_COMPARATIVA or raises the existing
%      singleton*.
%
%      H = TABLA_COMPARATIVA returns the handle to a new TABLA_COMPARATIVA or the handle to
%      the existing singleton*.
%
%      TABLA_COMPARATIVA('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_COMPARATIVA.M with the given input arguments.
%
%      TABLA_COMPARATIVA('Property','Value',...) creates a new TABLA_COMPARATIVA or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_Comparativa_OpeningFcn gets called.  Ang_Opt
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_Comparativa_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_Comparativa

% Last Modified by GUIDE v2.5 22-Jan-2015 17:17:59

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_Comparativa_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_Comparativa_OutputFcn, ...
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


% --- Executes just before Tabla_Comparativa is made visible.
function Tabla_Comparativa_OpeningFcn(hObject, eventdata, handles, varargin)

global OPCION_COMP;

global NOMBRE_CIUDAD DATOS;
%Inclinación óptima anual
global Radiacion_optima suma_angulo_optimo;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar media_GdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal media_GdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal media_GdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes media_Gd2Ejes;



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
    
    set(handles.Temperatura1,'Visible','off');
    set(handles.Temperatura2,'Visible','off');
    %set(handles.COptEst_ene,'Visible','off');  Es blanco, no hace falta
 
      
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

    
%Mostrar valores para LA inclinación óptima ANUAL      
    set(handles.COptAnu_ene,'String',roundn(Radiacion_optima(1),-2));
    set(handles.COptAnu_feb,'String',roundn(Radiacion_optima(2),-2));
    set(handles.COptAnu_mar,'String',roundn(Radiacion_optima(3),-2));
    set(handles.COptAnu_abr,'String',roundn(Radiacion_optima(4),-2));
    set(handles.COptAnu_may,'String',roundn(Radiacion_optima(5),-2));
    set(handles.COptAnu_jun,'String',roundn(Radiacion_optima(6),-2));
    set(handles.COptAnu_jul,'String',roundn(Radiacion_optima(7),-2));
    set(handles.COptAnu_ago,'String',roundn(Radiacion_optima(8),-2));
    set(handles.COptAnu_sep,'String',roundn(Radiacion_optima(9),-2));
    set(handles.COptAnu_oct,'String',roundn(Radiacion_optima(10),-2));
    set(handles.COptAnu_nov,'String',roundn(Radiacion_optima(11),-2));    
    set(handles.COptAnu_dic,'String',roundn(Radiacion_optima(12),-2));
    
    set(handles.COptAnu_media,'String',roundn(mean(suma_angulo_optimo),-2));    

%Mostrar valores para LA inclinación óptima ESTACIONAL   
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
    set(handles.COptEst_dic,'String',roundn(RadiacionG_optima_Est(12),-2));
    
    set(handles.COptEst_media,'String',roundn(mean(RadiacionG_optima_Est),-2));
    
%Mostrar valores para el seguimiento a un eje POLAR     
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
    
%Mostrar valores para el seguimiento a un eje AZIMUTAL    
    set(handles.CEjeAzi_ene,'String',roundn(GdEjeAzimutal(1),-2));
    set(handles.CEjeAzi_feb,'String',roundn(GdEjeAzimutal(2),-2));
    set(handles.CEjeAzi_mar,'String',roundn(GdEjeAzimutal(3),-2));
    set(handles.CEjeAzi_abr,'String',roundn(GdEjeAzimutal(4),-2));
    set(handles.CEjeAzi_may,'String',roundn(GdEjeAzimutal(5),-2));
    set(handles.CEjeAzi_jun,'String',roundn(GdEjeAzimutal(6),-2));
    set(handles.CEjeAzi_jul,'String',roundn(GdEjeAzimutal(7),-2));
    set(handles.CEjeAzi_ago,'String',roundn(GdEjeAzimutal(8),-2));
    set(handles.CEjeAzi_sep,'String',roundn(GdEjeAzimutal(9),-2));
    set(handles.CEjeAzi_oct,'String',roundn(GdEjeAzimutal(10),-2));
    set(handles.CEjeAzi_nov,'String',roundn(GdEjeAzimutal(11),-2));
    set(handles.CEjeAzi_dic,'String',roundn(GdEjeAzimutal(12),-2));
    
    set(handles.CEjeAzi_media,'String',roundn(media_GdEjeAzimutal,-2));
    
%Mostrar valores para el seguimiento a un eje HORIZONTAL
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

%Mostrar valores para el seguimiento a DOS EJES
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
    
    
    
% Choose default command line output for Tabla_Comparativa
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_Comparativa wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_Comparativa_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;

% --- Executes during object creation, after setting all properties.
function tt_CreateFcn(hObject, eventdata, handles)
% hObject    handle to tt (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called



% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global OPCION_COMP;

global DATOS Val_Bdm0 Val_Ddm0;
%Inclinación óptima anual
global Radiacion_optima suma_angulo_optimo;
global Radiacion_Bd_Optima media_Bd_optimo;
global Radiacion_Dd_Optima media_Dd_optimo;
global Radiacion_Rd_Optima media_Rd_optimo;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
global BdOpt_Inv BdOpt_Pri BdOpt_Ver BdOpt_Oto;
global DdOpt_Inv DdOpt_Pri DdOpt_Ver DdOpt_Oto;
global RdOpt_Inv RdOpt_Pri RdOpt_Ver RdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar media_GdEjePolar;
global BdEjePolar media_BdEjePolar;
global DdEjePolar media_DdEjePolar;
global RdEjePolar media_RdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal media_GdEjeAzimutal;
global BdEjeAzimutal media_BdEjeAzimutal;
global DdEjeAzimutal media_DdEjeAzimutal;
global RdEjeAzimutal media_RdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal media_GdEjeHorizontal;
global BdEjeHorizontal media_BdEjeHorizontal;
global DdEjeHorizontal media_DdEjeHorizontal;
global RdEjeHorizontal media_RdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes media_Gd2Ejes;
global Bd2Ejes media_Bd2Ejes;
global Dd2Ejes media_Dd2Ejes;
global Rd2Ejes media_Rd2Ejes;



Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
        
        OPCION_COMP = 1;
        
        set(handles.titulo,'String','Radiación global media mensual (kWh/m²/día)');
        
        set(handles.Componente_0,'String','Gdm (0 º)');
        set(handles.Componente_Anu,'String','Gdm (Inclinación');
        set(handles.Componente_Est,'String','Gdm (Inclinación');
        set(handles.Componente_EjePol,'String','Gdm (Seguim.');
        set(handles.Componente_EjeAzi,'String','Gdm (Seguim.');
        set(handles.Componente_EjeHor,'String','Gdm (Seguim. a');
        set(handles.Componente_2Ejes,'String','Gdm (Seguim.');
        

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

        %Mostrar valores para LA inclinación óptima ANUAL      
            set(handles.COptAnu_ene,'String',roundn(Radiacion_optima(1),-2));
            set(handles.COptAnu_feb,'String',roundn(Radiacion_optima(2),-2));
            set(handles.COptAnu_mar,'String',roundn(Radiacion_optima(3),-2));
            set(handles.COptAnu_abr,'String',roundn(Radiacion_optima(4),-2));
            set(handles.COptAnu_may,'String',roundn(Radiacion_optima(5),-2));
            set(handles.COptAnu_jun,'String',roundn(Radiacion_optima(6),-2));
            set(handles.COptAnu_jul,'String',roundn(Radiacion_optima(7),-2));
            set(handles.COptAnu_ago,'String',roundn(Radiacion_optima(8),-2));
            set(handles.COptAnu_sep,'String',roundn(Radiacion_optima(9),-2));
            set(handles.COptAnu_oct,'String',roundn(Radiacion_optima(10),-2));
            set(handles.COptAnu_nov,'String',roundn(Radiacion_optima(11),-2));    
            set(handles.COptAnu_dic,'String',roundn(Radiacion_optima(12),-2));

            set(handles.COptAnu_media,'String',roundn(mean(suma_angulo_optimo),-2));    

        %Mostrar valores para LA inclinación óptima ESTACIONAL   
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
            set(handles.COptEst_dic,'String',roundn(RadiacionG_optima_Est(12),-2));

            set(handles.COptEst_media,'String',roundn(mean(RadiacionG_optima_Est),-2));

        %Mostrar valores para el seguimiento a un eje POLAR     
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

        %Mostrar valores para el seguimiento a un eje AZIMUTAL    
            set(handles.CEjeAzi_ene,'String',roundn(GdEjeAzimutal(1),-2));
            set(handles.CEjeAzi_feb,'String',roundn(GdEjeAzimutal(2),-2));
            set(handles.CEjeAzi_mar,'String',roundn(GdEjeAzimutal(3),-2));
            set(handles.CEjeAzi_abr,'String',roundn(GdEjeAzimutal(4),-2));
            set(handles.CEjeAzi_may,'String',roundn(GdEjeAzimutal(5),-2));
            set(handles.CEjeAzi_jun,'String',roundn(GdEjeAzimutal(6),-2));
            set(handles.CEjeAzi_jul,'String',roundn(GdEjeAzimutal(7),-2));
            set(handles.CEjeAzi_ago,'String',roundn(GdEjeAzimutal(8),-2));
            set(handles.CEjeAzi_sep,'String',roundn(GdEjeAzimutal(9),-2));
            set(handles.CEjeAzi_oct,'String',roundn(GdEjeAzimutal(10),-2));
            set(handles.CEjeAzi_nov,'String',roundn(GdEjeAzimutal(11),-2));
            set(handles.CEjeAzi_dic,'String',roundn(GdEjeAzimutal(12),-2));

            set(handles.CEjeAzi_media,'String',roundn(media_GdEjeAzimutal,-2));

        %Mostrar valores para el seguimiento a un eje HORIZONTAL
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

        %Mostrar valores para el seguimiento a DOS EJES
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

        
    case 2 %Directa  
        
        OPCION_COMP = 2;
        
        set(handles.titulo,'String','Radiación directa media mensual (kWh/m²/día)');
        
        set(handles.Componente_0,'String','Bdm (0 º)');
        set(handles.Componente_Anu,'String','Bdm (Inclinación');
        set(handles.Componente_Est,'String','Bdm (Inclinación');
        set(handles.Componente_EjePol,'String','Bdm (Seguim.');
        set(handles.Componente_EjeAzi,'String','Bdm (Seguim.');
        set(handles.Componente_EjeHor,'String','Bdm (Seguim. a');
        set(handles.Componente_2Ejes,'String','Bdm (Seguim.');

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

        %Mostrar valores para LA inclinación óptima ANUAL      
            set(handles.COptAnu_ene,'String',roundn(Radiacion_Bd_Optima(1),-2));
            set(handles.COptAnu_feb,'String',roundn(Radiacion_Bd_Optima(2),-2));
            set(handles.COptAnu_mar,'String',roundn(Radiacion_Bd_Optima(3),-2));
            set(handles.COptAnu_abr,'String',roundn(Radiacion_Bd_Optima(4),-2));
            set(handles.COptAnu_may,'String',roundn(Radiacion_Bd_Optima(5),-2));
            set(handles.COptAnu_jun,'String',roundn(Radiacion_Bd_Optima(6),-2));
            set(handles.COptAnu_jul,'String',roundn(Radiacion_Bd_Optima(7),-2));
            set(handles.COptAnu_ago,'String',roundn(Radiacion_Bd_Optima(8),-2));
            set(handles.COptAnu_sep,'String',roundn(Radiacion_Bd_Optima(9),-2));
            set(handles.COptAnu_oct,'String',roundn(Radiacion_Bd_Optima(10),-2));
            set(handles.COptAnu_nov,'String',roundn(Radiacion_Bd_Optima(11),-2));    
            set(handles.COptAnu_dic,'String',roundn(Radiacion_Bd_Optima(12),-2));

            set(handles.COptAnu_media,'String',roundn(mean(media_Bd_optimo),-2));    

        %Mostrar valores para LA inclinación óptima ESTACIONAL   
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
            set(handles.COptEst_dic,'String',roundn(RadiacionB_optima_Est(12),-2));

            set(handles.COptEst_media,'String',roundn(mean(RadiacionB_optima_Est),-2));

        %Mostrar valores para el seguimiento a un eje POLAR     
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

        %Mostrar valores para el seguimiento a un eje AZIMUTAL    
            set(handles.CEjeAzi_ene,'String',roundn(BdEjeAzimutal(1),-2));
            set(handles.CEjeAzi_feb,'String',roundn(BdEjeAzimutal(2),-2));
            set(handles.CEjeAzi_mar,'String',roundn(BdEjeAzimutal(3),-2));
            set(handles.CEjeAzi_abr,'String',roundn(BdEjeAzimutal(4),-2));
            set(handles.CEjeAzi_may,'String',roundn(BdEjeAzimutal(5),-2));
            set(handles.CEjeAzi_jun,'String',roundn(BdEjeAzimutal(6),-2));
            set(handles.CEjeAzi_jul,'String',roundn(BdEjeAzimutal(7),-2));
            set(handles.CEjeAzi_ago,'String',roundn(BdEjeAzimutal(8),-2));
            set(handles.CEjeAzi_sep,'String',roundn(BdEjeAzimutal(9),-2));
            set(handles.CEjeAzi_oct,'String',roundn(BdEjeAzimutal(10),-2));
            set(handles.CEjeAzi_nov,'String',roundn(BdEjeAzimutal(11),-2));
            set(handles.CEjeAzi_dic,'String',roundn(BdEjeAzimutal(12),-2));

            set(handles.CEjeAzi_media,'String',roundn(media_BdEjeAzimutal,-2));

        %Mostrar valores para el seguimiento a un eje HORIZONTAL
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

        %Mostrar valores para el seguimiento a DOS EJES
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
 
        
        
    case 3 %Difusa
        
        OPCION_COMP = 3;
        
        set(handles.titulo,'String','Radiación difusa media mensual (kWh/m²/día)');
        
        set(handles.Componente_0,'String','Ddm (0 º)');
        set(handles.Componente_Anu,'String','Ddm (Inclinación');
        set(handles.Componente_Est,'String','Ddm (Inclinación');
        set(handles.Componente_EjePol,'String','Ddm (Seguim.');
        set(handles.Componente_EjeAzi,'String','Ddm (Seguim.');
        set(handles.Componente_EjeHor,'String','Ddm (Seguim. a');
        set(handles.Componente_2Ejes,'String','Ddm (Seguim.');
        

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

        %Mostrar valores para LA inclinación óptima ANUAL      
            set(handles.COptAnu_ene,'String',roundn(Radiacion_Dd_Optima(1),-2));
            set(handles.COptAnu_feb,'String',roundn(Radiacion_Dd_Optima(2),-2));
            set(handles.COptAnu_mar,'String',roundn(Radiacion_Dd_Optima(3),-2));
            set(handles.COptAnu_abr,'String',roundn(Radiacion_Dd_Optima(4),-2));
            set(handles.COptAnu_may,'String',roundn(Radiacion_Dd_Optima(5),-2));
            set(handles.COptAnu_jun,'String',roundn(Radiacion_Dd_Optima(6),-2));
            set(handles.COptAnu_jul,'String',roundn(Radiacion_Dd_Optima(7),-2));
            set(handles.COptAnu_ago,'String',roundn(Radiacion_Dd_Optima(8),-2));
            set(handles.COptAnu_sep,'String',roundn(Radiacion_Dd_Optima(9),-2));
            set(handles.COptAnu_oct,'String',roundn(Radiacion_Dd_Optima(10),-2));
            set(handles.COptAnu_nov,'String',roundn(Radiacion_Dd_Optima(11),-2));    
            set(handles.COptAnu_dic,'String',roundn(Radiacion_Dd_Optima(12),-2));

            set(handles.COptAnu_media,'String',roundn(mean(media_Dd_optimo),-2));    

        %Mostrar valores para LA inclinación óptima ESTACIONAL   
                %Rellenamos RadiacionB_optima_Est con los valores óptimos para cada
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
            set(handles.COptEst_dic,'String',roundn(RadiacionD_optima_Est(12),-2));

            set(handles.COptEst_media,'String',roundn(mean(RadiacionD_optima_Est),-2));

        %Mostrar valores para el seguimiento a un eje POLAR     
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

        %Mostrar valores para el seguimiento a un eje AZIMUTAL    
            set(handles.CEjeAzi_ene,'String',roundn(DdEjeAzimutal(1),-2));
            set(handles.CEjeAzi_feb,'String',roundn(DdEjeAzimutal(2),-2));
            set(handles.CEjeAzi_mar,'String',roundn(DdEjeAzimutal(3),-2));
            set(handles.CEjeAzi_abr,'String',roundn(DdEjeAzimutal(4),-2));
            set(handles.CEjeAzi_may,'String',roundn(DdEjeAzimutal(5),-2));
            set(handles.CEjeAzi_jun,'String',roundn(DdEjeAzimutal(6),-2));
            set(handles.CEjeAzi_jul,'String',roundn(DdEjeAzimutal(7),-2));
            set(handles.CEjeAzi_ago,'String',roundn(DdEjeAzimutal(8),-2));
            set(handles.CEjeAzi_sep,'String',roundn(DdEjeAzimutal(9),-2));
            set(handles.CEjeAzi_oct,'String',roundn(DdEjeAzimutal(10),-2));
            set(handles.CEjeAzi_nov,'String',roundn(DdEjeAzimutal(11),-2));
            set(handles.CEjeAzi_dic,'String',roundn(DdEjeAzimutal(12),-2));

            set(handles.CEjeAzi_media,'String',roundn(media_DdEjeAzimutal,-2));

        %Mostrar valores para el seguimiento a un eje HORIZONTAL
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

        %Mostrar valores para el seguimiento a DOS EJES
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


    case 4 %Albedo  
        
        OPCION_COMP = 4;
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_Anu,'String','Rdm (Inclinación');
        set(handles.Componente_Est,'String','Rdm (Inclinación');
        set(handles.Componente_EjePol,'String','Rdm (Seguim.');
        set(handles.Componente_EjeAzi,'String','Rdm (Seguim.');
        set(handles.Componente_EjeHor,'String','Rdm (Seguim. a');
        set(handles.Componente_2Ejes,'String','Rdm (Seguim.');
       
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

        %Mostrar valores para LA inclinación óptima ANUAL      
            set(handles.COptAnu_ene,'String',roundn(Radiacion_Rd_Optima(1),-2));
            set(handles.COptAnu_feb,'String',roundn(Radiacion_Rd_Optima(2),-2));
            set(handles.COptAnu_mar,'String',roundn(Radiacion_Rd_Optima(3),-2));
            set(handles.COptAnu_abr,'String',roundn(Radiacion_Rd_Optima(4),-2));
            set(handles.COptAnu_may,'String',roundn(Radiacion_Rd_Optima(5),-2));
            set(handles.COptAnu_jun,'String',roundn(Radiacion_Rd_Optima(6),-2));
            set(handles.COptAnu_jul,'String',roundn(Radiacion_Rd_Optima(7),-2));
            set(handles.COptAnu_ago,'String',roundn(Radiacion_Rd_Optima(8),-2));
            set(handles.COptAnu_sep,'String',roundn(Radiacion_Rd_Optima(9),-2));
            set(handles.COptAnu_oct,'String',roundn(Radiacion_Rd_Optima(10),-2));
            set(handles.COptAnu_nov,'String',roundn(Radiacion_Rd_Optima(11),-2));    
            set(handles.COptAnu_dic,'String',roundn(Radiacion_Rd_Optima(12),-2));

            set(handles.COptAnu_media,'String',roundn(mean(media_Rd_optimo),-2));    

        %Mostrar valores para LA inclinación óptima ESTACIONAL   
                %Rellenamos RadiacionR_optima_Est con los valores óptimos para cada
                %estación 
                RadiacionR_optima_Est = zeros(1,12);

                RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
                RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
                RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febrero
                
                RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
                RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
                RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

                RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
                RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
                RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

                RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
                RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
                RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre

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
            set(handles.COptEst_dic,'String',roundn(RadiacionR_optima_Est(12),-2));

            set(handles.COptEst_media,'String',roundn(mean(RadiacionR_optima_Est),-2));

        %Mostrar valores para el seguimiento a un eje POLAR     
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

        %Mostrar valores para el seguimiento a un eje AZIMUTAL    
            set(handles.CEjeAzi_ene,'String',roundn(RdEjeAzimutal(1),-2));
            set(handles.CEjeAzi_feb,'String',roundn(RdEjeAzimutal(2),-2));
            set(handles.CEjeAzi_mar,'String',roundn(RdEjeAzimutal(3),-2));
            set(handles.CEjeAzi_abr,'String',roundn(RdEjeAzimutal(4),-2));
            set(handles.CEjeAzi_may,'String',roundn(RdEjeAzimutal(5),-2));
            set(handles.CEjeAzi_jun,'String',roundn(RdEjeAzimutal(6),-2));
            set(handles.CEjeAzi_jul,'String',roundn(RdEjeAzimutal(7),-2));
            set(handles.CEjeAzi_ago,'String',roundn(RdEjeAzimutal(8),-2));
            set(handles.CEjeAzi_sep,'String',roundn(RdEjeAzimutal(9),-2));
            set(handles.CEjeAzi_oct,'String',roundn(RdEjeAzimutal(10),-2));
            set(handles.CEjeAzi_nov,'String',roundn(RdEjeAzimutal(11),-2));
            set(handles.CEjeAzi_dic,'String',roundn(RdEjeAzimutal(12),-2));

            set(handles.CEjeAzi_media,'String',roundn(media_RdEjeAzimutal,-2));

        %Mostrar valores para el seguimiento a un eje HORIZONTAL
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

        %Mostrar valores para el seguimiento a DOS EJES
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
            
        
end
% hObject    handle to Componente (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns Componente contents as cell array
%        contents{get(hObject,'Value')} returns selected item from Componente

guidata(hObject, handles);

% --- Executes on button press in Excel.
function Excel_Callback(hObject, eventdata, handles)

global OPCION_COMP;

global NOMBRE_CIUDAD  DATOS Val_Bdm0 Val_Ddm0;
%Inclinación óptima anual
global Radiacion_optima suma_angulo_optimo;
global Radiacion_Bd_Optima media_Bd_optimo;
global Radiacion_Dd_Optima media_Dd_optimo;
global Radiacion_Rd_Optima media_Rd_optimo;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
global BdOpt_Inv BdOpt_Pri BdOpt_Ver BdOpt_Oto;
global DdOpt_Inv DdOpt_Pri DdOpt_Ver DdOpt_Oto;
global RdOpt_Inv RdOpt_Pri RdOpt_Ver RdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar media_GdEjePolar;
global BdEjePolar media_BdEjePolar;
global DdEjePolar media_DdEjePolar;
global RdEjePolar media_RdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal media_GdEjeAzimutal;
global BdEjeAzimutal media_BdEjeAzimutal;
global DdEjeAzimutal media_DdEjeAzimutal;
global RdEjeAzimutal media_RdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal media_GdEjeHorizontal;
global BdEjeHorizontal media_BdEjeHorizontal;
global DdEjeHorizontal media_DdEjeHorizontal;
global RdEjeHorizontal media_RdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes media_Gd2Ejes;
global Bd2Ejes media_Bd2Ejes;
global Dd2Ejes media_Dd2Ejes;
global Rd2Ejes media_Rd2Ejes;

Meses = {'Enero';'Febrero';'Marzo';'Abril';'Mayo';'Junio';'Julio';'Agosto';'Septiembre';'Octubre';'Noviembre';'Diciembre';'MEDIA'};


%Rellenamos RadiacionG_optima_Est con los valores óptimos para cada
%estación 
RadiacionG_optima_Est = zeros(1,12);

RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febrero
                
RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre


%Rellenamos RadiacionB_optima_Est con los valores óptimos para cada
%estación 
RadiacionB_optima_Est = zeros(1,12);

RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febrero
                
RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo

RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre


%Rellenamos RadiacionD_optima_Est con los valores óptimos para cada
%estación 
RadiacionD_optima_Est = zeros(1,12);

RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febrero
                
RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre


%Rellenamos RadiacionR_optima_Est con los valores óptimos para cada
%estación 
RadiacionR_optima_Est = zeros(1,12);

RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febrero
                
RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre

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

                    escribirG(1,5)={'Comparativa de todos los tipos de estudios'};

                    escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};


                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirG(j+4,1) = Meses(j);
                    end

                    %Títulos Gdm(0º),  Gdm(Inclina) .....---------------------------
                    escribirG(4,2)={'Gdm(0º)'};
                    escribirG(4,3)={'Gdm(Inclin. ópt. anual)'};
                    escribirG(4,5)={'Gdm(Inc. ópt. estacional)'};
                    escribirG(4,7)={'Gdm(Seg. eje polar)'};
                    escribirG(4,9)={'Gdm(Seg. eje azimutal)'};
                    escribirG(4,11)={'Gdm(Seg. eje horizontal)'};
                    escribirG(4,13)={'Gdm(Seg. a dos ejes)'};

                    %Valores-------------------------------------------------------
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


                    %Gdm (Inclinación optima anual)------------------------------------
                    for i=1:12
                        escribirG(i+4,3) = {Radiacion_optima(i)};
                    end
                    %Media
                    escribirG(17,3)={suma_angulo_optimo};


                    %Gdm (Inclinación optima estacional)-------------------------------
                    for i=1:12
                        escribirG(i+4,5) = {RadiacionG_optima_Est(i)};
                    end
                    %Media
                    escribirG(17,5)={mean(RadiacionG_optima_Est)};


                    %Gdm (Seguimiento Eje Polar)---------------------------------------
                    for i=1:12
                        escribirG(i+4,7) = {GdEjePolar(i)};
                    end
                    %Media
                    escribirG(17,7)={media_GdEjePolar};


                    %Gdm (Seguimiento Eje Azimutal)------------------------------------
                    for i=1:12
                        escribirG(i+4,9) = {GdEjeAzimutal(i)};
                    end
                    %Media
                    escribirG(17,9)={media_GdEjeAzimutal};


                    %Gdm (Seguimiento Eje Horizontal)----------------------------------
                    for i=1:12
                        escribirG(i+4,11) = {GdEjeHorizontal(i)};
                    end
                    %Media
                    escribirG(17,11)={media_GdEjeHorizontal};


                    %Gdm (Seguimiento 2 Ejes)---------------------------------------
                    for i=1:12
                        escribirG(i+4,13) = {Gd2Ejes(i)};
                    end
                    %Media
                    escribirG(17,13)={media_Gd2Ejes};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirG(3,15) = {'TEMPERATURA'};
                             escribirG(4,15)={'Temp.(ºC)'};

                            for i=1:12

                                escribirG(i+4,15) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirG(17,15) = {mediaT};

                         end  
               
               
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

                    escribirB(1,5)={'Comparativa de todos los tipos de estudios'};

                    escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};


                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirB(j+4,1) = Meses(j);
                    end

                    %Títulos Bdm(0º),  Bdm(Inclina) .....---------------------------
                    escribirB(4,2)={'Bdm(0º)'};
                    escribirB(4,3)={'Bdm(Inclin. ópt. anual)'};
                    escribirB(4,5)={'Bdm(Inc. ópt. estacional)'};
                    escribirB(4,7)={'Bdm(Seg. eje polar)'};
                    escribirB(4,9)={'Bdm(Seg. eje azimutal)'};
                    escribirB(4,11)={'Bdm(Seg. eje horizontal)'};
                    escribirB(4,13)={'Bdm(Seg. a dos ejes)'};

                    %Valores-------------------------------------------------------
                    %Bdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirB(k+4,2) = {Val_Bdm0(k)};
                    end
                    %Media
                    escribirB(17,2)={mean(Val_Bdm0)};     


                    %Bdm (Inclinación optima anual)------------------------------------
                    for i=1:12
                        escribirB(i+4,3) = {Radiacion_Bd_Optima(i)};
                    end
                    %Media
                    escribirB(17,3)={media_Bd_optimo};


                    %Bdm (Inclinación optima estacional)-------------------------------
                    for i=1:12
                        escribirB(i+4,5) = {RadiacionB_optima_Est(i)};
                    end
                    %Media
                    escribirB(17,5)={mean(RadiacionB_optima_Est)};


                    %Bdm (Seguimiento Eje Polar)---------------------------------------
                    for i=1:12
                        escribirB(i+4,7) = {BdEjePolar(i)};
                    end
                    %Media
                    escribirB(17,7)={media_BdEjePolar};


                    %Bdm (Seguimiento Eje Azimutal)------------------------------------
                    for i=1:12
                        escribirB(i+4,9) = {BdEjeAzimutal(i)};
                    end
                    %Media
                    escribirB(17,9)={media_BdEjeAzimutal};


                    %Bdm (Seguimiento Eje Horizontal)----------------------------------
                    for i=1:12
                        escribirB(i+4,11) = {BdEjeHorizontal(i)};
                    end
                    %Media
                    escribirB(17,11)={media_BdEjeHorizontal};


                    %Bdm (Seguimiento 2 Ejes)---------------------------------------
                    for i=1:12
                        escribirB(i+4,13) = {Bd2Ejes(i)};
                    end
                    %Media
                    escribirB(17,13)={media_Bd2Ejes};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirB(3,15) = {'TEMPERATURA'};
                             escribirB(4,15)={'Temp.(ºC)'};

                            for i=1:12

                                escribirB(i+4,15) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirB(17,15) = {mediaT};

                         end                 
               
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

                    escribirD(1,5)={'Comparativa de todos los tipos de estudios'};

                    escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};


                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirD(j+4,1) = Meses(j);
                    end

                    %Títulos Ddm(0º),  Ddm(Inclina) .....---------------------------
                    escribirD(4,2)={'Ddm(0º)'};
                    escribirD(4,3)={'Ddm(Inclin. ópt. anual)'};
                    escribirD(4,5)={'Ddm(Inc. ópt. estacional)'};
                    escribirD(4,7)={'Ddm(Seg. eje polar)'};
                    escribirD(4,9)={'Ddm(Seg. eje azimutal)'};
                    escribirD(4,11)={'Ddm(Seg. eje horizontal)'};
                    escribirD(4,13)={'Ddm(Seg. a dos ejes)'};

                    %Valores-------------------------------------------------------
                    %Ddm (0º)--------------------------------------------------
                    for k=1:12
                        escribirD(k+4,2) = {Val_Ddm0(k)};
                    end
                    %Media
                     escribirD(17,2)={mean(Val_Ddm0)};     


                    %Ddm (Inclinación optima anual)------------------------------------
                    for i=1:12
                        escribirD(i+4,3) = {Radiacion_Dd_Optima(i)};
                    end
                    %Media
                    escribirD(17,3)={media_Dd_optimo};


                    %Ddm (Inclinación optima estacional)-------------------------------
                    for i=1:12
                        escribirD(i+4,5) = {RadiacionD_optima_Est(i)};
                    end
                    %Media
                    escribirD(17,5)={mean(RadiacionD_optima_Est)};


                    %Ddm (Seguimiento Eje Polar)---------------------------------------
                    for i=1:12
                        escribirD(i+4,7) = {DdEjePolar(i)};
                    end
                    %Media
                    escribirD(17,7)={media_DdEjePolar};


                    %Ddm (Seguimiento Eje Azimutal)------------------------------------
                    for i=1:12
                        escribirD(i+4,9) = {DdEjeAzimutal(i)};
                    end
                    %Media
                    escribirD(17,9)={media_DdEjeAzimutal};


                    %Ddm (Seguimiento Eje Horizontal)----------------------------------
                    for i=1:12
                        escribirD(i+4,11) = {DdEjeHorizontal(i)};
                    end
                    %Media
                    escribirD(17,11)={media_DdEjeHorizontal};


                    %Ddm (Seguimiento 2 Ejes)---------------------------------------
                    for i=1:12
                        escribirD(i+4,13) = {Dd2Ejes(i)};
                    end
                    %Media
                    escribirD(17,13)={media_Dd2Ejes};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirD(3,15) = {'TEMPERATURA'};
                             escribirD(4,15)={'Temp.(ºC)'};

                            for i=1:12

                                escribirD(i+4,15) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirD(17,15) = {mediaT};

                         end                 
               
               
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

                    escribirR(1,5)={'Comparativa de todos los tipos de estudios'};

                    escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};


                    %Meses------------------------------------------------------
                    for j=1:13
                        escribirR(j+4,1) = Meses(j);
                    end

                    %Títulos Ddm(0º),  Ddm(Inclina) .....---------------------------
                    escribirR(4,2)={'Rdm(0º)'};
                    escribirR(4,3)={'Rdm(Inclin. ópt. anual)'};
                    escribirR(4,5)={'Rdm(Inc. ópt. estacional)'};
                    escribirR(4,7)={'Rdm(Seg. eje polar)'};
                    escribirR(4,9)={'Rdm(Seg. eje azimutal)'};
                    escribirR(4,11)={'Rdm(Seg. eje horizontal)'};
                    escribirR(4,13)={'Rdm(Seg. a dos ejes)'};

                    %Valores-------------------------------------------------------
                    %Rdm (0º)--------------------------------------------------
                    for k=1:12
                        escribirR(k+4,2) = {0};
                    end
                    %Media
                    escribirR(17,2)={0};     


                    %Rdm (Inclinación optima anual)------------------------------------
                    for i=1:12
                        escribirR(i+4,3) = {Radiacion_Rd_Optima(i)};
                    end
                    %Media
                    escribirR(17,3)={media_Rd_optimo};


                    %Rdm (Inclinación optima estacional)-------------------------------
                    for i=1:12
                        escribirR(i+4,5) = {RadiacionR_optima_Est(i)};
                    end
                    %Media
                    escribirR(17,5)={mean(RadiacionR_optima_Est)};


                    %Rdm (Seguimiento Eje Polar)---------------------------------------
                    for i=1:12
                        escribirR(i+4,7) = {RdEjePolar(i)};
                    end
                    %Media
                    escribirR(17,7)={media_RdEjePolar};


                    %Rdm (Seguimiento Eje Azimutal)------------------------------------
                    for i=1:12
                        escribirR(i+4,9) = {RdEjeAzimutal(i)};
                    end
                    %Media
                    escribirR(17,9)={media_RdEjeAzimutal};


                    %Rdm (Seguimiento Eje Horizontal)----------------------------------
                    for i=1:12
                        escribirR(i+4,11) = {RdEjeHorizontal(i)};
                    end
                    %Media
                    escribirR(17,11)={media_RdEjeHorizontal};


                    %Rdm (Seguimiento 2 Ejes)---------------------------------------
                    for i=1:12
                        escribirR(i+4,13) = {Rd2Ejes(i)};
                    end
                    %Media
                    escribirR(17,13)={media_Rd2Ejes};

                    %Temperaturas---------------------------------------------
                         if (DATOS(15)==1000)

                         else
                             escribirR(3,15) = {'TEMPERATURA'};
                             escribirR(4,15)={'Temp.(ºC)'};

                            for i=1:12

                                escribirR(i+4,15) = {DATOS(i+14)};

                            end

                            %Media de las temperaturas
                                        sumT = 0;
                                        for i=15:26
                                            sumT = sumT + DATOS(i);
                                        end

                                        mediaT = sumT/12;

                            escribirR(17,15) = {mediaT};

                         end               


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
        
        escribirG(1,5)={'Comparativa de todos los tipos de estudios'};
        
        escribirG(3,2) = {'RADIACIÓN GLOBAL DIARIA (kWh/m²/día)'};
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirG(j+4,1) = Meses(j);
        end
        
        %Títulos Gdm(0º),  Gdm(Inclina) .....---------------------------
        escribirG(4,2)={'Gdm(0º)'};
        escribirG(4,3)={'Gdm(Inclin. ópt. anual)'};
        escribirG(4,5)={'Gdm(Inc. ópt. estacional)'};
        escribirG(4,7)={'Gdm(Seg. eje polar)'};
        escribirG(4,9)={'Gdm(Seg. eje azimutal)'};
        escribirG(4,11)={'Gdm(Seg. eje horizontal)'};
        escribirG(4,13)={'Gdm(Seg. a dos ejes)'};
        
        %Valores-------------------------------------------------------
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
         
         
        %Gdm (Inclinación optima anual)------------------------------------
        for i=1:12
            escribirG(i+4,3) = {Radiacion_optima(i)};
        end
        %Media
        escribirG(17,3)={suma_angulo_optimo};
         
        
        %Gdm (Inclinación optima estacional)-------------------------------
        for i=1:12
            escribirG(i+4,5) = {RadiacionG_optima_Est(i)};
        end
        %Media
        escribirG(17,5)={mean(RadiacionG_optima_Est)};
        
        
        %Gdm (Seguimiento Eje Polar)---------------------------------------
        for i=1:12
            escribirG(i+4,7) = {GdEjePolar(i)};
        end
        %Media
        escribirG(17,7)={media_GdEjePolar};
        
        
        %Gdm (Seguimiento Eje Azimutal)------------------------------------
        for i=1:12
            escribirG(i+4,9) = {GdEjeAzimutal(i)};
        end
        %Media
        escribirG(17,9)={media_GdEjeAzimutal};
        
        
        %Gdm (Seguimiento Eje Horizontal)----------------------------------
        for i=1:12
            escribirG(i+4,11) = {GdEjeHorizontal(i)};
        end
        %Media
        escribirG(17,11)={media_GdEjeHorizontal};
        
        
        %Gdm (Seguimiento 2 Ejes)---------------------------------------
        for i=1:12
            escribirG(i+4,13) = {Gd2Ejes(i)};
        end
        %Media
        escribirG(17,13)={media_Gd2Ejes};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirG(3,15) = {'TEMPERATURA'};
                 escribirG(4,15)={'Temp.(ºC)'};

                for i=1:12

                    escribirG(i+4,15) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirG(17,15) = {mediaT};

             end  
              
             
        %DIRECTA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DIRECTA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirB(1,1) = NOMBRE_CIUDAD;
        escribirB(1,2)={'Latitud'};
        escribirB(1,3)={DATOS(2)};
        
        escribirB(1,5)={'Comparativa de todos los tipos de estudios'};
        
        escribirB(3,2) = {'RADIACIÓN DIRECTA DIARIA (kWh/m²/día)'};
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirB(j+4,1) = Meses(j);
        end
        
        %Títulos Bdm(0º),  Bdm(Inclina) .....---------------------------
        escribirB(4,2)={'Bdm(0º)'};
        escribirB(4,3)={'Bdm(Inclin. ópt. anual)'};
        escribirB(4,5)={'Bdm(Inc. ópt. estacional)'};
        escribirB(4,7)={'Bdm(Seg. eje polar)'};
        escribirB(4,9)={'Bdm(Seg. eje azimutal)'};
        escribirB(4,11)={'Bdm(Seg. eje horizontal)'};
        escribirB(4,13)={'Bdm(Seg. a dos ejes)'};
        
        %Valores-------------------------------------------------------
        %Bdm (0º)--------------------------------------------------
        for k=1:12
            escribirB(k+4,2) = {Val_Bdm0(k)};
        end
        %Media
        escribirB(17,2)={mean(Val_Bdm0)};     
         
         
        %Bdm (Inclinación optima anual)------------------------------------
        for i=1:12
            escribirB(i+4,3) = {Radiacion_Bd_Optima(i)};
        end
        %Media
        escribirB(17,3)={media_Bd_optimo};
         
        
        %Bdm (Inclinación optima estacional)-------------------------------
        for i=1:12
            escribirB(i+4,5) = {RadiacionB_optima_Est(i)};
        end
        %Media
        escribirB(17,5)={mean(RadiacionB_optima_Est)};
        
        
        %Bdm (Seguimiento Eje Polar)---------------------------------------
        for i=1:12
            escribirB(i+4,7) = {BdEjePolar(i)};
        end
        %Media
        escribirB(17,7)={media_BdEjePolar};
        
        
        %Bdm (Seguimiento Eje Azimutal)------------------------------------
        for i=1:12
            escribirB(i+4,9) = {BdEjeAzimutal(i)};
        end
        %Media
        escribirB(17,9)={media_BdEjeAzimutal};
        
        
        %Bdm (Seguimiento Eje Horizontal)----------------------------------
        for i=1:12
            escribirB(i+4,11) = {BdEjeHorizontal(i)};
        end
        %Media
        escribirB(17,11)={media_BdEjeHorizontal};
        
        
        %Bdm (Seguimiento 2 Ejes)---------------------------------------
        for i=1:12
            escribirB(i+4,13) = {Bd2Ejes(i)};
        end
        %Media
        escribirB(17,13)={media_Bd2Ejes};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirB(3,15) = {'TEMPERATURA'};
                 escribirB(4,15)={'Temp.(ºC)'};

                for i=1:12

                    escribirB(i+4,15) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirB(17,15) = {mediaT};

             end  
        
        
        
        
        %DIFUSA::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DIFUSA DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirD(1,1) = NOMBRE_CIUDAD;
        escribirD(1,2)={'Latitud'};
        escribirD(1,3)={DATOS(2)};
        
        escribirD(1,5)={'Comparativa de todos los tipos de estudios'};
        
        escribirD(3,2) = {'RADIACIÓN DIFUSA DIARIA (kWh/m²/día)'};
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirD(j+4,1) = Meses(j);
        end
        
        %Títulos Ddm(0º),  Ddm(Inclina) .....---------------------------
        escribirD(4,2)={'Ddm(0º)'};
        escribirD(4,3)={'Ddm(Inclin. ópt. anual)'};
        escribirD(4,5)={'Ddm(Inc. ópt. estacional)'};
        escribirD(4,7)={'Ddm(Seg. eje polar)'};
        escribirD(4,9)={'Ddm(Seg. eje azimutal)'};
        escribirD(4,11)={'Ddm(Seg. eje horizontal)'};
        escribirD(4,13)={'Ddm(Seg. a dos ejes)'};
        
        %Valores-------------------------------------------------------
        %Ddm (0º)--------------------------------------------------
        for k=1:12
            escribirD(k+4,2) = {Val_Ddm0(k)};
        end
        %Media
         escribirD(17,2)={mean(Val_Ddm0)};     
         
         
        %Ddm (Inclinación optima anual)------------------------------------
        for i=1:12
            escribirD(i+4,3) = {Radiacion_Dd_Optima(i)};
        end
        %Media
        escribirD(17,3)={media_Dd_optimo};
         
        
        %Ddm (Inclinación optima estacional)-------------------------------
        for i=1:12
            escribirD(i+4,5) = {RadiacionD_optima_Est(i)};
        end
        %Media
        escribirD(17,5)={mean(RadiacionD_optima_Est)};
        
        
        %Ddm (Seguimiento Eje Polar)---------------------------------------
        for i=1:12
            escribirD(i+4,7) = {DdEjePolar(i)};
        end
        %Media
        escribirD(17,7)={media_DdEjePolar};
        
        
        %Ddm (Seguimiento Eje Azimutal)------------------------------------
        for i=1:12
            escribirD(i+4,9) = {DdEjeAzimutal(i)};
        end
        %Media
        escribirD(17,9)={media_DdEjeAzimutal};
        
        
        %Ddm (Seguimiento Eje Horizontal)----------------------------------
        for i=1:12
            escribirD(i+4,11) = {DdEjeHorizontal(i)};
        end
        %Media
        escribirD(17,11)={media_DdEjeHorizontal};
        
        
        %Ddm (Seguimiento 2 Ejes)---------------------------------------
        for i=1:12
            escribirD(i+4,13) = {Dd2Ejes(i)};
        end
        %Media
        escribirD(17,13)={media_Dd2Ejes};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirD(3,15) = {'TEMPERATURA'};
                 escribirD(4,15)={'Temp.(ºC)'};

                for i=1:12

                    escribirD(i+4,15) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirD(17,15) = {mediaT};

             end  
                
        
        
        %DE ALBEDO::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %RADIACIÓN DE ALBEDO DIARIA:::::::::::::::::::::::::::::::::::::::::::
        %Cabecera----------------------------------------------------------
        escribirR(1,1) = NOMBRE_CIUDAD;
        escribirR(1,2)={'Latitud'};
        escribirR(1,3)={DATOS(2)};
        
        escribirR(1,5)={'Comparativa de todos los tipos de estudios'};
        
        escribirR(3,2) = {'RADIACIÓN DE ALBEDO DIARIA (kWh/m²/día)'};
        
        
        %Meses------------------------------------------------------
        for j=1:13
            escribirR(j+4,1) = Meses(j);
        end
        
        %Títulos Ddm(0º),  Ddm(Inclina) .....---------------------------
        escribirR(4,2)={'Rdm(0º)'};
        escribirR(4,3)={'Rdm(Inclin. ópt. anual)'};
        escribirR(4,5)={'Rdm(Inc. ópt. estacional)'};
        escribirR(4,7)={'Rdm(Seg. eje polar)'};
        escribirR(4,9)={'Rdm(Seg. eje azimutal)'};
        escribirR(4,11)={'Rdm(Seg. eje horizontal)'};
        escribirR(4,13)={'Rdm(Seg. a dos ejes)'};
        
        %Valores-------------------------------------------------------
        %Rdm (0º)--------------------------------------------------
        for k=1:12
            escribirR(k+4,2) = {0};
        end
        %Media
        escribirR(17,2)={0};     
         
         
        %Rdm (Inclinación optima anual)------------------------------------
        for i=1:12
            escribirR(i+4,3) = {Radiacion_Rd_Optima(i)};
        end
        %Media
        escribirR(17,3)={media_Rd_optimo};
         
        
        %Rdm (Inclinación optima estacional)-------------------------------
        for i=1:12
            escribirR(i+4,5) = {RadiacionR_optima_Est(i)};
        end
        %Media
        escribirR(17,5)={mean(RadiacionR_optima_Est)};
        
        
        %Rdm (Seguimiento Eje Polar)---------------------------------------
        for i=1:12
            escribirR(i+4,7) = {RdEjePolar(i)};
        end
        %Media
        escribirR(17,7)={media_RdEjePolar};
        
        
        %Rdm (Seguimiento Eje Azimutal)------------------------------------
        for i=1:12
            escribirR(i+4,9) = {RdEjeAzimutal(i)};
        end
        %Media
        escribirR(17,9)={media_RdEjeAzimutal};
        
        
        %Rdm (Seguimiento Eje Horizontal)----------------------------------
        for i=1:12
            escribirR(i+4,11) = {RdEjeHorizontal(i)};
        end
        %Media
        escribirR(17,11)={media_RdEjeHorizontal};
        
        
        %Rdm (Seguimiento 2 Ejes)---------------------------------------
        for i=1:12
            escribirR(i+4,13) = {Rd2Ejes(i)};
        end
        %Media
        escribirR(17,13)={media_Rd2Ejes};
        
        %Temperaturas---------------------------------------------
             if (DATOS(15)==1000)

             else
                 escribirR(3,15) = {'TEMPERATURA'};
                 escribirR(4,15)={'Temp.(ºC)'};

                for i=1:12

                    escribirR(i+4,15) = {DATOS(i+14)};

                end

                %Media de las temperaturas
                            sumT = 0;
                            for i=15:26
                                sumT = sumT + DATOS(i);
                            end

                            mediaT = sumT/12;

                escribirR(17,15) = {mediaT};

             end
       
        %Se procede a la ESCRITURA en el archivo Excel:::::::::::::::::::::::::::::
        xlswrite(fullfile(ruta,nombre),escribirG,'Hoja1','A1');
        xlswrite(fullfile(ruta,nombre),escribirB,'Hoja2','A1');
        xlswrite(fullfile(ruta,nombre),escribirD,'Hoja3','A1');
        xlswrite(fullfile(ruta,nombre),escribirR,'Hoja4','A1');

        %Quitar posible error por creación de una nueva hoja en Excel
        warning('off','MATLAB:xlswrite:AddSheet');


        msgbox('Datos exportados satisfactoriamente en el directorio deseado','Aviso');
end

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

opcionPDF = questdlg('ESPERE unos segundos mientras se realiza el proceso.                                              A continuación se generará el informe en formato PDF. Cuando finalice se indicará con OTRO AVISO, donde se detalla el directorio del informe generado.', ...
	'Aviso', ...
	'Ok','Ok');

switch opcionPDF
    
    case 'Ok'
        report ReportComparativa.rpt;

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
close ('OrientSol 3.0 - Comparativa de todos los tipos de estudios');

% --- Executes on button press in Graficas.
function Graficas_Callback(hObject, eventdata, handles)

Grafica_Comparativa;

close ('OrientSol 3.0 - Comparativa de todos los tipos de estudios');

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
