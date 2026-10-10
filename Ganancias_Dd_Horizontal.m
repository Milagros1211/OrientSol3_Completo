function [GanaD_Hor_0, GanaD_Hor_Anu, GanaD_Hor_Est, GanaD_Hor_Pol, GanaD_Hor_Azi, PorGanaD_Hor_0, PorGanaD_Hor_Anu, PorGanaD_Hor_Est, PorGanaD_Hor_Pol, PorGanaD_Hor_Azi] = Ganancias_Dd_Horizontal(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Hor_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto al plano horizontal. 
    %Ganancia EjeHorizontal_0 = Ddm (Seg. Eje Horizontal) / Ddm (0)
    
    GanaD_Hor_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_Hor_0(i)= DdEjeHorizontal(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Hor_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_0 (%) = ((Ddm (Seg. Eje Horizontal) / Ddm (0))-1)*100
    
    PorGanaD_Hor_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Hor_0(j)= (GanaD_Hor_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Hor_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima anual. 
    %Ganancia EjeHorizontal_Anu = Ddm (Seg. Eje Horizontal) / Ddm (Inc Opt Anual)
    
    GanaD_Hor_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaD_Hor_Anu(i)= DdEjeHorizontal(i) / Radiacion_Dd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Hor_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Anu (%) = ((Ddm (Seg. Eje Horizontal) / Ddm (Inc Opt Anual))-1)*100
    
    PorGanaD_Hor_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Hor_Anu(j)= (GanaD_Hor_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaD_Hor_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima estacional. 
    %Ganancia EjeHorizontal_Est = Ddm (Seg. Eje Horizontal) / Ddm (Inc Opt Estacional)
    
    GanaD_Hor_Est = zeros(1,12);
    
    for i=1:12
    
        GanaD_Hor_Est(i)= DdEjeHorizontal(i) / RadiacionD_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Hor_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Est (%) = ((Ddm (Seg. Eje Horizontal) / Ddm (Inc Opt Estacional))-1)*100
    
    PorGanaD_Hor_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Hor_Est(j)= (GanaD_Hor_Est(j)-1)*100;
    
    end    
    

%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Hor_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje polar 
    %Ganancia EjeHorizontal_Pol = Ddm (Seg. Eje Horizontal) / Ddm (Seg. Eje Polar)
    
    GanaD_Hor_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaD_Hor_Pol(i)= DdEjeHorizontal(i) / DdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Hor_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Pol (%) = ((Ddm (Seg. Eje Horizontal) / Ddm (Seg. Eje Polar))-1)*100
    
    PorGanaD_Hor_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Hor_Pol(j)= (GanaD_Hor_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Hor_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje azimutal
    %Ganancia EjeHorizontal_Azi = Ddm (Seg. Eje Horizontal) / Ddm (Seg. Eje Azimutal)
    
    GanaD_Hor_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaD_Hor_Azi(i)= DdEjeHorizontal(i) / DdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Hor_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Azi (%) = ((Ddm (Seg. Eje Horizontal) / Ddm (Seg. Eje Azimutal))-1)*100
    
    PorGanaD_Hor_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Hor_Azi(j)= (GanaD_Hor_Azi(j)-1)*100;
    
    end


end

