function varargout = Grafica_EjeHorizontal(varargin)
% GRAFICA_EJEHORIZONTAL MATLAB code for Grafica_EjeHorizontal.fig
%      GRAFICA_EJEHORIZONTAL, by itself, creates a new GRAFICA_EJEHORIZONTAL or raises the existing
%      singleton*.
%
%      H = GRAFICA_EJEHORIZONTAL returns the handle to a new GRAFICA_EJEHORIZONTAL or the handle to
%      the existing singleton*.
%
%      GRAFICA_EJEHORIZONTAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_EJEHORIZONTAL.M with the given input arguments.
%
%      GRAFICA_EJEHORIZONTAL('Property','Value',...) creates a new GRAFICA_EJEHORIZONTAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_EjeHorizontal_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_EjeHorizontal_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_EjeHorizontal

% Last Modified by GUIDE v2.5 24-Jan-2015 11:34:05

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_EjeHorizontal_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_EjeHorizontal_OutputFcn, ...
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


% --- Executes just before Grafica_EjeHorizontal is made visible.
function Grafica_EjeHorizontal_OpeningFcn(hObject, eventdata, handles, varargin)

global NOMBRE_CIUDAD DATOS;

global GdEjeHorizontal;
global PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;


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

%Radiación sobre el plano horizontal en "datos"
datos = zeros(1,12);
    for i=3:14
        datos(i-2) = DATOS(i);
    end
   
%Hacer visible el panel de los valores
set(handles.Valores_Rad,'Visible','on'); 
set(handles.Valores_Gan,'Visible','on'); 
%Advertencia para todas las componentes para las ganancias
set(handles.Adver1,'Visible','off');
set(handles.Adver2,'Visible','off');
%Rejilla 2 
set(handles.Rejilla2,'Visible','on');


%Gráfica de la RADIACIÓN--------------------------------------------------- 
axes(handles.C_EjeHor);
    
