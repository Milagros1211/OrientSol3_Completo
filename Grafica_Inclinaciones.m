function varargout = Grafica_Inclinaciones(varargin)
% GRAFICA_INCLINACIONES MATLAB code for Grafica_Inclinaciones.fig
%      GRAFICA_INCLINACIONES, by itself, creates a new GRAFICA_INCLINACIONES or raises the existing
%      singleton*.
%
%      H = GRAFICA_INCLINACIONES returns the handle to a new GRAFICA_INCLINACIONES or the handle to
%      the existing singleton*.
%
%      GRAFICA_INCLINACIONES('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in GRAFICA_INCLINACIONES.M with the given input arguments.
%
%      GRAFICA_INCLINACIONES('Property','Value',...) creates a new GRAFICA_INCLINACIONES or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Grafica_Inclinaciones_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Grafica_Inclinaciones_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Grafica_Inclinaciones

% Last Modified by GUIDE v2.5 27-Dec-2014 10:32:47

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Grafica_Inclinaciones_OpeningFcn, ...
                   'gui_OutputFcn',  @Grafica_Inclinaciones_OutputFcn, ...
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


% --- Executes just before Grafica_Inclinaciones is made visible.
function Grafica_Inclinaciones_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Grafica_Inclinaciones (see VARARGIN)

global Media_GdBeta;

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Mostrar el logotipo
axes(handles.logotipo);
imagen_tit1=imread('Titulo.png');
imagen1_tit1=imresize(imagen_tit1,[30 153]); %Para ajustarlo directamente
imshow(imagen1_tit1);
axis off; 

axes(handles.CGrafica);

plot(Media_GdBeta,'Color',[.5 .8 .9],'LineWidth',2.5);

     %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Gdm','location','BestOutside');
           
           
           grid on;
           set(handles.Rejilla,'Value',1); 
    
    

% Choose default command line output for Grafica_Inclinaciones
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Grafica_Inclinaciones wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Grafica_Inclinaciones_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)

global Media_GdBeta Media_BdBeta Media_DdBeta Media_RdBeta;

Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1 %Global
        
       axes(handles.CGrafica);
       plot(Media_GdBeta,'Color',[.5 .8 .9],'LineWidth',2.5); 
       
       %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Gdm','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
     
       
        
    case 2 %Directa
        
        axes(handles.CGrafica);
        plot(Media_BdBeta,'Color',[1 .2 .2],'LineWidth',2.5);
        
        %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Bdm','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1); 
        
    case 3 %Difusa
     
        axes(handles.CGrafica);
        plot(Media_DdBeta,'Color',[.7 .9 .1],'LineWidth',2.5);
        grid on;
        set(handles.Rejilla,'Value',1);
       
        %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Ddm','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);
        
        
        
    case 4 %Albedo
   
        axes(handles.CGrafica);
        plot(Media_RdBeta,'Color',[1 .6 0],'LineWidth',2.5);
        grid on;
        set(handles.Rejilla,'Value',1);
        
        %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Rdm','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);
        
    case 5 %Todos  
        
        axes(handles.CGrafica);
        plot(Media_GdBeta,'Color',[.5 .8 .9],'LineWidth',2.5);
        hold on;
        plot(Media_BdBeta,'Color',[1 .2 .2],'LineWidth',2.5);
        hold on;
        plot(Media_DdBeta,'Color',[.7 .9 .1],'LineWidth',2.5);
        hold on;
        plot(Media_RdBeta,'Color',[1 .6 0],'LineWidth',2.5);
        grid on;
        set(handles.Rejilla,'Value',1);
        hold off;
        
        %Propiedades
           set(handles.CGrafica,'Xlim',[0 90]);
           title('Evolución de la radiación en función de la inclinación','FontName','Cordia New','FontWeight','bold','FontSize',20,'Color',[0 0 0]);
           xlabel('Inclinación (º)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           ylabel('Radiación (kWh/m²/día)','FontName','Cordia New','FontSize',18,'Color',[0 0 0]);
           legend('Gdm','Bdm', 'Ddm','Rdm','location','BestOutside');
           
           grid on;
           set(handles.Rejilla,'Value',1);
        
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


% --- Executes on button press in Rejilla.
function Rejilla_Callback(hObject, eventdata, handles)


caso = get(handles.Rejilla,'Value');

switch caso
    
    case 1
        
        set(handles.CGrafica,'xgrid','on','ygrid','on');
        
    otherwise
        
        set(handles.CGrafica,'xgrid','off','ygrid','off');
        
end

% hObject    handle to Rejilla (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Rejilla
guidata(hObject, handles);


% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Tabla_OptAnual_IncliX;
close ('OrientSol 3.0 - Variación de la radiación con el ángulo de inclinación');
% hObject    handle to Volver (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --------------------------------------------------------------------
function Guardar_ClickedCallback(hObject, eventdata, handles)

[nombre,ruta] = uiputfile({'*.bmp','BMP (*.bmp)'},'Guardar Gráfica');
if nombre==0
     return
end


saveas(gcf,[ruta nombre]);

msgbox('Imagen guardada en el directorio deseado');
