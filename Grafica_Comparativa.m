function varargout = Grafica_Comparativa(varargin)
% GRAFICA_COMPARATIVA MATLAB code for Grafica_Comparativa.fig
%      GRAFICA_COMPARATIVA, by itself, creates a new GRAFICA_COMPARATIVA or raises the existing
%      singleton*.
%
%      H = GRAFICA_COMPARATIVA returns the handle to a new GRAFICA_COMPARATIVA or the handle to
%      the existing singleton*.
%
%      GRAFICA_COMPARATIVA('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_COMPARATIVA.M with the given input arguments.
%
%      GRAFICA_COMPARATIVA('Property','Value',...) creates a new GRAFICA_COMPARATIVA or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_Comparativa_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_Comparativa_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_Comparativa

% Last Modified by GUIDE v2.5 24-Jan-2015 11:55:11

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_Comparativa_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_Comparativa_OutputFcn, ...
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


% --- Executes just before Grafica_Comparativa is made visible.
function Grafica_Comparativa_OpeningFcn(hObject, eventdata, handles, varargin)

global NOMBRE_CIUDAD DATOS;
%Inclinación óptima anual
global Radiacion_optima;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes;

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
    
%Creamos las matrices para los gráficos de barras
%Global 
BarrasG = zeros (12,7);

for i=1:12
    
    BarrasG (i,1) = datos(i);
    BarrasG (i,2) = Radiacion_optima(i);
    BarrasG (i,3) = RadiacionG_optima_Est(i);
    BarrasG (i,4) = GdEjePolar(i);
    BarrasG (i,5) = GdEjeAzimutal(i);
    BarrasG (i,6) = GdEjeHorizontal(i);
    BarrasG (i,7) = Gd2Ejes(i);
    
end
   
%Hacer visible el panel de los valores
set(handles.Valores_Radiaciones,'Visible','on'); 


set(handles.Lineas,'Value',1);
set(handles.Barras,'Value',0);
        %Gráfica de la RADIACIÓN--------------------------------------------------- 
        axes(handles.C_Todos);

        plot(datos,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(Radiacion_optima,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(RadiacionG_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
        hold on;
        plot(GdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
        hold on;
        plot(GdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(GdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Gd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold off;

             %Propiedades
                   set(handles.C_Todos,'Xlim',[1 12]);
                   title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

    %Valores mínimos, máximos y medios
    %Plano horizontal
    set(handles.C0_min,'String', roundn(min(datos),-2));
    set(handles.C0_med,'String', roundn(mean(datos),-2));
    set(handles.C0_max,'String', roundn(max(datos),-2));
    %Inclinación óptima anual
    set(handles.CAnu_min,'String', roundn(min(Radiacion_optima),-2));
    set(handles.CAnu_med,'String', roundn(mean(Radiacion_optima),-2)); 
    set(handles.CAnu_max,'String', roundn(max(Radiacion_optima),-2));
    %Inclinación óptima estacional
    set(handles.CEst_min,'String', roundn(min(RadiacionG_optima_Est),-2));
    set(handles.CEst_med,'String', roundn(mean(RadiacionG_optima_Est),-2)); 
    set(handles.CEst_max,'String', roundn(max(RadiacionG_optima_Est),-2));
    %Seguiiento a un eje polar
    set(handles.CPol_min,'String', roundn(min(GdEjePolar),-2));
    set(handles.CPol_med,'String', roundn(mean(GdEjePolar),-2)); 
    set(handles.CPol_max,'String', roundn(max(GdEjePolar),-2));
    %Seguiiento a un eje azimutal
    set(handles.CAzi_min,'String', roundn(min(GdEjeAzimutal),-2));
    set(handles.CAzi_med,'String', roundn(mean(GdEjeAzimutal),-2)); 
    set(handles.CAzi_max,'String', roundn(max(GdEjeAzimutal),-2));
    %Seguiiento a un eje horizontal
    set(handles.CHor_min,'String', roundn(min(GdEjeHorizontal),-2));
    set(handles.CHor_med,'String', roundn(mean(GdEjeHorizontal),-2)); 
    set(handles.CHor_max,'String', roundn(max(GdEjeHorizontal),-2));
    %Seguiiento a dos ejes
    set(handles.C2Ejes_min,'String', roundn(min(Gd2Ejes),-2));
    set(handles.C2Ejes_med,'String', roundn(mean(Gd2Ejes),-2)); 
    set(handles.C2Ejes_max,'String', roundn(max(Gd2Ejes),-2));
    
    
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_Comparativa (see VARARGIN)

% Choose default command line output for Grafica_Comparativa
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_Comparativa wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_Comparativa_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global DATOS Val_Bdm0 Val_Ddm0;
%Inclinación óptima anual
global Radiacion_optima;
global Radiacion_Bd_Optima;
global Radiacion_Dd_Optima;
global Radiacion_Rd_Optima;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
global BdOpt_Inv BdOpt_Pri BdOpt_Ver BdOpt_Oto;
global DdOpt_Inv DdOpt_Pri DdOpt_Ver DdOpt_Oto;
global RdOpt_Inv RdOpt_Pri RdOpt_Ver RdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar;
global BdEjePolar;
global DdEjePolar;
global RdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal;
global BdEjeAzimutal;
global DdEjeAzimutal;
global RdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal;
global BdEjeHorizontal;
global DdEjeHorizontal;
global RdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes;
global Bd2Ejes;
global Dd2Ejes;
global Rd2Ejes;


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



%Creamos las matrices para los gráficos de barras
%Global 
BarrasG = zeros (12,7);

for i=1:12
    
    BarrasG (i,1) = datos(i);
    BarrasG (i,2) = Radiacion_optima(i);
    BarrasG (i,3) = RadiacionG_optima_Est(i);
    BarrasG (i,4) = GdEjePolar(i);
    BarrasG (i,5) = GdEjeAzimutal(i);
    BarrasG (i,6) = GdEjeHorizontal(i);
    BarrasG (i,7) = Gd2Ejes(i);
    
end
%Directa
BarrasB = zeros (12,7);

for i=1:12
    
    BarrasB (i,1) = Val_Bdm0(i);
    BarrasB (i,2) = Radiacion_Bd_Optima(i);
    BarrasB (i,3) = RadiacionB_optima_Est(i);
    BarrasB (i,4) = BdEjePolar(i);
    BarrasB (i,5) = BdEjeAzimutal(i);
    BarrasB (i,6) = BdEjeHorizontal(i);
    BarrasB (i,7) = Bd2Ejes(i);
    
end
%Difusa
BarrasD = zeros (12,7);

for i=1:12
    
    BarrasD (i,1) = Val_Ddm0(i);
    BarrasD (i,2) = Radiacion_Dd_Optima(i);
    BarrasD (i,3) = RadiacionD_optima_Est(i);
    BarrasD (i,4) = DdEjePolar(i);
    BarrasD (i,5) = DdEjeAzimutal(i);
    BarrasD (i,6) = DdEjeHorizontal(i);
    BarrasD (i,7) = Dd2Ejes(i);
    
end
%Albedo
BarrasR = zeros (12,7);

for i=1:12
    
    BarrasR (i,1) = Val_Rdm0(i);
    BarrasR (i,2) = Radiacion_Rd_Optima(i);
    BarrasR (i,3) = RadiacionR_optima_Est(i);
    BarrasR (i,4) = RdEjePolar(i);
    BarrasR (i,5) = RdEjeAzimutal(i);
    BarrasR (i,6) = RdEjeHorizontal(i);
    BarrasR (i,7) = Rd2Ejes(i);
    
end

Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
       %Hacer visible el panel de los valores 
       set(handles.Valores_Radiaciones,'Visible','on'); 

       
        %Graficar RADIACIÓN------------------------------------------------
        Lineas = get(handles.Lineas,'Value');
        Barras = get(handles.Barras,'Value');
        
        
            if Lineas ==1 
                    axes(handles.C_Todos);

                    plot(datos,'Color',[.5 .8 .9],'LineWidth',2.5);
                    hold on;
                    plot(Radiacion_optima,'Color',[.7 .8 .1],'LineWidth',2.5);
                    hold on;
                    plot(RadiacionG_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
                    hold on;
                    plot(GdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
                    hold on;
                    plot(GdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
                    hold on;
                    plot(GdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
                    hold on;
                    plot(Gd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
                    hold off;

                         %Propiedades
                               set(handles.C_Todos,'Xlim',[1 12]);
                               title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid on;
                               set(handles.Rejilla,'Value',1); 
                               
            else if Barras ==1
                    
                    
                  axes(handles.C_Todos);
                  
                  bar(BarrasG);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);   
                  
                     
                end
            end

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(datos),-2));
            set(handles.C0_med,'String', roundn(mean(datos),-2));
            set(handles.C0_max,'String', roundn(max(datos),-2));
            %Inclinación óptima anual
            set(handles.CAnu_min,'String', roundn(min(Radiacion_optima),-2));
            set(handles.CAnu_med,'String', roundn(mean(Radiacion_optima),-2)); 
            set(handles.CAnu_max,'String', roundn(max(Radiacion_optima),-2));
            %Inclinación óptima estacional
            set(handles.CEst_min,'String', roundn(min(RadiacionG_optima_Est),-2));
            set(handles.CEst_med,'String', roundn(mean(RadiacionG_optima_Est),-2)); 
            set(handles.CEst_max,'String', roundn(max(RadiacionG_optima_Est),-2));
            %Seguiiento a un eje polar
            set(handles.CPol_min,'String', roundn(min(GdEjePolar),-2));
            set(handles.CPol_med,'String', roundn(mean(GdEjePolar),-2)); 
            set(handles.CPol_max,'String', roundn(max(GdEjePolar),-2));
            %Seguiiento a un eje azimutal
            set(handles.CAzi_min,'String', roundn(min(GdEjeAzimutal),-2));
            set(handles.CAzi_med,'String', roundn(mean(GdEjeAzimutal),-2)); 
            set(handles.CAzi_max,'String', roundn(max(GdEjeAzimutal),-2));
            %Seguiiento a un eje horizontal
            set(handles.CHor_min,'String', roundn(min(GdEjeHorizontal),-2));
            set(handles.CHor_med,'String', roundn(mean(GdEjeHorizontal),-2)); 
            set(handles.CHor_max,'String', roundn(max(GdEjeHorizontal),-2));
            %Seguiiento a dos ejes
            set(handles.C2Ejes_min,'String', roundn(min(Gd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Gd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Gd2Ejes),-2));


    case 2 %Directa
       %Hacer visible el panel de los valores    
       set(handles.Valores_Radiaciones,'Visible','on'); 

       
        %Graficar RADIACIÓN-------------------------------------------------
        Lineas = get(handles.Lineas,'Value');
        Barras = get(handles.Barras,'Value');
        
        
            if Lineas ==1 
        
                axes(handles.C_Todos);

                plot(Val_Bdm0,'Color',[.5 .8 .9],'LineWidth',2.5);
                hold on;
                plot(Radiacion_Bd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
                hold on;
                plot(RadiacionB_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
                hold on;
                plot(BdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
                hold on;
                plot(BdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
                hold on;
                plot(BdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
                hold on;
                plot(Bd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
                hold off;

                    %Propiedades
                           set(handles.C_Todos,'Xlim',[1 12]);
                           title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                           legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                           grid on;
                           set(handles.Rejilla,'Value',1); 

                           
                           
                else if Barras ==1
                    
                  axes(handles.C_Todos);
                  
                  bar(BarrasB);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);   
                                       
                    end
            end           
                           
                           
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Bdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Bdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Bdm0),-2));
            %Inclinación óptima anual
            set(handles.CAnu_min,'String', roundn(min(Radiacion_Bd_Optima),-2));
            set(handles.CAnu_med,'String', roundn(mean(Radiacion_Bd_Optima),-2)); 
            set(handles.CAnu_max,'String', roundn(max(Radiacion_Bd_Optima),-2));
            %Inclinación óptima estacional
            set(handles.CEst_min,'String', roundn(min(RadiacionB_optima_Est),-2));
            set(handles.CEst_med,'String', roundn(mean(RadiacionB_optima_Est),-2)); 
            set(handles.CEst_max,'String', roundn(max(RadiacionB_optima_Est),-2));
            %Seguiiento a un eje polar
            set(handles.CPol_min,'String', roundn(min(BdEjePolar),-2));
            set(handles.CPol_med,'String', roundn(mean(BdEjePolar),-2)); 
            set(handles.CPol_max,'String', roundn(max(BdEjePolar),-2));
            %Seguiiento a un eje azimutal
            set(handles.CAzi_min,'String', roundn(min(BdEjeAzimutal),-2));
            set(handles.CAzi_med,'String', roundn(mean(BdEjeAzimutal),-2)); 
            set(handles.CAzi_max,'String', roundn(max(BdEjeAzimutal),-2));
            %Seguiiento a un eje horizontal
            set(handles.CHor_min,'String', roundn(min(BdEjeHorizontal),-2));
            set(handles.CHor_med,'String', roundn(mean(BdEjeHorizontal),-2)); 
            set(handles.CHor_max,'String', roundn(max(BdEjeHorizontal),-2));
            %Seguiiento a dos ejes
            set(handles.C2Ejes_min,'String', roundn(min(Bd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Bd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Bd2Ejes),-2));
       

        
    case 3 %Difusa
       %Hacer visible el panel de los valores 
       set(handles.Valores_Radiaciones,'Visible','on'); 

       
        %Graficar RADIACIÓN------------------------------------------------          
         Lineas = get(handles.Lineas,'Value');
         Barras = get(handles.Barras,'Value');
        
        
            if Lineas == 1 
        
                axes(handles.C_Todos); 

                plot(Val_Ddm0,'Color',[.5 .8 .9],'LineWidth',2.5);
                hold on;
                plot(Radiacion_Dd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
                hold on;
                plot(RadiacionD_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
                hold on;
                plot(DdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
                hold on;
                plot(DdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
                hold on;
                plot(DdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
                hold on;
                plot(Dd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
                hold off;

                %Propiedades
                   set(handles.C_Todos,'Xlim',[1 12]);
                   title('Radiación difusa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 
        
               else if Barras == 1
                    
                  axes(handles.C_Todos);
                  
                  bar(BarrasD);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación difusa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);   
                                       
                    end
            end       
                   
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Ddm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Ddm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Ddm0),-2));
            %Inclinación óptima anual
            set(handles.CAnu_min,'String', roundn(min(Radiacion_Dd_Optima),-2));
            set(handles.CAnu_med,'String', roundn(mean(Radiacion_Dd_Optima),-2)); 
            set(handles.CAnu_max,'String', roundn(max(Radiacion_Dd_Optima),-2));
            %Inclinación óptima estacional
            set(handles.CEst_min,'String', roundn(min(RadiacionD_optima_Est),-2));
            set(handles.CEst_med,'String', roundn(mean(RadiacionD_optima_Est),-2)); 
            set(handles.CEst_max,'String', roundn(max(RadiacionD_optima_Est),-2));
            %Seguiiento a un eje polar
            set(handles.CPol_min,'String', roundn(min(DdEjePolar),-2));
            set(handles.CPol_med,'String', roundn(mean(DdEjePolar),-2)); 
            set(handles.CPol_max,'String', roundn(max(DdEjePolar),-2));
            %Seguiiento a un eje azimutal
            set(handles.CAzi_min,'String', roundn(min(DdEjeAzimutal),-2));
            set(handles.CAzi_med,'String', roundn(mean(DdEjeAzimutal),-2)); 
            set(handles.CAzi_max,'String', roundn(max(DdEjeAzimutal),-2));
            %Seguiiento a un eje horizontal
            set(handles.CHor_min,'String', roundn(min(DdEjeHorizontal),-2));
            set(handles.CHor_med,'String', roundn(mean(DdEjeHorizontal),-2)); 
            set(handles.CHor_max,'String', roundn(max(DdEjeHorizontal),-2));
            %Seguiiento a dos ejes
            set(handles.C2Ejes_min,'String', roundn(min(Dd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Dd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Dd2Ejes),-2));

        
    case 4 %Albedo
       %Hacer visible el panel de los valores    
       set(handles.Valores_Radiaciones,'Visible','on'); 

        %Graficar RADIACIÓN------------------------------------------------     
        Lineas = get(handles.Lineas,'Value');
        Barras = get(handles.Barras,'Value');
        
        
            if Lineas ==1 
                axes(handles.C_Todos);

                plot(Val_Rdm0,'Color',[.5 .8 .9],'LineWidth',2.5);
                hold on;
                plot(Radiacion_Rd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
                hold on;
                plot(RadiacionR_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
                hold on;
                plot(RdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
                hold on;
                plot(RdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
                hold on;
                plot(RdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
                hold on;
                plot(Rd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
                hold off;

                %Propiedades
                   set(handles.C_Todos,'Xlim',[1 12]);
                   title('Radiación de albedo (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                   xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                   legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                   grid on;
                   set(handles.Rejilla,'Value',1); 

               else if Barras == 1
                    
                  axes(handles.C_Todos);
                  
                  bar(BarrasR);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación de albedo (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);   
                                       
                    end
            end            
                   
                   
                   
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Rdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Rdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Rdm0),-2));
            %Inclinación óptima anual
            set(handles.CAnu_min,'String', roundn(min(Radiacion_Rd_Optima),-2));
            set(handles.CAnu_med,'String', roundn(mean(Radiacion_Rd_Optima),-2)); 
            set(handles.CAnu_max,'String', roundn(max(Radiacion_Rd_Optima),-2));
            %Inclinación óptima estacional
            set(handles.CEst_min,'String', roundn(min(RadiacionR_optima_Est),-2));
            set(handles.CEst_med,'String', roundn(mean(RadiacionR_optima_Est),-2)); 
            set(handles.CEst_max,'String', roundn(max(RadiacionR_optima_Est),-2));
            %Seguiiento a un eje polar
            set(handles.CPol_min,'String', roundn(min(RdEjePolar),-2));
            set(handles.CPol_med,'String', roundn(mean(RdEjePolar),-2)); 
            set(handles.CPol_max,'String', roundn(max(RdEjePolar),-2));
            %Seguiiento a un eje azimutal
            set(handles.CAzi_min,'String', roundn(min(RdEjeAzimutal),-2));
            set(handles.CAzi_med,'String', roundn(mean(RdEjeAzimutal),-2)); 
            set(handles.CAzi_max,'String', roundn(max(RdEjeAzimutal),-2));
            %Seguiiento a un eje horizontal
            set(handles.CHor_min,'String', roundn(min(RdEjeHorizontal),-2));
            set(handles.CHor_med,'String', roundn(mean(RdEjeHorizontal),-2)); 
            set(handles.CHor_max,'String', roundn(max(RdEjeHorizontal),-2));
            %Seguiiento a dos ejes
            set(handles.C2Ejes_min,'String', roundn(min(Rd2Ejes),-2));
            set(handles.C2Ejes_med,'String', roundn(mean(Rd2Ejes),-2)); 
            set(handles.C2Ejes_max,'String', roundn(max(Rd2Ejes),-2));
        
       
        
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

Tabla_Comparativa;

close ('OrientSol 3.0 - Gráficas para comparativa de todos los tipos de estudios');


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.C_Todos,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_Todos,'xgrid','off','ygrid','off');
        
end

% hObject    handle to Rejilla (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Rejilla
guidata(hObject, handles);

% --------------------------------------------------------------------
function Guardar_ClickedCallback(hObject, eventdata, handles)

[nombre,ruta] = uiputfile({'*.bmp;','BMP (*.bmp)'},'Guardar Gráfica');

if nombre==0
     return
end

saveas(gcf,[ruta nombre]);

msgbox('Imagen guardada en el directorio deseado');

% --- Executes when selected object is changed in tipo_grafi.
function tipo_grafi_SelectionChangeFcn(hObject, eventdata, handles)
global DATOS Val_Bdm0 Val_Ddm0;
%Inclinación óptima anual
global Radiacion_optima;
global Radiacion_Bd_Optima;
global Radiacion_Dd_Optima;
global Radiacion_Rd_Optima;
%Inclinación óptima estacional
global GdOpt_Inv GdOpt_Pri GdOpt_Ver GdOpt_Oto;
global BdOpt_Inv BdOpt_Pri BdOpt_Ver BdOpt_Oto;
global DdOpt_Inv DdOpt_Pri DdOpt_Ver DdOpt_Oto;
global RdOpt_Inv RdOpt_Pri RdOpt_Ver RdOpt_Oto;
%Seguimiento a un eje polar
global GdEjePolar;
global BdEjePolar;
global DdEjePolar;
global RdEjePolar;
%Seguimiento a un eje azimutal
global GdEjeAzimutal;
global BdEjeAzimutal;
global DdEjeAzimutal;
global RdEjeAzimutal;
%Seguimiento a un eje horizontal
global GdEjeHorizontal;
global BdEjeHorizontal;
global DdEjeHorizontal;
global RdEjeHorizontal;
%Seguimiento a dos ejes
global Gd2Ejes;
global Bd2Ejes;
global Dd2Ejes;
global Rd2Ejes;


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



%Creamos las matrices para los gráficos de barras
%Global 
BarrasG = zeros (12,7);

for i=1:12
    
    BarrasG (i,1) = datos(i);
    BarrasG (i,2) = Radiacion_optima(i);
    BarrasG (i,3) = RadiacionG_optima_Est(i);
    BarrasG (i,4) = GdEjePolar(i);
    BarrasG (i,5) = GdEjeAzimutal(i);
    BarrasG (i,6) = GdEjeHorizontal(i);
    BarrasG (i,7) = Gd2Ejes(i);
    
end
%Directa
BarrasB = zeros (12,7);

for i=1:12
    
    BarrasB (i,1) = Val_Bdm0(i);
    BarrasB (i,2) = Radiacion_Bd_Optima(i);
    BarrasB (i,3) = RadiacionB_optima_Est(i);
    BarrasB (i,4) = BdEjePolar(i);
    BarrasB (i,5) = BdEjeAzimutal(i);
    BarrasB (i,6) = BdEjeHorizontal(i);
    BarrasB (i,7) = Bd2Ejes(i);
    
end
%Difusa
BarrasD = zeros (12,7);

for i=1:12
    
    BarrasD (i,1) = Val_Ddm0(i);
    BarrasD (i,2) = Radiacion_Dd_Optima(i);
    BarrasD (i,3) = RadiacionD_optima_Est(i);
    BarrasD (i,4) = DdEjePolar(i);
    BarrasD (i,5) = DdEjeAzimutal(i);
    BarrasD (i,6) = DdEjeHorizontal(i);
    BarrasD (i,7) = Dd2Ejes(i);
    
end
%Albedo
BarrasR = zeros (12,7);

for i=1:12
    
    BarrasR (i,1) = Val_Rdm0(i);
    BarrasR (i,2) = Radiacion_Rd_Optima(i);
    BarrasR (i,3) = RadiacionR_optima_Est(i);
    BarrasR (i,4) = RdEjePolar(i);
    BarrasR (i,5) = RdEjeAzimutal(i);
    BarrasR (i,6) = RdEjeHorizontal(i);
    BarrasR (i,7) = Rd2Ejes(i);
    
end


Componente = get(handles.Componente,'Value');

Lineas = get(handles.Lineas, 'Value');
Barras = get(handles.Barras, 'Value');

if Lineas ==1 
    
    switch Componente 
        
        case 1
           axes(handles.C_Todos);

           plot(datos,'Color',[.5 .8 .9],'LineWidth',2.5);
           hold on;
           plot(Radiacion_optima,'Color',[.7 .8 .1],'LineWidth',2.5);
           hold on;
           plot(RadiacionG_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
           hold on;
           plot(GdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
           hold on;
           plot(GdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
           hold on;
           plot(GdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
           hold on;
           plot(Gd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
           hold off;

                    %Propiedades
                     set(handles.C_Todos,'Xlim',[1 12]);
                     title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                     xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                     ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                     legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                     grid on;
                     set(handles.Rejilla,'Value',1);  
            
                       
        case 2
           axes(handles.C_Todos);

           plot(Val_Bdm0,'Color',[.5 .8 .9],'LineWidth',2.5);
           hold on;
           plot(Radiacion_Bd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
           hold on;
           plot(RadiacionB_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
           hold on;
           plot(BdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
           hold on;
           plot(BdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
           hold on;
           plot(BdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
           hold on;
           plot(Bd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
           hold off;

                    %Propiedades
                    set(handles.C_Todos,'Xlim',[1 12]);
                    title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                    xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                    ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                    legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');
                    
                    grid on;
                    set(handles.Rejilla,'Value',1);  
           
            
           
        case 3
           axes(handles.C_Todos); 

           plot(Val_Ddm0,'Color',[.5 .8 .9],'LineWidth',2.5);
           hold on;
           plot(Radiacion_Dd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
           hold on;
           plot(RadiacionD_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
           hold on;
           plot(DdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
           hold on;
           plot(DdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
           hold on;
           plot(DdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
           hold on;
           plot(Dd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
           hold off;

                %Propiedades
                set(handles.C_Todos,'Xlim',[1 12]);
                title('Radiación difusa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                grid on;
                set(handles.Rejilla,'Value',1);  
            
                        
        case 4
           axes(handles.C_Todos);

           plot(Val_Rdm0,'Color',[.5 .8 .9],'LineWidth',2.5);
           hold on;
           plot(Radiacion_Rd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
           hold on;
           plot(RadiacionR_optima_Est,'Color',[0 .7 .3],'LineWidth',2.5);
           hold on;
           plot(RdEjePolar,'Color',[1 .6 .6],'LineWidth',2.5);
           hold on;
           plot(RdEjeAzimutal,'Color',[1 .6 0],'LineWidth',2.5);
           hold on;
           plot(RdEjeHorizontal,'Color',[1 .2 .2],'LineWidth',2.5);
           hold on;
           plot(Rd2Ejes,'Color',[.1 .4 .5],'LineWidth',2.5);
           hold off;

             %Propiedades
             set(handles.C_Todos,'Xlim',[1 12]);
             title('Radiación de albedo (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
             xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
             ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
             legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

             grid on;
             set(handles.Rejilla,'Value',1); 
        
    end



else if Barras==1 
        
            switch Componente 
        
                case 1
                  axes(handles.C_Todos);
                  
                  bar(BarrasG);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);



                case 2
                  axes(handles.C_Todos);
                  
                  bar(BarrasB);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);  



                case 3
                  axes(handles.C_Todos);
                  
                  bar(BarrasD);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación difusa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0);  



                case 4
                  axes(handles.C_Todos);
                  
                  bar(BarrasR);
                  colormap JET;
                  
                         %Propiedades
                               set(handles.C_Todos,'Xlim',[0 13]);
                               title('Radiación de albedo (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',18,'Color',[0 0 0]);
                               xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
                               legend('0º','Ópt.anual','Ópt.estacional','Seg.polar','Seg.azimutal','Seg.horizontal','Seg.2ejes','location','BestOutside');

                               grid off;
                               set(handles.Rejilla,'Value',0); 
        
            end
            
    end
    
end
  
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
