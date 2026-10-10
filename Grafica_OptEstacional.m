function varargout = Grafica_OptEstacional(varargin)
% GRAFICA_OPTESTACIONAL MATLAB code for Grafica_OptEstacional.fig
%      GRAFICA_OPTESTACIONAL, by itself, creates a new GRAFICA_OPTESTACIONAL or raises the existing
%      singleton*.
%
%      H = GRAFICA_OPTESTACIONAL returns the handle to a new GRAFICA_OPTESTACIONAL or the handle to
%      the existing singleton*.
%
%      GRAFICA_OPTESTACIONAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_OPTESTACIONAL.M with the given input arguments.
%
%      GRAFICA_OPTESTACIONAL('Property','Value',...) creates a new GRAFICA_OPTESTACIONAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_OptEstacional_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_OptEstacional_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_OptEstacional

% Last Modified by GUIDE v2.5 24-Jan-2015 11:50:53

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_OptEstacional_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_OptEstacional_OutputFcn, ...
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


% --- Executes just before Grafica_OptEstacional is made visible.
function Grafica_OptEstacional_OpeningFcn(hObject, eventdata, handles, varargin)

global NOMBRE_CIUDAD DATOS;
global angOptim_Inv angOptim_Pri angOptim_Ver angOptim_Oto;

global GdOpt_Inv GdOpt_Pri GdOpt_Oto GdOpt_Ver;
global PorGanaG_Est_0 PorGanaG_Est_Anu;


%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Mostrar el logotipo
axes(handles.logotipo);
imagen_tit1=imread('Titulo.png');
imagen1_tit1=imresize(imagen_tit1,[30 153]); %Para ajustarlo directamente
imshow(imagen1_tit1);
axis off; 

%Cabecera
set(handles.Ciudad,'String',NOMBRE_CIUDAD);
set(handles.Latitud,'String',roundn(DATOS(2),-2));

%Ángulos óptimos
set (handles.ang_opt_inv,'String', angOptim_Inv);
set(handles.ang_opt_pri, 'String', angOptim_Pri);
set (handles.ang_opt_ver,'String', angOptim_Ver);
set(handles.ang_opt_oto, 'String', angOptim_Oto);

%Radiación sobre el plano horizontal en "datos"
datos = zeros(1,12);
    for i=3:14
        datos(i-2) = DATOS(i);
    end
    
%Valores estacionales
%Global 
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
    
    
%Hacer visible el panel de los valores
set(handles.Valores_Rad,'Visible','on'); 
set(handles.Valores_Gan,'Visible','on'); 


%Gráfica de la RADIACIÓN--------------------------------------------------- 
axes(handles.C_OptEst);
    
plot(RadiacionG_optima_Est,'Color',[.5 .8 .9],'LineWidth',2.5);
hold on;
plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
hold off;

     %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt.est', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
           
    %Valores mínimos, máximos y medios
    %Plano horizontal
    set(handles.C0_min,'String', roundn(min(datos),-2));
    set(handles.C0_med,'String', roundn(mean(datos),-2));
    set(handles.C0_max,'String', roundn(max(datos),-2));
    %Inclinación óptima estacional
    set(handles.COptEst_min,'String', roundn(min(RadiacionG_optima_Est),-2));
    set(handles.COptEst_med,'String', roundn(mean(RadiacionG_optima_Est),-2)); 
    set(handles.COptEst_max,'String', roundn(max(RadiacionG_optima_Est),-2));
          
%Gráfica de las GANANCIAS--------------------------------------------------
GananciasG_Est = zeros(12,2);
            for i=1:12
                GananciasG_Est(i,1) = PorGanaG_Est_0(i);
                GananciasG_Est(i,2) = PorGanaG_Est_Anu(i);
            end
            
