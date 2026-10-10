function [GanaB_Hor_0, GanaB_Hor_Anu, GanaB_Hor_Est, GanaB_Hor_Pol, GanaB_Hor_Azi, PorGanaB_Hor_0, PorGanaB_Hor_Anu, PorGanaB_Hor_Est, PorGanaB_Hor_Pol, PorGanaB_Hor_Azi] = Ganancias_Bd_Horizontal(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Hor_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto al plano horizontal. 
    %Ganancia EjeHorizontal_0 = Bdm (Seg. Eje Horizontal) / Bdm (0)
    
    GanaB_Hor_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_Hor_0(i)= BdEjeHorizontal(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Hor_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_0 (%) = ((Bdm (Seg. Eje Horizontal) / Bdm (0))-1)*100
    
    PorGanaB_Hor_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Hor_0(j)= (GanaB_Hor_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Hor_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima anual. 
    %Ganancia EjeHorizontal_Anu = Bdm (Seg. Eje Horizontal) / Bdm (Inc Opt Anual)
    
    GanaB_Hor_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaB_Hor_Anu(i)= BdEjeHorizontal(i) / Radiacion_Bd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Hor_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Anu (%) = ((Bdm (Seg. Eje Horizontal) / Bdm (Inc Opt Anual))-1)*100
    
    PorGanaB_Hor_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Hor_Anu(j)= (GanaB_Hor_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las BdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaB_Hor_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima estacional. 
    %Ganancia EjeHorizontal_Est = Bdm (Seg. Eje Horizontal) / Bdm (Inc Opt Estacional)
    
    GanaB_Hor_Est = zeros(1,12);
    
    for i=1:12
    
        GanaB_Hor_Est(i)= BdEjeHorizontal(i) / RadiacionB_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Hor_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Est (%) = ((Bdm (Seg. Eje Horizontal) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaB_Hor_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Hor_Est(j)= (GanaB_Hor_Est(j)-1)*100;
    
    end    
    

%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Hor_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje polar 
    %Ganancia EjeHorizontal_Pol = Bdm (Seg. Eje Horizontal) / Bdm (Seg. Eje Polar)
    
    GanaB_Hor_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaB_Hor_Pol(i)= BdEjeHorizontal(i) / BdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Hor_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Pol (%) = ((Bdm (Seg. Eje Horizontal) / Bdm (Seg. Eje Polar))-1)*100
    
    PorGanaB_Hor_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Hor_Pol(j)= (GanaB_Hor_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Hor_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje azimutal
    %Ganancia EjeHorizontal_Azi = Bdm (Seg. Eje Horizontal) / Bdm (Seg. Eje Azimutal)
    
    GanaB_Hor_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaB_Hor_Azi(i)= BdEjeHorizontal(i) / BdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Hor_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Azi (%) = ((Bdm (Seg. Eje Horizontal) / Bdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaB_Hor_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Hor_Azi(j)= (GanaB_Hor_Azi(j)-1)*100;
    
    end
end

