function [GanaR_Hor_0, GanaR_Hor_Anu, GanaR_Hor_Est, GanaR_Hor_Pol, GanaR_Hor_Azi, PorGanaR_Hor_0, PorGanaR_Hor_Anu, PorGanaR_Hor_Est, PorGanaR_Hor_Pol, PorGanaR_Hor_Azi] = Ganancias_Rd_Horizontal(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Hor_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto al plano horizontal. 
    %Ganancia EjeHorizontal_0 = Rdm (Seg. Eje Horizontal) / Rdm (0)
    
    GanaR_Hor_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_Hor_0(i)= RdEjeHorizontal(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Hor_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_0 (%) = ((Rdm (Seg. Eje Horizontal) / Rdm (0))-1)*100
    
    PorGanaR_Hor_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Hor_0(j)= (GanaR_Hor_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Hor_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima anual. 
    %Ganancia EjeHorizontal_Anu = Rdm (Seg. Eje Horizontal) / Rdm (Inc Opt Anual)
    
    GanaR_Hor_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaR_Hor_Anu(i)= RdEjeHorizontal(i) / Radiacion_Rd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Hor_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Anu (%) = ((Rdm (Seg. Eje Horizontal) / Rdm (Inc Opt Anual))-1)*100
    
    PorGanaR_Hor_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Hor_Anu(j)= (GanaR_Hor_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las RdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaR_Hor_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima estacional. 
    %Ganancia EjeHorizontal_Est = Rdm (Seg. Eje Horizontal) / Rdm (Inc Opt Estacional)
    
    GanaR_Hor_Est = zeros(1,12);
    
    for i=1:12
    
        GanaR_Hor_Est(i)= RdEjeHorizontal(i) / RadiacionR_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Hor_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Est (%) = ((Rdm (Seg. Eje Horizontal) / Rdm (Inc Opt Estacional))-1)*100
    
    PorGanaR_Hor_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Hor_Est(j)= (GanaR_Hor_Est(j)-1)*100;
    
    end    
    

%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Hor_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje polar 
    %Ganancia EjeHorizontal_Pol = Rdm (Seg. Eje Horizontal) / Rdm (Seg. Eje Polar)
    
    GanaR_Hor_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaR_Hor_Pol(i)= RdEjeHorizontal(i) / RdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Hor_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Pol (%) = ((Rdm (Seg. Eje Horizontal) / Rdm (Seg. Eje Polar))-1)*100
    
    PorGanaR_Hor_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Hor_Pol(j)= (GanaR_Hor_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Hor_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje azimutal
    %Ganancia EjeHorizontal_Azi = Rdm (Seg. Eje Horizontal) / Rdm (Seg. Eje Azimutal)
    
    GanaR_Hor_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaR_Hor_Azi(i)= RdEjeHorizontal(i) / RdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Hor_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Azi (%) = ((Rdm (Seg. Eje Horizontal) / Rdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaR_Hor_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Hor_Azi(j)= (GanaR_Hor_Azi(j)-1)*100;
    
    end


end