axes(handles.C_GanaOptEst);
bar(GananciasG_Est);
colormap summer;
    
    %Propiedades
    set(handles.C_GanaOptEst,'Xlim',[0 13]);
    title('Ganancias de radiación global para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
    xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    legend('0º', 'Ópt.anu','location','BestOutside');
           
    grid off;
    set(handles.Rejilla2,'Value',0); 

    %Valores mínimos, máximos y medios
    %Óptima estacional_0
    set(handles.CGanaOptEst_0_min,'String', roundn(min(PorGanaG_Est_0),-2));
    set(handles.CGanaOptEst_0_med,'String', roundn(mean(PorGanaG_Est_0),-2)); 
    set(handles.CGanaOptEst_0_max,'String', roundn(max(PorGanaG_Est_0),-2));
    %Óptima estacional_Anu
    set(handles.CGanaOptEst_Anu_min,'String', roundn(min(PorGanaG_Est_Anu),-2));
    set(handles.CGanaOptEst_Anu_med,'String', roundn(mean(PorGanaG_Est_Anu),-2)); 
    set(handles.CGanaOptEst_Anu_max,'String', roundn(max(PorGanaG_Est_Anu),-2));

% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_OptEstacional (see VARARGIN)

% Choose default command line output for Grafica_OptEstacional
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_OptEstacional wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_OptEstacional_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)
global angulo_optimo;
%Global
global DATOS GdOpt_Inv GdOpt_Pri GdOpt_Oto GdOpt_Ver;
global PorGanaG_Est_0 PorGanaG_Est_Anu;
%Directa
global Val_Bdm0 BdOpt_Inv BdOpt_Pri BdOpt_Oto BdOpt_Ver;
global PorGanaB_Est_0 PorGanaB_Est_Anu;
%Difusa
global Val_Ddm0 DdOpt_Inv DdOpt_Pri DdOpt_Oto DdOpt_Ver;
global PorGanaD_Est_0 PorGanaD_Est_Anu;
%Albedo
global RdOpt_Inv RdOpt_Pri RdOpt_Oto RdOpt_Ver;
global PorGanaR_Est_0 PorGanaR_Est_Anu;


%Radiación sobre el plano horizontal en "datos"
datos = zeros(1,12);
    for i=3:14
        datos(i-2) = DATOS(i);
    end
%Radiación de albedo sobre el plano horizontal en "Val_Rdm0"
Val_Rdm0 = zeros(1,12);

%Valores estacionales
%Global 
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
%Directa
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

%Difusa
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

