function varargout = Grafica_2Ejes(varargin)
% GRAFICA_2EJES MATLAB code for Grafica_2Ejes.fig
%      GRAFICA_2EJES, by itself, creates a new GRAFICA_2EJES or raises the existing
%      singleton*.
%
%      H = GRAFICA_2EJES returns the handle to a new GRAFICA_2EJES or the handle to
%      the existing singleton*.
%
%      GRAFICA_2EJES('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_2EJES.M with the given input arguments.
%
%      GRAFICA_2EJES('Property','Value',...) creates a new GRAFICA_2EJES or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_2Ejes_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_2Ejes_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_2Ejes

% Last Modified by GUIDE v2.5 24-Jan-2015 11:41:35

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_2Ejes_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_2Ejes_OutputFcn, ...
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


% --- Executes just before Grafica_2Ejes is made visible.
function Grafica_2Ejes_OpeningFcn(hObject, eventdata, handles, varargin)

global NOMBRE_CIUDAD DATOS;

global Gd2Ejes;
global PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;


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
axes(handles.C_2Ejes);
    
plot(Gd2Ejes,'Color',[.5 .8 .9],'LineWidth',2.5);
hold on;
plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
hold off;

     %Propiedades
           set(handles.C_2Ejes,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.2ej', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
           
    %Valores mínimos, máximos y medios
    %Plano horizontal
    set(handles.C0_min,'String', roundn(min(datos),-2));
    set(handles.C0_med,'String', roundn(mean(datos),-2));
    set(handles.C0_max,'String', roundn(max(datos),-2));
    %Seguimiento 2 ejes
    set(handles.C2Ejes_min,'String', roundn(min(Gd2Ejes),-2));
    set(handles.C2Ejes_med,'String', roundn(mean(Gd2Ejes),-2)); 
    set(handles.C2Ejes_max,'String', roundn(max(Gd2Ejes),-2));
          
%Gráfica de las GANANCIAS--------------------------------------------------
GananciasG_2Ej = zeros(12,6);
            for i=1:12
                GananciasG_2Ej(i,1) = PorGanaG_2Ej_0(i);
                GananciasG_2Ej(i,2) = PorGanaG_2Ej_Anu(i);
                GananciasG_2Ej(i,3) = PorGanaG_2Ej_Est(i);
                GananciasG_2Ej(i,4) = PorGanaG_2Ej_Pol(i);
                GananciasG_2Ej(i,5) = PorGanaG_2Ej_Azi(i);  
                GananciasG_2Ej(i,6) = PorGanaG_2Ej_Hor(i);
            end
            
axes(handles.C_Gana2Ejes);
bar(GananciasG_2Ej);
colormap summer;
    
    %Propiedades
    set(handles.C_Gana2Ejes,'Xlim',[0 13]);
    title('Ganancias de radiación global para un seguimiento a dos ejes','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
    xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','Seg.hor','location','BestOutside');
           
    grid off;
    set(handles.Rejilla2,'Value',0); 

    %Valores mínimos, máximos y medios
    %2Ejes_0
    set(handles.CGana2Ej_0_min,'String', roundn(min(PorGanaG_2Ej_0),-2));
    set(handles.CGana2Ej_0_med,'String', roundn(mean(PorGanaG_2Ej_0),-2)); 
    set(handles.CGana2Ej_0_max,'String', roundn(max(PorGanaG_2Ej_0),-2));
    %2Ejes_Anu
    set(handles.CGana2Ej_Anu_min,'String', roundn(min(PorGanaG_2Ej_Anu),-2));
    set(handles.CGana2Ej_Anu_med,'String', roundn(mean(PorGanaG_2Ej_Anu),-2)); 
    set(handles.CGana2Ej_Anu_max,'String', roundn(max(PorGanaG_2Ej_Anu),-2));
    %2Ejes_Est
    set(handles.CGana2Ej_Est_min,'String', roundn(min(PorGanaG_2Ej_Est),-2));
    set(handles.CGana2Ej_Est_med,'String', roundn(mean(PorGanaG_2Ej_Est),-2)); 
    set(handles.CGana2Ej_Est_max,'String', roundn(max(PorGanaG_2Ej_Est),-2));
    %2Ejes_Pol
    set(handles.CGana2Ej_Pol_min,'String', roundn(min(PorGanaG_2Ej_Pol),-2));
    set(handles.CGana2Ej_Pol_med,'String', roundn(mean(PorGanaG_2Ej_Pol),-2)); 
    set(handles.CGana2Ej_Pol_max,'String', roundn(max(PorGanaG_2Ej_Pol),-2));
    %2Ejes_Azi
    set(handles.CGana2Ej_Azi_min,'String', roundn(min(PorGanaG_2Ej_Azi),-2));
    set(handles.CGana2Ej_Azi_med,'String', roundn(mean(PorGanaG_2Ej_Azi),-2)); 
    set(handles.CGana2Ej_Azi_max,'String', roundn(max(PorGanaG_2Ej_Azi),-2));
    %2Ejes_Hor
    set(handles.CGana2Ej_Hor_min,'String', roundn(min(PorGanaG_2Ej_Hor),-2));
    set(handles.CGana2Ej_Hor_med,'String', roundn(mean(PorGanaG_2Ej_Hor),-2)); 
    set(handles.CGana2Ej_Hor_max,'String', roundn(max(PorGanaG_2Ej_Hor),-2));

% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_2Ejes (see VARARGIN)

% Choose default command line output for Grafica_2Ejes
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_2Ejes wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_2Ejes_OutputFcn(hObject, eventdata, handles) 
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
global DATOS Gd2Ejes;
global PorGanaG_2Ej_0 PorGanaG_2Ej_Anu PorGanaG_2Ej_Est PorGanaG_2Ej_Pol PorGanaG_2Ej_Azi PorGanaG_2Ej_Hor;
%Directa
global Val_Bdm0 Bd2Ejes;
global PorGanaB_2Ej_0 PorGanaB_2Ej_Anu PorGanaB_2Ej_Est PorGanaB_2Ej_Pol PorGanaB_2Ej_Azi PorGanaB_2Ej_Hor;
%Difusa
global Val_Ddm0 Dd2Ejes;
global PorGanaD_2Ej_0 PorGanaD_2Ej_Anu PorGanaD_2Ej_Est PorGanaD_2Ej_Pol PorGanaD_2Ej_Azi PorGanaD_2Ej_Hor;
%Albedo
global Rd2Ejes;
global PorGanaR_2Ej_0 PorGanaR_2Ej_Anu PorGanaR_2Ej_Est PorGanaR_2Ej_Pol PorGanaR_2Ej_Azi PorGanaR_2Ej_Hor;


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
        axes(handles.C_2Ejes);

        plot(Gd2Ejes,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold off;

            %Propiedades
                   set(handles.C_2Ejes,'Xlim',[1 12]);
                   title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('Seg.2ej', '0º','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(datos),-2));
            set(handles.C0_med,'String', roundn(mean(datos),-2));
            set(handles.C0_max,'String', roundn(max(datos),-2));
            %Seguimiento 2 ejes
            set(handles.C2Ejes_min,'String', roundn(min(Gd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Gd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Gd2Ejes),-2));

        %Gráfica de las GANANCIAS--------------------------------------------------
        GananciasG_2Ej = zeros(12,6);
                    for i=1:12
                        GananciasG_2Ej(i,1) = PorGanaG_2Ej_0(i);
                        GananciasG_2Ej(i,2) = PorGanaG_2Ej_Anu(i);
                        GananciasG_2Ej(i,3) = PorGanaG_2Ej_Est(i);
                        GananciasG_2Ej(i,4) = PorGanaG_2Ej_Pol(i);
                        GananciasG_2Ej(i,5) = PorGanaG_2Ej_Azi(i);  
                        GananciasG_2Ej(i,6) = PorGanaG_2Ej_Hor(i);
                    end

        axes(handles.C_Gana2Ejes);
        bar(GananciasG_2Ej);
        colormap summer;

            %Propiedades
            set(handles.C_Gana2Ejes,'Xlim',[0 13]);
            title('Ganancias de radiación global para un seguimiento a dos ejes','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','Seg.hor','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %2Ejes_0
            set(handles.CGana2Ej_0_min,'String', roundn(min(PorGanaG_2Ej_0),-2));
            set(handles.CGana2Ej_0_med,'String', roundn(mean(PorGanaG_2Ej_0),-2)); 
            set(handles.CGana2Ej_0_max,'String', roundn(max(PorGanaG_2Ej_0),-2));
            %2Ejes_Anu
            set(handles.CGana2Ej_Anu_min,'String', roundn(min(PorGanaG_2Ej_Anu),-2));
            set(handles.CGana2Ej_Anu_med,'String', roundn(mean(PorGanaG_2Ej_Anu),-2)); 
            set(handles.CGana2Ej_Anu_max,'String', roundn(max(PorGanaG_2Ej_Anu),-2));
            %2Ejes_Est
            set(handles.CGana2Ej_Est_min,'String', roundn(min(PorGanaG_2Ej_Est),-2));
            set(handles.CGana2Ej_Est_med,'String', roundn(mean(PorGanaG_2Ej_Est),-2)); 
            set(handles.CGana2Ej_Est_max,'String', roundn(max(PorGanaG_2Ej_Est),-2));
            %2Ejes_Pol
            set(handles.CGana2Ej_Pol_min,'String', roundn(min(PorGanaG_2Ej_Pol),-2));
            set(handles.CGana2Ej_Pol_med,'String', roundn(mean(PorGanaG_2Ej_Pol),-2)); 
            set(handles.CGana2Ej_Pol_max,'String', roundn(max(PorGanaG_2Ej_Pol),-2));
            %2Ejes_Azi
            set(handles.CGana2Ej_Azi_min,'String', roundn(min(PorGanaG_2Ej_Azi),-2));
            set(handles.CGana2Ej_Azi_med,'String', roundn(mean(PorGanaG_2Ej_Azi),-2)); 
            set(handles.CGana2Ej_Azi_max,'String', roundn(max(PorGanaG_2Ej_Azi),-2));
            %2Ejes_Hor
            set(handles.CGana2Ej_Hor_min,'String', roundn(min(PorGanaG_2Ej_Hor),-2));
            set(handles.CGana2Ej_Hor_med,'String', roundn(mean(PorGanaG_2Ej_Hor),-2)); 
            set(handles.CGana2Ej_Hor_max,'String', roundn(max(PorGanaG_2Ej_Hor),-2));
            
            
    case 2 %Directa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');  
        
        set(handles.Rejilla2,'Visible','on');

       
        %Graficar RADIACIÓN-------------------------------------------------
        axes(handles.C_2Ejes);

        plot(Bd2Ejes,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[1 .6 .6],'LineWidth',2.5);
        hold off;

            %Propiedades
                   set(handles.C_2Ejes,'Xlim',[1 12]);
                   title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('Seg.2ej', '0º','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Bdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Bdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Bdm0),-2));
            %Seguimiento 2 ejes
            set(handles.C2Ejes_min,'String', roundn(min(Bd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Bd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Bd2Ejes),-2));
       
            
        %Gráfica de las GANANCIAS--------------------------------------------------
        GananciasB_2Ej = zeros(12,6);
                    for i=1:12
                        GananciasB_2Ej(i,1) = PorGanaB_2Ej_0(i);
                        GananciasB_2Ej(i,2) = PorGanaB_2Ej_Anu(i);
                        GananciasB_2Ej(i,3) = PorGanaB_2Ej_Est(i);
                        GananciasB_2Ej(i,4) = PorGanaB_2Ej_Pol(i);
                        GananciasB_2Ej(i,5) = PorGanaB_2Ej_Azi(i); 
                        GananciasB_2Ej(i,6) = PorGanaB_2Ej_Hor(i); 
                    end

        axes(handles.C_Gana2Ejes);
        bar(GananciasB_2Ej);
        colormap summer;

            %Propiedades
            set(handles.C_Gana2Ejes,'Xlim',[0 13]);
            title('Ganancias de radiación directa para un seguimiento a dos ejes','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','Seg.hor','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %2Ejes_0
            set(handles.CGana2Ej_0_min,'String', roundn(min(PorGanaB_2Ej_0),-2));
            set(handles.CGana2Ej_0_med,'String', roundn(mean(PorGanaB_2Ej_0),-2)); 
            set(handles.CGana2Ej_0_max,'String', roundn(max(PorGanaB_2Ej_0),-2));
            %2Ejes_Anu
            set(handles.CGana2Ej_Anu_min,'String', roundn(min(PorGanaB_2Ej_Anu),-2));
            set(handles.CGana2Ej_Anu_med,'String', roundn(mean(PorGanaB_2Ej_Anu),-2)); 
            set(handles.CGana2Ej_Anu_max,'String', roundn(max(PorGanaB_2Ej_Anu),-2));
            %2Ejes_Est
            set(handles.CGana2Ej_Est_min,'String', roundn(min(PorGanaB_2Ej_Est),-2));
            set(handles.CGana2Ej_Est_med,'String', roundn(mean(PorGanaB_2Ej_Est),-2)); 
            set(handles.CGana2Ej_Est_max,'String', roundn(max(PorGanaB_2Ej_Est),-2));
            %2Ejes_Pol
            set(handles.CGana2Ej_Pol_min,'String', roundn(min(PorGanaB_2Ej_Pol),-2));
            set(handles.CGana2Ej_Pol_med,'String', roundn(mean(PorGanaB_2Ej_Pol),-2)); 
            set(handles.CGana2Ej_Pol_max,'String', roundn(max(PorGanaG_2Ej_Pol),-2));
           %2Ejes_Azi
            set(handles.CGana2Ej_Azi_min,'String', roundn(min(PorGanaB_2Ej_Azi),-2));
            set(handles.CGana2Ej_Azi_med,'String', roundn(mean(PorGanaB_2Ej_Azi),-2)); 
            set(handles.CGana2Ej_Azi_max,'String', roundn(max(PorGanaB_2Ej_Azi),-2));
            %2Ejes_Hor
            set(handles.CGana2Ej_Hor_min,'String', roundn(min(PorGanaB_2Ej_Hor),-2));
            set(handles.CGana2Ej_Hor_med,'String', roundn(mean(PorGanaB_2Ej_Hor),-2)); 
            set(handles.CGana2Ej_Hor_max,'String', roundn(max(PorGanaB_2Ej_Hor),-2));
        
    case 3 %Difusa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
        
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');
        
        set(handles.Rejilla2,'Visible','on');

       
        %Graficar RADIACIÓN------------------------------------------------          
        axes(handles.C_2Ejes); 
        
        plot(Dd2Ejes,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold off;
        
        %Propiedades
           set(handles.C_2Ejes,'Xlim',[1 12]);
           title('Radiación difusa(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.2ej', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Ddm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Ddm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Ddm0),-2));
            %Seguimiento 2 ejes
            set(handles.C2Ejes_min,'String', roundn(min(Dd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Dd2Ejes),-2));     
            set(handles.C2Ejes_max,'String', roundn(max(Dd2Ejes),-2));

        %Gráfica de las GANANCIAS------------------------------------------
        GananciasD_2Ej = zeros(12,6);
                    for i=1:12
                        GananciasD_2Ej(i,1) = PorGanaD_2Ej_0(i);
                        GananciasD_2Ej(i,2) = PorGanaD_2Ej_Anu(i);
                        GananciasD_2Ej(i,3) = PorGanaD_2Ej_Est(i);
                        GananciasD_2Ej(i,4) = PorGanaD_2Ej_Pol(i);
                        GananciasD_2Ej(i,5) = PorGanaD_2Ej_Azi(i); 
                        GananciasD_2Ej(i,6) = PorGanaD_2Ej_Hor(i); 
                        
                    end

        axes(handles.C_Gana2Ejes);
        bar(GananciasD_2Ej);
        colormap summer;

            %Propiedades
            set(handles.C_Gana2Ejes,'Xlim',[0 13]);
            title('Ganancias de radiación difusa para un seguimiento a dos ejes','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','Seg.hor','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %2Ejes_0
            set(handles.CGana2Ej_0_min,'String', roundn(min(PorGanaD_2Ej_0),-2));
            set(handles.CGana2Ej_0_med,'String', roundn(mean(PorGanaD_2Ej_0),-2)); 
            set(handles.CGana2Ej_0_max,'String', roundn(max(PorGanaD_2Ej_0),-2));
            %2Ejes_Anu
            set(handles.CGana2Ej_Anu_min,'String', roundn(min(PorGanaD_2Ej_Anu),-2));
            set(handles.CGana2Ej_Anu_med,'String', roundn(mean(PorGanaD_2Ej_Anu),-2)); 
            set(handles.CGana2Ej_Anu_max,'String', roundn(max(PorGanaD_2Ej_Anu),-2));
            %2Ejes_Est
            set(handles.CGana2Ej_Est_min,'String', roundn(min(PorGanaD_2Ej_Est),-2));
            set(handles.CGana2Ej_Est_med,'String', roundn(mean(PorGanaD_2Ej_Est),-2)); 
            set(handles.CGana2Ej_Est_max,'String', roundn(max(PorGanaD_2Ej_Est),-2));
            %2Ejes_Pol
            set(handles.CGana2Ej_Pol_min,'String', roundn(min(PorGanaD_2Ej_Pol),-2));
            set(handles.CGana2Ej_Pol_med,'String', roundn(mean(PorGanaD_2Ej_Pol),-2)); 
            set(handles.CGana2Ej_Pol_max,'String', roundn(max(PorGanaD_2Ej_Pol),-2));
            %2Ejes_Azi
            set(handles.CGana2Ej_Azi_min,'String', roundn(min(PorGanaD_2Ej_Azi),-2));
            set(handles.CGana2Ej_Azi_med,'String', roundn(mean(PorGanaD_2Ej_Azi),-2)); 
            set(handles.CGana2Ej_Azi_max,'String', roundn(max(PorGanaD_2Ej_Azi),-2));
            %2Ejes_Hor
            set(handles.CGana2Ej_Hor_min,'String', roundn(min(PorGanaD_2Ej_Hor),-2));
            set(handles.CGana2Ej_Hor_med,'String', roundn(mean(PorGanaD_2Ej_Hor),-2)); 
            set(handles.CGana2Ej_Hor_max,'String', roundn(max(PorGanaD_2Ej_Hor),-2));
        
    case 4 %Albedo
        
        %warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
        
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
        
        set(handles.Adver1,'Visible','off');
        set(handles.Adver2,'Visible','off');
        
        set(handles.Rejilla2,'Visible','on'); 

       
        %Graficar RADIACIÓN------------------------------------------------     
        axes(handles.C_2Ejes);
        
        plot(Rd2Ejes,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_2Ejes,'Xlim',[1 12]);
           title('Radiación de albedo(kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Seg.2ej', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Rdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Rdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Rdm0),-2));
            %Seguimiento 2 ejes
            set(handles.C2Ejes_min,'String', roundn(min(Rd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Rd2Ejes),-2));            
            set(handles.C2Ejes_max,'String', roundn(max(Rd2Ejes),-2));
        
        %Gráfica de las GANANCIAS------------------------------------------
        GananciasR_2Ej = zeros(12,6);
                    for i=1:12
                        GananciasR_2Ej(i,1) = PorGanaR_2Ej_0(i);
                        GananciasR_2Ej(i,2) = PorGanaR_2Ej_Anu(i);
                        GananciasR_2Ej(i,3) = PorGanaR_2Ej_Est(i);
                        GananciasR_2Ej(i,4) = PorGanaR_2Ej_Pol(i);
                        GananciasR_2Ej(i,5) = PorGanaR_2Ej_Azi(i); 
                        GananciasR_2Ej(i,6) = PorGanaR_2Ej_Hor(i);
                    end

        axes(handles.C_Gana2Ejes);
        bar(GananciasR_2Ej);
        colormap summer;

            %Propiedades
            set(handles.C_Gana2Ejes,'Xlim',[0 13]);
            title('Ganancias de radiación de albedo para un seguimiento a dos ejes','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','Ópt.anu','Ópt.est','Seg.pol','Seg.azi','Seg.hor','location','BestOutside');

            grid off;
            set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %2Ejes_0
            set(handles.CGana2Ej_0_min,'String', '-');
            set(handles.CGana2Ej_0_med,'String', '-');
            set(handles.CGana2Ej_0_max,'String', '-');
            %2Ejes_Anu
            if angulo_optimo==0 %Por tanto Rdm(0º) = 0 -- Ganancias Inf -
                set(handles.CGana2Ej_Anu_min,'String', '-');
                set(handles.CGana2Ej_Anu_med,'String', '-');
                set(handles.CGana2Ej_Anu_max,'String', '-');
                
            else
                set(handles.CGana2Ej_Anu_min,'String', roundn(min(PorGanaR_2Ej_Anu),-2));
                set(handles.CGana2Ej_Anu_med,'String', roundn(mean(PorGanaR_2Ej_Anu),-2)); 
                set(handles.CGana2Ej_Anu_max,'String', roundn(max(PorGanaR_2Ej_Anu),-2));
            end
            %2Ejes_Est
            if min(PorGanaR_2Ej_Est) == Inf
                set(handles.CGana2Ej_Est_min,'String','-');
            else
                set(handles.CGana2Ej_Est_min,'String', roundn(min(PorGanaR_2Ej_Est),-2));
            end
            
            if mean(PorGanaR_2Ej_Est) == Inf
                set(handles.CGana2Ej_Est_med,'String','-'); 
            else
                set(handles.CGana2Ej_Est_med,'String', roundn(mean(PorGanaR_2Ej_Est),-2)); 
            end
            
            if max(PorGanaR_2Ej_Est) == Inf
                set(handles.CGana2Ej_Est_max,'String','-');
            else
                set(handles.CGana2Ej_Est_max,'String', roundn(max(PorGanaR_2Ej_Est),-2));
            end
             
            %2Ejes_Pol
            set(handles.CGana2Ej_Pol_min,'String', roundn(min(PorGanaR_2Ej_Pol),-2));
            set(handles.CGana2Ej_Pol_med,'String', roundn(mean(PorGanaR_2Ej_Pol),-2)); 
            set(handles.CGana2Ej_Pol_max,'String', roundn(max(PorGanaR_2Ej_Pol),-2));
            %2Ejes_Azi
            set(handles.CGana2Ej_Azi_min,'String', roundn(min(PorGanaR_2Ej_Azi),-2));
            set(handles.CGana2Ej_Azi_med,'String', roundn(mean(PorGanaR_2Ej_Azi),-2)); 
            set(handles.CGana2Ej_Azi_max,'String', roundn(max(PorGanaR_2Ej_Azi),-2));   
            %2Ejes_Hor
            set(handles.CGana2Ej_Hor_min,'String', roundn(min(PorGanaR_2Ej_Hor),-2));
            set(handles.CGana2Ej_Hor_med,'String', roundn(mean(PorGanaR_2Ej_Hor),-2)); 
            set(handles.CGana2Ej_Hor_max,'String', roundn(max(PorGanaR_2Ej_Hor),-2));  
        
    case 5 %Todos  
        %Hacer invisible el panel de los valores
        set(handles.Valores_Rad,'Visible','off');
        set(handles.Valores_Gan,'Visible','off'); 
        
        set(handles.Adver1,'Visible','on');
        set(handles.Adver2,'Visible','on');
       
        %Graficar RADIACIÓN------------------------------------------------    
        axes(handles.C_2Ejes); 
        plot(Gd2Ejes,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold on;
        plot(Bd2Ejes,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold on;
        plot(Dd2Ejes,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold on;
        plot(Rd2Ejes,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_2Ejes,'Xlim',[1 12]);
           title('Todas las componentes de la radiación','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Gdm(2ej)','Gdm(0º)','Bdm(2ej)','Bdm(0º)','Ddm(2ej)','Ddm(0º)','Rdm(2ej)','Rdm(0º)','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);

           
        %Gráfica de las GANANCIAS------------------------------------------ 
        axes(handles.C_Gana2Ejes);
        %Vacío.
        bar(0);
        colormap summer;

            %Propiedades
            
            title('','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           
            grid off;
            set(handles.Rejilla2,'Visible','off'); 
            set(handles.C_Gana2Ejes,'Visible','off');
        
        
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

Tabla_2Ejes;

close ('OrientSol 3.0 - Gráficas para seguimiento a dos ejes');


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.C_2Ejes,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_2Ejes,'xgrid','off','ygrid','off');
        
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
        
        set(handles.C_Gana2Ejes,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_Gana2Ejes,'xgrid','off','ygrid','off');
        
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