plot(GdEjeHorizontal,'Color',[.5 .8 .9],'LineWidth',2.5);
hold on;
plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
hold off;

     %Propiedades
           set(handles.C_EjeHor,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.hor', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
           
    %Valores mínimos, máximos y medios
    %Plano horizontal
    set(handles.C0_min,'String', roundn(min(datos),-2));
    set(handles.C0_med,'String', roundn(mean(datos),-2));
    set(handles.C0_max,'String', roundn(max(datos),-2));
    %Seguimiento eje horizontal
    set(handles.CEjeHor_min,'String', roundn(min(GdEjeHorizontal),-2));
    set(handles.CEjeHor_med,'String', roundn(mean(GdEjeHorizontal),-2)); 
    set(handles.CEjeHor_max,'String', roundn(max(GdEjeHorizontal),-2));
          
%Gráfica de las GANANCIAS--------------------------------------------------
GananciasG_Hor = zeros(12,5);
            for i=1:12
                GananciasG_Hor(i,1) = PorGanaG_Hor_0(i);
                GananciasG_Hor(i,2) = PorGanaG_Hor_Anu(i);
                GananciasG_Hor(i,3) = PorGanaG_Hor_Est(i);
                GananciasG_Hor(i,4) = PorGanaG_Hor_Pol(i);
                GananciasG_Hor(i,5) = PorGanaG_Hor_Azi(i);                
            end
            
axes(handles.C_GanaEjeHor);
bar(GananciasG_Hor);
colormap summer;
    
    %Propiedades
    set(handles.C_GanaEjeHor,'Xlim',[0 13]);
    title('Ganancias de radiación global para un seguimiento a un eje horizontal','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
    xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','location','BestOutside');
           
    grid off;
    set(handles.Rejilla2,'Value',0); 

    %Valores mínimos, máximos y medios
    %Hor_0
    set(handles.CGanaHor_0_min,'String', roundn(min(PorGanaG_Hor_0),-2));
    set(handles.CGanaHor_0_med,'String', roundn(mean(PorGanaG_Hor_0),-2)); 
    set(handles.CGanaHor_0_max,'String', roundn(max(PorGanaG_Hor_0),-2));
    %Hor_Anu
    set(handles.CGanaHor_Anu_min,'String', roundn(min(PorGanaG_Hor_Anu),-2));
    set(handles.CGanaHor_Anu_med,'String', roundn(mean(PorGanaG_Hor_Anu),-2)); 
    set(handles.CGanaHor_Anu_max,'String', roundn(max(PorGanaG_Hor_Anu),-2));
    %Hor_Est
    set(handles.CGanaHor_Est_min,'String', roundn(min(PorGanaG_Hor_Est),-2));
    set(handles.CGanaHor_Est_med,'String', roundn(mean(PorGanaG_Hor_Est),-2)); 
    set(handles.CGanaHor_Est_max,'String', roundn(max(PorGanaG_Hor_Est),-2));
    %Hor_Pol
    set(handles.CGanaHor_Pol_min,'String', roundn(min(PorGanaG_Hor_Pol),-2));
    set(handles.CGanaHor_Pol_med,'String', roundn(mean(PorGanaG_Hor_Pol),-2)); 
    set(handles.CGanaHor_Pol_max,'String', roundn(max(PorGanaG_Hor_Pol),-2));
   %Hor_Azi
    set(handles.CGanaHor_Azi_min,'String', roundn(min(PorGanaG_Hor_Azi),-2));
    set(handles.CGanaHor_Azi_med,'String', roundn(mean(PorGanaG_Hor_Azi),-2)); 
    set(handles.CGanaHor_Azi_max,'String', roundn(max(PorGanaG_Hor_Azi),-2));

% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_EjeHorizontal (see VARARGIN)

% Choose default command line output for Grafica_EjeHorizontal
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_EjeHorizontal wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_EjeHorizontal_OutputFcn(hObject, eventdata, handles) 
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
global DATOS GdEjeHorizontal;
global PorGanaG_Hor_0 PorGanaG_Hor_Anu PorGanaG_Hor_Est PorGanaG_Hor_Pol PorGanaG_Hor_Azi;
%Directa
global Val_Bdm0 BdEjeHorizontal;
global PorGanaB_Hor_0 PorGanaB_Hor_Anu PorGanaB_Hor_Est PorGanaB_Hor_Pol PorGanaB_Hor_Azi;
%Difusa
global Val_Ddm0 DdEjeHorizontal;
global PorGanaD_Hor_0 PorGanaD_Hor_Anu PorGanaD_Hor_Est PorGanaD_Hor_Pol PorGanaD_Hor_Azi;
%Albedo
global RdEjeHorizontal;
global PorGanaR_Hor_0 PorGanaR_Hor_Anu PorGanaR_Hor_Est PorGanaR_Hor_Pol PorGanaR_Hor_Azi;


%Radiación sobre el plano horizontal en "datos"
datos = zeros(1,12);
    for i=3:14
        datos(i-2) = DATOS(i);
    end
%Radiación de albedo sobre el plano horizontal en "Val_Rdm0"
Val_Rdm0 = zeros(1,12);


Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
       %Hacer visible el panel de los valores     
       set(handles.Valores_Rad,'Visible','on'); 
       set(handles.Valores_Gan,'Visible','on'); 
       
       set(handles.Adver1,'Visible','off');
       set(handles.Adver2,'Visible','off');
       
       set(handles.Rejilla2,'Visible','on');

       
        %Graficar RADIACIÓN------------------------------------------------
        axes(handles.C_EjeHor);

        plot(GdEjeHorizontal,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold off;

            %Propiedades
                   set(handles.C_EjeHor,'Xlim',[1 12]);
                   title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('Seg.hor', '0º','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(datos),-2));
            set(handles.C0_med,'String', roundn(mean(datos),-2));
            set(handles.C0_max,'String', roundn(max(datos),-2));
            %Seguimiento eje horizontal
            set(handles.CEjeHor_min,'String', roundn(min(GdEjeHorizontal),-2));
            set(handles.CEjeHor_med,'String', roundn(mean(GdEjeHorizontal),-2)); 
            set(handles.CEjeHor_max,'String', roundn(max(GdEjeHorizontal),-2));

        %Gráfica de las GANANCIAS--------------------------------------------------
        GananciasG_Hor = zeros(12,5);
                    for i=1:12
                        GananciasG_Hor(i,1) = PorGanaG_Hor_0(i);
                        GananciasG_Hor(i,2) = PorGanaG_Hor_Anu(i);
                        GananciasG_Hor(i,3) = PorGanaG_Hor_Est(i);
                        GananciasG_Hor(i,4) = PorGanaG_Hor_Pol(i);
                        GananciasG_Hor(i,5) = PorGanaG_Hor_Azi(i);                
                    end

        axes(handles.C_GanaEjeHor);
        bar(GananciasG_Hor);
        colormap summer;

            %Propiedades
            set(handles.C_GanaEjeHor,'Xlim',[0 13]);
            title('Ganancias de radiación global para un seguimiento a un eje horizontal','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Hor_0
            set(handles.CGanaHor_0_min,'String', roundn(min(PorGanaG_Hor_0),-2));
            set(handles.CGanaHor_0_med,'String', roundn(mean(PorGanaG_Hor_0),-2)); 
            set(handles.CGanaHor_0_max,'String', roundn(max(PorGanaG_Hor_0),-2));
            %Hor_Anu
            set(handles.CGanaHor_Anu_min,'String', roundn(min(PorGanaG_Hor_Anu),-2));
            set(handles.CGanaHor_Anu_med,'String', roundn(mean(PorGanaG_Hor_Anu),-2)); 
            set(handles.CGanaHor_Anu_max,'String', roundn(max(PorGanaG_Hor_Anu),-2));
            %Hor_Est
            set(handles.CGanaHor_Est_min,'String', roundn(min(PorGanaG_Hor_Est),-2));
            set(handles.CGanaHor_Est_med,'String', roundn(mean(PorGanaG_Hor_Est),-2)); 
            set(handles.CGanaHor_Est_max,'String', roundn(max(PorGanaG_Hor_Est),-2));
            %Hor_Pol
            set(handles.CGanaHor_Pol_min,'String', roundn(min(PorGanaG_Hor_Pol),-2));
            set(handles.CGanaHor_Pol_med,'String', roundn(mean(PorGanaG_Hor_Pol),-2)); 
            set(handles.CGanaHor_Pol_max,'String', roundn(max(PorGanaG_Hor_Pol),-2));
           %Hor_Azi
            set(handles.CGanaHor_Azi_min,'String', roundn(min(PorGanaG_Hor_Azi),-2));
            set(handles.CGanaHor_Azi_med,'String', roundn(mean(PorGanaG_Hor_Azi),-2)); 
            set(handles.CGanaHor_Azi_max,'String', roundn(max(PorGanaG_Hor_Azi),-2));
        
    case 2 %Directa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');  
        
        set(handles.Rejilla2,'Visible','on');

       
        %Graficar RADIACIÓN-------------------------------------------------
        axes(handles.C_EjeHor);

        plot(BdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[1 .6 .6],'LineWidth',2.5);
        hold off;

            %Propiedades
                   set(handles.C_EjeHor,'Xlim',[1 12]);
                   title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('Seg.hor', '0º','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Bdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Bdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Bdm0),-2));
            %Seguimiento eje horizontal
            set(handles.CEjeHor_min,'String', roundn(min(BdEjeHorizontal),-2));
            set(handles.CEjeHor_med,'String', roundn(mean(BdEjeHorizontal),-2)); 
            set(handles.CEjeHor_max,'String', roundn(max(BdEjeHorizontal),-2));
       
            
        %Gráfica de las GANANCIAS--------------------------------------------------
        GananciasB_Hor = zeros(12,5);
                    for i=1:12
                        GananciasB_Hor(i,1) = PorGanaB_Hor_0(i);
                        GananciasB_Hor(i,2) = PorGanaB_Hor_Anu(i);
                        GananciasB_Hor(i,3) = PorGanaB_Hor_Est(i);
                        GananciasB_Hor(i,4) = PorGanaB_Hor_Pol(i);
                        GananciasB_Hor(i,5) = PorGanaB_Hor_Azi(i);                
                    end

        axes(handles.C_GanaEjeHor);
        bar(GananciasB_Hor);
        colormap summer;

            %Propiedades
            set(handles.C_GanaEjeHor,'Xlim',[0 13]);
            title('Ganancias de radiación directa para un seguimiento a un eje horizontal','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %EjeHor_0
            set(handles.CGanaHor_0_min,'String', roundn(min(PorGanaB_Hor_0),-2));
            set(handles.CGanaHor_0_med,'String', roundn(mean(PorGanaB_Hor_0),-2)); 
            set(handles.CGanaHor_0_max,'String', roundn(max(PorGanaB_Hor_0),-2));
            %EjeHor_Anu
            set(handles.CGanaHor_Anu_min,'String', roundn(min(PorGanaB_Hor_Anu),-2));
            set(handles.CGanaHor_Anu_med,'String', roundn(mean(PorGanaB_Hor_Anu),-2)); 
            set(handles.CGanaHor_Anu_max,'String', roundn(max(PorGanaB_Hor_Anu),-2));
            %EjeHor_Est
            set(handles.CGanaHor_Est_min,'String', roundn(min(PorGanaB_Hor_Est),-2));
            set(handles.CGanaHor_Est_med,'String', roundn(mean(PorGanaB_Hor_Est),-2)); 
            set(handles.CGanaHor_Est_max,'String', roundn(max(PorGanaB_Hor_Est),-2));
            %EjeHor_Pol
            set(handles.CGanaHor_Pol_min,'String', roundn(min(PorGanaB_Hor_Pol),-2));
            set(handles.CGanaHor_Pol_med,'String', roundn(mean(PorGanaB_Hor_Pol),-2)); 
            set(handles.CGanaHor_Pol_max,'String', roundn(max(PorGanaG_Hor_Pol),-2));
           %EjeHor_Azi
            set(handles.CGanaHor_Azi_min,'String', roundn(min(PorGanaB_Hor_Azi),-2));
            set(handles.CGanaHor_Azi_med,'String', roundn(mean(PorGanaB_Hor_Azi),-2)); 
            set(handles.CGanaHor_Azi_max,'String', roundn(max(PorGanaB_Hor_Azi),-2));
        
    case 3 %Difusa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
        
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');
        
        set(handles.Rejilla2,'Visible','on');

       
        %Graficar RADIACIÓN------------------------------------------------          
        axes(handles.C_EjeHor); 
        
        plot(DdEjeHorizontal,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold off;
        
        %Propiedades
           set(handles.C_EjeHor,'Xlim',[1 12]);
           title('Radiación difusa(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.hor', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Ddm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Ddm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Ddm0),-2));
            %Seguimiento eje horizontal
            set(handles.CEjeHor_min,'String', roundn(min(DdEjeHorizontal),-2));
            set(handles.CEjeHor_med,'String', roundn(mean(DdEjeHorizontal),-2));     
            set(handles.CEjeHor_max,'String', roundn(max(DdEjeHorizontal),-2));

        %Gráfica de las GANANCIAS------------------------------------------
        GananciasD_Hor = zeros(12,5);
                    for i=1:12
                        GananciasD_Hor(i,1) = PorGanaD_Hor_0(i);
                        GananciasD_Hor(i,2) = PorGanaD_Hor_Anu(i);
                        GananciasD_Hor(i,3) = PorGanaD_Hor_Est(i);
                        GananciasD_Hor(i,4) = PorGanaD_Hor_Pol(i);
                        GananciasD_Hor(i,5) = PorGanaD_Hor_Azi(i);                
                    end

        axes(handles.C_GanaEjeHor);
        bar(GananciasD_Hor);
        colormap summer;

            %Propiedades
            set(handles.C_GanaEjeHor,'Xlim',[0 13]);
            title('Ganancias de radiación difusa para un seguimiento a un eje horizontal','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %EjeHor_0
            set(handles.CGanaHor_0_min,'String', roundn(min(PorGanaD_Hor_0),-2));
            set(handles.CGanaHor_0_med,'String', roundn(mean(PorGanaD_Hor_0),-2)); 
            set(handles.CGanaHor_0_max,'String', roundn(max(PorGanaD_Hor_0),-2));
            %EjeHor_Anu
            set(handles.CGanaHor_Anu_min,'String', roundn(min(PorGanaD_Hor_Anu),-2));
            set(handles.CGanaHor_Anu_med,'String', roundn(mean(PorGanaD_Hor_Anu),-2)); 
            set(handles.CGanaHor_Anu_max,'String', roundn(max(PorGanaD_Hor_Anu),-2));
            %EjeHor_Est
            set(handles.CGanaHor_Est_min,'String', roundn(min(PorGanaD_Hor_Est),-2));
            set(handles.CGanaHor_Est_med,'String', roundn(mean(PorGanaD_Hor_Est),-2)); 
            set(handles.CGanaHor_Est_max,'String', roundn(max(PorGanaD_Hor_Est),-2));
            %EjeHor_Pol
            set(handles.CGanaHor_Pol_min,'String', roundn(min(PorGanaD_Hor_Pol),-2));
            set(handles.CGanaHor_Pol_med,'String', roundn(mean(PorGanaD_Hor_Pol),-2)); 
            set(handles.CGanaHor_Pol_max,'String', roundn(max(PorGanaD_Hor_Pol),-2));
           %EjeHor_Azi
            set(handles.CGanaHor_Azi_min,'String', roundn(min(PorGanaD_Hor_Azi),-2));
            set(handles.CGanaHor_Azi_med,'String', roundn(mean(PorGanaD_Hor_Azi),-2)); 
            set(handles.CGanaHor_Azi_max,'String', roundn(max(PorGanaD_Hor_Azi),-2));
        
        
    case 4 %Albedo
        
        %warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');        
       
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
        
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');
        
        set(handles.Rejilla2,'Visible','on'); 

       
        %Graficar RADIACIÓN------------------------------------------------     
        axes(handles.C_EjeHor);
        
        plot(RdEjeHorizontal,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_EjeHor,'Xlim',[1 12]);
           title('Radiación de albedo(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.hor', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Rdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Rdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Rdm0),-2));
            %Seguimiento eje horizontal
            set(handles.CEjeHor_min,'String', roundn(min(RdEjeHorizontal),-2));
            set(handles.CEjeHor_med,'String', roundn(mean(RdEjeHorizontal),-2));            
            set(handles.CEjeHor_max,'String', roundn(max(RdEjeHorizontal),-2));
        
        %Gráfica de las GANANCIAS------------------------------------------
        GananciasR_Hor = zeros(12,5);
                    for i=1:12
                        GananciasR_Hor(i,1) = PorGanaR_Hor_0(i);
                        GananciasR_Hor(i,2) = PorGanaR_Hor_Anu(i);
                        GananciasR_Hor(i,3) = PorGanaR_Hor_Est(i);
                        GananciasR_Hor(i,4) = PorGanaR_Hor_Pol(i);
                        GananciasR_Hor(i,5) = PorGanaR_Hor_Azi(i);                
                    end

        axes(handles.C_GanaEjeHor);
        bar(GananciasR_Hor);
        colormap summer;

            %Propiedades
            set(handles.C_GanaEjeHor,'Xlim',[0 13]);
            title('Ganancias de radiación de albedo para un seguimiento a un eje horizontal','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %%EjeHor_0
            set(handles.CGanaHor_0_min,'String', '-');
            set(handles.CGanaHor_0_med,'String', '-');
            set(handles.CGanaHor_0_max,'String', '-');
            %%EjeHor_Anu
            if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
                set(handles.CGanaHor_Anu_min,'String','-');
                set(handles.CGanaHor_Anu_med,'String','-');
                set(handles.CGanaHor_Anu_max,'String','-');
            else
                set(handles.CGanaHor_Anu_min,'String', roundn(min(PorGanaR_Hor_Anu),-2));
                set(handles.CGanaHor_Anu_med,'String', roundn(mean(PorGanaR_Hor_Anu),-2)); 
                set(handles.CGanaHor_Anu_max,'String', roundn(max(PorGanaR_Hor_Anu),-2));
            end
            %EjeHor_Est
            if min(PorGanaR_Hor_Est) == Inf
                set(handles.CGanaHor_Est_min,'String','-');
            else
                set(handles.CGanaHor_Est_min,'String',roundn(min(PorGanaR_Hor_Est),-2));
            end
            
            if mean(PorGanaR_Hor_Est) == Inf
                set(handles.CGanaHor_Est_med,'String','-');
            else
                set(handles.CGanaHor_Est_med,'String',roundn(mean(PorGanaR_Hor_Est),-2)); 
            end
            
            if max(PorGanaR_Hor_Est) == Inf
                set(handles.CGanaHor_Est_max,'String','-');
            else
                set(handles.CGanaHor_Est_max,'String',roundn(max(PorGanaR_Hor_Est),-2));
            end

            %EjeHor_Pol
            set(handles.CGanaHor_Pol_min,'String', roundn(min(PorGanaR_Hor_Pol),-2));
            set(handles.CGanaHor_Pol_med,'String', roundn(mean(PorGanaR_Hor_Pol),-2)); 
            set(handles.CGanaHor_Pol_max,'String', roundn(max(PorGanaR_Hor_Pol),-2));
            %EjeHor_Azi
            set(handles.CGanaHor_Azi_min,'String', roundn(min(PorGanaR_Hor_Azi),-2));
            set(handles.CGanaHor_Azi_med,'String', roundn(mean(PorGanaR_Hor_Azi),-2)); 
            set(handles.CGanaHor_Azi_max,'String', roundn(max(PorGanaR_Hor_Azi),-2));   
        
        
    case 5 %Todos  
        %Hacer invisible el panel de los valores
        set(handles.Valores_Rad,'Visible','off');
        set(handles.Valores_Gan,'Visible','off'); 
        
        set(handles.Adver1,'Visible','on');
        set(handles.Adver2,'Visible','on');

       
        %Graficar RADIACIÓN------------------------------------------------    
        axes(handles.C_EjeHor); 
        plot(GdEjeHorizontal,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold on;
        plot(BdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold on;
        plot(DdEjeHorizontal,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold on;
        plot(RdEjeHorizontal,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_EjeHor,'Xlim',[1 12]);
           title('Todas las componentes de la radiación','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Gdm(hor)', 'Gdm(0º)','Bdm(hor)', 'Bdm(0º)','Ddm(hor)', 'Ddm(0º)','Rdm(hor)', 'Rdm(0º)','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);

           
        %Gráfica de las GANANCIAS------------------------------------------ 
        axes(handles.C_GanaEjeHor);
        %Vacío.
        bar(0);
        colormap summer;

            %Propiedades
            
            title('','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           
            grid off;
            set(handles.Rejilla2,'Visible','off'); 
            set(handles.C_GanaEjeHor,'Visible','off');
        
        
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

Tabla_EjeHorizontal;

close ('OrientSol 3.0 - Gráficas para seguimiento a un eje horizontal');


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.C_EjeHor,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_EjeHor,'xgrid','off','ygrid','off');
        
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
        
        set(handles.C_GanaEjeHor,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_GanaEjeHor,'xgrid','off','ygrid','off');
        
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

% --- Executes during object creation, after setting all properties.
function uipanel5_CreateFcn(hObject, eventdata, handles)
% hObject    handle to uipanel5 (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called


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
