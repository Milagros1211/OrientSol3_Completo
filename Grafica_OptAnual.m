function varargout = Grafica_OptAnual(varargin)
% GRAFICA_OPTANUAL MATLAB code for Grafica_OptAnual.fig
%      GRAFICA_OPTANUAL, by itself, creates a new GRAFICA_OPTANUAL or raises the existing
%      singleton*.
%
%      H = GRAFICA_OPTANUAL returns the handle to a new GRAFICA_OPTANUAL or the handle to
%      the existing singleton*.
%
%      GRAFICA_OPTANUAL('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_OPTANUAL.M with the given input arguments.
%
%      GRAFICA_OPTANUAL('Property','Value',...) creates a new GRAFICA_OPTANUAL or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_OptAnual_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_OptAnual_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_OptAnual

% Last Modified by GUIDE v2.5 24-Jan-2015 11:46:41

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_OptAnual_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_OptAnual_OutputFcn, ...
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


% --- Executes just before Grafica_OptAnual is made visible.
function Grafica_OptAnual_OpeningFcn(hObject, eventdata, handles, varargin)

global NOMBRE_CIUDAD DATOS;
global angulo_optimo;

global Radiacion_optima PorGanaG_Anu_0;


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

%Ángulo óptimo anual
set(handles.ang_opt,'String',angulo_optimo);

%Radiación sobre el plano horizontal en "datos"
datos = zeros(1,12);
    for i=3:14
        datos(i-2) = DATOS(i);
    end
  
%Hacer visible el panel de los valores    
set(handles.Valores_Rad,'Visible','on'); 
set(handles.Valores_Gan,'Visible','on'); 


%Gráfica de la RADIACIÓN--------------------------------------------------- 
axes(handles.C_OptAnu);
    
plot(Radiacion_optima,'Color',[.5 .8 .9],'LineWidth',2.5);
hold on;
plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
hold off;

     %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt. anu.', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
           
    %Valores mínimos, máximos y medios
    %Plano horizontal
    set(handles.C0_min,'String', roundn(min(datos),-2));
    set(handles.C0_med,'String', roundn(mean(datos),-2));
    set(handles.C0_max,'String', roundn(max(datos),-2));
    %Inclinación óptima anual
    set(handles.COptAnu_min,'String', roundn(min(Radiacion_optima),-2));
    set(handles.COptAnu_med,'String', roundn(mean(Radiacion_optima),-2)); 
    set(handles.COptAnu_max,'String', roundn(max(Radiacion_optima),-2));
          
%Gráfica de las GANANCIAS--------------------------------------------------
axes(handles.C_GanaOptAnu);
bar(PorGanaG_Anu_0);
colormap summer;
    
    %Propiedades
    set(handles.C_GanaOptAnu,'Xlim',[0 13]);
    title('Ganancias de radiación global para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
    xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
    legend('0º','location','BestOutside');
           
           grid off;
           set(handles.Rejilla2,'Value',0); 

    %Valores mínimos, máximos y medios
    %Óptima anual_0
    set(handles.CGanaOptAnu_min,'String', roundn(min(PorGanaG_Anu_0),-2));
    set(handles.CGanaOptAnu_med,'String', roundn(mean(PorGanaG_Anu_0),-2)); 
    set(handles.CGanaOptAnu_max,'String', roundn(max(PorGanaG_Anu_0),-2));

% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_OptAnual (see VARARGIN)

% Choose default command line output for Grafica_OptAnual
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_OptAnual wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_OptAnual_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global DATOS Radiacion_optima PorGanaG_Anu_0;
global Val_Bdm0 Radiacion_Bd_Optima PorGanaB_Anu_0;
global Val_Ddm0 Radiacion_Dd_Optima PorGanaD_Anu_0;
global Radiacion_Rd_Optima PorGanaR_Anu_0;

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
       
       %Graficar RADIACIÓN-------------------------------------------------
       axes(handles.C_OptAnu); 
       plot(Radiacion_optima,'Color',[.5 .8 .9],'LineWidth',2.5);
       hold on;
       plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
       hold off;
       %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Radiación global (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt. anu.', '0º','location','BestOutside');
     
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(datos),-2));
            set(handles.C0_med,'String', roundn(mean(datos),-2));
            set(handles.C0_max,'String', roundn(max(datos),-2));
            %Inclinación óptima anual
            set(handles.COptAnu_min,'String', roundn(min(Radiacion_optima),-2));
            set(handles.COptAnu_med,'String', roundn(mean(Radiacion_optima),-2));   
            set(handles.COptAnu_max,'String', roundn(max(Radiacion_optima),-2));
        
        
        %Gráfica de las GANANCIAS------------------------------------------
        axes(handles.C_GanaOptAnu);
        bar(PorGanaG_Anu_0);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptAnu,'Xlim',[0 13]);
            title('Ganancias de radiación global para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','location','BestOutside');

                   grid off;
                   set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima anual_0
            set(handles.CGanaOptAnu_min,'String', roundn(min(PorGanaG_Anu_0),-2));
            set(handles.CGanaOptAnu_med,'String', roundn(mean(PorGanaG_Anu_0),-2)); 
            set(handles.CGanaOptAnu_max,'String', roundn(max(PorGanaG_Anu_0),-2));
        
    case 2 %Directa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN-------------------------------------------------
        axes(handles.C_OptAnu); 
        plot(Radiacion_Bd_Optima,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Radiación directa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt. anu.', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
 
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Bdm0),-2)); 
            set(handles.C0_med,'String', roundn(mean(Val_Bdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Bdm0),-2));
            %Inclinación óptima anual
            set(handles.COptAnu_min,'String', roundn(min(Radiacion_Bd_Optima),-2));
            set(handles.COptAnu_med,'String', roundn(mean(Radiacion_Bd_Optima),-2));             
            set(handles.COptAnu_max,'String', roundn(max(Radiacion_Bd_Optima),-2)); 

        %Gráfica de las GANANCIAS------------------------------------------
        axes(handles.C_GanaOptAnu);
        bar(PorGanaB_Anu_0);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptAnu,'Xlim',[0 13]);
            title('Ganancias de radiación directa para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','location','BestOutside');

                   grid off;
                   set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima anual_0
            set(handles.CGanaOptAnu_min,'String', roundn(min(PorGanaB_Anu_0),-2));
            set(handles.CGanaOptAnu_med,'String', roundn(mean(PorGanaB_Anu_0),-2)); 
            set(handles.CGanaOptAnu_max,'String', roundn(max(PorGanaB_Anu_0),-2));        
        
    case 3 %Difusa
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN------------------------------------------------          
        axes(handles.C_OptAnu); 
        plot(Radiacion_Dd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Radiación difusa (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt. anu.', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
        
            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Ddm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Ddm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Ddm0),-2));
            %Inclinación óptima anual
            set(handles.COptAnu_min,'String', roundn(min(Radiacion_Dd_Optima),-2));
            set(handles.COptAnu_med,'String', roundn(mean(Radiacion_Dd_Optima),-2));     
            set(handles.COptAnu_max,'String', roundn(max(Radiacion_Dd_Optima),-2));

        %Gráfica de las GANANCIAS------------------------------------------
        axes(handles.C_GanaOptAnu);
        bar(PorGanaD_Anu_0);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptAnu,'Xlim',[0 13]);
            title('Ganancias de radiación difusa para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º','location','BestOutside');

                   grid off;
                   set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima anual_0
            set(handles.CGanaOptAnu_min,'String', roundn(min(PorGanaD_Anu_0),-2));
            set(handles.CGanaOptAnu_med,'String', roundn(mean(PorGanaD_Anu_0),-2)); 
            set(handles.CGanaOptAnu_max,'String', roundn(max(PorGanaD_Anu_0),-2));         
        
        
    case 4 %Albedo
        
        %warndlg('Las ganancias de albedo respecto al plano horizontal no se pueden calcular, ya que Rdm(0º) = 0','Aviso');
        
        %Hacer visible el panel de los valores     
        set(handles.Valores_Rad,'Visible','on'); 
        set(handles.Valores_Gan,'Visible','on'); 
       
        %Graficar RADIACIÓN------------------------------------------------     
        axes(handles.C_OptAnu); 
        plot(Radiacion_Rd_Optima,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Radiación de albedo (kWh/m²/día)','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Ópt. anu.', '0º','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 

            %Valores mínimos, máximos y medios
            %Plano horizontal
            set(handles.C0_min,'String', roundn(min(Val_Rdm0),-2));
            set(handles.C0_med,'String', roundn(mean(Val_Rdm0),-2));
            set(handles.C0_max,'String', roundn(max(Val_Rdm0),-2));
            %Inclinación óptima anual
            set(handles.COptAnu_min,'String', roundn(min(Radiacion_Rd_Optima),-2));
            set(handles.COptAnu_med,'String', roundn(mean(Radiacion_Rd_Optima),-2));            
            set(handles.COptAnu_max,'String', roundn(max(Radiacion_Rd_Optima),-2));
        
        %Gráfica de las GANANCIAS------------------------------------------
        axes(handles.C_GanaOptAnu);
        bar(PorGanaR_Anu_0);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptAnu,'Xlim',[0 13]);
            title('Ganancias de radiación de albedo para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            %legend('Respecto al plano horizontal','location','Best');

                   grid off;
                   set(handles.Rejilla2,'Value',0); 

            %Valores mínimos, máximos y medios
            %Óptima anual_0
            set(handles.CGanaOptAnu_min,'String', '-');
            set(handles.CGanaOptAnu_med,'String', '-') ;
            set(handles.CGanaOptAnu_max,'String', '-')  ;         
        
        
    case 5 %Todos  
        %Hacer invisible el panel de los valores
        set(handles.Valores_Rad,'Visible','off');
        set(handles.Valores_Gan,'Visible','off'); 
        
        %Graficar RADIACIÓN------------------------------------------------    
        axes(handles.C_OptAnu); 
        plot(Radiacion_optima,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(datos,'Color',[.1 .4 .5],'LineWidth',2.5);
        hold on;
        plot(Radiacion_Bd_Optima,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Val_Bdm0,'Color',[1 .6 .6],'LineWidth',2.5);
        hold on;
        plot(Radiacion_Dd_Optima,'Color',[.7 .8 .1],'LineWidth',2.5);
        hold on;
        plot(Val_Ddm0,'Color',[0 .7 .3],'LineWidth',2.5);
        hold on;
        plot(Radiacion_Rd_Optima,'Color',[1 .6 0],'LineWidth',2.5);
        hold on;
        plot(Val_Rdm0,'Color',[.5 .3 0],'LineWidth',2.5);
        hold off;
        %Propiedades
           set(handles.C_OptAnu,'Xlim',[1 12]);
           title('Todas las componentes de la radiación','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
           xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
           legend('Gdm(ópt)', 'Gdm(0º)','Bdm(ópt)', 'Bdm(0º)','Ddm(ópt)', 'Ddm(0º)','Rdm(ópt)', 'Rdm(0º)','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);

           
        %Gráfica de las GANANCIAS------------------------------------------ 
        %Creamos la matriz a graficar
        Ganancias_Anu_0 = zeros(12,4);
            for i=1:12
                Ganancias_Anu_0(i,1) = PorGanaG_Anu_0(i);
                Ganancias_Anu_0(i,2) = PorGanaB_Anu_0(i);
                Ganancias_Anu_0(i,3) = PorGanaD_Anu_0(i);
                Ganancias_Anu_0(i,4) = PorGanaR_Anu_0(i);
            end
            
        %Graficamos
        axes(handles.C_GanaOptAnu);
        bar(Ganancias_Anu_0);
        colormap summer;

            %Propiedades
            set(handles.C_GanaOptAnu,'Xlim',[0 13]);
            title('Ganancias de todas las componentes para la inclinación óptima anual','FontName','Cordia New','FontWeight','bold','FontSize',16,'Color',[0 0 0]);
            xlabel('Meses','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            ylabel('Ganancias (%)','FontName','Cordia New','FontSize',15,'Color',[0 0 0]);
            legend('0º- G','0º- B','0º- D','0º- R','location','BestOutside');

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

Tabla_OptAnual;
close ('OrientSol 3.0 - Gráficas para inclinación óptima anual');


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.C_OptAnu,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_OptAnu,'xgrid','off','ygrid','off');
        
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
        
        set(handles.C_GanaOptAnu,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.C_GanaOptAnu,'xgrid','off','ygrid','off');
        
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