%Albedo
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

Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
       %Hacer visible el panel de los valores     
       set(handles.Valores_Rad,'Visible','on'); 
       set(handles.Valores_Gan,'Visible','on'); 
       
       %Graficar RADIACIÓN-------------------------------------------------
       axes(handles.C_OptEst); 
       plot(RadiacionG_optima_Est,'Color',[.5 .8 .9],'LineWidth',2.5);
       hold on;
       plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
       hold off;
       %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt.est', '0º','location','BestOutside');
     
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(datos),-2));
            set(handles.C0_med,'String', roundn(mean(datos),-2));
            set(handles.C0_max,'String', roundn(max(datos),-2));
            %Inclinación óptima estacional
            set(handles.COptEst_min,'String', roundn(min(RadiacionG_optima_Est),-2));
            set(handles.COptEst_med,'String', roundn(mean(RadiacionG_optima_Est),-2));   
            set(handles.COptEst_max,'String', roundn(max(RadiacionG_optima_Est),-2));
        
        
        %Gráfica de las GANANCIAS------------------------------------------
        GananciasG_Est = zeros(12,2);
                    for i=1:12
                        GananciasG_Est(i,1) = PorGanaG_Est_0(i);
                        GananciasG_Est(i,2) = PorGanaG_Est_Anu(i);
                    end

        axes(handles.C_GanaOptEst);
        bar(GananciasG_Est);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptEst,'Xlim',[0 13]);
            title('Ganancias de radiación global para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º', 'Ópt.anu','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima estacional_0
            set(handles.CGanaOptEst_0_min,'String', roundn(min(PorGanaG_Est_0),-2));
            set(handles.CGanaOptEst_0_med,'String', roundn(mean(PorGanaG_Est_0),-2)); 
            set(handles.CGanaOptEst_0_max,'String', roundn(max(PorGanaG_Est_0),-2));
            %Óptima estacional_Anu
            set(handles.CGanaOptEst_Anu_min,'String', roundn(min(PorGanaG_Est_Anu),-2));
            set(handles.CGanaOptEst_Anu_med,'String', roundn(mean(PorGanaG_Est_Anu),-2)); 
            set(handles.CGanaOptEst_Anu_max,'String', roundn(max(PorGanaG_Est_Anu),-2));
        
    case 2 %Directa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN-------------------------------------------------
        axes(handles.C_OptEst); 
        plot(RadiacionB_optima_Est,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Radiación directa(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt.est', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
 
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Bdm0),-2)); 
            set(handles.C0_med,'String', roundn(mean(Val_Bdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Bdm0),-2));
            %Inclinación óptima estacional
            set(handles.COptEst_min,'String', roundn(min(RadiacionB_optima_Est),-2));
            set(handles.COptEst_med,'String', roundn(mean(RadiacionB_optima_Est),-2));             
            set(handles.COptEst_max,'String', roundn(max(RadiacionB_optima_Est),-2)); 

        %Gráfica de las GANANCIAS------------------------------------------
        GananciasB_Est = zeros(12,2);
                    for i=1:12
                        GananciasB_Est(i,1) = PorGanaB_Est_0(i);
                        GananciasB_Est(i,2) = PorGanaB_Est_Anu(i);
                    end

        axes(handles.C_GanaOptEst);
        bar(GananciasB_Est);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptEst,'Xlim',[0 13]);
            title('Ganancias de radiación directa para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º', 'Ópt.anu','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima estacional_0
            set(handles.CGanaOptEst_0_min,'String', roundn(min(PorGanaB_Est_0),-2));
            set(handles.CGanaOptEst_0_med,'String', roundn(mean(PorGanaB_Est_0),-2)); 
            set(handles.CGanaOptEst_0_max,'String', roundn(max(PorGanaB_Est_0),-2));
            %Óptima estacional_Anu
            set(handles.CGanaOptEst_Anu_min,'String', roundn(min(PorGanaB_Est_Anu),-2));
            set(handles.CGanaOptEst_Anu_med,'String', roundn(mean(PorGanaB_Est_Anu),-2)); 
            set(handles.CGanaOptEst_Anu_max,'String', roundn(max(PorGanaB_Est_Anu),-2));      
        
    case 3 %Difusa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN------------------------------------------------          
        axes(handles.C_OptEst); 
        plot(RadiacionD_optima_Est,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Radiación difusa(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt.est', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Ddm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Ddm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Ddm0),-2));
            %Inclinación óptima estacional
            set(handles.COptEst_min,'String', roundn(min(RadiacionD_optima_Est),-2));
            set(handles.COptEst_med,'String', roundn(mean(RadiacionD_optima_Est),-2));     
            set(handles.COptEst_max,'String', roundn(max(RadiacionD_optima_Est),-2));

        %Gráfica de las GANANCIAS------------------------------------------
        GananciasD_Est = zeros(12,2);
                    for i=1:12
                        GananciasD_Est(i,1) = PorGanaD_Est_0(i);
                        GananciasD_Est(i,2) = PorGanaD_Est_Anu(i);
                    end

        axes(handles.C_GanaOptEst);
        bar(GananciasD_Est);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptEst,'Xlim',[0 13]);
            title('Ganancias de radiación difusa para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º', 'Ópt.anu','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima estacional_0
            set(handles.CGanaOptEst_0_min,'String', roundn(min(PorGanaD_Est_0),-2));
            set(handles.CGanaOptEst_0_med,'String', roundn(mean(PorGanaD_Est_0),-2)); 
            set(handles.CGanaOptEst_0_max,'String', roundn(max(PorGanaD_Est_0),-2));
            %Óptima estacional_Anu
            set(handles.CGanaOptEst_Anu_min,'String', roundn(min(PorGanaD_Est_Anu),-2));
            set(handles.CGanaOptEst_Anu_med,'String', roundn(mean(PorGanaD_Est_Anu),-2)); 
            set(handles.CGanaOptEst_Anu_max,'String', roundn(max(PorGanaD_Est_Anu),-2));    
        
        
    case 4 %Albedo
        
        %warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
         
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN------------------------------------------------     
        axes(handles.C_OptEst); 
        plot(RadiacionR_optima_Est,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Radiación de albedo(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt.est', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Rdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Rdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Rdm0),-2));
            %Inclinación óptima estacional
            set(handles.COptEst_min,'String', roundn(min(RadiacionR_optima_Est),-2));
            set(handles.COptEst_med,'String', roundn(mean(RadiacionR_optima_Est),-2));            
            set(handles.COptEst_max,'String', roundn(max(RadiacionR_optima_Est),-2));
        
        %Gráfica de las GANANCIAS------------------------------------------
        GananciasR_Est = zeros(12,2);
                    for i=1:12
                        GananciasR_Est(i,1) = PorGanaR_Est_0(i);
                        GananciasR_Est(i,2) = PorGanaR_Est_Anu(i);
                    end

        axes(handles.C_GanaOptEst);
        bar(GananciasR_Est);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptEst,'Xlim',[0 13]);
            title('Ganancias de radiación de albedo para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º', 'Ópt.anu','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima estacional_0
            set(handles.CGanaOptEst_0_min,'String', '-');
            set(handles.CGanaOptEst_0_med,'String', '-');
            set(handles.CGanaOptEst_0_max,'String', '-');
            %Óptima estacional_Anu
            if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
                set(handles.CGanaOptEst_Anu_min,'String','-');
                set(handles.CGanaOptEst_Anu_med,'String','-');
                set(handles.CGanaOptEst_Anu_max,'String','-');     
            else
                set(handles.CGanaOptEst_Anu_min,'String', roundn(min(PorGanaR_Est_Anu),-2));
                set(handles.CGanaOptEst_Anu_med,'String', roundn(mean(PorGanaR_Est_Anu),-2)); 
                set(handles.CGanaOptEst_Anu_max,'String', roundn(max(PorGanaR_Est_Anu),-2));           
            end
        
    case 5 %Todos  
        %Hacer invisible el panel de los valores
        set(handles.Valores_Rad,'Visible','off');
        set(handles.Valores_Gan,'Visible','off'); 
        
        %Graficar RADIACIÓN------------------------------------------------    
        axes(handles.C_OptEst); 
        plot(RadiacionG_optima_Est,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold on;
        plot(RadiacionB_optima_Est,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold on;
        plot(RadiacionD_optima_Est,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold on;
        plot(RadiacionR_optima_Est,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptEst,'Xlim',[1 12]);
           title('Todas las componentes de la radiación','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Gdm(ópt)', 'Gdm(0º)','Bdm(ópt)', 'Bdm(0º)','Ddm(ópt)', 'Ddm(0º)','Rdm(ópt)', 'Rdm(0º)','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);

           
        %Gráfica de las GANANCIAS------------------------------------------ 
        %Creamos la matriz a graficar
        Ganancias_Est = zeros(12,8);
                    for i=1:12
                        Ganancias_Est(i,1) = PorGanaG_Est_0(i);
                        Ganancias_Est(i,2) = PorGanaG_Est_Anu(i);
                        Ganancias_Est(i,3) = PorGanaB_Est_0(i);
                        Ganancias_Est(i,4) = PorGanaB_Est_Anu(i);
                        Ganancias_Est(i,5) = PorGanaD_Est_0(i);
                        Ganancias_Est(i,6) = PorGanaD_Est_Anu(i);
                        Ganancias_Est(i,7) = PorGanaR_Est_0(i);
                        Ganancias_Est(i,8) = PorGanaR_Est_Anu(i);
                                               
                    end
            
        %Graficamos
        axes(handles.C_GanaOptEst);
        bar(Ganancias_Est);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptEst,'Xlim',[0 13]);
            title('Ganancias de todas las componentes para la inclinación óptima estacional','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º- G','Anu- G','0º- B','Anu- B','0º- D','Anu- D','0º- R','Anu- R','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

        
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


% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Tabla_OptEstacional;
close ('OrientSol 3.0 - Gráficas para inclinación óptima estacional');


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.C_OptEst,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_OptEst,'xgrid','off','ygrid','off');
        
end

% hObject    handle to Rejilla (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Rejilla
guidata(hObject, handles);


% --- Executes on button press in Rejilla2.
function Rejilla2_Callback(hObject, eventdata, handles)
caso2 = get(handles.Rejilla2,'Value');

switch caso2
    
    case 1
        
        set(handles.C_GanaOptEst,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_GanaOptEst,'xgrid','off','ygrid','off');
        
end

% hObject    handle to Rejilla (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Rejilla
guidata(hObject, handles);


% --------------------------------------------------------------------
function Guardar_ClickedCallback(hObject, eventdata, handles)

[nombre,ruta] = uiputfile({'*.bmp','BMP (*.bmp)'},'Guardar Gráfica');
if nombre==0
     return
end


saveas(gcf,[ruta nombre]);

msgbox('Imagen guardada en el directorio deseado');


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
