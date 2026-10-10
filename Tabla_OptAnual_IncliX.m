
function varargout = Tabla_OptAnual_IncliX(varargin)
% TABLA_OPTANUAL_INCLIX MATLAB code for Tabla_OptAnual_IncliX.fig
%      TABLA_OPTANUAL_INCLIX, by itself, creates a new TABLA_OPTANUAL_INCLIX or raises the existing
%      singleton*.
%
%      H = TABLA_OPTANUAL_INCLIX returns the handle to a new TABLA_OPTANUAL_INCLIX or the handle to
%      the existing singleton*.
%
%      TABLA_OPTANUAL_INCLIX('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in TABLA_OPTANUAL_INCLIX.M with the given input arguments.
%
%      TABLA_OPTANUAL_INCLIX('Property','Value',...) creates a new TABLA_OPTANUAL_INCLIX or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before Tabla_OptAnual_IncliX_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to Tabla_OptAnual_IncliX_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help Tabla_OptAnual_IncliX

% Last Modified by GUIDE v2.5 26-Dec-2014 19:12:29

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @Tabla_OptAnual_IncliX_OpeningFcn, ...
                   'gui_OutputFcn',  @Tabla_OptAnual_IncliX_OutputFcn, ...
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


% --- Executes just before Tabla_OptAnual_IncliX is made visible.
function Tabla_OptAnual_IncliX_OpeningFcn(hObject, eventdata, handles, varargin)

global DATOS
%global Val_Bdm0 Val_Ddm0 
%global BdBetaTotal media_Bd Radiacion_Bd_Optima media_Bd_optimo;
%global DdBetaTotal media_Dd Radiacion_Dd_Optima media_Dd_optimo;
%global RdBetaTotal media_Rd Radiacion_Rd_Optima media_Rd_optimo;

%Centrar la ventana en la pantalla
movegui(hObject,'center');

%Poner imagen de inclinaciones
axes(handles.inclinaciones);

imagen_ang=imread('Inclinaciones.png');
imagen1_ang=imresize(imagen_ang,[495 512]); %Para ajustarlo directamente
imshow(imagen1_ang);
axis off;

%Obtener el valor seleccionado por el usuario
X = get(handles.Ang_X,'String');

%Mostrar los resultados----------------------------------------------------
%Mostrar valores para inclinación de 0º
set(handles.Componente_0,'String','Gdm (0 º)');

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
    
    
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to Tabla_OptAnual_IncliX (see VARARGIN)

% Choose default command line output for Tabla_OptAnual_IncliX
handles.output = hObject;

% Update handles structure
guidata(hObject, handles);

% UIWAIT makes Tabla_OptAnual_IncliX wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = Tabla_OptAnual_IncliX_OutputFcn(hObject, eventdata, handles) 
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;



function Ang_X_Callback(hObject, eventdata, handles)


global DATOS GdBetaTotal;
global Val_Bdm0 BdBetaTotal;
global Val_Ddm0 DdBetaTotal;
global RdBetaTotal;

Componente = get(handles.Componente,'Value');

switch Componente 
    
    case 1
        
          
    
    case 2 %Global
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs);  
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación global media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Gdm (0 º)');
        set(handles.Componente_X,'String','Gdm ángulo escogido');
        
        %Mostrar los resultados--------------------------------------------
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
        
       %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(GdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(GdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(GdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(GdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(GdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(GdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(GdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(GdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(GdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(GdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(GdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(GdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(GdBetaTotal(:,X)),-2));
        
        end
    case 3 %Directa
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs);  
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación directa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Bdm (0 º)');
        set(handles.Componente_X,'String','Bdm ángulo escogido');
        
        %Mostrar los resultados----------------------------------------------------
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


            set(handles.C0_media,'String',roundn(mean(Val_Bdm0),-2));

        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(BdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(BdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(BdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(BdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(BdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(BdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(BdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(BdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(BdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(BdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(BdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(BdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(BdBetaTotal(:,X)),-2));    
            
        end
                        
    case 4 %Difusa
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs);   
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación difusa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Ddm (0 º)');
        set(handles.Componente_X,'String','Ddm ángulo escogido');        
        
        %Mostrar los resultados----------------------------------------------------
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


            set(handles.C0_media,'String',roundn(mean(Val_Ddm0),-2));
            
        
        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(DdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(DdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(DdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(DdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(DdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(DdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(DdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(DdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(DdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(DdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(DdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(DdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(DdBetaTotal(:,X)),-2));
        end
        
    case 5 %Albedo
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_X,'String','Rdm ángulo escogido');
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs); 
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        %Mostrar los resultados--------------------------------------------
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
        
        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(RdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(RdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(RdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(RdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(RdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(RdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(RdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(RdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(RdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(RdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(RdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(RdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(RdBetaTotal(:,X)),-2));
            
        end
end



% hObject    handle to Ang_X (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% Hints: get(hObject,'String') returns contents of Ang_X as text
%        str2double(get(hObject,'String')) returns contents of Ang_X as a double
guidata(hObject, handles);

% --- Executes during object creation, after setting all properties.
function Ang_X_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Ang_X (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called
% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on selection change in Componente.
function Componente_Callback(hObject, eventdata, handles)


global DATOS GdBetaTotal;
global Val_Bdm0 BdBetaTotal;
global Val_Ddm0 DdBetaTotal;
global RdBetaTotal;


Componente = get(handles.Componente,'Value');


switch Componente 
    
    case 1
        
          
    
    case 2 %Global
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs); 
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación global media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Gdm (0 º)');
        set(handles.Componente_X,'String','Gdm ángulo escogido');
        
        %Mostrar los resultados--------------------------------------------
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
        
       %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(GdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(GdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(GdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(GdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(GdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(GdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(GdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(GdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(GdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(GdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(GdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(GdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(GdBetaTotal(:,X)),-2));
            
        end
        
    case 3 %Directa
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs);   
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación directa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Bdm (0 º)');
        set(handles.Componente_X,'String','Bdm ángulo escogido');
        
        %Mostrar los resultados----------------------------------------------------
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


            set(handles.C0_media,'String',roundn(mean(Val_Bdm0),-2));

        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(BdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(BdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(BdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(BdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(BdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(BdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(BdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(BdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(BdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(BdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(BdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(BdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(BdBetaTotal(:,X)),-2));  
            
        end
                        
    case 4 %Difusa
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs);  
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        set(handles.titulo,'String','Radiación difusa media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Ddm (0 º)');
        set(handles.Componente_X,'String','Ddm ángulo escogido');        
        
        %Mostrar los resultados----------------------------------------------------
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


            set(handles.C0_media,'String',roundn(mean(Val_Ddm0),-2));
            
        
        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(DdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(DdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(DdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(DdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(DdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(DdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(DdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(DdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(DdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(DdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(DdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(DdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(DdBetaTotal(:,X)),-2));
        end
        
    case 5 %Albedo
        
        set(handles.titulo,'String','Radiación de albedo media mensual (kWh/m²/día)');
        set(handles.Componente_0,'String','Rdm (0 º)');
        set(handles.Componente_X,'String','Rdm ángulo escogido');
        
        %Se lee el ángulo deseado por el usuario
        xs = get(handles.Ang_X,'String');
        X = str2double(xs); 
        
        if X>90 || X<1
        
            warndlg('Debe ser un valor comprendido entre 1 y 90', 'Aviso');
            
        else
        
        %Mostrar los resultados--------------------------------------------
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
        
        %Mostrar valores para inclinación de Xº, seleccionada por el usuario
            set(handles.CX_ene,'String', roundn(RdBetaTotal(1,X),-2));
            set(handles.CX_feb,'String', roundn(RdBetaTotal(2,X),-2));
            set(handles.CX_mar,'String', roundn(RdBetaTotal(3,X),-2));
            set(handles.CX_abr,'String', roundn(RdBetaTotal(4,X),-2));
            set(handles.CX_may,'String', roundn(RdBetaTotal(5,X),-2));
            set(handles.CX_jun,'String', roundn(RdBetaTotal(6,X),-2));
            set(handles.CX_jul,'String', roundn(RdBetaTotal(7,X),-2));
            set(handles.CX_ago,'String', roundn(RdBetaTotal(8,X),-2));
            set(handles.CX_sep,'String', roundn(RdBetaTotal(9,X),-2));
            set(handles.CX_oct,'String', roundn(RdBetaTotal(10,X),-2));
            set(handles.CX_nov,'String', roundn(RdBetaTotal(11,X),-2));
            set(handles.CX_dic,'String', roundn(RdBetaTotal(12,X),-2));


            set(handles.CX_media,'String', roundn (mean(RdBetaTotal(:,X)),-2));
            
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


% --- Executes on button press in Grafica.
function Grafica_Callback(hObject, eventdata, handles)

global DATOS GdBetaTotal;
global Val_Bdm0 BdBetaTotal;
global Val_Ddm0 DdBetaTotal;
global RdBetaTotal;

global Media_GdBeta Media_BdBeta Media_DdBeta Media_RdBeta;


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
    
Grafica_Inclinaciones;   
% hObject    handle to Grafica (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
guidata(hObject, handles);

% --- Executes on button press in Volver.
function Volver_Callback(hObject, eventdata, handles)

Tabla_OptAnual;
close ('Inclinación óptima anual para el ángulo seleccionado');
% hObject    handle to Volver (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
