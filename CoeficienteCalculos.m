function varargout = CoeficienteCalculos(varargin)
% COEFICIENTECALCULOS MATLAB code for CoeficienteCalculos.fig
%      COEFICIENTECALCULOS, by itself, creates a new COEFICIENTECALCULOS or raises the existing
%      singleton*.
%
%      H = COEFICIENTECALCULOS returns the handle to a new COEFICIENTECALCULOS or the handle to
%      the existing singleton*.
%
%      COEFICIENTECALCULOS('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in COEFICIENTECALCULOS.M with the given input arguments.
%
%      COEFICIENTECALCULOS('Property','Value',...) creates a new COEFICIENTECALCULOS or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before CoeficienteCalculos_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to CoeficienteCalculos_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help CoeficienteCalculos

% Last Modified by GUIDE v2.5 05-Dec-2014 17:30:41

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @CoeficienteCalculos_OpeningFcn, ...
                   'gui_OutputFcn',  @CoeficienteCalculos_OutputFcn, ...
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


% --- Executes just before CoeficienteCalculos is made visible.
function CoeficienteCalculos_OpeningFcn(hObject, eventdata, handles, varargin)
global OPCION_EST


%Centrar la ventana en la pantalla
movegui(hObject,'center');


axes(handles.tabla_albedo);

imagen=imread('TablaAlbedoESP_PNG.png');
imagen1=imresize(imagen,[350 351]); %Para ajustarlo directamente
imshow(imagen1);
axis off;

% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to CoeficienteCalculos (see VARARGIN)

% Choose default command line output for CoeficienteCalculos
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes CoeficienteCalculos wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = CoeficienteCalculos_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on button press in Calcular.
function Calcular_Callback(hObject, eventdata, handles)
%::::::::::::::::::::::::VARIABLES GLOBALES::::::::::::::::::::::::::::::::
global COEF OPCION_EST 

%Variables globales para los cálculos
global DIA_INTER LAT_RAD DATOS;
%INCLINACIÓN ÓPTIMA ANUAL..................................................
global Val_Bdm0 Val_Ddm0 
global GdBetaTotal
global Gdm_representar media angulo_optimo Radiacion_optima suma_angulo_optimo;
global BdBetaTotal media_Bd Radiacion_Bd_Optima media_Bd_optimo;
global DdBetaTotal media_Dd Radiacion_Dd_Optima media_Dd_optimo;
global RdBetaTotal media_Rd Radiacion_Rd_Optima media_Rd_optimo;
%Ganancias==========================
global GanaG_Anu_0 PorGanaG_Anu_0;
global GanaB_Anu_0 PorGanaB_Anu_0;
global GanaD_Anu_0 PorGanaD_Anu_0;
global GanaR_Anu_0 PorGanaR_Anu_0;

%INCLINACIÓN ÓPTIMA ESTACIONAL.............................................
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;
%G
global GdBeta_Invierno GdOpt_Inv GdBeta_Primavera GdOpt_Pri GdBeta_Verano GdOpt_Ver GdBeta_Otonio GdOpt_Oto;
global Med_GdOpt_Inv Med_GdOpt_Pri Med_GdOpt_Ver Med_GdOpt_Oto;
%B
global BdBeta_Invierno BdOpt_Inv  BdBeta_Primavera BdOpt_Pri  BdBeta_Verano BdOpt_Ver  BdBeta_Otonio BdOpt_Oto;
global Med_BdOpt_Inv Med_BdOpt_Pri Med_BdOpt_Ver Med_BdOpt_Oto;
%D
global DdBeta_Invierno DdOpt_Inv  DdBeta_Primavera DdOpt_Pri  DdBeta_Verano DdOpt_Ver  DdBeta_Otonio DdOpt_Oto;
global Med_DdOpt_Inv Med_DdOpt_Pri Med_DdOpt_Ver Med_DdOpt_Oto;
%R
global RdBeta_Invierno RdOpt_Inv  RdBeta_Primavera RdOpt_Pri  RdBeta_Verano RdOpt_Ver  RdBeta_Otonio RdOpt_Oto;
global Med_RdOpt_Inv Med_RdOpt_Pri Med_RdOpt_Ver Med_RdOpt_Oto;
%Ganancias==========================
global GanaG_Est_0 GanaG_Est_Anu PorGanaG_Est_0 PorGanaG_Est_Anu;
global GanaB_Est_0 GanaB_Est_Anu PorGanaB_Est_0 PorGanaB_Est_Anu;
global GanaD_Est_0 GanaD_Est_Anu PorGanaD_Est_0 PorGanaD_Est_Anu;
global GanaR_Est_0 GanaR_Est_Anu PorGanaR_Est_0 PorGanaR_Est_Anu;

%SEGUIMIENTO A UN EJE POLAR................................................
global BdEjePolar media_BdEjePolar;
global DdEjePolar media_DdEjePolar;
global RdEjePolar media_RdEjePolar;
global GdEjePolar media_GdEjePolar;
%Ganancias==========================
global GanaG_Pol_0 GanaG_Pol_Anu GanaG_Pol_Est GanaG_Pol_Azi GanaG_Pol_Hor PorGanaG_Pol_0 PorGanaG_Pol_Anu PorGanaG_Pol_Est PorGanaG_Pol_Azi PorGanaG_Pol_Hor;
global GanaB_Pol_0 GanaB_Pol_Anu GanaB_Pol_Est GanaB_Pol_Azi GanaB_Pol_Hor PorGanaB_Pol_0 PorGanaB_Pol_Anu PorGanaB_Pol_Est PorGanaB_Pol_Azi PorGanaB_Pol_Hor;
global GanaD_Pol_0 GanaD_Pol_Anu GanaD_Pol_Est GanaD_Pol_Azi GanaD_Pol_Hor PorGanaD_Pol_0 PorGanaD_Pol_Anu PorGanaD_Pol_Est PorGanaD_Pol_Azi PorGanaD_Pol_Hor;
global GanaR_Pol_0 GanaR_Pol_Anu GanaR_Pol_Est GanaR_Pol_Azi GanaR_Pol_Hor PorGanaR_Pol_0 PorGanaR_Pol_Anu PorGanaR_Pol_Est PorGanaR_Pol_Azi PorGanaR_Pol_Hor;

%SEGUIMIENTO A UN EJE AZIMUTAL.............................................
global BdEjeAzimutal media_BdEjeAzimutal;
global DdEjeAzimutal media_DdEjeAzimutal;
global RdEjeAzimutal media_RdEjeAzimutal;
global GdEjeAzimutal media_GdEjeAzimutal;
%Ganancias==========================
global GanaG_Azi_0 GanaG_Azi_Anu GanaG_Azi_Est GanaG_Azi_Pol GanaG_Azi_Hor PorGanaG_Azi_0 PorGanaG_Azi_Anu PorGanaG_Azi_Est PorGanaG_Azi_Pol PorGanaG_Azi_Hor;
global GanaB_Azi_0 GanaB_Azi_Anu GanaB_Azi_Est GanaB_Azi_Pol GanaB_Azi_Hor PorGanaB_Azi_0 PorGanaB_Azi_Anu PorGanaB_Azi_Est PorGanaB_Azi_Pol PorGanaB_Azi_Hor;
global GanaD_Azi_0 GanaD_Azi_Anu GanaD_Azi_Est GanaD_Azi_Pol GanaD_Azi_Hor PorGanaD_Azi_0 PorGanaD_Azi_Anu PorGanaD_Azi_Est PorGanaD_Azi_Pol PorGanaD_Azi_Hor;
global GanaR_Azi_0 GanaR_Azi_Anu GanaR_Azi_Est GanaR_Azi_Pol GanaR_Azi_Hor PorGanaR_Azi_0 PorGanaR_Azi_Anu PorGanaR_Azi_Est PorGanaR_Azi_Pol PorGanaR_Azi_Hor;

%SEGUIMIENTO A UN EJE HORIZONTAL...........................................
global BdEjeHorizontal media_BdEjeHorizontal;
global DdEjeHorizontal media_DdEjeHorizontal;
global RdEjeHorizontal media_RdEjeHorizontal;
global GdEjeHorizontal media_GdEjeHorizontal;
%Ganancias==========================
global GanaG_Hor_0 GanaG_Hor_Anu GanaG_Hor_Est GanaG_Hor_Pol GanaG_Hor_Azi PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;
global GanaB_Hor_0 GanaB_Hor_Anu GanaB_Hor_Est GanaB_Hor_Pol GanaB_Hor_Azi PorGanaB_Hor_0 PorGanaB_Hor_Anu PorGanaB_Hor_Est PorGanaB_Hor_Pol PorGanaB_Hor_Azi;
global GanaD_Hor_0 GanaD_Hor_Anu GanaD_Hor_Est GanaD_Hor_Pol GanaD_Hor_Azi PorGanaD_Hor_0 PorGanaD_Hor_Anu PorGanaD_Hor_Est PorGanaD_Hor_Pol PorGanaD_Hor_Azi;
global GanaR_Hor_0 GanaR_Hor_Anu GanaR_Hor_Est GanaR_Hor_Pol GanaR_Hor_Azi PorGanaR_Hor_0 PorGanaR_Hor_Anu PorGanaR_Hor_Est PorGanaR_Hor_Pol PorGanaR_Hor_Azi;

%SEGUIMIENTO A DOS EJES....................................................
global Bd2Ejes media_Bd2Ejes;
global Dd2Ejes media_Dd2Ejes;
global Rd2Ejes media_Rd2Ejes;
global Gd2Ejes media_Gd2Ejes;
%Ganancias==========================
global GanaG_2Ej_0 GanaG_2Ej_Anu GanaG_2Ej_Est GanaG_2Ej_Pol GanaG_2Ej_Azi GanaG_2Ej_Hor PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;
global GanaB_2Ej_0 GanaB_2Ej_Anu GanaB_2Ej_Est GanaB_2Ej_Pol GanaB_2Ej_Azi GanaB_2Ej_Hor PorGanaB_2Ej_0 PorGanaB_2Ej_Anu PorGanaB_2Ej_Est PorGanaB_2Ej_Pol PorGanaB_2Ej_Azi PorGanaB_2Ej_Hor;
global GanaD_2Ej_0 GanaD_2Ej_Anu GanaD_2Ej_Est GanaD_2Ej_Pol GanaD_2Ej_Azi GanaD_2Ej_Hor PorGanaD_2Ej_0 PorGanaD_2Ej_Anu PorGanaD_2Ej_Est PorGanaD_2Ej_Pol PorGanaD_2Ej_Azi PorGanaD_2Ej_Hor;
global GanaR_2Ej_0 GanaR_2Ej_Anu GanaR_2Ej_Est GanaR_2Ej_Pol GanaR_2Ej_Azi GanaR_2Ej_Hor PorGanaR_2Ej_0 PorGanaR_2Ej_Anu PorGanaR_2Ej_Est PorGanaR_2Ej_Pol PorGanaR_2Ej_Azi PorGanaR_2Ej_Hor;
%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
%Se lee el valor del COEFICIENTE:::::::::::::::::::::::::::::::::::::::::::
coef = get(handles.coef,'String');
COEF = str2double(coef);

%MENSAJES DE ERROR
%En caso de que la casilla esté vacía devolvería un error
errorC = isnan(COEF);

if errorC == 1
        
        warndlg('Asegúrese de introducir un coeficiente de albedo correcto.','Aviso');
  
        return
   
end
%En caso de que no sea un valor correcto devolvería otro error
if COEF>1 || COEF<0.05
        
        warndlg('El valor debe estar comprendido entre 0.05 y 1.','Aviso');
  
        return
   
end

%::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%CÁLCULOS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%CÁLCULOS GENÉRICOS, igual para TODOS::::::::::::::::::::::::::::::::::::::
DIA_INTER = [17 46 75 105 135 161 198 229 259 289 319 344];

[AngSal1, AngSalida] = AngulosSalida (LAT_RAD, DIA_INTER); %Nos da los angulos horarios solares según el lugar y el mes.

Val_decli = matriz_declinacion(DIA_INTER); %Nos expresa las declinaciones de cada mes

Val_Bod = Bod0(DIA_INTER,LAT_RAD,Val_decli,AngSal1); %Se expresa en W

[Val_Bdm0,Val_Ddm0] = Bdm0 (Val_Bod,DATOS);    %Se expresan en kW


%--HORARIAS------------------------------------------------------------
%--------------PASO DE Bd(0) Y Dd(0) A Bh(0) Y Dh(0)-------------------
[numeroN, matriz_angulos] = Angulos (AngSal1);

[Dh_matriz,matriz_rd] = Dh0(matriz_angulos,AngSal1,numeroN,Val_Ddm0);

[Gh_matriz,matriz_rg] = Gh0(matriz_angulos,AngSal1,numeroN,DATOS);

Bh_matriz = Bh0(Gh_matriz, Dh_matriz, numeroN);

[numeroN2, matriz_angulos2] = Angulos2 (AngSalida);


switch OPCION_EST %CÁLCULOS DEPENDIENDO DEL TIPO DE ESTUDIO. 
    
    case 1 %INCLINACIÓN ÓPTIMA ANUAL:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);     
        
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_Anu_0, PorGanaG_Anu_0] = Ganancias_Gd_Anual(DATOS, Radiacion_optima);
        [GanaB_Anu_0, PorGanaB_Anu_0] = Ganancias_Bd_Anual(Val_Bdm0, Radiacion_Bd_Optima);
        [GanaD_Anu_0, PorGanaD_Anu_0] = Ganancias_Dd_Anual(Val_Ddm0, Radiacion_Dd_Optima);
        [GanaR_Anu_0, PorGanaR_Anu_0] = Ganancias_Rd_Anual(Radiacion_Rd_Optima);
        %==================================================================
        
        Tabla_OptAnual;
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
    case 2 %INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        
        
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_Est_0, GanaG_Est_Anu, PorGanaG_Est_0, PorGanaG_Est_Anu] = Ganancias_Gd_Estacional(DATOS, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, Radiacion_optima);
        [GanaB_Est_0, GanaB_Est_Anu, PorGanaB_Est_0, PorGanaB_Est_Anu] = Ganancias_Bd_Estacional(Val_Bdm0, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, Radiacion_Bd_Optima);
        [GanaD_Est_0, GanaD_Est_Anu, PorGanaD_Est_0, PorGanaD_Est_Anu] = Ganancias_Dd_Estacional(Val_Ddm0, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, Radiacion_Dd_Optima);
        [GanaR_Est_0, GanaR_Est_Anu, PorGanaR_Est_0, PorGanaR_Est_Anu] = Ganancias_Rd_Estacional(RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, Radiacion_Rd_Optima);
        %==================================================================
        
        Tabla_OptEstacional;
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
    case 3 %SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
        %ALTURA Y AZIMUT SOLAR---------------------------------------------
        AlturaSolar = Altura_Solar (LAT_RAD, Val_decli, numeroN, matriz_angulos);
        AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN);
        %------------------------------------------------------------------
       
        %SEGUIMIENTO EJE POLAR---------------------------------------------
        %Directa (B)
        BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN);    
        %Difusa (D)
        DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos);
        [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN);
        %Reflejada (R)
        RhEjePolar = Rh_EjePolar(LAT_RAD, Gh_matriz, numeroN, AlturaSolar, Val_decli, matriz_angulos, COEF);
        [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN);
        %Global (G)
        GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN);
        [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN);  
        %------------------------------------------------------------------   
        
        
        %INCLINACIÓN FIJA ANUAL Y ESTACIONAL(para las ganancias)-----------
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %SEGUIMIENTO EJE AZIMUTAL(para las ganancias)----------------------
        %Directa(B)
        BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN);
        %Difusa(D)
        DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD);
        [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN);
        %Albedo o Reflejada (R)
        RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF);
        [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN);
        %Global(G)
        GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN);
        [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN);        
        %------------------------------------------------------------------ 
                
        %SEGUIMIENTO EJE HORIZONTAL(para las ganancias)---------------------
        %Directa (B)
        BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar);
        [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN);
        %Difusa (D)
        DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar);
        [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN);
        %Reflejada (R)
        RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF);
        [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN);
        %Global (G)
        GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN);
        [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN);      
        %------------------------------------------------------------------ 
        
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_Pol_0, GanaG_Pol_Anu, GanaG_Pol_Est, GanaG_Pol_Azi, GanaG_Pol_Hor, PorGanaG_Pol_0, PorGanaG_Pol_Anu, PorGanaG_Pol_Est, PorGanaG_Pol_Azi, PorGanaG_Pol_Hor] = Ganancias_Gd_Polar(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal);
        [GanaB_Pol_0, GanaB_Pol_Anu, GanaB_Pol_Est, GanaB_Pol_Azi, GanaB_Pol_Hor, PorGanaB_Pol_0, PorGanaB_Pol_Anu, PorGanaB_Pol_Est, PorGanaB_Pol_Azi, PorGanaB_Pol_Hor] = Ganancias_Bd_Polar(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal);
        [GanaD_Pol_0, GanaD_Pol_Anu, GanaD_Pol_Est, GanaD_Pol_Azi, GanaD_Pol_Hor, PorGanaD_Pol_0, PorGanaD_Pol_Anu, PorGanaD_Pol_Est, PorGanaD_Pol_Azi, PorGanaD_Pol_Hor] = Ganancias_Bd_Polar(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal);
        [GanaR_Pol_0, GanaR_Pol_Anu, GanaR_Pol_Est, GanaR_Pol_Azi, GanaR_Pol_Hor, PorGanaR_Pol_0, PorGanaR_Pol_Anu, PorGanaR_Pol_Est, PorGanaR_Pol_Azi, PorGanaR_Pol_Hor] = Ganancias_Rd_Polar(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal);
        %==================================================================
        
        Tabla_EjePolar;  
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
    case 4 %SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
        %ALTURA Y AZIMUT SOLAR---------------------------------------------
        AlturaSolar = Altura_Solar (LAT_RAD, Val_decli, numeroN, matriz_angulos);
        AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN);
        %------------------------------------------------------------------
                
        %SEGUIMIENTO EJE AZIMUTAL------------------------------------------
        %Directa(B)
        BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN);
        %Difusa(D)
        DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD);
        [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN);
        %Albedo o Reflejada (R)
        RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF);
        [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN);
        %Global(G)
        GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN);
        [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN);        
        %------------------------------------------------------------------ 
        
        
        %INCLINACIÓN FIJA ANUAL Y ESTACIONAL(para las ganancias)-----------
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %SEGUIMIENTO EJE POLAR (para las ganancias)------------------------
        %Directa (B)
        BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN);    
        %Difusa (D)
        DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos);
        [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN);
        %Reflejada (R)
        RhEjePolar = Rh_EjePolar(LAT_RAD, Gh_matriz, numeroN, AlturaSolar, Val_decli, matriz_angulos, COEF);
        [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN);
        %Global (G)
        GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN);
        [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN);  
        %------------------------------------------------------------------   
                   
        %SEGUIMIENTO EJE HORIZONTAL(para las ganancias)---------------------
        %Directa (B)
        BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar);
        [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN);
        %Difusa (D)
        DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar);
        [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN);
        %Reflejada (R)
        RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF);
        [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN);
        %Global (G)
        GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN);
        [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN);            
                     
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_Azi_0, GanaG_Azi_Anu, GanaG_Azi_Est, GanaG_Azi_Pol, GanaG_Azi_Hor, PorGanaG_Azi_0, PorGanaG_Azi_Anu, PorGanaG_Azi_Est, PorGanaG_Azi_Pol, PorGanaG_Azi_Hor] = Ganancias_Gd_Azimutal(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal);
        [GanaB_Azi_0, GanaB_Azi_Anu, GanaB_Azi_Est, GanaB_Azi_Pol, GanaB_Azi_Hor, PorGanaB_Azi_0, PorGanaB_Azi_Anu, PorGanaB_Azi_Est, PorGanaB_Azi_Pol, PorGanaB_Azi_Hor] = Ganancias_Bd_Azimutal(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal);
        [GanaD_Azi_0, GanaD_Azi_Anu, GanaD_Azi_Est, GanaD_Azi_Pol, GanaD_Azi_Hor, PorGanaD_Azi_0, PorGanaD_Azi_Anu, PorGanaD_Azi_Est, PorGanaD_Azi_Pol, PorGanaD_Azi_Hor] = Ganancias_Dd_Azimutal(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal);
        [GanaR_Azi_0, GanaR_Azi_Anu, GanaR_Azi_Est, GanaR_Azi_Pol, GanaR_Azi_Hor, PorGanaR_Azi_0, PorGanaR_Azi_Anu, PorGanaR_Azi_Est, PorGanaR_Azi_Pol, PorGanaR_Azi_Hor] = Ganancias_Rd_Azimutal(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal);
        %==================================================================
        
        Tabla_EjeAzimutal;
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
       
       
    case 5 %Seguimiento a un eje horizontal:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        %ALTURA Y AZIMUT SOLAR---------------------------------------------
        AlturaSolar = Altura_Solar (LAT_RAD, Val_decli, numeroN, matriz_angulos);
        AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN);
        %------------------------------------------------------------------
        
        %SEGUIMIENTO EJE HORIZONTAL----------------------------------------
        %Directa (B)
        BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar);
        [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN);
        %Difusa (D)
        DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar);
        [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN);
        %Reflejada (R)
        RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF);
        [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN);
        %Global (G)
        GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN);
        [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN); 
         
        
        %INCLINACIÓN FIJA ANUAL Y ESTACIONAL(para las ganancias)-----------
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %SEGUIMIENTO EJE POLAR(para las ganancias)-------------------------
        %Directa (B)
        BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN);    
        %Difusa (D)
        DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos);
        [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN);
        %Reflejada (R)
        RhEjePolar = Rh_EjePolar(LAT_RAD, Gh_matriz, numeroN, AlturaSolar, Val_decli, matriz_angulos, COEF);
        [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN);
        %Global (G)
        GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN);
        [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN);  
        %------------------------------------------------------------------   
        
        %SEGUIMIENTO EJE AZIMUTAL(para las ganancias)----------------------
        %Directa(B)
        BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN);
        %Difusa(D)
        DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD);
        [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN);
        %Albedo o Reflejada (R)
        RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF);
        [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN);
        %Global(G)
        GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN);
        [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN);        
        %------------------------------------------------------------------ 
                   
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_Hor_0, GanaG_Hor_Anu, GanaG_Hor_Est, GanaG_Hor_Pol, GanaG_Hor_Azi, PorGanaG_Hor_0, PorGanaG_Hor_Anu, PorGanaG_Hor_Est, PorGanaG_Hor_Pol, PorGanaG_Hor_Azi] = Ganancias_Gd_Horizontal(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal);
        [GanaB_Hor_0, GanaB_Hor_Anu, GanaB_Hor_Est, GanaB_Hor_Pol, GanaB_Hor_Azi, PorGanaB_Hor_0, PorGanaB_Hor_Anu, PorGanaB_Hor_Est, PorGanaB_Hor_Pol, PorGanaB_Hor_Azi] = Ganancias_Bd_Horizontal(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal);
        [GanaD_Hor_0, GanaD_Hor_Anu, GanaD_Hor_Est, GanaD_Hor_Pol, GanaD_Hor_Azi, PorGanaD_Hor_0, PorGanaD_Hor_Anu, PorGanaD_Hor_Est, PorGanaD_Hor_Pol, PorGanaD_Hor_Azi] = Ganancias_Dd_Horizontal(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal);
        [GanaR_Hor_0, GanaR_Hor_Anu, GanaR_Hor_Est, GanaR_Hor_Pol, GanaR_Hor_Azi, PorGanaR_Hor_0, PorGanaR_Hor_Anu, PorGanaR_Hor_Est, PorGanaR_Hor_Pol, PorGanaR_Hor_Azi] = Ganancias_Rd_Horizontal(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal);
        %==================================================================
        
        
        Tabla_EjeHorizontal;
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
    case 6 %SEGUIMIENTO A DOS EJES::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        AlturaSolar = Altura_Solar ( LAT_RAD, Val_decli, numeroN, matriz_angulos);
        AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN);
        
        Beta_2Ejes = Calulo_Beta_2Ejes(AlturaSolar, numeroN);
        
        %Directa(B)
        Bh2Ejes = Bh_2Ejes(LAT_RAD, Beta_2Ejes, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [Bd2Ejes, media_Bd2Ejes] = Bd_2Ejes(Bh2Ejes, numeroN);
        %Difusa (D)
        Dh2Ejes = Dh_2Ejes(Beta_2Ejes, Dh_matriz, numeroN);
        [Dd2Ejes, media_Dd2Ejes] = Dd_2Ejes(Dh2Ejes, numeroN);
        %Reflejada (R)
        Rh2Ejes = Rh_2Ejes(Beta_2Ejes, Gh_matriz, numeroN, COEF);
        [Rd2Ejes, media_Rd2Ejes] = Rd_2Ejes(Rh2Ejes, numeroN);
        %Global (G)
        Gh2Ejes = Gh_2Ejes (Bh2Ejes, Dh2Ejes, Rh2Ejes, numeroN);
        [Gd2Ejes, media_Gd2Ejes] = Gd_2Ejes(Gh2Ejes, numeroN);
        
        %INCLINACIÓN FIJA ANUAL Y ESTACIONAL(para las ganancias)-----------
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %SEGUIMIENTO EJE POLAR(para las ganancias)-------------------------
        %Directa (B)
        BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN);    
        %Difusa (D)
        DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos);
        [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN);
        %Reflejada (R)
        RhEjePolar = Rh_EjePolar(LAT_RAD, Gh_matriz, numeroN, AlturaSolar, Val_decli, matriz_angulos, COEF);
        [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN);
        %Global (G)
        GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN);
        [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN);  
        %------------------------------------------------------------------   
        
        %SEGUIMIENTO EJE AZIMUTAL(para las ganancias)----------------------
        %Directa(B)
        BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN);
        %Difusa(D)
        DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD);
        [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN);
        %Albedo o Reflejada (R)
        RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF);
        [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN);
        %Global(G)
        GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN);
        [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN);        
        %------------------------------------------------------------------ 
                
        %SEGUIMIENTO EJE HORIZONTAL(para las ganancias)---------------------
        %Directa (B)
        BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar);
        [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN);
        %Difusa (D)
        DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar);
        [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN);
        %Reflejada (R)
        RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF);
        [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN);
        %Global (G)
        GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN);
        [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN); 
        
        %==================================================================
        %GANANCIAS=========================================================
        [GanaG_2Ej_0, GanaG_2Ej_Anu, GanaG_2Ej_Est, GanaG_2Ej_Pol, GanaG_2Ej_Azi, GanaG_2Ej_Hor, PorGanaG_2Ej_0, PorGanaG_2Ej_Anu, PorGanaG_2Ej_Est, PorGanaG_2Ej_Pol, PorGanaG_2Ej_Azi, PorGanaG_2Ej_Hor] = Ganancias_Gd_2Ejes(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal, Gd2Ejes);
        [GanaB_2Ej_0, GanaB_2Ej_Anu, GanaB_2Ej_Est, GanaB_2Ej_Pol, GanaB_2Ej_Azi, GanaB_2Ej_Hor, PorGanaB_2Ej_0, PorGanaB_2Ej_Anu, PorGanaB_2Ej_Est, PorGanaB_2Ej_Pol, PorGanaB_2Ej_Azi, PorGanaB_2Ej_Hor] = Ganancias_Bd_2Ejes(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal, Bd2Ejes);
        [GanaD_2Ej_0, GanaD_2Ej_Anu, GanaD_2Ej_Est, GanaD_2Ej_Pol, GanaD_2Ej_Azi, GanaD_2Ej_Hor, PorGanaD_2Ej_0, PorGanaD_2Ej_Anu, PorGanaD_2Ej_Est, PorGanaD_2Ej_Pol, PorGanaD_2Ej_Azi, PorGanaD_2Ej_Hor] = Ganancias_Dd_2Ejes(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal, Dd2Ejes);
        [GanaR_2Ej_0, GanaR_2Ej_Anu, GanaR_2Ej_Est, GanaR_2Ej_Pol, GanaR_2Ej_Azi, GanaR_2Ej_Hor, PorGanaR_2Ej_0, PorGanaR_2Ej_Anu, PorGanaR_2Ej_Est, PorGanaR_2Ej_Pol, PorGanaR_2Ej_Azi, PorGanaR_2Ej_Hor] = Ganancias_Rd_2Ejes(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal, Rd2Ejes);
        %==================================================================
        
             
        
        
        Tabla_2Ejes; 
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
    case 7 %COMPARATIVA:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
           %:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 
        %INCLINACIÓN FIJA ANUAL Y ESTACIONAL-------------------------------
        %--------OBTENCIÓN DE Bh(b) A PARTIR DE Bh(0), PARA alfa = 0-------                          
        BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz);
        %-----------------OBTENCIÓN DE Dh(b) A PARTIR DE Dh(0)-------------
        DhBetaTotal = DhBeta(numeroN2,Dh_matriz);
        %-----------OBTENCIÓN DE Rh(b) A PARTIR DE Gh(0) Y COEF------------
        RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF);
        %--------OBTENCIÓN DE Gh(b) A PARTIR DE  Bh(b) Dh(b) Rh(b)---------
        GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal);
        
        %--DIARIA----------------------------------------------------------
        %GLOBAL PARA TODAS LAS INCLINACIONES-------------------------------
        GdBetaTotal = GdBeta(numeroN2,GhBetaTotal);
        %CÁLCULO DE LA MAYOR-----------------------------------------------        
        [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS);
        %RESTO DE COMPONENTES----------------------------------------------
        [BdBetaTotal, media_Bd, Radiacion_Bd_Optima, media_Bd_optimo]= BdBeta (BhBetaTotal,numeroN2,angulo_optimo,Val_Bdm0);
        [DdBetaTotal, media_Dd, Radiacion_Dd_Optima, media_Dd_optimo]= DdBeta (DhBetaTotal,numeroN2,angulo_optimo,Val_Ddm0);
        [RdBetaTotal, media_Rd, Radiacion_Rd_Optima, media_Rd_optimo]= RdBeta (RhBetaTotal,numeroN2,angulo_optimo);
        %------------------------------------------------------------------
        %Cálculo de las ESTACIONALES---------------------------------------
        [GdBeta_Invierno, angOptim_Inv, GdOpt_Inv, Med_GdOpt_Inv, angOptim_Pri, GdBeta_Primavera, GdOpt_Pri, Med_GdOpt_Pri, GdBeta_Verano, angOptim_Ver, GdOpt_Ver, Med_GdOpt_Ver, GdBeta_Otonio, angOptim_Oto, GdOpt_Oto, Med_GdOpt_Oto] = Calculo_Optimo_Estacion(GdBetaTotal,DATOS);
        
        [BdBeta_Invierno, BdOpt_Inv, Med_BdOpt_Inv, BdBeta_Primavera, BdOpt_Pri, Med_BdOpt_Pri, BdBeta_Verano, BdOpt_Ver, Med_BdOpt_Ver, BdBeta_Otonio, BdOpt_Oto, Med_BdOpt_Oto] = Bd_OptEstacional (BdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Bdm0);
        [DdBeta_Invierno, DdOpt_Inv, Med_DdOpt_Inv, DdBeta_Primavera, DdOpt_Pri, Med_DdOpt_Pri, DdBeta_Verano, DdOpt_Ver, Med_DdOpt_Ver, DdBeta_Otonio, DdOpt_Oto, Med_DdOpt_Oto] = Dd_OptEstacional(DdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto, Val_Ddm0);
        [RdBeta_Invierno, RdOpt_Inv, Med_RdOpt_Inv, RdBeta_Primavera, RdOpt_Pri, Med_RdOpt_Pri, RdBeta_Verano, RdOpt_Ver, Med_RdOpt_Ver, RdBeta_Otonio, RdOpt_Oto, Med_RdOpt_Oto] = Rd_OptEstacional(RdBetaTotal, angOptim_Inv, angOptim_Pri, angOptim_Ver, angOptim_Oto);
        
        %Seguimientos------------------------------------------------------
        AlturaSolar = Altura_Solar ( LAT_RAD, Val_decli, numeroN, matriz_angulos);
        AzimutSolar = Azimut_Solar (AlturaSolar, LAT_RAD, Val_decli, numeroN);
               
        %SEGUIMIENTO EJE POLAR------------------------------------------
        %Directa (B)
        BhEjePolar = Bh_EjePolar(LAT_RAD, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjePolar, media_BdEjePolar] = Bd_EjePolar(BhEjePolar, numeroN);    
        %Difusa (D)
        DhEjePolar = Dh_EjePolar(Dh_matriz, numeroN, LAT_RAD, AlturaSolar, Val_decli, matriz_angulos);
        [DdEjePolar, media_DdEjePolar] = Dd_EjePolar(DhEjePolar, numeroN);
        %Reflejada (R)
        RhEjePolar = Rh_EjePolar(LAT_RAD, Gh_matriz, numeroN, AlturaSolar, Val_decli, matriz_angulos, COEF);
        [RdEjePolar, media_RdEjePolar] = Rd_EjePolar(RhEjePolar, numeroN);
        %Global (G)
        GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN);
        [GdEjePolar, media_GdEjePolar] = Gd_EjePolar(GhEjePolar, numeroN);  
        %------------------------------------------------------------------   
        
        %SEGUIMIENTO EJE AZIMUTAL------------------------------------------
        %Directa(B)
        BhEjeAzimutal = Bh_EjeAzimutal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [BdEjeAzimutal, media_BdEjeAzimutal] = Bd_EjeAzimutal(BhEjeAzimutal, numeroN);
        %Difusa(D)
        DhEjeAzimutal = Dh_EjeAzimutal(Dh_matriz, numeroN, LAT_RAD);
        [DdEjeAzimutal, media_DdEjeAzimutal] = Dd_EjeAzimutal(DhEjeAzimutal, numeroN);
        %Albedo o Reflejada (R)
        RhEjeAzimutal = Rh_EjeAzimutal(LAT_RAD, Gh_matriz, numeroN, COEF);
        [RdEjeAzimutal, media_RdEjeAzimutal] = Rd_EjeAzimutal(RhEjeAzimutal, numeroN);
        %Global(G)
        GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN);
        [GdEjeAzimutal, media_GdEjeAzimutal] = Gd_EjeAzimutal(GhEjeAzimutal, numeroN);        
        %------------------------------------------------------------------ 
                
        %SEGUIMIENTO EJE HORIZONTAL----------------------------------------
        %Directa (B)
        BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar);
        [BdEjeHorizontal, media_BdEjeHorizontal] = Bd_EjeHorizontal(BhEjeHorizontal, numeroN);
        %Difusa (D)
        DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar);
        [DdEjeHorizontal, media_DdEjeHorizontal] = Dd_EjeHorizontal(DhEjeHorizontal, numeroN);
        %Reflejada (R)
        RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF);
        [RdEjeHorizontal, media_RdEjeHorizontal] = Rd_EjeHorizontal(RhEjeHorizontal, numeroN);
        %Global (G)
        GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN);
        [GdEjeHorizontal, media_GdEjeHorizontal] = Gd_EjeHorizontal(GhEjeHorizontal, numeroN); 
        
        %SEGUIMIENTO A DOS EJES--------------------------------------------
        Beta_2Ejes = Calulo_Beta_2Ejes(AlturaSolar, numeroN);
        %Directa(B)
        Bh2Ejes = Bh_2Ejes(LAT_RAD, Beta_2Ejes, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN);
        [Bd2Ejes, media_Bd2Ejes] = Bd_2Ejes(Bh2Ejes, numeroN);
        %Difusa (D)
        Dh2Ejes = Dh_2Ejes(Beta_2Ejes, Dh_matriz, numeroN);
        [Dd2Ejes, media_Dd2Ejes] = Dd_2Ejes(Dh2Ejes, numeroN);
        %Reflejada (R)
        Rh2Ejes = Rh_2Ejes(Beta_2Ejes, Gh_matriz, numeroN, COEF);
        [Rd2Ejes, media_Rd2Ejes] = Rd_2Ejes(Rh2Ejes, numeroN);
        %Global (G)
        Gh2Ejes = Gh_2Ejes (Bh2Ejes, Dh2Ejes, Rh2Ejes, numeroN);
        [Gd2Ejes, media_Gd2Ejes] = Gd_2Ejes(Gh2Ejes, numeroN);
        
        Tabla_Comparativa; 
        close ('OrientSol 3.0 - Seleccionar un coeficiente de albedo');
        
        
end

% hObject    handle to Calcular (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)



%-------------------------------------------------------------------------%
%---------------------------------NADA------------------------------------%
%-------------------------------------------------------------------------%
function coef_Callback(hObject, eventdata, handles)
% hObject    handle to coef (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of coef as text
%        str2double(get(hObject,'String')) returns contents of coef as a double


% --- Executes during object creation, after setting all properties.
function coef_CreateFcn(hObject, eventdata, handles)
% hObject    handle to coef (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
